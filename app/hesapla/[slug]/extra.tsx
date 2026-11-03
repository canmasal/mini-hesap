/**
 * Ek hazır hesap sayfalarının içerikleri: netten brüte, işveren maliyeti,
 * kıdem, mevduat, konut kredisi, kredi kartı, kira artışı, kira geliri
 * vergisi, tapu harcı, yüzde ve indirim.
 *
 * Her sayfanın cevabı, tabloları ve SSS'leri kendi tutarından hesaplanır.
 * Hesaplar lib/calculations/longtailExtra.ts içindeki, araçlarla aynı
 * formüllerden gelir.
 */

import type { ReactNode } from "react";
import Link from "next/link";

import type { LongtailPage } from "@/data/longtail";
import {
  CREDIT_CARD,
  EMPLOYER_RATES,
  MINIMUM_WAGE,
  PARAMETERS_YEAR as Y,
  RATES,
  RENTAL_INCOME,
  RENT_INCREASE,
  SGK_LIMITS,
  DEPOSIT_WITHHOLDING,
} from "@/data/parameters";
import { money } from "@/lib/calculations/longtail";
import {
  CURRENT_SEVERANCE_CEILING,
  DEPOSIT_RATES,
  DEPOSIT_REFERENCE_RATE,
  DEPOSIT_TERMS,
  HOME_LOAN_RATES,
  HOME_LOAN_REFERENCE_RATE,
  HOME_LOAN_TERMS,
  creditCardOf,
  deedFeeOf,
  depositOf,
  discountOf,
  employerCostOf,
  grossForNetOf,
  homeLoanOf,
  percentOf,
  rentIncreaseOf,
  rentalIncomeTaxOf,
  severanceOf,
  yearlyGrossForNetOf,
  type Incentive,
} from "@/lib/calculations/longtailExtra";

type Faq = { question: string; answer: string };

export type ExtraContent = {
  answer: string;
  faqs: Faq[];
  /** Arama sonucunda görünen, cevabı içeren başlık */
  title: string;
  /** Meta açıklamanın sonuna eklenen kısa ek */
  descSuffix: string;
  block: ReactNode;
};

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const trNum = (value: number, digits = 2) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: digits });
const pctNum = (value: number) => `%${trNum(value)}`;
const pctRate = (rate: number) => `%${trNum(rate * 100)}`;
const short = (value: number) => `${Math.round(value).toLocaleString("tr-TR")} TL`;
const dmy = (iso: string) => iso.split("-").reverse().join(".");

