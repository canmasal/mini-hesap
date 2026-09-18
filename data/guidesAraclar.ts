/**
 * Dördüncü araç grubunun rehberleri: gelir vergisi, serbest meslek
 * makbuzu, bileşik faiz, kredi erken kapatma, günlük su ihtiyacı.
 *
 * Rakamlar parameters.ts'ten hesaplanır.
 */

import type { Guide } from "@/data/guides";
import {
  CONSUMER_LOAN_TAXES,
  EARLY_REPAYMENT,
  FREELANCE_RECEIPT,
  INCOME_TAX_BRACKETS_WAGE,
  PARAMETERS_YEAR as Y,
  incomeTaxOn,
  tl,
} from "@/data/parameters";

const pct = (rate: number) =>
  `%${(rate * 100).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}`;

/* Dilim atlama örneği: 3. dilim sınırının hemen altı ve 10.000 TL üstü */
const edge = INCOME_TAX_BRACKETS_WAGE[1].limit;
const below = incomeTaxOn(edge);
const above = incomeTaxOn(edge + 10000);

/* Erken kapatma örneği */
const loan = (() => {
  const principal = 200000;
  const r = 0.035 * (1 + CONSUMER_LOAN_TAXES.kkdf + CONSUMER_LOAN_TAXES.bsmv);
  const n = 24;
  const k = 6;
  const installment = (principal * r) / (1 - Math.pow(1 + r, -n));
  const remaining = principal * Math.pow(1 + r, k) - installment * ((Math.pow(1 + r, k) - 1) / r);
  return { installment, remaining, left: installment * (n - k) };
})();

const PUBLISHED = "2026-09-18";

