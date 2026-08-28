export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">Mini<span>Hesap</span></div>
          <p>Günlük hayattaki hesaplama ihtiyaçlarını sade ve hızlı araçlarla çözmek için tasarlandı.</p>
        </div>
        <div>
          <strong>Hızlı Linkler</strong>
          <a href="/hesaplamalar">Hesaplamalar</a>
          <a href="/hakkimizda">Hakkımızda</a>
          <a href="/iletisim">İletişim</a>
        </div>
        <div>
          <strong>Yasal</strong>
          <a href="/gizlilik">Gizlilik</a>
          <a href="/kullanim-sartlari">Kullanım Şartları</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© 2026 MiniHesap</div>
      </div>
    </footer>
  );
}
