#!/usr/bin/env node
/**
 * One-shot Google OAuth for Drive + Docs (user credentials, refresh token).
 *
 * Prerequisites (GCP):
 * - Enable Google Drive API, Google Docs API, and Google Sheets API on your project.
 * - OAuth consent screen with scopes this script requests (Drive, Docs, Sheets).
 *   drive.readonly is a restricted scope: on an external consent screen it needs
 *   verification, but an internal (Workspace-only) app can consent immediately.
 * - Create OAuth client ID type "Desktop app"; copy Client ID and Client Secret.
 *
 * Run (from repo root or anywhere) with **real** values from APIs & Services → Credentials
 * (Client ID looks like `123456789-xxxxx.apps.googleusercontent.com` — not the literal word "..."):
 *   GOOGLE_OAUTH_CLIENT_ID='123456789-xxxx.apps.googleusercontent.com' GOOGLE_OAUTH_CLIENT_SECRET='GOCSPX-xxxx' node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs
 *
 * Or put those two vars in `.env` and:
 *   set -a && source .env && set +a && node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs
 *
 * Import existing google-auth `token.pickle` (no browser; requires Python + `google-auth` / `oauth2client`):
 *   node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs --from-pickle /path/to/token.pickle
 * Or: GOOGLE_OAUTH_TOKEN_PICKLE=/path/to/token.pickle node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs
 * If the pickle has no `client_secret`, set GOOGLE_OAUTH_CLIENT_SECRET in the environment.
 * If `python3` lacks google-auth, use another interpreter:
 *   GOOGLE_OAUTH_PICKLE_PYTHON=/path/to/venv/bin/python node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs --from-pickle ...
 *
 * Prints lines to paste into `.env` (never commit `.env`).
 *
 * Troubleshooting — browser shows "Error 401: invalid_client" / "OAuth client was not found":
 * - You pasted a placeholder instead of the real Client ID (common if `…` or `...` was copied from docs).
 * - Wrong GCP project: open the client on Credentials page and confirm the ID matches env exactly (no spaces/quotes in value).
 * - Client was deleted or belongs to another Cloud project — create a new "Desktop app" OAuth client.
 */

import http from "node:http";
import { execFileSync, spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PICKLE_HELPER = join(SCRIPT_DIR, "google-oauth-credentials-from-pickle.py");

// drive.readonly is required to list or read a folder the integration did not
// create; drive.file alone only grants access to files this app made or that the
// user explicitly picked. Set GOOGLE_OAUTH_SKIP_DRIVE_READONLY=1 to request the
// narrower set when read-only access to existing Drive content is not needed.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  ...(process.env.GOOGLE_OAUTH_SKIP_DRIVE_READONLY ? [] : ["https://www.googleapis.com/auth/drive.readonly"]),
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/spreadsheets",
].join(" ");

const TIMEOUT_MS = 5 * 60 * 1000;

function requiredEnv(name) {
  const v = process.env[name];
  if (!v || String(v).trim() === "") {
    console.error(`Missing env ${name}. Set it and re-run.`);
    process.exit(1);
  }
  return String(v).trim();
}

/** Google OAuth 2.0 client IDs normally end with this suffix (Desktop or Web). */
const CLIENT_ID_SUFFIX = ".apps.googleusercontent.com";

const PLACEHOLDER_HINTS = [
  /^\.{3}$/,
  /^…+$/,
  /^your[-_]?client/i,
  /^xxx/i,
  /^changeme/i,
];

function parsePicklePathFromArgv() {
  const args = process.argv.slice(2);
  const i = args.indexOf("--from-pickle");
  if (i !== -1 && args[i + 1]) return args[i + 1].trim();
  return null;
}

