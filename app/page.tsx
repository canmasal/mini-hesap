import CalculatorCard from "@/components/CalculatorCard";
import AdSlot from "@/components/AdSlot";
import { calculators } from "@/data/calculators";

const financeTools = [
  {
    href: "/borc-takip",
    icon: "ğŸ¦",
    title: "Banka BorÃ§ Takip",
    description:
      "Banka, kredi kartÄ± ve nakit avans borÃ§larÄ±nÄ±zÄ± tek tabloda takip edin. Toplam borÃ§, limit ve kullanÄ±labilir limitinizi gÃ¶rÃ¼n.",
    link: "BorÃ§ Takibi AÃ§ â†’",
  },
  {
    href: "/on-muhasebe",
    icon: "ğŸ“Š",
    title: "Ã–n Muhasebe Takip",
    description:
      "Gelir, gider, KDV, belge, cari ve Ã¶deme bilgilerinizi dÃ¼zenli ÅŸekilde takip edin. Finansal Ã¶zetinizi tek ekranda gÃ¶rÃ¼n.",
    link: "Ã–n Muhasebeyi AÃ§ â†’",
  },
];

export default function HomePage() {
  return (
    <main>
      <div className="container ad-section">
        <AdSlot position="top" />
      </div>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">âš¡ HÄ±zlÄ± â€¢ Kolay â€¢ Mobil Uyumlu</div>

            <h1>
              HayatÄ±nÄ± KolaylaÅŸtÄ±ran
              <span>Hesaplamalar Tek Yerde!</span>
            </h1>

            <p>
              MaaÅŸ, fazla mesai, kÄ±dem, kira artÄ±ÅŸÄ±, KDV, yÃ¼zde ve daha
              fazlasÄ±nÄ± anlaÅŸÄ±lÄ±r araÃ§larla hÄ±zlÄ±ca hesaplayÄ±n.
            </p>

            <div className="hero-actions">
              <a className="btn btn-green" href="/hesaplamalar">
                Hemen BaÅŸla â†’
              </a>
              <a className="btn btn-outline" href="#araclar">
                AraÃ§larÄ± GÃ¶r
              </a>
            </div>
          </div>

          <div className="mock">
            <div className="mock-inner">
              <div className="mock-top">
                <div>
                  <div className="mock-sub">MiniHesap</div>
                  <div className="mock-title">BugÃ¼n ne hesaplayacaÄŸÄ±z?</div>
                </div>
                <div style={{ fontSize: 38 }} aria-hidden="true">
                  ğŸ§®
                </div>
              </div>

              <div className="quick-grid">
                {calculators.slice(0, 4).map((item) => (
                  <a
                    className="quick"
                    key={item.slug}
                    href={`/hesaplamalar/${item.slug}`}
                  >
                    <div className="quick-icon">{item.icon}</div>
                    <div className="quick-title">{item.title}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white" id="araclar">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">POPÃœLER ARAÃ‡LAR</div>
            <h2>Hesaplama AraÃ§larÄ±</h2>
            <p>
              GÃ¼nlÃ¼k hayatta en Ã§ok ihtiyaÃ§ duyulan hesaplamalarÄ± tek yerde
              hÄ±zlÄ± ve anlaÅŸÄ±lÄ±r ÅŸekilde kullanÄ±n.
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

      <div className="container ad-section">
        <AdSlot position="middle" />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">MÄ°NÄ°HESAP ARAÃ‡LARI</div>
            <h2>Finans Takibinizi de Tek Yerden YÃ¶netin</h2>
            <p>
              Sadece hesaplamakla kalmayÄ±n; borÃ§larÄ±nÄ±zÄ± ve iÅŸletme
              gelir-giderinizi de dÃ¼zenli takip edin.
            </p>
          </div>

          <div className="finance-grid">
            {financeTools.map((tool) => (
              <a className="finance-card" key={tool.href} href={tool.href}>
                <div className="finance-card-icon">{tool.icon}</div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <div className="finance-card-link">{tool.link}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">NEDEN MÄ°NÄ°HESAP?</div>
            <h2>Sade, hÄ±zlÄ± ve eriÅŸilebilir</h2>
            <p>
              Gereksiz karmaÅŸayÄ± kaldÄ±rÄ±p ihtiyacÄ±nÄ±z olan sonucu Ã¶ne
              Ã§Ä±karÄ±yoruz.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon" aria-hidden="true">
                âš¡
              </div>
              <h3>HÄ±zlÄ± SonuÃ§</h3>
              <p>
                Gereksiz adÄ±mlarla uÄŸraÅŸmadan ihtiyacÄ±nÄ±z olan hesaplamaya
                ulaÅŸÄ±n.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon" aria-hidden="true">
                ğŸ“±
              </div>
              <h3>Her Cihazda</h3>
              <p>
                Telefon, tablet ve bilgisayarda rahat kullanÄ±lacak responsive
                yapÄ±.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon" aria-hidden="true">
                ğŸ§©
              </div>
              <h3>Tek Merkez</h3>
              <p>
                Hesaplama, borÃ§ takip ve Ã¶n muhasebe araÃ§larÄ±nÄ± tek platformda
                bir araya getirin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container ad-section">
        <AdSlot position="bottom" />
      </div>
    </main>
  );
}