/*
 * Cloudflare Worker entrypoint.
 * - Serves the static SPA from the [assets] binding.
 * - /api/state : tiny passphrase-gated cross-device sync, backed by KV (binding
 *   SYNC). Your whole tracker state is stored as ONE JSON blob, keyed by a hash
 *   of your passphrase, so only someone with the passphrase can read/write it.
 *   If the SYNC KV binding isn't configured yet, the endpoint returns 503 and the
 *   app just keeps working locally (offline-first).
 */
const enc = new TextEncoder();

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}

async function keyHash(pass) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode("xbc100:" + pass));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function handleState(request, env) {
  if (!env.SYNC) return json({ ok: false, error: "sync-not-configured" }, 503);
  const pass = request.headers.get("x-sync-key") || "";
  if (pass.length < 6) return json({ ok: false, error: "passphrase-too-short" }, 400);
  const k = "s:" + (await keyHash(pass));

  if (request.method === "GET") {
    const v = await env.SYNC.get(k);
    return json({ ok: true, state: v ? JSON.parse(v) : null });
  }
  if (request.method === "PUT" || request.method === "POST") {
    const body = await request.text();
    if (body.length > 512 * 1024) return json({ ok: false, error: "too-large" }, 413);
    let obj;
    try { obj = JSON.parse(body); } catch (e) { return json({ ok: false, error: "bad-json" }, 400); }
    if (!obj.updatedAt) obj.updatedAt = Date.now();
    await env.SYNC.put(k, JSON.stringify(obj));
    return json({ ok: true, updatedAt: obj.updatedAt });
  }
  return json({ ok: false, error: "method-not-allowed" }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/state") return handleState(request, env);
    if (url.pathname.startsWith("/api/")) return json({ ok: false, error: "not-found" }, 404);
    return env.ASSETS.fetch(request);
  }
};
