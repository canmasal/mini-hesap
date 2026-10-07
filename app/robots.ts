import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Özel, ödeme ve indirme ulaştırma uç noktaları aramaya kapalı */
      disallow: [
        "/api/",
        "/siparis/",
        "/satin-al/",
        "/private/",
      ],
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
