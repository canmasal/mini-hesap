import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ledger.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics, { GoogleTagHead } from "@/components/GoogleAnalytics";
import ChatWidget from "@/components/ChatWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

/* Site geneli arama kutusu + kuruluş şeması */
const siteUrl = SITE_URL;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MiniHesap",
  /* Google site adı: aynı isimli minihesap.com (portföy takip sitesi) ile karışmaması için */
  alternateName: ["MiniHesap.net", "Mini Hesap"],
  url: siteUrl,
  inLanguage: "tr-TR",
  description:
    "Net maaş, kıdem tazminatı, KDV, yüzde ve daha fazlası için ücretsiz online hesaplama araçları.",
  publisher: {
    "@type": "Organization",
    name: "MiniHesap",
    alternateName: "MiniHesap.net",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
  },
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
        <SpeedInsights />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </body>
    </html>
  );
}