function extractCredentialsFromPickle(picklePath) {
  const override = process.env.GOOGLE_OAUTH_PICKLE_PYTHON?.trim();
  const bins = override ? [override] : ["python3", "python"];
  let combinedErr = "";
  for (const bin of bins) {
    try {
      const stdout = execFileSync(bin, [PICKLE_HELPER, picklePath], {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
      });
      try {
        return JSON.parse(stdout.trim());
      } catch {
        console.error("Unexpected output from pickle helper (expected JSON):\n", stdout);
        process.exit(1);
      }
    } catch (e) {
      combinedErr += `${bin}: ${e.stderr?.toString?.() || e.message || e}\n`;
    }
  }
  console.error(
    "Could not run Python pickle helper. Use Python 3 with google-auth installed:\n  pip install google-auth google-auth-oauthlib\n\n",
    combinedErr
  );
  process.exit(1);
}

function printEnvLines(clientId, clientSecret, refreshToken) {
  console.error("\n--- Paste into .env (do not commit) ---\n");
  console.log(`GOOGLE_OAUTH_CLIENT_ID=${shellQuote(clientId)}`);
  console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${shellQuote(clientSecret)}`);
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${shellQuote(refreshToken)}`);
  console.error("\n--- Optional (already in .env.example for agents) ---");
  console.error("GOOGLE_DRIVE_URL_UPDATE_FOLDER_ID=<folder id from Drive URL>");
  console.error("\nAccess tokens expire; scripts should exchange refresh_token → access_token at runtime.");
}

function validateClientCredentials(clientId, clientSecret) {
  const problems = [];

  if (PLACEHOLDER_HINTS.some((re) => re.test(clientId))) {
    problems.push(
      `GOOGLE_OAUTH_CLIENT_ID looks like a placeholder. Paste the full Client ID from Google Cloud Console → Credentials (ends with ${CLIENT_ID_SUFFIX}).`
    );
  }
  if (!clientId.includes(CLIENT_ID_SUFFIX)) {
    problems.push(
      `GOOGLE_OAUTH_CLIENT_ID should end with "${CLIENT_ID_SUFFIX}". If yours differs, fix the value or create a Desktop OAuth client in GCP.`
    );
  }
  if (PLACEHOLDER_HINTS.some((re) => re.test(clientSecret))) {
    problems.push(
      "GOOGLE_OAUTH_CLIENT_SECRET looks like a placeholder. Copy the secret shown once when you create the OAuth client (often starts with GOCSPX-)."
    );
  }
  if (clientSecret.length < 16) {
    problems.push("GOOGLE_OAUTH_CLIENT_SECRET seems too short — confirm you copied the full client secret.");
  }

  if (problems.length) {
    console.error("\nCredential check failed:\n");
    for (const p of problems) console.error(`  - ${p}`);
    console.error(
      "\nIf Google already showed Error 401 invalid_client in the browser, the Client ID in the authorize URL was wrong or unknown to Google.\n"
    );
    process.exit(1);
  }
}

function openBrowser(url) {
  const bin = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  const child =
    process.platform === "win32"
      ? spawn("cmd", ["/c", "start", "", url], { stdio: "ignore", detached: true })
      : spawn(bin, [url], { stdio: "ignore", detached: true });
  child.unref();
}

async function exchangeCode({ clientId, clientSecret, code, redirectUri }) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error_description || json.error || JSON.stringify(json);
    throw new Error(`Token exchange failed (${res.status}): ${msg}`);
  }
  return json;
}

function mainFromPickle(picklePath) {
  const expanded = picklePath.trim();
  const data = extractCredentialsFromPickle(expanded);
  const clientId = String(data.client_id || "").trim();
  let clientSecret = String(data.client_secret || "").trim();
  const refreshToken = String(data.refresh_token || "").trim();

  if (!refreshToken) {
    console.error("Pickle JSON missing refresh_token.");
    process.exit(1);
  }
  if (!clientId) {
    console.error("Pickle JSON missing client_id; set GOOGLE_OAUTH_CLIENT_ID.");
    process.exit(1);
  }
  if (!clientSecret) {
    clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
      ? String(process.env.GOOGLE_OAUTH_CLIENT_SECRET).trim()
      : "";
    if (!clientSecret) {
      console.error(
        "Pickle has no client_secret. Set GOOGLE_OAUTH_CLIENT_SECRET in the environment and re-run."
      );
      process.exit(1);
    }
  }

  validateClientCredentials(clientId, clientSecret);
  console.error(`Imported OAuth fields from pickle (${data._pickle_type || "unknown type"}).\n`);
  printEnvLines(clientId, clientSecret, refreshToken);
}

