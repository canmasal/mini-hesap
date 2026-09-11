import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">
            Mini<span>Hesap</span>
          </div>
          <p>
            Günlük hayattaki hesaplama ihtiyaçlarını sade ve hızlı araçlarla
            çözmek için tasarlandı. Tüm hesaplamalar bilgilendirme amaçlıdır.
          </p>
        </div>

        <nav aria-label="Hesaplama araçları">
          <strong>Popüler Araçlar</strong>
          <Link href="/hesaplamalar/net-maas">Net Maaş Hesaplama</Link>
          <Link href="/hesaplamalar/kidem">Kıdem Tazminatı</Link>
          <Link href="/hesaplamalar/kdv">KDV Hesaplama</Link>
          <Link href="/hesaplamalar/kredi-borc">Kredi Hesaplama</Link>
        </nav>

        <nav aria-label="Finans araçları">
          <strong>Finans Araçları</strong>
          <Link href="/borc-takip">Banka Borç Takip</Link>
          <Link href="/on-muhasebe">Ön Muhasebe Takip</Link>
          <Link href="/premium">Premium Şablonlar</Link>
          
        </nav>

        <nav aria-label="Kurumsal ve yasal">
          <strong>Kurumsal</strong>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/iletisim">İletişim</Link>
          <Link href="/gizlilik">Gizlilik Politikası</Link>
          <Link href="/kullanim-sartlari">Kullanım Şartları</Link>
          <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>
          <Link href="/iade-kosullari">İptal ve İade</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span>© {year} MiniHesap. Tüm hakları saklıdır.</span>
          <span>
            Sonuçlar tahminidir; resmî beyan yerine geçmez.
          </span>
        </div>
      </div>
    </footer>
  );
}
