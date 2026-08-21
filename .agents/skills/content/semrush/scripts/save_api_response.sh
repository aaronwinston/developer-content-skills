#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  save_api_response.sh --slug <name> --url <request_url> --report-type <type> [options]

Required:
  --slug <name>            Directory slug under .agents/skills/content/semrush/data/
  --url <request_url>      Full Semrush request URL containing the API key
  --report-type <type>     Semrush report type, e.g. phrase_this

Optional metadata:
  --query-type <type>      keyword | domain | url | other
  --query-value <value>    Main query input
  --database <db>          Semrush database code such as us
  --expected-units <n>     Pre-run estimated unit cost
  --output-ext <ext>       Response file extension, default csv
  --notes <text>           Freeform note stored in metadata.json

This helper may execute a unit-consuming Semrush request.
Do not run it until the human explicitly approves the spend.
EOF
}

slug=""
url=""
report_type=""
query_type=""
query_value=""
database=""
expected_units=""
output_ext="csv"
notes=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug) slug="${2:-}"; shift 2 ;;
    --url) url="${2:-}"; shift 2 ;;
    --report-type) report_type="${2:-}"; shift 2 ;;
    --query-type) query_type="${2:-}"; shift 2 ;;
    --query-value) query_value="${2:-}"; shift 2 ;;
    --database) database="${2:-}"; shift 2 ;;
    --expected-units) expected_units="${2:-}"; shift 2 ;;
    --output-ext) output_ext="${2:-}"; shift 2 ;;
    --notes) notes="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ -z "$slug" || -z "$url" || -z "$report_type" ]]; then
  usage
  exit 1
fi

skill_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
data_root="${skill_root}/data"
run_dir="${data_root}/${slug}"
mkdir -p "$run_dir"

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
response_path="${run_dir}/response.${output_ext}"
request_path="${run_dir}/request.txt"
metadata_path="${run_dir}/metadata.json"

tmp_response="$(mktemp)"
http_code="$(curl -sS -o "$tmp_response" -w "%{http_code}" "$url")"
mv "$tmp_response" "$response_path"

python3 - "$url" "$request_path" "$metadata_path" "$timestamp" "$report_type" "$query_type" "$query_value" "$database" "$expected_units" "$output_ext" "$notes" "$response_path" "$http_code" <<'PY'
import json
import os
import sys
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

(
    url,
    request_path,
    metadata_path,
    timestamp,
    report_type,
    query_type,
    query_value,
    database,
    expected_units,
    output_ext,
    notes,
    response_path,
    http_code,
) = sys.argv[1:]

parts = urlsplit(url)
query_pairs = parse_qsl(parts.query, keep_blank_values=True)
redacted_pairs = [("key", "REDACTED") if k == "key" else (k, v) for k, v in query_pairs]
redacted_url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(redacted_pairs), parts.fragment))

with open(request_path, "w", encoding="utf-8") as f:
    f.write(redacted_url + "\n")

metadata = {
    "timestamp_utc": timestamp,
    "report_type": report_type,
    "query_type": query_type or None,
    "query_value": query_value or None,
    "database": database or None,
    "expected_units": int(expected_units) if expected_units else None,
    "http_status": int(http_code),
    "response_file": os.path.basename(response_path),
    "response_format": output_ext,
    "request_url_redacted": redacted_url,
    "notes": notes or None,
}

with open(metadata_path, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2, sort_keys=True)
    f.write("\n")
PY

printf 'Saved response to %s\n' "$response_path"
printf 'Saved request to %s\n' "$request_path"
printf 'Saved metadata to %s\n' "$metadata_path"
printf 'HTTP %s\n' "$http_code"
