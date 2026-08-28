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
};

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

const seoContents: Record<string, SeoContent> = {
  "net-maas": {
    title: "Net Maaş Hesaplama 2026 | Brüt Maaştan Net Maaş",
    description:
      "2026 net maaş hesaplama aracı ile brüt maaşınızı girerek tahmini net maaşınızı ve kesinti detaylarını hesaplayın.",
    intro:
      "Net maaş hesaplama aracımız, brüt ücretiniz üzerinden SGK, işsizlik sigortası, gelir vergisi ve diğer temel kesinti kalemlerini dikkate alarak tahmini net maaşı görmenizi sağlar.",
    howItWorks: [
      "Brüt maaşınızı girin.",
      "Hesaplamak istediğiniz ayı seçin.",
      "Varsa önceki kümülatif vergi matrahınızı girin.",
      "Hesapla düğmesine basarak sonuç ve kesinti detaylarını görüntüleyin.",
    ],
    faqs: [
      {
        question: "Brüt maaş ile net maaş arasındaki fark nedir?",
        answer:
          "Brüt maaş, kesintiler uygulanmadan önceki ücret tutarıdır. Net maaş ise ilgili kesintiler ve istisnalar sonrasında çalışanın eline geçen tutardır.",
      },
      {
        question: "Kümülatif vergi matrahı neden önemlidir?",
        answer:
          "Ücret gelirlerinde yıl içinde biriken kümülatif vergi matrahı, gelir vergisinin hangi dilimlerden hesaplanacağını etkileyebilir.",
      },
      {
        question: "Net maaş her ay aynı olur mu?",
        answer:
          "Her zaman aynı olmayabilir. Vergi dilimi değişiklikleri, prim, ikramiye ve diğer ücret unsurları aylık net maaşı etkileyebilir.",
      },
    ],
  },

  yuzde: {
    title: "Yüzde Hesaplama | Yüzde Artış ve Azalış Hesapla",
    description:
      "Yüzde hesaplama aracı ile bir sayının yüzdesini, yüzde artışını ve yüzde azalışını hızlıca hesaplayın.",
    intro:
      "Yüzde hesaplama aracı ile günlük hayatta sık kullanılan yüzde işlemlerini hızlı ve anlaşılır şekilde yapabilirsiniz.",
    howItWorks: [
      "Ana tutarı girin.",
      "Yüzde oranını yazın.",
      "Yüzde tutarını ve artış veya azalış sonucunu görüntüleyin.",
    ],
    faqs: [
      {
        question: "Bir sayının yüzdesi nasıl hesaplanır?",
        answer:
          "Ana tutar, yüzde oranıyla çarpılır ve 100'e bölünür.",
      },
      {
        question: "Yüzde artış nasıl hesaplanır?",
        answer:
          "Ana tutara, ana tutarın ilgili yüzde oranındaki artış miktarı eklenir.",
      },
      {
        question: "Yüzde azalış nasıl hesaplanır?",
        answer:
          "Ana tutardan, ana tutarın ilgili yüzde oranındaki azalış miktarı çıkarılır.",
      },
    ],
  },

  kdv: {
    title: "KDV Hesaplama 2026 | KDV Dahil ve Hariç Hesapla",
    description:
      "KDV hesaplama aracı ile KDV dahil ve KDV hariç tutarı, KDV miktarını ve genel toplamı hesaplayın.",
    intro:
      "KDV hesaplama aracımız sayesinde bir tutarın KDV dahil veya hariç karşılığını ve KDV miktarını hızlıca bulabilirsiniz.",
    howItWorks: [
      "Tutarı girin.",
      "KDV oranını seçin.",
      "Tutarın KDV dahil veya hariç olduğunu belirtin.",
      "KDV ve toplam tutarı görüntüleyin.",
    ],
    faqs: [
      {
        question: "KDV dahil tutardan KDV hariç tutar nasıl bulunur?",
        answer:
          "KDV dahil toplam, seçilen KDV oranı kullanılarak ters hesaplamayla KDV hariç tutar ve KDV olarak ayrıştırılır.",
      },
      {
        question: "KDV hariç 1.000 TL'nin %20 KDV'si nedir?",
        answer:
          "1.000 TL üzerinden %20 KDV 200 TL'dir. KDV dahil toplam 1.200 TL olur.",
      },
      {
        question: "Hangi KDV oranını kullanmalıyım?",
        answer:
          "Uygulanacak oran ürün veya hizmete göre değişebilir. Hesaplama sırasında ilgili oranı seçmelisiniz.",
      },
    ],
  },

  indirim: {
    title: "İndirim Hesaplama | İndirimli Fiyat Hesapla",
    description:
      "İndirim hesaplama aracı ile indirim oranını, indirim tutarını ve indirim sonrası ödenecek fiyatı hesaplayın.",
    intro:
      "Bir ürünün indirimli fiyatını öğrenmek için normal fiyatı ve indirim oranını girmeniz yeterlidir.",
    howItWorks: [
      "Normal fiyatı girin.",
      "İndirim oranını yüzde olarak yazın.",
      "İndirim tutarını ve ödenecek son fiyatı görüntüleyin.",
    ],
    faqs: [
      {
        question: "%20 indirim nasıl hesaplanır?",
        answer:
          "Ürün fiyatının %20'si indirim miktarıdır. Bu tutar normal fiyattan çıkarıldığında indirimli fiyat bulunur.",
      },
      {
        question: "İndirim tutarı nedir?",
        answer:
          "Normal fiyat üzerinden uygulanan yüzde oranının parasal karşılığıdır.",
      },
      {
        question: "İndirimli fiyat nasıl bulunur?",
        answer:
          "Normal fiyattan hesaplanan indirim tutarı çıkarılır.",
      },
    ],
  },

  "kira-artisi": {
    title: "Kira Artış Hesaplama 2026 | Yeni Kira Hesapla",
    description:
      "Kira artış hesaplama aracı ile mevcut kira ve girdiğiniz artış oranına göre yeni kira tutarını hesaplayın.",
    intro:
      "Mevcut kira tutarınızı ve uygulamak istediğiniz artış oranını girerek yeni aylık kira bedelini ve yıllık farkı hesaplayabilirsiniz.",
    howItWorks: [
      "Mevcut kira tutarını girin.",
      "Artış oranını yüzde olarak yazın.",
      "Yeni aylık kira tutarını görüntüleyin.",
      "Yıllık farkı inceleyin.",
    ],
    faqs: [
      {
        question: "Kira artışı nasıl hesaplanır?",
        answer:
          "Mevcut kira tutarı, seçilen artış oranına göre hesaplanan artış miktarı kadar yükseltilir.",
      },
      {
        question: "Kira artış oranı her zaman aynı mıdır?",
        answer:
          "Hayır. Uygulanabilecek yasal oran ve sözleşme koşulları döneme ve duruma göre değişebilir.",
      },
      {
        question: "Yıllık kira farkı nasıl hesaplanır?",
        answer:
          "Aylık artış tutarı 12 ay üzerinden hesaplanarak yıllık fark bulunur.",
      },
    ],
  },

  "fazla-mesai": {
    title: "Fazla Mesai Hesaplama | Fazla Mesai Ücreti",
    description:
      "Fazla mesai hesaplama aracı ile aylık brüt ücret, mesai saati ve katsayı üzerinden tahmini fazla mesai ücretini hesaplayın.",
    intro:
      "Fazla mesai hesaplama aracı, girdiğiniz ücret ve saat bilgileri üzerinden temel fazla mesai tutarını hesaplar.",
    howItWorks: [
      "Aylık brüt maaşınızı girin.",
      "Fazla mesai saatinizi girin.",
      "Mesai katsayısını seçin.",
      "Tahmini fazla mesai tutarını görüntüleyin.",
    ],
    faqs: [
      {
        question: "Fazla mesai ücreti nasıl hesaplanır?",
        answer:
          "Temel hesaplama mantığında saatlik ücret bulunur, ilgili katsayı uygulanır ve fazla mesai saatiyle çarpılır.",
      },
      {
        question: "1,5 kat fazla mesai ne demektir?",
        answer:
          "Saatlik temel ücretin 1,5 katı üzerinden hesaplanan fazla çalışma ücretini ifade eder.",
      },
      {
        question: "Fazla mesai sonucu net midir?",
        answer:
          "Bu araç temel brüt tutarı hesaplar. Vergi ve diğer bordro kesintileri ayrıca değerlendirilebilir.",
      },
    ],
  },

  kidem: {
    title: "Kıdem Tazminatı Hesaplama 2026",
    description:
      "Kıdem tazminatı hesaplama aracı ile işe giriş ve çıkış tarihleri, brüt ücret ve düzenli yan haklara göre tahmini kıdem tazminatınızı hesaplayın.",
    intro:
      "Kıdem tazminatı hesabında çalışma süresi, kıdeme esas ücret, düzenli yan haklar ve ilgili dönemdeki kıdem tazminatı tavanı önem taşır.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve işten çıkış tarihlerini seçin.",
      "Varsa düzenli yemek, yol ve diğer yan hakları girin.",
      "Çalışma süresini yıl, ay ve gün olarak görüntüleyin.",
      "Kıdeme esas ücret, brüt kıdem, damga vergisi ve net kıdem tutarını inceleyin.",
    ],
    faqs: [
      {
        question: "Kıdem tazminatı nasıl hesaplanır?",
        answer:
          "Temel hesaplamada kıdeme esas ücret ve çalışma süresi dikkate alınır. Her tam hizmet yılı için 30 günlük ücret esas alınır ve artan süre orantılı olarak hesaplanır.",
      },
      {
        question: "Kıdem tazminatı tavanı nedir?",
        answer:
          "Kıdem tazminatına esas alınabilecek ücretin ilgili dönemde ulaşabileceği yasal üst sınırdır.",
      },
      {
        question: "Yol ve yemek yardımı kıdem hesabına dahil edilir mi?",
        answer:
          "Düzenli ve para veya para ile ölçülebilen bazı menfaatler koşullarına göre hesaba dahil edilebilir.",
      },
    ],
  },

  ihbar: {
    title: "İhbar Tazminatı Hesaplama 2026",
    description:
      "İhbar tazminatı hesaplama aracı ile çalışma süresine göre ihbar süresini ve tahmini ihbar tazminatını hesaplayın.",
    intro:
      "İhbar tazminatı hesabında hizmet süresi, bildirim süresi, ücret ve bazı düzenli ücret niteliğindeki ödemeler önem taşır.",
    howItWorks: [
      "Brüt ücretinizi girin.",
      "İşe giriş ve işten çıkış tarihlerini seçin.",
      "Varsa düzenli yan hakları girin.",
      "Hizmet süresine göre ihbar süresini görüntüleyin.",
      "Brüt ve tahmini net ihbar tazminatı sonuçlarını inceleyin.",
    ],
    faqs: [
      {
        question: "İhbar süresi nasıl belirlenir?",
        answer:
          "Belirsiz süreli iş sözleşmelerinde hizmet süresine göre kanuni bildirim süreleri uygulanır.",
      },
      {
        question: "En uzun kanuni ihbar süresi kaç haftadır?",
        answer:
          "Üç yıldan fazla hizmet süresinde kanuni bildirim süresi 8 haftadır.",
      },
      {
        question: "İhbar tazminatı vergilendirilir mi?",
        answer:
          "İhbar tazminatı ücret niteliğinde değerlendirilebildiğinden vergi hesaplaması ilgili ödeme ve ücret matrahına göre değişebilir.",
      },
    ],
  },

  "kidem-ihbar": {
    title: "Kıdem ve İhbar Tazminatı Hesaplama 2026",
    description:
      "Kıdem ve ihbar tazminatınızı tek ekranda hesaplayın. Çalışma süresi, kıdeme esas ücret, ihbar süresi ve toplam tahmini tazminatı görün.",
    intro:
      "Kıdem + İhbar Hesaplama aracımız iki hesaplamayı tek ekranda değerlendirmenize yardımcı olur.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve işten çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "Gerekliyse önceki kümülatif vergi matrahını girin.",
      "Kıdem, ihbar ve toplam sonuçları ayrı ayrı inceleyin.",
    ],
    faqs: [
      {
        question: "Kıdem ve ihbar tazminatı aynı şey midir?",
        answer:
          "Hayır. Kıdem tazminatı ile ihbar tazminatının şartları ve hesaplama esasları farklıdır.",
      },
      {
        question: "Kıdem ve ihbar aynı anda alınabilir mi?",
        answer:
          "Somut fesih durumuna ve ilgili hukuki şartlara göre her iki tazminata da hak kazanılması mümkün olabilir.",
      },
      {
        question: "Toplam tazminat nasıl hesaplanır?",
        answer:
          "Kıdem ve ihbar tutarları ayrı hesaplanır ve ilgili kesintiler dikkate alınarak toplam sonuç gösterilebilir.",
      },
    ],
  },
};

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

  const webpageSchema = {
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
    mainEntity: seo.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webpageSchema
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema
          ),
        }}
      />
    </>
  );
}

