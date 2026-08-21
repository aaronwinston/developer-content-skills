/**
 * OAuth access token for Google Drive, Docs, and Sheets.
 *
 * Resolution order:
 * 1. GOOGLE_OAUTH_CLIENT_ID + GOOGLE_OAUTH_CLIENT_SECRET + GOOGLE_OAUTH_REFRESH_TOKEN (.env)
 * 2. .agents/agents/content/update-agent/.credentials/token_unified.json (same as update-agent)
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LIB_DIR = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_TOKEN_UNIFIED_PATH = join(
  LIB_DIR,
  "../../../../agents/content/update-agent/.credentials/token_unified.json",
);

function optionalEnv(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : "";
}

export function loadGoogleOAuthCredentials() {
  const clientId = optionalEnv("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = optionalEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  const refreshToken = optionalEnv("GOOGLE_OAUTH_REFRESH_TOKEN");

  if (clientId && clientSecret && refreshToken) {
    return {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      token_uri: "https://oauth2.googleapis.com/token",
      source: "env",
    };
  }

  const tokenPath = optionalEnv("GOOGLE_OAUTH_TOKEN_UNIFIED_PATH") || DEFAULT_TOKEN_UNIFIED_PATH;
  if (!existsSync(tokenPath)) {
    throw new Error(
      "Google OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and " +
        "GOOGLE_OAUTH_REFRESH_TOKEN in .env, or place token_unified.json at " +
        ".agents/agents/content/update-agent/.credentials/token_unified.json (see that folder's README).",
    );
  }

  const unified = JSON.parse(readFileSync(tokenPath, "utf8"));
  const fromFile = {
    client_id: String(unified.client_id || "").trim(),
    client_secret: String(unified.client_secret || "").trim(),
    refresh_token: String(unified.refresh_token || "").trim(),
    token_uri: String(unified.token_uri || "https://oauth2.googleapis.com/token").trim(),
    source: tokenPath,
  };

  if (!fromFile.client_id || !fromFile.client_secret || !fromFile.refresh_token) {
    throw new Error(`token_unified.json at ${tokenPath} is missing client_id, client_secret, or refresh_token.`);
  }

  return fromFile;
}

/** @deprecated use loadGoogleOAuthCredentials */
export function loadGoogleOAuthEnv() {
  return loadGoogleOAuthCredentials();
}

/** @returns {Promise<string>} */
export async function getAccessToken() {
  const unified = loadGoogleOAuthCredentials();
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
  const json = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = json.error_description || json.error || JSON.stringify(json);
    throw new Error(`Token refresh failed (${r.status}): ${msg}`);
  }
  if (!json.access_token) throw new Error("Token response missing access_token");
  return json.access_token;
}

/** @returns {Promise<string>} */
export async function getAccessTokenFromEnv() {
  return getAccessToken();
}

export async function googleJson(url, { method = "GET", token, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${url} failed (${res.status}): ${json.error?.message || text}`);
  }
  return json;
}
