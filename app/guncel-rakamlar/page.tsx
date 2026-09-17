import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import {
  CREDIT_CARD,
  EMPLOYER_RATES,
  INCOME_TAX_BRACKETS_WAGE,
  LATE_PAYMENT,
  PROPERTY_TAX,
  RENTAL_INCOME,
  STAMP_TAX,
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
import { MTV_SOURCE, MTV_YEAR, TARIFF_I, TARIFF_IA } from "@/data/mtv";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${Y} Güncel Rakamlar: Asgari Ücret, Kıdem Tavanı`,
  description: `${Y} asgari ücret, kıdem tazminatı tavanı, gelir vergisi dilimleri, SGK tavan ve tabanı. Resmî kaynaklardan düzenli kontrol edilen güncel tablo.`,
  alternates: { canonical: "/guncel-rakamlar" },
};

const dmy = (iso: string) => iso.split("-").reverse().join(".");
const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;
const binde = (rate: number) => `binde ${(rate * 1000).toLocaleString("tr-TR")}`;
const trl = (value: number) => value.toLocaleString("tr-TR");

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

        {/* İşveren prim oranları */}
        <section className="rates-block" id="isveren-primleri">
          <h2>{Y} işveren prim oranları</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <tbody>
                <tr><th scope="row">Kısa vadeli sigorta kolları</th><td>{pct(EMPLOYER_RATES.shortTerm)}</td></tr>
                <tr><th scope="row">Malullük, yaşlılık ve ölüm (işveren)</th><td>{pct(EMPLOYER_RATES.pension)}</td></tr>
                <tr><th scope="row">Genel sağlık sigortası (işveren)</th><td>{pct(EMPLOYER_RATES.health)}</td></tr>
                <tr><th scope="row">SGK işveren payı toplamı</th><td>{pct(EMPLOYER_RATES.sgkTotal)}</td></tr>
                <tr><th scope="row">İşsizlik sigortası (işveren)</th><td>{pct(EMPLOYER_RATES.unemployment)}</td></tr>
                <tr className="is-total"><th scope="row">Toplam işveren yükü</th><td>{pct(EMPLOYER_RATES.total)}</td></tr>
                <tr><th scope="row">Prim indirimi – imalat</th><td>{pct(EMPLOYER_RATES.incentives.manufacturing)} puan</td></tr>
                <tr><th scope="row">Prim indirimi – imalat dışı</th><td>{pct(EMPLOYER_RATES.incentives.other)} puan</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={EMPLOYER_RATES.source} />
          <p className="rates-links">
            <Link href="/hesaplamalar/isveren-maliyeti">İşveren maliyeti hesapla</Link>
          </p>
        </section>

        {/* Kira geliri */}
        <section className="rates-block" id="kira-geliri">
          <h2>{Y} kira geliri (GMSİ) rakamları</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <tbody>
                <tr className="is-total"><th scope="row">Mesken kira geliri istisnası</th><td>{tl(RENTAL_INCOME.exemption)}</td></tr>
                <tr><th scope="row">Götürü gider oranı</th><td>{pct(RENTAL_INCOME.lumpSumExpenseRate)}</td></tr>
                <tr><th scope="row">İşyeri kirasında stopaj</th><td>{pct(RENTAL_INCOME.workplaceWithholding)}</td></tr>
                <tr><th scope="row">İşyeri kirası beyan sınırı (stopajlı)</th><td>{tl(RENTAL_INCOME.workplaceDeclarationLimit)}</td></tr>
                <tr><th scope="row">İşyeri kirası beyan sınırı (stopajsız)</th><td>{tl(RENTAL_INCOME.workplaceNoWithholdingLimit)}</td></tr>
                <tr><th scope="row">İstisnadan yararlanma gelir sınırı</th><td>{tl(RENTAL_INCOME.exemptionIncomeLimit)}</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={RENTAL_INCOME.source} />
          <p className="rates-links">
            <Link href="/hesaplamalar/kira-geliri-vergisi">Kira geliri vergisi hesapla</Link>
            {" · "}
            <Link href={`/rehber/kira-geliri-vergisi-${Y}-nasil-hesaplanir`}>Kira geliri rehberi</Link>
          </p>
        </section>

        {/* Damga vergisi */}
        <section className="rates-block" id="damga-vergisi">
          <h2>{Y} damga vergisi oranları</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <tbody>
                <tr><th scope="row">Sözleşme / taahhütname</th><td>{binde(STAMP_TAX.contract)}</td></tr>
                <tr><th scope="row">Kira sözleşmesi (kefilsiz)</th><td>{binde(STAMP_TAX.rentContract)}</td></tr>
                <tr><th scope="row">Adi kefilli kira sözleşmesi</th><td>{binde(STAMP_TAX.rentWithSurety)}</td></tr>
                <tr><th scope="row">Ücret ödemesi (bordro)</th><td>{binde(STAMP_TAX.payroll)}</td></tr>
                <tr className="is-total"><th scope="row">Azami tutar (her bir kâğıt)</th><td>{tl(STAMP_TAX.maximum)}</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={STAMP_TAX.source} />
          <p className="rates-links">
            <Link href="/hesaplamalar/damga-vergisi">Damga vergisi hesapla</Link>
          </p>
        </section>

        {/* Emlak vergisi */}
        <section className="rates-block" id="emlak-vergisi">
          <h2>{Y} emlak vergisi oranları</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th scope="col">Taşınmaz</th>
                  <th scope="col">Normal</th>
                  <th scope="col">Büyükşehir</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Konut (mesken)</th><td>{binde(PROPERTY_TAX.rates.mesken.normal)}</td><td>{binde(PROPERTY_TAX.rates.mesken.metropolitan)}</td></tr>
                <tr><th scope="row">İşyeri</th><td>{binde(PROPERTY_TAX.rates.isyeri.normal)}</td><td>{binde(PROPERTY_TAX.rates.isyeri.metropolitan)}</td></tr>
                <tr><th scope="row">Arsa</th><td>{binde(PROPERTY_TAX.rates.arsa.normal)}</td><td>{binde(PROPERTY_TAX.rates.arsa.metropolitan)}</td></tr>
                <tr><th scope="row">Arazi</th><td>{binde(PROPERTY_TAX.rates.arazi.normal)}</td><td>{binde(PROPERTY_TAX.rates.arazi.metropolitan)}</td></tr>
                <tr><th scope="row">Kültür varlıkları katkı payı</th><td colSpan={2}>{pct(PROPERTY_TAX.culturalContribution)}</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={PROPERTY_TAX.source} />
          <p className="rates-links">
            <Link href="/hesaplamalar/emlak-vergisi">Emlak vergisi hesapla</Link>
          </p>
        </section>

        {/* MTV */}
        <section className="rates-block" id="mtv">
          <h2>{MTV_YEAR} motorlu taşıtlar vergisi (örnek satırlar)</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th scope="col">Motor hacmi / yaş</th>
                  <th scope="col">1 – 3 yaş</th>
                  <th scope="col">7 – 11 yaş</th>
                  <th scope="col">16+ yaş</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1300 cm³ ve altı (2018 sonrası, en düşük değer dilimi)</th>
                  <td>{trl(TARIFF_I[0].brackets[0].amounts[0])} TL</td>
                  <td>{trl(TARIFF_I[0].brackets[0].amounts[2])} TL</td>
                  <td>{trl(TARIFF_I[0].brackets[0].amounts[4])} TL</td>
                </tr>
                <tr>
                  <th scope="row">1301 – 1600 cm³ (2018 sonrası, en düşük değer dilimi)</th>
                  <td>{trl(TARIFF_I[1].brackets[0].amounts[0])} TL</td>
                  <td>{trl(TARIFF_I[1].brackets[0].amounts[2])} TL</td>
                  <td>{trl(TARIFF_I[1].brackets[0].amounts[4])} TL</td>
                </tr>
                <tr>
                  <th scope="row">1301 – 1600 cm³ (2018 öncesi tescil)</th>
                  <td>{trl(TARIFF_IA[1].amounts[0])} TL</td>
                  <td>{trl(TARIFF_IA[1].amounts[2])} TL</td>
                  <td>{trl(TARIFF_IA[1].amounts[4])} TL</td>
                </tr>
                <tr>
                  <th scope="row">1801 – 2000 cm³ (2018 öncesi tescil)</th>
                  <td>{trl(TARIFF_IA[3].amounts[0])} TL</td>
                  <td>{trl(TARIFF_IA[3].amounts[2])} TL</td>
                  <td>{trl(TARIFF_IA[3].amounts[4])} TL</td>
                </tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={MTV_SOURCE} />
          <p className="rates-links">
            <Link href="/hesaplamalar/mtv">Tüm tarifeyle MTV hesapla</Link>
            {" · "}
            <Link href={`/rehber/mtv-${MTV_YEAR}-nasil-hesaplanir`}>MTV rehberi</Link>
          </p>
        </section>

        {/* Kredi kartı */}
        <section className="rates-block" id="kredi-karti">
          <h2>Kredi kartı azami faiz ve asgari ödeme</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th scope="col">Dönem borcu</th>
                  <th scope="col">Aylık akdi faiz</th>
                  <th scope="col">Aylık gecikme faizi</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">{tl(30000)} altı</th><td>{pct(CREDIT_CARD.tiers[0].contractual)}</td><td>{pct(CREDIT_CARD.tiers[0].late)}</td></tr>
                <tr><th scope="row">{tl(30000)} – {tl(180000)}</th><td>{pct(CREDIT_CARD.tiers[1].contractual)}</td><td>{pct(CREDIT_CARD.tiers[1].late)}</td></tr>
                <tr><th scope="row">{tl(180000)} üzeri</th><td>{pct(CREDIT_CARD.tiers[2].contractual)}</td><td>{pct(CREDIT_CARD.tiers[2].late)}</td></tr>
                <tr><th scope="row">Nakit çekim</th><td>{pct(CREDIT_CARD.cashAdvance.contractual)}</td><td>{pct(CREDIT_CARD.cashAdvance.late)}</td></tr>
                <tr className="is-total"><th scope="row">Asgari ödeme (limit {tl(CREDIT_CARD.minimumPayment.limitThreshold)} ve altı / üzeri)</th><td colSpan={2}>{pct(CREDIT_CARD.minimumPayment.belowThreshold)} / {pct(CREDIT_CARD.minimumPayment.aboveThreshold)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="rates-source">
            Geçerlilik: {dmy(CREDIT_CARD.validFrom)} itibarıyla. TCMB oranları her ay yeniden ilan eder.
          </p>
          <SourceLink source={CREDIT_CARD.source} />
          <SourceLink source={CREDIT_CARD.minimumSource} />
          <p className="rates-links">
            <Link href="/hesaplamalar/kredi-karti-asgari-odeme">Asgari ödeme hesapla</Link>
          </p>
        </section>

        {/* Gecikme zammı */}
        <section className="rates-block" id="gecikme-zammi">
          <h2>Gecikme zammı ve tecil faizi</h2>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <tbody>
                <tr className="is-total"><th scope="row">Aylık gecikme zammı</th><td>{pct(LATE_PAYMENT.monthly)}</td></tr>
                <tr><th scope="row">Gecikme faizi ve pişmanlık zammı</th><td>{pct(LATE_PAYMENT.monthly)}</td></tr>
                <tr><th scope="row">Yıllık tecil faizi</th><td>{pct(LATE_PAYMENT.deferralAnnual)}</td></tr>
                <tr><th scope="row">Yürürlük</th><td>{dmy(LATE_PAYMENT.validFrom)}</td></tr>
              </tbody>
            </table>
          </div>
          <SourceLink source={LATE_PAYMENT.source} />
          <p className="rates-links">
            <Link href="/hesaplamalar/gecikme-zammi">Gecikme zammı hesapla</Link>
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
