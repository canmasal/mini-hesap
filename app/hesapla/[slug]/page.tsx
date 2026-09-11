import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import { longtailPages, findLongtail, neighbours } from "@/data/longtail";
import {
  netSalaryOf,
  kdvTableOf,
  loanTableOf,
  money,
} from "@/lib/calculations/longtail";

export function generateStaticParams() {
  return longtailPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findLongtail(slug);

  if (!page) return { title: "Sayfa bulunamadı" };

  return {
    title: page.metaTitle,
    description: page.description,
    alternates: { canonical: `/hesapla/${slug}` },
  };
}

/* Ortak tablo hücre stilleri */
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "2px solid var(--line)",
  fontSize: 13,
};
const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid var(--line-soft)",
  fontVariantNumeric: "tabular-nums",
};
const tdNum: React.CSSProperties = { ...td, textAlign: "right", whiteSpace: "nowrap" };

export default async function LongtailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findLongtail(slug);

  if (!page) notFound();

  const others = neighbours(page);

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hesaplamalar", href: "/hesaplamalar" },
            { label: page.question },
          ]}
        />

        <div style={{ maxWidth: 800 }}>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)" }}>
            {page.question}
          </h1>

          {/* ================= NET MAAŞ ================= */}
          {page.kind === "net-maas" && (
            <NetSalaryBlock gross={page.input.gross} />
          )}

          {/* ================= KDV ================= */}
          {page.kind === "kdv" && <KdvBlock amount={page.input.amount} />}

          {/* ================= KREDİ ================= */}
          {page.kind === "kredi" && (
            <LoanBlock amount={page.input.amount} months={page.input.months} />
          )}

          <div style={{ marginTop: 26 }}>
            <AdSlot position="middle" />
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 22,
              borderRadius: "var(--r-lg)",
              background: "var(--surface-mint)",
              border: "1px solid var(--brand-line)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: 19 }}>
              Kendi rakamlarınızla hesaplayın
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Bu sayfa sabit bir tutar için hazırlandı. Farklı değerler
              denemek için tam hesaplayıcıyı kullanın.
            </p>
            <Link className="btn btn-green" href={`/hesaplamalar/${page.tool}`}>
              Hesaplayıcıyı Aç →
            </Link>
          </div>

          {others.length > 0 && (
            <section style={{ marginTop: 34 }}>
              <h2 style={{ fontSize: 20 }}>Benzer hesaplamalar</h2>
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 10,
                  listStyle: "none",
                  padding: 0,
                  marginTop: 14,
                }}
              >
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/hesapla/${o.slug}`}
                      style={{
                        display: "block",
                        padding: "12px 14px",
                        borderRadius: "var(--r-sm)",
                        background: "var(--surface)",
                        border: "1px solid var(--line)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {o.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="notice notice-warn" style={{ marginTop: 26 }}>
            <strong>Bilgilendirme:</strong> Sonuçlar dönemin genel oranlarına
            göre hesaplanan <strong>tahmini</strong> değerlerdir. Vergi
            dilimi, istisna tutarları ve banka koşulları kişiye göre değişir;
            resmî bordro veya banka hesabı yerine geçmez.
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   NET MAAŞ BLOĞU
========================================================= */
function NetSalaryBlock({ gross }: { gross: number }) {
  const r = netSalaryOf(gross);

  return (
    <>
      <div
        style={{
          marginTop: 22,
          padding: 26,
          borderRadius: "var(--r-lg)",
          background: "var(--surface-mint)",
          border: "1px solid var(--brand-line)",
        }}
      >
        <div style={{ color: "var(--muted)", fontSize: 14, fontWeight: 700 }}>
          {money(gross)} brüt maaşın tahmini neti
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: "clamp(30px, 6vw, 44px)",
            fontWeight: 900,
            color: "var(--brand-deep)",
          }}
        >
          {money(r.net)}
        </div>
      </div>

      <h2 style={{ marginTop: 30 }}>Kesinti dökümü</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={td}>Brüt ücret</td>
              <td style={tdNum}>{money(r.gross)}</td>
            </tr>
            <tr>
              <td style={td}>SGK işçi payı (%14)</td>
              <td style={tdNum}>− {money(r.sgk)}</td>
            </tr>
            <tr>
              <td style={td}>İşsizlik sigortası (%1)</td>
              <td style={tdNum}>− {money(r.unemployment)}</td>
            </tr>
            <tr>
              <td style={td}>Gelir vergisi matrahı</td>
              <td style={tdNum}>{money(r.taxBase)}</td>
            </tr>
            <tr>
              <td style={td}>Gelir vergisi (istisna düşülmüş)</td>
              <td style={tdNum}>− {money(r.incomeTax)}</td>
            </tr>
            <tr>
              <td style={td}>Damga vergisi (istisna düşülmüş)</td>
              <td style={tdNum}>− {money(r.stampTax)}</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 800 }}>Toplam kesinti</td>
              <td style={{ ...tdNum, fontWeight: 800 }}>
                − {money(r.totalDeduction)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  ...td,
                  fontWeight: 900,
                  color: "var(--brand-deep)",
                  fontSize: 16,
                }}
              >
                Net maaş
              </td>
              <td
                style={{
                  ...tdNum,
                  fontWeight: 900,
                  color: "var(--brand-deep)",
                  fontSize: 16,
                }}
              >
                {money(r.net)}
              </td>
            </tr>
            <tr>
              <td style={td}>İşverene toplam maliyeti</td>
              <td style={tdNum}>{money(r.employerCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ color: "var(--ink-soft)", lineHeight: 1.8, marginTop: 18 }}>
        Bu hesap yılın ilk aylarındaki (%15 vergi dilimi) duruma göre
        yapılmıştır. Kümülatif vergi matrahınız yıl içinde biriktikçe üst
        dilime geçersiniz ve net maaşınız düşer. Ayrıntı için{" "}
        <Link
          href="/rehber/brutten-nete-maas-hesaplama"
          style={{ fontWeight: 700, textDecoration: "underline" }}
        >
          brütten nete maaş hesaplama rehberini
        </Link>{" "}
        okuyabilirsiniz.
      </p>
    </>
  );
}

/* =========================================================
   KDV BLOĞU
========================================================= */
function KdvBlock({ amount }: { amount: number }) {
  const rows = kdvTableOf(amount);

  return (
    <>
      <p className="page-lead" style={{ marginTop: 14 }}>
        {money(amount)} tutarının üç KDV oranına göre karşılıkları. Tutarın
        KDV hariç mi yoksa KDV dahil mi olduğuna göre iki ayrı tablo
        verilmiştir.
      </p>

      <h2 style={{ marginTop: 26 }}>Tutar KDV hariç ise</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>KDV Oranı</th>
              <th style={{ ...th, textAlign: "right" }}>Matrah</th>
              <th style={{ ...th, textAlign: "right" }}>KDV Tutarı</th>
              <th style={{ ...th, textAlign: "right" }}>Genel Toplam</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rate}>
                <td style={td}>%{r.rate}</td>
                <td style={tdNum}>{money(r.excluded.base)}</td>
                <td style={tdNum}>{money(r.excluded.kdv)}</td>
                <td style={{ ...tdNum, fontWeight: 800 }}>
                  {money(r.excluded.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 30 }}>Tutar KDV dahil ise</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>KDV Oranı</th>
              <th style={{ ...th, textAlign: "right" }}>KDV Hariç Tutar</th>
              <th style={{ ...th, textAlign: "right" }}>İçindeki KDV</th>
              <th style={{ ...th, textAlign: "right" }}>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rate}>
                <td style={td}>%{r.rate}</td>
                <td style={{ ...tdNum, fontWeight: 800 }}>
                  {money(r.included.base)}
                </td>
                <td style={tdNum}>{money(r.included.kdv)}</td>
                <td style={tdNum}>{money(r.included.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: "var(--ink-soft)", lineHeight: 1.8, marginTop: 18 }}>
        KDV dahil tutardan KDV ayrıştırırken en sık yapılan hata, toplamı
        doğrudan oranla çarpmaktır. Doğrusu toplamı (1 + oran) değerine
        bölmektir. Ayrıntı için{" "}
        <Link
          href="/rehber/kdv-nedir-nasil-hesaplanir"
          style={{ fontWeight: 700, textDecoration: "underline" }}
        >
          KDV rehberini
        </Link>{" "}
        okuyun.
      </p>
    </>
  );
}

/* =========================================================
   KREDİ BLOĞU
========================================================= */
function LoanBlock({ amount, months }: { amount: number; months: number }) {
  const rows = loanTableOf(amount, months);

  return (
    <>
      <p className="page-lead" style={{ marginTop: 14 }}>
        {money(amount)} tutarındaki kredinin {months} ay vadeli aylık taksiti,
        farklı faiz oranlarına göre aşağıdadır. Bankanızın oranını tabloda
        bularak ödeyeceğiniz tutarı görebilirsiniz.
      </p>

      <div style={{ overflowX: "auto", marginTop: 22 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Aylık Faiz</th>
              <th style={{ ...th, textAlign: "right" }}>Aylık Taksit</th>
              <th style={{ ...th, textAlign: "right" }}>Toplam Faiz</th>
              <th style={{ ...th, textAlign: "right" }}>Toplam Geri Ödeme</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rate}>
                <td style={td}>%{r.rate.toString().replace(".", ",")}</td>
                <td style={{ ...tdNum, fontWeight: 800, color: "var(--brand-deep)" }}>
                  {money(r.monthly)}
                </td>
                <td style={tdNum}>{money(r.interest)}</td>
                <td style={tdNum}>{money(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: "var(--ink-soft)", lineHeight: 1.8, marginTop: 18 }}>
        Tabloda yalnızca faiz hesaba katılmıştır. Bankalar ayrıca kredi tahsis
        ücreti, sigorta ve dosya masrafı talep edebilir; gerçek maliyetiniz bu
        nedenle tablodan yüksek çıkabilir. Kredinin toplam maliyetini
        karşılaştırırken bankadan <strong>yıllık maliyet oranını</strong>{" "}
        isteyin.
      </p>
    </>
  );
}