export const araclarGuides: Guide[] = [
  /* =======================================================
     GELİR VERGİSİ: DİLİM ATLAMA
  ======================================================= */
  {
    slug: "vergi-dilimi-atlayinca-maas-duser-mi",
    title: "Vergi Dilimi Atlayınca Maaş Düşer mi? Efektif ve Marjinal Vergi",
    metaTitle: `Vergi Dilimi Atlayınca Maaş Düşer mi? ${Y}`,
    description: `Vergi dilimi değişince net maaş neden azalır, gerçekten kayıp var mı? Efektif ve marjinal vergi oranı farkı, ${Y} dilimleriyle örnekler.`,
    category: "Vergi",
    icon: "🏛️",
    published: PUBLISHED,
    updated: PUBLISHED,
    readingMinutes: 5,
    tool: { slug: "gelir-vergisi", label: "Gelir Vergisi Hesaplama" },
    intro:
      "Yılın ikinci yarısında net maaşın azaldığını gören çalışanların ilk sorusu hep aynıdır: \"Vergi dilimi atladım, zararım mı var?\" Kısa cevap hayır. Bu rehberde nedenini efektif ve marjinal vergi oranı üzerinden örnekle açıklıyoruz.",
    sections: [
      {
        heading: "Dilim atlamak bütün geliri yüksek oranla vergilendirmez",
        body: [
          "Gelir vergisi artan oranlıdır: matrahın yalnızca üst dilime taşan kısmı yüksek oranla vergilenir. Önceki dilimlere düşen kısmın vergisi değişmez.",
          `Örnek: Yıllık ${tl(edge)} matrahta vergi ${tl(below.total)}'dir. Matrah 10.000 TL artıp ${tl(edge + 10000)} olduğunda vergi ${tl(above.total)} olur. Ek 10.000 TL'nin yalnızca ${tl(above.total - below.total)}'si vergiye gider.`,
          "Yani dilim atlamak net gelirinizi hiçbir zaman azaltmaz; yalnızca ek kazancınızın daha büyük bir kısmı vergiye gider.",
        ],
      },
      {
        heading: "Net maaş neden yıl içinde düşüyor?",
        body: [
          "Bordroda vergi kümülatif matraha göre hesaplanır. Ocaktan itibaren biriken matrah bir dilim sınırını geçtiği ay, o ayın maaşının bir kısmı ya da tamamı yeni oranla vergilenir; net maaş bu yüzden azalır.",
          "Bu düşüş brüt maaşınızın değiştiği anlamına gelmez. Yeni yılın ocak ayında kümülatif matrah sıfırlanır ve net maaş yeniden yükselir.",
        ],
      },
      {
        heading: "Efektif oran ile marjinal oran",
        body: [
          "- <strong>Marjinal oran:</strong> Girdiğiniz son dilimin oranıdır. Zam ya da prim alırken ek tutarın ne kadarının vergiye gideceğini gösterir.",
          "- <strong>Efektif oran:</strong> Ödediğiniz toplam verginin toplam gelirinize oranıdır. Gerçek vergi yükünüz budur ve her zaman marjinal orandan düşüktür.",
          `Örnekteki ${tl(edge + 10000)} matrahta marjinal oran ${pct(above.marginal)}, efektif oran ise ${pct(above.total / (edge + 10000))}'dir.`,
        ],
      },
      {
        heading: `${Y} ücret gelirleri tarifesi`,
        body: (() => {
          let lower = 0;
          return INCOME_TAX_BRACKETS_WAGE.map(({ limit, rate }) => {
            const line =
              limit === Infinity
                ? `- ${lower.toLocaleString("tr-TR")} TL üzeri: ${pct(rate)}`
                : `- ${lower.toLocaleString("tr-TR")} – ${limit.toLocaleString("tr-TR")} TL: ${pct(rate)}`;
            lower = limit;
            return line;
          });
        })(),
      },
    ],
    faqs: [
      {
        question: "Zam aldım ama net maaşım azaldı, neden?",
        answer:
          "Büyük ihtimalle kümülatif matrahınız o ay bir üst dilime geçti. Zam nedeniyle yıllık net geliriniz yine de artar; yalnızca aylık net tutar yıl içinde dalgalanır.",
      },
      {
        question: "Vergi dilimi ne zaman sıfırlanır?",
        answer: "Kümülatif matrah her yıl ocak ayında sıfırlanır ve vergi yeniden ilk dilimden hesaplanmaya başlar.",
      },
      {
        question: "Asgari ücret istisnası dilim atlamayı etkiler mi?",
        answer:
          "Asgari ücrete isabet eden vergi her ay istisna edilir. Dilim atladığınız aylarda istisna tutarı da o ayın asgari ücret vergisine göre hesaplandığı için net maaş düşüşü bir miktar yumuşar.",
      },
    ],
    related: [`gelir-vergisi-dilimleri-${Y}`, "brutten-nete-maas-hesaplama", `asgari-ucret-${Y}-net-brut-ne-kadar`],
  },

  /* =======================================================
     SERBEST MESLEK MAKBUZU
  ======================================================= */
  {
    slug: "serbest-meslek-makbuzu-nasil-kesilir",
    title: "Serbest Meslek Makbuzu Nasıl Kesilir? Stopaj ve KDV",
    metaTitle: `Serbest Meslek Makbuzu Nasıl Kesilir? ${Y}`,
    description: `Serbest meslek makbuzu (e-SMM) nasıl kesilir, stopaj ve KDV nasıl hesaplanır? Netten brüte çevirme, şahsa ve şirkete kesilen makbuz farkı.`,
    category: "Vergi",
    icon: "🧾",
    published: PUBLISHED,
    updated: PUBLISHED,
    readingMinutes: 6,
    tool: { slug: "serbest-meslek-makbuzu", label: "Serbest Meslek Makbuzu Hesaplama" },
    intro:
      "Avukat, mali müşavir, yazılımcı, tasarımcı, çevirmen ya da danışman olarak serbest çalışıyorsanız kazancınızı serbest meslek makbuzuyla belgelersiniz. Makbuzdaki brüt tutar, stopaj ve KDV'nin nasıl hesaplandığını bilmek hem müşteriyle anlaşmayı hem de vergi planlamasını kolaylaştırır.",
    sections: [
      {
        heading: "Makbuzda hangi kalemler yer alır?",
        body: [
          "- <strong>Brüt ücret:</strong> Hizmetin vergi öncesi bedeli.",
          `- <strong>Gelir vergisi stopajı (${pct(FREELANCE_RECEIPT.withholding)}):</strong> Makbuz bir şirkete veya vergi sorumlusuna kesiliyorsa müşteri keser ve vergi dairesine yatırır.`,
          "- <strong>Net ücret:</strong> Brüt ücretten stopaj düşüldükten sonra kalan tutar.",
          `- <strong>KDV (${pct(FREELANCE_RECEIPT.vat)}):</strong> KDV mükellefiyseniz brüt ücret üzerinden hesaplanır ve tahsil edilir.`,
        ],
      },
      {
        heading: "Netten brüte nasıl çevrilir?",
        body: [
          `Müşteriyle net tutar üzerinden anlaştıysanız brüt ücreti bulmak için net tutarı ${(1 - FREELANCE_RECEIPT.withholding).toLocaleString("tr-TR")} ile bölün.`,
          `Örnek: 20.000 TL net için brüt ücret 20.000 ÷ ${(1 - FREELANCE_RECEIPT.withholding).toLocaleString("tr-TR")} = <strong>${tl(20000 / (1 - FREELANCE_RECEIPT.withholding))}</strong>, stopaj ${tl((20000 / (1 - FREELANCE_RECEIPT.withholding)) * FREELANCE_RECEIPT.withholding)}, KDV ${tl((20000 / (1 - FREELANCE_RECEIPT.withholding)) * FREELANCE_RECEIPT.vat)} olur.`,
          "Anlaşmada tutarın brüt mü net mi, KDV dahil mi hariç mi olduğunu yazılı olarak netleştirmek sonradan çıkacak anlaşmazlıkları önler.",
        ],
      },
      {
        heading: "Şahsa kesilen makbuzda stopaj yoktur",
        body: [
          "Hizmeti vergi sorumlusu olmayan bir kişiye veriyorsanız stopaj kesilmez; brüt ücretin tamamı size ödenir. Gelir vergisini yıllık beyannamede kendiniz hesaplayıp ödersiniz.",
        ],
      },
      {
        heading: "e-SMM zorunluluğu",
        body: [
          "Serbest meslek makbuzları elektronik ortamda, e-Serbest Meslek Makbuzu (e-SMM) olarak düzenlenir. GİB'in e-Arşiv portalı ya da özel entegratör yazılımları kullanılabilir.",
          "Kesilen makbuzlar aylık KDV beyannamesine ve üç ayda bir verilen geçici vergi beyannamesine yansıtılır.",
        ],
      },
    ],
    faqs: [
      {
        question: "Stopaj yıllık vergiden düşülür mü?",
        answer:
          "Evet. Yıl içinde kesilen stopajlar peşin ödenmiş vergi sayılır ve yıllık beyannamede hesaplanan vergiden mahsup edilir.",
      },
      {
        question: "Yurt dışındaki müşteriye kesilen makbuzda KDV var mı?",
        answer:
          "Yurt dışındaki müşteriye verilen ve yurt dışında yararlanılan hizmetler hizmet ihracatı sayılabilir ve KDV'den istisna olabilir. Şartları mali müşavirinizle teyit edin.",
      },
      {
        question: "Genç girişimci istisnası serbest meslekte geçerli mi?",
        answer:
          "Belirli şartları taşıyan 29 yaşından küçük ilk kez mükellef olanlar, üç yıl boyunca belli bir tutara kadar kazançları için gelir vergisi istisnasından yararlanabilir. Stopaj ve KDV ise bu istisnadan etkilenmez.",
      },
    ],
    related: [`gelir-vergisi-dilimleri-${Y}`, "kdv-nedir-nasil-hesaplanir", "vergi-dilimi-atlayinca-maas-duser-mi"],
  },

  /* =======================================================
     BİLEŞİK FAİZ
  ======================================================= */
  {
    slug: "bilesik-faiz-nedir-nasil-hesaplanir",
    title: "Bileşik Faiz Nedir, Nasıl Hesaplanır?",
    metaTitle: "Bileşik Faiz Nedir? Formül ve Örnekler",
    description:
      "Bileşik faiz formülü, basit faizle farkı, 72 kuralı ve düzenli yatırımın etkisi. Örneklerle birikiminizin nasıl katlandığını öğrenin.",
    category: "Finans",
    icon: "📈",
    published: PUBLISHED,
    updated: PUBLISHED,
    readingMinutes: 5,
    tool: { slug: "bilesik-faiz", label: "Bileşik Faiz Hesaplama" },
    intro:
      "Bileşik faiz, kazandığınız faizin de faiz kazanmasıdır. Kısa vadede basit faizden farkı küçük görünür, ama süre uzadıkça aradaki fark katlanarak büyür. Birikim ve yatırım kararlarında bu etkiyi anlamak en önemli adımdır.",
    sections: [
      {
        heading: "Bileşik faiz formülü",
        body: [
          "Dönem sonu tutar = Anapara × (1 + r ÷ n)<sup>n × t</sup>",
          "Burada r yıllık oran, n faizin yılda kaç kez eklendiği, t ise yıl cinsinden süredir.",
          `Örnek: 50.000 TL, yıllık %30, aylık bileşik, 3 yıl → ${tl(50000 * Math.pow(1 + 0.3 / 12, 36))}. Basit faizle aynı sürede ${tl(50000 * (1 + 0.3 * 3))} olurdu.`,
        ],
      },
      {
        heading: "Faiz sıklığı neden önemli?",
        body: [
          `Aynı yıllık oran, faiz ne kadar sık eklenirse o kadar yüksek gerçek getiri sağlar. Yıllık %40 oran aylık eklendiğinde efektif yıllık getiri ${pct(Math.pow(1 + 0.4 / 12, 12) - 1)}'e çıkar.`,
          "Bankaların ilan ettiği yıllık oranlar ile efektif oranlar bu yüzden farklıdır; karşılaştırma yaparken efektif oranı esas alın.",
        ],
      },
      {
        heading: "Düzenli yatırımın gücü",
        body: [
          "Tek seferlik büyük bir tutar yerine her ay küçük tutarlar eklemek de bileşik etkiden yararlanır. Erken başlamak, daha yüksek tutarla geç başlamaktan çoğu zaman daha çok kazandırır; çünkü ilk yatırılan paralar en uzun süre faiz kazanır.",
        ],
      },
      {
        heading: "Reel getiriyi unutmayın",
        body: [
          "Yüksek enflasyon döneminde nominal getiri yanıltıcı olabilir. Paranızın alım gücünün artıp artmadığını görmek için getiriyi aynı dönemin enflasyonuyla karşılaştırın: reel getiri = (1 + nominal) ÷ (1 + enflasyon) − 1.",
        ],
      },
    ],
    faqs: [
      {
        question: "72 kuralı nedir?",
        answer:
          "Paranın kaç yılda ikiye katlanacağını bulmak için 72'yi yıllık yüzde getiriye bölersiniz. Yıllık %18 getiriyle para yaklaşık 4 yılda ikiye katlanır.",
      },
      {
        question: "Mevduatta bileşik faiz var mı?",
        answer:
          "Vadeli mevduatı faiziyle birlikte yenilediğinizde bileşik getiri elde edersiniz. Her vade sonunda faizden stopaj kesildiği için net getiri hesaplamada stopajı da dikkate almak gerekir.",
      },
      {
        question: "Kredi borcunda da bileşik faiz işler mi?",
        answer:
          "Eşit taksitli kredilerde faiz her ay kalan anapara üzerinden hesaplanır. Kredi kartında ödenmeyen borca işleyen faiz ise ertesi ay borca eklenerek bileşik etki yaratır.",
      },
    ],
    related: ["vadeli-mevduat-getirisi-nasil-hesaplanir", "enflasyon-ve-zam-farki-hesaplama", "bes-birikim-ve-devlet-katkisi"],
  },

  /* =======================================================
     KREDİ ERKEN KAPATMA
  ======================================================= */
  {
    slug: "kredi-erken-kapatma-nasil-hesaplanir",
    title: "Kredi Erken Kapatma Nasıl Hesaplanır? Tazminat ve Faiz İndirimi",
    metaTitle: `Kredi Erken Kapatma Cezası Var mı? ${Y}`,
    description: `Kredi erken kapatılınca ne kadar ödenir, erken ödeme tazminatı var mı? İhtiyaç, taşıt ve konut kredisinde ${Y} kuralları ve örnek hesaplama.`,
    category: "Finans",
    icon: "🔓",
    published: PUBLISHED,
    updated: PUBLISHED,
    readingMinutes: 6,
    tool: { slug: "kredi-erken-kapatma", label: "Kredi Erken Kapatma Hesaplama" },
    intro:
      "Elinize toplu para geçtiğinde krediyi erken kapatmak cazip gelir. Peki bankaya kalan taksitlerin tamamını mı ödersiniz, ceza var mı? Bu rehberde erken kapatma tutarının nasıl hesaplandığını ve hangi kredide tazminat ödendiğini anlatıyoruz.",
    sections: [
      {
        heading: "Erken kapatmada kalan taksitler değil, kalan anapara ödenir",
        body: [
          "Eşit taksitli kredide her taksit bir miktar faiz ve bir miktar anaparadan oluşur. Krediyi kapattığınızda gelecek ayların faizi silinir; yalnızca kalan anaparayı ve kapatma gününe kadar işlemiş faizi ödersiniz.",
          `Örnek: 200.000 TL, aylık %3,5 faizli, 24 ay vadeli ihtiyaç kredisinde KKDF ve BSMV ile taksit ${tl(loan.installment)}'dir. 6 taksit ödendikten sonra kalan 18 taksitin toplamı ${tl(loan.left)}, ancak kalan anapara <strong>${tl(loan.remaining)}</strong>'dir. Erken kapatma ${tl(loan.left - loan.remaining)} faiz tasarrufu sağlar.`,
        ],
      },
      {
        heading: "Hangi kredide erken ödeme tazminatı var?",
        body: [
          "- <strong>İhtiyaç ve taşıt kredisi:</strong> Erken ödeme tazminatı alınamaz.",
          `- <strong>Sabit faizli konut kredisi:</strong> Kalan vade ${EARLY_REPAYMENT.thresholdMonths} ay veya daha kısaysa en fazla ${pct(EARLY_REPAYMENT.shortRate)}, daha uzunsa en fazla ${pct(EARLY_REPAYMENT.longRate)}.`,
          "- <strong>Değişken faizli konut kredisi:</strong> Erken ödeme tazminatı alınamaz.",
          "Tazminat, kalan anapara üzerinden hesaplanır ve yasal üst sınırdır; banka daha düşük oran uygulayabilir veya hiç almayabilir.",
        ],
      },
      {
        heading: "Erken kapatma adım adım",
        body: [
          "- Bankanızdan veya mobil uygulamadan \"erken kapama tutarı\" bilgisini isteyin; tutar kapatma gününe göre hesaplanır.",
          "- Tutarı hesabınıza yatırıp kapama talimatı verin.",
          "- Kredi kapandıktan sonra kredi hayat sigortasının kalan süresine ait prim iadesini talep edin.",
          "- Konut kredisinde ipotek kaldırma (fek) yazısını bankadan alıp tapu müdürlüğüne başvurun.",
        ],
      },
    ],
    faqs: [
      {
        question: "Erken kapatınca sigorta primi iade edilir mi?",
        answer:
          "Kredi süresine bağlı hayat sigortası yapıldıysa, kalan süreye ait prim genellikle iade edilir. İade için sigorta şirketine veya bankaya başvurmanız gerekebilir.",
      },
      {
        question: "Ara ödeme yapınca taksit mi azalır, vade mi kısalır?",
        answer:
          "Banka ara ödemeden sonra ya taksit tutarını düşürür ya da vadeyi kısaltır. Toplam faiz açısından vadeyi kısaltmak genellikle daha avantajlıdır.",
      },
      {
        question: "Erken kapatmak kredi notumu etkiler mi?",
        answer:
          "Krediyi erken ve düzenli kapatmak kredi notunu olumsuz etkilemez; ödeme geçmişinize olumlu kayıt olarak yansır.",
      },
    ],
    related: ["kredi-taksiti-nasil-hesaplanir", "konut-kredisi-masraflari", "bilesik-faiz-nedir-nasil-hesaplanir"],
  },

  /* =======================================================
     SU İHTİYACI
  ======================================================= */
  {
    slug: "gunde-kac-litre-su-icilmeli",
    title: "Günde Kaç Litre Su İçilmeli? Kiloya Göre Su İhtiyacı",
    metaTitle: "Günde Kaç Litre Su İçilmeli? Kiloya Göre Hesap",
    description:
      "Günde kaç litre su içmelisiniz? Kiloya göre su ihtiyacı formülü, egzersiz ve sıcak havada ek ihtiyaç, susuzluk belirtileri ve pratik öneriler.",
    category: "Sağlık",
    icon: "💧",
    published: PUBLISHED,
    updated: PUBLISHED,
    readingMinutes: 4,
    tool: { slug: "su-ihtiyaci", label: "Günlük Su İhtiyacı Hesaplama" },
    intro:
      "\"Günde 8 bardak\" kuralı herkese uymaz. Su ihtiyacı kilonuza, ne kadar hareket ettiğinize ve havaya göre değişir. Bu rehberde kendi ihtiyacınızı nasıl hesaplayacağınızı ve yeterli su içip içmediğinizi nasıl anlayacağınızı anlatıyoruz.",
    sections: [
      {
        heading: "Kiloya göre su ihtiyacı",
        body: [
          "Pratik formül kilogram başına yaklaşık 30–35 ml'dir:",
          "- 55 kg: yaklaşık 1,8 litre",
          "- 70 kg: yaklaşık 2,3 litre",
          "- 85 kg: yaklaşık 2,8 litre",
          "Avrupa Gıda Güvenliği Otoritesi (EFSA), yiyeceklerle birlikte toplam sıvı alımı için kadınlarda 2,0 litre, erkeklerde 2,5 litre önerir.",
        ],
      },
      {
        heading: "Ne zaman daha fazla su gerekir?",
        body: [
          "- Egzersiz: her 30 dakika için yaklaşık 350 ml ek",
          "- Sıcak ve nemli hava: yaklaşık 500 ml ek",
          "- Ateşli hastalık, ishal ve kusma: kaybedilen sıvı yerine konmalı",
          "- Emzirme dönemi: günlük ihtiyaç yaklaşık 700 ml artar",
        ],
      },
      {
        heading: "Susuzluğun belirtileri",
        body: [
          "Koyu renkli idrar, baş ağrısı, yorgunluk, konsantrasyon güçlüğü ve ağız kuruluğu yetersiz sıvı alımının yaygın belirtileridir. Yaşlılarda susama hissi zayıfladığı için belirtiler geç fark edilebilir.",
        ],
      },
      {
        heading: "Daha fazla su içmek için pratik öneriler",
        body: [
          "- Güne bir bardak suyla başlayın.",
          "- Yanınızda su şişesi taşıyın; gün içinde kaç kez doldurduğunuzu takip edin.",
          "- Her öğünde bir bardak su için.",
          "- Salatalık, karpuz, çorba gibi su oranı yüksek yiyecekleri tercih edin.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kilo vermek için daha çok su içmek işe yarar mı?",
        answer:
          "Yemekten önce su içmek tokluk hissini artırarak daha az yemenize yardımcı olabilir. Ancak su tek başına kilo verdirmez; kalori dengesi belirleyicidir.",
      },
      {
        question: "Gece su içmek zararlı mı?",
        answer:
          "Zararlı değildir, ancak yatmadan hemen önce çok su içmek gece uyanmaya yol açabilir. Günlük ihtiyacın büyük kısmını gündüz karşılamak daha rahattır.",
      },
      {
        question: "Maden suyu ve ayran su yerine sayılır mı?",
        answer:
          "Sıvı alımına katkı sağlarlar. Maden suyunun sodyum, ayranın tuz içeriği yüksek olabileceği için tansiyon hastalarının miktara dikkat etmesi gerekir.",
      },
    ],
    related: ["ideal-kilo-nasil-hesaplanir", "adet-dongusu-nasil-hesaplanir"],
  },
];
