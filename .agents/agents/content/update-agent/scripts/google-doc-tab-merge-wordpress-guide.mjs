#!/usr/bin/env node
/**
 * Fetch one Google Doc tab, optionally merge HTML into live guide body, PATCH WordPress guide CPT.
 *
 * Note: Arize `guide` REST schema omits `content`; updates here may not affect the rendered body.
 * Prefer clone-wordpress-guide-from-doc-tab.mjs + paste HTML in wp-admin for new guides.
 *
 * Env: WORDPRESS_* from repo .env; token from update-agent/.credentials/token_unified.json
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getGoogleDocTabHtml } from "./lib/google-doc-tab-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../../../..");
const TOKEN_PATH = join(
  REPO_ROOT,
  ".agents/agents/content/update-agent/.credentials/token_unified.json",
);

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (v && !v.startsWith("--")) {
        out[k] = v;
        i++;
      } else out[k] = true;
    }
  }
  return out;
}

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

/** First heading plain text (strip tags) from generated tab HTML */
function firstHeadingKey(html) {
  const m = html.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
  if (!m) return "";
  return m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

/** Inner HTML of the first multiline-class prose div after mainContent */
function extractInnerHtmlOfDivStartingAt(html, divStart) {
  const openTagEnd = html.indexOf(">", divStart);
  if (openTagEnd === -1) throw new Error("malformed opening div");
  let depth = 1;
  const innerStart = openTagEnd + 1;
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = innerStart;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return html.slice(innerStart, m.index).trim();
    } else depth++;
  }
  throw new Error("unbalanced div after prose wrapper");
}

/** Extract main prose inner HTML from Arize guide page snapshot */
function extractLiveMainColumn(html) {
  const anchor = html.indexOf('x-ref="mainContent"');
  if (anchor === -1) throw new Error("mainContent marker not found on live page");
  let pos = anchor;
  while (pos < html.length) {
    const ds = html.indexOf('<div class="', pos);
    if (ds === -1) throw new Error("no class div after mainContent");
    let k = ds + 11;
    while (k < html.length) {
      if (html[k] === '"' && html[k + 1] === ">") break;
      k++;
    }
    if (k >= html.length) throw new Error("unclosed div class attribute");
    const classBlob = html.slice(ds + 11, k);
    if (/\bprose\b/.test(classBlob)) return extractInnerHtmlOfDivStartingAt(html, ds);
    pos = k + 2;
  }
  throw new Error("prose wrapper div not found");
}

function mergeSectionByFirstH2(liveInnerHtml, tabHtml) {
  const key = firstHeadingKey(tabHtml);
  if (!key) {
    throw new Error("Tab HTML has no <h2>/<h3> — cannot anchor merge; aborting.");
  }

  const h2Re = /<h2\b[^>]*>/gi;
  const indices = [];
  let mm;
  while ((mm = h2Re.exec(liveInnerHtml))) indices.push(mm.index);

  let matchStart = -1;
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = i + 1 < indices.length ? indices[i + 1] : liveInnerHtml.length;
    const chunk = liveInnerHtml.slice(start, end);
    const chunkKey = chunk
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (chunkKey.includes(key) || key.includes(chunkKey.slice(0, Math.min(80, chunkKey.length)))) {
      matchStart = start;
      break;
    }
  }

  if (matchStart === -1) {
    const preview = liveInnerHtml.slice(0, 1200);
    throw new Error(
      `No live <h2> matched tab heading "${key.slice(0, 80)}…". Live preview:\n${preview}`,
    );
  }

  const nextH2 = liveInnerHtml.slice(matchStart + 1).search(/<h2\b/i);
  const sectionEnd =
    nextH2 === -1 ? liveInnerHtml.length : matchStart + 1 + nextH2;

  return liveInnerHtml.slice(0, matchStart) + tabHtml + "\n" + liveInnerHtml.slice(sectionEnd);
}

async function wpUpdateGuide(baseUrl, user, pass, guideId, html, dryRun) {
  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const endpoint = `${baseUrl.replace(/\/$/, "")}/wp-json/wp/v2/guide/${guideId}`;
  const payload = JSON.stringify({
    content: html,
    status: "publish",
  });
  if (dryRun) {
    console.error(`Dry run: would POST ${payload.length} bytes to ${endpoint}`);
    return;
  }
  const r = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: payload,
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`WordPress ${r.status}: ${text}`);
  return JSON.parse(text);
}

async function main() {
  const args = parseArgs(process.argv);
  const docId = args.doc ?? args.document;
  const tabId = args.tab;
  const guideId = args["guide-id"] ?? args.guideId;
  const liveUrl = args["live-url"] ?? args.liveUrl;
  const dryRun = args["dry-run"] ?? args.dryRun;
  const mode = (args.mode ?? "merge").toLowerCase();
  const writeTabHtml = args["write-tab-html"] ?? args.writeTabHtml;

  if (!docId || !tabId || !guideId) {
    console.error(
      "Usage: node google-doc-tab-merge-wordpress-guide.mjs --doc DOC_ID --tab TAB_ID --guide-id ID [--live-url URL] [--mode merge|replace] [--dry-run]",
    );
    process.exit(1);
  }
  if (mode === "merge" && !liveUrl) {
    console.error("merge mode requires --live-url");
    process.exit(1);
  }

  loadDotEnv(join(REPO_ROOT, ".env"));

  const tabHtml = await getGoogleDocTabHtml({
    tokenPath: TOKEN_PATH,
    documentId: docId,
    tabId,
  });
  console.error(`Tab HTML length: ${tabHtml.length} chars`);

  if (writeTabHtml) {
    writeFileSync(writeTabHtml, tabHtml, "utf8");
    console.error(`Wrote tab HTML to ${writeTabHtml}`);
  }

  let merged;
  if (mode === "replace") {
    merged = tabHtml;
    console.error("mode=replace: posting tab HTML as full guide body");
  } else {
    const liveRes = await fetch(liveUrl);
    if (!liveRes.ok) throw new Error(`Live URL fetch ${liveRes.status}`);
    const livePage = await liveRes.text();
    const liveInner = extractLiveMainColumn(livePage);
    merged = mergeSectionByFirstH2(liveInner, tabHtml);
  }

  const user = process.env.WORDPRESS_USERNAME;
  const pass = process.env.WORDPRESS_APPLICATION_PASSWORD;
  const base = process.env.WORDPRESS_BASE_URL;
  if (!user || !pass || !base) throw new Error("WORDPRESS_* missing from .env");

  const result = await wpUpdateGuide(base, user, pass, guideId, merged, !!dryRun);
  if (dryRun) {
    console.error("Dry run complete.");
    return;
  }
  console.log(JSON.stringify({ ok: true, id: result.id, link: result.link }, null, 2));
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
