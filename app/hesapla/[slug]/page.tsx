import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import {
  longtailPages,
  findLongtail,
  neighbours,
  type LongtailPage,
} from "@/data/longtail";
import {
  CONSUMER_LOAN_TAXES,
  INCOME_TAX_BRACKETS_WAGE,
  MINIMUM_WAGE,
  PARAMETERS_YEAR as Y,
} from "@/data/parameters";
import {
  LOAN_REFERENCE_RATE,
  kdvTableOf,
  loanRowOf,
  loanScheduleOf,
  loanTableOf,
  money,
  netSalaryOf,
  yearlyNetOf,
} from "@/lib/calculations/longtail";
import { SITE_URL } from "@/lib/site";

/* Listede olmayan adresler gerçek 404 döner (soft 404 önlenir). */
export const dynamicParams = false;

export function generateStaticParams() {
  return longtailPages.map((p) => ({ slug: p.slug }));
}

/* ---------------------------------------------------------------
   Sayfa türüne göre cevap, açıklama ve SSS üretimi
   Her sayfanın metinleri kendi tutarından hesaplanır; böylece
   şablon sayfalar birbirinin kopyası olmaz.
   --------------------------------------------------------------- */

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;
const pctNum = (value: number) => `%${value.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}`;
const trNum = (value: number, digits = 2) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: digits });

type Faq = { question: string; answer: string };

function netSalaryContent(gross: number) {
  const jan = netSalaryOf(gross);
  const year = yearlyNetOf(gross);
  const yearNet = year.reduce((sum, row) => sum + row.net, 0);
  const yearTax = year.reduce((sum, row) => sum + row.incomeTax, 0);
  const firstBracket = INCOME_TAX_BRACKETS_WAGE[0].rate;
  const jump = year.find((row) => row.topRate > firstBracket);
  const lowest = year.reduce((min, row) => (row.net < min.net ? row : min), year[0]);
  const wageRatio = gross / MINIMUM_WAGE.gross;

  const answer = `${money(gross)} brüt maaşın ${Y} ocak ayı neti ${money(jan.net)}. Yıllık toplam net ${money(yearNet)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(gross)} TL brüt maaş net kaç TL?`,
      answer: `${Y} ocak ayında ${money(gross)} brüt maaşın neti ${money(jan.net)}'dir. Toplam kesinti ${money(jan.totalDeduction)} olup SGK primi ${money(jan.sgk)}, işsizlik sigortası ${money(jan.unemployment)}, gelir vergisi ${money(jan.incomeTax)} ve damga vergisi ${money(jan.stampTax)}'dir.`,
    },
    {
      question: `${trNum(gross)} TL brüt maaşta net maaş hangi ay düşer?`,
      answer: jump
        ? `Kümülatif vergi matrahı ${MONTHS[jump.month - 1].toLowerCase()} ayında ${pct(firstBracket)} dilimini aşar ve bu aydan itibaren net maaş azalır. Yılın en düşük neti ${MONTHS[lowest.month - 1].toLowerCase()} ayındaki ${money(lowest.net)}'dir.`
        : `Bu maaşta yıl boyunca kümülatif matrah ilk vergi dilimini aşmaz; net maaş 12 ay boyunca ${money(jan.net)} civarında kalır.`,
    },
    {
      question: `${trNum(gross)} TL brüt maaşın yıllık neti ne kadar?`,
      answer: `12 aylık toplam net ${money(yearNet)}, yıl boyunca ödenen gelir vergisi ${money(yearTax)}'dir. Bu maaş brüt asgari ücretin yaklaşık ${trNum(wageRatio, 1)} katıdır.`,
    },
    {
      question: `${trNum(gross)} TL brüt maaşın işverene maliyeti ne kadar?`,
      answer: `2 puanlık SGK prim indirimiyle işverene toplam aylık maliyet yaklaşık ${money(jan.employerCost)}'dir.`,
    },
  ];

  return { answer, faqs, jan, year, yearNet, yearTax, jump, lowest, wageRatio };
}

