/**
 * Fetch one Google Doc tab (includeTabsContent) and return HTML.
 * Shared by merge / clone agents.
 */

import { readFileSync } from "node:fs";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textRunToHtml(tr) {
  let t = escapeHtml(tr.content ?? "");
  const st = tr.textStyle ?? {};
  const url = st.link?.url;
  if (url) t = `<a href="${escapeHtml(url)}">${t}</a>`;
  if (st.bold) t = `<strong>${t}</strong>`;
  if (st.italic) t = `<em>${t}</em>`;
  return t;
}

function paragraphInnerHtml(para) {
  return (para.elements ?? [])
    .map((el) => {
      if (el.textRun) return textRunToHtml(el.textRun);
      if (el.inlineObjectElement) return "";
      if (el.person) return "";
      if (el.equation) return "";
      return "";
    })
    .join("");
}

const HEADING_TAGS = {
  HEADING_1: "h2",
  HEADING_2: "h2",
  HEADING_3: "h3",
  HEADING_4: "h4",
  HEADING_5: "h5",
  HEADING_6: "h6",
  TITLE: "h2",
  SUBTITLE: "h3",
};

function structuralElementsToHtml(elements) {
  if (!elements?.length) return "";
  const parts = [];
  let ulDepth = 0;

  const closeListsTo = (target) => {
    while (ulDepth > target) {
      parts.push("</ul>\n");
      ulDepth--;
    }
  };

  const flushParagraph = (para) => {
    const inner = paragraphInnerHtml(para);
    const trimmed = inner.replace(/\u00a0/g, " ").trim();
    if (!trimmed) return;

    const bullet = para.bullet;
    const named = para.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT";

    if (bullet) {
      const nl = bullet.nestingLevel ?? 0;
      const need = nl + 1;
      while (ulDepth < need) {
        parts.push("<ul>\n");
        ulDepth++;
      }
      closeListsTo(need);
      parts.push(`<li>${inner}</li>\n`);
      return;
    }

    closeListsTo(0);

    const ht = HEADING_TAGS[named];
    if (ht) {
      parts.push(`<${ht}>${inner}</${ht}>\n`);
      return;
    }
    parts.push(`<p>${inner}</p>\n`);
  };

  const walkCellElements = (cellElements) => {
    for (const cel of cellElements ?? []) {
      if (cel.paragraph) flushParagraph(cel.paragraph);
      else if (cel.table) walkTable(cel.table);
    }
  };

  const walkTable = (table) => {
    closeListsTo(0);
    parts.push("<table>\n<tbody>\n");
    for (const row of table.tableRows ?? []) {
      parts.push("<tr>\n");
      for (const cell of row.tableCells ?? []) {
        parts.push("<td>");
        walkCellElements(cell.content);
        parts.push("</td>\n");
      }
      parts.push("</tr>\n");
    }
    parts.push("</tbody>\n</table>\n");
  };

  for (const el of elements) {
    if (el.paragraph) flushParagraph(el.paragraph);
    else if (el.table) walkTable(el.table);
    else if (el.sectionBreak || el.tableOfContents) closeListsTo(0);
  }
  closeListsTo(0);
  return parts.join("").trim();
}

function tabBodyToHtml(tab) {
  const body = tab.documentTab?.body;
  return structuralElementsToHtml(body?.content);
}

function* walkTabs(tabs) {
  for (const t of tabs ?? []) {
    yield t;
    yield* walkTabs(t.childTabs);
  }
}

function findTab(doc, tabIdArg) {
  const want = tabIdArg.startsWith("t.") ? tabIdArg : `t.${tabIdArg}`;
  for (const tab of walkTabs(doc.tabs)) {
    const id = tab.tabProperties?.tabId;
    if (id === want || id === tabIdArg || id?.replace(/^t\./, "") === tabIdArg.replace(/^t\./, ""))
      return tab;
  }
  return null;
}

async function oauthAccessToken(unified) {
  const body = new URLSearchParams({
    client_id: unified.client_id,
    client_secret: unified.client_secret,
    refresh_token: unified.refresh_token,
    grant_type: "refresh_token",
  });
  const r = await fetch(unified.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) throw new Error(`token refresh failed: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return j.access_token;
}

async function fetchDoc(accessToken, documentId) {
  const url = `https://docs.googleapis.com/v1/documents/${documentId}?includeTabsContent=true`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!r.ok) throw new Error(`docs.get failed: ${r.status} ${await r.text()}`);
  return r.json();
}

/** @returns {Promise<string>} */
export async function getGoogleDocTabHtml({ tokenPath, documentId, tabId }) {
  const unified = JSON.parse(readFileSync(tokenPath, "utf8"));
  const access = await oauthAccessToken(unified);
  const docJson = await fetchDoc(access, documentId);
  const tab = findTab(docJson, tabId);
  if (!tab) {
    const ids = [...walkTabs(docJson.tabs)].map((t) => t.tabProperties?.tabId).filter(Boolean);
    throw new Error(`Tab ${tabId} not found. Tab ids: ${ids.join(", ")}`);
  }
  return tabBodyToHtml(tab);
}

export function listTabIdsForError(docJson) {
  return [...walkTabs(docJson.tabs)].map((t) => t.tabProperties?.tabId).filter(Boolean);
}
