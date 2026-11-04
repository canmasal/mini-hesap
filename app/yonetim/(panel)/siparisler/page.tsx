import Link from "next/link";

import { orderAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { getOrderStore } from "@/lib/orders/store";
import type { OrderStatus } from "@/lib/orders/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  bekliyor: "Ödeme bekliyor",
  odendi: "Ödendi",
  basarisiz: "İptal / başarısız",
  iade: "İade",
};

const dateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" })
    : "—";

const money = (kurus: number) =>
  (kurus / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ mesaj?: string; durum?: string }>;
}) {
  await requireAdmin();
  const { mesaj, durum } = await searchParams;

  const all = await getOrderStore().list(300).catch(() => []);
  const orders = durum ? all.filter((o) => o.status === durum) : all;

  return (
    <>
      <h1>Siparişler</h1>
      <p className="admin-lead">
        Havale/EFT siparişinde dekontu gördükten sonra &quot;Onayla&quot;ya basın; müşterinin indirme
        hakkı açılır ve e-posta gönderilir.
      </p>

      {mesaj && <div className="admin-alert ok">{mesaj}</div>}

      <div className="admin-toolbar">
        <Link className={`admin-btn small ${durum ? "ghost" : ""}`} href="/yonetim/siparisler">Tümü ({all.length})</Link>
        {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
          <Link key={s} className={`admin-btn small ${durum === s ? "" : "ghost"}`} href={`/yonetim/siparisler?durum=${s}`}>
            {STATUS_LABEL[s]} ({all.filter((o) => o.status === s).length})
          </Link>
        ))}
      </div>

      <div className="admin-box admin-table-wrap">
        {orders.length === 0 ? (
          <p className="admin-lead">Sipariş yok.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Sipariş</th>
                <th>Müşteri</th>
                <th>Ürün</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>İndirme</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{dateTime(o.createdAt)}</td>
                  <td className="admin-code">
                    <a href={`/siparis/${o.id}`} target="_blank" rel="noopener noreferrer">{o.id}</a>
                    <div className="admin-field-hint">{o.provider}</div>
                  </td>
                  <td>
                    {o.fullName}
                    <div className="admin-field-hint">{o.email}{o.phone ? ` · ${o.phone}` : ""}</div>
                  </td>
                  <td>{o.productTitle}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{money(o.amountKurus)}</td>
                  <td>
                    <span className={`admin-badge ${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
                    {o.paidAt && <div className="admin-field-hint">{dateTime(o.paidAt)}</div>}
                  </td>
                  <td>
                    {o.downloadCount ?? 0} kez
                    {o.downloadExpiresAt && (
                      <div className="admin-field-hint">son: {dateTime(o.downloadExpiresAt)}</div>
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {o.status !== "odendi" && (
                      <form action={orderAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <input type="hidden" name="islem" value="onayla" />
                        <button className="admin-btn small" type="submit">Onayla</button>
                      </form>
                    )}{" "}
                    {o.status === "bekliyor" && (
                      <form action={orderAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <input type="hidden" name="islem" value="iptal" />
                        <button className="admin-btn ghost small" type="submit">İptal</button>
                      </form>
                    )}{" "}
                    {o.status === "odendi" && (
                      <form action={orderAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <input type="hidden" name="islem" value="iade" />
                        <button className="admin-btn danger small" type="submit">İade et</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
