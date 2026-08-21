#!/usr/bin/env python3
"""
Load a google-auth (or oauth2client) OAuth token pickle and print JSON for the Google Workspace OAuth setup script.

Only unpickle files you created yourself (pickle can execute code if malicious).

Usage:
  python3 .agents/skills/operational/google-workspace/scripts/google-oauth-credentials-from-pickle.py /path/to/token.pickle
"""

from __future__ import annotations

import json
import pickle
import sys
from pathlib import Path

# Help pickle resolve classes saved by google-auth / oauth2client.
try:
    import google.oauth2.credentials  # noqa: F401
except ImportError:
    pass
try:
    import oauth2client.client  # noqa: F401
except ImportError:
    pass


def fail(msg: str) -> None:
    print(msg, file=sys.stderr)
    sys.exit(1)


def credentials_like_to_dict(obj: object) -> dict:
    """Best-effort extract fields from google.oauth2.credentials.Credentials or oauth2client."""
    out: dict = {}
    for attr in ("refresh_token", "token", "client_id", "client_secret"):
        if hasattr(obj, attr):
            val = getattr(obj, attr)
            if val is not None:
                out[attr] = val
    if hasattr(obj, "scopes") and obj.scopes is not None:
        out["scopes"] = list(obj.scopes)
    out["_pickle_type"] = f"{type(obj).__module__}.{type(obj).__qualname__}"
    return out


def main() -> None:
    if len(sys.argv) != 2:
        fail("Usage: google-oauth-credentials-from-pickle.py <path/to/token.pickle>")

    path = Path(sys.argv[1]).expanduser().resolve()
    if not path.is_file():
        fail(f"Not a file: {path}")

    try:
        with path.open("rb") as f:
            obj = pickle.load(f)
    except Exception as e:
        fail(
            f"pickle.load failed: {e}\n"
            "Install deps in the Python you use for this script, e.g.\n"
            "  pip install google-auth google-auth-oauthlib\n"
            "(Pickled google.oauth2.credentials.Credentials requires those modules to import.)"
        )

    data = credentials_like_to_dict(obj)

    if not data.get("refresh_token"):
        fail(
            f"No refresh_token on object {data.get('_pickle_type')}. "
            "Re-authorize with offline access or use a different pickle."
        )
    if not data.get("client_id"):
        fail(
            f"No client_id on object {data.get('_pickle_type')}. "
            "Set GOOGLE_OAUTH_CLIENT_ID in the environment when importing from this pickle."
        )

    print(json.dumps(data))


if __name__ == "__main__":
    main()
