import type { MetadataRoute } from "next";

import { calculators } from "@/data/calculators";
import { premiumProducts } from "@/data/premiumProducts";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = ([
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/hesaplamalar`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/borc-takip`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/on-muhasebe`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/premium`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/iletisim`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/gizlilik`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/on-bilgilendirme`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/mesafeli-satis-sozlesmesi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/iade-kosullari`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${baseUrl}/kullanim-sartlari`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ] satisfies Omit<MetadataRoute.Sitemap[number], "lastModified">[]).map(
    (page) => ({ ...page, lastModified: now })
  );

  /* Hesaplama sayfaları tek kaynaktan (data/calculators) türetilir */
  const calculatorPages: MetadataRoute.Sitemap = calculators.map(
    (calculator) => ({
      url: `${baseUrl}/hesaplamalar/${calculator.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  /* Kendi tanıtım sayfası olan premium ürünler */
  const premiumPages: MetadataRoute.Sitemap = premiumProducts
    .filter((product) => product.landingPage)
    .map((product) => ({
      url: `${baseUrl}${product.landingPage}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticPages, ...calculatorPages, ...premiumPages];
}