function kdvContent(amount: number) {
  const rows = kdvTableOf(amount);
  const r20 = rows.find((r) => r.rate === 20)!;
  const r10 = rows.find((r) => r.rate === 10)!;
  const r1 = rows.find((r) => r.rate === 1)!;

  const answer = `${money(amount)} tutarın %20 KDV'si ${money(r20.excluded.kdv)}, KDV dahil toplamı ${money(r20.excluded.total)}. KDV dahilse içindeki KDV ${money(r20.included.kdv)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(amount)} TL'nin %20 KDV'si ne kadar?`,
      answer: `${money(amount)} KDV hariç tutarın %20 KDV'si ${money(r20.excluded.kdv)}'dir; KDV dahil toplam ${money(r20.excluded.total)} olur.`,
    },
    {
      question: `KDV dahil ${trNum(amount)} TL'nin KDV hariç fiyatı kaç TL?`,
      answer: `%20 KDV dahil ${money(amount)} tutarın KDV hariç fiyatı ${money(r20.included.base)}, içindeki KDV ${money(r20.included.kdv)}'dir. %10 KDV'de hariç fiyat ${money(r10.included.base)}, %1 KDV'de ${money(r1.included.base)} olur.`,
    },
    {
      question: `${trNum(amount)} TL + %10 KDV kaç eder?`,
      answer: `${money(amount)} + %10 KDV = ${money(r10.excluded.total)} (KDV tutarı ${money(r10.excluded.kdv)}).`,
    },
    {
      question: `${trNum(amount)} TL'nin KDV'sini hesaplarken en sık yapılan hata nedir?`,
      answer: `KDV dahil tutardan %20 düşmek. ${money(amount)} × 0,80 = ${money(amount * 0.8)} yanlış sonuçtur; doğrusu ${money(amount)} ÷ 1,20 = ${money(r20.included.base)}'dir.`,
    },
  ];

  return { answer, faqs, rows, r20 };
}

function loanContent(amount: number, months: number) {
  const table = loanTableOf(amount, months);
  const ref = loanRowOf(amount, months, LOAN_REFERENCE_RATE);
  const schedule = loanScheduleOf(amount, months, LOAN_REFERENCE_RATE);
  const terms = [12, 24, 36, 48].map((term) => ({ term, row: loanRowOf(amount, term, LOAN_REFERENCE_RATE) }));
  const lowest = table[0];
  const highest = table[table.length - 1];
  const firstMonthShare = schedule[0].interest + schedule[0].kkdf + schedule[0].bsmv;

  const answer = `${money(amount)} kredinin ${months} ay taksiti, aylık ${pctNum(LOAN_REFERENCE_RATE)} faiz ve vergiler dahil ${money(ref.monthly)}. Toplam geri ödeme ${money(ref.total)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(amount)} TL kredi ${months} ay taksiti ne kadar?`,
      answer: `Aylık ${pctNum(LOAN_REFERENCE_RATE)} akdi faizle, KKDF ve BSMV dahil aylık taksit ${money(ref.monthly)}, toplam geri ödeme ${money(ref.total)}'dir. Faiz oranı ${pctNum(lowest.rate)} ile ${pctNum(highest.rate)} arasında değiştiğinde taksit ${money(lowest.monthly)} – ${money(highest.monthly)} aralığındadır.`,
    },
    {
      question: `${trNum(amount)} TL kredinin ${months} ayda toplam faizi ne kadar?`,
      answer: `Aylık ${pctNum(LOAN_REFERENCE_RATE)} faizde faiz, KKDF ve BSMV toplamı ${money(ref.interest)}'dir. İlk taksitte bu kalemlerin payı ${money(firstMonthShare)}; anapara payı ise zamanla artar.`,
    },
    {
      question: `${trNum(amount)} TL kredide vade uzarsa ne değişir?`,
      answer: terms
        .map(({ term, row }) => `${term} ay: taksit ${money(row.monthly)}, toplam ${money(row.total)}`)
        .join(" · "),
    },
    {
      question: "Taksite neden vergi ekleniyor?",
      answer: `İhtiyaç kredilerinde faiz tutarı üzerinden %${CONSUMER_LOAN_TAXES.kkdf * 100} KKDF ve %${CONSUMER_LOAN_TAXES.bsmv * 100} BSMV alınır. Bu yüzden gerçek aylık maliyet akdi faizin yaklaşık 1,3 katıdır. Konut kredilerinde bu kesintiler uygulanmaz.`,
    },
  ];

  return { answer, faqs, table, ref, schedule, terms };
}

