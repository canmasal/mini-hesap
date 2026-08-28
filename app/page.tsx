import CalculatorCard from "@/components/CalculatorCard";
import { calculators } from "@/data/calculators";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">⚡ Hızlı • Kolay • Mobil Uyumlu</div>
            <h1>
              Hayatını Kolaylaştıran
              <span>Hesaplamalar Tek Yerde!</span>
            </h1>
            <p>
              Maaş, fazla mesai, kıdem, kira artışı, KDV, yüzde ve daha
              fazlasını anlaşılır araçlarla hızlıca hesaplayın.
            </p>
            <div className="hero-actions">
              <a className="btn btn-green" href="/hesaplamalar">Hemen Başla →</a>
              <a className="btn btn-outline" href="#araclar">Araçları Gör</a>
            </div>
          </div>

          <div className="mock">
            <div className="mock-inner">
              <div className="mock-top">
                <div>
                  <div className="mock-sub">MiniHesap</div>
                  <div className="mock-title">Bugün ne hesaplayacağız?</div>
                </div>
                <div style={{ fontSize: 38 }}>🧮</div>
              </div>
              <div className="quick-grid">
                {calculators.slice(0, 4).map((item) => (
                  <a className="quick" key={item.slug} href={`/hesaplamalar/${item.slug}`}>
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
            <div className="eyebrow">POPÜLER ARAÇLAR</div>
            <h2>Hesaplama Araçları</h2>
            <p>Günlük hayatta en çok ihtiyaç duyulan hesaplamaları tek yerde bul.</p>
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
            <div className="eyebrow">NEDEN MİNİHESAP?</div>
            <h2>Sade, hızlı ve erişilebilir</h2>
          </div>

          <div className="feature-grid">
            <div className="feature"><div className="feature-icon">⚡</div><h3>Hızlı</h3><p>Gereksiz adımlarla uğraşmadan sonuca ulaşın.</p></div>
            <div className="feature"><div className="feature-icon">📱</div><h3>Her Yerde</h3><p>Telefon, tablet ve bilgisayarda rahatça kullanın.</p></div>
            <div className="feature"><div className="feature-icon">🧩</div><h3>Tek Merkez</h3><p>Farklı hesaplama araçlarını tek platformda toplayın.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
