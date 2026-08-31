import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profesyonel Borç Takip Excel'i | MiniHesap",
  description:
    "Banka, kredi kartı ve nakit avans borçlarınızı profesyonel Excel şablonu ile takip edin. Borç, limit, ödeme ve taksitlerinizi tek yerde yönetin.",
  alternates: {
    canonical: "/premium/borc-takip",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    icon: "🏦",
    title: "Banka Bazlı Takip",
    text: "Birden fazla bankadaki limit ve borçlarınızı tek tabloda yönetin.",
  },
  {
    icon: "💳",
    title: "Kredi Kartı Takibi",
    text: "Kart limitlerinizi, mevcut borçlarınızı ve kullanılabilir limitinizi görün.",
  },
  {
    icon: "💰",
    title: "Nakit Avans Takibi",
    text: "Nakit avans limit ve borçlarınızı ayrı olarak takip edin.",
  },
  {
    icon: "📊",
    title: "Otomatik Hesaplama",
    text: "Toplam borç, toplam limit ve kullanılabilir limit otomatik hesaplanır.",
  },
  {
    icon: "📅",
    title: "Ödeme Takibi",
    text: "İlerleyen sürümlerde aylık ödeme ve borç geçmişinizi takip edin.",
  },
  {
    icon: "📈",
    title: "Finansal Özet",
    text: "Toplam borç ve limit kullanım oranınızı kolayca görüntüleyin.",
  },
];

const steps = [
  {
    number: "1",
    title: "Excel'i satın alın",
    text: "Güvenli ödeme adımından ürünü satın alın.",
  },
  {
    number: "2",
    title: "Dosyanızı indirin",
    text: "Ödeme sonrası profesyonel Excel dosyanıza erişin.",
  },
  {
    number: "3",
    title: "Bilgilerinizi girin",
    text: "Banka limitlerinizi ve borçlarınızı Excel'e ekleyin.",
  },
  {
    number: "4",
    title: "Borçlarınızı takip edin",
    text: "Toplam borcunuzu ve kullanılabilir limitinizi tek ekrandan izleyin.",
  },
];

