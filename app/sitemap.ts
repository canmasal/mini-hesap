import type { MetadataRoute } from "next";

import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { longtailPages } from "@/data/longtail";
import { LAST_VERIFIED } from "@/data/parameters";
import { SITE_URL } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

/*
 * lastModified yalnızca sayfanın gerçekten değiştiği tarihi taşır. Her
 * derlemede bütün sayfalara "şimdi" yazmak Google'ın lastmod bilgisine
 * güvenmemesine yol açıyordu:
 * - rehberler kendi güncellenme tarihini,
 * - hesaplama sayfaları rakamların son doğrulandığı tarihi,
 * - canlı piyasa ve liste sayfaları derleme anını alır,
 * - yasal metinlerde tarih verilmez.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const verified = new Date(`${LAST_VERIFIED}T12:00:00+03:00`);
  const page = (
    path: string,
    changeFrequency: Entry["changeFrequency"],
    priority: number,
    lastModified: Date | null = now,
  ): Entry => ({
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  });

  return [
    page("", "weekly", 1),
    page("/hesaplamalar", "weekly", 0.9),
    page("/rehber", "weekly", 0.9),
    /* Resmî rakamlar sayfası: rakam değiştikçe güncellenir */
    page("/guncel-rakamlar", "weekly", 0.9),
    /* Canlı piyasa sayfaları: fiyatlar dakikalık yenilenir */
    page("/piyasalar", "hourly", 0.9),
    page("/altin-fiyatlari", "hourly", 0.9),
    page("/borsa", "hourly", 0.9),
    page("/doviz-kurlari", "hourly", 0.9),

    /* Hesaplama araçları: sitenin ana arama trafiği bu sayfalardan gelir */
    ...calculators.map((c) => page(`/hesaplamalar/${c.slug}`, "monthly", 0.9, verified)),

    /* Rehber yazıları */
    ...guides.map((g) => page(`/rehber/${g.slug}`, "monthly", 0.8, new Date(`${g.updated}T12:00:00+03:00`))),

    /* Uzun kuyruklu hazır hesap sayfaları (ör. "30.000 TL brüt ne kadar net") */
    ...longtailPages.map((p) => page(`/hesapla/${p.slug}`, "monthly", 0.6, verified)),

    page("/borc-takip", "weekly", 0.8),
    page("/on-muhasebe", "weekly", 0.8),
    page("/premium", "weekly", 0.8),
    page("/premium/borc-takip", "monthly", 0.6, null),
    page("/premium/on-muhasebe", "monthly", 0.6, null),
    page("/program-talebi", "monthly", 0.7, null),
    page("/hakkimizda", "monthly", 0.5, null),
    page("/iletisim", "monthly", 0.4, null),
    page("/pazarlama-iletisimi", "yearly", 0.2, null),
    page("/gizlilik", "yearly", 0.2, null),
    page("/on-bilgilendirme", "yearly", 0.2, null),
    page("/mesafeli-satis-sozlesmesi", "yearly", 0.2, null),
    page("/iade-kosullari", "yearly", 0.3, null),
    page("/kullanim-sartlari", "yearly", 0.2, null),
  ];
}