function contentFor(page: LongtailPage) {
  if (page.kind === "net-maas") return netSalaryContent(page.input.gross);
  if (page.kind === "kdv") return kdvContent(page.input.amount);
  return loanContent(page.input.amount, page.input.months);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findLongtail(slug);

  if (!page) return { title: "Sayfa bulunamadı" };

  /* Başlık ve açıklama arama sonucunda doğrudan cevabı gösterir
     (tıklama oranı için); aramalarda "TL" yazıldığı için ₺ yerine TL. */
  const { answer } = contentFor(page);
  const toTl = (text: string) => text.replace(/ ₺/g, " TL");
  const description = toTl(
    `${answer} ${
      page.kind === "net-maas"
        ? "Aylık net maaş tablosu ve kesinti dökümü."
        : page.kind === "kdv"
          ? "%1, %10, %20 tabloları."
          : "Ödeme planı ve vade karşılaştırması."
    }`
  ).slice(0, 160);

  const short = (value: number) => `${Math.round(value).toLocaleString("tr-TR")} TL`;
  let title = page.metaTitle;
  if (page.kind === "net-maas") {
    title = `${trNum(page.input.gross)} TL Brüt Kaç Net? ${Y}: ${short(netSalaryOf(page.input.gross).net)}`;
  } else if (page.kind === "kdv") {
    const r20 = kdvTableOf(page.input.amount).find((r) => r.rate === 20)!;
    title = `${trNum(page.input.amount)} TL KDV Hesaplama: %20 KDV ${short(r20.excluded.kdv)}`;
  } else {
    const ref = loanRowOf(page.input.amount, page.input.months, LOAN_REFERENCE_RATE);
    title = `${trNum(page.input.amount)} TL Kredi ${page.input.months} Ay Taksit ${Y}: ${short(ref.monthly)}`;
  }

  return {
    /* Cevap başlıkta kesilmesin diye marka eki eklenmez */
    title: { absolute: title },
    description,
    alternates: { canonical: `/hesapla/${slug}` },
    openGraph: { title, description, url: `/hesapla/${slug}` },
  };
}

