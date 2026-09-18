import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { MARKET_SOURCE, findQuote, formatPrice, type MarketData } from "@/lib/market";
import { SITE_URL } from "@/lib/site";
import MarketBoard from "./MarketBoard";
import MarketConverter from "./MarketConverter";
import AdSlot from "@/components/AdSlot";

/**
 * /altin-fiyatlari ve /doviz-kurlari sayfalarının ortak şablonu.
 * Fiyatlar sunucuda çizilir (dakikalık ISR), tarayıcıda dakikada bir tazelenir.
 */

type Kind = "gold" | "currency";

const price = (data: MarketData | null, code: string) => {
  const q = findQuote(data, code);
  return q ? `${formatPrice(q.selling)} TL` : "—";
};

function faqs(kind: Kind, data: MarketData | null) {
  const gram = price(data, "GRA");
  const quarter = price(data, "CEYREKALTIN");
  const usd = price(data, "USD");
  const eur = price(data, "EUR");

  if (kind === "gold") {
    return [
      {
        q: "Gram altın bugün kaç TL?",
        a: `Son güncellemeye göre gram altının satış fiyatı ${gram}. Fiyat piyasa açıkken dakikalar içinde değişir; tablo dakikada bir yenilenir.`,
      },
      {
        q: "Çeyrek altın kaç TL?",
        a: `Çeyrek altının güncel satış fiyatı ${quarter}. Çeyrek altın yaklaşık 1,75 gram ağırlığında ve 22 ayardır; kuyumcular işçilik farkı ekleyebilir.`,
      },
      {
        q: "Altında alış ve satış fiyatı ne demek?",
        a: "Satış fiyatı, kuyumcunun size altın sattığı fiyattır; siz bu fiyattan alırsınız. Alış fiyatı, kuyumcunun sizden altın aldığı fiyattır; bozdururken bu fiyat geçerlidir. Aradaki fark makas olarak adlandırılır.",
      },
      {
        q: "Has altın ile gram altın arasındaki fark nedir?",
        a: "Has altın 24 ayar (995 milyem) saf altındır ve toptan piyasada işlem görür. Gram altın genellikle 24 ayar külçe olarak satılır; perakende fiyatına kuyumcu ve darphane payı eklenir.",
      },
      {
        q: "Buradaki fiyatlar kuyumcudakiyle neden farklı?",
        a: "Tablodaki rakamlar piyasa ortalamasıdır. Kuyumcular ziynet altında işçilik, bilezik ve takılarda ayar ve model farkı uygular; bu nedenle gerçek alım satım fiyatı değişebilir.",
      },
    ];
  }

  return [
    {
      q: "Dolar bugün kaç TL?",
      a: `Son güncellemeye göre 1 Amerikan doları satış fiyatı ${usd}. Kur piyasa açıkken sürekli değişir; tablo dakikada bir yenilenir.`,
    },
    {
      q: "Euro kaç TL?",
      a: `1 euronun güncel satış fiyatı ${eur}.`,
    },
    {
      q: "Döviz alış ve satış kuru arasındaki fark nedir?",
      a: "Satış kuru, banka veya döviz bürosunun size döviz sattığı fiyattır. Alış kuru, sizden döviz aldığı fiyattır. Bankalar bu iki kur arasına makas koyar; makas, işlem saatine ve kuruma göre değişir.",
    },
    {
      q: "Bu kurlar bankadaki kurla aynı mı?",
      a: "Hayır. Tablodaki kurlar serbest piyasa ortalamasıdır. Bankalar ve kuyumcular kendi makaslarını uygular; kesin işlem fiyatı için işlem yapacağınız kurumun ekranını esas alın.",
    },
  ];
}

