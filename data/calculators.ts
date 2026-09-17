export const categories = [
  { id: "all", label: "Tümü" },
  { id: "calisan", label: "Çalışan Hakları" },
  { id: "finans", label: "Finans & Kredi" },
  { id: "gunluk", label: "Günlük Hesaplar" },
  { id: "egitim", label: "Eğitim & Sınav" },
  { id: "saglik", label: "Sağlık" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const calculators = [
  {
    slug: "net-maas",
    icon: "💰",
    title: "Net Maaş Hesaplama",
    category: "calisan",
    keywords: ["brüt", "net", "maaş", "ücret", "sgk", "gelir vergisi"],
    description:
      "Brüt maaşınız üzerinden tahmini net maaşınızı ve temel kesinti detaylarını hesaplayın.",
  },

  {
    slug: "netten-brute-maas",
    icon: "🔁",
    title: "Netten Brüte Maaş Hesaplama",
    category: "calisan",
    keywords: ["netten brüte", "brüt maaş", "net maaş", "bordro", "maaş pazarlığı"],
    description:
      "Almak istediğiniz net maaşın brüt karşılığını, SGK ve vergi kesintileriyle birlikte hesaplayın.",
  },

  {
    slug: "vucut-kitle-indeksi",
    icon: "⚖️",
    title: "Vücut Kitle İndeksi (VKİ) Hesaplama",
    category: "saglik",
    keywords: ["vki", "bmi", "ideal kilo", "boy kilo", "obezite", "vücut kitle"],
    description:
      "Boy ve kilonuza göre VKİ değerinizi, zayıf-normal-obez sınıfınızı ve ideal kilo aralığınızı öğrenin.",
  },

  {
    slug: "gebelik-haftasi",
    icon: "🤰",
    title: "Gebelik Haftası ve Doğum Tarihi Hesaplama",
    category: "saglik",
    keywords: ["gebelik haftası", "doğum tarihi", "hamilelik", "son adet tarihi", "trimester"],
    description:
      "Son adet tarihinize göre kaçıncı gebelik haftasında olduğunuzu ve tahmini doğum tarihinizi hesaplayın.",
  },

  {
    slug: "kalori-ihtiyaci",
    icon: "🥗",
    title: "Günlük Kalori İhtiyacı Hesaplama",
    category: "saglik",
    keywords: ["kalori", "bmh", "bazal metabolizma", "diyet", "makro", "protein"],
    description:
      "Yaş, boy, kilo ve aktivitenize göre günlük kalori ihtiyacınızı ve protein-yağ-karbonhidrat miktarınızı bulun.",
  },

  {
    slug: "yuzde",
    icon: "%",
    title: "Yüzde Hesaplama",
    category: "gunluk",
    keywords: ["yüzde", "oran", "artış", "azalış", "percent"],
    description:
      "Bir tutarın yüzdesini, yüzde artışını ve yüzde azalışını hızlıca hesaplayın.",
  },

  {
    slug: "kdv",
    icon: "🧮",
    title: "KDV Hesaplama",
    category: "finans",
    keywords: ["kdv", "vergi", "dahil", "hariç", "fatura"],
    description:
      "KDV dahil ve hariç tutarları, KDV miktarını ve genel toplamı hesaplayın.",
  },

  {
    slug: "indirim",
    icon: "🏷️",
    title: "İndirim Hesaplama",
    category: "gunluk",
    keywords: ["indirim", "kampanya", "fiyat", "iskonto"],
    description:
      "İndirim oranına göre indirim tutarını ve indirim sonrası ödenecek fiyatı bulun.",
  },

  {
    slug: "kar-marji",
    icon: "📊",
    title: "Kâr Marjı Hesaplama",
    category: "finans",
    keywords: ["kâr marjı", "kar oranı", "markup", "satış fiyatı", "maliyet", "fiyatlandırma"],
    description:
      "Maliyet ve satış fiyatına göre kâr marjınızı ve kâr oranınızı, hedef marja göre satış fiyatınızı hesaplayın.",
  },

  {
    slug: "tapu-harci",
    icon: "🏡",
    title: "Tapu Harcı Hesaplama",
    category: "finans",
    keywords: ["tapu harcı", "tapu masrafı", "döner sermaye", "ev alırken", "alıcı satıcı harç"],
    description:
      "Satış bedeline göre alıcı ve satıcının ödeyeceği tapu harcını ve toplam tapu masrafını hesaplayın.",
  },

  {
    slug: "kira-geliri-vergisi",
    icon: "🏘️",
    title: "Kira Geliri Vergisi Hesaplama",
    category: "finans",
    keywords: ["kira geliri", "gmsi", "kira vergisi", "mesken istisnası", "götürü gider", "beyanname"],
    description:
      "Konut ve işyeri kira gelirinizin vergisini istisna, gider ve vergi dilimleriyle birlikte hesaplayın.",
  },

  {
    slug: "emlak-vergisi",
    icon: "🏠",
    title: "Emlak Vergisi Hesaplama",
    category: "finans",
    keywords: ["emlak vergisi", "bina vergisi", "arsa vergisi", "belediye", "büyükşehir", "taksit"],
    description:
      "Konut, işyeri, arsa ve arazi için yıllık emlak vergisini, kültür payını ve taksit tutarını hesaplayın.",
  },

  {
    slug: "damga-vergisi",
    icon: "🧾",
    title: "Damga Vergisi Hesaplama",
    category: "finans",
    keywords: ["damga vergisi", "sözleşme", "kira sözleşmesi", "binde 9,48", "bordro", "nüsha"],
    description:
      "Sözleşme, kira sözleşmesi ve bordro için ödenecek damga vergisini ve taraf başına düşen tutarı hesaplayın.",
  },

  {
    slug: "mtv",
    icon: "🚗",
    title: "MTV Hesaplama (Motorlu Taşıtlar Vergisi)",
    category: "finans",
    keywords: ["mtv", "motorlu taşıtlar vergisi", "araç vergisi", "taşıt vergisi", "ocak temmuz taksit"],
    description:
      "Motor hacmi, model yılı ve taşıt değerine göre yıllık MTV tutarınızı ve taksitlerinizi hesaplayın.",
  },

  {
    slug: "ideal-kilo",
    icon: "🎯",
    title: "İdeal Kilo Hesaplama",
    category: "saglik",
    keywords: ["ideal kilo", "boya göre kilo", "kaç kilo olmalıyım", "devine", "sağlıklı kilo"],
    description:
      "Boy ve cinsiyetinize göre ideal kilonuzu ve VKİ'ye dayalı sağlıklı kilo aralığınızı hesaplayın.",
  },

  {
    slug: "adet-takvimi",
    icon: "🗓️",
    title: "Adet Günü Hesaplama (Regl Takvimi)",
    category: "saglik",
    keywords: ["adet günü", "regl takvimi", "yumurtlama", "doğurgan dönem", "adet gecikmesi", "döngü"],
    description:
      "Son adetinize göre sonraki regl tarihinizi, yumurtlama gününüzü ve doğurgan dönemi hesaplayın.",
  },

  {
    slug: "isveren-maliyeti",
    icon: "🏢",
    title: "İşveren Maliyeti Hesaplama",
    category: "calisan",
    keywords: ["işveren maliyeti", "sgk işveren payı", "personel maliyeti", "prim indirimi", "bordro maliyeti"],
    description:
      "Brüt maaşa göre bir çalışanın işverene aylık ve yıllık toplam maliyetini prim indirimleriyle hesaplayın.",
  },

  {
    slug: "kredi-karti-asgari-odeme",
    icon: "💳",
    title: "Kredi Kartı Asgari Ödeme Hesaplama",
    category: "finans",
    keywords: ["asgari ödeme", "kredi kartı faizi", "dönem borcu", "kart limiti", "nakit avans"],
    description:
      "Kart limitinize göre asgari ödeme tutarını, işleyecek faizi ve borcun kaç ayda biteceğini hesaplayın.",
  },

  {
    slug: "gecikme-zammi",
    icon: "⏰",
    title: "Gecikme Zammı Hesaplama",
    category: "finans",
    keywords: ["gecikme zammı", "vergi borcu", "sgk borcu", "trafik cezası", "gecikme faizi", "tecil"],
    description:
      "Vadesinde ödenmeyen vergi, prim ve ceza borçları için gecikme zammını ve toplam ödemeyi hesaplayın.",
  },

  /* ---------------- Eğitim & Sınav ---------------- */

  {
    slug: "vize-final-ortalama",
    icon: "🧑‍🎓",
    title: "Vize Final Ortalama Hesaplama",
    category: "egitim",
    keywords: ["vize final", "finalden kaç almalıyım", "ders ortalaması", "üniversite", "geçme notu"],
    description:
      "Vize ve final notlarınızla dönem sonu ortalamanızı ve dersi geçmek için finalden kaç almanız gerektiğini bulun.",
  },

  {
    slug: "tyt-net",
    icon: "📝",
    title: "TYT Net Hesaplama",
    category: "egitim",
    keywords: ["tyt", "yks", "net", "üniversite sınavı", "obp", "diploma notu"],
    description:
      "Türkçe, sosyal, matematik ve fen doğru-yanlış sayılarınızı girin; TYT netinizi ve OBP katkınızı anında hesaplayın.",
  },

  {
    slug: "ayt-net",
    icon: "🎓",
    title: "AYT Net Hesaplama",
    category: "egitim",
    keywords: ["ayt", "yks", "net", "sayısal", "eşit ağırlık", "sözel"],
    description:
      "AYT ders bazında doğru-yanlış girin; sayısal, eşit ağırlık ve sözel puan türlerine göre netlerinizi görün.",
  },

  {
    slug: "lgs-puan",
    icon: "🏫",
    title: "LGS Net ve Puan Hesaplama",
    category: "egitim",
    keywords: ["lgs", "liseye geçiş", "net", "puan", "ağırlıklı net", "8. sınıf"],
    description:
      "LGS doğru-yanlış sayılarınızla netinizi, katsayılı ağırlıklı netinizi ve tahmini puanınızı hesaplayın.",
  },

  {
    slug: "kpss-net",
    icon: "🏛️",
    title: "KPSS Net Hesaplama",
    category: "egitim",
    keywords: ["kpss", "genel yetenek", "genel kültür", "net", "memurluk"],
    description:
      "KPSS Genel Yetenek ve Genel Kültür doğru-yanlış sayılarınızla ders ve oturum bazında netinizi hesaplayın.",
  },

  {
    slug: "ales-net",
    icon: "📚",
    title: "ALES Net Hesaplama",
    category: "egitim",
    keywords: ["ales", "yüksek lisans", "sayısal", "sözel", "net"],
    description:
      "ALES sayısal ve sözel doğru-yanlış sayılarınızı girerek netlerinizi hesaplayın.",
  },

  {
    slug: "dgs-net",
    icon: "🎒",
    title: "DGS Net Hesaplama",
    category: "egitim",
    keywords: ["dgs", "dikey geçiş", "önlisans", "sayısal", "sözel", "net"],
    description:
      "DGS sayısal ve sözel doğru-yanlış sayılarınızı girerek netlerinizi hesaplayın.",
  },

  {
    slug: "yds-puan",
    icon: "🌍",
    title: "YDS Puan Hesaplama",
    category: "egitim",
    keywords: ["yds", "yökdil", "yabancı dil", "puan", "ingilizce"],
    description:
      "YDS doğru sayınızı girin; yanlışların götürmediği sistemde puanınızı anında hesaplayın.",
  },

  {
    slug: "kira-artisi",
    icon: "🏠",
    title: "Kira Artışı",
    category: "gunluk",
    keywords: ["kira", "artış", "tüfe", "zam", "ev"],
    description:
      "Mevcut kira ve artış oranına göre yeni aylık kira tutarını hesaplayın.",
  },

  {
    slug: "fazla-mesai",
    icon: "⏱️",
    title: "Fazla Mesai",
    category: "calisan",
    keywords: ["mesai", "fazla çalışma", "saat", "ek ücret"],
    description:
      "Aylık brüt ücret, fazla mesai saati ve katsayı üzerinden tahmini fazla mesai ücretini hesaplayın.",
  },

  {
    slug: "kidem",
    icon: "💼",
    title: "Kıdem Tazminatı",
    category: "calisan",
    keywords: ["kıdem", "tazminat", "işten çıkış", "hizmet süresi"],
    description:
      "Çalışma süresi, brüt ücret ve düzenli yan haklara göre tahmini kıdem tazminatınızı hesaplayın.",
  },

  {
    slug: "ihbar",
    icon: "📋",
    title: "İhbar Tazminatı",
    category: "calisan",
    keywords: ["ihbar", "tazminat", "bildirim süresi", "fesih"],
    description:
      "Çalışma sürenize ve ücretinize göre tahmini ihbar tazminatınızı hesaplayın.",
  },

  {
    slug: "kidem-ihbar",
    icon: "🤝",
    title: "Kıdem + İhbar Birlikte",
    category: "calisan",
    keywords: ["kıdem", "ihbar", "tazminat", "toplam"],
    description:
      "Kıdem ve ihbar tazminatınızı aynı ekranda ayrı ayrı ve birlikte hesaplayın.",
  },

  {
    slug: "yas",
    icon: "🎂",
    title: "Yaş Hesaplama",
    category: "gunluk",
    keywords: ["yaş", "doğum tarihi", "gün", "ay"],
    description:
      "Doğum tarihinize göre yaşınızı yıl, ay ve gün olarak hesaplayın.",
  },

  {
    slug: "gun-hesaplama",
    icon: "📅",
    title: "Gün Hesaplama",
    category: "gunluk",
    keywords: ["gün", "tarih", "iki tarih arası", "iş günü", "kaç gün kaldı", "gün ekleme"],
    description:
      "İki tarih arasında kaç gün olduğunu, iş günü sayısını hesaplayın; bir tarihe gün ekleyip çıkarın.",
  },

  {
    slug: "not-ortalamasi",
    icon: "🎓",
    title: "Not Ortalaması Hesaplama",
    category: "egitim",
    keywords: ["not ortalaması", "gano", "karne", "takdir", "teşekkür", "harf notu", "kredi"],
    description:
      "Lise ders saatine göre ağırlıklı ortalamanızı, üniversitede kredi ve harf notuyla GANO'nuzu hesaplayın.",
  },

  {
    slug: "yillik-izin",
    icon: "🏖️",
    title: "Yıllık İzin Hesaplama",
    category: "calisan",
    keywords: ["yıllık izin", "izin hakkı", "tatil", "hizmet yılı"],
    description:
      "İşe giriş tarihinize, hizmet sürenize ve yaşınıza göre yıllık ücretli izin hakkınızı hesaplayın.",
  },

  {
    slug: "emeklilik",
    icon: "👴",
    title: "Emeklilik / EYT Hesaplama",
    category: "calisan",
    keywords: [
      "emeklilik",
      "eyt",
      "sgk",
      "prim günü",
      "sigorta başlangıcı",
      "emeklilik yaşı",
    ],
    description:
      "Sigorta başlangıcı, prim gün sayısı ve yaşınıza göre hangi emeklilik grubuna girdiğinizi ve tahmini emeklilik tarihinizi hesaplayın.",
  },

  {
    slug: "mevduat",
    icon: "🏧",
    title: "Vadeli Mevduat Getirisi",
    category: "finans",
    keywords: [
      "mevduat",
      "faiz",
      "vade",
      "stopaj",
      "birikim",
      "net getiri",
    ],
    description:
      "Anapara, yıllık faiz oranı ve vadeye göre stopaj düşülmüş net getirinizi ve vade sonu toplamınızı hesaplayın.",
  },

  {
    slug: "taksit-maliyeti",
    icon: "🧾",
    title: "Taksitli Alışveriş Maliyeti",
    category: "finans",
    keywords: [
      "taksit",
      "taksit farkı",
      "peşin fiyat",
      "kredi kartı",
      "vade farkı",
    ],
    description:
      "Taksitli fiyat ile peşin fiyat arasındaki farkı ve bu farkın gizli aylık / yıllık faiz karşılığını hesaplayın.",
  },

  {
    slug: "enflasyon",
    icon: "📉",
    title: "Enflasyon / Zam Farkı",
    category: "gunluk",
    keywords: [
      "enflasyon",
      "zam",
      "tüfe",
      "alım gücü",
      "reel artış",
      "maaş zammı",
    ],
    description:
      "Aldığınız zammın enflasyon karşısındaki gerçek değerini, alım gücü kaybınızı ve reel artış oranını hesaplayın.",
  },

  {
    slug: "dogum-izni",
    icon: "👶",
    title: "Doğum ve Süt İzni Hesaplama",
    category: "calisan",
    keywords: [
      "doğum izni",
      "süt izni",
      "analık izni",
      "babalık izni",
      "yarım çalışma ödeneği",
    ],
    description:
      "Doğum izninizin başlangıç ve bitiş tarihlerini, süt izni sürenizi, yarım çalışma ödeneği ve ücretsiz izin hakkınızı hesaplayın.",
  },

  {
    slug: "issizlik-maasi",
    icon: "🧾",
    title: "İşsizlik Maaşı Hesaplama",
    category: "calisan",
    keywords: [
      "işsizlik maaşı",
      "işsizlik ödeneği",
      "işkur",
      "prim gün",
      "işten çıkarılma",
    ],
    description:
      "Son 4 ayın ortalama brüt ücreti ve prim gün sayınıza göre aylık net işsizlik maaşınızı ve kaç ay alacağınızı hesaplayın.",
  },

  {
    slug: "konut-kredisi",
    icon: "🏡",
    title: "Konut Kredisi ve Alım Masrafları",
    category: "finans",
    keywords: [
      "konut kredisi",
      "tapu harcı",
      "ekspertiz",
      "dask",
      "ev alma masrafları",
      "mortgage",
    ],
    description:
      "Konut kredisi taksitinizi ve tapu harcından sigortaya kadar tüm alım masraflarını hesaplayarak evin size gerçek maliyetini görün.",
  },

  {
    slug: "yakit-maliyeti",
    icon: "⛽",
    title: "Yakıt ve Yol Maliyeti",
    category: "gunluk",
    keywords: [
      "yakıt",
      "benzin",
      "motorin",
      "yol masrafı",
      "km maliyeti",
      "seyahat",
    ],
    description:
      "Mesafe, ortalama tüketim ve yakıt fiyatına göre yolculuk maliyetinizi, kişi başı tutarı ve aylık yol giderinizi hesaplayın.",
  },

  {
    slug: "bes",
    icon: "🐖",
    title: "BES Birikim Hesaplama",
    category: "finans",
    keywords: [
      "bes",
      "bireysel emeklilik",
      "devlet katkısı",
      "birikim",
      "emeklilik fonu",
    ],
    description:
      "Aylık katkı payı, süre ve getiri beklentinize göre devlet katkısı dâhil toplam BES birikiminizi ve hak ediş oranınızı hesaplayın.",
  },

  {
    slug: "kredi-borc",
    icon: "🏦",
    title: "Kredi / Banka Borç Hesaplama",
    category: "finans",
    keywords: ["kredi", "taksit", "faiz", "vade", "ödeme planı", "banka"],
    description:
      "Kredi tutarı, faiz ve vadeye göre aylık taksit, toplam faiz, toplam geri ödeme ve ödeme planını hesaplayın.",
  },
] as const;

export type Calculator = (typeof calculators)[number];

/** Aynı kategorideki diğer araçlar (iç link + keşif için) */
export function getRelatedCalculators(slug: string, limit = 3) {
  const current = calculators.find((item) => item.slug === slug);
  if (!current) return [];

  const sameCategory = calculators.filter(
    (item) => item.slug !== slug && item.category === current.category
  );

  const others = calculators.filter(
    (item) => item.slug !== slug && item.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}