export default function PremiumBorcTakipPage() {
  return (
    <main className="page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 55,
          paddingBottom: 30,
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div className="eyebrow">
              💎 MİNİHESAP PREMIUM
            </div>

            <h1
              style={{
                margin: "12px 0 18px",
                fontSize:
                  "clamp(36px, 6vw, 60px)",
                lineHeight: 1.05,
              }}
            >
              Profesyonel Borç Takip
              <br />
              Excel'i
            </h1>

            <p
              className="page-lead"
              style={{
                maxWidth: 760,
                margin: "0 auto",
                fontSize: 18,
                lineHeight: 1.7,
              }}
            >
              Tüm banka, kredi kartı ve nakit
              avans borçlarınızı tek bir profesyonel
              Excel dosyasında takip edin.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 25,
              }}
            >
              <a
                href="#fiyat"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 24px",
                  borderRadius: 14,
                  background: "#16a34a",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                💎 Excel'i İncele
              </a>

              <Link
                href="/borc-takip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 24px",
                  borderRadius: 14,
                  background: "#ffffff",
                  color: "#10231a",
                  border: "1px solid #dce7df",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                ← Ücretsiz Demoya Dön
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ÜRÜN ÖZETİ
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 25,
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["💳", "Borç Takibi", "Tüm borçlarınızı tek tabloda görün."],
              ["📊", "Otomatik Hesaplama", "Toplamları otomatik hesaplayın."],
              ["📈", "Limit Analizi", "Kullanılabilir limitinizi takip edin."],
              ["📥", "İndirilebilir Excel", "Satın aldıktan sonra dosyanızı kullanın."],
            ].map(([icon, title, text]) => (
              <article
                key={title}
                style={{
                  padding: 22,
                  borderRadius: 20,
                  background: "#ffffff",
                  border: "1px solid #dce7df",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    marginBottom: 10,
                  }}
                >
                  {icon}
                </div>

                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: 20,
                  }}
                >
                  {title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#617066",
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ÖZELLİKLER
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 50,
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: 25,
              }}
            >
              <div className="eyebrow">
                PROFESYONEL SÜRÜM
              </div>

              <h2
                style={{
                  margin: "8px 0 10px",
                  fontSize: 34,
                }}
              >
                Neler elde edeceksiniz?
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#617066",
                }}
              >
                Borç takibini daha düzenli ve
                anlaşılır hale getirmek için
                tasarlanmış araçlar.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 15,
              }}
            >
              {features.map((feature) => (
                <article
                  key={feature.title}
                  style={{
                    padding: 22,
                    borderRadius: 18,
                    background: "#ffffff",
                    border: "1px solid #dce7df",
                  }}
                >
                  <div
                    style={{
                      fontSize: 30,
                      marginBottom: 10,
                    }}
                  >
                    {feature.icon}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: 19,
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#617066",
                      lineHeight: 1.65,
                      fontSize: 14,
                    }}
                  >
                    {feature.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NASIL ÇALIŞIR
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 45,
        }}
      >
        <div className="container">
          <article
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: 30,
              borderRadius: 24,
              background: "#ffffff",
              border: "1px solid #dce7df",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: 25,
              }}
            >
              <div className="eyebrow">
                NASIL ÇALIŞIR?
              </div>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: 32,
                }}
              >
                4 basit adımda başlayın
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 18,
              }}
            >
              {steps.map((step) => (
                <div
                  key={step.number}
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      margin: "0 auto 12px",
                      background: "#dcfce7",
                      color: "#15803d",
                      fontWeight: 900,
                      fontSize: 18,
                    }}
                  >
                    {step.number}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 7px",
                      fontSize: 17,
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#617066",
                      lineHeight: 1.55,
                      fontSize: 14,
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          FİYAT
      ===================================================== */}

      <section
        id="fiyat"
        className="section"
        style={{
          paddingTop: 50,
          paddingBottom: 70,
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <article
              style={{
                padding: 35,
                borderRadius: 28,
                background: "#ffffff",
                border: "2px solid #16a34a",
                boxShadow:
                  "0 18px 45px rgba(16,35,26,0.08)",
                textAlign: "center",
              }}
            >
              <div className="eyebrow">
                TANITIM FİYATI
              </div>

              <h2
                style={{
                  margin: "10px 0 5px",
                  fontSize: 28,
                }}
              >
                Profesyonel Borç Takip Excel'i
              </h2>

              <div
                style={{
                  marginTop: 20,
                  fontSize: 46,
                  lineHeight: 1,
                  fontWeight: 950,
                  color: "#15803d",
                }}
              >
                49,90 TL
              </div>

              <p
                style={{
                  color: "#617066",
                  margin:
                    "12px 0 24px",
                }}
              >
                Tek seferlik ödeme
              </p>

              <div
                style={{
                  textAlign: "left",
                  display: "grid",
                  gap: 10,
                  marginBottom: 25,
                }}
              >
                {[
                  "✓ Profesyonel Excel şablonu",
                  "✓ Banka bazlı borç takibi",
                  "✓ Kredi kartı limit takibi",
                  "✓ Nakit avans takibi",
                  "✓ Otomatik toplamlar",
                  "✓ Kullanılabilir limit hesabı",
                  "✓ Borç / limit oranı",
                  "✓ Güncellenebilir yapı",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "#f8faf9",
                      color: "#24352c",
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* ŞİMDİLİK DEMO BUTONU */}

              <button
                type="button"
                disabled
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  borderRadius: 14,
                  background: "#d1d5db",
                  color: "#6b7280",
                  fontSize: 16,
                  fontWeight: 900,
                  cursor: "not-allowed",
                }}
              >
                🔒 Satın Alma Yakında Aktif
              </button>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                  lineHeight: 1.5,
                }}
              >
                Ödeme sistemi henüz aktif değildir.
                Satın alma özelliği ödeme altyapısı
                tamamlandığında açılacaktır.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          ALT CTA
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: 0,
          paddingBottom: 60,
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 25,
              borderRadius: 20,
              background: "#effaf2",
              border: "1px solid #ccebd6",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 25,
              }}
            >
              Önce ücretsiz demoyu deneyin
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                color: "#617066",
              }}
            >
              Sistemin nasıl çalıştığını görmeden
              satın almak zorunda değilsiniz.
            </p>

            <Link
              href="/borc-takip"
              style={{
                display: "inline-flex",
                padding: "12px 20px",
                borderRadius: 12,
                background: "#16a34a",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              💳 Ücretsiz Borç Takip Demosu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}