#!/usr/bin/env node
/**
 * Read the competitive context matrix from Google Sheets (live) and write
 * step-01 run artifacts under .agents/agents/content/competitive/tmp/.
 *
 * Usage (from repo root):
 *   node .agents/agents/content/competitive/scripts/competitive-fetch-matrix.mjs \
 *     --id langsmith-alternatives-2026 \
 *     --platform LangSmith
 *
 *   node .agents/agents/content/competitive/scripts/competitive-fetch-matrix.mjs --id test --platform LangSmith --stdout
 *
 * OAuth: GOOGLE_OAUTH_* in .env, or .agents/agents/content/update-agent/.credentials/token_unified.json
 *
 * Env (optional):
 *   GOOGLE_SHEETS_COMPETITIVE_MATRIX_SPREADSHEET_ID (default: competitive matrix sheet)
 *   GOOGLE_SHEETS_COMPETITIVE_MATRIX_GID (default: 0)
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getAccessToken, googleJson } from "../../../../skills/operational/google-workspace/scripts/google-oauth-env.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");
const DEFAULT_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_COMPETITIVE_MATRIX_SPREADSHEET_ID || "";
const DEFAULT_GID = Number(process.env.GOOGLE_SHEETS_COMPETITIVE_MATRIX_GID || 0);
const TMP_DIR = resolve(REPO_ROOT, ".agents/agents/content/competitive/tmp");
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit?gid=${DEFAULT_GID}#gid=${DEFAULT_GID}`;

const PARSED_COLUMNS = [
  "Platform",
  "Pricing (Range/Tiers)",
  "Best For & Use Cases",
  "Core Features (Cloud Offering)",
  "Pros & Cons",
  "Time to Deploy",
  "Integrations",
  "URL",
];

function parseArgs(argv) {
  const out = { id: null, platform: null, stdout: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--id" && argv[i + 1]) out.id = argv[++i];
    else if (a === "--platform" && argv[i + 1]) out.platform = argv[++i];
    else if (a === "--stdout") out.stdout = true;
    else if (a === "--help" || a === "-h") {
      console.log(`Usage: node .agents/agents/content/competitive/scripts/competitive-fetch-matrix.mjs --id <slug> --platform <name> [--stdout]`);
      process.exit(0);
    }
  }
  if (!out.platform) {
    console.error("Missing --platform (e.g. LangSmith, Arize AX, Braintrust, Langfuse)");
    process.exit(1);
  }
  if (!out.stdout && !out.id) {
    console.error("Missing --id <slug> (or pass --stdout to print JSON only)");
    process.exit(1);
  }
  return out;
}

function norm(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findHeaderRow(values) {
  for (let i = 0; i < values.length; i++) {
    const row = values[i] ?? [];
    if (row.some((c) => norm(c) === "platform")) return i;
  }
  return -1;
}

function rowToRecord(headers, row) {
  const record = {};
  for (let i = 0; i < headers.length; i++) {
    const key = String(headers[i] ?? "").trim();
    if (!key) continue;
    record[key] = String(row[i] ?? "").trim();
  }
  return record;
}

function matchPlatform(record, platform) {
  const p = norm(record.Platform || record.platform || "");
  const want = norm(platform);
  if (p === want) return true;
  if (want === "arize ax" && (p === "arize ax" || p === "arize")) return true;
  return false;
}

async function resolveSheetTitle(spreadsheetId, gid, token) {
  const meta = await googleJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    { token }
  );
  const sheet = (meta.sheets ?? []).find((s) => s.properties?.sheetId === Number(gid));
  if (!sheet?.properties?.title) {
    throw new Error(`No sheet with gid ${gid} on spreadsheet ${spreadsheetId}`);
  }
  return sheet.properties.title;
}

async function fetchMatrixValues(spreadsheetId, gid, token) {
  const sheetTitle = await resolveSheetTitle(spreadsheetId, gid, token);
  const range = encodeURIComponent(`${sheetTitle}!A:Z`);
  const res = await googleJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    { token }
  );
  return { sheetTitle, values: res.values ?? [] };
}

function buildParsedTable(record) {
  const lines = ["| Column | Value |", "|--------|-------|"];
  for (const col of PARSED_COLUMNS) {
    let val = "";
    if (col === "Pros & Cons") {
      const pros = record.Pros ?? record["Pros"] ?? "";
      const cons = record.Cons ?? record["Cons"] ?? "";
      val = [pros && `Pros: ${pros}`, cons && `Cons: ${cons}`].filter(Boolean).join(" | ");
    } else if (col === "Core Features (Cloud Offering)") {
      val = record["Core Features"] ?? record["Core Features (Cloud Offering)"] ?? "";
    } else {
      val = record[col] ?? "";
    }
    lines.push(`| ${col} | ${String(val).replace(/\|/g, "\\|")} |`);
  }
  return lines.join("\n");
}

function sheetRowMarkdown({ id, platform, sheetTitle, fetchedAt, focal, allRows }) {
  const raw = focal.rawRow.join("\t");
  return `# Sheet row — ${id}

- Focal competitor: ${platform}
- Sheet: ${SHEET_URL}
- Tab: ${sheetTitle}
- Fetched (live): ${fetchedAt}
- Source: Google Sheets API (do not substitute a repo CSV or manual paste)

## Raw row

${raw}

## Parsed

${buildParsedTable(focal.record)}

## Related rows (live matrix)

${allRows
  .map((r) => `- **${r.record.Platform}**`)
  .join("\n")}
`;
}

export async function fetchCompetitiveMatrix({ platform, spreadsheetId, gid, token: existingToken }) {
  const spreadsheet =
    spreadsheetId?.trim() ||
    process.env.GOOGLE_SHEETS_COMPETITIVE_MATRIX_SPREADSHEET_ID?.trim() ||
    DEFAULT_SPREADSHEET_ID;
  if (!spreadsheet) {
    throw new Error("Set GOOGLE_SHEETS_COMPETITIVE_MATRIX_SPREADSHEET_ID in the environment");
  }
  const sheetGid = gid ?? process.env.GOOGLE_SHEETS_COMPETITIVE_MATRIX_GID?.trim() ?? String(DEFAULT_GID);
  const token = existingToken ?? (await getAccessToken());
  const { sheetTitle, values } = await fetchMatrixValues(spreadsheet, sheetGid, token);
  const headerIdx = findHeaderRow(values);
  if (headerIdx < 0) throw new Error("Could not find header row with Platform column in competitive matrix sheet");

  const headers = values[headerIdx].map((c) => String(c ?? "").trim());
  const dataRows = values.slice(headerIdx + 1).filter((row) => row.some((c) => String(c ?? "").trim()));
  const records = dataRows.map((row) => ({
    rawRow: row,
    record: rowToRecord(headers, row),
  }));

  const focal = records.find((r) => matchPlatform(r.record, platform));
  if (!focal) {
    const names = records.map((r) => r.record.Platform).filter(Boolean);
    throw new Error(
      `No row for platform "${platform}" on tab "${sheetTitle}". Found: ${names.join(", ") || "(none)"}`
    );
  }

  return {
    spreadsheetId: spreadsheet,
    sheetGid,
    sheetTitle,
    sheetUrl: SHEET_URL,
    fetchedAt: new Date().toISOString(),
    platform,
    focal,
    allRows: records,
    headers,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const data = await fetchCompetitiveMatrix({ platform: args.platform });

  if (args.stdout) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  mkdirSync(TMP_DIR, { recursive: true });
  const outPath = resolve(TMP_DIR, `${args.id}-sheet-row.md`);
  const md = sheetRowMarkdown({
    id: args.id,
    platform: args.platform,
    sheetTitle: data.sheetTitle,
    fetchedAt: data.fetchedAt,
    focal: data.focal,
    allRows: data.allRows,
  });
  writeFileSync(outPath, md, "utf8");
  console.log(JSON.stringify({ ok: true, path: outPath, platform: args.platform, fetchedAt: data.fetchedAt }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
