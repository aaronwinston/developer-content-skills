/**
 * Convert a subset of Markdown (content-agent manuscripts) to HTML for
 * Google Drive import (multipart upload → application/vnd.google-apps.document).
 */

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineHtml(text) {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/_([^_]+)_/g, "<em>$1</em>");
  return s;
}

function isTableSeparator(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return [];
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

function renderTable(tableLines) {
  const dataRows = tableLines.filter((l) => !isTableSeparator(l));
  if (!dataRows.length) return "";

  const rows = dataRows.map(parseTableRow);
  const [header, ...body] = rows;

  let html = '<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%">';
  html += "<thead><tr>";
  for (const cell of header) {
    html += `<th>${inlineHtml(cell)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const row of body) {
    html += "<tr>";
    for (const cell of row) {
      html += `<td>${inlineHtml(cell)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table>";
  return html;
}

/**
 * @param {string} md
 * @returns {string} Full HTML document
 */
export function markdownToGoogleDocHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (/^\|/.test(line.trim())) {
      const tableLines = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(renderTable(tableLines));
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${inlineHtml(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ""));
        i++;
      }
      blocks.push(
        `<ul>${items.map((it) => `<li>${inlineHtml(it)}</li>`).join("")}</ul>`
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        `<ol>${items.map((it) => `<li>${inlineHtml(it)}</li>`).join("")}</ol>`
      );
      continue;
    }

    const para = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3}\s|-\s|\d+\.\s|\|)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(`<p>${inlineHtml(para.join(" "))}</p>`);
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
  table { margin: 12px 0; }
  th { background: #f3f3f3; font-weight: bold; text-align: left; }
  h1 { font-size: 20pt; }
  h2 { font-size: 14pt; margin-top: 18px; }
  h3 { font-size: 12pt; margin-top: 14px; }
</style>
</head>
<body>
${blocks.join("\n")}
</body>
</html>`;
}
