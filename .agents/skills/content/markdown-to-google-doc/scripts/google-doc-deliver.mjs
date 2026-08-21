/**
 * Shared Google Doc creation + Review sheet row append for content agents.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { getAccessToken, googleJson } from "../../../operational/google-workspace/scripts/google-oauth-env.mjs";
import { markdownToGoogleDocHtml } from "./markdown-to-google-doc-html.mjs";

export function titleFromMarkdown(md, override, fallbackTitle = "Draft") {
  if (override?.trim()) return override.trim();
  const line = md.split(/\r?\n/).find((l) => /^#\s+/.test(l));
  if (line) return line.replace(/^#\s+/, "").trim();
  return fallbackTitle;
}

export function upsertEvalGoogleDocLine(evalPath, docUrl, reviewSheetUrl) {
  if (!evalPath) return;
  let text = readFileSync(evalPath, "utf8");
  const line = `- **Google Doc:** ${docUrl}`;
  if (/^- \*\*Google Doc:\*\*/m.test(text)) {
    text = text.replace(/^- \*\*Google Doc:\*\*.*$/m, line);
  } else if (/^- \*\*Manuscript:\*\*/m.test(text)) {
    text = text.replace(/^(- \*\*Manuscript:\*\*.*)$/m, `$1\n${line}`);
  } else {
    text = `${line}\n\n${text}`;
  }
  const reviewLine = `- **Review sheet:** ${reviewSheetUrl}`;
  if (!/^- \*\*Review sheet:\*\*/m.test(text)) {
    text = text.replace(line, `${line}\n${reviewLine}`);
  } else {
    text = text.replace(/^- \*\*Review sheet:\*\*.*$/m, reviewLine);
  }
  writeFileSync(evalPath, text, "utf8");
}

export async function resolveSheetTitle(spreadsheetId, gid, token) {
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

function columnIndexForHeaders(headers, patterns, fallback) {
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] ?? "").trim();
    if (patterns.some((re) => re.test(h))) return i;
  }
  return fallback;
}

async function readReviewHeaders(spreadsheetId, sheetTitle, token) {
  const headerRange = encodeURIComponent(`${sheetTitle}!1:1`);
  const headerRes = await googleJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}`,
    { token }
  );
  const headers = headerRes.values?.[0] ?? [];
  const titleIdx = columnIndexForHeaders(headers, [/^title$/i, /^name$/i], 0);
  const linkIdx = columnIndexForHeaders(
    headers,
    [/google doc/i, /^doc$/i, /^doc url$/i, /^link$/i, /^url$/i],
    titleIdx === 0 ? 1 : 0
  );
  return { headers, titleIdx, linkIdx };
}

export async function appendReviewRow({ spreadsheetId, sheetTitle, title, docUrl, token }) {
  const { headers, titleIdx, linkIdx } = await readReviewHeaders(
    spreadsheetId,
    sheetTitle,
    token
  );

  const width = Math.max(headers.length, titleIdx + 1, linkIdx + 1, 2);
  const row = Array.from({ length: width }, () => "");
  row[titleIdx] = title;
  row[linkIdx] = docUrl;

  const appendRange = encodeURIComponent(`${sheetTitle}!A:Z`);
  await googleJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", token, body: { values: [row] } }
  );

  return { titleIdx, linkIdx, sheetTitle };
}

function columnLetter(index) {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Update an existing Review row whose Doc link contains replaceDocId. */
export async function replaceReviewRowDocUrl({
  spreadsheetId,
  sheetTitle,
  replaceDocId,
  title,
  docUrl,
  token,
}) {
  const { titleIdx, linkIdx } = await readReviewHeaders(spreadsheetId, sheetTitle, token);
  const dataRange = encodeURIComponent(`${sheetTitle}!A:Z`);
  const dataRes = await googleJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${dataRange}`,
    { token }
  );
  const rows = dataRes.values ?? [];
  let rowIndex = -1;
  for (let r = 1; r < rows.length; r++) {
    const cell = String(rows[r][linkIdx] ?? "");
    if (cell.includes(replaceDocId)) {
      rowIndex = r;
      break;
    }
  }
  if (rowIndex < 0) return false;

  const sheetRow = rowIndex + 1;
  const updates = [];
  if (title) {
    updates.push({
      range: `${sheetTitle}!${columnLetter(titleIdx)}${sheetRow}`,
      values: [[title]],
    });
  }
  updates.push({
    range: `${sheetTitle}!${columnLetter(linkIdx)}${sheetRow}`,
    values: [[docUrl]],
  });

  await googleJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: "POST",
      token,
      body: {
        valueInputOption: "USER_ENTERED",
        data: updates,
      },
    }
  );
  return true;
}

