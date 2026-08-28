import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { calculators } from "@/data/calculators";

import NetSalaryCalculator from "@/components/calculators/NetSalaryCalculator";
import PercentCalculator from "@/components/calculators/PercentCalculator";
import KdvCalculator from "@/components/calculators/KdvCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import RentIncreaseCalculator from "@/components/calculators/RentIncreaseCalculator";
import OvertimeCalculator from "@/components/calculators/OvertimeCalculator";
import SeveranceCalculator from "@/components/calculators/SeveranceCalculator";
import NoticeCalculator from "@/components/calculators/NoticeCalculator";
import KidemIhbarCalculator from "@/components/calculators/KidemIhbarCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import AnnualLeaveCalculator from "@/components/calculators/AnnualLeaveCalculator";

/* =========================================================
   HESAPLAMA BİLEŞENLERİ
========================================================= */

const componentMap: Record<string, ComponentType> = {
  "net-maas": NetSalaryCalculator,
  yuzde: PercentCalculator,
  kdv: KdvCalculator,
  indirim: DiscountCalculator,
  "kira-artisi": RentIncreaseCalculator,
  "fazla-mesai": OvertimeCalculator,
  kidem: SeveranceCalculator,
  ihbar: NoticeCalculator,
  "kidem-ihbar": KidemIhbarCalculator,
  yas: AgeCalculator,
  "yillik-izin": AnnualLeaveCalculator,
};

/* =========================================================
   SEO TİPLERİ
========================================================= */

type FaqItem = {
  question: string;
  answer: string;
};

type SeoContent = {
  title: string;
  description: string;
  intro: string;
  howItWorks: string[];
  faqs: FaqItem[];
};

/* =========================================================
   SEO İÇERİKLERİ
========================================================= */

