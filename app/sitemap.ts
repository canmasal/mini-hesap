import type { MetadataRoute } from "next";

import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { longtailPages } from "@/data/longtail";
import { SITE_URL } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, changeFrequency: Entry["changeFrequency"], priority: number): Entry => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("", "weekly", 1),
    page("/hesaplamalar", "weekly", 0.9),
    page("/rehber", "weekly", 0.9),

    /* Hesaplama araçları: sitenin ana arama trafiği bu sayfalardan gelir */
    ...calculators.map((c) => page(`/hesaplamalar/${c.slug}`, "monthly", 0.9)),

    /* Rehber yazıları */
    ...guides.map((g) => page(`/rehber/${g.slug}`, "monthly", 0.8)),

    /* Uzun kuyruklu hazır hesap sayfaları (ör. "30.000 TL brüt ne kadar net") */
    ...longtailPages.map((p) => page(`/hesapla/${p.slug}`, "monthly", 0.6)),

    page("/borc-takip", "weekly", 0.8),
    page("/on-muhasebe", "weekly", 0.8),
    page("/premium", "weekly", 0.8),
    page("/premium/borc-takip", "monthly", 0.6),
    page("/premium/on-muhasebe", "monthly", 0.6),
    page("/program-talebi", "monthly", 0.7),
    page("/hakkimizda", "monthly", 0.5),
    page("/iletisim", "monthly", 0.4),
    page("/pazarlama-iletisimi", "yearly", 0.2),
    page("/gizlilik", "yearly", 0.2),
    page("/on-bilgilendirme", "yearly", 0.2),
    page("/mesafeli-satis-sozlesmesi", "yearly", 0.2),
    page("/iade-kosullari", "yearly", 0.3),
    page("/kullanim-sartlari", "yearly", 0.2),
  ];
}
