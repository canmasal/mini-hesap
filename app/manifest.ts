import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MiniHesap | Online Hesaplama Araçları",
    short_name: "MiniHesap",
    description:
      "Net maaş, kıdem tazminatı, KDV, yüzde, kredi ve daha fazlası için ücretsiz hesaplama araçları.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4faf6",
    theme_color: "#16a34a",
    lang: "tr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
