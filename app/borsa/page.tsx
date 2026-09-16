import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import StockBoard from "@/components/market/StockBoard";
import { SITE_URL } from "@/lib/site";
import { STOCK_SOURCE, fetchStocks } from "@/lib/stocks";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Canlı Borsa: BIST 100 ve Hisse Fiyatları | MiniHesap" },
  description:
    "BIST 100, BIST 30 ve en çok işlem gören hisselerin canlı fiyatları, günlük yükselenler ve düşenler. Dakikada bir güncellenen borsa tablosu.",
  alternates: { canonical: "/borsa" },
};

const faqs = [
  {
    q: "Borsa İstanbul seansı saat kaçta açılıp kapanıyor?",
    a: "Pay piyasasında sürekli işlem hafta içi 10.00'da başlar ve kapanış işlemleriyle birlikte 18.10 civarında sona erer. Hafta sonu ve resmî tatillerde işlem yapılmaz; tablo bu saatlerde son kapanış fiyatlarını gösterir.",
  },
  {
    q: "Buradaki fiyatlar anlık mı?",
    a: "Fiyatlar dakikada bir yenilenir ve veri sağlayıcının yayınında kısa bir gecikme olabilir. Emir vermeden önce aracı kurumunuzun kendi ekranındaki fiyatı esas alın.",
  },
  {
    q: "Yükselenler ve düşenler neye göre sıralanıyor?",
    a: "Listede yer alan hisseler, önceki kapanışa göre yüzde değişimlerine göre sıralanır. Tablodan işlem hacmine, fiyata veya isme göre de sıralayabilirsiniz.",
  },
  {
    q: "Hisse alım satımında hangi masraflar var?",
    a: "Aracı kurum komisyonu, BSMV ve borsa payı işlem tutarına eklenir. Kâr veya zararınızı hesaplarken bu masrafları da dikkate alın; alış ve satış arasındaki farkın tamamı net kâr değildir.",
  },
];

export default async function StockMarketPage() {
  const data = await fetchStocks();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Canlı Borsa: BIST 100 ve Hisse Fiyatları",
      url: `${SITE_URL}/borsa`,
      inLanguage: "tr-TR",
      ...(data?.marketTime ? { dateModified: data.marketTime } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="page">
      <div className="container rates-page market-page">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Canlı Borsa" }]} />

        <p className="eyebrow">BORSA İSTANBUL</p>
        <h1>Canlı Borsa: BIST 100 ve Hisse Fiyatları</h1>
        <p className="page-lead">
          BIST 100, BIST 30 ve bankacılık endeksi ile en çok işlem gören hisselerin
          güncel fiyatları, günlük işlem aralığı ve hacmi. Tablo sayfa açıkken
          dakikada bir kendiliğinden yenilenir.
        </p>

        <section className="rates-block">
          <StockBoard initial={data} />
          <p className="rates-source">
            Veri:{" "}
            <a href={STOCK_SOURCE.url} target="_blank" rel="noopener noreferrer">
              {STOCK_SOURCE.label}
            </a>
            {" · "}
            <Link href="/altin-fiyatlari">Altın fiyatları</Link>
            {" · "}
            <Link href="/doviz-kurlari">Döviz kurları</Link>
          </p>
        </section>

        <section className="lt-section">
          <h2>Endeks ne anlama geliyor?</h2>
          <p>
            BIST 100, Borsa İstanbul&apos;da işlem gören en yüksek piyasa değerine ve
            işlem hacmine sahip 100 şirketin performansını gösterir. BIST 30 aynı
            mantıkla ilk 30 şirketi, bankacılık endeksi ise yalnızca banka
            hisselerini izler. Endeksin yüzde değişimi, piyasanın o gün genel olarak
            hangi yönde hareket ettiğini özetler.
          </p>
          <h2>Fiyat dışında nelere bakmalı?</h2>
          <p>
            Günlük işlem aralığı (en düşük – en yüksek) hissenin gün içinde ne kadar
            oynadığını, işlem hacmi ise o fiyat hareketinin ne kadar güçlü bir
            katılımla oluştuğunu gösterir. Düşük hacimli sert hareketler daha kırılgan
            olabilir. Birikiminizin enflasyon karşısındaki durumunu{" "}
            <Link href="/hesaplamalar/enflasyon">enflasyon hesaplama</Link>, mevduatla
            karşılaştırmasını ise{" "}
            <Link href="/hesaplamalar/mevduat">mevduat faizi hesaplama</Link> aracıyla
            görebilirsiniz.
          </p>
        </section>

        <section className="rates-block">
          <h2>Sık sorulan sorular</h2>
          <div className="faq-list" style={{ margin: 0, maxWidth: "none" }}>
            {faqs.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="notice notice-warn">
          <strong>Bilgilendirme:</strong> Fiyatlar bilgi amaçlıdır, gecikmeli olabilir
          ve yatırım tavsiyesi değildir. Yatırım kararlarınızda aracı kurumunuzun
          verilerini ve yetkili uzman görüşünü esas alın.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
