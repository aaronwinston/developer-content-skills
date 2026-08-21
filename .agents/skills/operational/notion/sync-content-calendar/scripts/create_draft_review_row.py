#!/usr/bin/env python3
"""Create an Agency tasks / content calendar row for a draft awaiting review."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
REPO_ROOT = SKILL_DIR.parents[4]
CONFIG_PATH = SKILL_DIR / "config" / "content-calendar.json"
NOTION_VERSION = "2026-03-11"

REVIEW_STATUS_CANDIDATES = ("Review", "In review", "Draft review", "Editorial review")
CONTENT_TYPE_PROPERTY_CANDIDATES = ("Content type", "Type", "Format", "Content format")
CONTENT_TYPE_VALUE_CANDIDATES = ("Blog", "Blog post", "Article")
DOC_URL_PROPERTY_CANDIDATES = (
    "Google Doc",
    "Draft URL",
    "Doc URL",
    "Draft doc",
    "Review doc",
    "Document",
)
SOURCE_URL_PROPERTY_CANDIDATES = ("Source URL", "Source", "X post", "Tweet URL", "Original URL")


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


def detect_title_property(properties: dict) -> str:
    for name, meta in properties.items():
        if meta.get("type") == "title":
            return name
    raise RuntimeError("Database has no title property")


def pick_status_value(properties: dict, status_property: str, configured: str | None) -> str:
    if configured:
        return configured
    meta = properties.get(status_property)
    if not meta or meta.get("type") != "status":
        raise RuntimeError(f"Property {status_property!r} is not a status field")
    options = [opt["name"] for opt in meta.get("status", {}).get("options", [])]
    for candidate in REVIEW_STATUS_CANDIDATES:
        if candidate in options:
            return candidate
    raise RuntimeError(f"Could not find a review status in {status_property} options: {options}")


def pick_named_property(properties: dict, candidates: tuple[str, ...], expected_type: str) -> str | None:
    for name in candidates:
        meta = properties.get(name)
        if meta and meta.get("type") == expected_type:
            return name
    for name, meta in properties.items():
        if meta.get("type") == expected_type:
            return name
    return None


def pick_content_type_value(properties: dict, property_name: str, configured: str | None) -> str:
    if configured:
        return configured
    meta = properties.get(property_name)
    if not meta or meta.get("type") != "select":
        raise RuntimeError(f"Property {property_name!r} is not a select field")
    options = [opt["name"] for opt in meta.get("select", {}).get("options", [])]
    for candidate in CONTENT_TYPE_VALUE_CANDIDATES:
        if candidate in options:
            return candidate
    if options:
        return options[0]
    raise RuntimeError(f"No select options on {property_name!r}")


def build_properties(
    properties: dict,
    cfg: dict,
    *,
    title: str,
    doc_url: str,
    source_url: str | None,
) -> dict[str, dict]:
    aparna = cfg.get("aparna_x_pipeline") or {}
    status_property = cfg["status_property"]
    review_status = pick_status_value(properties, status_property, aparna.get("review_status_value"))

    out: dict[str, dict] = {
        detect_title_property(properties): {"title": [{"text": {"content": title[:2000]}}]},
        status_property: {"status": {"name": review_status}},
    }

    content_type_property = aparna.get("content_type_property")
    if not content_type_property:
        content_type_property = pick_named_property(properties, CONTENT_TYPE_PROPERTY_CANDIDATES, "select")
    if content_type_property:
        value = pick_content_type_value(
            properties,
            content_type_property,
            aparna.get("content_type_value"),
        )
        out[content_type_property] = {"select": {"name": value}}

    doc_property = aparna.get("doc_url_property")
    if not doc_property:
        doc_property = pick_named_property(properties, DOC_URL_PROPERTY_CANDIDATES, "url")
    if doc_property and doc_url:
        out[doc_property] = {"url": doc_url}

    source_property = aparna.get("source_url_property")
    if not source_property:
        source_property = pick_named_property(properties, SOURCE_URL_PROPERTY_CANDIDATES, "url")
    if source_property and source_url:
        out[source_property] = {"url": source_url}

    return out


def create_row(
    secret: str,
    cfg: dict,
    *,
    title: str,
    doc_url: str,
    source_url: str | None,
    dry_run: bool,
) -> dict:
    db_id = cfg["database_id"]
    db = notion_request(secret, "GET", f"/databases/{db_id}")
    properties = db.get("properties", {})
    payload = {
        "parent": {"database_id": db_id},
        "properties": build_properties(
            properties,
            cfg,
            title=title,
            doc_url=doc_url,
            source_url=source_url,
        ),
    }
    if dry_run:
        return {"dry_run": True, "payload": payload}
    page = notion_request(secret, "POST", "/pages", payload)
    return {
        "page_id": page.get("id"),
        "url": page.get("url"),
        "payload": payload,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--title", required=True, help="Calendar row title (draft H1)")
    parser.add_argument("--doc-url", required=True, help="Google Doc URL for editorial review")
    parser.add_argument("--source-url", help="Source X post or article URL")
    parser.add_argument("--dry-run", action="store_true", help="Print payload only; do not create")
    parser.add_argument("--json", action="store_true", help="Emit JSON result")
    args = parser.parse_args()

    env = load_env()
    secret = env.get("NOTION_SECRET")
    if not secret:
        print("NOTION_SECRET is missing in repo .env", file=sys.stderr)
        return 1

    cfg = load_config()
    result = create_row(
        secret,
        cfg,
        title=args.title,
        doc_url=args.doc_url,
        source_url=args.source_url,
        dry_run=args.dry_run,
    )
    if args.json:
        print(json.dumps(result, indent=2))
    elif args.dry_run:
        print(json.dumps(result["payload"], indent=2))
    else:
        print(result.get("url") or result.get("page_id"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
