import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import {
  INCOME_TAX_BRACKETS_WAGE,
  INCOME_TAX_SOURCE,
  LAST_VERIFIED,
  MINIMUM_WAGE,
  MINIMUM_WAGE_INCOME_TAX_EXEMPTION,
  MINIMUM_WAGE_STAMP_TAX_EXEMPTION,
  PARAMETERS_YEAR as Y,
  RATES,
  SEVERANCE_CEILINGS,
  SEVERANCE_CEILING_SOURCE,
  SGK_LIMITS,
  UNEMPLOYMENT_BENEFIT,
  lastVerifiedText,
  tl,
  type Source,
} from "@/data/parameters";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${Y} Güncel Rakamlar: Asgari Ücret, Kıdem Tavanı`,
  description: `${Y} asgari ücret, kıdem tazminatı tavanı, gelir vergisi dilimleri, SGK tavan ve tabanı. Resmî kaynaklardan düzenli kontrol edilen güncel tablo.`,
  alternates: { canonical: "/guncel-rakamlar" },
};

const dmy = (iso: string) => iso.split("-").reverse().join(".");
const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;

function SourceLink({ source }: { source: Source }) {
  return (
    <p className="rates-source">
      Kaynak:{" "}
      <a href={source.url} target="_blank" rel="noopener noreferrer">
        {source.label}
      </a>
    </p>
  );
}

export default function CurrentRatesPage() {
  const [current] = SEVERANCE_CEILINGS;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${Y} Güncel Rakamlar`,
    url: `${SITE_URL}/guncel-rakamlar`,
    dateModified: LAST_VERIFIED,
    inLanguage: "tr-TR",
  };

  return (
    <main className="page">
      <div className="container rates-page">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: `${Y} Güncel Rakamlar` },
          ]}
        />

        <p className="eyebrow">GÜNCEL RAKAMLAR</p>
        <h1>{Y} Asgari Ücret, Kıdem Tavanı ve Vergi Dilimleri</h1>
        <p className="page-lead">
          Hesaplama araçlarımızın kullandığı tüm resmî rakamlar bu sayfada.
          Rakamlar ÇSGB, GİB ve SGK yayınlarından kontrol edilir; bir değişiklik
          olduğunda hesaplayıcılar ve rehberler aynı anda güncellenir.
        </p>

        <p className="rates-verified">
          ✓ Son kontrol: <strong>{lastVerifiedText()}</strong>
        </p>

        {/* Özet kartları */}
        <div className="rates-summary">
          <div>
            <span>Net asgari ücret</span>
            <b>{tl(MINIMUM_WAGE.net)}</b>
          </div>
          <div>
            <span>Kıdem tazminatı tavanı</span>
            <b>{tl(current.amount)}</b>
          </div>
          <div>
            <span>SGK tavanı (aylık)</span>
            <b>{tl(SGK_LIMITS.monthlyCeiling)}</b>
          </div>
          <div>
            <span>İlk vergi dilimi</span>
            <b>{tl(INCOME_TAX_BRACKETS_WAGE[0].limit)}</b>
          </div>
        </div>

        {/* Asgari ücret */}
        <section className="rates-block" id="asgari-ucret">
          <h2>{Y} asgari ücret</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <tbody>
                <tr><th scope="row">Dönem</th><td>{MINIMUM_WAGE.period}</td></tr>
                <tr><th scope="row">Brüt asgari ücret</th><td>{tl(MINIMUM_WAGE.gross)}</td></tr>
                <tr><th scope="row">Günlük brüt</th><td>{tl(MINIMUM_WAGE.dailyGross)}</td></tr>
                <tr><th scope="row">SGK işçi payı ({pct(RATES.sgkEmployee)})</th><td>− {tl(MINIMUM_WAGE.sgkEmployee)}</td></tr>
                <tr><th scope="row">İşsizlik işçi payı ({pct(RATES.unemploymentEmployee)})</th><td>− {tl(MINIMUM_WAGE.unemploymentEmployee)}</td></tr>
                <tr className="is-total"><th scope="row">Net asgari ücret</th><td>{tl(MINIMUM_WAGE.net)}</td></tr>
                <tr><th scope="row">İşverene maliyet (prim indirimi yok)</th><td>{tl(MINIMUM_WAGE.employerCost.noIncentive)}</td></tr>
                <tr><th scope="row">İşverene maliyet (2 puan indirimli)</th><td>{tl(MINIMUM_WAGE.employerCost.twoPointIncentive)}</td></tr>
                <tr><th scope="row">Aylık gelir vergisi istisnası (ocak)</th><td>{tl(MINIMUM_WAGE_INCOME_TAX_EXEMPTION)}</td></tr>
                <tr><th scope="row">Aylık damga vergisi istisnası</th><td>{tl(MINIMUM_WAGE_STAMP_TAX_EXEMPTION)}</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={MINIMUM_WAGE.source} />
          <p className="rates-links">
            <Link href={`/rehber/asgari-ucret-${Y}-net-brut-ne-kadar`}>Asgari ücret rehberi</Link>
            {" · "}
            <Link href="/hesaplamalar/net-maas">Net maaş hesapla</Link>
          </p>
        </section>

        {/* Kıdem tavanı */}
        <section className="rates-block" id="kidem-tavani">
          <h2>Kıdem tazminatı tavanı</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr><th scope="col">Dönem</th><th scope="col">Yıllık tavan</th></tr>
              </thead>
              <tbody>
                {SEVERANCE_CEILINGS.map((period, index) => (
                  <tr key={period.from} className={index === 0 ? "is-total" : undefined}>
                    <th scope="row">{dmy(period.from)} – {dmy(period.to)}</th>
                    <td>{tl(period.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceLink source={SEVERANCE_CEILING_SOURCE} />
          <p className="rates-links">
            <Link href={`/rehber/kidem-tazminati-tavani-${Y}`}>Kıdem tavanı rehberi</Link>
            {" · "}
            <Link href="/hesaplamalar/kidem">Kıdem tazminatı hesapla</Link>
          </p>
        </section>

        {/* Gelir vergisi */}
        <section className="rates-block" id="gelir-vergisi">
          <h2>{Y} gelir vergisi dilimleri (ücret gelirleri)</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr><th scope="col">Kümülatif matrah</th><th scope="col">Oran</th></tr>
              </thead>
              <tbody>
                {INCOME_TAX_BRACKETS_WAGE.map((bracket, index) => {
                  const prev = index === 0 ? 0 : INCOME_TAX_BRACKETS_WAGE[index - 1].limit;
                  const label =
                    bracket.limit === Infinity
                      ? `${tl(prev)} üzeri`
                      : `${tl(prev)} – ${tl(bracket.limit)}`;
                  return (
                    <tr key={bracket.rate}>
                      <th scope="row">{label}</th>
                      <td>{pct(bracket.rate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <SourceLink source={INCOME_TAX_SOURCE} />
          <p className="rates-links">
            <Link href={`/rehber/gelir-vergisi-dilimleri-${Y}`}>Vergi dilimleri rehberi</Link>
          </p>
        </section>

        {/* SGK ve diğer */}
        <section className="rates-block" id="sgk">
          <h2>SGK sınırları ve diğer oranlar</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <tbody>
                <tr><th scope="row">SGK prime esas kazanç tabanı (aylık)</th><td>{tl(SGK_LIMITS.monthlyFloor)}</td></tr>
                <tr><th scope="row">SGK prime esas kazanç tavanı (aylık, {SGK_LIMITS.ceilingMultiplier} kat)</th><td>{tl(SGK_LIMITS.monthlyCeiling)}</td></tr>
                <tr><th scope="row">İşsizlik maaşı üst sınırı (brüt)</th><td>{tl(UNEMPLOYMENT_BENEFIT.monthlyGrossCap)}</td></tr>
                <tr><th scope="row">Damga vergisi oranı</th><td>binde {(RATES.stampTax * 1000).toLocaleString("tr-TR")}</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={SGK_LIMITS.source} />
          <p className="rates-links">
            <Link href={`/rehber/sgk-tavan-taban-${Y}`}>SGK tavan ve taban rehberi</Link>
            {" · "}
            <Link href={`/rehber/issizlik-maasi-${Y}-en-fazla-ne-kadar`}>İşsizlik maaşı üst sınırı</Link>
          </p>
        </section>

        <p className="notice notice-warn">
          <strong>Bilgilendirme:</strong> Rakamlar resmî kurumların yayımladığı
          belgelerden alınmıştır. Mevzuat değişikliği sonrasında güncellenene
          kadar kısa bir gecikme olabilir; kesin işlemler için ilgili kurumun
          güncel duyurusunu esas alın.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