export default async function LongtailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findLongtail(slug);

  if (!page) notFound();

  const others = neighbours(page);
  const content = contentFor(page);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

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

        <div className="lt-page">
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)" }}>{page.question}</h1>

          {/* Aramanın cevabı ilk ekranda, tek cümle */}
          <p className="lt-answer">{content.answer}</p>

          {page.kind === "net-maas" && (
            <NetSalaryBlock gross={page.input.gross} data={netSalaryContent(page.input.gross)} />
          )}
          {page.kind === "kdv" && (
            <KdvBlock
              amount={page.input.amount}
              data={kdvContent(page.input.amount)}
              nearby={[page, ...others]
                .map((p) => p.input.amount)
                .sort((a, b) => a - b)}
            />
          )}
          {page.kind === "kredi" && (
            <LoanBlock
              amount={page.input.amount}
              months={page.input.months}
              data={loanContent(page.input.amount, page.input.months)}
            />
          )}

          <div style={{ marginTop: 26 }}>
            <AdSlot position="middle" />
          </div>

          {/* SSS */}
          <section className="lt-section">
            <h2>Sık sorulan sorular</h2>
            <div className="faq-list" style={{ maxWidth: "none" }}>
              {content.faqs.map((faq) => (
                <details key={faq.question} className="faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="lt-cta">
            <h2>Kendi rakamlarınızla hesaplayın</h2>
            <p>
              Bu sayfa sabit bir tutar için hazırlandı. Farklı değerler denemek
              için tam hesaplayıcıyı kullanın.
            </p>
            <Link className="btn" href={`/hesaplamalar/${page.tool}`}>
              Hesaplayıcıyı Aç →
            </Link>
          </div>

          {others.length > 0 && (
            <section className="lt-section">
              <h2>Yakın tutarlar</h2>
              <ul className="lt-links">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/hesapla/${o.slug}`}>{o.question}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="notice notice-warn" style={{ marginTop: 26 }}>
            <strong>Bilgilendirme:</strong> Sonuçlar {Y} yılının resmî oranlarına
            göre hesaplanan <strong>tahmini</strong> değerlerdir. Vergi dilimi,
            istisna tutarları ve banka koşulları kişiye göre değişir; resmî
            bordro veya banka hesabı yerine geçmez.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.question,
            url: `${SITE_URL}/hesapla/${slug}`,
            inLanguage: "tr-TR",
          }),
        }}
      />
    </main>
  );
}

/* =========================================================
   NET MAAŞ
========================================================= */
function NetSalaryBlock({
  gross,
  data,
}: {
  gross: number;
  data: ReturnType<typeof netSalaryContent>;
}) {
  const { jan, year, yearNet, yearTax, jump, lowest, wageRatio } = data;

  return (
    <>
      <div className="lt-hero">
        <span>{money(gross)} brüt maaşın {Y} ocak ayı neti</span>
        <b>{money(jan.net)}</b>
      </div>

      <section className="lt-section">
        <h2>Kesinti dökümü (ocak ayı)</h2>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <tbody>
              <tr><th scope="row">Brüt ücret</th><td>{money(jan.gross)}</td></tr>
              <tr><th scope="row">SGK işçi payı (%14)</th><td>− {money(jan.sgk)}</td></tr>
              <tr><th scope="row">İşsizlik sigortası (%1)</th><td>− {money(jan.unemployment)}</td></tr>
              <tr><th scope="row">Gelir vergisi matrahı</th><td>{money(jan.taxBase)}</td></tr>
              <tr><th scope="row">Gelir vergisi (istisna düşülmüş)</th><td>− {money(jan.incomeTax)}</td></tr>
              <tr><th scope="row">Damga vergisi (istisna düşülmüş)</th><td>− {money(jan.stampTax)}</td></tr>
              <tr className="is-total"><th scope="row">Net maaş</th><td>{money(jan.net)}</td></tr>
              <tr><th scope="row">İşverene toplam maliyet (2 puan indirimli)</th><td>{money(jan.employerCost)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>{money(gross)} brüt maaşın {Y} yılı aylık net tablosu</h2>
        <p>
          Gelir vergisi yıl başından itibaren biriken <strong>kümülatif matraha</strong>{" "}
          göre hesaplanır.{" "}
          {jump ? (
            <>
              Bu maaşta matrah <strong>{MONTHS[jump.month - 1].toLowerCase()}</strong>{" "}
              ayında {pct(INCOME_TAX_BRACKETS_WAGE[0].rate)} dilimini aşar; o aydan
              itibaren net maaş düşer. Yılın en düşük neti{" "}
              {MONTHS[lowest.month - 1].toLowerCase()} ayında {money(lowest.net)}.
            </>
          ) : (
            <>Bu maaşta yıl boyunca ilk vergi diliminde kalınır; net maaş neredeyse sabittir.</>
          )}
        </p>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr>
                <th scope="col">Ay</th>
                <th scope="col">Vergi dilimi</th>
                <th scope="col">Gelir vergisi</th>
                <th scope="col">Net maaş</th>
              </tr>
            </thead>
            <tbody>
              {year.map((row) => (
                <tr key={row.month}>
                  <th scope="row">{MONTHS[row.month - 1]}</th>
                  <td>{pct(row.topRate)}</td>
                  <td>{money(row.incomeTax)}</td>
                  <td>{money(row.net)}</td>
                </tr>
              ))}
              <tr className="is-total">
                <th scope="row">Yıllık toplam</th>
                <td>—</td>
                <td>{money(yearTax)}</td>
                <td>{money(yearNet)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>Asgari ücretle karşılaştırma</h2>
        <p>
          {money(gross)} brüt maaş, {Y} brüt asgari ücretinin ({money(MINIMUM_WAGE.gross)}){" "}
          yaklaşık <strong>{trNum(wageRatio, 1)} katıdır</strong>. Ocak ayı neti ise net
          asgari ücretin ({money(MINIMUM_WAGE.net)}) {trNum(jan.net / MINIMUM_WAGE.net, 1)}{" "}
          katına denk gelir. Brüt ile net arasındaki oran vergi dilimi yükseldikçe açılır.
          Ayrıntı için{" "}
          <Link href="/rehber/brutten-nete-maas-hesaplama">brütten nete maaş rehberini</Link>{" "}
          ve <Link href={`/rehber/gelir-vergisi-dilimleri-${Y}`}>{Y} vergi dilimlerini</Link> okuyun.
        </p>
      </section>
    </>
  );
}

/* =========================================================
   KDV
========================================================= */
function KdvBlock({
  amount,
  data,
  nearby,
}: {
  amount: number;
  data: ReturnType<typeof kdvContent>;
  nearby: number[];
}) {
  const { rows, r20 } = data;
  const r10 = rows.find((r) => r.rate === 10)!;

  return (
    <>
      <div className="lt-hero">
        <span>{money(amount)} + %20 KDV</span>
        <b>{money(r20.excluded.total)}</b>
      </div>

      <section className="lt-section">
        <h2>{money(amount)} KDV hariç ise</h2>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr><th scope="col">KDV oranı</th><th scope="col">Matrah</th><th scope="col">KDV</th><th scope="col">Genel toplam</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rate} className={r.rate === 20 ? "is-total" : undefined}>
                  <th scope="row">%{r.rate}</th>
                  <td>{money(r.excluded.base)}</td>
                  <td>{money(r.excluded.kdv)}</td>
                  <td>{money(r.excluded.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>{money(amount)} KDV dahil ise</h2>
        <p>
          KDV dahil bir tutardan KDV&apos;yi ayırmak için tutar (1 + oran) değerine
          bölünür: {money(amount)} ÷ 1,20 = <strong>{money(r20.included.base)}</strong>.
        </p>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr><th scope="col">KDV oranı</th><th scope="col">KDV hariç</th><th scope="col">İçindeki KDV</th><th scope="col">Toplam</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rate} className={r.rate === 20 ? "is-total" : undefined}>
                  <th scope="row">%{r.rate}</th>
                  <td>{money(r.included.base)}</td>
                  <td>{money(r.included.kdv)}</td>
                  <td>{money(r.included.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>%20 ile %10 KDV arasındaki fark</h2>
        <p>
          Aynı {money(amount)} matrah için %20 KDV&apos;li toplam {money(r20.excluded.total)},
          %10 KDV&apos;li toplam {money(r10.excluded.total)} olur. İki oran arasındaki fark{" "}
          <strong>{money(r20.excluded.total - r10.excluded.total)}</strong>&apos;dir. Ürününüzün
          hangi orana tabi olduğunu yanlış belirlemek fiyatı ve beyannameyi doğrudan etkiler.
        </p>
      </section>

      <section className="lt-section">
        <h2>Yakın tutarların %20 KDV karşılıkları</h2>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr><th scope="col">Tutar (KDV hariç)</th><th scope="col">%20 KDV</th><th scope="col">KDV dahil</th><th scope="col">KDV dahilse hariç fiyat</th></tr>
            </thead>
            <tbody>
              {nearby.map((value) => {
                const row = kdvTableOf(value).find((r) => r.rate === 20)!;
                return (
                  <tr key={value} className={value === amount ? "is-total" : undefined}>
                    <th scope="row">{money(value)}</th>
                    <td>{money(row.excluded.kdv)}</td>
                    <td>{money(row.excluded.total)}</td>
                    <td>{money(row.included.base)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>Hangi oran ne zaman uygulanır?</h2>
        <p>
          Çoğu mal ve hizmette genel oran <strong>%20</strong>&apos;dir. Bazı gıda
          ürünleri, lokanta ve konaklama hizmetlerinde <strong>%10</strong>, temel
          gıda ürünlerinin bir kısmında ve bazı konut teslimlerinde{" "}
          <strong>%1</strong> uygulanır. Faturadaki oranı esas alın; ayrıntılar
          için <Link href="/rehber/kdv-nedir-nasil-hesaplanir">KDV rehberine</Link>{" "}
          bakabilirsiniz.
        </p>
      </section>
    </>
  );
}

/* =========================================================
   KREDİ
========================================================= */
function LoanBlock({
  amount,
  months,
  data,
}: {
  amount: number;
  months: number;
  data: ReturnType<typeof loanContent>;
}) {
  const { table, ref, schedule, terms } = data;
  const shown = [...schedule.slice(0, 6), schedule[schedule.length - 1]];

  return (
    <>
      <div className="lt-hero">
        <span>
          {money(amount)} · {months} ay · aylık {pctNum(LOAN_REFERENCE_RATE)} faiz (vergiler dahil)
        </span>
        <b>{money(ref.monthly)} / ay</b>
      </div>

      <section className="lt-section">
        <h2>Faiz oranına göre aylık taksit</h2>
        <p>
          Bankaların ilan ettiği oran <strong>akdi faizdir</strong>. İhtiyaç
          kredisinde faize %{CONSUMER_LOAN_TAXES.kkdf * 100} KKDF ve %
          {CONSUMER_LOAN_TAXES.bsmv * 100} BSMV eklenir; tablodaki taksitler bu
          vergiler dahil hesaplanmıştır.
        </p>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr>
                <th scope="col">Akdi faiz</th>
                <th scope="col">Vergiler dahil</th>
                <th scope="col">Aylık taksit</th>
                <th scope="col">Toplam maliyet</th>
                <th scope="col">Toplam ödeme</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <tr key={r.rate} className={r.rate === LOAN_REFERENCE_RATE ? "is-total" : undefined}>
                  <th scope="row">{pctNum(r.rate)}</th>
                  <td>{pctNum(r.effectiveRate)}</td>
                  <td>{money(r.monthly)}</td>
                  <td>{money(r.interest)}</td>
                  <td>{money(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>Ödeme planı (aylık {pctNum(LOAN_REFERENCE_RATE)} faiz)</h2>
        <p>
          Eşit taksitli planda ilk aylarda taksitin büyük kısmı faiz ve vergidir;
          anapara payı her ay artar. İlk 6 ay ve son taksit:
        </p>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr>
                <th scope="col">Ay</th>
                <th scope="col">Faiz</th>
                <th scope="col">KKDF + BSMV</th>
                <th scope="col">Anapara</th>
                <th scope="col">Kalan borç</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.month}>
                  <th scope="row">{row.month}. ay</th>
                  <td>{money(row.interest)}</td>
                  <td>{money(row.kkdf + row.bsmv)}</td>
                  <td>{money(row.principal)}</td>
                  <td>{money(row.remaining)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lt-section">
        <h2>{money(amount)} kredide vade karşılaştırması</h2>
        <div className="rates-table-wrap">
          <table className="rates-table">
            <thead>
              <tr><th scope="col">Vade</th><th scope="col">Aylık taksit</th><th scope="col">Toplam maliyet</th><th scope="col">Toplam ödeme</th></tr>
            </thead>
            <tbody>
              {terms.map(({ term, row }) => (
                <tr key={term} className={term === months ? "is-total" : undefined}>
                  <th scope="row">{term} ay</th>
                  <td>{money(row.monthly)}</td>
                  <td>{money(row.interest)}</td>
                  <td>{money(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Vade uzadıkça taksit düşer ama toplam maliyet artar. Bankalar ayrıca
          kredi tahsis ücreti ve sigorta talep edebilir; teklifleri{" "}
          <strong>yıllık maliyet oranı</strong> üzerinden karşılaştırın. Ayrıntı:{" "}
          <Link href="/rehber/kredi-taksiti-nasil-hesaplanir">kredi taksiti rehberi</Link>.
        </p>
      </section>
    </>
  );
}
