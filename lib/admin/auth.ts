import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Yönetim paneli oturumu.
 *
 * Tek yönetici şifresi Vercel ortam değişkeninde (ADMIN_PANEL_PASSWORD)
 * durur; kodda veya depoda şifre yoktur. Giriş başarılı olunca HMAC ile
 * imzalı, süreli, httpOnly bir çerez verilir. İmza anahtarı şifreden
 * türetilir: şifre değişince tüm açık oturumlar kendiliğinden kapanır.
 */

export const SESSION_COOKIE = "mh_yonetim";
const SESSION_HOURS = 12;
const MIN_PASSWORD_LENGTH = 12;

function password() {
  const p = process.env.ADMIN_PANEL_PASSWORD ?? "";
  return p.length >= MIN_PASSWORD_LENGTH ? p : null;
}

/** Panel, yeterince uzun bir şifre tanımlıysa etkindir. */
export function adminEnabled() {
  return password() !== null;
}

function key() {
  const p = password();
  if (!p) throw new Error("Yönetim paneli etkin değil.");
  return crypto.createHash("sha256").update(`minihesap-yonetim:${p}`).digest();
}

function sign(data: string) {
  return crypto.createHmac("sha256", key()).update(data).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  const p = password();
  if (!p) return false;
  return safeEqual(input, p);
}

export function createSessionValue() {
  const body = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_HOURS * 3600 })
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_HOURS * 3600,
};

function validSession(value: string | undefined) {
  if (!value || !adminEnabled()) return false;
  const [body, sig] = value.split(".");
  if (!body || !sig) return false;
  if (!safeEqual(sig, sign(body))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const store = await cookies();
  return validSession(store.get(SESSION_COOKIE)?.value);
}

/** Sayfa ve sunucu eylemlerinde kullanılır; oturum yoksa girişe yönlendirir. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/yonetim/giris");
}

/* Basit kaba kuvvet freni: aynı IP'den art arda hatalı denemeleri yavaşlatır. */
const failures = new Map<string, { count: number; until: number }>();

export function loginBlocked(ip: string) {
  const f = failures.get(ip);
  return Boolean(f && f.count >= 5 && f.until > Date.now());
}

export function recordFailure(ip: string) {
  const f = failures.get(ip);
  const count = f && f.until > Date.now() ? f.count + 1 : 1;
  failures.set(ip, { count, until: Date.now() + 15 * 60 * 1000 });
}

export function clearFailures(ip: string) {
  failures.delete(ip);
}