function Hero({ label, value }: { label: string; value: string }) {
  return (
    <div className="lt-hero">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Rows({ rows }: { rows: [string, string, boolean?][] }) {
  return (
    <div className="rates-table-wrap">
      <table className="rates-table">
        <tbody>
          {rows.map(([label, value, total]) => (
            <tr key={label} className={total ? "is-total" : undefined}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Grid({
  head,
  rows,
}: {
  head: string[];
  rows: { key: string | number; cells: string[]; total?: boolean }[];
}) {
  return (
    <div className="rates-table-wrap">
      <table className="rates-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className={row.total ? "is-total" : undefined}>
              <th scope="row">{row.cells[0]}</th>
              {row.cells.slice(1).map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   NETTEN BRÜTE
========================================================= */
function netToGross(net: number): ExtraContent {
  const jan = grossForNetOf(net);
  const year = yearlyGrossForNetOf(net);
  const yearGross = year.reduce((sum, r) => sum + r.gross, 0);
  const highest = year.reduce((max, r) => (r.gross > max.gross ? r : max), year[0]);
  const deductions = jan.grossSalary - jan.netSalary;

  const answer = `${money(net)} net maaş için ${Y} ocak ayında gereken brüt ${money(jan.grossSalary)}. Yıl içinde vergi dilimi yükseldikçe aynı net için gereken brüt artar; en yüksek brüt ${MONTHS[highest.month - 1].toLowerCase()} ayında ${money(highest.gross)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(net)} TL net maaş kaç TL brüt?`,
      answer: `${Y} ocak ayında ${money(net)} net maaş için brüt ${money(jan.grossSalary)} olmalıdır. Aradaki ${money(deductions)} fark SGK primi (${money(jan.sgkEmployee)}), işsizlik sigortası (${money(jan.unemploymentEmployee)}), gelir vergisi (${money(jan.incomeTax)}) ve damga vergisinden (${money(jan.stampTax)}) oluşur.`,
    },
    {
      question: `${trNum(net)} TL net maaş için yıllık brüt ne kadar?`,
      answer: `Net maaşın 12 ay boyunca ${money(net)} kalması için yıllık toplam brüt ${money(yearGross)} olmalıdır. Kümülatif vergi matrahı büyüdükçe aylık brüt artar.`,
    },
    {
      question: "İş görüşmesinde net mi brüt mü konuşulmalı?",
      answer: `Bordro brüt üzerinden düzenlenir; net tutar yıl içinde vergi dilimine göre değişir. Net üzerinden anlaştıysanız sözleşmede "net ücret" ibaresinin ve vergi diliminden doğan farkı işverenin üstlendiğinin yazılı olmasına dikkat edin.`,
    },
  ];

  const block = (
    <>
      <Hero label={`${money(net)} net için ${Y} ocak ayı brüt maaş`} value={money(jan.grossSalary)} />

      <section className="lt-section">
        <h2>Brütten nete döküm (ocak ayı)</h2>
        <Rows
          rows={[
            ["Brüt ücret", money(jan.grossSalary)],
            [`SGK işçi payı (${pctRate(RATES.sgkEmployee)})`, `− ${money(jan.sgkEmployee)}`],
            [`İşsizlik sigortası (${pctRate(RATES.unemploymentEmployee)})`, `− ${money(jan.unemploymentEmployee)}`],
            ["Gelir vergisi (istisna düşülmüş)", `− ${money(jan.incomeTax)}`],
            ["Damga vergisi (istisna düşülmüş)", `− ${money(jan.stampTax)}`],
            ["Net maaş", money(jan.netSalary), true],
          ]}
        />
      </section>

      <section className="lt-section">
        <h2>Aynı neti korumak için ay ay brüt maaş</h2>
        <p>
          Gelir vergisi yıl başından itibaren biriken matraha göre hesaplandığı için
          net maaşı sabit tutmak isteyen işveren yıl içinde brütü artırmak zorunda
          kalır. Tablo, her ay {money(net)} net ödenmesi için gereken brütü gösterir.
        </p>
        <Grid
          head={["Ay", "Gereken brüt", "Gelir vergisi"]}
          rows={[
            ...year.map((r) => ({
              key: r.month,
              cells: [MONTHS[r.month - 1], money(r.gross), money(r.incomeTax)],
            })),
            { key: "toplam", cells: ["Yıllık toplam brüt", money(yearGross), "—"], total: true },
          ]}
        />
      </section>

      <section className="lt-section">
        <h2>Asgari ücretle karşılaştırma</h2>
        <p>
          {money(net)} net maaş, {Y} net asgari ücretinin ({money(MINIMUM_WAGE.net)}) yaklaşık{" "}
          <strong>{trNum(net / MINIMUM_WAGE.net, 1)} katıdır</strong>. Asgari ücrete isabet eden
          gelir ve damga vergisi istisnası her maaşa uygulandığı için düşük maaşlarda brüt
          ile net arasındaki fark daha azdır.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(net)} TL Net Kaç Brüt? ${Y}: ${short(jan.grossSalary)}`,
    descSuffix: "Ay ay brüt tablosu ve kesinti dökümü.",
    block,
  };
}

/* =========================================================
   İŞVEREN MALİYETİ
========================================================= */
function employerCost(gross: number): ExtraContent {
  const options: { key: Incentive; label: string }[] = [
    { key: "diger", label: `${pctRate(EMPLOYER_RATES.incentives.other)} puan teşvikli (imalat dışı)` },
    { key: "imalat", label: `${pctRate(EMPLOYER_RATES.incentives.manufacturing)} puan teşvikli (imalat)` },
    { key: "yok", label: "Teşviksiz" },
  ];
  const rows = options.map((o) => ({ ...o, r: employerCostOf(gross, o.key) }));
  const ref = rows[0].r;

  const answer = `${money(gross)} brüt maaşın işverene aylık maliyeti, 2 puanlık SGK teşvikiyle ${money(ref.total)}; yıllık ${money(ref.yearly)}. Çalışanın eline geçen net ${money(ref.net)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(gross)} TL brüt maaşın işverene maliyeti ne kadar?`,
      answer: `İmalat dışı sektörlerde 2 puanlık teşvikle aylık ${money(ref.total)}: brüt ücret ${money(gross)}, SGK işveren payı ${money(ref.sgkEmployer)} (${pctRate(ref.sgkRate)}) ve işsizlik sigortası işveren payı ${money(ref.unemploymentEmployer)}.`,
    },
    {
      question: "Teşvik olmazsa maliyet ne kadar artar?",
      answer: `Teşviksiz maliyet ${money(rows[2].r.total)}, imalat sektöründeki 5 puanlık teşvikle ${money(rows[1].r.total)} olur.`,
    },
    {
      question: `İşverenin ödediği her 100 TL'nin ne kadarı çalışana geçer?`,
      answer: `Bu maaşta işverenin toplam maliyetinin yaklaşık %${trNum(ref.netRatio * 100, 1)}'i çalışanın net maaşı olarak eline geçer; kalanı SGK primleri ve vergilerdir.`,
    },
  ];

  const block = (
    <>
      <Hero label={`${money(gross)} brüt · 2 puan teşvikli aylık maliyet`} value={money(ref.total)} />

      <section className="lt-section">
        <h2>Maliyet dökümü (2 puan teşvikli)</h2>
        <Rows
          rows={[
            ["Brüt ücret", money(gross)],
            [`SGK işveren payı (${pctRate(ref.sgkRate)})`, money(ref.sgkEmployer)],
            [`İşsizlik sigortası işveren payı (${pctRate(EMPLOYER_RATES.unemployment)})`, money(ref.unemploymentEmployer)],
            ["Aylık toplam maliyet", money(ref.total), true],
            ["Yıllık toplam maliyet", money(ref.yearly)],
            ["Çalışanın ocak ayı neti", money(ref.net)],
          ]}
        />
        {ref.capped && (
          <p>
            Brüt maaş SGK tavanını ({money(SGK_LIMITS.monthlyCeiling)}) aştığı için işveren
            primleri tavan tutar üzerinden hesaplandı.
          </p>
        )}
      </section>

      <section className="lt-section">
        <h2>Teşvik durumuna göre karşılaştırma</h2>
        <Grid
          head={["Durum", "SGK oranı", "Aylık maliyet", "Yıllık maliyet"]}
          rows={rows.map(({ key, label, r }) => ({
            key,
            cells: [label, pctRate(r.sgkRate), money(r.total), money(r.yearly)],
            total: key === "diger",
          }))}
        />
        <p>
          Teşvik, prim borcu bulunmayan ve bildirgelerini zamanında veren işverenlere
          uygulanır. Yemek, yol gibi ek ödemeler maliyete ayrıca eklenir; bunları{" "}
          <Link href="/hesaplamalar/isveren-maliyeti">işveren maliyeti hesaplayıcısında</Link>{" "}
          girebilirsiniz.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(gross)} TL Brüt Maaş İşveren Maliyeti ${Y}: ${short(ref.total)}`,
    descSuffix: "Teşvik karşılaştırması.",
    block,
  };
}

/* =========================================================
   KIDEM TAZMİNATI
========================================================= */
function severance(salary: number, years: number): ExtraContent {
  const s = severanceOf(salary, years);
  const period = `${dmy(CURRENT_SEVERANCE_CEILING.from)} – ${dmy(CURRENT_SEVERANCE_CEILING.to)}`;
  const yearTable = [1, 3, 5, 10, 15, 20, 25, 30].map((y) => ({ y, r: severanceOf(salary, y) }));

  const answer = `${money(salary)} brüt maaşla ${years} yıllık kıdem tazminatı ${money(s.grossSeverance)} brüt; damga vergisi düşülünce ${money(s.netSeverance)} net.${
    s.capped ? ` Maaş kıdem tavanını aştığı için hesap tavan (${money(s.ceiling)}) üzerinden yapıldı.` : ""
  }`;

  const faqs: Faq[] = [
    {
      question: `${trNum(salary)} TL maaşla ${years} yıllık kıdem tazminatı ne kadar?`,
      answer: `Her tam yıl için bir aylık brüt ücret ödenir: ${money(s.basis)} × ${years} = ${money(s.grossSeverance)}. Kıdem tazminatından yalnızca ${pctRate(RATES.stampTax)} damga vergisi (${money(s.severanceStamp)}) kesilir; net tutar ${money(s.netSeverance)}'dir.`,
    },
    {
      question: "Kıdem tazminatına tavan uygulanır mı?",
      answer: `Evet. ${period} döneminde kıdem tazminatı tavanı ${money(s.ceiling)}'dir. ${
        s.capped
          ? `${money(salary)} maaş tavanı aştığı için her yıl için tavan tutarı ödenir.`
          : `${money(salary)} maaş tavanın altında olduğu için tamamı esas alınır.`
      }`,
    },
    {
      question: `${years} yıl çalışan işçinin ihbar tazminatı ne kadar?`,
      answer: `${years} yıllık hizmette ihbar süresi ${s.noticeWeeks} haftadır. İşveren bu süreyi kullandırmadan sözleşmeyi feshederse brüt ${money(s.grossNotice)} ihbar tazminatı öder; gelir ve damga vergisi sonrası net ${money(s.netNotice)} olur.`,
    },
    {
      question: "Yemek ve yol yardımı hesaba katılır mı?",
      answer: "Evet. Düzenli ödenen yemek, yol ve benzeri yardımlar brüt ücrete eklenerek giydirilmiş ücret bulunur. Bu sayfa yan hak olmadığı varsayımıyla hazırlandı; kendi durumunuz için hesaplayıcıyı kullanın.",
    },
  ];

  const block = (
    <>
      <Hero label={`${money(salary)} brüt · ${years} yıl · net kıdem tazminatı`} value={money(s.netSeverance)} />

      <section className="lt-section">
        <h2>Kıdem tazminatı dökümü</h2>
        <Rows
          rows={[
            ["Brüt maaş (giydirilmiş)", money(salary)],
            [`Kıdem tavanı (${period})`, money(s.ceiling)],
            ["Esas alınan aylık ücret", money(s.basis)],
            ["Hizmet süresi", `${years} yıl`],
            ["Brüt kıdem tazminatı", money(s.grossSeverance)],
            [`Damga vergisi (${pctRate(RATES.stampTax)})`, `− ${money(s.severanceStamp)}`],
            ["Net kıdem tazminatı", money(s.netSeverance), true],
          ]}
        />
      </section>

      <section className="lt-section">
        <h2>İhbar tazminatı</h2>
        <p>
          İşveren bildirim süresine uymadan sözleşmeyi sona erdirirse ihbar tazminatı da
          ödenir. Kıdemden farklı olarak ihbar tazminatından gelir vergisi de kesilir
          (bu sayfada yıl içinde başka matrah olmadığı varsayıldı).
        </p>
        <Rows
          rows={[
            ["İhbar süresi", `${s.noticeWeeks} hafta (${s.noticeWeeks * 7} gün)`],
            ["Brüt ihbar tazminatı", money(s.grossNotice)],
            ["Gelir vergisi", `− ${money(s.noticeIncomeTax)}`],
            ["Damga vergisi", `− ${money(s.noticeStamp)}`],
            ["Net ihbar tazminatı", money(s.netNotice), true],
            ["Kıdem + ihbar net toplam", money(s.totalNet)],
          ]}
        />
      </section>

      <section className="lt-section">
        <h2>{money(salary)} maaşla çalışma süresine göre kıdem tazminatı</h2>
        <Grid
          head={["Hizmet süresi", "Brüt kıdem", "Net kıdem"]}
          rows={yearTable.map(({ y, r }) => ({
            key: y,
            cells: [`${y} yıl`, money(r.grossSeverance), money(r.netSeverance)],
            total: y === years,
          }))}
        />
        <p>
          Kıdem tazminatı için en az 1 yıl çalışmış olmak ve haklı bir fesih nedeni
          gerekir. Tam yıldan artan aylar ve günler de orantılı olarak eklenir. Ayrıntı:{" "}
          <Link href="/rehber/kidem-tazminati-nasil-hesaplanir">kıdem tazminatı rehberi</Link>.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(salary)} TL Maaş ${years} Yıl Kıdem Tazminatı ${Y}: ${short(s.netSeverance)}`,
    descSuffix: "İhbar tazminatı ve yıl tablosu.",
    block,
  };
}

/* =========================================================
   VADELİ MEVDUAT
========================================================= */
function deposit(amount: number, days: number): ExtraContent {
  const ref = depositOf(amount, DEPOSIT_REFERENCE_RATE, days);
  const rates = DEPOSIT_RATES.map((rate) => ({ rate, r: depositOf(amount, rate, days) }));
  const terms = DEPOSIT_TERMS.map((d) => ({ d, r: depositOf(amount, DEPOSIT_REFERENCE_RATE, d) }));
  const monthlyRoll = Math.pow(1 + ref.netInterest / amount, 365 / days) * amount - amount;

  const answer = `${money(amount)} ${days} günlük vadede yıllık %${DEPOSIT_REFERENCE_RATE} brüt faizle ${money(ref.netInterest)} net getiri sağlar (stopaj ${pctRate(ref.withholding)}). Vade sonu toplam ${money(ref.total)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(amount)} TL ${days} günde ne kadar faiz getirir?`,
      answer: `Yıllık %${DEPOSIT_REFERENCE_RATE} brüt oranda brüt faiz ${money(ref.grossInterest)}, ${pctRate(ref.withholding)} stopaj ${money(ref.tax)}, net getiri ${money(ref.netInterest)}'dir. Oran %${DEPOSIT_RATES[0]} ile %${DEPOSIT_RATES[DEPOSIT_RATES.length - 1]} arasında değişirse net getiri ${money(rates[0].r.netInterest)} – ${money(rates[rates.length - 1].r.netInterest)} olur.`,
    },
    {
      question: `${trNum(amount)} TL bir yıl boyunca 32 günlük vadede kalırsa ne olur?`,
      answer: `Net getiri her vadede anaparaya eklenip aynı oranla yenilenirse bir yılda yaklaşık ${money(monthlyRoll)} net getiri birikir (yıllık bileşik net %${trNum(ref.netAnnual)}). Bankanın oranı vade yenilemede değişebilir.`,
    },
    {
      question: "Mevduat stopajı kaç?",
      answer: `TL mevduatta vadesiz ve 6 aya kadar vadeli hesaplarda ${pctRate(DEPOSIT_WITHHOLDING.upTo6Months)}, 1 yıla kadar ${pctRate(DEPOSIT_WITHHOLDING.upTo1Year)}, 1 yıldan uzun vadelerde ${pctRate(DEPOSIT_WITHHOLDING.over1Year)} stopaj uygulanır. Stopaj yalnızca faizden kesilir.`,
    },
  ];

  const block = (
    <>
      <Hero label={`${money(amount)} · ${days} gün · yıllık %${DEPOSIT_REFERENCE_RATE} brüt`} value={`${money(ref.netInterest)} net`} />

      <section className="lt-section">
        <h2>Faiz oranına göre {days} günlük getiri</h2>
        <Grid
          head={["Yıllık brüt faiz", "Brüt faiz", "Stopaj", "Net getiri", "Vade sonu"]}
          rows={rates.map(({ rate, r }) => ({
            key: rate,
            cells: [`%${rate}`, money(r.grossInterest), money(r.tax), money(r.netInterest), money(r.total)],
            total: rate === DEPOSIT_REFERENCE_RATE,
          }))}
        />
        <p>
          Hesap: anapara × yıllık oran × (gün ÷ 365). Bankalar faiz oranını brüt ilan eder;
          stopaj düşüldükten sonra elinize geçen tutar tablodaki net getiridir.
        </p>
      </section>

      <section className="lt-section">
        <h2>Vadeye göre karşılaştırma (yıllık %{DEPOSIT_REFERENCE_RATE})</h2>
        <Grid
          head={["Vade", "Stopaj", "Net getiri", "Yıllık bileşik net"]}
          rows={terms.map(({ d, r }) => ({
            key: d,
            cells: [`${d} gün`, pctRate(r.withholding), money(r.netInterest), `%${trNum(r.netAnnual)}`],
            total: d === days,
          }))}
        />
        <p>
          Aynı brüt oranda kısa vade, getirinin daha sık anaparaya eklenmesi sayesinde yıllık
          bazda daha yüksek bileşik getiri sağlayabilir; uzun vadeye geçişte stopaj oranı
          düşer. Bankaların kısa ve uzun vade oranları genelde farklıdır. Ayrıntı:{" "}
          <Link href="/rehber/vadeli-mevduat-getirisi-nasil-hesaplanir">mevduat getirisi rehberi</Link>.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(amount)} TL ${days} Gün Faiz Getirisi ${Y}: ${short(ref.netInterest)} Net`,
    descSuffix: "Oran ve vade tabloları.",
    block,
  };
}

/* =========================================================
   KONUT KREDİSİ
========================================================= */
function homeLoan(amount: number, months: number): ExtraContent {
  const ref = homeLoanOf(amount, HOME_LOAN_REFERENCE_RATE, months);
  const table = HOME_LOAN_RATES.map((rate) => homeLoanOf(amount, rate, months));
  const terms = HOME_LOAN_TERMS.map((t) => ({ t, r: homeLoanOf(amount, HOME_LOAN_REFERENCE_RATE, t) }));
  const allocation = amount * 0.005;

  const answer = `${money(amount)} konut kredisinin ${months} ay taksiti, aylık %${trNum(HOME_LOAN_REFERENCE_RATE)} faizle ${money(ref.monthly)}. Toplam geri ödeme ${money(ref.totalPayment)}, toplam faiz ${money(ref.totalInterest)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(amount)} TL konut kredisi ${months} ay taksiti ne kadar?`,
      answer: `Aylık %${trNum(HOME_LOAN_REFERENCE_RATE)} faizle taksit ${money(ref.monthly)}'dir. Faiz %${trNum(HOME_LOAN_RATES[0])} ile %${trNum(HOME_LOAN_RATES[HOME_LOAN_RATES.length - 1])} arasında değişirse taksit ${money(table[0].monthly)} – ${money(table[table.length - 1].monthly)} aralığındadır.`,
    },
    {
      question: "Konut kredisinde KKDF ve BSMV var mı?",
      answer: "Hayır. Konut kredilerinde KKDF ve BSMV alınmaz; bu yüzden taksit, ihtiyaç kredisine göre aynı faiz oranında daha düşüktür.",
    },
    {
      question: "Taksit dışında hangi masraflar çıkar?",
      answer: `Tapu harcı (alıcı ve satıcı için ayrı ayrı %2), döner sermaye, ekspertiz, DASK, konut sigortası ve kredi tahsis ücreti. Tahsis ücreti kredi tutarının en fazla binde 5'idir; ${money(amount)} için en fazla ${money(allocation)} eder.`,
    },
  ];

  const block = (
    <>
      <Hero label={`${money(amount)} · ${months} ay · aylık %${trNum(HOME_LOAN_REFERENCE_RATE)} faiz`} value={`${money(ref.monthly)} / ay`} />

      <section className="lt-section">
        <h2>Faiz oranına göre aylık taksit</h2>
        <Grid
          head={["Aylık faiz", "Aylık taksit", "Toplam faiz", "Toplam ödeme"]}
          rows={table.map((r) => ({
            key: r.rate,
            cells: [pctNum(r.rate), money(r.monthly), money(r.totalInterest), money(r.totalPayment)],
            total: r.rate === HOME_LOAN_REFERENCE_RATE,
          }))}
        />
        <p>
          Oranlar örnektir; bankanın size sunduğu oran gelir, kredi notu ve konutun
          değerine göre değişir. Konut kredisinde faize vergi eklenmez.
        </p>
      </section>

      <section className="lt-section">
        <h2>Vade karşılaştırması (aylık %{trNum(HOME_LOAN_REFERENCE_RATE)})</h2>
        <Grid
          head={["Vade", "Aylık taksit", "Toplam faiz", "Toplam ödeme"]}
          rows={terms.map(({ t, r }) => ({
            key: t,
            cells: [`${t} ay`, money(r.monthly), money(r.totalInterest), money(r.totalPayment)],
            total: t === months,
          }))}
        />
        <p>
          Vade uzadıkça taksit düşer ama toplam faiz hızla artar. Peşinat, tapu harcı ve diğer
          masraflarla birlikte toplam maliyeti görmek için{" "}
          <Link href="/hesaplamalar/konut-kredisi">konut kredisi maliyet hesaplayıcısını</Link>{" "}
          ve <Link href="/rehber/konut-kredisi-masraflari">konut kredisi masrafları rehberini</Link>{" "}
          kullanın.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(amount)} TL Konut Kredisi ${months} Ay Taksit ${Y}: ${short(ref.monthly)}`,
    descSuffix: "Oran ve vade karşılaştırması.",
    block,
  };
}

/* =========================================================
   KREDİ KARTI ASGARİ ÖDEME
========================================================= */
function creditCard(amount: number): ExtraContent {
  const min = CREDIT_CARD.minimumPayment;
  /* Borç limiti aşamayacağı için 50.000 TL üstü borçlarda limit de eşiğin üstündedir */
  const scenarios =
    amount > min.limitThreshold
      ? [{ label: `Limit ${trNum(min.limitThreshold)} TL üstü`, rate: min.aboveThreshold }]
      : [
          { label: `Limit ${trNum(min.limitThreshold)} TL ve altı`, rate: min.belowThreshold },
          { label: `Limit ${trNum(min.limitThreshold)} TL üstü`, rate: min.aboveThreshold },
        ];
  const results = scenarios.map((s) => ({ ...s, r: creditCardOf(amount, s.rate) }));
  const main = results[0].r;
  const valid = dmy(CREDIT_CARD.validFrom);
  const duration = (r: typeof main) =>
    r.neverEnds ? "borç azalmıyor" : `${r.months} ay`;

  const answer = `${money(amount)} kredi kartı borcunun asgari ödemesi ${money(main.minimum)} (${pctRate(main.minRate)}). Kalan borca aylık ${pctRate(main.contractual)} akdi faiz işler; yalnızca asgari ödenirse borç ${duration(main)} sürer ve toplam ${money(main.interestTotal)} faiz ödenir.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(amount)} TL kredi kartı borcunun asgari ödemesi ne kadar?`,
      answer: results
        .map((s) => `${s.label}: ${money(s.r.minimum)} (${pctRate(s.rate)})`)
        .join(" · ") +
        `. Yeni tahsis edilen kartlarda ilk yıl oran ${pctRate(min.newCardFirstYear)}'dır.`,
    },
    {
      question: `${trNum(amount)} TL borçta asgari ödersem ne kadar faiz çıkar?`,
      answer: `İlk ay, asgari ödeme sonrası kalan ${money(amount - main.minimum)} borca ${pctRate(main.contractual)} akdi faiz işler: yaklaşık ${money(main.firstInterest)}. Her ay yalnızca asgari ödenirse toplam faiz ${money(main.interestTotal)} olur.`,
    },
    {
      question: "Asgari ödeme yapılmazsa ne olur?",
      answer: `Asgari tutarın ödenmeyen kısmına akdi faiz yerine gecikme faizi (${pctRate(main.late)}) uygulanır. Üst üste ödenmemesi halinde kart kullanıma kapatılabilir ve kredi notu düşer.`,
    },
  ];

  const block = (
    <>
      <Hero label={`${money(amount)} dönem borcu · asgari ödeme (${pctRate(main.minRate)})`} value={money(main.minimum)} />

      <section className="lt-section">
        <h2>Limite göre asgari ödeme ve borç seyri</h2>
        <Grid
          head={["Kart limiti", "Asgari oran", "Asgari ödeme", "Bitiş süresi", "Toplam faiz"]}
          rows={results.map((s, i) => ({
            key: s.label,
            cells: [s.label, pctRate(s.rate), money(s.r.minimum), duration(s.r), money(s.r.interestTotal)],
            total: i === 0,
          }))}
        />
        <p>
          {valid} itibarıyla geçerli TCMB azami oranları kullanıldı: dönem borcuna göre aylık
          akdi faiz {CREDIT_CARD.tiers.map((t) => pctRate(t.contractual)).join(", ")}. Borç
          azaldıkça faiz kademesi de düşer.
        </p>
      </section>

      <section className="lt-section">
        <h2>Yalnızca asgari ödenirse ilk 6 ay</h2>
        <Grid
          head={["Ay", "Ödeme", "İşleyen faiz", "Kalan borç"]}
          rows={main.firstMonths.map((m) => ({
            key: m.month,
            cells: [`${m.month}. ay`, money(m.payment), money(m.interest), money(m.remaining)],
          }))}
        />
        <p>
          Asgari ödeme borcun büyük kısmını ertesi aya taşır ve faiz bu kısma işler. Mümkünse
          dönem borcunun tamamını ödeyin veya borcu daha düşük faizli bir krediye taşımayı
          değerlendirin. Ayrıntı:{" "}
          <Link href="/rehber/kredi-karti-asgari-odeme-ve-faiz">kredi kartı asgari ödeme rehberi</Link>.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(amount)} TL Kredi Kartı Asgari Ödeme: ${short(main.minimum)}`,
    descSuffix: "Faiz ve borç seyri.",
    block,
  };
}

/* =========================================================
   KİRA ARTIŞI
========================================================= */
function rentIncrease(rent: number): ExtraContent {
  const max = rentIncreaseOf(rent);
  const others = [10, 15, 20, 25]
    .filter((r) => r < RENT_INCREASE.maxRatePercent)
    .map((r) => rentIncreaseOf(rent, r));

  const answer = `${RENT_INCREASE.month} döneminde yenilenen sözleşmelerde ${money(rent)} kira en fazla %${trNum(RENT_INCREASE.maxRatePercent)} artışla ${money(max.newRent)} olur. Aylık artış ${money(max.increase)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(rent)} TL kira ne kadar olur?`,
      answer: `${RENT_INCREASE.month} için yasal üst sınır olan %${trNum(RENT_INCREASE.maxRatePercent)} (12 aylık TÜFE ortalaması) uygulanırsa yeni kira ${money(max.newRent)} olur. Ev sahibi bu sınırın üzerinde artış isteyemez; daha düşük oranda anlaşmak serbesttir.`,
    },
    {
      question: `${trNum(rent)} TL kiraya yıllık ne kadar zam gelir?`,
      answer: `Aylık ${money(max.increase)} artış, bir yılda toplam ${money(max.yearlyDifference)} ek ödeme demektir.`,
    },
    {
      question: "Hangi ayın oranı uygulanır?",
      answer: "Kira yılının dolduğu (sözleşmenin yenilendiği) aydan önceki ayın TÜİK 12 aylık TÜFE ortalaması uygulanır. Oran her ayın 3'ünde açıklanır.",
    },
    {
      question: "5 yılı dolduran kiracıda sınır geçerli mi?",
      answer: "5 yılı dolduran sözleşmelerde taraflar anlaşamazsa kira bedeli hâkim tarafından emsal kiralar dikkate alınarak hakkaniyete göre belirlenebilir; bu durumda TÜFE sınırı bağlayıcı olmaz.",
    },
  ];

  const block = (
    <>
      <Hero label={`${money(rent)} kira · ${RENT_INCREASE.month} azami artış (%${trNum(RENT_INCREASE.maxRatePercent)})`} value={money(max.newRent)} />

      <section className="lt-section">
        <h2>Artış oranına göre yeni kira</h2>
        <Grid
          head={["Artış oranı", "Aylık artış", "Yeni kira", "Yıllık fark"]}
          rows={[
            {
              key: "max",
              cells: [`%${trNum(max.rate)} (yasal sınır)`, money(max.increase), money(max.newRent), money(max.yearlyDifference)],
              total: true,
            },
            ...others.map((r) => ({
              key: r.rate,
              cells: [`%${trNum(r.rate)}`, money(r.increase), money(r.newRent), money(r.yearlyDifference)],
            })),
          ]}
        />
        <p>
          Hesap: yeni kira = mevcut kira × (1 + oran ÷ 100). Tablodaki düşük oranlar,
          ev sahibiyle yasal sınırın altında anlaşılması halini gösterir. Oran her ay
          değiştiği için sözleşmenizin yenilendiği ayın oranını kontrol edin; ayrıntı için{" "}
          <Link href="/rehber/kira-artis-orani-nasil-hesaplanir">kira artış oranı rehberine</Link>{" "}
          bakın.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(rent)} TL Kira Artışı ${RENT_INCREASE.month}: ${short(max.newRent)}`,
    descSuffix: "Oran tablosu.",
    block,
  };
}

