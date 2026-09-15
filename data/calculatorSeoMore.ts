/**
 * Hesaplama sayfaları için ek açıklama bölümleri ("Formülü nedir?",
 * örnek hesap, tablolar, sık yapılan hatalar).
 *
 * Yıla bağlı tüm rakamlar data/parameters.ts dosyasından üretilir; bir oran
 * değiştiğinde bu metinler de kendiliğinden güncellenir.
 */

import type { SeoSection } from "@/data/calculatorSeo";
import {
  CONSUMER_LOAN_TAXES,
  DEPOSIT_WITHHOLDING,
  MINIMUM_WAGE,
  PARAMETERS_YEAR as Y,
  RATES,
  SEVERANCE_CEILINGS,
  tl,
} from "@/data/parameters";

const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;
const r2 = (value: number) => Math.round(value * 100) / 100;
const dmy = (iso: string) => iso.split("-").reverse().join(".");

const [ceiling] = SEVERANCE_CEILINGS;
const stamp = RATES.stampTax;

/* Kıdem örneği: 60.000 TL giydirilmiş ücret, 7 yıl 3 ay */
const sevWage = 60000;
const sevYears = 7.25;
const sevGross = r2(sevWage * sevYears);
const sevStamp = r2(sevGross * stamp);

/* Tavan örneği: 100.000 TL ücret, 5 yıl */
const capGross = r2(ceiling.amount * 5);

/* İhbar örneği: 45.000 TL giydirilmiş, 4 yıl → 8 hafta */
const noticeDaily = 45000 / 30;
const noticeGross = r2(noticeDaily * 56);

/* Fazla mesai: asgari ücret üzerinden */
const hourlyMin = r2(MINIMUM_WAGE.gross / 225);
const overtimeHour = r2(hourlyMin * 1.5);

/* Yıllık izin ücreti: asgari ücretle 14 gün */
const leavePay = r2((MINIMUM_WAGE.gross / 30) * 14);

/* Kredi örneği: 200.000 TL, 24 ay, aylık %3 akdi */
const taxFactor = 1 + CONSUMER_LOAN_TAXES.kkdf + CONSUMER_LOAN_TAXES.bsmv;
const loanRate = 0.03 * taxFactor;
const loanPmt = r2((200000 * loanRate * Math.pow(1 + loanRate, 24)) / (Math.pow(1 + loanRate, 24) - 1));
const loanTotal = r2(loanPmt * 24);

/* Mevduat örneği: 250.000 TL, %40, 92 gün */
const depGross = r2(250000 * 0.4 * (92 / 365));
const depTax = r2(depGross * DEPOSIT_WITHHOLDING.upTo6Months);

