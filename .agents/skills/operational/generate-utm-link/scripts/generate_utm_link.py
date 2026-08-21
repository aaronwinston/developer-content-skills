#!/usr/bin/env python3
"""Generate UTM-tagged URLs using the Arize canonical taxonomy.

Taxonomy:
- utm_source  = the specific place where the link lives.
- utm_medium  = the channel type.
- utm_campaign = the canonical program; defaults to `devrel`.
- utm_content = the variant, person, or placement.
- utm_term = paid search keyword only; stale manual values are stripped.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

# Stable medium values from the UTM doc. Do not invent new ones.
MEDIUMS = (
    "cpc",
    "email",
    "social",
    "partner",
    "webinar",
    "event",
    "earned",
    "referral",
    "community",
    "video",
)

# Known sources mapped to their default channel type (medium).
PLATFORM_MEDIUM = {
    "linkedin": "social",
    "x": "social",
    "reddit": "community",
    "github": "community",
    "youtube": "video",
    "blog": "referral",
    "newsletter": "email",
    "gong": "email",
    "hs_email": "email",
    "hs_automation": "email",
    "luma": "event",
    "commonroom": "community",
    "chatgpt": "referral",
    "perplexity": "referral",
    "cursor": "partner",
    "aish": "partner",
}

# Canonical source aliases → the blessed slug. Soft guardrail for consistency:
# the same platform must always report under one value (e.g. never both
# `twitter` and `x`). Add aliases here as new spellings show up.
SOURCE_ALIASES = {
    "twitter": "x",
    "twitter-com": "x",
    "x-com": "x",
    "tweet": "x",
    "li": "linkedin",
    "linked-in": "linkedin",
    "yt": "youtube",
    "youtube-com": "youtube",
    "gh": "github",
    "rdt": "reddit",
    "hs-email": "hs_email",
    "hubspot-email": "hs_email",
    "hs-automation": "hs_automation",
    "hubspot-automation": "hs_automation",
}

UTM_KEYS = {"utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"}


def normalize_slug(value: str, *, allow_underscore: bool = False) -> str:
    """Lowercase, hyphenate, and strip a value into a UTM-safe slug."""
    pattern = r"[^a-z0-9_]+" if allow_underscore else r"[^a-z0-9]+"
    return re.sub(pattern, "-", value.strip().lower()).strip("-")


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


def canonical_source(value: str) -> str:
    """Normalize a source to a UTM-safe slug, then canonicalize known aliases.

    Keeps reporting consistent — e.g. `twitter`, `Twitter`, and `X` all collapse
    to `x`. Unknown sources pass through unchanged (see `warn_unknown_source`).
    """
    slug = normalize_slug(value, allow_underscore=True)
    return SOURCE_ALIASES.get(slug, slug)


def warn_unknown_source(source: str) -> None:
    """Soft guardrail: allow novel sources, but warn so aliases get caught."""
    if source not in PLATFORM_MEDIUM:
        known = ", ".join(sorted(PLATFORM_MEDIUM))
        sys.stderr.write(
            f"Warning: '{source}' is not a known source platform ({known}). "
            f"Proceeding, but confirm it is not an alias of an existing one "
            f"(for example use 'x', not 'twitter').\n"
        )


def resolve_medium(source: str, medium: str | None) -> str:
    """Pick the medium: explicit override, else derived from the platform."""
    if medium:
        if medium not in MEDIUMS:
            allowed = ", ".join(MEDIUMS)
            raise ValueError(f"medium must be one of: {allowed}")
        return medium

    derived = PLATFORM_MEDIUM.get(source)
    if not derived:
        known = ", ".join(sorted(PLATFORM_MEDIUM))
        raise ValueError(
            f"Cannot derive a medium for source '{source}'. "
            f"Pass --medium explicitly, or use a known platform: {known}."
        )
    return derived


def build_utm_url(
    destination_url: str,
    source: str,
    medium: str,
    content: str,
    campaign: str = "devrel",
) -> str:
    parsed = urlsplit(destination_url)
    if not parsed.scheme or not parsed.netloc:
        raise ValueError("destination URL must include scheme and host, for example https://arize.com/blog")

    kept_params = [
        (key, value)
        for key, value in parse_qsl(parsed.query, keep_blank_values=True)
        if key.lower() not in UTM_KEYS
    ]
    utm_params = [
        ("utm_source", source),
        ("utm_medium", medium),
        ("utm_campaign", campaign),
        ("utm_content", content),
    ]
    query = urlencode([*kept_params, *utm_params])
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, query, parsed.fragment))


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="Destination URL to tag.")
    parser.add_argument(
        "--source",
        required=True,
        help="Specific place where the link lives, e.g. linkedin, x, hs_email, luma, chatgpt, cursor.",
    )
    parser.add_argument(
        "--medium",
        choices=MEDIUMS,
        help="UTM medium. Optional; derived from --source when omitted.",
    )
    parser.add_argument(
        "--content",
        help="utm_content (the person, as first-last). Defaults to git identity.",
    )
    parser.add_argument(
        "--campaign",
        default="devrel",
        help="utm_campaign. Defaults to devrel.",
    )
    parser.add_argument("--json", action="store_true", help="Print JSON instead of only the URL.")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    try:
        source = canonical_source(args.source)
        warn_unknown_source(source)
        medium = resolve_medium(source, args.medium)
        content = normalize_slug(args.content) if args.content else git_person_slug()
        campaign = normalize_slug(args.campaign)
        tagged_url = build_utm_url(args.url, source, medium, content, campaign=campaign)
    except (RuntimeError, ValueError) as exc:
        sys.stderr.write(f"Error: {exc}\n")
        return 1

    if args.json:
        payload: dict[str, Any] = {
            "url": tagged_url,
            "utm_source": source,
            "utm_medium": medium,
            "utm_campaign": campaign,
            "utm_content": content,
        }
        print(json.dumps(payload, indent=2))
    else:
        print(tagged_url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
