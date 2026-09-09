import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="MiniHesap ana sayfa">
          Mini<span>Hesap</span>
        </Link>

        <nav className="nav desktop-nav" aria-label="Ana navigasyon">
          <Link href="/">Ana Sayfa</Link>
          <Link href="/hesaplamalar">Hesaplamalar</Link>
          <Link href="/borc-takip">Banka BorÃ§ Takip</Link>
          <Link href="/on-muhasebe">Ã–n Muhasebe</Link>
          <Link href="/hakkimizda">HakkÄ±mÄ±zda</Link>
          <Link href="/iletisim">Ä°letiÅŸim</Link>
        </nav>

        <div className="header-actions">
          <Link href="/hesaplamalar" className="btn btn-green header-cta">
            Hemen Hesapla
          </Link>

          <details className="mobile-menu">
            <summary className="mobile-menu-button" aria-label="MenÃ¼yÃ¼ aÃ§">
              <span></span>
              <span></span>
              <span></span>
            </summary>

            <div className="mobile-menu-panel">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/hesaplamalar">Hesaplamalar</Link>
              <Link href="/borc-takip">Banka BorÃ§ Takip</Link>
              <Link href="/on-muhasebe">Ã–n Muhasebe</Link>
              <Link href="/hakkimizda">HakkÄ±mÄ±zda</Link>
              <Link href="/iletisim">Ä°letiÅŸim</Link>
              <Link href="/hesaplamalar" className="mobile-menu-cta">
                Hemen Hesapla â†’
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}