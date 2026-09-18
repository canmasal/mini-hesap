import type { Metadata } from "next";
import Link from "next/link";

import BorcTakipDemo from "@/components/BorcTakipDemo";
import Breadcrumb from "@/components/Breadcrumb";
import PremiumCta from "@/components/PremiumCta";
import AdSlot from "@/components/AdSlot";
export const metadata: Metadata = {
  title: "Borç Takip Tablosu: Kredi ve Kart Borçları",
  description:
    "Tüm banka ve kredi kartı borçlarınızı tek tabloda takip edin. MiniHesap borç takip aracını ücretsiz demo olarak deneyin.",
  alternates: {
    canonical: "/borc-takip",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BorcTakipPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hesaplamalar", href: "/hesaplamalar" },
            { label: "Banka Borç Takip" },
          ]}
        />
      </div>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div className="eyebrow">MİNİHESAP FİNANS ARAÇLARI</div>

            <h1
              style={{
                margin: "10px 0 14px",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.05,
              }}
            >
              💳 Borç Takip ve Banka Borç Durumu
            </h1>

            <p
              className="page-lead"
              style={{
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Banka, kredi kartı ve nakit avans borçlarınızı tek tabloda
              görüntüleyin. Aşağıdaki demo üzerinden sistemi hemen deneyin.
            </p>
          </div>
        </div>
      </section>

      <BorcTakipDemo />

      <section className="section" style={{ paddingTop: 25, paddingBottom: 0 }}>
        <div className="container">
          <div className="prose" style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2>Borç takip aracı nasıl kullanılır?</h2>
            <ol>
              <li>Her banka veya kredi kartı için bir satır ekleyin.</li>
              <li>Kalan borç tutarını, varsa kart limitini ve aylık ödeme tutarını girin.</li>
              <li>Toplam borcunuzu ve aylık ödeme yükünüzü tek bakışta görün.</li>
              <li>Ödeme yaptıkça tutarları güncelleyerek borcun nasıl azaldığını takip edin.</li>
            </ol>

            <h2>Borçlarınızı yönetirken nelere dikkat etmelisiniz?</h2>
            <ul>
              <li>
                <strong>Asgari ödeme borcu bitirmez:</strong> Kredi kartında
                yalnızca asgari tutarı ödediğinizde kalan borca faiz işler ve
                toplam geri ödeme uzar.
              </li>
              <li>
                <strong>Faizi en yüksek borca öncelik verin:</strong> Ekstre ve
                kredi sözleşmelerinizdeki aylık faiz oranlarını karşılaştırın;
                ek ödeme yapabiliyorsanız önce faizi en yüksek olan borcu
                kapatmak toplam faiz yükünü azaltır.
              </li>
              <li>
                <strong>Limit kullanım oranını izleyin:</strong> Kart
                limitlerinizin büyük kısmını sürekli dolu tutmak hem bütçenizi
                zorlar hem de kredi notunuzu olumsuz etkileyebilir.
              </li>
              <li>
                <strong>Ödeme tarihlerini kaçırmayın:</strong> Gecikme faizi ve
                kredi siciline yansıyan gecikmeler, sonraki kredi başvurularınızı
                zorlaştırabilir.
              </li>
            </ul>
            <p>
              Bir kredinin taksitini ve toplam maliyetini hesaplamak için{" "}
              <Link href="/hesaplamalar/kredi-borc">Kredi Borç Hesaplama</Link>{" "}
              aracını, kredi kartı taksitlerinin gerçek maliyeti için{" "}
              <Link href="/hesaplamalar/taksit-maliyeti">Taksit Farkı Hesaplama</Link>{" "}
              aracını kullanabilirsiniz.
            </p>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Demoya girdiğiniz bilgiler tarayıcınızda işlenir. Sonuçlar
              bilgilendirme amaçlıdır; kesin tutarlar için bankanızın ekstresini
              esas alın.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 25, paddingBottom: 70 }}>
        <div className="container">
          <article
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 28,
              borderRadius: 22,
              background: "#ffffff",
              border: "1px solid #dce7df",
            }}
          >
            <div className="eyebrow">ÜCRETLİ SÜRÜM PLANI</div>

            <h2 style={{ margin: "8px 0 14px", fontSize: 28 }}>
              Profesyonel Borç Takip Excel'i
            </h2>

            <p style={{ color: "#617066", lineHeight: 1.8, marginBottom: 18 }}>
              Ücretli sürümde banka bazlı borç dağılımı, aylık ödeme geçmişi,
              taksit takibi, limit kullanım oranı, grafikler ve kişisel rapor
              alanlarını bir araya getireceğiz.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              {[
                "📊 Borç özet paneli",
                "🏦 Banka bazlı takip",
                "📅 Aylık ödeme geçmişi",
                "💳 Taksit takip alanı",
                "📈 Limit kullanım grafikleri",
                "📥 Excel / PDF raporu",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: 15,
                    borderRadius: 14,
                    background: "#f8faf9",
                    border: "1px solid #e5eee8",
                    fontWeight: 700,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Link className="btn btn-green" href="/premium/borc-takip">
                Premium sürümü incele →
              </Link>

              <span style={{ color: "var(--muted)", fontSize: 14 }}>
                Yukarıdaki demo her zaman ücretsizdir.
              </span>
            </div>
          </article>
        </div>
      </section>

      <div className="container">
        <PremiumCta toolHref="/borc-takip" />
        <AdSlot position="bottom" />
      </div>
    </main>
  );
}