/* =========================================================
   KİRA GELİRİ VERGİSİ
========================================================= */
function rentalIncome(monthly: number): ExtraContent {
  const home = rentalIncomeTaxOf(monthly, "mesken");
  const work = rentalIncomeTaxOf(monthly, "isyeri");
  const declareYear = Y + 1;

  const answer = `Aylık ${money(monthly)} konut kirasında yıllık gelir ${money(home.rent)}; istisna ve götürü gider sonrası ${money(home.tax)} gelir vergisi çıkar. Vergi ${declareYear} mart ayında beyan edilir.`;

  const faqs: Faq[] = [
    {
      question: `Aylık ${trNum(monthly)} TL kira gelirinin vergisi ne kadar?`,
      answer: `Konut kirasında ${money(RENTAL_INCOME.exemption)} istisna ve ${pctRate(RENTAL_INCOME.lumpSumExpenseRate)} götürü gider düşülünce matrah ${money(home.base)}, gelir vergisi ${money(home.tax)} olur. Başka geliriniz yoksa ve götürü gider yöntemini seçerseniz bu tutar geçerlidir.`,
    },
    {
      question: "İşyeri kirasında durum ne?",
      answer: `İşyeri kirasında istisna yoktur; kiracı ödemede ${pctRate(RENTAL_INCOME.workplaceWithholding)} stopaj keser (yıllık ${money(work.withholding)}). ${
        work.mustDeclare
          ? `Yıllık brüt kira beyan sınırını (${money(RENTAL_INCOME.workplaceDeclarationLimit)}) aştığı için beyanname verilir; hesaplanan ${money(work.tax)} vergiden stopaj düşülünce ${work.payable > 0 ? `${money(work.payable)} ödenir` : "ek ödeme çıkmaz"}.`
          : `Yıllık brüt kira beyan sınırının (${money(RENTAL_INCOME.workplaceDeclarationLimit)}) altında olduğu için stopaj nihai vergidir; beyanname gerekmez.`
      }`,
    },
    {
      question: "Kira geliri vergisi ne zaman ödenir?",
      answer: `${Y} yılı kira gelirleri ${declareYear} mart ayında beyan edilir; vergi mart ve temmuz aylarında iki eşit taksitte ödenir.`,
    },
  ];

  const block = (
    <>
      <Hero label={`Aylık ${money(monthly)} konut kirası · yıllık gelir vergisi`} value={money(home.tax)} />

      <section className="lt-section">
        <h2>Konut (mesken) kirası</h2>
        <Rows
          rows={[
            ["Yıllık kira geliri (12 ay)", money(home.rent)],
            [`İstisna (${Y})`, `− ${money(home.exemption)}`],
            [`Götürü gider (${pctRate(RENTAL_INCOME.lumpSumExpenseRate)})`, `− ${money(home.expense)}`],
            ["Vergi matrahı", money(home.base)],
            ["Gelir vergisi", money(home.tax), true],
            ["Vergi sonrası yıllık gelir", money(home.net)],
          ]}
        />
      </section>

      <section className="lt-section">
        <h2>Aynı tutar işyeri kirası olsaydı</h2>
        <Rows
          rows={[
            ["Yıllık brüt kira", money(work.rent)],
            [`Kiracının kestiği stopaj (${pctRate(RENTAL_INCOME.workplaceWithholding)})`, money(work.withholding)],
            ["Beyan gerekir mi?", work.mustDeclare ? "Evet" : "Hayır, stopaj nihai vergi"],
            ...(work.mustDeclare
              ? ([
                  ["Hesaplanan gelir vergisi", money(work.tax)],
                  ["Stopaj mahsubu sonrası ödenecek", money(work.payable), true],
                ] as [string, string, boolean?][])
              : []),
            ["Vergiler sonrası yıllık gelir", money(work.net)],
          ]}
        />
        <p>
          Hesap başka gelir olmadığı ve götürü gider yönteminin seçildiği varsayımıyla
          yapıldı. Ücret, serbest meslek gibi başka gelirler, gerçek gider yöntemi veya
          kısmi yıl kiralama sonucu değiştirir; kendi durumunuz için{" "}
          <Link href="/hesaplamalar/kira-geliri-vergisi">kira geliri vergisi hesaplayıcısını</Link>{" "}
          kullanın.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `Aylık ${trNum(monthly)} TL Kira Geliri Vergisi ${Y}: ${short(home.tax)}`,
    descSuffix: "Konut ve işyeri dökümü.",
    block,
  };
}

