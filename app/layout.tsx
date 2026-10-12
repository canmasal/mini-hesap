import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ledger.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics, { GoogleTagHead } from "@/components/GoogleAnalytics";
import ChatWidget from "@/components/ChatWidget";
import { ADSENSE_CLIENT_ID as adsenseClientId } from "@/lib/adsense";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "MiniHesap | Online Hesaplama Araçları",
    template:
      "%s | MiniHesap",
  },

  description:
    "Net maaş, kıdem tazminatı, ihbar tazminatı, KDV, yüzde, indirim, kira artışı ve daha fazla hesaplamayı hızlıca yapın.",

  keywords: [
    "hesaplama",
    "hesaplama araçları",
    "net maaş hesaplama",
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı hesaplama",
    "KDV hesaplama",
    "yüzde hesaplama",
    "indirim hesaplama",
    "kira artışı hesaplama",
    "fazla mesai hesaplama",
  ],

  authors: [
    {
      name: "MiniHesap",
    },
  ],

  creator: "MiniHesap",
  publisher: "MiniHesap",

  verification: {
    google:
      "OVmgdhN4SDe_sFELqrsfZd-dBHGw9Yc0mLcYMfCGFaE",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "MiniHesap",

    title:
      "MiniHesap | Online Hesaplama Araçları",

    description:
      "Günlük hayattaki hesaplamalarınızı hızlı ve kolay şekilde yapın.",

    url: SITE_URL,
  },

  twitter: {
    card: "summary_large_image",

    title:
      "MiniHesap | Online Hesaplama Araçları",

    description:
      "Maaş, tazminat, KDV, yüzde ve diğer hesaplamaları hızlıca yapın.",
  },

  alternates: {
    canonical: "/",
  },

  category: "finance",

  applicationName: "MiniHesap",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  other: {
    "google-adsense-account": adsenseClientId,
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

/* Site geneli yapısal veri: WebSite (site adı + arama) ve Organization (marka) */
const siteUrl = SITE_URL;

/*
 * Google "minihesap" aramasında siteyi marka olarak tanısın diye site adı,
 * yazım varyantları ve PNG logo burada tek kimlik (@id) altında verilir.
 * Google logo olarak SVG kabul etmez; bu yüzden /logo.png (512x512) kullanılır.
 * Aynı isimli minihesap.com ile karışmaması için ".net" varyantı da yazılır.
 */
const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "MiniHesap",
  alternateName: ["minihesap", "Mini Hesap", "MiniHesap.net", "minihesap.net"],
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/logo.png`,
  description:
    "MiniHesap; net maaş, kıdem tazminatı, KDV, kredi ve sınav net hesaplama gibi ücretsiz online hesaplama araçları sunan Türkçe web sitesidir.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${siteUrl}/iletisim`,
    availableLanguage: ["Turkish"],
  },
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "MiniHesap",
  alternateName: ["minihesap", "Mini Hesap", "MiniHesap.net"],
  url: `${siteUrl}/`,
  inLanguage: "tr-TR",
  description:
    "Net maaş, kıdem tazminatı, KDV, yüzde ve daha fazlası için ücretsiz online hesaplama araçları.",
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/hesaplamalar?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <GoogleTagHead />
        {/* Google AdSense: onay durumu yukarıdaki Consent Mode ile iletilir */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#icerik">
          İçeriğe atla
        </a>

        <Header />

        <div id="icerik">{children}</div>

        <Footer />

        <CookieConsent />
        <GoogleAnalytics />
        <ChatWidget />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema),
          }}
        />
      </body>
    </html>
  );
}