import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "MiniHesap; net maaş, tazminat, KDV, kredi ve daha birçok hesaplamayı ücretsiz, üyeliksiz ve gizliliğe saygılı biçimde sunan bir hesaplama platformudur.",
  alternates: { canonical: "/hakkimizda" },
};

export default function AboutPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Hakkımızda" }]}
        />

        <p className="eyebrow">MİNİHESAP</p>
        <h1>Hakkımızda</h1>

        <p className="page-lead">
          MiniHesap, günlük hayatta ihtiyaç duyulan hesaplamaları daha sade,
          hızlı ve erişilebilir hale getirmek için geliştirilen bağımsız bir web
          projesidir.
        </p>

        <div className="prose">
          <h2>Neden MiniHesap?</h2>
          <p>
            Maaşınızın net tutarını, tazminat hakkınızı ya da bir kredinin
            gerçek maliyetini öğrenmek için karmaşık tablolarla uğraşmanız
            gerekmez. MiniHesap, en çok ihtiyaç duyulan{" "}
            {calculators.length} hesaplama aracını tek çatı altında toplar ve
            sonucu adım adım anlaşılır biçimde gösterir.
          </p>

          <h2>Çalışma prensiplerimiz</h2>
          <ul>
            <li>
              <strong>Üyelik yok:</strong> Hiçbir aracı kullanmak için hesap
              açmanız gerekmez.
            </li>
            <li>
              <strong>Veri sunucuya gitmez:</strong> Hesaplamalar tarayıcınızda
              çalışır. Girdiğiniz maaş, borç veya kişisel bilgiler bize
              iletilmez.
            </li>
            <li>
              <strong>Şeffaf sonuç:</strong> Yalnızca sonucu değil, sonuca nasıl
              ulaşıldığını da gösteririz.
            </li>
            <li>
              <strong>Sürekli güncelleme:</strong> Vergi dilimi, asgari ücret ve
              oran değişikliklerini takip ederek araçları güncelliyoruz.
            </li>
          </ul>

          <h2>Neler sunuyoruz?</h2>
          <ul>
            <li>
              <strong>Çalışan hakları:</strong> Net maaş, kıdem ve ihbar
              tazminatı, fazla mesai, yıllık izin.
            </li>
            <li>
              <strong>Finans:</strong> KDV, kredi taksit ve ödeme planı, banka
              borç takibi.
            </li>
            <li>
              <strong>Günlük hesaplar:</strong> Yüzde, indirim, kira artışı,
              yaş.
            </li>
            <li>
              <strong>Takip araçları:</strong>{" "}
              <Link href="/borc-takip">Banka Borç Takip</Link> ve{" "}
              <Link href="/on-muhasebe">Ön Muhasebe Takip</Link>.
            </li>
          </ul>

          <h2>Sorumluluk sınırı</h2>
          <p>
            MiniHesap üzerindeki tüm sonuçlar bilgilendirme amaçlı ve tahminidir.
            Resmî bordro, banka hesaplaması veya mali müşavir görüşü yerine
            geçmez. Ayrıntılar için{" "}
            <Link href="/kullanim-sartlari">Kullanım Şartları</Link> sayfasına
            göz atın.
          </p>

          <h2>Bize ulaşın</h2>
          <p>
            Öneri, hata bildirimi veya iş birliği için{" "}
            <Link href="/iletisim">İletişim</Link> sayfasını kullanabilirsiniz.
          </p>

          <p style={{ marginTop: 28 }}>
            <Link className="btn btn-green" href="/hesaplamalar">
              Araçları keşfet →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
