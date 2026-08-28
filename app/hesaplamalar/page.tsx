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

type SeoContent = {
  title: string;
  description: string;
  intro: string;
  howItWorks: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
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
          "Brüt maaş, kesintiler uygulanmadan önceki ücret tutarıdır. Net maaş ise yasal kesintiler ve ilgili istisnalar sonrasında çalışanın eline geçen tutardır.",
      },
      {
        question: "Kümülatif vergi matrahı neden önemlidir?",
        answer:
          "Ücret gelirlerinde gelir vergisinin hesaplanmasında yıl içinde biriken kümülatif matrah vergi dilimi üzerinde etkili olabilir.",
      },
      {
        question: "Net maaş her ay aynı olur mu?",
        answer:
          "Her zaman aynı olmayabilir. Özellikle yıl içindeki gelir vergisi dilimi değişiklikleri, primler, ikramiyeler ve diğer ücret unsurları net maaşı etkileyebilir.",
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
      "Sonuç ekranından yüzde tutarını ve artış/azalış değerlerini görün.",
    ],
    faqs: [
      {
        question: "Bir sayının yüzdesi nasıl hesaplanır?",
        answer:
          "Ana tutar yüzde oranı ile çarpılır ve 100'e bölünür.",
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
      "KDV hesaplama aracımız sayesinde bir tutarın KDV dahil veya hariç karşılığını hızlıca bulabilirsiniz.",
    howItWorks: [
      "Tutarı girin.",
      "KDV oranını seçin.",
      "Tutarın KDV dahil veya hariç olduğunu belirtin.",
      "KDV tutarı ve toplam sonucu görüntüleyin.",
    ],
    faqs: [
      {
        question: "KDV dahil tutardan KDV hariç tutar nasıl bulunur?",
        answer:
          "KDV dahil tutar, seçilen KDV oranına göre KDV hariç matrahı bulmak için ters hesaplama ile ayrıştırılır.",
      },
      {
        question: "KDV hariç 1.000 TL'nin %20 KDV'si nedir?",
        answer:
          "1.000 TL üzerinden %20 KDV 200 TL'dir ve KDV dahil toplam 1.200 TL olur.",
      },
      {
        question: "Hangi KDV oranını seçmeliyim?",
        answer:
          "Uygulanacak oran ürün veya hizmete göre değişebilir. Hesaplama aracında ilgili oranı seçmeniz gerekir.",
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
      "İndirim tutarını ve son fiyatı görüntüleyin.",
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
      "Kira artış hesaplama aracı ile mevcut kira tutarı ve girdiğiniz artış oranına göre yeni kira tutarını hesaplayın.",
    intro:
      "Kira artış hesaplama aracında mevcut kira tutarınızı ve uygulamak istediğiniz artış oranını girerek yeni kira bedelini hesaplayabilirsiniz.",
    howItWorks: [
      "Mevcut kira tutarını girin.",
      "Artış oranını yüzde olarak yazın.",
      "Yeni aylık kira ve yıllık farkı görüntüleyin.",
    ],
    faqs: [
      {
        question: "Kira artışı nasıl hesaplanır?",
        answer:
          "Mevcut kira tutarı, uygulanan artış oranıyla hesaplanan artış miktarı kadar yükseltilir.",
      },
      {
        question: "Kira artış oranı her zaman aynı mıdır?",
        answer:
          "Hayır. Uygulanabilecek yasal oran ve sözleşme koşulları döneme ve duruma göre değişebilir. Araçta kullanıcı tarafından girilen oran hesaplanır.",
      },
      {
        question: "Yıllık kira farkı nasıl hesaplanır?",
        answer:
          "Aylık kira artış tutarı 12 ay üzerinden hesaplanarak yıllık fark gösterilir.",
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
      "Uygulanacak mesai katsayısını seçin.",
      "Tahmini fazla mesai tutarını görüntüleyin.",
    ],
    faqs: [
      {
        question: "Fazla mesai ücreti nasıl hesaplanır?",
        answer:
          "Temel hesaplama mantığında saatlik ücret bulunur ve ilgili fazla mesai katsayısı uygulanarak çalışılan fazla mesai saati ile çarpılır.",
      },
      {
        question: "1,5 kat fazla mesai ne demektir?",
        answer:
          "Saatlik temel ücretin 1,5 katı üzerinden hesaplanan fazla çalışma ücretini ifade eder.",
      },
      {
        question: "Fazla mesai hesabı net mi brüt mü?",
        answer:
          "Bu araçta sonuç temel brüt hesaplama olarak sunulur. Vergi ve diğer bordro kesintileri ayrıca değerlendirilmelidir.",
      },
    ],
  },

  kidem: {
    title: "Kıdem Tazminatı Hesaplama 2026",
    description:
      "Kıdem tazminatı hesaplama aracı ile işe giriş ve çıkış tarihlerine, brüt ücrete ve düzenli yan haklara göre tahmini kıdem tazminatınızı hesaplayın.",
    intro:
      "Kıdem tazminatı hesaplamasında çalışma süresi, kıdeme esas ücret, düzenli yan haklar ve ilgili kıdem tazminatı tavanı gibi unsurlar önemlidir.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve işten çıkış tarihlerini seçin.",
      "Varsa düzenli yemek, yol ve diğer yan hakları girin.",
      "Sistem çalışma süresini yıl, ay ve gün olarak hesaplar.",
      "Kıdeme esas ücret, brüt kıdem, damga vergisi ve net kıdem tutarını gösterir.",
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
          "Düzenli ve para veya para ile ölçülebilen bazı menfaatler kıdem hesabında dikkate alınabilir. Uygulamanın niteliğine göre değerlendirme yapılmalıdır.",
      },
    ],
  },

  ihbar: {
    title: "İhbar Tazminatı Hesaplama 2026",
    description:
      "İhbar tazminatı hesaplama aracı ile çalışma süresine göre ihbar süresini ve tahmini ihbar tazminatını hesaplayın.",
    intro:
      "İhbar tazminatı hesaplamasında hizmet süresi, bildirim süresi, ücret ve düzenli ücret niteliğindeki bazı ödemeler önem taşır.",
    howItWorks: [
      "Brüt ücretinizi girin.",
      "İşe giriş ve işten çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "Sistem hizmet süresine göre ihbar haftasını belirler.",
      "Brüt ve tahmini net ihbar tazminatı detaylarını görüntüleyin.",
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
          "İhbar tazminatı ücret niteliğinde değerlendirilebildiğinden vergi hesaplaması ödeme ve kişinin ilgili ücret matrahı gibi unsurlara göre değişebilir.",
      },
    ],
  },

  "kidem-ihbar": {
    title: "Kıdem ve İhbar Tazminatı Hesaplama 2026",
    description:
      "Kıdem ve ihbar tazminatınızı tek ekranda hesaplayın. Çalışma süresi, kıdeme esas ücret, ihbar süresi ve toplam tahmini tazminatı görün.",
    intro:
      "Kıdem + İhbar Hesaplama aracımız, iki hesaplamayı tek ekranda değerlendirmenizi ve toplam tahmini tazminatı görmenizi sağlar.",
    howItWorks: [
      "Son brüt ücretinizi girin.",
      "İşe giriş ve işten çıkış tarihlerini seçin.",
      "Varsa düzenli yan haklarınızı girin.",
      "Önceki kümülatif vergi matrahını gerekiyorsa ekleyin.",
      "Kıdem, ihbar ve toplam sonuçları ayrı ayrı görüntüleyin.",
    ],
    faqs: [
      {
        question: "Kıdem ve ihbar tazminatı aynı şey midir?",
        answer:
          "Hayır. Kıdem tazminatı ile ihbar tazminatının şartları ve hesaplama esasları birbirinden farklıdır.",
      },
      {
        question: "Kıdem ve ihbar aynı anda alınabilir mi?",
        answer:
          "Somut fesih durumuna ve kanuni şartlara göre her iki tazminata da hak kazanılması mümkün olabilir.",
      },
      {
        question: "Toplam tazminat nasıl hesaplanır?",
        answer:
          "Kıdem ve ihbar için ayrı ayrı hesaplanan tutarlar, ilgili vergi ve kesinti kalemleri dikkate alınarak birlikte gösterilebilir.",
      },
    ],
  },
};

