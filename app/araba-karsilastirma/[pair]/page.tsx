import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import CarCompareTool from "@/components/calculators/CarCompareTool";
import { carTree } from "@/data/cars";
import { carPairs, findPair } from "@/data/cars/pairs";
import { pairAnalysis } from "@/lib/cars/analysis";
import { score } from "@/lib/cars/compare";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return carPairs().map((p) => ({ pair: p.slug }));
}

const title = (a: string, b: string) => `${a} mi ${b} mi? Karşılaştırma`;

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const p = findPair(pair);
  if (!p) return { title: "Karşılaştırma bulunamadı" };
  const an = `${p.a.brand} ${p.a.model}`;
  const bn = `${p.b.brand} ${p.b.model}`;
  return {
    title: title(an, bn),
    description: `${an} ve ${bn} karşılaştırması: fiyat, beygir, tork, yakıt tüketimi, bagaj hacmi ve ölçüler yan yana. Hangisi daha mantıklı?`,
    alternates: { canonical: `/araba-karsilastirma/${p.slug}` },
  };
}

export default async function CarPairPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const p = findPair(pair);
  if (!p) notFound();

  const an = `${p.a.brand} ${p.a.model}`;
  const bn = `${p.b.brand} ${p.b.model}`;
  const analysis = pairAnalysis(p.a, p.b);
  const s = score(p.a, p.b);
  const others = carPairs().filter((x) => x.slug !== p.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title(an, bn),
    url: `${SITE_URL}/araba-karsilastirma/${p.slug}`,
    inLanguage: "tr-TR",
    about: [
      { "@type": "Car", name: `${an} ${p.a.version}`, brand: { "@type": "Brand", name: p.a.brand } },
      { "@type": "Car", name: `${bn} ${p.b.version}`, brand: { "@type": "Brand", name: p.b.brand } },
    ],
  };

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Araba Kıyaslama", href: "/hesaplamalar/araba-kiyaslama" },
            { label: `${an} vs ${bn}` },
          ]}
        />
        <h1>{an} mi {bn} mi?</h1>
        <p className="page-lead">
          {an} ({p.a.version}) ile {bn} ({p.b.version}) fiyat, motor, tüketim ve ölçüler açısından yan yana.
          Karşılaştırılabilen {s.aWins + s.bWins} özelliğin {s.aWins} tanesinde {an}, {s.bWins} tanesinde {bn} önde.
        </p>

        <div id="hesaplama">
          <CarCompareTool tree={carTree()} initialA={p.a} initialB={p.b} syncUrl={false} />
        </div>

        {analysis.length > 0 && (
          <div className="prose" style={{ maxWidth: 850 }}>
            <h2>Değerlendirme</h2>
            {analysis.map((x) => (
              <div key={x.heading}>
                <h3>{x.heading}</h3>
                <p>{x.text}</p>
              </div>
            ))}
            <p>
              Bu değerlendirme üreticilerin teknik verilerinden ve liste fiyatlarından otomatik olarak çıkarılır. Sürüş
              keyfi, donanım listesi, servis ağı ve ikinci el değeri gibi etkenleri de göz önünde bulundurun; toplam
              maliyeti görmek için{" "}
              <Link href="/hesaplamalar/arac-karsilastirma">Araç Karşılaştırma (Toplam Maliyet)</Link> aracını kullanın.
            </p>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <AdSlot position="middle" />
        </div>

        {others.length > 0 && (
          <section className="prose" style={{ maxWidth: 850 }}>
            <h2>Diğer popüler karşılaştırmalar</h2>
            <ul>
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/araba-karsilastirma/${o.slug}`}>
                    {o.a.brand} {o.a.model} mi {o.b.brand} {o.b.model} mi?
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
