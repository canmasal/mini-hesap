import { requestStatusAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { getProgramRequestStore } from "@/lib/requests/store";
import type { ProgramRequestStatus } from "@/lib/requests/types";

const STATUS_LABEL: Record<ProgramRequestStatus, string> = {
  yeni: "Yeni",
  inceleniyor: "İnceleniyor",
  tamamlandi: "Tamamlandı",
};

const dateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" })
    : "—";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ mesaj?: string }>;
}) {
  await requireAdmin();
  const { mesaj } = await searchParams;

  const requests = await getProgramRequestStore().list(200).catch(() => []);

  return (
    <>
      <h1>Program talepleri</h1>
      <p className="admin-lead">/program-talebi formundan gelen istekler.</p>

      {mesaj && <div className="admin-alert ok">{mesaj}</div>}

      {requests.length === 0 && <div className="admin-box">Talep yok.</div>}

      {requests.map((r) => (
        <div key={r.id} className="admin-box">
          <div className="admin-field-head">
            <span className={`admin-badge ${r.status}`}>{STATUS_LABEL[r.status] ?? r.status}</span>
            <strong>{r.name}</strong>
            <small>
              <a href={`mailto:${r.email}`}>{r.email}</a>
              {r.phone ? ` · ${r.phone}` : ""} · {dateTime(r.createdAt)} · {r.category}
            </small>
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>{r.description}</p>
          {r.aiSummary && (
            <p className="admin-field-hint">
              <strong>Özet:</strong> {r.aiSummary}
            </p>
          )}
          <div className="admin-toolbar" style={{ marginBottom: 0 }}>
            {(Object.keys(STATUS_LABEL) as ProgramRequestStatus[])
              .filter((s) => s !== r.status)
              .map((s) => (
                <form key={s} action={requestStatusAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="durum" value={s} />
                  <button className="admin-btn ghost small" type="submit">{STATUS_LABEL[s]} yap</button>
                </form>
              ))}
            {r.marketingConsent === false && <small className="admin-field-hint">Pazarlama izni yok</small>}
          </div>
        </div>
      ))}
    </>
  );
}