const seoContents: Record<string, SeoContent> = {
  /* =======================================================
     NET MAAŞ
  ======================================================= */

  "net-maas": {
    title:
      "Net Maaş Hesaplama 2026 | Brüt Maaştan Net Maaş",
    description:
      "2026 net maaş hesaplama aracı ile brüt maaşınızı girerek tahmini net maaşınızı ve kesinti detaylarını hesaplayın.",
    intro:
      "Net maaş hesaplama aracımız, brüt ücretiniz üzerinden temel kesinti kalemlerini dikkate alarak tahmini net maaşınızı görmenizi sağlar.",
    howItWorks: [
      "Brüt maaşınızı girin.",
      "Hesaplama ayını seçin.",
      "Varsa önceki kümülatif vergi matrahınızı girin.",
      "Hesapla butonuna basarak sonucu görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Brüt maaş ile net maaş arasındaki fark nedir?",
        answer:
          "Brüt maaş kesintiler uygulanmadan önceki ücret tutarıdır. Net maaş ise ilgili kesintiler ve istisnalar sonrasında çalışanın eline geçen tutardır.",
      },
      {
        question:
          "Kümülatif vergi matrahı neden önemlidir?",
        answer:
          "Yıl içinde biriken kümülatif vergi matrahı, gelir vergisinin hangi dilimlerden hesaplanacağını etkileyebilir.",
      },
      {
        question:
          "Net maaş her ay aynı olur mu?",
        answer:
          "Vergi dilimi, prim, ikramiye ve diğer ücret unsurları nedeniyle aylık net maaş değişebilir.",
      },
    ],
  },

  /* =======================================================
     YÜZDE
  ======================================================= */

  yuzde: {
    title:
      "Yüzde Hesaplama | Yüzde Artış ve Azalış Hesapla",
    description:
      "Yüzde hesaplama aracı ile bir sayının yüzdesini, yüzde artışını ve yüzde azalışını hızlıca hesaplayın.",
    intro:
      "Yüzde hesaplama aracıyla günlük hayatta sık kullanılan yüzde işlemlerini hızlı ve anlaşılır şekilde yapabilirsiniz.",
    howItWorks: [
      "Ana tutarı girin.",
      "Yüzde oranını girin.",
      "Yüzde tutarını görüntüleyin.",
      "Artış veya azalış sonucunu inceleyin.",
    ],
    faqs: [
      {
        question:
          "Bir sayının yüzdesi nasıl hesaplanır?",
        answer:
          "Ana tutar yüzde oranıyla çarpılır ve 100'e bölünür.",
      },
      {
        question:
          "Yüzde artış nasıl hesaplanır?",
        answer:
          "Ana tutarın ilgili yüzde oranındaki artış miktarı bulunur ve ana tutara eklenir.",
      },
      {
        question:
          "Yüzde azalış nasıl hesaplanır?",
        answer:
          "Ana tutarın ilgili yüzde oranındaki azalış miktarı bulunur ve ana tutardan çıkarılır.",
      },
    ],
  },

  /* =======================================================
     KDV
  ======================================================= */

  kdv: {
    title:
      "KDV Hesaplama 2026 | KDV Dahil ve Hariç Hesapla",
    description:
      "KDV hesaplama aracı ile KDV dahil ve KDV hariç tutarı, KDV miktarını ve genel toplamı hesaplayın.",
    intro:
      "KDV hesaplama aracımız ile bir tutarın KDV dahil veya KDV hariç karşılığını kolayca hesaplayabilirsiniz.",
    howItWorks: [
      "Tutarı girin.",
      "KDV oranını seçin.",
      "Tutarın KDV dahil veya hariç olduğunu seçin.",
      "KDV ve genel toplamı görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "KDV dahil tutardan KDV hariç tutar nasıl bulunur?",
        answer:
          "KDV dahil toplam, seçilen KDV oranı kullanılarak ters hesaplama ile KDV hariç tutara ve KDV miktarına ayrılır.",
      },
      {
        question:
          "1000 TL'nin %20 KDV'si kaç TL'dir?",
        answer:
          "1000 TL'nin %20 KDV'si 200 TL'dir. KDV dahil toplam 1200 TL olur.",
      },
      {
        question:
          "KDV oranı neden ürüne göre değişebilir?",
        answer:
          "Uygulanan KDV oranı ürün veya hizmetin tabi olduğu mevzuata göre değişebilir.",
      },
    ],
  },

  /* =======================================================
     İNDİRİM
  ======================================================= */

  indirim: {
    title:
      "İndirim Hesaplama | İndirimli Fiyat Hesapla",
    description:
      "İndirim hesaplama aracı ile indirim oranını, indirim tutarını ve indirim sonrası fiyatı hesaplayın.",
    intro:
      "Normal fiyatı ve indirim oranını girerek indirim miktarını ve ödenecek son fiyatı kolayca bulabilirsiniz.",
    howItWorks: [
      "Normal fiyatı girin.",
      "İndirim oranını yüzde olarak yazın.",
      "İndirim tutarını görüntüleyin.",
      "İndirimli fiyatı görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "%20 indirim nasıl hesaplanır?",
        answer:
          "Normal fiyatın %20'si indirim miktarıdır ve normal fiyattan çıkarıldığında indirimli fiyat bulunur.",
      },
      {
        question:
          "İndirim tutarı nedir?",
        answer:
          "Normal fiyat üzerinden uygulanan indirim oranının parasal karşılığıdır.",
      },
      {
        question:
          "İndirimli fiyat nasıl bulunur?",
        answer:
          "Normal fiyattan hesaplanan indirim miktarı çıkarılır.",
      },
    ],
  },

  /* =======================================================
     KİRA
  ======================================================= */

  "kira-artisi": {
    title:
      "Kira Artış Hesaplama 2026 | Yeni Kira Hesapla",
    description:
      "Kira artış hesaplama aracı ile mevcut kira ve girdiğiniz artış oranına göre yeni kira tutarını hesaplayın.",
    intro:
      "Mevcut kira tutarı ve artış oranını girerek yeni aylık kira tutarını ve yıllık farkı hesaplayabilirsiniz.",
    howItWorks: [
      "Mevcut kira tutarını girin.",
      "Artış oranını yüzde olarak yazın.",
      "Yeni kira tutarını görüntüleyin.",
      "Yıllık farkı inceleyin.",
    ],
    faqs: [
      {
        question:
          "Kira artışı nasıl hesaplanır?",
        answer:
          "Mevcut kira tutarına seçilen artış oranına göre hesaplanan artış miktarı eklenir.",
      },
      {
        question:
          "Kira artış oranı her zaman aynı mıdır?",
        answer:
          "Hayır. Uygulanabilecek oran dönemsel yasal düzenlemelere ve sözleşme koşullarına göre değişebilir.",
      },
      {
        question:
          "Yıllık kira farkı nasıl hesaplanır?",
        answer:
          "Aylık artış tutarı 12 ay üzerinden hesaplanır.",
      },
    ],
  },

  /* =======================================================
     FAZLA MESAİ
  ======================================================= */

  "fazla-mesai": {
    title:
      "Fazla Mesai Hesaplama | Fazla Mesai Ücreti",
    description:
      "Fazla mesai hesaplama aracı ile aylık brüt ücret, mesai saati ve katsayı üzerinden tahmini fazla mesai ücretini hesaplayın.",
    intro:
      "Aylık brüt ücretinizi, fazla mesai saatinizi ve katsayıyı girerek temel fazla mesai tutarını hesaplayabilirsiniz.",
    howItWorks: [
      "Aylık brüt maaşı girin.",
      "Fazla mesai saatini girin.",
      "Mesai katsayısını seçin.",
      "Tahmini fazla mesai tutarını görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Fazla mesai ücreti nasıl hesaplanır?",
        answer:
          "Temel hesaplamada saatlik ücret bulunur, ilgili katsayı uygulanır ve fazla mesai saatiyle çarpılır.",
      },
      {
        question:
          "1,5 kat fazla mesai ne demektir?",
        answer:
          "Temel saatlik ücretin 1,5 katı üzerinden hesaplama yapılması anlamına gelir.",
      },
      {
        question:
          "Fazla mesai sonucu net midir?",
        answer:
          "Bu araç temel brüt tutarı hesaplar. Vergi ve diğer bordro kesintileri ayrıca değerlendirilmelidir.",
      },
    ],
  },

  /* =======================================================
     KIDEM
  ======================================================= */

  kidem: {
    title:
      "Kıdem Tazminatı Hesaplama 2026",
    description:
      "Kıdem tazminatı hesaplama aracı ile işe giriş ve çıkış tarihleri, brüt ücret ve düzenli yan haklara göre tahmini kıdem tazminatınızı hesaplayın.",
    intro:
      "Kıdem hesabında çalışma süresi, kıdeme esas ücret, düzenli yan haklar ve ilgili dönemdeki kıdem tazminatı tavanı önemlidir.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "Çalışma süresini yıl, ay ve gün olarak görüntüleyin.",
      "Kıdem tazminatı detaylarını inceleyin.",
    ],
    faqs: [
      {
        question:
          "Kıdem tazminatı nasıl hesaplanır?",
        answer:
          "Temel hesaplamada kıdeme esas ücret ve hizmet süresi dikkate alınır. Her tam yıl için 30 günlük ücret esas alınır ve artan süre orantılı hesaplanır.",
      },
      {
        question:
          "Kıdem tazminatı tavanı nedir?",
        answer:
          "Kıdem tazminatına esas alınabilecek ücretin ilgili dönem için belirlenen yasal üst sınırıdır.",
      },
      {
        question:
          "Yol ve yemek yardımı kıdem hesabına dahil edilir mi?",
        answer:
          "Düzenli olarak sağlanan ve para veya para ile ölçülebilen bazı menfaatler koşullarına göre hesaba dahil edilebilir.",
      },
    ],
  },

  /* =======================================================
     İHBAR
  ======================================================= */

  ihbar: {
    title:
      "İhbar Tazminatı Hesaplama 2026",
    description:
      "İhbar tazminatı hesaplama aracı ile çalışma süresine göre ihbar süresini ve tahmini ihbar tazminatını hesaplayın.",
    intro:
      "Hizmet sürenizi ve ücret bilgilerinizi girerek temel ihbar sürenizi ve tahmini ihbar tazminatınızı hesaplayabilirsiniz.",
    howItWorks: [
      "Brüt ücretinizi girin.",
      "İşe giriş ve çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "İhbar süresini otomatik olarak görüntüleyin.",
      "Tahmini tazminat tutarını inceleyin.",
    ],
    faqs: [
      {
        question:
          "İhbar süresi nasıl belirlenir?",
        answer:
          "Belirsiz süreli iş sözleşmelerinde hizmet süresine göre kanuni bildirim süreleri uygulanır.",
      },
      {
        question:
          "En uzun kanuni ihbar süresi kaç haftadır?",
        answer:
          "Üç yıldan fazla hizmet süresinde kanuni bildirim süresi 8 haftadır.",
      },
      {
        question:
          "İhbar tazminatı vergilendirilir mi?",
        answer:
          "İhbar tazminatı ücret niteliğinde değerlendirilebildiğinden ilgili vergi ve kesintiler ödeme koşullarına göre değişebilir.",
      },
    ],
  },

  /* =======================================================
     KIDEM + İHBAR
  ======================================================= */

  "kidem-ihbar": {
    title:
      "Kıdem ve İhbar Tazminatı Hesaplama 2026",
    description:
      "Kıdem ve ihbar tazminatınızı tek ekranda hesaplayın. Çalışma süresi, kıdeme esas ücret, ihbar süresi ve toplam tahmini tazminatı görün.",
    intro:
      "Kıdem + İhbar hesaplama aracımız, iki tazminatı aynı ekranda ayrı ayrı değerlendirmenize yardımcı olur.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve çıkış tarihlerini seçin.",
      "Varsa düzenli yan hakları girin.",
      "Gerekliyse kümülatif vergi matrahını girin.",
      "Kıdem, ihbar ve toplam sonuçları görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Kıdem ve ihbar tazminatı aynı şey midir?",
        answer:
          "Hayır. Kıdem ve ihbar tazminatlarının şartları ve hesaplama yöntemleri farklıdır.",
      },
      {
        question:
          "Kıdem ve ihbar aynı anda alınabilir mi?",
        answer:
          "Somut fesih şekline ve hukuki şartlara göre her iki tazminata da hak kazanılması mümkün olabilir.",
      },
      {
        question:
          "Toplam tazminat nasıl hesaplanır?",
        answer:
          "Kıdem ve ihbar tutarları ayrı hesaplanır ve ilgili kesintiler dikkate alınarak toplam sonuç gösterilebilir.",
      },
    ],
  },

  /* =======================================================
     YAŞ
  ======================================================= */

  yas: {
    title:
      "Yaş Hesaplama 2026 | Doğum Tarihine Göre Yaşını Hesapla",
    description:
      "Yaş hesaplama aracı ile doğum tarihinizi girerek yaşınızı yıl, ay ve gün olarak hesaplayın. Bir sonraki doğum gününüze kalan süreyi görün.",
    intro:
      "Yaş hesaplama aracımız, doğum tarihi ile seçilen hesaplama tarihi arasındaki süreyi yıl, ay ve gün olarak gösterir.",
    howItWorks: [
      "Doğum tarihinizi girin.",
      "Hesaplama tarihini seçin.",
      "Yaşınızı yıl, ay ve gün olarak görüntüleyin.",
      "Bir sonraki doğum gününüze kalan süreyi inceleyin.",
    ],
    faqs: [
      {
        question:
          "Yaş nasıl hesaplanır?",
        answer:
          "Yaş, doğum tarihi ile hesaplama tarihi arasındaki takvim farkına göre yıl, ay ve gün şeklinde hesaplanır.",
      },
      {
        question:
          "Yaşımı toplam gün olarak görebilir miyim?",
        answer:
          "Evet. Araç doğum tarihinden hesaplama tarihine kadar geçen toplam gün sayısını da gösterir.",
      },
      {
        question:
          "Bir sonraki doğum günümü hesaplayabilir miyim?",
        answer:
          "Evet. Sonuç bölümünde bir sonraki doğum gününüz ve kalan gün sayısı gösterilir.",
      },
    ],
  },

  /* =======================================================
     YILLIK İZİN
  ======================================================= */

  "yillik-izin": {
    title:
      "Yıllık İzin Hesaplama 2026 | Yıllık Ücretli İzin Hesapla",
    description:
      "Yıllık izin hesaplama aracı ile işe giriş tarihinize, hizmet sürenize ve yaşınıza göre yıllık ücretli izin hakkınızı hesaplayın.",
    intro:
      "Yıllık izin hesaplama aracımız, işe giriş tarihi ve hesaplama tarihine göre çalışma sürenizi belirleyerek temel yıllık ücretli izin hakkınızı hesaplamanıza yardımcı olur.",
    howItWorks: [
      "İşe giriş tarihinizi girin.",
      "Hesaplama tarihini seçin.",
      "Doğum tarihinizi girin.",
      "Kullanmış olduğunuz izin gününü girin.",
      "Toplam yıllık izin hakkınızı ve kalan izin gününüzü görüntüleyin.",
    ],
    faqs: [
      {
        question:
          "Yıllık izne ne zaman hak kazanılır?",
        answer:
          "Aynı işverene bağlı çalışma süresinin en az bir yılı doldurulmasıyla yıllık ücretli izin hakkı doğar.",
      },
      {
        question:
          "Yıllık izin süresi kaç gündür?",
        answer:
          "Temel yasal süreler hizmet süresine göre değişir. 1 ila 5 yıl arasında 14 gün, 5 yıldan fazla 15 yıldan az hizmette 20 gün, 15 yıl ve üzeri hizmette 26 gün asgari süredir.",
      },
      {
        question:
          "50 yaş ve üzerindeki çalışanların yıllık izni kaç gündür?",
        answer:
          "50 yaş ve üzerindeki çalışanlar için yıllık ücretli izin süresi 20 günden az olamaz.",
      },
      {
        question:
          "18 yaş ve altındaki çalışanların yıllık izni kaç gündür?",
        answer:
          "18 yaş ve daha küçük yaştaki çalışanlarda yıllık ücretli izin süresi 20 günden az olamaz.",
      },
    ],
  },
};

