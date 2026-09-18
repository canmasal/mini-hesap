import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import MarketBoard from "@/components/market/MarketBoard";
import StockBoard from "@/components/market/StockBoard";
import { MARKET_SOURCE, fetchMarket } from "@/lib/market";
import { SITE_URL } from "@/lib/site";
import { STOCK_SOURCE, fetchStocks } from "@/lib/stocks";
import AdSlot from "@/components/AdSlot";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Canlı Piyasalar: Altın, Döviz, Borsa | MiniHesap" },
  description:
    "Gram altın, dolar, euro, BIST 100 ve hisse fiyatları tek sayfada. Dakikada bir güncellenen canlı piyasa tabloları, pariteler ve ons altın.",
  alternates: { canonical: "/piyasalar" },
};

export default async function MarketsPage() {
  const [market, stocks] = await Promise.all([fetchMarket(), fetchStocks()]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Canlı Piyasalar",
    url: `${SITE_URL}/piyasalar`,
    inLanguage: "tr-TR",
    ...(market ? { dateModified: market.updatedAt } : {}),
  };

  return (
    <main className="page">
      <div className="container rates-page market-page">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Canlı Piyasalar" }]} />

        <p className="eyebrow">CANLI PİYASALAR</p>
        <h1>Altın, Döviz ve Borsa Tek Sayfada</h1>
        <p className="page-lead">
          Gram altın, çeyrek altın, dolar, euro, pariteler ve BIST hisseleri aynı
          ekranda. Tüm tablolar sayfa açıkken dakikada bir kendiliğinden yenilenir.
        </p>

        <section className="rates-block" id="altin-doviz">
          <h2>Altın ve döviz</h2>
          <MarketBoard initial={market} view="all" />
          <p className="rates-source">
            Veri:{" "}
            <a href={MARKET_SOURCE.url} target="_blank" rel="noopener noreferrer">
              {MARKET_SOURCE.label}
            </a>
            {" · "}
            <Link href="/altin-fiyatlari">Tüm altın fiyatları</Link>
            {" · "}
            <Link href="/doviz-kurlari">Tüm döviz kurları</Link>
          </p>
        </section>

        <section className="rates-block" id="borsa">
          <h2>Borsa İstanbul</h2>
          <StockBoard initial={stocks} />
          <p className="rates-source">
            Veri:{" "}
            <a href={STOCK_SOURCE.url} target="_blank" rel="noopener noreferrer">
              {STOCK_SOURCE.label}
            </a>
            {" · "}
            <Link href="/borsa">Borsa sayfasına git</Link>
          </p>
        </section>

        <AdSlot position="middle" />

        <section className="lt-section">
          <h2>Piyasa rakamlarını hesaplamaya dökün</h2>
          <p>
            Birikiminizin gerçek getirisini görmek için fiyatın yanında enflasyonu ve
            vergiyi de hesaba katmak gerekir.{" "}
            <Link href="/hesaplamalar/mevduat">Mevduat faizi hesaplama</Link> aracı
            stopaj sonrası net getiriyi,{" "}
            <Link href="/hesaplamalar/enflasyon">enflasyon hesaplama</Link> aracı ise
            paranızın alım gücündeki değişimi gösterir. Altın alırken kuyumcu
            farkını{" "}
            <Link href="/altin-fiyatlari#cevirici">altın çevirici</Link> ile
            karşılaştırabilirsiniz.
          </p>
        </section>

        <p className="notice notice-warn">
          <strong>Bilgilendirme:</strong> Fiyatlar bilgi amaçlıdır, gecikmeli olabilir
          ve yatırım tavsiyesi değildir.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