async function trashDriveFile(fileId, token) {
  await googleJson(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "PATCH",
    token,
    body: { trashed: true },
  });
}

async function uploadHtmlAsGoogleDoc({ title, html, folderId, token }) {
  const boundary = `doc_upload_${Date.now()}`;
  const metadata = {
    name: title,
    mimeType: "application/vnd.google-apps.document",
  };
  if (folderId) metadata.parents = [folderId];

  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;
  const multipartBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/html; charset=UTF-8\r\n\r\n" +
    html +
    closeDelimiter;

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `Drive HTML upload failed (${res.status}): ${json.error?.message || text}`
    );
  }
  if (!json.id) throw new Error("Drive upload response missing file id");

  return {
    docId: json.id,
    docUrl: `https://docs.google.com/document/d/${json.id}/edit`,
  };
}

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.body - Markdown manuscript
 * @param {string} [opts.folderId]
 * @param {string} opts.token
 */
export async function createDocWithBody({ title, body, folderId, token }) {
  const html = markdownToGoogleDocHtml(body);
  return uploadHtmlAsGoogleDoc({ title, html, folderId, token });
}

/**
 * @param {object} opts
 * @param {string} opts.manuscriptPath
 * @param {string} [opts.titleOverride]
 * @param {string} [opts.evalPath]
 * @param {string} opts.spreadsheetId
 * @param {number} opts.reviewGid
 * @param {string} [opts.folderId]
 * @param {string} opts.fallbackTitle
 * @param {string} opts.agentLabel - e.g. content/buyers-guide
 * @param {string} [opts.replaceDocId] - trash this Doc after delivery and update its Review row URL
 */
export async function deliverManuscriptToGoogleDoc(opts) {
  const md = readFileSync(opts.manuscriptPath, "utf8");
  const title = titleFromMarkdown(md, opts.titleOverride, opts.fallbackTitle);
  const token = await getAccessToken();
  const sheetTitle = await resolveSheetTitle(opts.spreadsheetId, opts.reviewGid, token);
  const { docId, docUrl } = await createDocWithBody({
    title,
    body: md,
    folderId: opts.folderId || undefined,
    token,
  });

  if (opts.replaceDocId) {
    const updated = await replaceReviewRowDocUrl({
      spreadsheetId: opts.spreadsheetId,
      sheetTitle,
      replaceDocId: opts.replaceDocId,
      title,
      docUrl,
      token,
    });
    if (!updated) {
      await appendReviewRow({
        spreadsheetId: opts.spreadsheetId,
        sheetTitle,
        title,
        docUrl,
        token,
      });
    }
    await trashDriveFile(opts.replaceDocId, token);
  } else {
    await appendReviewRow({
      spreadsheetId: opts.spreadsheetId,
      sheetTitle,
      title,
      docUrl,
      token,
    });
  }

  const reviewSheetUrl = `https://docs.google.com/spreadsheets/d/${opts.spreadsheetId}/edit#gid=${opts.reviewGid}`;
  if (opts.evalPath) {
    upsertEvalGoogleDocLine(opts.evalPath, docUrl, reviewSheetUrl);
  }

  return {
    title,
    docId,
    docUrl,
    spreadsheetId: opts.spreadsheetId,
    reviewTab: sheetTitle,
    reviewSheetUrl,
    replacedDocId: opts.replaceDocId || null,
  };
}
