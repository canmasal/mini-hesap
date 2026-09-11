import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * Dev sunucusuna yerel ağ IP'sinden (telefon, tablet) erişildiğinde
   * Next.js'in uyarı vermemesi için. Next 16'da bu ayar zorunlu olacak.
   */
  allowedDevOrigins: [
    "172.19.16.33",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