export default function MarketPage({ kind, data }: { kind: Kind; data: MarketData | null }) {
  const isGold = kind === "gold";
  const path = isGold ? "/altin-fiyatlari" : "/doviz-kurlari";
  const title = isGold ? "Canlı Altın Fiyatları" : "Canlı Döviz Kurları";
  const items = faqs(kind, data);

  const cards = isGold
    ? [
        ["Gram altın", "GRA"],
        ["Çeyrek altın", "CEYREKALTIN"],
        ["Cumhuriyet altını", "CUMHURIYETALTINI"],
        ["Gram gümüş", "GUMUS"],
      ]
    : [
        ["Dolar", "USD"],
        ["Euro", "EUR"],
        ["Sterlin", "GBP"],
        ["İsviçre frangı", "CHF"],
      ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url: `${SITE_URL}${path}`,
      inLanguage: "tr-TR",
      ...(data ? { dateModified: data.updatedAt } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="page">
      <div className="container rates-page market-page">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: title }]} />

        <p className="eyebrow">{isGold ? "ALTIN PİYASASI" : "DÖVİZ PİYASASI"}</p>
        <h1>{isGold ? "Canlı Altın Fiyatları: Gram, Çeyrek, Cumhuriyet" : "Canlı Döviz Kurları: Dolar, Euro, Sterlin"}</h1>
        <p className="page-lead">
          {isGold
            ? "Gram altın, çeyrek, yarım, tam ve Cumhuriyet altını ile 22, 18, 14 ayar alış ve satış fiyatları. Tablo sayfa açıkken dakikada bir kendiliğinden yenilenir."
            : "Dolar, euro, sterlin ve diğer yabancı paraların Türk lirası karşısında alış ve satış kurları. Tablo sayfa açıkken dakikada bir kendiliğinden yenilenir."}
        </p>

        <div className="rates-summary">
          {cards.map(([label, code]) => (
            <div key={code}>
              <span>{label}</span>
              <b>{price(data, code)}</b>
            </div>
          ))}
        </div>

        <section className="rates-block">
          <MarketBoard initial={data} view={kind} />
          <p className="rates-source">
            Veri:{" "}
            <a href={MARKET_SOURCE.url} target="_blank" rel="noopener noreferrer">
              {MARKET_SOURCE.label}
            </a>
            {" · "}
            <Link href={isGold ? "/doviz-kurlari" : "/altin-fiyatlari"}>
              {isGold ? "Döviz kurlarına geç" : "Altın fiyatlarına geç"}
            </Link>
          </p>
        </section>

        <section className="rates-block" id="cevirici">
          <h2>{isGold ? "Altın hesaplama: kaç TL eder?" : "Döviz çevirici: TL karşılığı"}</h2>
          <MarketConverter initial={data} />
        </section>

        <AdSlot position="middle" />

        <section className="lt-section">
          {isGold ? (
            <>
              <h2>Altın türleri ve ağırlıkları</h2>
              <p>
                Çeyrek altın yaklaşık 1,75 gram, yarım altın 3,5 gram, tam altın 7 gram
                ağırlığındadır ve üçü de 22 ayardır. Cumhuriyet ve Ata altını 7,2 gram,
                beşli altın ise yaklaşık 36 gramdır. Gram altın 24 ayar külçe olarak
                satılır; bilezik ve takılar çoğunlukla 22 veya 14 ayardır.
              </p>
              <h2>Altın fiyatı neye göre değişir?</h2>
              <p>
                Türkiye&apos;de gram altın fiyatı iki etkene bağlıdır: uluslararası ons
                altın fiyatı (dolar cinsinden) ve dolar/TL kuru. Ons yükseldiğinde ya da
                TL değer kaybettiğinde gram altın pahalanır. Ziynet altınlarında buna
                kuyumcunun işçilik payı eklenir.
              </p>
              <p>
                Altın birikimi için ne kadar getiri elde ettiğinizi görmek isterseniz{" "}
                <Link href="/hesaplamalar/enflasyon">enflasyon hesaplama</Link> aracıyla
                aynı dönemdeki fiyat artışını karşılaştırabilirsiniz.
              </p>
            </>
          ) : (
            <>
              <h2>Kurlar nereden geliyor?</h2>
              <p>
                Tablodaki kurlar serbest piyasa ortalamasını gösterir. Merkez Bankası
                her iş günü 15.30&apos;da gösterge niteliğinde kur yayımlar; bankalar ise
                gün içinde kendi makaslarıyla işlem yapar. Bu nedenle bankadaki kur
                buradakinden birkaç kuruş farklı olabilir.
              </p>
              <h2>Döviz alırken nelere dikkat etmeli?</h2>
              <p>
                Bankalarda döviz alış işlemleri kambiyo vergisine tabi olabilir; mesai
                dışı saatlerde makas genişler. Büyük tutarlarda birkaç kurumun kurunu
                karşılaştırmak maliyeti düşürür. Dövizli birikiminizin getirisini{" "}
                <Link href="/hesaplamalar/mevduat">mevduat faizi hesaplama</Link> aracıyla
                TL mevduatla karşılaştırabilirsiniz.
              </p>
            </>
          )}
        </section>

        <section className="rates-block">
          <h2>Sık sorulan sorular</h2>
          <div className="faq-list" style={{ margin: 0, maxWidth: "none" }}>
            {items.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="notice notice-warn">
          <strong>Bilgilendirme:</strong> Fiyatlar bilgi amaçlıdır ve yatırım tavsiyesi
          değildir. Gerçek işlem fiyatı kuyumcu, banka ve saat dilimine göre farklılık
          gösterebilir.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
