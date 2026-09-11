export const categories = [
  { id: "all", label: "Tümü" },
  { id: "calisan", label: "Çalışan Hakları" },
  { id: "finans", label: "Finans & Kredi" },
  { id: "gunluk", label: "Günlük Hesaplar" },
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
