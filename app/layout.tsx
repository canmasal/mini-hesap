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

  verification: {
    google: "OVmgdhN4SDe_sFELqrsfZd-dBHGw9Yc0mLcYMfCGFaE",
  },

  robots: {
    index: true,
    follow: true,
  },

  // diğer mevcut ayarların...
};