"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  SESSION_COOKIE,
  adminEnabled,
  checkPassword,
  clearFailures,
  createSessionValue,
  loginBlocked,
  recordFailure,
  requireAdmin,
  sessionCookieOptions,
} from "@/lib/admin/auth";
import { findEditableFile, visibleFields } from "@/lib/admin/files";
import { readRepoFile, writeRepoFile } from "@/lib/admin/github";
import { applyChanges, extractFields, type FieldChange } from "@/lib/admin/literals";
import { getOrderStore } from "@/lib/orders/store";
import { confirmOrderPayment } from "@/lib/orders/confirm";
import { getProgramRequestStore } from "@/lib/requests/store";
import type { ProgramRequestStatus } from "@/lib/requests/types";
import { ENV_SITE_URL, SITE_URL } from "@/lib/site";

async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "bilinmiyor";
}

/* ------------------------------------------------------------------ */
/* Giriş / çıkış                                                       */
/* ------------------------------------------------------------------ */

export async function loginAction(formData: FormData) {
  if (!adminEnabled()) redirect("/yonetim/giris?hata=kapali");

  const ip = await clientIp();
  if (loginBlocked(ip)) redirect("/yonetim/giris?hata=bekle");

  const password = String(formData.get("sifre") ?? "");
  if (!checkPassword(password)) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 800));
    redirect("/yonetim/giris?hata=sifre");
  }

  clearFailures(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions);
  redirect("/yonetim");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/yonetim/giris");
}

/* ------------------------------------------------------------------ */
/* İçerik düzenleme                                                    */
/* ------------------------------------------------------------------ */

function back(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ yol: path, ...params });
  return `/yonetim/dosya?${qs.toString()}`;
}

function commitMessage(title: string, note: string) {
  const first = `Yönetim paneli: ${title} güncellendi`;
  const clean = note.replace(/\r/g, "").trim().slice(0, 500);
  return clean ? `${first}\n\n${clean}` : first;
}

export async function saveFieldsAction(formData: FormData) {
  await requireAdmin();

  const path = String(formData.get("yol") ?? "");
  const file = findEditableFile(path);
  if (!file) redirect("/yonetim/icerik");

  const sha = String(formData.get("sha") ?? "");
  const note = String(formData.get("not") ?? "");
  let changes: FieldChange[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("degisiklikler") ?? "[]"));
    changes = Array.isArray(parsed)
      ? parsed.map((c) => ({
          start: Number(c.start),
          kind: c.kind,
          original: String(c.original),
          value: String(c.value),
        }))
      : [];
  } catch {
    redirect(back(path, { hata: "Değişiklik listesi okunamadı." }));
  }

  if (changes.length === 0) redirect(back(path, { hata: "Değişiklik yok." }));

  let target = "";
  try {
    const current = await readRepoFile(path);
    if (current.sha !== sha) {
      throw new Error("Dosya siz düzenlerken değişmiş. Sayfayı yenileyip değişikliklerinizi tekrar yapın.");
    }

    // Yalnızca bu dosyada panelde görünen alanlar değiştirilebilir
    const allowed = new Set(visibleFields(file, extractFields(current.content)).map((f) => f.start));
    if (changes.some((c) => !allowed.has(c.start))) {
      throw new Error("Bu alan panelden değiştirilemez.");
    }

    const next = applyChanges(current.content, changes);
    if (next === current.content) throw new Error("Değişiklik yok.");

    const result = await writeRepoFile(path, next, sha, commitMessage(file.title, note));
    target = back(path, { kaydedildi: result.commitSha.slice(0, 7) });
  } catch (error) {
    target = back(path, { hata: error instanceof Error ? error.message : "Kaydedilemedi." });
  }
  redirect(target);
}

export async function saveRawAction(formData: FormData) {
  await requireAdmin();

  const path = String(formData.get("yol") ?? "");
  const file = findEditableFile(path);
  if (!file) redirect("/yonetim/icerik");

  const sha = String(formData.get("sha") ?? "");
  const note = String(formData.get("not") ?? "");
  const content = String(formData.get("icerik") ?? "").replace(/\r\n/g, "\n");

  let target = "";
  try {
    if (!content.trim()) throw new Error("Dosya boş kaydedilemez.");
    if (content.includes("\0")) throw new Error("Dosyada geçersiz karakter var.");

    const current = await readRepoFile(path);
    if (current.sha !== sha) {
      throw new Error("Dosya siz düzenlerken değişmiş. Sayfayı yenileyip tekrar deneyin.");
    }
    if (current.content === content) throw new Error("Değişiklik yok.");

    const result = await writeRepoFile(path, content, sha, commitMessage(`${file.title} (gelişmiş)`, note));
    target = back(path, { kaydedildi: result.commitSha.slice(0, 7) });
  } catch (error) {
    target = `${back(path, { hata: error instanceof Error ? error.message : "Kaydedilemedi." })}&mod=gelismis`;
  }
  redirect(target);
}

/* ------------------------------------------------------------------ */
/* Siparişler ve talepler                                              */
/* ------------------------------------------------------------------ */

export async function orderAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("islem") ?? "");
  const store = getOrderStore();
  const order = await store.get(id);

  let message = "";
  if (!order) {
    message = "Sipariş bulunamadı.";
  } else if (action === "onayla") {
    if (order.status === "odendi") {
      message = `${id} zaten onaylı.`;
    } else {
      const { emailSent } = await confirmOrderPayment(order, ENV_SITE_URL ?? SITE_URL);
      message = `${id} onaylandı.${emailSent ? " Müşteriye e-posta gönderildi." : " E-posta gönderilemedi; müşteriye bağlantıyı elle iletin."}`;
    }
  } else if (action === "iptal") {
    await store.update(id, { status: "basarisiz" });
    message = `${id} iptal edildi.`;
  } else if (action === "iade") {
    await store.update(id, { status: "iade" });
    message = `${id} iade olarak işaretlendi; indirme kapatıldı.`;
  } else {
    message = "Geçersiz işlem.";
  }

  revalidatePath("/yonetim/siparisler");
  redirect(`/yonetim/siparisler?mesaj=${encodeURIComponent(message)}`);
}

const REQUEST_STATUSES: ProgramRequestStatus[] = ["yeni", "inceleniyor", "tamamlandi"];

export async function requestStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("durum") ?? "") as ProgramRequestStatus;
  if (!REQUEST_STATUSES.includes(status)) redirect("/yonetim/talepler");

  const ok = await getProgramRequestStore().setStatus(id, status);
  revalidatePath("/yonetim/talepler");
  redirect(`/yonetim/talepler?mesaj=${encodeURIComponent(ok ? "Durum güncellendi." : "Güncellenemedi.")}`);
}
