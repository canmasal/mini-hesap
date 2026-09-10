import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description:
    "MiniHesap kullanım şartları: hizmetin kapsamı, sorumluluk sınırları, fikri mülkiyet ve premium ürünlere ilişkin koşullar.",
  alternates: { canonical: "/kullanim-sartlari" },
};

const LAST_UPDATED = "10 Eylül 2026";

export default function TermsPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Kullanım Şartları" },
          ]}
        />

        <p className="eyebrow">YASAL</p>
        <h1>Kullanım Şartları</h1>

        <p className="page-lead">
          MiniHesap’ı kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
          Şartları kabul etmiyorsanız lütfen siteyi kullanmayın.
        </p>

        <span className="updated">Son güncelleme: {LAST_UPDATED}</span>

        <div className="prose">
          <h2>1. Hizmetin kapsamı</h2>
          <p>
            MiniHesap, çevrimiçi hesaplama araçları sunan ücretsiz bir
            platformdur. Araçlar “olduğu gibi” sunulur; kesintisiz veya hatasız
            çalışacağı garanti edilmez.
          </p>

          <h2>2. Sonuçların niteliği — önemli uyarı</h2>
          <p>
            Sitedeki tüm hesaplama sonuçları <strong>tahminidir</strong> ve
            yalnızca bilgilendirme amaçlıdır. Sonuçlar;
          </p>
          <ul>
            <li>resmî bordro veya SGK hesaplaması,</li>
            <li>bankanın kesin kredi ödeme planı,</li>
            <li>mali müşavir, avukat veya yatırım danışmanı görüşü</li>
          </ul>
          <p>
            yerine geçmez. Mevzuat, oran ve vergi dilimleri yıl içinde
            değişebilir. Bağlayıcı bir karar almadan önce mutlaka yetkili bir
            uzmana danışın.
          </p>

          <h2>3. Sorumluluğun sınırlandırılması</h2>
          <p>
            MiniHesap, sitedeki bilgilerin veya hesaplama sonuçlarının
            kullanılmasından doğabilecek doğrudan ya da dolaylı zararlardan
            sorumlu tutulamaz. Sonuçları kullanma kararı tamamen kullanıcıya
            aittir.
          </p>

          <h2>4. Kullanıcı yükümlülükleri</h2>
          <ul>
            <li>
              Siteyi yürürlükteki mevzuata aykırı biçimde kullanmamak.
            </li>
            <li>
              Otomatik araçlarla sistemi aşırı yüklememek veya içeriği toplu
              olarak kopyalamamak.
            </li>
            <li>
              Sitenin güvenliğini tehlikeye atacak girişimlerde bulunmamak.
            </li>
          </ul>

          <h2>5. Fikri mülkiyet</h2>
          <p>
            Site tasarımı, metinleri, hesaplama araçları ve premium Excel
            şablonları MiniHesap’a aittir. Yazılı izin olmadan çoğaltılamaz,
            yeniden yayımlanamaz veya ticari amaçla dağıtılamaz.
          </p>

          <h2>6. Premium ürünler</h2>
          <p>
            Premium Excel şablonları dijital ürünlerdir. Satın alınan dosya
            kişisel kullanım içindir; yeniden satılamaz veya üçüncü kişilerle
            paylaşılamaz. Dijital ürünler indirildikten sonra, ürün kusurlu
            olmadıkça iade edilemez.
          </p>

          <h2>7. Reklamlar ve dış bağlantılar</h2>
          <p>
            Sitede reklam alanları ve üçüncü taraf sitelere bağlantılar
            bulunabilir. Bu sitelerin içeriğinden ve gizlilik uygulamalarından
            MiniHesap sorumlu değildir.
          </p>

          <h2>8. Değişiklikler</h2>
          <p>
            Bu şartlar önceden bildirilmeksizin güncellenebilir. Güncel sürüm
            bu sayfada yayımlanır.
          </p>

          <h2>9. Uygulanacak hukuk</h2>
          <p>
            Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda
            Türkiye mahkemeleri ve icra daireleri yetkilidir.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Şartlarla ilgili sorularınız için{" "}
            <Link href="/iletisim">İletişim</Link> sayfasını kullanabilirsiniz.
            Verilerinizin işlenmesi hakkında bilgi için{" "}
            <Link href="/gizlilik">Gizlilik Politikası</Link>’na bakın.
          </p>
        </div>
      </div>
    </main>
  );
}
