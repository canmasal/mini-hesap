import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { githubEnabled, recentCommits } from "@/lib/admin/github";
import { getOrderStore, orderStoreKind } from "@/lib/orders/store";
import { getProgramRequestStore } from "@/lib/requests/store";
import { LAST_VERIFIED, PARAMETERS_YEAR } from "@/data/parameters";

const dateTime = (iso: string) =>
  iso
    ? new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" })
    : "";

export default async function AdminHomePage() {
  await requireAdmin();

  const [orders, requests, commits] = await Promise.all([
    getOrderStore().list(200).catch(() => []),
    getProgramRequestStore().list(200).catch(() => []),
    githubEnabled() ? recentCommits(8) : Promise.resolve([]),
  ]);

  const pendingOrders = orders.filter((o) => o.status === "bekliyor").length;
  const newRequests = requests.filter((r) => r.status === "yeni").length;
  const storeKind = orderStoreKind();

  return (
    <>
      <h1>Özet</h1>
      <p className="admin-lead">
        Resmî rakamlar {PARAMETERS_YEAR} yılı, son kontrol {LAST_VERIFIED.split("-").reverse().join(".")}.
      </p>

      {!githubEnabled() && (
        <div className="admin-alert warn">
          İçerik düzenleme kapalı: Vercel ortam değişkenlerine <code>GITHUB_TOKEN</code> eklenmeli
          (yalnızca canmasal/mini-hesap deposunda &quot;Contents: Read and write&quot; yetkili, ince taneli anahtar).
        </div>
      )}
      {storeKind === "dosya" && (
        <div className="admin-alert warn">
          Sipariş ve talepler kalıcı veritabanına bağlı değil (SUPABASE_URL / SUPABASE_SERVICE_KEY eksik).
        </div>
      )}

      <div className="admin-grid">
        <Link className="admin-tile" href="/yonetim/siparisler">
          <b>{pendingOrders}</b>
          <strong>Ödeme bekleyen sipariş</strong>
          <span>Toplam {orders.length} sipariş</span>
        </Link>
        <Link className="admin-tile" href="/yonetim/talepler">
          <b>{newRequests}</b>
          <strong>Yeni program talebi</strong>
          <span>Toplam {requests.length} talep</span>
        </Link>
        <Link className="admin-tile" href="/yonetim/dosya?yol=data%2Fparameters.ts">
          <strong>Resmî rakamlar</strong>
          <span>Asgari ücret, kira artışı, kredi kartı faizi, vergi dilimleri…</span>
        </Link>
        <Link className="admin-tile" href="/yonetim/icerik">
          <strong>İçerik ve SEO</strong>
          <span>Sayfa başlıkları, açıklamalar, rehber yazıları, araç metinleri</span>
        </Link>
      </div>

      <h2>Son değişiklikler</h2>
      <div className="admin-box">
        {commits.length === 0 ? (
          <p className="admin-lead">Gösterilecek kayıt yok.</p>
        ) : (
          <table className="admin-table">
            <tbody>
              {commits.map((c) => (
                <tr key={c.sha}>
                  <td style={{ whiteSpace: "nowrap" }}>{dateTime(c.date)}</td>
                  <td>
                    <a href={c.url} target="_blank" rel="noopener noreferrer">{c.message}</a>
                  </td>
                  <td className="admin-code">{c.sha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="admin-field-hint" style={{ marginBottom: 0 }}>
          Panelden kaydedilen her değişiklik burada commit olarak görünür; site 1–2 dakika içinde
          yeniden yayınlanır. Derleme hata verirse eski sürüm yayında kalır.
        </p>
      </div>
    </>
  );
}
