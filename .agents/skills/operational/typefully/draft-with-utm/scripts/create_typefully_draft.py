#!/usr/bin/env python3
"""Create a Typefully draft with an embedded devrel UTM link."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen

BASE_URL = "https://api.typefully.com/v2"
DEFAULT_SOCIAL_SET_ID = "265880"
DEFAULT_DESTINATION_URL = "https://arize.com"
# Typefully platforms. utm_source is the platform; both are organic social.
PLATFORMS = ("x", "linkedin")
PLATFORM_MEDIUM = {"x": "social", "linkedin": "social"}
UTM_KEYS = {"utm_source", "utm_medium", "utm_campaign", "utm_content"}


def load_repo_env() -> None:
    env_path = Path(__file__).resolve().parents[5] / ".env"
    if not env_path.is_file():
        return
    for raw_line in env_path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def normalize_slug(value: str) -> str:
    """Lowercase, hyphenate, and strip a value into a UTM-safe slug."""
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")


def _git_config(key: str) -> str:
    try:
        result = subprocess.run(
            ["git", "config", key],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return ""
    return result.stdout.strip()


def git_person_slug() -> str:
    """Derive the `first-last` person slug for utm_content from git identity."""
    name = _git_config("user.name")
    slug = normalize_slug(name) if name else ""
    if slug:
        return slug

    email = _git_config("user.email")
    if email and "@" in email:
        slug = normalize_slug(email.split("@", 1)[0])
        if slug:
            return slug

    raise RuntimeError(
        "Could not derive a person from git. Set git config user.name "
        "(or user.email), or pass --content explicitly."
    )


def build_utm_url(destination_url: str, platform: str, content: str) -> str:
    if platform not in PLATFORMS:
        allowed = ", ".join(PLATFORMS)
        raise ValueError(f"platform must be one of: {allowed}")

    parsed = urlsplit(destination_url)
    if not parsed.scheme or not parsed.netloc:
        raise ValueError("destination URL must include scheme and host, for example https://arize.com/blog")

    kept_params = [
        (key, value)
        for key, value in parse_qsl(parsed.query, keep_blank_values=True)
        if key.lower() not in UTM_KEYS
    ]
    utm_params = [
        ("utm_source", platform),
        ("utm_medium", PLATFORM_MEDIUM[platform]),
        ("utm_campaign", "devrel"),
        ("utm_content", content),
    ]
    query = urlencode([*kept_params, *utm_params])
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, query, parsed.fragment))


def read_text_arg(text: str | None, text_file: str | None) -> str:
    if text and text_file:
        raise ValueError("Use either --text or --text-file, not both.")
    if text_file:
        return Path(text_file).read_text()
    if text:
        return text
    raise ValueError("Post text is required via --text or --text-file.")


def embed_url(text: str, utm_url: str) -> str:
    if "{utm_url}" in text:
        return text.replace("{utm_url}", utm_url)
    return f"{text.rstrip()}\n\n{utm_url}"


def build_payload(
    platform: str,
    post_text: str,
    draft_title: str,
    share: bool,
    tags: list[str],
    scratchpad_text: str | None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "platforms": {
            platform: {
                "enabled": True,
                "posts": [{"text": post_text}],
            }
        },
        "draft_title": draft_title,
        "share": share,
    }
    if tags:
        payload["tags"] = tags
    if scratchpad_text:
        payload["scratchpad_text"] = scratchpad_text
    return payload


def post_draft(social_set_id: str, api_key: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        f"{BASE_URL}/social-sets/{social_set_id}/drafts",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urlopen(request, timeout=30) as response:
        response_body = response.read().decode("utf-8")
    return json.loads(response_body)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--url",
        default=DEFAULT_DESTINATION_URL,
        help=f"Destination URL to tag. Defaults to {DEFAULT_DESTINATION_URL}.",
    )
    parser.add_argument("--title", required=True, help="Article title; used as the default draft title.")
    parser.add_argument("--platform", required=True, choices=PLATFORMS, help="Typefully platform.")
    parser.add_argument("--text", help="Post text. Use {utm_url} to place the link explicitly.")
    parser.add_argument("--text-file", help="Path to a file containing post text.")
    parser.add_argument("--draft-title", help="Internal Typefully draft title. Defaults to --title.")
    parser.add_argument("--social-set-id", default=DEFAULT_SOCIAL_SET_ID, help="Typefully social set id.")
    parser.add_argument("--tag", action="append", default=[], help="Existing Typefully tag slug. May repeat.")
    parser.add_argument("--scratchpad-text", help="Optional Typefully scratchpad text.")
    parser.add_argument("--no-share", action="store_true", help="Do not request a public share URL.")
    parser.add_argument("--dry-run", action="store_true", help="Print request JSON without calling Typefully.")
    parser.add_argument(
        "--content",
        help="utm_content (the person, as first-last). Defaults to git identity.",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    load_repo_env()

    try:
        content = normalize_slug(args.content) if args.content else git_person_slug()
        utm_url = build_utm_url(args.url, args.platform, content)
        post_text = embed_url(read_text_arg(args.text, args.text_file), utm_url)
        payload = build_payload(
            platform=args.platform,
            post_text=post_text,
            draft_title=args.draft_title or args.title,
            share=not args.no_share,
            tags=args.tag,
            scratchpad_text=args.scratchpad_text,
        )
    except (OSError, RuntimeError, ValueError) as exc:
        sys.stderr.write(f"Error: {exc}\n")
        return 1

    if args.dry_run:
        print(json.dumps({"utm_url": utm_url, "social_set_id": args.social_set_id, "payload": payload}, indent=2))
        return 0

    api_key = os.getenv("TYPEFULLY_API_KEY")
    if not api_key:
        sys.stderr.write("Error: TYPEFULLY_API_KEY is not set in the environment or repo-root .env.\n")
        return 1

    try:
        result = post_draft(args.social_set_id, api_key, payload)
    except Exception as exc:  # noqa: BLE001
        sys.stderr.write(f"Error creating Typefully draft: {exc}\n")
        return 1

    output = {
        "utm_url": utm_url,
        "id": result.get("id"),
        "social_set_id": result.get("social_set_id") or args.social_set_id,
        "private_url": result.get("private_url"),
        "share_url": result.get("share_url"),
        "status": result.get("status"),
        "response": result,
    }
    print(json.dumps(output, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
