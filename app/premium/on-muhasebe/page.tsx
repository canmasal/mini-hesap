import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profesyonel Ön Muhasebe Excel | MiniHesap",
  description:
    "MiniHesap profesyonel ön muhasebe Excel şablonu ile gelir, gider, KDV, cari, ödeme ve finansal raporlarınızı takip edin.",
  alternates: {
    canonical: "/premium/on-muhasebe",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PremiumOnMuhasebePage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container">

          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              textAlign: "center",
              paddingTop: 45,
            }}
          >

            {/* ÜST ETİKET */}

            <div className="eyebrow">
              💎 MİNİHESAP PREMIUM
            </div>

            {/* BAŞLIK */}

            <h1
              style={{
                margin: "10px 0 16px",
                fontSize: "clamp(34px, 5vw, 56px)",
                lineHeight: 1.05,
              }}
            >
              Profesyonel Ön Muhasebe
              <br />
              Excel'i
            </h1>

            <p
              className="page-lead"
              style={{
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Gelir, gider, KDV, cari, ödeme ve belge
              kayıtlarınızı profesyonel bir Excel sistemi
              içerisinde takip edin.
            </p>

            {/* BUTONLAR */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 25,
              }}
            >
              <a
                href="/on-muhasebe"
                style={{
                  textDecoration: "none",
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "#ffffff",
                  border: "1px solid #dce7df",
                  color: "#10231a",
                  fontWeight: 800,
                }}
              >
                ← Ücretsiz Demoya Dön
              </a>
            </div>

          </div>

          {/* =====================================================
              ÖZELLİKLER
          ===================================================== */}

          <div
            style={{
              maxWidth: 1050,
              margin: "45px auto 0",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 15,
            }}
          >

            {[
              {
                icon: "📊",
                title: "Profesyonel Dashboard",
                text:
                  "Yıllık ve aylık gelir, gider ve net kâr durumunuzu tek ekrandan takip edin.",
              },
              {
                icon: "💰",
                title: "Gelir & Gider Takibi",
                text:
                  "İşletmenizin tüm gelir ve gider hareketlerini düzenli şekilde kaydedin.",
              },
              {
                icon: "🧾",
                title: "Fatura & Belge Takibi",
                text:
                  "Fatura, e-Fatura, e-Arşiv, fiş, makbuz ve diğer belgelerinizi takip edin.",
              },
              {
                icon: "📋",
                title: "Kategori Analizi",
                text:
                  "Hangi kategoriden ne kadar gelir veya gider oluştuğunu görün.",
              },
              {
                icon: "🧮",
                title: "KDV Takibi",
                text:
                  "%0, %1, %8, %10, %18 ve %20 KDV oranlarıyla kayıtlarınızı takip edin.",
              },
              {
                icon: "👥",
                title: "Cari Takip",
                text:
                  "Müşteri ve cari bilgilerinizi işlemlerinizle birlikte takip edin.",
              },
              {
                icon: "💳",
                title: "Ödeme Takibi",
                text:
                  "Banka, nakit, kredi kartı ve havale/EFT işlemlerini ayırın.",
              },
              {
                icon: "📅",
                title: "Vade Takibi",
                text:
                  "Vadesi gelen ve bekleyen işlemlerinizi daha kolay kontrol edin.",
              },
              {
                icon: "📈",
                title: "Gelir & Gider Grafikleri",
                text:
                  "Aylık gelir ve gider hareketlerinizi grafiklerle analiz edin.",
              },
              {
                icon: "📥",
                title: "Excel Kullanımı",
                text:
                  "Profesyonel Excel dosyanızı indirerek kendi bilgisayarınızda kullanın.",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: "#ffffff",
                  border: "1px solid #dce7df",
                  boxShadow:
                    "0 8px 25px rgba(16, 35, 26, 0.05)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 15,
                    background: "#effaf2",
                    fontSize: 26,
                    marginBottom: 14,
                  }}
                >
                  {feature.icon}
                </div>

                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: 18,
                    color: "#10231a",
                  }}
                >
                  {feature.title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#617066",
                    fontSize: 13,
                    lineHeight: 1.65,
                  }}
                >
                  {feature.text}
                </p>
              </article>
            ))}

          </div>

          {/* =====================================================
              EXCEL TANITIM
          ===================================================== */}

          <article
            style={{
              maxWidth: 950,
              margin: "35px auto 0",
              padding: 30,
              borderRadius: 22,
              background: "#ffffff",
              border: "1px solid #ccebd6",
              boxShadow:
                "0 12px 35px rgba(16, 35, 26, 0.06)",
            }}
          >

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 25,
                alignItems: "center",
              }}
            >

              <div>

                <div
                  className="eyebrow"
                  style={{
                    marginBottom: 8,
                  }}
                >
                  PROFESYONEL SÜRÜM
                </div>

                <h2
                  style={{
                    margin: "0 0 12px",
                    fontSize: 28,
                  }}
                >
                  İşletmenizin finansal kontrolü
                  artık tek Excel'de
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#617066",
                    lineHeight: 1.8,
                  }}
                >
                  Günlük kayıtlarınızı girin, Dashboard
                  üzerinden işletmenizin gelir, gider,
                  KDV ve kâr durumunu takip edin.
                </p>

              </div>

              <div
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: "#effaf2",
                  border: "1px solid #ccebd6",
                }}
              >

                <div
                  style={{
                    fontSize: 13,
                    color: "#617066",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  EXCEL İÇERİĞİ
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    color: "#10231a",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  <div>✓ Dashboard</div>
                  <div>✓ Veri Tabanı</div>
                  <div>✓ Kategori Yönetimi</div>
                  <div>✓ KDV Takibi</div>
                  <div>✓ Aylık Raporlar</div>
                  <div>✓ Yıllık Grafikler</div>
                  <div>✓ Cari & Ödeme Takibi</div>
                </div>

              </div>

            </div>

          </article>

          {/* =====================================================
              ALT ÇAĞRI
          ===================================================== */}

          <div
            style={{
              maxWidth: 700,
              margin: "35px auto 70px",
              padding: 25,
              borderRadius: 20,
              background: "#10231a",
              color: "#ffffff",
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: 28,
                marginBottom: 8,
              }}
            >
              💎
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 25,
              }}
            >
              Profesyonel Ön Muhasebe Excel'i
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                color: "#dbe7df",
                lineHeight: 1.6,
              }}
            >
              Ücretli sürüm aktif olduğunda profesyonel
              Excel dosyanızı buradan satın alıp
              indirebileceksiniz.
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "12px 20px",
                borderRadius: 12,
                background: "#16a34a",
                color: "#ffffff",
                fontWeight: 900,
              }}
            >
              🚀 Çok Yakında
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}