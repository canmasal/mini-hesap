import type { MetadataRoute } from "next";

import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { LAST_VERIFIED } from "@/data/parameters";
import { SITE_URL } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

/*
 * lastModified yalnızca sayfanın gerçekten değiştiği tarihi taşır. Her
 * derlemede bütün sayfalara "şimdi" yazmak Google'ın lastmod bilgisine
 * güvenmemesine yol açıyordu:
 * - rehberler kendi güncellenme tarihini,
 * - hesaplama sayfaları ve güncel rakamlar, rakamların son doğrulandığı tarihi,
 * - ana sayfa ve listeler, içlerindeki en yeni içeriğin tarihini,
 * - yalnızca canlı piyasa sayfaları derleme anını alır,
 * - yasal metinlerde ve ürün sayfalarında tarih verilmez.
 *
 * Dahil edilmeyen sayfalar:
 * - /api/* → disallow (robots.ts)
 * - /siparis/* → dinamik, index:false (her kullanıcıya özel)
 * - /satin-al/* → checkout akışı, kendi sayfasında index:false
 * - /private/* → disallow (robots.ts)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const istanbul = (iso: string) => new Date(`${iso}T12:00:00+03:00`);
  const verified = istanbul(LAST_VERIFIED);

  /* Tüm rehber sayfalarının en güncel tarihi */
  const latestGuide = istanbul(
    guides.map((g) => g.updated).sort().at(-1) ?? LAST_VERIFIED,
  );

  /* Ana sayfa: rehber veya parametre güncellemesinden hangisi daha yeni */
  const homepageDate = latestGuide > verified ? latestGuide : verified;

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
    /* ── Ana sayfalar ─────────────────────────────────────────────── */
    page("", "weekly", 1.0, homepageDate),
    page("/hesaplamalar", "weekly", 0.95, verified),
    page("/rehber", "weekly", 0.9, latestGuide),
    page("/guncel-rakamlar", "weekly", 0.9, verified),
    page("/piyasalar", "hourly", 0.9),       /* Canlı — derleme anı */
    page("/altin-fiyatlari", "hourly", 0.9), /* Canlı — derleme anı */
    page("/borsa", "hourly", 0.9),           /* Canlı — derleme anı */
    page("/doviz-kurlari", "hourly", 0.9),   /* Canlı — derleme anı */

    /* ── Hesaplama araçları (ana trafik kaynağı) ──────────────────── */
    ...calculators.map((c) =>
      page(`/hesaplamalar/${c.slug}`, "monthly", 0.9, verified),
    ),

    /* ── Rehber yazıları ──────────────────────────────────────────── */
    ...guides.map((g) =>
      page(`/rehber/${g.slug}`, "monthly", 0.85, istanbul(g.updated)),
    ),

    /* Uzun kuyruklu hazır hesap sayfaları (/hesapla/*) noindex olduğu için
       site haritasında yer almaz. */

    /* ── Finans araçları (ücretsiz, üyeliksiz) ────────────────────── */
    page("/borc-takip", "monthly", 0.85, verified),
    page("/on-muhasebe", "monthly", 0.85, verified),

    /* ── Premium & satın alma ─────────────────────────────────────── */
    /* Vitrin sayfaları indekslenir; ödeme akışı (/satin-al/*) index:false */
    page("/premium", "monthly", 0.85, verified),
    page("/premium/borc-takip", "monthly", 0.7, verified),
    page("/premium/on-muhasebe", "monthly", 0.7, verified),

    /* ── Diğer içerik sayfaları ───────────────────────────────────── */
    page("/program-talebi", "monthly", 0.75, null),
    page("/hakkimizda", "monthly", 0.5, null),
    page("/iletisim", "monthly", 0.45, null),
    page("/reklam", "monthly", 0.4, null),

    /* ── Yasal metinler ───────────────────────────────────────────── */
    page("/gizlilik", "yearly", 0.2, null),
    page("/kullanim-sartlari", "yearly", 0.2, null),
    page("/iade-kosullari", "yearly", 0.3, null),
    page("/mesafeli-satis-sozlesmesi", "yearly", 0.2, null),
    page("/on-bilgilendirme", "yearly", 0.2, null),
    page("/pazarlama-iletisimi", "yearly", 0.1, null),
  ];
}