/* =========================================================
   JSON-LD
========================================================= */

function JsonLd({
  calculator,
  seo,
  slug,
}: {
  calculator: (typeof calculators)[number];
  seo: SeoContent;
  slug: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const pageUrl =
    `${baseUrl}/hesaplamalar/${slug}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: "tr-TR",

    isPartOf: {
      "@type": "WebSite",
      name: "MiniHesap",
      url: baseUrl,
    },

    about: {
      "@type": "Thing",
      name: calculator.title,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: seo.faqs.map(
      (faq) => ({
        "@type": "Question",

        name: faq.question,

        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              webPageSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              faqSchema
            ),
        }}
      />
    </>
  );
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return calculators.map(
    (calculator) => ({
      slug: calculator.slug,
    })
  );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const calculator =
    calculators.find(
      (item) =>
        item.slug === slug
    );

  const seo =
    seoContents[slug];

  if (
    !calculator ||
    !seo
  ) {
    return {
      title:
        "MiniHesap | Hesaplama Araçları",

      description:
        "MiniHesap hesaplama araçları.",
    };
  }

  return {
    title: seo.title,

    description:
      seo.description,

    alternates: {
      canonical:
        `/hesaplamalar/${slug}`,
    },

    openGraph: {
      title: seo.title,

      description:
        seo.description,

      type: "website",

      locale:
        "tr_TR",

      siteName:
        "MiniHesap",

      url:
        `/hesaplamalar/${slug}`,
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        seo.title,

      description:
        seo.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* =========================================================
   SAYFA
========================================================= */

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const calculator =
    calculators.find(
      (item) =>
        item.slug === slug
    );

  const Calculator =
    componentMap[slug];

  const seo =
    seoContents[slug];

  if (
    !calculator ||
    !Calculator ||
    !seo
  ) {
    notFound();
  }

  return (
    <main className="page">

      {/* ===================================================
          JSON-LD
      =================================================== */}

      <JsonLd
        calculator={
          calculator
        }
        seo={seo}
        slug={slug}
      />

      {/* ===================================================
          HESAPLAMA ALANI
      =================================================== */}

      <div className="container">

        <a
          className="eyebrow"
          href="/hesaplamalar"
        >
          ← Tüm Hesaplamalara Dön
        </a>

        <h1>
          {calculator.icon}{" "}
          {calculator.title}
        </h1>

        <p className="page-lead">
          {
            calculator.description
          }
        </p>

        <Calculator />

      </div>

      {/* ===================================================
          SEO İÇERİĞİ
      =================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 45,
        }}
      >
        <div className="container">

          <div
            style={{
              maxWidth: 850,
              margin: "0 auto",
            }}
          >

            {/* =================================================
                GİRİŞ
            ================================================= */}

            <article
              style={{
                padding: 25,
                borderRadius: 22,
                background:
                  "white",
                border:
                  "1px solid #dce7df",
              }}
            >

              <div className="eyebrow">
                {
                  calculator.title.toUpperCase()
                }
              </div>

              <h2
                style={{
                  margin:
                    "8px 0 15px",
                  fontSize: 30,
                }}
              >
                {seo.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "#617066",
                  lineHeight: 1.8,
                }}
              >
                {seo.intro}
              </p>

            </article>

            {/* =================================================
                NASIL HESAPLANIR
            ================================================= */}

            <article
              style={{
                marginTop: 20,
                padding: 25,
                borderRadius: 22,
                background:
                  "white",
                border:
                  "1px solid #dce7df",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  fontSize: 26,
                }}
              >
                Nasıl Hesaplanır?
              </h2>

              <div
                style={{
                  display:
                    "grid",
                  gap: 12,
                }}
              >

                {seo.howItWorks.map(
                  (
                    step,
                    index
                  ) => (
                    <div
                      key={step}
                      style={{
                        display:
                          "flex",
                        gap: 14,
                        alignItems:
                          "flex-start",
                        padding:
                          14,
                        borderRadius:
                          15,
                        background:
                          "#f8faf9",
                        border:
                          "1px solid #e5eee8",
                      }}
                    >

                      <div
                        style={{
                          minWidth:
                            32,
                          width:
                            32,
                          height:
                            32,
                          borderRadius:
                            "50%",
                          display:
                            "grid",
                          placeItems:
                            "center",
                          background:
                            "#dcfce7",
                          color:
                            "#15803d",
                          fontWeight:
                            900,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        style={{
                          paddingTop:
                            5,
                          color:
                            "#405248",
                          lineHeight:
                            1.6,
                        }}
                      >
                        {step}
                      </div>

                    </div>
                  )
                )}

              </div>

            </article>

            {/* =================================================
                SSS
            ================================================= */}

            <article
              style={{
                marginTop: 20,
              }}
            >

              <div
                className="eyebrow"
                style={{
                  marginBottom: 7,
                }}
              >
                SIK SORULAN SORULAR
              </div>

              <h2
                style={{
                  margin:
                    "0 0 18px",
                  fontSize: 30,
                }}
              >
                Sık Sorulan Sorular
              </h2>

              <div
                style={{
                  display:
                    "grid",
                  gap: 12,
                }}
              >

                {seo.faqs.map(
                  (faq) => (
                    <details
                      key={
                        faq.question
                      }
                      style={{
                        background:
                          "white",
                        border:
                          "1px solid #dce7df",
                        borderRadius:
                          18,
                        padding:
                          "17px 20px",
                      }}
                    >

                      <summary
                        style={{
                          cursor:
                            "pointer",
                          fontWeight:
                            800,
                          lineHeight:
                            1.5,
                        }}
                      >
                        {
                          faq.question
                        }
                      </summary>

                      <p
                        style={{
                          color:
                            "#617066",
                          lineHeight:
                            1.7,
                          margin:
                            "12px 0 0",
                        }}
                      >
                        {
                          faq.answer
                        }
                      </p>

                    </details>
                  )
                )}

              </div>

            </article>

          </div>

        </div>
      </section>

    </main>
  );
}