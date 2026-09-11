import type { NextConfig } from "next";

/**
 * Yayın için güvenlik başlıkları.
 * Reklam ve analitik script'i eklerken CSP ayrıca değerlendirilmelidir.
 */
const securityHeaders = [
  {
    /* Tarayıcı, dosya türünü kendi tahmin etmesin */
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    /* Site başka bir sayfaya iframe ile gömülemesin (clickjacking) */
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    /* Dış sitelere yalnızca alan adı bilgisi gitsin, tam adres gitmesin */
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    /* Site kamera, mikrofon ve konum izni talep etmiyor */
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    /* HTTPS zorunlu (yalnızca HTTPS yayındayken etkili olur) */
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * Derleme çıktısının klasörü.
   *
   * "npm run dev" çalışırken "npm run build" çalıştırılırsa ikisi aynı
   * .next klasörünü paylaşır; build, dev sunucusunun kullandığı JS ve CSS
   * parçalarını siler ve site stilsiz kalır / 500 verir.
   *
   * Bunu önlemek için derlemeyi ayrı klasöre almak üzere:
   *   BUILD_DIR=.next-build npm run build
   */
  distDir: process.env.BUILD_DIR || ".next",

  /* Sunucu sürüm bilgisini yanıt başlığında açık etmeyelim */
  poweredByHeader: false,

  /*
   * Dev sunucusuna yerel ağ IP'sinden (telefon, tablet) erişildiğinde
   * Next.js'in uyarı vermemesi için. Next 16'da bu ayar zorunlu olacak.
   */
  allowedDevOrigins: ["172.19.16.33", "localhost", "127.0.0.1"],

  /*
   * /api/premium/download, private/products altındaki Excel dosyalarını
   * çalışma anında okur. Bu dosyalar hiçbir yerden import edilmediği için
   * Next.js onları sunucu paketine dahil etmez ve canlıda dosya bulunamaz.
   * Aşağıdaki ayar dosyaların dağıtıma kopyalanmasını sağlar.
   */
  outputFileTracingIncludes: {
    "/api/premium/download": ["./private/products/**"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        /* Premium indirme uç noktası hiçbir yerde önbelleğe alınmasın */
        source: "/api/premium/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
