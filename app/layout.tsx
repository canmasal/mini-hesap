import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ledger.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AdSenseScript from "@/components/AdSenseScript";
import ChatWidget from "@/components/ChatWidget";

const adsenseClientId =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
  "ca-pub-5744638110984506";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://minihesap.net"
  ),

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

    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://minihesap.net",
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
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://minihesap.net";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MiniHesap",
  url: siteUrl,
  inLanguage: "tr-TR",
  description:
    "Net maaş, kıdem tazminatı, KDV, yüzde ve daha fazlası için ücretsiz online hesaplama araçları.",
  publisher: {
    "@type": "Organization",
    name: "MiniHesap",
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
      <body>
        <a className="skip-link" href="#icerik">
          İçeriğe atla
        </a>

        <Header />

        <div id="icerik">{children}</div>

        <Footer />

        <CookieConsent />
        <AdSenseScript />
        <ChatWidget />

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