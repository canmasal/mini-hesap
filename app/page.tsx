import Link from "next/link";

import CalculatorCard from "@/components/CalculatorCard";
import { calculators } from "@/data/calculators";
import AdSlot from "@/components/AdSlot";

export const metadata = {
  title: "Ücretsiz Online Hesaplama Araçları",
  description:
    "Net maaş, kıdem ve ihbar tazminatı, KDV, yüzde, kira artışı, kredi ve daha fazlasını ücretsiz hesaplayın.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ücretsiz Online Hesaplama Araçları | MiniHesap",
    description:
      "Günlük hayat ve finans için hızlı, anlaşılır ve mobil uyumlu hesaplama araçları.",
    type: "website" as const,
  },
};

const financeTools = [
  {
    href: "/borc-takip",
    icon: "🏦",
    title: "Banka Borç Takip",
    description:
      "Banka, kredi kartı ve nakit avans borçlarınızı tek tabloda takip edin; toplam borç ve kullanılabilir limitinizi görün.",
    cta: "Borç Takip Et",
  },
  {
    href: "/on-muhasebe",
    icon: "📊",
    title: "Ön Muhasebe Takip",
    description:
      "Gelir, gider, KDV ve cari bilgilerinizi kaydedin; aylık kâr-zarar özetinizi anında görüntüleyin.",
    cta: "Ön Muhasebeyi Aç",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="badge">⚡ Hızlı • Kolay • Mobil Uyumlu</p>

            <h1>
              Hayatını Kolaylaştıran{" "}
              <span>Hesaplamalar Tek Yerde!</span>
            </h1>

            <p>
              Maaş, fazla mesai, kıdem, kira artışı, KDV, yüzde ve daha
              fazlasını anlaşılır araçlarla hızlıca hesaplayın.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-green" href="/hesaplamalar">
                Hemen Başla →
              </Link>
              <a className="btn btn-outline" href="#araclar">
                Araçları Gör
              </a>
            </div>

            <div className="trust-row">
              <span>
                <span aria-hidden="true">✅</span> Üyelik gerekmez
              </span>
              <span>
                <span aria-hidden="true">🔒</span> Veriler cihazınızda kalır
              </span>
              <span>
                <span aria-hidden="true">🆓</span> {calculators.length}+ ücretsiz
                araç
              </span>
            </div>
          </div>

          <div className="mock">
            <div className="mock-inner">
              <div className="mock-top">
                <div>
                  <div className="mock-sub">MiniHesap</div>
                  <div className="mock-title">Bugün ne hesaplayacağız?</div>
                </div>
                <div style={{ fontSize: 38 }} aria-hidden="true">
                  🧮
                </div>
              </div>

              <div className="quick-grid">
                {calculators.slice(0, 4).map((item) => (
                  <Link
                    className="quick"
                    key={item.slug}
                    href={`/hesaplamalar/${item.slug}`}
                  >
                    <div className="quick-icon" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div className="quick-title">{item.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container ad-slot">
        <AdSlot position="top" />
      </div>

      <section className="section section-white" id="araclar">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">POPÜLER ARAÇLAR</p>
            <h2>Hesaplama Araçları</h2>
            <p>
              Günlük hayatta en çok ihtiyaç duyulan hesaplamaları tek yerde bul.
            </p>
          </div>

          <div className="cards">
            {calculators.map((item) => (
              <CalculatorCard
                key={item.slug}
                href={`/hesaplamalar/${item.slug}`}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">FİNANS ARAÇLARI</p>
            <h2>Tek seferlik hesabın ötesi</h2>
            <p>
              Borçlarınızı ve ön muhasebenizi düzenli olarak takip etmek için
              hazırlanmış kapsamlı araçlar.
            </p>
          </div>

          <div className="cards">
            {financeTools.map((tool) => (
              <CalculatorCard
                key={tool.href}
                href={tool.href}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                cta={tool.cta}
                badge="MİNİHESAP FİNANS ARACI"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">NEDEN MİNİHESAP?</p>
            <h2>Sade, hızlı ve erişilebilir</h2>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon" aria-hidden="true">
                ⚡
              </div>
              <h3>Hızlı</h3>
              <p>Gereksiz adımlarla uğraşmadan sonuca ulaşın.</p>
            </div>

            <div className="feature">
              <div className="feature-icon" aria-hidden="true">
                📱
              </div>
              <h3>Her Yerde</h3>
              <p>Telefon, tablet ve bilgisayarda rahatça kullanın.</p>
            </div>

            <div className="feature">
              <div className="feature-icon" aria-hidden="true">
                🔒
              </div>
              <h3>Gizli</h3>
              <p>
                Girdiğiniz bilgiler sunucuya gönderilmez, tarayıcınızda
                hesaplanır.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">İHTİYACINIZA GÖRE</p>
            <h2>Aradığınız program burada yok mu?</h2>
            <p>
              İstediğiniz programı doğal dille anlatın. AI ürün danışmanımız talebinizi özetlesin ve ekibimize bildirsin.
            </p>
            <Link className="btn btn-green" href="/program-talebi" style={{ marginTop: 20 }}>
              Program talebi oluştur
            </Link>
          </div>
        </div>
      </section>

      <div className="container ad-slot">
        <AdSlot position="bottom" />
      </div>
    </main>
  );
}