export const moreToolSections: Record<string, SeoSection[]> = {
  /* ======================== KIDEM ======================== */
  kidem: [
    {
      heading: "Kıdem tazminatı nasıl hesaplanır? Formül",
      body: [
        "Kıdem tazminatı = <strong>Giydirilmiş brüt ücret × Çalışma süresi (yıl)</strong>",
        "Her tam çalışma yılı için 30 günlük giydirilmiş brüt ücret ödenir; artan ay ve günler orantılı eklenir. Giydirilmiş ücrete düzenli yemek, yol, ikramiye ve benzeri yan haklar dahildir.",
        `Örnek: Giydirilmiş brüt ücreti ${tl(sevWage)} olan ve 7 yıl 3 ay (7,25 yıl) çalışan işçi için brüt tazminat ${tl(sevWage)} × 7,25 = <strong>${tl(sevGross)}</strong>. Damga vergisi (binde ${(stamp * 1000).toLocaleString("tr-TR")}) ${tl(sevStamp)} düşülünce net <strong>${tl(r2(sevGross - sevStamp))}</strong> olur.`,
      ],
    },
    {
      heading: `${Y} kıdem tazminatı tavanı ve etkisi`,
      body: [
        `${dmy(ceiling.from)} – ${dmy(ceiling.to)} döneminde yıllık tavan <strong>${tl(ceiling.amount)}</strong>'dir. Ücretiniz tavanı aşıyorsa her yıl için tavan tutarı esas alınır.`,
        `Örnek: Aylık giydirilmiş ücreti 100.000 TL olan ve 5 yıl çalışan işçi 500.000 TL değil, ${tl(ceiling.amount)} × 5 = <strong>${tl(capGross)}</strong> brüt tazminat alır.`,
        "Hesapta işe giriş yılının değil, <strong>işten ayrılış tarihinin</strong> tavanı kullanılır.",
      ],
    },
    {
      heading: "Kimler kıdem tazminatı alır, kimler alamaz?",
      body: [
        "- Aynı işverende en az 1 yıl çalışmış olmak ön şarttır.",
        "- İşverenin haklı neden olmadan fesih yapması, işçinin haklı nedenle (ücretin ödenmemesi, mobbing vb.) ayrılması tazminat hakkı doğurur.",
        "- Askerlik, emeklilik ve kadın işçinin evlendikten sonra 1 yıl içinde ayrılması da hak kazandırır.",
        "- Haklı neden olmadan istifa eden ve ahlak ve iyi niyet kurallarına aykırılık nedeniyle çıkarılan işçi alamaz.",
        "Kıdem tazminatı alacağında zamanaşımı 5 yıldır; önce zorunlu arabuluculuğa başvurulur.",
      ],
    },
  ],

  /* ======================== İHBAR ======================== */
  ihbar: [
    {
      heading: "İhbar süreleri ve ihbar tazminatı formülü",
      body: [
        "- 6 aydan az çalışma: 2 hafta (14 gün)",
        "- 6 ay – 1,5 yıl: 4 hafta (28 gün)",
        "- 1,5 – 3 yıl: 6 hafta (42 gün)",
        "- 3 yıldan fazla: 8 hafta (56 gün)",
        "İhbar tazminatı = <strong>Günlük giydirilmiş brüt ücret × İhbar süresi (gün)</strong>",
        `Örnek: Giydirilmiş brüt ücreti 45.000 TL olan ve 4 yıl çalışan işçinin günlük ücreti 1.500 TL, ihbar süresi 56 gündür. Brüt ihbar tazminatı 1.500 × 56 = <strong>${tl(noticeGross)}</strong>.`,
      ],
    },
    {
      heading: "İhbar tazminatından hangi kesintiler yapılır?",
      body: [
        `İhbar tazminatından <strong>gelir vergisi</strong> (kümülatif matraha göre %15–%40) ve <strong>damga vergisi</strong> (binde ${(stamp * 1000).toLocaleString("tr-TR")}) kesilir; SGK primi kesilmez. Kıdem tazminatından farklı olarak tavan uygulanmaz.`,
        "Yılın ikinci yarısında işten çıkarılanlarda kümülatif matrah yüksek olduğundan ihbar tazminatı üst vergi dilimine girebilir ve net tutar belirgin şekilde düşer.",
      ],
    },
    {
      heading: "İhbar tazminatını kim kime öder?",
      body: [
        "Bildirim süresine uymadan sözleşmeyi fesheden taraf, karşı tarafa ihbar tazminatı öder. Yani işveren bildirimsiz çıkarırsa işçiye; işçi bildirimsiz istifa ederse işverene öder.",
        "İşveren bildirim süresini çalıştırarak kullandırırsa, işçiye bu süre içinde günde en az 2 saat iş arama izni vermek zorundadır.",
      ],
    },
  ],

  /* ======================== KIDEM + İHBAR ======================== */
  "kidem-ihbar": [
    {
      heading: "İşten çıkarılınca toplam alacak nasıl hesaplanır?",
      body: [
        "Haklı neden olmadan ve bildirimsiz çıkarılan işçinin alacakları genellikle şu kalemlerden oluşur:",
        "- <strong>Kıdem tazminatı:</strong> her yıl için 30 günlük giydirilmiş brüt ücret (tavanlı), yalnızca damga vergisi",
        "- <strong>İhbar tazminatı:</strong> 2–8 haftalık ücret (tavansız), gelir vergisi + damga vergisi",
        "- <strong>Kullanılmayan yıllık izin ücreti:</strong> günlük brüt ücret × kalan izin günü",
        "- <strong>Son ayın ücreti</strong> ve varsa ödenmemiş fazla mesai alacağı",
      ],
    },
    {
      heading: "Örnek toplam hesap",
      body: [
        `Giydirilmiş brüt ücreti ${tl(sevWage)} olan, 7 yıl 3 ay çalışan ve bildirimsiz çıkarılan işçi için:`,
        `- Kıdem tazminatı (brüt): ${tl(sevGross)}`,
        `- İhbar tazminatı (56 gün, brüt): ${tl(r2((sevWage / 30) * 56))}`,
        `- 10 gün kullanılmayan izin (brüt): ${tl(r2((sevWage / 30) * 10))}`,
        `Toplam brüt alacak yaklaşık <strong>${tl(r2(sevGross + (sevWage / 30) * 66))}</strong>. Net tutar, ihbar ve izin ücretindeki vergiler nedeniyle kalem kalem hesaplanmalıdır.`,
      ],
    },
  ],

  /* ======================== YAŞ ======================== */
  yas: [
    {
      heading: "Yaş hesaplama formülü",
      body: [
        "Tam yaş üç adımda bulunur: doğum gününüzün bu yıl geçip geçmediğine göre tam yıl, son doğum gününden bugüne tam ay, son ay dönümünden bugüne gün.",
        "Toplam gün hesabında 4 yılda bir gelen 29 Şubat'lar da sayılır; bu yüzden 30 yaşındaki birinin yaşadığı gün sayısı 10.950 değil yaklaşık 10.957'dir.",
      ],
    },
    {
      heading: "Resmî işlemlerde yaş sınırları",
      body: [
        "- <strong>Ehliyet (B sınıfı):</strong> 18 yaşını doldurmuş olmak",
        "- <strong>Seçimlerde oy kullanma:</strong> 18 yaş",
        "- <strong>İlkokula başlama:</strong> eylül sonu itibarıyla 69 ayını dolduranlar kayıt yaptırır; 66–68 aylık çocuklar velinin isteğiyle başlayabilir",
        "- <strong>Emeklilik:</strong> sigorta başlangıç tarihine göre kadında 58, erkekte 60 yaş (EYT kapsamında yaş şartı yok)",
        "Nüfus kaydında yalnızca doğum yılı yazılıysa doğum tarihi <strong>1 Temmuz</strong> kabul edilir.",
      ],
    },
    {
      heading: "29 Şubat'ta doğanlar ve saat farkı",
      body: [
        "Artık yılda doğanlar, artık olmayan yıllarda yaş gününü hukuken 1 Mart itibarıyla doldurmuş sayılır.",
        "Yaş hesabında saat dilimi farkı sonucu değiştirebilir; resmî işlemlerde Türkiye saatine göre takvim günü esas alınır.",
      ],
    },
  ],

  /* ======================== FAZLA MESAİ ======================== */
  "fazla-mesai": [
    {
      heading: "Fazla mesai ücreti formülü",
      body: [
        "Saatlik ücret = <strong>Aylık brüt ücret ÷ 225</strong> (30 gün × 7,5 saat)",
        "Fazla mesai ücreti = Saatlik ücret × <strong>1,5</strong> × Fazla çalışılan saat",
        "Sözleşmedeki haftalık süre 45 saatten azsa, bu süre ile 45 saat arasındaki çalışma <strong>1,25</strong> katsayısıyla ödenir (fazla süreli çalışma).",
      ],
    },
    {
      heading: `${Y} asgari ücretle fazla mesai örneği`,
      body: [
        `- Brüt asgari ücret: ${tl(MINIMUM_WAGE.gross)}`,
        `- Saatlik brüt ücret: ${tl(MINIMUM_WAGE.gross)} ÷ 225 = ${tl(hourlyMin)}`,
        `- 1 saat fazla mesai (×1,5): <strong>${tl(overtimeHour)}</strong>`,
        `- Ayda 20 saat fazla mesai: <strong>${tl(r2(overtimeHour * 20))}</strong> brüt`,
        "Fazla mesai ücreti asgari ücret istisnasının dışındadır; SGK primi, gelir vergisi ve damga vergisi kesilir.",
      ],
    },
    {
      heading: "Yasal sınırlar",
      body: [
        "- Haftalık 45 saati aşan çalışma fazla mesaidir; günlük çalışma 11 saati geçemez.",
        "- Yıllık fazla mesai üst sınırı <strong>270 saattir</strong>.",
        "- Fazla mesai için işçinin yazılı onayı gerekir.",
        "- İşçi isterse ücret yerine her fazla saat için 1 saat 30 dakika serbest zaman kullanabilir.",
      ],
    },
  ],

  /* ======================== YILLIK İZİN ======================== */
  "yillik-izin": [
    {
      heading: "Kıdeme ve yaşa göre yıllık izin süreleri",
      body: [
        "- 1 – 5 yıl (5 hariç): <strong>14 gün</strong>",
        "- 5 – 15 yıl (15 hariç): <strong>20 gün</strong>",
        "- 15 yıl ve üzeri: <strong>26 gün</strong>",
        "- 18 yaş altı ve 50 yaş üstü çalışanlara en az <strong>20 gün</strong>",
        "Süreler iş günü olarak hesaplanır; hafta tatili ve resmî tatiller izinden sayılmaz. Deneme süresi de kıdeme dahildir.",
      ],
    },
    {
      heading: "İzin ücreti ve kullanılmayan izin",
      body: [
        "İzin ücreti = Günlük brüt ücret × İzin günü",
        `Örnek: ${Y} brüt asgari ücretle çalışan birinin 14 günlük izin ücreti ${tl(MINIMUM_WAGE.gross)} ÷ 30 × 14 = <strong>${tl(leavePay)}</strong> brüttür.`,
        "İş sözleşmesi hangi nedenle sona ererse ersin kullanılmayan izin günlerinin ücreti ödenir. Bu alacakta zamanaşımı, sözleşmenin bittiği tarihten itibaren 5 yıldır.",
      ],
    },
    {
      heading: "İzin bölünebilir mi, yol izni var mı?",
      body: [
        "Taraflar anlaşırsa izin, bir parçası 10 günden az olmamak üzere en fazla üçe bölünebilir.",
        "İzni işyerinin bulunduğu şehir dışında geçirecek işçiye, belgelemesi hâlinde gidiş-dönüş için toplam 4 güne kadar ücretsiz yol izni verilir.",
      ],
    },
  ],

  /* ======================== KİRA ARTIŞI ======================== */
  "kira-artisi": [
    {
      heading: "Kira artışı nasıl hesaplanır?",
      body: [
        "Yeni kira = Mevcut kira × (1 + Artış oranı ÷ 100)",
        "Konut ve çatılı işyeri kiralarında artış oranı, kira yılının yenilendiği aydan önceki <strong>son 12 ayın TÜFE ortalamasını</strong> geçemez. Bu oran her ay TÜİK enflasyon verisiyle birlikte açıklanır.",
        "Örnek: 25.000 TL kirada 12 aylık TÜFE ortalaması %30 ise yeni kira en fazla 25.000 × 1,30 = <strong>32.500 TL</strong> olur. Taraflar daha düşük bir oranda anlaşabilir.",
      ],
    },
    {
      heading: "5 yıl dolunca ve tahliye durumunda",
      body: [
        "Kira süresi 5 yılı doldurduktan sonra yeni bedel TÜFE sınırına bağlı kalmadan emsal kira bedelleri, konutun durumu ve TÜFE dikkate alınarak hakkaniyete göre belirlenebilir. Anlaşma olmazsa önce arabuluculuğa, sonra sulh hukuk mahkemesine kira tespit davasıyla gidilir.",
        "Kira sözleşmesi 10 yıllık uzama süresini doldurduğunda ev sahibi, sözleşme süresinin bitiminden en az 3 ay önce bildirmek şartıyla sebep göstermeden sözleşmeyi sona erdirebilir.",
      ],
    },
    {
      heading: "Depozito ve ödeme",
      body: [
        "Konut kiralarında depozito (güvence bedeli) <strong>3 aylık kira bedelini</strong> aşamaz.",
        "Kira ödemelerini ve artış anlaşmasını banka veya PTT üzerinden, açıklamasıyla birlikte yapmak ispat açısından önemlidir.",
      ],
    },
  ],

  /* ======================== KREDİ ======================== */
  "kredi-borc": [
    {
      heading: "Kredi taksiti formülü",
      body: [
        "Aylık taksit = K × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1)",
        "K kredi tutarı, n taksit sayısı, r ise vergiler dahil aylık faiz oranıdır.",
        `İhtiyaç ve taşıt kredilerinde faize ${pct(CONSUMER_LOAN_TAXES.kkdf)} KKDF ve ${pct(CONSUMER_LOAN_TAXES.bsmv)} BSMV eklenir; bu yüzden r = akdi faiz × ${taxFactor.toLocaleString("tr-TR")}'dur. Konut kredilerinde bu kesintiler yoktur.`,
      ],
    },
    {
      heading: "Örnek: 200.000 TL, 24 ay, aylık %3 faiz",
      body: [
        `- Vergiler dahil aylık oran: %3 × ${taxFactor.toLocaleString("tr-TR")} = %${(3 * taxFactor).toLocaleString("tr-TR")}`,
        `- Aylık taksit: <strong>${tl(loanPmt)}</strong>`,
        `- Toplam geri ödeme: ${tl(loanTotal)}`,
        `- Faiz, KKDF ve BSMV toplamı: <strong>${tl(r2(loanTotal - 200000))}</strong>`,
        "İlk taksitlerde ödemenin büyük kısmı faiz ve vergidir; anapara payı her ay artar.",
      ],
    },
    {
      heading: "Masraflar ve erken kapama",
      body: [
        "- Kredi tahsis ücreti yasal olarak kredi tutarının <strong>binde 5</strong>'ini aşamaz.",
        "- Tüketici kredisini erken kapatırsanız kalan döneme ait faiz ve vergiler alınmaz.",
        "- Sabit faizli konut kredilerinde erken ödeme tazminatı, kalan vade 36 ay ve altındaysa kalan anaparanın %1'i, üzerindeyse %2'sidir.",
        "Teklifleri aylık faiz yerine sözleşme öncesi formdaki <strong>yıllık maliyet oranı</strong> ile karşılaştırın.",
      ],
    },
  ],

  /* ======================== MEVDUAT ======================== */
  mevduat: [
    {
      heading: "Mevduat faizi formülü",
      body: [
        "Brüt faiz = Anapara × Yıllık faiz oranı × Vade (gün) ÷ 365",
        "Net faiz = Brüt faiz × (1 − Stopaj oranı)",
        `Örnek: 250.000 TL, yıllık %40, 92 gün vade → brüt faiz ${tl(depGross)}. 6 aya kadar vadede stopaj ${pct(DEPOSIT_WITHHOLDING.upTo6Months)} olduğundan ${tl(depTax)} kesilir; net getiri <strong>${tl(r2(depGross - depTax))}</strong>.`,
      ],
    },
    {
      heading: `${Y} TL mevduat stopaj oranları`,
      body: [
        `- Vadesiz ve 6 aya kadar vadeli: <strong>${pct(DEPOSIT_WITHHOLDING.upTo6Months)}</strong>`,
        `- 1 yıla kadar vadeli: <strong>${pct(DEPOSIT_WITHHOLDING.upTo1Year)}</strong>`,
        `- 1 yıldan uzun vadeli: <strong>${pct(DEPOSIT_WITHHOLDING.over1Year)}</strong>`,
        `Bu oranlar ${dmy(DEPOSIT_WITHHOLDING.validUntil)} tarihine kadar açılan veya vadesi yenilenen hesaplara uygulanır. Hesap açılışındaki oran vade sonuna kadar geçerlidir.`,
      ],
    },
    {
      heading: "Kısa vade mi, uzun vade mi?",
      body: [
        "Kısa vadeler faiz değişikliklerine hızlı uyum sağlar ve bileşik getiri avantajı sunar, ancak stopaj oranı daha yüksektir. 1 yıldan uzun vadeler daha düşük stopajla vergilendirilir fakat faiz oranı vade boyunca sabit kalır.",
        "Getirinizi enflasyonla karşılaştırmayı unutmayın: net getiri enflasyonun altındaysa paranın satın alma gücü azalır.",
      ],
    },
  ],

  /* ======================== ENFLASYON ======================== */
  enflasyon: [
    {
      heading: "Reel zam formülü",
      body: [
        "Reel artış = (1 + Zam oranı) ÷ (1 + Enflasyon oranı) − 1",
        "Örnek: %25 zam ve %35 enflasyon → 1,25 ÷ 1,35 − 1 = <strong>−%7,4</strong>. Maaş TL olarak artsa da satın alma gücü %7,4 azalmıştır.",
        "Yaygın hata, zamdan enflasyonu çıkarmaktır (%25 − %35 = −%10). Bu yöntem oranlar yükseldikçe daha fazla sapar.",
      ],
    },
    {
      heading: "Birden fazla dönemin enflasyonu",
      body: [
        "Aylık veya yıllık enflasyonlar toplanmaz, çarpılır:",
        "Kümülatif enflasyon = (1 + a) × (1 + b) × … − 1",
        "Örnek: İlk 6 ayda %15, sonraki 6 ayda %12 enflasyon → 1,15 × 1,12 − 1 = <strong>%28,8</strong> (toplama ile bulunan %27 değil).",
      ],
    },
    {
      heading: "Hangi enflasyon verisi kullanılmalı?",
      body: [
        "Maaş ve kira karşılaştırmalarında genellikle TÜİK'in açıkladığı <strong>TÜFE</strong> kullanılır. Kira artış sınırında TÜFE'nin 12 aylık ortalaması, maaş zammı karşılaştırmasında ise yıllık TÜFE daha doğru sonuç verir.",
        "Kişisel harcama sepetiniz (kira, gıda, ulaşım ağırlığı) ortalamadan farklıysa hissettiğiniz enflasyon da farklı olabilir.",
      ],
    },
  ],

  /* ======================== TAKSİT MALİYETİ ======================== */
  "taksit-maliyeti": [
    {
      heading: "Taksit farkı gerçekte kaç faiz?",
      body: [
        "Vade farkı yüzdesi = (Taksitli toplam − Peşin fiyat) ÷ Peşin fiyat × 100",
        "Ancak taksitte borç her ay azaldığı için gerçek faiz bu yüzdenin yaklaşık iki katıdır. Doğru karşılaştırma için taksit tutarından geriye doğru <strong>aylık efektif faiz</strong> bulunur.",
        "Örnek: 30.000 TL peşin, 12 × 2.750 TL taksit → vade farkı %10, fakat gerçek faiz aylık yaklaşık <strong>%1,5</strong>, yıllık bileşik yaklaşık %19,6'dır.",
      ],
    },
    {
      heading: "Peşin indirim mi, taksit mi?",
      body: [
        "Satıcı peşin ödemeye indirim veriyorsa, indirimli peşin fiyat ile taksitli toplamı karşılaştırın. Aradaki farkı taksit sayısına göre aylık faize çevirip mevduat getirinizle kıyaslayın:",
        "- Taksitin gerçek aylık faizi mevduatın aylık net getirisinden <strong>düşükse</strong>: taksit avantajlıdır.",
        "- <strong>Yüksekse</strong>: peşin almak daha kârlıdır.",
        "Faizsiz taksit (peşin fiyatına taksit), yüksek enflasyon döneminde neredeyse her zaman avantajlıdır.",
      ],
    },
  ],

  /* ======================== YAKIT ======================== */
  "yakit-maliyeti": [
    {
      heading: "Yakıt maliyeti formülü",
      body: [
        "Yakıt (litre) = Mesafe (km) × 100 km'deki tüketim ÷ 100",
        "Maliyet = Yakıt (litre) × Litre fiyatı",
        "Kilometre başı maliyet = 100 km'deki tüketim × Litre fiyatı ÷ 100",
        "Örnek: 7,5 L/100 km tüketen ve litresi 50 TL olan yakıt kullanan araçta kilometre başı maliyet 7,5 × 50 ÷ 100 = <strong>3,75 TL</strong>; 600 km'lik yol <strong>2.250 TL</strong> tutar.",
      ],
    },
    {
      heading: "Benzin, dizel, LPG ve elektrik karşılaştırması",
      body: [
        "Farklı yakıtları kıyaslamak için her birinin kilometre başı maliyetini hesaplayın. LPG'nin litre fiyatı düşük olsa da aynı araçta tüketimi benzine göre genellikle %10–20 daha fazladır.",
        "Elektrikli araçlarda formül aynıdır: 100 km'de harcanan kWh × kWh fiyatı ÷ 100. Evde ve hızlı şarj istasyonunda kWh fiyatı çok farklı olduğundan iki senaryoyu ayrı hesaplayın.",
      ],
    },
    {
      heading: "Gerçek tüketiminizi ölçün",
      body: [
        "Depoyu tamamen doldurup kilometre sayacını sıfırlayın. Bir sonraki dolumda aldığınız litreyi gidilen kilometreye bölüp 100 ile çarpın. Katalog değerleri ideal koşullarda ölçüldüğü için gerçek tüketim genellikle daha yüksektir.",
      ],
    },
  ],

  /* ======================== KPSS ======================== */
  "kpss-net": [
    {
      heading: "KPSS puanı nasıl hesaplanır?",
      body: [
        "KPSS puanı netlerden doğrudan bulunmaz. ÖSYM her testin o sınavdaki ortalama ve standart sapmasını kullanarak <strong>standart puan</strong> üretir; puan türleri bu standart puanların ağırlıklı toplamıyla oluşur.",
        "Bu yüzden aynı net, adayların genel başarısına göre farklı yıllarda farklı puana karşılık gelir. Tercih yaparken önceki yılların taban puanları yerine başarı sıralamasına bakmak daha güvenlidir.",
      ],
    },
    {
      heading: "Netinizi artırmanın en hızlı yolu",
      body: [
        "4 yanlış 1 doğruyu götürdüğü için emin olmadığınız soruları boş bırakmak neti korur. Ancak 4 şıktan 2'sini eleyebildiğiniz sorularda işaretleme yapmak istatistiksel olarak avantajlıdır.",
        "Genel Kültür'de en fazla soru Tarih (27) ve Coğrafya'dadır (18); çalışma planında bu iki derse ağırlık vermek toplam neti en hızlı artıran yöntemdir.",
        "KPSS sonuçları sınav tarihinden itibaren <strong>2 yıl</strong> geçerlidir.",
      ],
    },
  ],

  /* ======================== ALES ======================== */
  "ales-net": [
    {
      heading: "ALES puanı ve başvurularda kullanımı",
      body: [
        "ALES puanı sayısal, sözel ve eşit ağırlık türlerinde hesaplanır ve ÖSYM tarafından standart puan yöntemiyle üretilir. Yüksek lisans, doktora ve akademik kadro başvurularında programın istediği puan türüne ve en düşük puan şartına bakılır.",
        "Başvuruda ALES puanı genellikle lisans not ortalaması, yabancı dil puanı ve mülakatla birlikte belirli ağırlıklarla değerlendirilir; ağırlıkları her üniversite kendi ilanında açıklar.",
      ],
    },
    {
      heading: "Sayısal ve sözel testte strateji",
      body: [
        "Sayısal bölümde işlem hızı, sözel bölümde paragraf ve mantık soruları belirleyicidir. Hedef puan türünüzün ağırlığı yüksek olan teste (%75) daha fazla zaman ayırmak toplam puanı en hızlı yükseltir.",
      ],
    },
  ],

  /* ======================== DGS ======================== */
  "dgs-net": [
    {
      heading: "DGS'de yerleşme nasıl belirlenir?",
      body: [
        "DGS yerleştirme puanı, sayısal ve sözel testlerin standart puanlarına <strong>Önlisans Başarı Puanı (ÖBP)</strong> eklenerek hesaplanır. Önlisans mezuniyet ortalaması yüksek olan aday aynı netle daha yüksek puan alır.",
        "Yerleştirme, tercih edilen lisans programının puan türüne (SAY, SÖZ, EA) ve adayın bu türdeki başarı sırasına göre yapılır.",
      ],
    },
    {
      heading: "Tercih yaparken dikkat",
      body: [
        "- Mezun olunan önlisans programının hangi lisans bölümlerine geçişe izin verdiğini ÖSYM tercih kılavuzundan kontrol edin.",
        "- Önceki yılların taban puanları yerine başarı sıralamalarını karşılaştırın; puanlar yıldan yıla değişir.",
        "- Bazı programlar yerleşen adaylardan bilimsel hazırlık veya intibak dersleri almasını isteyebilir; bu durum eğitim süresini uzatabilir.",
      ],
    },
  ],

  /* ======================== YDS ======================== */
  "yds-puan": [
    {
      heading: "YDS, e-YDS ve YÖKDİL farkı",
      body: [
        "- <strong>YDS:</strong> ÖSYM'nin yılda belirli dönemlerde kâğıt üzerinde yaptığı genel yabancı dil sınavı (80 soru).",
        "- <strong>e-YDS:</strong> elektronik ortamda, daha sık yapılan sınav; sonuçları YDS ile eşdeğer kabul edilir.",
        "- <strong>YÖKDİL:</strong> sağlık, sosyal ve fen bilimleri alanlarına özel metinlerle yapılan akademik dil sınavı; akademik kadro ve lisansüstü başvurularında YDS'nin yerine kabul edilir.",
      ],
    },
    {
      heading: "Hedef puana göre gereken doğru sayısı",
      body: [
        "- 50 puan (E seviyesi): 40 doğru",
        "- 60 puan (D seviyesi): 48 doğru",
        "- 70 puan (C seviyesi): 56 doğru",
        "- 80 puan (B seviyesi): 64 doğru",
        "- 90 puan (A seviyesi): 72 doğru",
        "Yanlışlar doğruyu götürmediği için sınavda hiçbir soruyu boş bırakmamak puanı artırır.",
      ],
    },
  ],
};
