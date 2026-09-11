/**
 * Premium (indirilebilir) ürünlerin tek kaynağı.
 *
 * Yeni bir ürün eklemek için:
 *  1. Excel dosyasını private/products/ klasörüne koyun.
 *  2. Buraya bir kayıt ekleyin.
 * API uç noktası, vitrin sayfası ve sitemap otomatik güncellenir.
 */

export type PremiumProduct = {
  slug: string;
  /** private/products altındaki dosya adı */
  fileName: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  /** Dosyadaki sayfa/sekme adları */
  sheets: string[];
  features: string[];
  /** Ürünle ilişkili ücretsiz araç (varsa) */
  relatedTool?: { href: string; label: string };
  /** Kendi tanıtım sayfası varsa */
  landingPage?: string;
  price: number;
};

export const premiumProducts: PremiumProduct[] = [
  {
    slug: "isletme-yonetim-paneli",
    fileName: "MiniHesap_Isletme_Yonetim_Paneli.xlsx",
    icon: "🏢",
    title: "İşletme Yönetim Paneli",
    tagline: "Veritabanı mantığında çalışan tam işletme dosyası",
    description:
      "Cari, ürün, stok ve fatura hareketlerini tek dosyada veritabanı mantığıyla yönetir. Bilgiyi bir kez kart olarak tanımlarsınız; hareket girerken listeden seçersiniz, fiyat ve KDV otomatik gelir, stok ve cari bakiye kendiliğinden güncellenir.",
    sheets: [
      "Nasıl Kullanılır",
      "Ayarlar",
      "Cari Kartlar",
      "Ürün Kartlar",
      "Hareketler",
      "Stok Durumu",
      "Cari Ekstre",
      "Dashboard",
    ],
    features: [
      "200 cari + 200 ürün kartı, 1.000 hareket satırı",
      "Açılır listeden cari ve ürün seçimi (yazım hatası olmaz)",
      "Fiyat ve KDV ürün kartından otomatik gelir",
      "Alış/satışa göre otomatik stok giriş-çıkışı",
      "Kritik stok ve stok tükendi uyarıları",
      "Cari bazlı borç / alacak / bakiye ekstresi",
      "Satış, alış, brüt kâr, KDV ve alacak özeti içeren dashboard",
      "En çok satış yapılan cariler sıralaması",
    ],
    relatedTool: { href: "/on-muhasebe", label: "Ön Muhasebe Takip aracı" },
    price: 399,
  },

  {
    slug: "personel-bordro",
    fileName: "MiniHesap_Personel_Bordro_Ozluk_Takip.xlsx",
    icon: "👥",
    title: "Personel Bordro ve Özlük Takip",
    tagline: "Bordro, izin ve kıdem yükü tek dosyada",
    description:
      "Çalışanlarınızın özlük bilgilerini, aylık bordrolarını, yıllık izin haklarını ve biriken kıdem tazminatı yükünüzü takip eder. Oranlar tek sayfadan yönetilir; her yıl değiştiğinde sadece orada güncellersiniz.",
    sheets: [
      "Nasıl Kullanılır",
      "Parametreler",
      "Personel Kartları",
      "Aylık Bordro",
      "İzin Takibi",
      "Kıdem Yükü",
    ],
    features: [
      "100 personel kapasitesi",
      "Brütten nete kesinti dökümü (SGK, işsizlik, gelir ve damga vergisi)",
      "İstisna tutarları ve SGK tavanı desteği",
      "İşverene toplam maliyet hesabı",
      "Hizmet yılına göre otomatik yıllık izin hakkı",
      "Bugün itibarıyla toplam kıdem tazminatı yükü",
      "Tüm oranlar tek parametre sayfasından yönetilir",
    ],
    relatedTool: {
      href: "/hesaplamalar/net-maas",
      label: "Net Maaş hesaplama aracı",
    },
    price: 299,
  },

  {
    slug: "kira-portfoy",
    fileName: "MiniHesap_Kira_Gayrimenkul_Portfoy_Takibi.xlsx",
    icon: "🏠",
    title: "Kira ve Gayrimenkul Portföy Takibi",
    tagline: "Çoklu mülk, kiracı, tahsilat ve gerçek getiri",
    description:
      "Birden fazla kiralık mülkünüzü tek dosyada yönetir. Her mülkün brüt ve net getirisini, doluluk oranını, tahsil edilmemiş kiralarını ve yatırımın kaç yılda kendini amorti ettiğini hesaplar.",
    sheets: [
      "Nasıl Kullanılır",
      "Mülk Kartları",
      "Kiracı Kartları",
      "Kira Tahsilat",
      "Getiri Analizi",
      "Dashboard",
      "Listeler",
    ],
    features: [
      "50 mülk + 100 kiracı kapasitesi",
      "12 aylık kira tahsilat takvimi ve doluluk oranı",
      "Brüt ve net getiri oranı (aidat, emlak vergisi, sigorta, bakım dâhil)",
      "Yatırımın amortisman süresi (kaç yılda kendini öder)",
      "Mülk bazlı değer artışı takibi",
      "Portföy geneli özet panel",
    ],
    relatedTool: {
      href: "/hesaplamalar/kira-artisi",
      label: "Kira Artışı hesaplama aracı",
    },
    price: 249,
  },

  {
    slug: "eticaret-satici",
    fileName: "MiniHesap_ETicaret_Satici_Paneli.xlsx",
    icon: "🛒",
    title: "e-Ticaret Satıcı Paneli",
    tagline: "Komisyon, kargo, iade ve reklam sonrası gerçek kâr",
    description:
      "Pazaryerinde sattığınız her üründen komisyon, kargo, iade ve reklam maliyetleri düşüldükten sonra gerçekte ne kadar kâr ettiğinizi hesaplar. Zarar eden ürünleri kırmızıyla işaretler.",
    sheets: [
      "Nasıl Kullanılır",
      "Pazaryeri Kartları",
      "Ürün Kartları",
      "Satışlar",
      "Ürün Kârlılık",
      "Dashboard",
    ],
    features: [
      "150 ürün, 20 pazaryeri, 1.000 satış satırı",
      "Pazaryeri komisyonu ve sabit hizmet bedeli otomatik uygulanır",
      "İade maliyeti hesaba katılır",
      "Ürün bazlı net kâr ve kâr marjı",
      "Zarar eden ürünler otomatik kırmızı işaretlenir",
      "ACOS (reklam / ciro) ve iade oranı göstergeleri",
    ],
    price: 349,
  },

  {
    slug: "freelancer",
    fileName: "MiniHesap_Serbest_Meslek_Freelancer_Paketi.xlsx",
    icon: "🧑‍💻",
    title: "Serbest Meslek / Freelancer Paketi",
    tagline: "Makbuz, stopaj, gider ve geçici vergi takibi",
    description:
      "Serbest meslek erbabı için makbuz, gider ve vergi takibi yapar. Stopaj ve KDV otomatik hesaplanır; çeyrek dönemlerde ödeyeceğiniz geçici vergiyi önceden gösterir.",
    sheets: [
      "Nasıl Kullanılır",
      "Parametreler",
      "Müşteri Kartları",
      "Makbuzlar",
      "Giderler",
      "Geçici Vergi",
      "Listeler",
    ],
    features: [
      "400 makbuz + 400 gider satırı",
      "Kurumsal/bireysel ayrımına göre otomatik stopaj",
      "Stopaj ve KDV ayrıştırmalı makbuz hesabı",
      "14 hazır mesleki gider kategorisi",
      "Çeyrek dönem geçici vergi hesabı (stopaj mahsuplu)",
      "Tahsil edilmemiş alacak takibi",
    ],
    relatedTool: {
      href: "/hesaplamalar/kdv",
      label: "KDV hesaplama aracı",
    },
    price: 279,
  },

  {
    slug: "santiye-proje",
    fileName: "MiniHesap_Santiye_Proje_Maliyet_Takibi.xlsx",
    icon: "🏗️",
    title: "Şantiye / Proje Maliyet Takibi",
    tagline: "Bütçe, hakediş, taşeron ve sapma analizi",
    description:
      "Birden fazla şantiyenin bütçesini, gerçekleşen maliyetini, taşeron harcamalarını ve hakedişlerini takip eder. Hangi kalemde bütçeyi aştığınızı anında gösterir.",
    sheets: [
      "Nasıl Kullanılır",
      "Proje Kartları",
      "Bütçe Kalemleri",
      "Maliyet Kayıtları",
      "Hakedişler",
      "Bütçe Sapması",
      "Dashboard",
      "Listeler",
    ],
    features: [
      "30 proje, 300 bütçe kalemi, 1.000 maliyet kaydı",
      "Kalem bazlı bütçe / gerçekleşen sapma analizi",
      "Bütçe aşan kalemler otomatik kırmızı işaretlenir",
      "Hakediş stopaj ve teminat kesintisi hesabı",
      "Proje nakit durumu (tahsilat − maliyet)",
      "Maliyet/sözleşme ve ilerleme oranı göstergeleri",
    ],
    price: 449,
  },

  {
    slug: "restoran-maliyet",
    fileName: "MiniHesap_Restoran_Kafe_Maliyet_Paneli.xlsx",
    icon: "🍔",
    title: "Restoran / Kafe Maliyet Paneli",
    tagline: "Reçete bazlı maliyet, porsiyon kârı, food cost",
    description:
      "Menünüzdeki her ürünün reçete bazlı gerçek maliyetini hesaplar. Fire oranlarını da hesaba katar; hangi ürünün kazandırdığını, hangisinin zarar ettirdiğini net gösterir.",
    sheets: [
      "Nasıl Kullanılır",
      "Malzeme Kartları",
      "Reçeteler",
      "Menü Kartları",
      "Satışlar",
      "Dashboard",
      "Listeler",
    ],
    features: [
      "200 malzeme, 800 reçete satırı, 150 menü ürünü",
      "Fire oranına göre gerçek birim maliyet",
      "Reçeteden otomatik porsiyon maliyeti",
      "Food cost oranı ve Sağlıklı / Dikkat / Yüksek uyarısı",
      "Porsiyon kârı ve en kârlı ürün sıralaması",
      "Malzeme fiyatı değişince tüm reçeteler otomatik güncellenir",
    ],
    price: 379,
  },

  {
    slug: "borc-takip",
    fileName: "MiniHesap_Profesyonel_Borc_Takip.xlsx",
    icon: "🏦",
    title: "Profesyonel Borç Takip",
    tagline: "Tüm banka ve kart borçlarınız tek tabloda",
    description:
      "Banka kredileri, kredi kartları ve nakit avans borçlarınızı tek dosyada toplar; toplam borç, toplam limit ve kullanılabilir limitinizi otomatik hesaplar.",
    sheets: ["Borç Takip", "Banka Özeti", "Limit Kullanımı"],
    features: [
      "Banka bazlı limit ve borç takibi",
      "Kredi kartı ve nakit avans ayrımı",
      "Toplam borç ve kullanılabilir limit özeti",
      "Limit kullanım oranı göstergesi",
    ],
    relatedTool: { href: "/borc-takip", label: "Banka Borç Takip aracı" },
    landingPage: "/premium/borc-takip",
    price: 149,
  },

  {
    slug: "on-muhasebe",
    fileName: "MiniHesap_On_Muhasebe_Takip.xlsx",
    icon: "📊",
    title: "Profesyonel Ön Muhasebe",
    tagline: "Gelir, gider, KDV ve cari takibi",
    description:
      "Gelir ve giderlerinizi KDV ayrıştırmalı kaydeder; aylık ve yıllık kâr-zarar özetinizi, kategori dağılımınızı ve cari bakiyelerinizi çıkarır.",
    sheets: ["Kayıtlar", "Aylık Özet", "Yıllık Dashboard", "Cari Takip"],
    features: [
      "KDV dahil / hariç ayrıştırma",
      "Aylık gelir-gider ve kâr-zarar analizi",
      "Kategori bazlı gider raporu",
      "Cari ve ödeme yöntemi takibi",
    ],
    relatedTool: { href: "/on-muhasebe", label: "Ön Muhasebe Takip aracı" },
    landingPage: "/premium/on-muhasebe",
    price: 199,
  },

  {
    slug: "kidem-ihbar",
    fileName: "MiniHesap_Kidem_Ihbar_Tazminat_Dosyasi.xlsx",
    icon: "💼",
    title: "Kıdem & İhbar Tazminat Dosyası",
    tagline: "İşten ayrılışta toplam alacağınızı hesaplayın",
    description:
      "Kıdem tazminatı, ihbar tazminatı ve kullanılmayan yıllık izin ücretinizi tek dosyada hesaplar; vergi kesintileri düşülmüş net toplam alacağınızı gösterir.",
    sheets: ["Nasıl Kullanılır", "Tazminat Hesabı", "Yıllık İzin", "Özet"],
    features: [
      "Giydirilmiş brüt ücret üzerinden kıdem hesabı",
      "Kıdem tavanı kontrolü",
      "Çalışma süresine göre otomatik ihbar süresi",
      "Damga ve gelir vergisi kesintileri",
      "Kullanılmayan yıllık izin ücreti",
      "Tek sayfada toplam net alacak özeti",
    ],
    relatedTool: {
      href: "/hesaplamalar/kidem-ihbar",
      label: "Kıdem + İhbar hesaplama aracı",
    },
    price: 129,
  },

  {
    slug: "kredi-borc-kapatma",
    fileName: "MiniHesap_Kredi_Borc_Kapatma_Planlayici.xlsx",
    icon: "📉",
    title: "Kredi & Borç Kapatma Planlayıcı",
    tagline: "Krediyi erken kapatınca ne kadar kazanırsınız?",
    description:
      "120 aya kadar ödeme planı üretir. Aylık ek ödeme girdiğinizde kredinin kaç ay erken biteceğini ve ne kadar faizden kurtulacağınızı gösterir. Birden fazla borcunuz varsa hangisini önce kapatmanız gerektiğini sıralar.",
    sheets: ["Nasıl Kullanılır", "Kredi Planı", "Borç Listesi"],
    features: [
      "120 aya kadar ayrıntılı ödeme planı",
      "Ek ödeme ile erken kapatma senaryosu",
      "Toplam faiz tasarrufu hesabı",
      "Çoklu borç listesi",
      "Çığ ve kartopu yöntemiyle kapatma sırası",
      "Aylık toplam faiz yükü göstergesi",
    ],
    relatedTool: {
      href: "/hesaplamalar/kredi-borc",
      label: "Kredi hesaplama aracı",
    },
    price: 149,
  },

  {
    slug: "yillik-butce",
    fileName: "MiniHesap_Yillik_Butce_Nakit_Akis.xlsx",
    icon: "🗓️",
    title: "Yıllık Bütçe ve Nakit Akış",
    tagline: "12 aylık plan, gerçekleşen ve sapma analizi",
    description:
      "12 aylık gelir-gider planınızı kurar, ay ilerledikçe gerçekleşen tutarları işler ve plandan sapmanızı gösterir. Yıl sonu birikim oranınızı önceden görürsünüz.",
    sheets: [
      "Nasıl Kullanılır",
      "Yıllık Plan",
      "Gerçekleşen",
      "Karşılaştırma",
      "Özet",
    ],
    features: [
      "4 gelir ve 11 gider kalemi, 12 ay",
      "Plan ve gerçekleşen ayrı sayfalarda",
      "Aylık bazda sapma analizi",
      "Yıllık birikim oranı göstergesi",
      "Aylık bakiye takibi",
    ],
    price: 179,
  },
];

export function findPremiumProduct(slug: string) {
  return premiumProducts.find((product) => product.slug === slug);
}
