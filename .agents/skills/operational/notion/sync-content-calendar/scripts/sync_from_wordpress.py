#!/usr/bin/env python3
"""Review WordPress publishes and offer to update the Agency tasks Notion calendar."""

from __future__ import annotations

import argparse
import base64
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from difflib import SequenceMatcher
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
REPO_ROOT = SKILL_DIR.parents[4]
CONFIG_PATH = SKILL_DIR / "config" / "content-calendar.json"
NOTION_VERSION = "2026-03-11"

URL_PROPERTY_CANDIDATES = (
    "Post URL",
    "Final URL",
    "Live URL",
    "Published URL",
    "Publish URL",
    "URL",
    "Link",
)

PUBLISHED_STATUS_CANDIDATES = (
    "Published",
    "Live",
    "Shipped",
    "Done",
)


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    env_path = REPO_ROOT / ".env"
    if not env_path.exists():
        return env
    for line in env_path.read_bytes().decode("utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def notion_page_url(page_id: str) -> str:
    """Direct link to a Notion page row."""
    clean = (page_id or "").replace("-", "")
    return f"https://app.notion.com/p/{clean}" if clean else ""


def normalize_title(value: str) -> str:
    text = urllib.parse.unquote(value or "")
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("&nbsp;", " ").replace("&#8217;", "'").replace("&amp;", "&")
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def notion_request(secret: str, method: str, path: str, body: dict | None = None) -> dict:
    headers = {
        "Authorization": f"Bearer {secret}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"https://api.notion.com/v1{path}", data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"Notion {method} {path} failed ({exc.code}): {detail}") from exc


def wp_request(env: dict[str, str], path: str) -> dict | list:
    base = env["WORDPRESS_BASE_URL"].rstrip("/")
    auth = base64.b64encode(
        f"{env['WORDPRESS_USERNAME']}:{env['WORDPRESS_APPLICATION_PASSWORD']}".encode()
    ).decode()
    headers = {"Authorization": f"Basic {auth}", "User-Agent": "curl/8.0"}
    req = urllib.request.Request(base + path, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"WordPress GET {path} failed ({exc.code}): {detail}") from exc


def page_title(props: dict) -> str:
    for value in props.values():
        if value.get("type") == "title":
            return "".join(part.get("plain_text", "") for part in value.get("title", []))
    return ""


def detect_url_property(properties: dict, configured: str | None) -> str:
    if configured:
        if configured not in properties:
            raise RuntimeError(f"Configured url_property {configured!r} not found in database schema")
        if properties[configured].get("type") != "url":
            raise RuntimeError(f"Property {configured!r} is not a url field")
        return configured
    for name in URL_PROPERTY_CANDIDATES:
        meta = properties.get(name)
        if meta and meta.get("type") == "url":
            return name
    for name, meta in properties.items():
        if meta.get("type") == "url":
            return name
    raise RuntimeError("Could not auto-detect a url property; set url_property in content-calendar.json")


def detect_published_status(properties: dict, status_property: str, configured: str | None) -> str:
    if configured:
        return configured
    meta = properties.get(status_property)
    if not meta or meta.get("type") != "status":
        raise RuntimeError(f"Property {status_property!r} is not a status field")
    options = [opt["name"] for opt in meta.get("status", {}).get("options", [])]
    for candidate in PUBLISHED_STATUS_CANDIDATES:
        if candidate in options:
            return candidate
    for option in options:
        if re.search(r"publish", option, re.I):
            return option
    raise RuntimeError(
        f"Could not auto-detect published status value from {status_property} options: {options}"
    )


def discover_schema(secret: str, cfg: dict) -> None:
    db_id = cfg["database_id"]
    db = notion_request(secret, "GET", f"/databases/{db_id}")
    title = "".join(part.get("plain_text", "") for part in db.get("title", []))
    props = db.get("properties", {})
    print(f"Database: {title!r} ({db_id})")
    print("\nProperties:")
    for name, meta in sorted(props.items()):
        kind = meta.get("type")
        extra = ""
        if kind == "status":
            opts = [o["name"] for o in meta.get("status", {}).get("options", [])]
            extra = f" options={opts}"
        elif kind == "select":
            opts = [o["name"] for o in meta.get("select", {}).get("options", [])]
            extra = f" options={opts}"
        print(f"  {name}: {kind}{extra}")
    url_prop = detect_url_property(props, cfg.get("url_property"))
    published = detect_published_status(props, cfg["status_property"], cfg.get("published_status_value"))
    print(f"\nResolved mapping:")
    print(f"  status_property: {cfg['status_property']}")
    print(f"  url_property: {url_prop}")
    print(f"  published_status_value: {published}")


def query_all_rows(secret: str, db_id: str) -> list[dict]:
    rows: list[dict] = []
    cursor = None
    while True:
        body: dict = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        result = notion_request(secret, "POST", f"/databases/{db_id}/query", body)
        rows.extend(result.get("results", []))
        if not result.get("has_more"):
            break
        cursor = result.get("next_cursor")
    return rows


def best_title_match(rows: list[dict], target_title: str, threshold: float) -> tuple[dict | None, list[tuple[float, str, str]]]:
    target = normalize_title(target_title)
    scored: list[tuple[float, str, str]] = []
    for row in rows:
        title = page_title(row.get("properties", {}))
        norm = normalize_title(title)
        if not norm:
            continue
        if norm == target:
            return row, [(1.0, title, row["id"])]
        ratio = SequenceMatcher(None, norm, target).ratio()
        scored.append((ratio, title, row["id"]))
    scored.sort(reverse=True)
    if scored and scored[0][0] >= threshold:
        best_id = scored[0][2]
        for row in rows:
            if row["id"] == best_id:
                return row, scored[:5]
    return None, scored[:5]


def get_row_status(props: dict, status_property: str) -> str:
    meta = props.get(status_property, {})
    if meta.get("type") == "status":
        return (meta.get("status") or {}).get("name", "")
    if meta.get("type") == "select":
        return (meta.get("select") or {}).get("name", "")
    return ""


def get_row_url(props: dict, url_property: str) -> str:
    return (props.get(url_property) or {}).get("url") or ""


def normalize_url(url: str) -> str:
    return (url or "").strip().rstrip("/").lower()


def resolve_schema(secret: str, cfg: dict) -> dict:
    db_id = cfg["database_id"]
    db = notion_request(secret, "GET", f"/databases/{db_id}")
    props = db.get("properties", {})
    status_property = cfg["status_property"]
    return {
        "database_title": "".join(part.get("plain_text", "") for part in db.get("title", [])),
        "status_property": status_property,
        "url_property": detect_url_property(props, cfg.get("url_property")),
        "published_status": detect_published_status(props, status_property, cfg.get("published_status_value")),
    }


def is_already_synced(
    current_status: str,
    published_status: str,
    current_url: str,
    live_url: str,
) -> bool:
    return current_status == published_status and normalize_url(current_url) == normalize_url(live_url)


def classify_wp_post(
    post: dict,
    rows: list[dict],
    schema: dict,
    threshold: float,
) -> dict:
    wp_title = post.get("title", {}).get("rendered") or post.get("title") or ""
    live_url = post.get("link") or ""
    base = {
        "wp_title": wp_title,
        "wp_url": live_url,
        "wp_type": post.get("post_type"),
        "wp_id": post.get("id"),
        "wp_modified": post.get("modified"),
        "wp_date": post.get("date"),
    }

    matched, candidates = best_title_match(rows, wp_title, threshold)
    if not matched:
        return {**base, "category": "no_match", "candidates": [
            {
                "score": round(score, 3),
                "notion_title": title,
                "notion_page_id": page_id,
                "notion_page_url": notion_page_url(page_id),
            }
            for score, title, page_id in candidates[:3]
        ]}

    if len(candidates) >= 2 and candidates[0][0] - candidates[1][0] < 0.05:
        return {**base, "category": "ambiguous", "candidates": [
            {
                "score": round(score, 3),
                "notion_title": title,
                "notion_page_id": page_id,
                "notion_page_url": notion_page_url(page_id),
            }
            for score, title, page_id in candidates[:5]
        ]}

    props = matched.get("properties", {})
    notion_title = page_title(props)
    notion_page_id = matched["id"]
    current_status = get_row_status(props, schema["status_property"])
    current_url = get_row_url(props, schema["url_property"])
    proposed = {
        schema["status_property"]: {"status": {"name": schema["published_status"]}},
        schema["url_property"]: {"url": live_url or None},
    }

    if is_already_synced(current_status, schema["published_status"], current_url, live_url):
        return {
            **base,
            "category": "already_synced",
            "notion_title": notion_title,
            "notion_page_id": notion_page_id,
            "notion_page_url": notion_page_url(notion_page_id),
            "notion_status": current_status,
            "notion_post_url": current_url,
        }

    return {
        **base,
        "category": "ready",
        "notion_title": notion_title,
        "notion_page_id": notion_page_id,
        "notion_page_url": notion_page_url(notion_page_id),
        "notion_status": current_status,
        "notion_post_url": current_url,
        "proposed_status": schema["published_status"],
        "proposed_url": live_url,
        "notion_properties": proposed,
    }


def build_review_report(
    secret: str,
    env: dict[str, str],
    cfg: dict,
    days: int,
) -> dict:
    post_types = cfg.get("wordpress_post_types") or ["posts"]
    schema = resolve_schema(secret, cfg)
    posts = fetch_wp_published_in_last_days(env, post_types, days)
    rows = query_all_rows(secret, cfg["database_id"])
    threshold = float(cfg.get("title_match_threshold") or 0.88)

    report = {
        "window_days": days,
        "wordpress_published_count": len(posts),
        "schema": {
            "status_property": schema["status_property"],
            "url_property": schema["url_property"],
            "published_status_value": schema["published_status"],
        },
        "ready": [],
        "already_synced": [],
        "no_match": [],
        "ambiguous": [],
    }

    for post in posts:
        item = classify_wp_post(post, rows, schema, threshold)
        report[item["category"]].append(item)

    return report


def _print_item_links(item: dict, *, include_notion: bool = True) -> None:
    wp_url = item.get("wp_url") or ""
    if wp_url:
        print(f"   WordPress: {wp_url}")
    else:
        print("   WordPress: (no public URL)")
    if include_notion and item.get("notion_page_url"):
        print(f"   Notion: {item['notion_page_url']}")


def print_review_report(report: dict) -> None:
    days = report["window_days"]
    print(f"WordPress → Notion content calendar review (published last {days} days)")
    print(f"Published on WordPress: {report['wordpress_published_count']}")
    print(
        f"Ready to update: {len(report['ready'])} | "
        f"Already synced: {len(report['already_synced'])} | "
        f"No match: {len(report['no_match'])} | "
        f"Ambiguous: {len(report['ambiguous'])}"
    )

    if report["ready"]:
        print("\n## Offer to mark published in Notion")
        for i, item in enumerate(report["ready"], 1):
            print(f"{i}. {item['wp_title']}")
            print(
                f"   Change: status {item['notion_status']!r} → {item['proposed_status']!r}; "
                f"Post URL {item.get('notion_post_url') or '(empty)'!r} → {item['proposed_url']!r}"
            )
            _print_item_links(item)

    if report["ambiguous"]:
        print("\n## Needs human pick (ambiguous title match)")
        for item in report["ambiguous"]:
            print(f"- {item['wp_title']}")
            _print_item_links(item, include_notion=False)
            for cand in item.get("candidates", []):
                print(
                    f"    {cand['score']:.2f} {cand['notion_title']!r} — "
                    f"{cand.get('notion_page_url') or notion_page_url(cand.get('notion_page_id', ''))}"
                )

    if report["no_match"]:
        print("\n## Published on WordPress, no calendar row found")
        for item in report["no_match"]:
            print(f"- {item['wp_title']}")
            _print_item_links(item, include_notion=False)
            for cand in item.get("candidates", []):
                print(
                    f"    {cand['score']:.2f} {cand['notion_title']!r} — "
                    f"{cand.get('notion_page_url') or notion_page_url(cand.get('notion_page_id', ''))}"
                )

    if report["already_synced"]:
        print("\n## Already up to date in Notion")
        for item in report["already_synced"]:
            print(f"- {item['wp_title']}")
            _print_item_links(item)


def apply_review_items(secret: str, items: list[dict], dry_run: bool) -> int:
    applied = 0
    for item in items:
        props = item["notion_properties"]
        page_id = item["notion_page_id"]
        print(f"\nApplying: {item['wp_title']!r} → Notion {item['notion_title']!r}")
        update_notion_row(secret, page_id, props, dry_run=dry_run)
        applied += 1
    return applied


def slug_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path.strip("/")
    return path.split("/")[-1] if path else ""


def fetch_wp_by_url(env: dict[str, str], url: str, post_types: list[str]) -> dict:
    slug = slug_from_url(url)
    if not slug:
        raise RuntimeError(f"Could not parse slug from URL: {url}")
    errors: list[str] = []
    for rest_base in post_types:
        try:
            items = wp_request(
                env,
                f"/wp-json/wp/v2/{rest_base}?slug={urllib.parse.quote(slug)}&status=publish&context=view",
            )
        except RuntimeError as exc:
            errors.append(str(exc))
            continue
        if isinstance(items, list) and items:
            post = items[0]
            if post.get("status") != "publish":
                raise RuntimeError(f"WordPress item {rest_base}/{slug} is not published (status={post.get('status')})")
            post["post_type"] = rest_base
            return post
    raise RuntimeError(f"No published WordPress item found for slug {slug!r}. Errors: {errors}")


def fetch_wp_by_id(env: dict[str, str], post_type: str, post_id: int) -> dict:
    post = wp_request(env, f"/wp-json/wp/v2/{post_type}/{post_id}?context=view")
    if post.get("status") != "publish":
        raise RuntimeError(f"WordPress {post_type}/{post_id} is not published (status={post.get('status')})")
    post["post_type"] = post_type
    return post


def fetch_wp_published_in_last_days(env: dict[str, str], post_types: list[str], days: int) -> list[dict]:
    from datetime import datetime, timedelta, timezone

    after = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%S")
    found: list[dict] = []
    seen: set[tuple[str, int]] = set()
    for rest_base in post_types:
        page = 1
        while True:
            path = (
                f"/wp-json/wp/v2/{rest_base}?status=publish&after={after}"
                f"&orderby=date&order=desc&per_page=100&page={page}"
                f"&_fields=id,slug,title,link,status,modified,date,type"
            )
            try:
                items = wp_request(env, path)
            except RuntimeError:
                break
            if not isinstance(items, list) or not items:
                break
            for item in items:
                key = (rest_base, item["id"])
                if key in seen:
                    continue
                seen.add(key)
                item["post_type"] = rest_base
                found.append(item)
            if len(items) < 100:
                break
            page += 1
    return found


def fetch_wp_recent(env: dict[str, str], post_types: list[str], since_days: int) -> list[dict]:
    return fetch_wp_published_in_last_days(env, post_types, since_days)


def build_update_properties(
    status_property: str,
    url_property: str,
    published_status: str,
    live_url: str,
) -> dict:
    return {
        status_property: {"status": {"name": published_status}},
        url_property: {"url": live_url or None},
    }


def update_notion_row(secret: str, page_id: str, properties: dict, dry_run: bool) -> None:
    if dry_run:
        print(f"DRY RUN would PATCH page {page_id}:")
        print(json.dumps({"properties": properties}, indent=2))
        return
    notion_request(secret, "PATCH", f"/pages/{page_id}", {"properties": properties})


def sync_post(
    secret: str,
    env: dict[str, str],
    cfg: dict,
    post: dict,
    rows: list[dict] | None,
    schema: dict | None,
    dry_run: bool,
) -> bool:
    if schema is None:
        schema = resolve_schema(secret, cfg)
    if rows is None:
        rows = query_all_rows(secret, cfg["database_id"])

    threshold = float(cfg.get("title_match_threshold") or 0.88)
    item = classify_wp_post(post, rows, schema, threshold)
    category = item["category"]

    print(f"\nWordPress: {item['wp_title']!r}")
    print(f"  type={item.get('wp_type')} id={item.get('wp_id')} url={item.get('wp_url')}")

    if category == "no_match":
        print("  No Notion match.")
        for cand in item.get("candidates", []):
            print(f"    {cand['score']:.2f} {cand['notion_title']!r}")
        return False

    if category == "ambiguous":
        print("  Ambiguous Notion match — pick a row manually.")
        for cand in item.get("candidates", []):
            print(f"    {cand['score']:.2f} {cand['notion_title']!r} ({cand['notion_page_id']})")
        return False

    if category == "already_synced":
        print(f"  Notion already synced: {item.get('notion_title')!r}")
        return False

    print(f"  Notion match: {item['notion_title']!r} ({item['notion_page_id']})")
    update_notion_row(secret, item["notion_page_id"], item["notion_properties"], dry_run=dry_run)
    if dry_run:
        print("  (dry run — no write)")
    else:
        print("  Updated Notion row.")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--discover-schema", action="store_true", help="Print Notion database schema and resolved property map")
    parser.add_argument("--review", action="store_true", help="Review WordPress publishes and offer Notion updates (default)")
    parser.add_argument("--days", type=int, help="Published-within window in days (default: 30)")
    parser.add_argument("--json", action="store_true", help="Emit review report as JSON")
    parser.add_argument("--apply-ready", action="store_true", help="Apply all ready items from review (dry-run unless --live)")
    parser.add_argument("--url", help="Review/sync a single live WordPress URL")
    parser.add_argument("--wp-id", type=int, help="Review/sync a single WordPress post ID")
    parser.add_argument("--post-type", default="posts", help="WordPress REST base when using --wp-id")
    parser.add_argument("--live", action="store_true", help="Write to Notion (default is dry run)")
    args = parser.parse_args()

    env = load_env()
    cfg = load_config()
    secret = env.get("NOTION_SECRET") or ""
    if not secret:
        print("NOTION_SECRET is missing in repo .env. See .agents/skills/operational/notion/set-up/notion-api.md", file=sys.stderr)
        return 1
    for key in ("WORDPRESS_BASE_URL", "WORDPRESS_USERNAME", "WORDPRESS_APPLICATION_PASSWORD"):
        if not env.get(key):
            print(f"{key} is missing in repo .env", file=sys.stderr)
            return 1

    dry_run = not args.live
    days = args.days or int(cfg.get("default_review_days") or 30)

    if args.discover_schema:
        discover_schema(secret, cfg)
        return 0

    post_types = cfg.get("wordpress_post_types") or ["posts"]

    if args.apply_ready:
        report = build_review_report(secret, env, cfg, days)
        if args.json:
            print(json.dumps(report, indent=2))
            return 0
        count = apply_review_items(secret, report["ready"], dry_run=dry_run)
        print(f"\nApplied {count} ready item(s)" + (" (dry run)" if dry_run else ""))
        if dry_run and count:
            print("Re-run with --apply-ready --live after human confirms.")
        return 0

    if args.url:
        post = fetch_wp_by_url(env, args.url, post_types)
        sync_post(secret, env, cfg, post, rows=None, schema=None, dry_run=dry_run)
        return 0

    if args.wp_id:
        post = fetch_wp_by_id(env, args.post_type, args.wp_id)
        sync_post(secret, env, cfg, post, rows=None, schema=None, dry_run=dry_run)
        return 0

    # Default: on-demand review — scan WordPress publishes, match Notion, offer updates
    report = build_review_report(secret, env, cfg, days)
    if args.json:
        print(json.dumps(report, indent=2))
        return 0
    print_review_report(report)
    if report["ready"]:
        print(
            f"\n{len(report['ready'])} item(s) ready to mark published in Notion. "
            "Confirm with the human, then run:\n"
            f"  python3 .agents/skills/operational/notion/sync-content-calendar/scripts/sync_from_wordpress.py "
            f"--apply-ready --days {days} --live"
        )
    else:
        print("\nNothing to offer for this window.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
