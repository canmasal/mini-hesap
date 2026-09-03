import type { Metadata } from "next";
import Link from "next/link";

import { calculators } from "@/data/calculators";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Hesaplama Araçları | MiniHesap",
  description:
    "Net maaş, kıdem tazminatı, ihbar tazminatı, KDV, yüzde, indirim, kira artışı, fazla mesai, yaş, yıllık izin, banka borç takip ve ön muhasebe hesaplama araçlarını tek yerde kullanın.",
  alternates: {
    canonical: "/hesaplamalar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HesaplamalarPage() {
  /*
   * Sonradan eklediğimiz özel MiniHesap araçları.
   * Bunlar /hesaplamalar/[slug] altında değil,
   * kendi özel sayfalarına gider.
   */
  const specialTools = [
    {
      slug: "borc-takip",
      href: "/borc-takip",
      icon: "🏦",
      title: "Banka Borç Takip",
      description:
        "Banka, kredi kartı ve nakit avans borçlarınızı tek tabloda takip edin. Toplam borç, limit ve kullanılabilir limitinizi görün.",
      button: "Borç Takip Et",
    },
    {
      slug: "on-muhasebe",
      href: "/on-muhasebe",
      icon: "📊",
      title: "Ön Muhasebe Takip",
      description:
        "Gelir, gider, KDV, belge, cari ve ödeme bilgilerinizi takip edin. Aylık ve yıllık finansal özetinizi görüntüleyin.",
      button: "Ön Muhasebeyi Aç",
    },
  ];

  return (
    <main className="page">

      {/* =====================================================
          ÜST REKLAM
      ===================================================== */}

      <div className="container">
        <AdSlot position="top" />
      </div>

      {/* =====================================================
          BAŞLIK
      ===================================================== */}

      <section className="section">
        <div className="container">

          <div
            style={{
              maxWidth: 850,
              margin: "0 auto",
              textAlign: "center",
              paddingTop: 30,
            }}
          >

            <div className="eyebrow">
              POPÜLER HESAPLAMALAR
            </div>

            <h1
              style={{
                margin: "10px 0 14px",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.05,
              }}
            >
              Hesaplama Araçları
            </h1>

            <p
              className="page-lead"
              style={{
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              Günlük hayatta en çok ihtiyaç duyulan hesaplamaları
              tek yerde hızlı, kolay ve anlaşılır şekilde yapın.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          HESAPLAMA KARTLARI
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 10,
        }}
      >
        <div className="container">

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 18,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >

            {/* =================================================
                MEVCUT HESAPLAMALAR
            ================================================= */}

            {calculators.map((calculator) => (
              <Link
                key={calculator.slug}
                href={`/hesaplamalar/${calculator.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <article
                  style={{
                    height: "100%",
                    padding: 24,
                    borderRadius: 22,
                    background: "#ffffff",
                    border: "1px solid #dce7df",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease",
                    boxShadow:
                      "0 8px 25px rgba(16, 35, 26, 0.05)",
                  }}
                >

                  <div
                    style={{
                      width: 58,
                      height: 58,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 18,
                      background: "#effaf2",
                      fontSize: 29,
                      marginBottom: 18,
                    }}
                  >
                    {calculator.icon}
                  </div>

                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: 21,
                      lineHeight: 1.2,
                      color: "#10231a",
                    }}
                  >
                    {calculator.title}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 20px",
                      color: "#617066",
                      lineHeight: 1.65,
                      fontSize: 14,
                    }}
                  >
                    {calculator.description}
                  </p>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: "#16a34a",
                      color: "white",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    Hesapla
                    <span>→</span>
                  </div>

                </article>
              </Link>
            ))}

            {/* =================================================
                ÖZEL MİNİHESAP ARAÇLARI
            ================================================= */}

            {specialTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <article
                  style={{
                    height: "100%",
                    padding: 24,
                    borderRadius: 22,
                    background: "#ffffff",
                    border: "1px solid #ccebd6",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease",
                    boxShadow:
                      "0 8px 25px rgba(16, 35, 26, 0.07)",
                  }}
                >

                  {/* MİNİHESAP FİNANS ARACI ETİKETİ */}

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 9px",
                      borderRadius: 8,
                      background: "#effaf2",
                      color: "#008a43",
                      fontSize: 11,
                      fontWeight: 800,
                      marginBottom: 12,
                    }}
                  >
                    MİNİHESAP FİNANS ARACI
                  </div>

                  <div
                    style={{
                      width: 58,
                      height: 58,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 18,
                      background: "#effaf2",
                      fontSize: 29,
                      marginBottom: 18,
                    }}
                  >
                    {tool.icon}
                  </div>

                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: 21,
                      lineHeight: 1.2,
                      color: "#10231a",
                    }}
                  >
                    {tool.title}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 20px",
                      color: "#617066",
                      lineHeight: 1.65,
                      fontSize: 14,
                    }}
                  >
                    {tool.description}
                  </p>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: "#16a34a",
                      color: "white",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    {tool.button}
                    <span>→</span>
                  </div>

                </article>
              </Link>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          ORTA REKLAM
      ===================================================== */}

      <div className="container">
        <AdSlot position="middle" />
      </div>

      {/* =====================================================
          ALT SEO ALANI
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 35,
          paddingBottom: 70,
        }}
      >
        <div className="container">

          <article
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 28,
              borderRadius: 22,
              background: "#ffffff",
              border: "1px solid #dce7df",
            }}
          >

            <div className="eyebrow">
              MİNİHESAP
            </div>

            <h2
              style={{
                margin: "8px 0 14px",
                fontSize: 28,
              }}
            >
              Günlük hesaplamalarınızı kolaylaştırın
            </h2>

            <p
              style={{
                margin: 0,
                color: "#617066",
                lineHeight: 1.8,
              }}
            >
              MiniHesap; maaş, tazminat, KDV, yüzde, indirim,
              kira artışı, fazla mesai, yaş ve yıllık izin gibi
              farklı ihtiyaçlar için pratik hesaplama araçlarını
              bir araya getirir. Ayrıca banka borç takibi ve
              ön muhasebe takibi için gelişmiş finans araçları
              sunar.
            </p>

          </article>

        </div>
      </section>

      {/* =====================================================
          ALT REKLAM
      ===================================================== */}

      <div className="container">
        <AdSlot position="bottom" />
      </div>

    </main>
  );
}