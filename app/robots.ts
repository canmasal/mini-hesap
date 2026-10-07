import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /*
       * Arama motorlarına kapalı uç noktalar:
       * - /api/      → sunucu API uç noktaları
       * - /siparis/  → her kullanıcıya özel sipariş sayfaları
       * - /private/  → yetkisiz erişime kapalı içerik
       *
       * /satin-al/* burada yok: o sayfalar generateMetadata'da
       * robots: { index: false } ile kendi kendine kapatılır.
       */
      disallow: [
        "/api/",
        "/siparis/",
        "/private/",
      ],
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