/* =========================================================
   TAPU HARCI
========================================================= */
function deedFee(price: number): ExtraContent {
  const d = deedFeeOf(price);
  const nearby = [1000000, 2000000, 3000000, 5000000, 7500000, 10000000];

  const answer = `${money(price)} satış bedelli evde alıcı ve satıcı ayrı ayrı ${money(d.eachSide)} (%2) tapu harcı öder; toplam harç ${money(d.total)}. Döner sermaye ücreti ayrıca alınır.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(price)} TL evin tapu harcı ne kadar?`,
      answer: `Tapu harcı satış bedelinin %4'üdür ve yasal olarak alıcı ile satıcı arasında %2'şer paylaşılır: her iki taraf ${money(d.eachSide)}, toplam ${money(d.total)}.`,
    },
    {
      question: "Tapu harcını kim öder?",
      answer: `Kanuna göre alıcı ve satıcı %2'şer öder. Uygulamada tarafların anlaşmasıyla harcın tamamını (${money(d.total)}) alıcının ödemesi yaygındır.`,
    },
    {
      question: "Satış bedeli düşük gösterilebilir mi?",
      answer: "Hayır. Beyan edilen bedel gerçek satış bedelinden düşük olamaz; tespit halinde eksik harç, vergi ziyaı cezası ve gecikme faiziyle birlikte istenir. Konut kredisi kullanılıyorsa ekspertiz değeri de dikkate alınır.",
    },
  ];

  const block = (
    <>
      <Hero label={`${money(price)} satış bedeli · toplam tapu harcı`} value={money(d.total)} />

      <section className="lt-section">
        <h2>Tapu harcı dökümü</h2>
        <Rows
          rows={[
            ["Satış bedeli", money(price)],
            ["Alıcı payı (%2)", money(d.eachSide)],
            ["Satıcı payı (%2)", money(d.eachSide)],
            ["Toplam tapu harcı (%4)", money(d.total), true],
          ]}
        />
        <p>
          Döner sermaye ücreti il ve işlem türüne göre değiştiği için toplama dahil
          edilmedi; tutarı Tapu ve Kadastro Müdürlüğü işlem sırasında bildirir. Kendi
          tutarınızla hesaplamak için{" "}
          <Link href="/hesaplamalar/tapu-harci">tapu harcı hesaplayıcısını</Link> kullanın.
        </p>
      </section>

      <section className="lt-section">
        <h2>Farklı satış bedellerinde tapu harcı</h2>
        <Grid
          head={["Satış bedeli", "Alıcı payı", "Satıcı payı", "Toplam"]}
          rows={nearby.map((p) => {
            const r = deedFeeOf(p);
            return {
              key: p,
              cells: [money(p), money(r.eachSide), money(r.eachSide), money(r.total)],
              total: p === price,
            };
          })}
        />
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(price)} TL Ev Tapu Harcı ${Y}: ${short(d.total)}`,
    descSuffix: "Alıcı ve satıcı payları.",
    block,
  };
}

/* =========================================================
   YÜZDE
========================================================= */
const PERCENTS = [1, 2, 3, 5, 8, 10, 12, 15, 18, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];

function percent(amount: number): ExtraContent {
  const p10 = percentOf(amount, 10);
  const p20 = percentOf(amount, 20);
  const p25 = percentOf(amount, 25);
  const p50 = percentOf(amount, 50);
  const n = trNum(amount);

  const answer = `${n} sayısının %10'u ${trNum(p10.value)}, %20'si ${trNum(p20.value)}, %25'i ${trNum(p25.value)}, %50'si ${trNum(p50.value)}.`;

  const faqs: Faq[] = [
    {
      question: `${n} sayısının yüzde 20'si kaç?`,
      answer: `${n} × 20 ÷ 100 = ${trNum(p20.value)}. ${n} %20 artarsa ${trNum(p20.increased)}, %20 azalırsa ${trNum(p20.decreased)} olur.`,
    },
    {
      question: "Bir sayının yüzdesi nasıl hesaplanır?",
      answer: `Sayı yüzde oranıyla çarpılıp 100'e bölünür. Örneğin ${n}'in %15'i: ${n} × 15 ÷ 100 = ${trNum(percentOf(amount, 15).value)}.`,
    },
    {
      question: "Yüzde artıştan sonra aynı oranda azalış eski değere döndürür mü?",
      answer: `Hayır. ${n} %20 artınca ${trNum(p20.increased)} olur; bu tutar %20 azalırsa ${trNum(p20.increased * 0.8)} olur, yani başlangıçtan düşüktür. Çünkü ikinci yüzde daha büyük bir tutar üzerinden hesaplanır.`,
    },
  ];

  const block = (
    <>
      <Hero label={`${n} sayısının %20'si`} value={trNum(p20.value)} />

      <section className="lt-section">
        <h2>{n} için %1 – %100 yüzde tablosu</h2>
        <Grid
          head={["Yüzde", "Yüzde değeri", "Yüzde artış", "Yüzde azalış"]}
          rows={PERCENTS.map((p) => {
            const r = percentOf(amount, p);
            return {
              key: p,
              cells: [`%${p}`, trNum(r.value), trNum(r.increased), trNum(r.decreased)],
              total: p === 20,
            };
          })}
        />
        <p>
          Yüzde değeri = sayı × yüzde ÷ 100. Artış ve azalış sütunları sayıya yüzde
          değerinin eklenmiş ve çıkarılmış halidir. Farklı bir sayı ya da &quot;A sayısı
          B&apos;nin yüzde kaçı&quot; türü hesaplar için{" "}
          <Link href="/hesaplamalar/yuzde">yüzde hesaplayıcısını</Link> kullanın.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${n} Sayısının Yüzdesi: %20'si ${trNum(p20.value)} | %1 – %100 Tablo`,
    descSuffix: "%1 – %100 tablosu.",
    block,
  };
}

