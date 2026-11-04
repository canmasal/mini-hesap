import type { Field } from "./literals";

/**
 * Panelden düzenlenebilen dosyalar.
 *
 * Bilinçli olarak dar tutulmuştur: reklam kodu (lib/adsense.ts,
 * components/Ad*), sponsor bağlantısı (lib/sponsor.ts), ödeme ve sipariş
 * kodu listede yoktur ve panelden açılamaz.
 */

export type EditableFile = {
  path: string;
  title: string;
  description: string;
  group: string;
  /** Yalnızca bu kökün altındaki alanları göster (ör. sayfa dosyasında "metadata") */
  onlyUnder?: string;
  /** Hiç gösterilmeyecek anahtarlar */
  hideKeys?: string[];
};

const GROUP_RATES = "Resmî rakamlar";
const GROUP_TOOLS = "Hesaplama araçları";
const GROUP_GUIDES = "Rehber yazıları";
const GROUP_PAGES = "Sayfa başlıkları ve SEO";
const GROUP_PREMIUM = "Premium ürünler";

const page = (path: string, title: string): EditableFile => ({
  path,
  title,
  description: "Sayfanın arama motoru başlığı, açıklaması ve kanonik adresi.",
  group: GROUP_PAGES,
  onlyUnder: "metadata",
  hideKeys: ["verification"],
});

export const EDITABLE_FILES: EditableFile[] = [
  {
    path: "data/parameters.ts",
    title: "Resmî rakamlar",
    description:
      "Asgari ücret, vergi dilimleri, kıdem tavanı, kira artışı, kredi kartı faizi, stopaj ve diğer tüm resmî değerler. Değiştirince LAST_VERIFIED tarihini de güncelleyin.",
    group: GROUP_RATES,
  },
  {
    path: "data/mtv.ts",
    title: "MTV tarifesi",
    description: "Motorlu taşıtlar vergisi tutarları.",
    group: GROUP_RATES,
  },

  {
    path: "data/calculators.ts",
    title: "Araç listesi",
    description: "Hesaplama araçlarının adları, kısa açıklamaları ve kategorileri.",
    group: GROUP_TOOLS,
  },
  ...[
    ["data/calculatorSeo.ts", "SEO metinleri (sınavlar ve temel araçlar)"],
    ["data/calculatorSeoMore.ts", "SEO metinleri (ek bölümler)"],
    ["data/calculatorSeoTools2.ts", "SEO metinleri (2. grup)"],
    ["data/calculatorSeoBatch3.ts", "SEO metinleri (3. grup)"],
    ["data/calculatorSeoBatch4.ts", "SEO metinleri (4. grup)"],
    ["data/calculatorSeoBatch5.ts", "SEO metinleri (5. grup)"],
    ["data/calculatorSeoVergi.ts", "SEO metinleri (vergi araçları)"],
  ].map(([path, title]) => ({
    path,
    title,
    description:
      "Hesaplama sayfalarının başlık, açıklama, giriş metni, adımlar ve SSS içerikleri.",
    group: GROUP_TOOLS,
  })),
  {
    path: "data/longtail.ts",
    title: "Hazır hesap sayfaları",
    description: "/hesapla/* altındaki örnek hesaplama sayfalarının değerleri.",
    group: GROUP_TOOLS,
  },
  {
    path: "data/exams.ts",
    title: "Sınav verileri",
    description: "Sınav net hesaplayıcılarının ders ve soru sayıları.",
    group: GROUP_TOOLS,
  },

  ...[
    ["data/guides.ts", "Temel rehberler"],
    ["data/guidesCalisan.ts", "Çalışan hakları"],
    ["data/guidesFinans.ts", "Finans"],
    ["data/guidesVergi.ts", "Vergi"],
    ["data/guidesGuncel.ts", "Güncel rakam rehberleri"],
    ["data/guidesHesap.ts", "Hesaplama rehberleri"],
    ["data/guidesAraclar.ts", "Araç rehberleri"],
    ["data/guidesDijitalArac.ts", "Dijital araç rehberleri"],
    ["data/guidesEngelli.ts", "Engelli hakları"],
    ["data/guidesEk.ts", "Ek rehberler"],
  ].map(([path, title]) => ({
    path,
    title,
    description:
      "Rehber yazılarının başlıkları, SEO açıklamaları, paragrafları ve SSS'leri. \"- \" ile başlayan satır madde olur.",
    group: GROUP_GUIDES,
  })),

  {
    ...page("app/layout.tsx", "Site geneli (varsayılan başlık ve açıklama)"),
    description:
      "Tüm sitenin varsayılan başlık şablonu, açıklaması, anahtar kelimeleri ve sosyal medya önizlemesi.",
  },
  page("app/page.tsx", "Ana sayfa"),
  page("app/hesaplamalar/page.tsx", "Hesaplama araçları listesi"),
  page("app/rehber/page.tsx", "Rehber listesi"),
  page("app/guncel-rakamlar/page.tsx", "Güncel rakamlar"),
  page("app/piyasalar/page.tsx", "Piyasalar"),
  page("app/altin-fiyatlari/page.tsx", "Altın fiyatları"),
  page("app/doviz-kurlari/page.tsx", "Döviz kurları"),
  page("app/borsa/page.tsx", "Borsa"),
  page("app/borc-takip/page.tsx", "Borç takip"),
  page("app/on-muhasebe/page.tsx", "Ön muhasebe"),
  page("app/premium/page.tsx", "Premium"),
  page("app/premium/borc-takip/page.tsx", "Premium borç takip"),
  page("app/premium/on-muhasebe/page.tsx", "Premium ön muhasebe"),
  page("app/program-talebi/page.tsx", "Program talebi"),
  page("app/hakkimizda/page.tsx", "Hakkımızda"),
  page("app/iletisim/page.tsx", "İletişim"),
  page("app/reklam/page.tsx", "Reklam"),
  page("app/gizlilik/page.tsx", "Gizlilik politikası"),
  page("app/kullanim-sartlari/page.tsx", "Kullanım şartları"),
  page("app/iade-kosullari/page.tsx", "İade koşulları"),
  page("app/mesafeli-satis-sozlesmesi/page.tsx", "Mesafeli satış sözleşmesi"),
  page("app/on-bilgilendirme/page.tsx", "Ön bilgilendirme formu"),
  page("app/pazarlama-iletisimi/page.tsx", "Pazarlama iletişimi"),

  {
    path: "data/premiumProducts.ts",
    title: "Premium ürünler",
    description: "Ürün adları, açıklamaları, fiyatları ve özellik listeleri.",
    group: GROUP_PREMIUM,
  },
  {
    path: "data/plans.ts",
    title: "Paketler",
    description: "Standart, Plus ve Pro paket içerikleri.",
    group: GROUP_PREMIUM,
  },
];

export const FILE_GROUPS = [GROUP_RATES, GROUP_TOOLS, GROUP_GUIDES, GROUP_PAGES, GROUP_PREMIUM];

export function findEditableFile(path: string): EditableFile | null {
  return EDITABLE_FILES.find((f) => f.path === path) ?? null;
}

/** Dosya ayarına göre gösterilecek alanları süzer. */
export function visibleFields(file: EditableFile, fields: Field[]): Field[] {
  return fields.filter((f) => {
    if (file.onlyUnder && f.path[0] !== file.onlyUnder) return false;
    if (file.hideKeys?.some((k) => f.path.includes(k))) return false;
    return true;
  });
}