export function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const calculator = calculators.find(
    (item) => item.slug === slug
  );

  const seo = seoContents[slug];

  if (!calculator || !seo) {
    return {
      title: "MiniHesap | Hesaplama Araçları",
      description:
        "MiniHesap hesaplama araçları.",
    };
  }

  return {
    title: seo.title,
    description: seo.description,

    alternates: {
      canonical: `/hesaplamalar/${slug}`,
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "tr_TR",
      siteName: "MiniHesap",
    },

    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const calculator = calculators.find(
    (item) => item.slug === slug
  );

  const Calculator =
    componentMap[slug];

  const seo = seoContents[slug];

  if (
    !calculator ||
    !Calculator ||
    !seo
  ) {
    notFound();
  }

  return (
    <main className="page">

      {/* ================================
          HESAPLAMA ALANI
      ================================= */}

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

      {/* ================================
          SEO İÇERİĞİ
      ================================= */}

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

            {/* Giriş */}

            <div
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

            </div>

            {/* Nasıl çalışır */}

            <div
              style={{
                marginTop: 20,
                padding: 25,
                borderRadius: 22,
                background: "#ffffff",
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
                  (item, index) => (
                    <div
                      key={item}
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
                        {item}
                      </div>

                    </div>
                  )
                )}
              </div>

            </div>

            {/* SSS */}

            <div
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

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}