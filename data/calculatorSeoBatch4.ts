/**
 * Dördüncü araç grubunun SEO içerikleri: gelir vergisi, serbest meslek
 * makbuzu, bileşik faiz, kredi erken kapatma, günlük su ihtiyacı.
 *
 * Örneklerdeki rakamlar parameters.ts'ten hesaplanır; oran değiştiğinde
 * metin de kendiliğinden güncellenir.
 */

import type { ToolSeo } from "@/data/calculatorSeo";
import {
  CONSUMER_LOAN_TAXES,
  EARLY_REPAYMENT,
  FREELANCE_RECEIPT,
  INCOME_TAX_BRACKETS_NON_WAGE,
  INCOME_TAX_BRACKETS_WAGE,
  PARAMETERS_YEAR as Y,
  incomeTaxOn,
  tl,
} from "@/data/parameters";

const pct = (rate: number, digits = 2) =>
  `%${(rate * 100).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: digits })}`;
const num = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });

/* ---------- Gelir vergisi örnekleri ---------- */
const bracketLines = (brackets: ReadonlyArray<{ limit: number; rate: number }>) => {
  let lower = 0;
  return brackets.map(({ limit, rate }) => {
    const line =
      limit === Infinity
        ? `- ${num(lower)} TL üzeri: <strong>${pct(rate)}</strong>`
        : `- ${num(lower)} – ${num(limit)} TL: <strong>${pct(rate)}</strong>`;
    lower = limit;
    return line;
  });
};
const taxWage750 = incomeTaxOn(750000, INCOME_TAX_BRACKETS_WAGE);
const taxWage1200 = incomeTaxOn(1200000, INCOME_TAX_BRACKETS_WAGE).total;
const taxOther1200 = incomeTaxOn(1200000, INCOME_TAX_BRACKETS_NON_WAGE).total;

/* ---------- Serbest meslek örneği ---------- */
const smmNet = 10000;
const smmGross = smmNet / (1 - FREELANCE_RECEIPT.withholding);
const smmStopaj = smmGross * FREELANCE_RECEIPT.withholding;
const smmKdv = smmGross * FREELANCE_RECEIPT.vat;

/* ---------- Bileşik faiz örneği ---------- */
const compound = (p: number, r: number, years: number, n: number) => p * Math.pow(1 + r / n, n * years);
const cpMonthly = compound(100000, 0.4, 5, 12);
const cpYearly = compound(100000, 0.4, 5, 1);
const cpSimple = 100000 * (1 + 0.4 * 5);

/* ---------- Erken kapatma örneği ---------- */
const loan = (() => {
  const principal = 300000;
  const r = 0.035 * (1 + CONSUMER_LOAN_TAXES.kkdf + CONSUMER_LOAN_TAXES.bsmv);
  const n = 36;
  const k = 12;
  const installment = (principal * r) / (1 - Math.pow(1 + r, -n));
  const remaining = principal * Math.pow(1 + r, k) - installment * ((Math.pow(1 + r, k) - 1) / r);
  return { installment, remaining, left: installment * (n - k) };
})();

