/**
 * Premium paketler: Standart / Plus / Pro.
 *
 * Vitrindeki asıl teklif bu üç pakettir; tekil ürünler ikincil seçenek
 * olarak kalır. Bir paketin içeriği premiumProducts içindeki slug'lara
 * referans verir, böylece ürün bilgisi tek yerde tutulur.
 */

import { premiumProducts, type PremiumProduct } from "@/data/premiumProducts";

export type PlanId = "standart" | "plus" | "pro";

export type Plan = {
  id: PlanId;
  slug: string;
  name: string;
  tagline: string;
  /** Kime hitap ettiği; kartın üstünde tek satır */
  audience: string;
  price: number;
  /** Vitrinde öne çıkarılan paket (tek bir tane olmalı) */
  featured?: boolean;
  badge?: string;
  /** Pakete dahil ürünlerin slug listesi */
  productSlugs: string[];
  /** Üründen bağımsız, pakete özel vaatler */
  perks: string[];
};

export const plans: Plan[] = [
  {
    id: "standart",
    slug: "standart",
    name: "Standart",
    tagline: "Kişisel bütçe ve borç takibi",
    audience: "Bireysel kullanım",
    price: 199,
    productSlugs: [
      "borc-takip",
      "kredi-borc-kapatma",
      "yillik-butce",
      "kidem-ihbar",
    ],
    perks: [
      "4 profesyonel Excel dosyası",
      "Ömür boyu kullanım, abonelik yok",
      "30 gün boyunca yeniden indirme",
    ],
  },

  {
    id: "plus",
    slug: "plus",
    name: "Plus",
    tagline: "İşletmenizin tüm takibi tek pakette",
    audience: "Küçük işletme ve serbest meslek",
    price: 499,
    featured: true,
    badge: "En çok tercih edilen",
    productSlugs: [
      "borc-takip",
      "kredi-borc-kapatma",
      "yillik-butce",
      "kidem-ihbar",
      "on-muhasebe",
      "isletme-yonetim-paneli",
      "personel-bordro",
      "kira-portfoy",
      "eticaret-satici",
      "freelancer",
      "santiye-proje",
      "restoran-maliyet",
    ],
    perks: [
      "Standart paketteki her şey",
      "8 sektörel yönetim paneli",
      "Ömür boyu kullanım, abonelik yok",
      "30 gün boyunca yeniden indirme",
    ],
  },

  {
    id: "pro",
    slug: "pro",
    name: "Pro",
    tagline: "Masaüstü program ve veritabanı dahil",
    audience: "Büyüyen işletmeler",
    price: 999,
    productSlugs: [
      "borc-takip",
      "kredi-borc-kapatma",
      "yillik-butce",
      "kidem-ihbar",
      "on-muhasebe",
      "isletme-yonetim-paneli",
      "personel-bordro",
      "kira-portfoy",
      "eticaret-satici",
      "freelancer",
      "santiye-proje",
      "restoran-maliyet",
      "access-excel-paketi",
      "isletme-programi",
    ],
    perks: [
      "Plus paketteki her şey",
      "Windows masaüstü programı (kurulum gerektirmez)",
      "Access + Excel ilişkisel veritabanı çözümü",
      "Ömür boyu kullanım, abonelik yok",
      "30 gün boyunca yeniden indirme",
    ],
  },
];

/** Slug ile paket bulur; bulunamazsa undefined döner. */
export function findPlan(slug: string): Plan | undefined {
  return plans.find((plan) => plan.slug === slug);
}

/** Paketin içerdiği ürünleri, veri dosyasındaki sırayla döndürür. */
export function planProducts(plan: Plan): PremiumProduct[] {
  return premiumProducts.filter((product) =>
    plan.productSlugs.includes(product.slug)
  );
}

/**
 * Paketteki ürünlerin tek tek satın alınması hâlindeki toplam bedeli.
 * Vitrinde üzeri çizili referans fiyat olarak gösterilir.
 */
export function planListValue(plan: Plan): number {
  return planProducts(plan).reduce((total, product) => total + product.price, 0);
}

/** Pakete girilen tasarruf oranı (yüzde, tam sayıya yuvarlanmış). */
export function planSavingPercent(plan: Plan): number {
  const value = planListValue(plan);
  if (value <= 0) return 0;
  return Math.round((1 - plan.price / value) * 100);
}

/**
 * Satın alınabilir birim: tekil ürün ya da paket.
 *
 * Sipariş, ödeme ve indirme akışları bu ortak biçimi kullanır; böylece
 * paketler tekil ürünlerle aynı yoldan ilerler. Tek fark dosya sayısıdır:
 * tekil üründe bir, pakette birden çok dosya bulunur.
 */
export type PurchasableFile = { fileName: string; label: string };

export type Purchasable = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  price: number;
  features: string[];
  /** Dosya içeriği dökümü; vitrinde "İçerik" olarak gösterilir */
  sheets: string[];
  files: PurchasableFile[];
  isPlan: boolean;
};

/** Slug'a göre ürünü veya paketi ortak biçimde döndürür. */
export function findPurchasable(slug: string): Purchasable | undefined {
  const plan = findPlan(slug);

  if (plan) {
    const products = planProducts(plan);

    return {
      slug: plan.slug,
      title: `MiniHesap ${plan.name} Paketi`,
      tagline: plan.tagline,
      icon: "💎",
      price: plan.price,
      features: [...plan.perks, ...products.map((p) => p.title)],
      sheets: products.map((p) => p.title),
      files: products.map((p) => ({ fileName: p.fileName, label: p.title })),
      isPlan: true,
    };
  }

  const product = premiumProducts.find((item) => item.slug === slug);
  if (!product) return undefined;

  return {
    slug: product.slug,
    title: product.title,
    tagline: product.tagline,
    icon: product.icon,
    price: product.price,
    features: product.features,
    sheets: product.sheets,
    files: [{ fileName: product.fileName, label: product.title }],
    isPlan: false,
  };
}