function mainInteractive() {
  const clientId = requiredEnv("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = requiredEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  validateClientCredentials(clientId, clientSecret);

  const server = http.createServer();
  server.listen(0, "127.0.0.1", () => {
    const addr = server.address();
    if (!addr || typeof addr === "string") {
      console.error("Could not bind loopback server.");
      process.exit(1);
    }
    const port = addr.port;
    const redirectUri = `http://127.0.0.1:${port}/oauth2/callback`;

    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: SCOPES,
      access_type: "offline",
      prompt: "consent",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

    const timer = setTimeout(() => {
      console.error("\nTimed out waiting for OAuth redirect. Close this and try again.");
      server.close();
      process.exit(1);
    }, TIMEOUT_MS);

    server.on("request", async (req, res) => {
      const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
      if (url.pathname !== "/oauth2/callback") {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
        return;
      }

      const err = url.searchParams.get("error");
      const code = url.searchParams.get("code");

      const html = (title, bodyHtml) =>
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${bodyHtml}</body></html>`;

      if (err) {
        const desc = url.searchParams.get("error_description") || err;
        res.writeHead(400, { "content-type": "text/html; charset=utf-8" });
        res.end(html("OAuth error", `<p>Authorization failed: ${escapeHtml(desc)}</p><p>You can close this tab.</p>`));
        clearTimeout(timer);
        server.close();
        console.error("\nOAuth error:", desc);
        process.exit(1);
        return;
      }

      if (!code) {
        res.writeHead(400, { "content-type": "text/html; charset=utf-8" });
        res.end(html("OAuth error", "<p>Missing <code>code</code>. Close this tab and try again.</p>"));
        return;
      }

      try {
        const tokens = await exchangeCode({
          clientId,
          clientSecret,
          code,
          redirectUri,
        });

        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(
          html(
            "Success",
            "<p>Authorization complete. You can close this tab and return to the terminal.</p>"
          )
        );

        clearTimeout(timer);
        server.close();

        const refresh = tokens.refresh_token;
        if (!refresh) {
          console.error(
            "\nNo refresh_token in response. Revoke app access at https://myaccount.google.com/permissions then run again with prompt=consent (this script already sets it)."
          );
          console.error("Raw response:", JSON.stringify(tokens, null, 2));
          process.exit(1);
        }

        printEnvLines(clientId, clientSecret, refresh);
      } catch (e) {
        res.writeHead(500, { "content-type": "text/html; charset=utf-8" });
        res.end(html("Token exchange failed", `<pre>${escapeHtml(String(e.message))}</pre>`));
        clearTimeout(timer);
        server.close();
        console.error(e);
        process.exit(1);
      }
    });

    console.error(`Loopback redirect: ${redirectUri}`);
    console.error("(GCP OAuth client type must be Desktop app so loopback redirects work.)\n");
    console.error("Opening browser. If it does not open, visit:\n");
    console.error(authUrl);
    console.error("");
    openBrowser(authUrl);
  });
}

function main() {
  const fromArg = parsePicklePathFromArgv();
  const fromEnv = process.env.GOOGLE_OAUTH_TOKEN_PICKLE?.trim();
  const picklePath = fromArg || fromEnv;
  if (picklePath) {
    mainFromPickle(picklePath);
    return;
  }
  mainInteractive();
}

function shellQuote(v) {
  if (/^[a-zA-Z0-9_.~-]+$/.test(v)) return v;
  return `'${String(v).replace(/'/g, `'\\''`)}'`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main();
