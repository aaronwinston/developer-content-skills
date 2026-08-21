#!/usr/bin/env node
/**
 * Clone an existing Arize `guide` (metadata model) and attach Google Doc tab HTML as the article body file.
 *
 * Guide articles store the main body in **ACF (or similar): Sections → Content** (WYSIWYG), not in core
 * `post_content`. The REST API does not expose that field here, so HTML cannot be pushed via API.
 *
 * This script creates a new draft guide with the same shell as the model (author, featured image, etc.),
 * writes body HTML to disk, then you paste into **Sections → the first “Content” block** (Visual or Code
 * view, whichever matches your agent).
 *
 * Usage:
 *   node .agents/agents/content/update-agent/scripts/clone-wordpress-guide-from-doc-tab.mjs \
 *     --model-id 28202 \
 *     --doc 1SNJ5ec8Gv1g-VedD_15xlyQoJU7-G03aDZ6aGBFFyU8 \
 *     --tab t.a53i8xw3prz7 \
 *     [--slug agent-analytics-buyers-guide] \
 *     [--status draft]
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

function parseDocMetaUl(html) {
  const meta = {};
  const ul = html.match(/^<ul>\s*([\s\S]*?)<\/ul>/);
  if (!ul) return meta;
  const inner = ul[1];
  const liRe = /<li>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = liRe.exec(inner))) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    const kv = text.match(/^(\w+)\s*:\s*(.*)$/);
    if (kv) meta[kv[1].toLowerCase()] = kv[2].trim();
  }
  return meta;
}

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/&[^;]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function slugFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

function titleFromHtml(html, meta) {
  if (meta.title) return meta.title;
  const m = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!m) throw new Error("Could not derive title (no metadata title, no <h2>)");
  return m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function excerptFromHtml(html, meta) {
  if (meta.description) return meta.description.slice(0, 300);
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return "";
  const t = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return t.slice(0, 300);
}

function stripLeadingMetaUl(html) {
  return html.replace(/^<ul>\s*([\s\S]*?)<\/ul>\s*/m, "").trim();
}

async function wpJson(auth, url, opts = {}) {
  const r = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Basic ${auth}`,
      ...(opts.headers || {}),
    },
  });
  const text = await r.text();
  const safe = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  if (!r.ok) throw new Error(`${opts.method || "GET"} ${url} → ${r.status}: ${safe.slice(0, 800)}`);
  return safe ? JSON.parse(safe) : {};
}

async function main() {
  const args = parseArgs(process.argv);
  const modelId = args["model-id"] ?? args.modelId;
  const docId = args.doc ?? args.document;
  const tabId = args.tab;
  const slugArg = args.slug;
  const status = (args.status || "draft").toLowerCase();

  if (!modelId || !docId || !tabId) {
    console.error(
      "Usage: node clone-wordpress-guide-from-doc-tab.mjs --model-id ID --doc DOC_ID --tab TAB_ID [--slug SLUG] [--status draft|publish]",
    );
    process.exit(1);
  }

  loadDotEnv(join(REPO_ROOT, ".env"));
  const base = process.env.WORDPRESS_BASE_URL;
  const user = process.env.WORDPRESS_USERNAME;
  const pass = process.env.WORDPRESS_APPLICATION_PASSWORD;
  if (!base || !user || !pass) throw new Error("WORDPRESS_* missing from .env");

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const root = base.replace(/\/$/, "");

  const tabHtmlFull = await getGoogleDocTabHtml({
    tokenPath: TOKEN_PATH,
    documentId: docId,
    tabId,
  });

  const meta = parseDocMetaUl(tabHtmlFull);
  const title = titleFromHtml(tabHtmlFull, meta);
  const excerpt = excerptFromHtml(tabHtmlFull, meta);

  let slug =
    slugArg ||
    (meta.url ? slugFromUrl(meta.url) : null) ||
    slugifyTitle(title);

  const model = await wpJson(auth, `${root}/wp-json/wp/v2/guide/${modelId}?context=edit`);

  const payload = {
    title,
    slug,
    status,
    author: model.author,
    featured_media: model.featured_media,
    template: model.template ?? "",
    menu_order: model.menu_order ?? 0,
    excerpt,
  };

  if (Array.isArray(model.coauthors) && model.coauthors.length)
    payload.coauthors = model.coauthors;

  const created = await wpJson(auth, `${root}/wp-json/wp/v2/guide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const newId = created.id;
  const bodyPath = join(
    REPO_ROOT,
    `.agents/agents/content/update-agent/tmp/clone-guide-${newId}-body.html`,
  );

  const bodyHtml = stripLeadingMetaUl(tabHtmlFull);

  writeFileSync(bodyPath, bodyHtml, "utf8");

  const editUrl = `${root}/wp-admin/post.php?post=${newId}&action=edit`;

  console.log(
    JSON.stringify(
      {
        ok: true,
        message:
          "Guide shell created via REST. Paste body HTML into Sections → Content (WYSIWYG); REST cannot write ACF sections.",
        id: newId,
        slug: created.slug,
        title,
        editUrl,
        bodyHtmlPath: bodyPath,
        modeledAfter: Number(modelId),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