export function generateStaticParams() {
  return calculators.map(
    (calculator) => ({
      slug: calculator.slug,
    })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const calculator =
    calculators.find(
      (item) =>
        item.slug === slug
    );

  const seo =
    seoContents[slug];

  if (!calculator || !seo) {
    return {
      title:
        "MiniHesap | Hesaplama Araçları",
      description:
        "MiniHesap hesaplama araçları.",
    };
  }

  return {
    title: seo.title,
    description: seo.description,

    alternates: {
      canonical:
        `/hesaplamalar/${slug}`,
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "tr_TR",
      siteName: "MiniHesap",
      url:
        `/hesaplamalar/${slug}`,
    },

    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

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

      {/* =========================
          JSON-LD
      ========================= */}

      <JsonLd
        calculator={calculator}
        seo={seo}
        slug={slug}
      />

      {/* =========================
          HESAPLAYICI
      ========================= */}

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
          {calculator.description}
        </p>

        <Calculator />

      </div>

      {/* =========================
          SEO İÇERİĞİ
      ========================= */}

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

            {/* GİRİŞ */}

            <article
              style={{
                padding: 25,
                borderRadius: 22,
                background: "white",
                border:
                  "1px solid #dce7df",
              }}
            >

              <div className="eyebrow">
                {calculator.title.toUpperCase()}
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
                  color: "#617066",
                  lineHeight: 1.8,
                }}
              >
                {seo.intro}
              </p>

            </article>

            {/* NASIL HESAPLANIR */}

            <article
              style={{
                marginTop: 20,
                padding: 25,
                borderRadius: 22,
                background: "white",
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
                  display: "grid",
                  gap: 12,
                }}
              >
                {seo.howItWorks.map(
                  (step, index) => (
                    <div
                      key={step}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems:
                          "flex-start",
                        padding: 14,
                        borderRadius: 15,
                        background:
                          "#f8faf9",
                        border:
                          "1px solid #e5eee8",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 32,
                          width: 32,
                          height: 32,
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
                          fontWeight: 900,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        style={{
                          paddingTop: 5,
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

            {/* SSS */}

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
                  display: "grid",
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
                        {faq.question}
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
                        {faq.answer}
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