export const toolSeoBatch4: Record<string, ToolSeo> = {
  /* ==================== GELİR VERGİSİ ==================== */
  "gelir-vergisi": {
    title: `Gelir Vergisi Hesaplama ${Y} | Vergi Dilimleri`,
    description: `Gelir vergisi hesaplama ${Y}: yıllık matrahınızı girin, ${Y} vergi dilimlerine göre ödenecek vergiyi, efektif ve marjinal oranınızı dilim dilim görün. Ücret ve ücret dışı tarife.`,
    intro: `Gelir vergisi artan oranlı bir vergidir: gelirin tamamı en yüksek oranla değil, her dilime düşen kısmı o dilimin oranıyla vergilendirilir. Bu araç ${Y} tarifesiyle yıllık verginizi, ortalama (efektif) oranınızı ve girdiğiniz son dilimi gösterir.`,
    howItWorks: [
      "Yıllık vergi matrahınızı girin (istisna ve indirimler düşülmüş tutar).",
      "Gelirin ücret mi yoksa kira, serbest meslek gibi ücret dışı gelir mi olduğunu seçin.",
      "Toplam vergiyi, efektif ve marjinal oranı ve dilim dökümünü inceleyin.",
    ],
    sections: [
      {
        heading: `${Y} gelir vergisi dilimleri (ücret gelirleri)`,
        body: bracketLines(INCOME_TAX_BRACKETS_WAGE),
      },
      {
        heading: `${Y} gelir vergisi dilimleri (ücret dışı gelirler)`,
        body: [
          "Kira, serbest meslek, ticari kazanç gibi gelirlerde 3. dilim daha erken biter:",
          ...bracketLines(INCOME_TAX_BRACKETS_NON_WAGE),
        ],
      },
      {
        heading: "Gelir vergisi nasıl hesaplanır? Örnek",
        body: [
          `Yıllık matrahı 750.000 TL olan bir ücretlinin vergisi dilim dilim hesaplanır:`,
          ...taxWage750.rows.map(
            (row) => `- ${num(row.from)} – ${num(row.to)} TL × ${pct(row.rate)} = ${tl(row.tax)}`,
          ),
          `Toplam gelir vergisi <strong>${tl(taxWage750.total)}</strong>, efektif oran ${pct(taxWage750.total / 750000)} olur. Marjinal oran ise ${pct(taxWage750.marginal)}'dir; yani 750.000 TL'nin üzerine eklenecek her 1 TL bu oranla vergilenir.`,
        ],
      },
      {
        heading: "Ücret ile ücret dışı gelir arasındaki fark",
        body: [
          `Aynı 1.200.000 TL matrah için ücret gelirinde vergi ${tl(taxWage1200)}, ücret dışı gelirde ${tl(taxOther1200)} çıkar. Fark, 3. dilimin ücretlilerde daha geç bitmesinden kaynaklanır.`,
          "Ücret dışı gelirlerle birlikte ücret geliri de beyan ediliyorsa (örneğin ücret dışı gelirleri beyan sınırını aşanlar) ücret dışı tarife uygulanır.",
        ],
      },
    ],
    faqs: [
      {
        question: "Vergi dilimine girince bütün maaşım yüksek oranla mı vergilenir?",
        answer:
          "Hayır. Yalnızca o dilime düşen kısım yüksek oranla vergilenir; önceki dilimlere düşen kısımların oranı değişmez. Bu yüzden bir üst dilime geçmek net gelirinizi hiçbir zaman azaltmaz.",
      },
      {
        question: "Efektif vergi oranı ile marjinal oran arasındaki fark nedir?",
        answer:
          "Efektif oran, ödediğiniz toplam verginin gelirinize oranıdır. Marjinal oran ise girdiğiniz son dilimin oranıdır ve kazanacağınız bir sonraki liranın ne kadar vergileneceğini gösterir.",
      },
      {
        question: "Asgari ücretliler gelir vergisi öder mi?",
        answer:
          "Asgari ücrete isabet eden kısım gelir vergisinden istisnadır. Asgari ücretin üzerinde kazananlarda da asgari ücret kadar kısım istisna edilir; verginin tamamı ödenmez.",
      },
      {
        question: "Gelir vergisi beyannamesi ne zaman verilir?",
        answer:
          "Yıllık gelir vergisi beyannamesi, gelirin elde edildiği yılı izleyen mart ayında verilir; vergi mart ve temmuz aylarında iki eşit taksitte ödenir.",
      },
    ],
  },

  /* ==================== SERBEST MESLEK MAKBUZU ==================== */
  "serbest-meslek-makbuzu": {
    title: `Serbest Meslek Makbuzu Hesaplama ${Y} | SMM`,
    description: `Serbest meslek makbuzu hesaplama ${Y}: netten brüte ve brütten nete SMM, ${pct(FREELANCE_RECEIPT.withholding)} gelir vergisi stopajı ve ${pct(FREELANCE_RECEIPT.vat)} KDV. Makbuza yazılacak tutarı ve hesabınıza geçecek parayı görün.`,
    intro:
      "Serbest meslek makbuzu (SMM) keserken en sık yapılan hata, anlaşılan ücretin brüt mü net mi olduğunu karıştırmaktır. Bu araç iki yönde de hesaplar: almak istediğiniz netten makbuza yazılacak brüte ya da brütten elinize geçecek nete.",
    howItWorks: [
      "Hesaplama yönünü seçin: netten brüte veya brütten nete.",
      "KDV hariç tutarı girin.",
      "Makbuzu şirkete mi yoksa şahsa mı kestiğinizi seçin; stopaj buna göre uygulanır.",
      "KDV mükellefi olup olmadığınızı belirtin ve sonucu görün.",
    ],
    sections: [
      {
        heading: "Serbest meslek makbuzu nasıl hesaplanır?",
        body: [
          `Makbuz bir şirkete ya da vergi sorumlusuna kesiliyorsa brüt ücret üzerinden <strong>${pct(FREELANCE_RECEIPT.withholding)} gelir vergisi stopajı</strong> hesaplanır. KDV mükellefiyseniz brüt ücrete ayrıca <strong>${pct(FREELANCE_RECEIPT.vat)} KDV</strong> eklenir.`,
          "- Net ücret = Brüt ücret − Stopaj",
          "- Hesabınıza yatan = Net ücret + KDV",
          "- Müşterinin toplam maliyeti = Brüt ücret + KDV",
        ],
      },
      {
        heading: "Netten brüte örnek",
        body: [
          `Elinize ${tl(smmNet)} net geçmesini istiyorsanız brüt ücret ${tl(smmNet)} ÷ ${(1 - FREELANCE_RECEIPT.withholding).toLocaleString("tr-TR")} = <strong>${tl(smmGross)}</strong> olmalıdır.`,
          `- Stopaj: ${tl(smmStopaj)} (müşteriniz vergi dairesine yatırır)`,
          `- KDV: ${tl(smmKdv)}`,
          `- Hesabınıza yatan: ${tl(smmNet + smmKdv)}`,
          `- Müşterinin toplam maliyeti: ${tl(smmGross + smmKdv)}`,
        ],
      },
      {
        heading: "Şahsa kesilen makbuzda stopaj yok",
        body: [
          "Makbuzu vergi sorumlusu olmayan bir kişiye (nihai tüketiciye) kesiyorsanız stopaj uygulanmaz; brüt ücretin tamamı ve varsa KDV size ödenir. Bu durumda gelir vergisini yıllık beyannamede kendiniz ödersiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Serbest meslek makbuzunda stopaj oranı kaç?",
        answer: `Vergi sorumlusuna kesilen makbuzlarda gelir vergisi stopajı brüt ücretin ${pct(FREELANCE_RECEIPT.withholding)}'sidir (GVK md. 94/2-b).`,
      },
      {
        question: "Stopaj kesilen para kaybolur mu?",
        answer:
          "Hayır. Stopaj peşin ödenmiş gelir vergisidir. Yıllık beyannamede hesaplanan vergiden düşülür; fazla kesilmişse iade veya mahsup edilir.",
      },
      {
        question: "Netten brüte nasıl çevrilir?",
        answer: `Stopajlı makbuzda istenen net tutar ${(1 - FREELANCE_RECEIPT.withholding).toLocaleString("tr-TR")} ile bölünür. Örneğin ${tl(smmNet)} net için brüt ${tl(smmGross)}'dir.`,
      },
      {
        question: "Serbest meslek makbuzu nereden kesilir?",
        answer:
          "Kâğıt makbuz yerine artık e-Serbest Meslek Makbuzu (e-SMM) kullanılır; GİB portalı veya özel entegratörler üzerinden düzenlenir.",
      },
    ],
  },

  /* ==================== BİLEŞİK FAİZ ==================== */
  "bilesik-faiz": {
    title: "Bileşik Faiz Hesaplama | Aylık Ek Yatırımlı",
    description:
      "Bileşik faiz hesaplama: başlangıç tutarı, yıllık oran ve süreye göre birikiminizin yıl yıl nasıl büyüdüğünü görün. Aylık ek yatırım, faiz sıklığı ve efektif yıllık getiri.",
    intro:
      "Bileşik faizde kazandığınız faiz anaparaya eklenir ve bir sonraki dönemde o da faiz kazanır. Süre uzadıkça bu etki katlanarak büyür. Araç, düzenli aylık yatırımla birlikte paranızın yıllar içindeki değerini tablo hâlinde gösterir.",
    howItWorks: [
      "Başlangıç tutarını ve yıllık faiz ya da getiri oranını girin.",
      "Süreyi yıl olarak ve faizin ne sıklıkla eklendiğini seçin.",
      "Varsa her ay ekleyeceğiniz tutarı yazın.",
      "Dönem sonu toplamı, kazanılan faizi ve yıllık tabloyu inceleyin.",
    ],
    sections: [
      {
        heading: "Bileşik faiz formülü",
        body: [
          "Dönem sonu tutar = <strong>Anapara × (1 + r ÷ n)<sup>n × t</sup></strong>",
          "- r: yıllık faiz oranı (ondalık)",
          "- n: faizin bir yılda kaç kez eklendiği (aylıkta 12)",
          "- t: süre (yıl)",
        ],
      },
      {
        heading: "Örnek: 100.000 TL, yıllık %40, 5 yıl",
        body: [
          `- Basit faizle: ${tl(cpSimple)}`,
          `- Yıllık bileşik faizle: ${tl(cpYearly)}`,
          `- Aylık bileşik faizle: <strong>${tl(cpMonthly)}</strong>`,
          `Aynı oran ve sürede aylık bileşik getiri, basit faizden ${tl(cpMonthly - cpSimple)} daha fazla kazandırır. Farkın tamamı faizin faiz kazanmasından gelir.`,
        ],
      },
      {
        heading: "72 kuralı: paranız kaç yılda ikiye katlanır?",
        body: [
          "Pratik bir kestirme: 72'yi yıllık yüzde getiriye bölün. Yıllık %24 getiriyle para yaklaşık 3 yılda, %36 ile 2 yılda ikiye katlanır.",
          "Enflasyon yüksekken nominal ikiye katlanma reel zenginleşme anlamına gelmez; getiriyi enflasyonla karşılaştırmak için enflasyon hesaplama aracını kullanın.",
        ],
      },
    ],
    faqs: [
      {
        question: "Bileşik faiz ile basit faiz arasındaki fark nedir?",
        answer:
          "Basit faizde faiz yalnızca ilk anapara üzerinden hesaplanır. Bileşik faizde her dönemin faizi anaparaya eklenir ve sonraki dönemlerde o da faiz kazanır; süre uzadıkça fark büyür.",
      },
      {
        question: "Faizin aylık eklenmesi getiriyi artırır mı?",
        answer:
          "Evet. Aynı yıllık oranda faiz ne kadar sık eklenirse efektif yıllık getiri o kadar yüksek olur. Araçtaki 'yıllık efektif oran' satırı bu farkı gösterir.",
      },
      {
        question: "Mevduatta bileşik faiz nasıl elde edilir?",
        answer:
          "Vadeli mevduatı her vade sonunda faiziyle birlikte yenilediğinizde bileşik getiri elde edersiniz. Faizden stopaj kesildiği için net getiri brüt hesaplamanın altında kalır.",
      },
    ],
  },

  /* ==================== KREDİ ERKEN KAPATMA ==================== */
  "kredi-erken-kapatma": {
    title: `Kredi Erken Kapatma Hesaplama ${Y} | Tazminat`,
    description: `Kredi erken kapatma hesaplama ${Y}: kalan anaparayı, erken ödeme tazminatını ve kurtulacağınız faizi hesaplayın. İhtiyaç, taşıt ve konut kredisinde erken kapama kuralları.`,
    intro:
      "Krediyi vadesinden önce kapattığınızda kalan taksitlerin tamamını değil, yalnızca kalan anaparayı ödersiniz; gelecek ayların faizi silinir. Bu araç bugün kapatırsanız ne ödeyeceğinizi ve ne kadar faizden kurtulacağınızı hesaplar.",
    howItWorks: [
      "Kredi türünü seçin: ihtiyaç/taşıt veya sabit ya da değişken faizli konut kredisi.",
      "Çektiğiniz tutarı, aylık faiz oranını ve vadeyi girin.",
      "Şimdiye kadar ödediğiniz taksit sayısını yazın.",
      "Erken kapatma tutarını ve kazancınızı görün.",
    ],
    sections: [
      {
        heading: "Erken ödeme tazminatı ne zaman alınır?",
        body: [
          `- <strong>İhtiyaç ve taşıt kredisi:</strong> Erken ödeme tazminatı alınamaz. Banka yalnızca kalan anaparayı ve kapatma gününe kadar işlemiş faizi ister.`,
          `- <strong>Sabit faizli konut kredisi:</strong> Kalan vade ${EARLY_REPAYMENT.thresholdMonths} ay veya daha kısaysa erken ödenen tutarın en fazla ${pct(EARLY_REPAYMENT.shortRate)}'i, daha uzunsa en fazla ${pct(EARLY_REPAYMENT.longRate)}'si tazminat olarak alınabilir.`,
          "- <strong>Değişken faizli konut kredisi:</strong> Erken ödeme tazminatı alınamaz.",
        ],
      },
      {
        heading: "Örnek hesaplama",
        body: [
          `300.000 TL, aylık %3,5 faizli, 36 ay vadeli ihtiyaç kredisinde KKDF ve BSMV ile aylık taksit ${tl(loan.installment)} olur.`,
          `12 taksit ödendikten sonra kalan 24 taksitin toplamı ${tl(loan.left)}, kalan anapara ise <strong>${tl(loan.remaining)}</strong>'dir.`,
          `Kredi bu noktada kapatılırsa ${tl(loan.left - loan.remaining)} faiz ödenmemiş olur.`,
        ],
      },
      {
        heading: "Erken kapatmak her zaman mantıklı mı?",
        body: [
          "Erken kapatmanın kazancı, kapatmak için kullanacağınız paranın başka bir yerde getireceği getiriyle karşılaştırılmalıdır. Mevduat faizi kredi faizinden düşükse erken kapatmak genelde avantajlıdır.",
          "Kredinin son aylarında taksitlerin büyük kısmı anaparadır; bu yüzden erken kapatmanın faiz kazancı vadenin başında en yüksek, sonunda en düşüktür.",
        ],
      },
    ],
    faqs: [
      {
        question: "Krediyi erken kapatınca faiz indirimi yapılır mı?",
        answer:
          "Evet. Tüketici kredilerinde erken ödemede, ödenmeyen dönemlere ait faiz ve buna bağlı vergiler tahsil edilmez. Siz yalnızca kalan anaparayı ve kapatma gününe kadar işleyen faizi ödersiniz.",
      },
      {
        question: "İhtiyaç kredisi erken kapatma cezası var mı?",
        answer:
          "Hayır. İhtiyaç ve taşıt kredilerinde erken kapatma ücreti veya tazminatı alınamaz.",
      },
      {
        question: "Konut kredisini erken kapatmanın maliyeti ne?",
        answer: `Sabit faizli konut kredisinde kalan vade ${EARLY_REPAYMENT.thresholdMonths} ay veya daha azsa en fazla ${pct(EARLY_REPAYMENT.shortRate)}, daha fazlaysa en fazla ${pct(EARLY_REPAYMENT.longRate)} erken ödeme tazminatı ödersiniz. Değişken faizli kredide tazminat yoktur.`,
      },
      {
        question: "Ara ödeme yapmak mı, tamamen kapatmak mı?",
        answer:
          "Ara ödeme de kalan anaparayı düşürür ve faiz yükünü azaltır. Banka ara ödemeden sonra ya taksit tutarını ya da vadeyi kısaltır; hangisini seçeceğinizi bankaya bildirebilirsiniz.",
      },
    ],
  },

  /* ==================== SU İHTİYACI ==================== */
  "su-ihtiyaci": {
    title: "Günlük Su İhtiyacı Hesaplama | Günde Kaç Litre",
    description:
      "Günlük su ihtiyacı hesaplama: kilonuza, egzersiz sürenize ve havaya göre günde kaç litre ve kaç bardak su içmeniz gerektiğini öğrenin.",
    intro:
      "Su ihtiyacı kişiden kişiye değişir: kilo, fiziksel aktivite ve hava sıcaklığı miktarı doğrudan etkiler. Araç kiloya göre temel ihtiyacı bulur, egzersiz ve sıcak hava için ek miktarı ekler ve sonucu litre ve bardak olarak gösterir.",
    howItWorks: [
      "Kilonuzu ve cinsiyetinizi girin.",
      "Günlük egzersiz sürenizi dakika olarak yazın.",
      "Hava sıcaksa ya da çok terliyorsanız bunu seçin.",
      "Günlük su ihtiyacınızı litre ve 200 ml'lik bardak cinsinden görün.",
    ],
    sections: [
      {
        heading: "Günde kaç litre su içmeliyim?",
        body: [
          "Yaygın kullanılan pratik formül kilogram başına yaklaşık <strong>30–35 ml</strong> sudur. 70 kg bir yetişkin için bu günde yaklaşık 2,3 litre eder.",
          "Avrupa Gıda Güvenliği Otoritesi (EFSA) yiyeceklerle birlikte toplam sıvı alımı için kadınlarda <strong>2,0 litre</strong>, erkeklerde <strong>2,5 litre</strong> önerir. Bunun yaklaşık beşte biri yiyeceklerden gelir.",
        ],
      },
      {
        heading: "Egzersiz ve sıcak havada ne kadar fazla?",
        body: [
          "- Her 30 dakikalık orta tempolu egzersiz için yaklaşık 350 ml ekleyin.",
          "- Sıcak ve nemli havada ya da çok terlediğiniz günlerde yaklaşık 500 ml ekleyin.",
          "- Uzun ve yoğun egzersizde yalnızca su değil, tuz ve mineral kaybı da yerine konmalıdır.",
        ],
      },
      {
        heading: "Yeterli su içtiğimi nasıl anlarım?",
        body: [
          "En pratik gösterge idrar rengidir: açık saman sarısı yeterli sıvı alımını, koyu sarı ise sıvı eksikliğini gösterir. Susama hissi, özellikle yaşlılarda geç ortaya çıkabilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Günde 8 bardak su yeterli mi?",
        answer:
          "8 bardak (yaklaşık 1,6 litre) birçok kişi için alt sınırdır. Kilonuz, aktiviteniz ve hava koşullarına göre ihtiyacınız daha fazla olabilir; araç kişisel miktarı hesaplar.",
      },
      {
        question: "Çay ve kahve su yerine geçer mi?",
        answer:
          "Çay ve kahve de sıvı alımına katkı sağlar, ancak kafein içerdikleri için günlük ihtiyacın büyük kısmını sudan karşılamak önerilir.",
      },
      {
        question: "Çok fazla su içmek zararlı mı?",
        answer:
          "Sağlıklı böbrekler fazla suyu atar, ancak kısa sürede çok büyük miktarlar içmek kandaki sodyumu tehlikeli biçimde düşürebilir. Kalp veya böbrek hastalığı olanlar sıvı miktarını hekimiyle belirlemelidir.",
      },
    ],
  },
};
