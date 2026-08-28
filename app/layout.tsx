import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000"
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
      "http://localhost:3000",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "MiniHesap | Online Hesaplama Araçları",

    description:
      "Maaş, tazminat, KDV, yüzde ve diğer hesaplamaları hızlıca yapın.",
  },

  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000",
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}