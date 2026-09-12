import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://minihesap.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Premium indirme uç noktası aramaya kapalı */
      disallow: ["/api/"],
    },

    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
