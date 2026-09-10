"use client";

import { useId, useMemo, useState } from "react";

import CalculatorCard from "@/components/CalculatorCard";
import { calculators, categories, type CategoryId } from "@/data/calculators";

/** /hesaplamalar/[slug] altında olmayan, kendi sayfası olan araçlar */
const financeTools = [
  {
    slug: "borc-takip",
    href: "/borc-takip",
    icon: "🏦",
    title: "Banka Borç Takip",
    category: "finans" as const,
    keywords: ["borç", "banka", "kredi kartı", "limit", "nakit avans"],
    description:
      "Banka, kredi kartı ve nakit avans borçlarınızı tek tabloda takip edin. Toplam borç, limit ve kullanılabilir limitinizi görün.",
    cta: "Borç Takip Et",
  },
  {
    slug: "on-muhasebe",
    href: "/on-muhasebe",
    icon: "📊",
    title: "Ön Muhasebe Takip",
    category: "finans" as const,
    keywords: ["gelir", "gider", "kdv", "cari", "muhasebe", "fatura"],
    description:
      "Gelir, gider, KDV, belge, cari ve ödeme bilgilerinizi takip edin. Aylık ve yıllık finansal özetinizi görüntüleyin.",
    cta: "Ön Muhasebeyi Aç",
  },
];

type Item = {
  slug: string;
  href: string;
  icon: string;
  title: string;
  category: string;
  keywords: readonly string[];
  description: string;
  cta: string;
  badge?: string;
};

const allItems: Item[] = [
  ...calculators.map((item) => ({
    slug: item.slug,
    href: `/hesaplamalar/${item.slug}`,
    icon: item.icon,
    title: item.title,
    category: item.category as string,
    keywords: item.keywords,
    description: item.description,
    cta: "Hesapla",
  })),
  ...financeTools.map((tool) => ({
    ...tool,
    badge: "MİNİHESAP FİNANS ARACI",
  })),
];

/** Türkçe karakterleri sadeleştirip küçük harfe indirger (arama için) */
function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();
}

export default function CalculatorExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const searchId = useId();

  const results = useMemo(() => {
    const q = normalize(query);

    return allItems.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category;

      if (!matchesCategory) return false;
      if (!q) return true;

      const haystack = normalize(
        `${item.title} ${item.description} ${item.keywords.join(" ")}`
      );

      return haystack.includes(q);
    });
  }, [query, category]);

  return (
    <div>
      <div className="toolbar">
        <label className="visually-hidden" htmlFor={searchId}>
          Hesaplama aracı ara
        </label>

        <input
          id={searchId}
          className="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="🔍 Araç ara: maaş, kdv, kıdem, kredi..."
          autoComplete="off"
        />
      </div>

      <div className="chip-row" role="group" aria-label="Kategori filtresi">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        style={{
          textAlign: "center",
          margin: "20px 0 0",
          color: "var(--muted)",
          fontSize: 14,
        }}
      >
        {results.length} araç listeleniyor
      </p>

      {results.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            “{query}” için sonuç bulunamadı.
          </p>
          <p style={{ margin: "8px 0 16px" }}>
            Farklı bir kelime deneyin veya filtreyi sıfırlayın.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <div className="cards">
          {results.map((item) => (
            <CalculatorCard
              key={item.slug}
              href={item.href}
              icon={item.icon}
              title={item.title}
              description={item.description}
              cta={item.cta}
              badge={item.badge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
