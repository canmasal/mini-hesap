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
