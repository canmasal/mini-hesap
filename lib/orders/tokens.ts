import crypto from "crypto";

/**
 * Siparişe özel indirme jetonu.
 *
 * Önceki sistemde tek bir sabit anahtar (PREMIUM_DOWNLOAD_SECRET) vardı;
 * bir kez sızdığında herkes tüm ürünleri sonsuza kadar indirebiliyordu.
 *
 * Bu jeton:
 *  - yalnızca tek bir sipariş ve tek bir ürün için geçerlidir,
 *  - son kullanma tarihi taşır,
 *  - HMAC ile imzalıdır, sunucu tarafında tekrar üretilerek doğrulanır,
 *  - veritabanı gerektirmez (imza kendi kendini doğrular).
 */

function secret() {
  const s = process.env.DOWNLOAD_SIGNING_SECRET;

  if (!s || s.length < 24) {
    throw new Error(
      "DOWNLOAD_SIGNING_SECRET tanımlı değil veya çok kısa (en az 24 karakter olmalı)."
    );
  }

  return s;
}

export type TokenPayload = {
  orderId: string;
  productSlug: string;
  /** Unix saniye */
  exp: number;
};

function sign(data: string) {
  return crypto
    .createHmac("sha256", secret())
    .update(data)
    .digest("base64url");
}

/** İmzalı indirme jetonu üretir. */
export function createDownloadToken(payload: TokenPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

/**
 * Jetonu doğrular. Geçersiz, bozulmuş veya süresi dolmuş jetonlarda null döner.
 * İmza karşılaştırması sabit sürelidir.
 */
export function verifyDownloadToken(token: string): TokenPayload | null {
  if (!token || !token.includes(".")) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (
    typeof payload.orderId !== "string" ||
    typeof payload.productSlug !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }

  if (payload.exp * 1000 < Date.now()) return null;

  return payload;
}

/** Tahmin edilemez, URL'de kullanılabilir sipariş kimliği. */
export function newOrderId() {
  return crypto.randomBytes(12).toString("base64url");
}

/** Ödeme sağlayıcısı imzalarını doğrulamak için sabit süreli karşılaştırma. */
export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a ?? "");
  const bb = Buffer.from(b ?? "");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
