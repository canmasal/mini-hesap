export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="/" className="logo">Mini<span>Hesap</span></a>
        <nav className="nav">
          <a href="/">Ana Sayfa</a>
          <a href="/hesaplamalar">Hesaplamalar</a>
          <a href="/hakkimizda">Hakkımızda</a>
          <a href="/iletisim">İletişim</a>
        </nav>
        <a href="/hesaplamalar" className="btn btn-green">Hemen Hesapla</a>
      </div>
    </header>
  );
}