/* =========================================================
   İNDİRİM
========================================================= */
const DISCOUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70];

function discount(price: number): ExtraContent {
  const d20 = discountOf(price, 20);
  const d50 = discountOf(price, 50);
  /* Art arda %20 + %10 indirim */
  const chained = price * 0.8 * 0.9;

  const answer = `${money(price)} fiyatta %20 indirimle ödenecek tutar ${money(d20.final)} (indirim ${money(d20.discount)}); %50 indirimle ${money(d50.final)}.`;

  const faqs: Faq[] = [
    {
      question: `${trNum(price)} TL'de %20 indirim ne kadar?`,
      answer: `${money(price)} × 20 ÷ 100 = ${money(d20.discount)} indirim; indirimli fiyat ${money(d20.final)}.`,
    },
    {
      question: `${trNum(price)} TL'ye %20 ve ardından %10 indirim uygulanırsa ne olur?`,
      answer: `Art arda indirimler toplanmaz. Önce %20 ile ${money(d20.final)}, sonra %10 ile ${money(chained)} olur. Toplam indirim %${trNum((1 - chained / price) * 100)}'dir, %30 değil.`,
    },
    {
      question: "İndirim oranı nasıl bulunur?",
      answer: "İndirim oranı = (eski fiyat − yeni fiyat) ÷ eski fiyat × 100. Örneğin 1.000 TL'lik ürün 750 TL'ye düştüyse indirim %25'tir.",
    },
  ];

  const block = (
    <>
      <Hero label={`${money(price)} · %20 indirimli fiyat`} value={money(d20.final)} />

      <section className="lt-section">
        <h2>{money(price)} için indirim tablosu</h2>
        <Grid
          head={["İndirim oranı", "İndirim tutarı", "İndirimli fiyat"]}
          rows={DISCOUNTS.map((p) => {
            const r = discountOf(price, p);
            return { key: p, cells: [`%${p}`, money(r.discount), money(r.final)], total: p === 20 };
          })}
        />
        <p>
          İndirimli fiyat = fiyat × (1 − oran ÷ 100). Kampanyalarda &quot;ikinci üründe
          %50&quot; gibi teklifler toplam sepette %25 indirime denk gelir. Farklı tutarlar
          için <Link href="/hesaplamalar/indirim">indirim hesaplayıcısını</Link> kullanın.
        </p>
      </section>
    </>
  );

  return {
    answer,
    faqs,
    title: `${trNum(price)} TL İndirim Hesaplama: %20 İndirimli ${short(d20.final)}`,
    descSuffix: "%5 – %70 indirim tablosu.",
    block,
  };
}

/* ========================================================= */

export function extraContentFor(page: LongtailPage): ExtraContent | null {
  const { amount } = page.input;
  switch (page.kind) {
    case "netten-brut":
      return netToGross(amount);
    case "isveren-maliyeti":
      return employerCost(amount);
    case "kidem":
      return severance(amount, page.input.years);
    case "mevduat":
      return deposit(amount, page.input.days);
    case "konut-kredisi":
      return homeLoan(amount, page.input.months);
    case "kredi-karti":
      return creditCard(amount);
    case "kira-artisi":
      return rentIncrease(amount);
    case "kira-geliri":
      return rentalIncome(amount);
    case "tapu-harci":
      return deedFee(amount);
    case "yuzde":
      return percent(amount);
    case "indirim":
      return discount(amount);
    default:
      return null;
  }
}
