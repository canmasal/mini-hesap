import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "MiniHesap ile iletişime geçin: hata bildirimi, yeni hesaplama aracı önerisi, premium ürün desteği, reklam ve iş birliği talepleri.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "İletişim" }]}
        />

        <p className="eyebrow">MİNİHESAP</p>
        <h1>İletişim</h1>

        <p className="page-lead">
          Sorunuz, öneriniz veya hata bildiriminiz mi var? Aşağıdaki formu
          doldurun; en kısa sürede dönüş yapalım.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
            marginTop: 28,
          }}
        >
          {[
            {
              icon: "🐞",
              title: "Hata bildirimi",
              text: "Yanlış çıktığını düşündüğünüz bir hesaplamayı girdilerle birlikte bildirin.",
            },
            {
              icon: "💡",
              title: "Araç önerisi",
              text: "Eklememizi istediğiniz yeni bir hesaplama aracı var mı?",
            },
            {
              icon: "🤝",
              title: "Reklam & iş birliği",
              text: "Sponsorluk ve reklam alanları için bize yazın.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: 18,
                borderRadius: "var(--r-md)",
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              <div style={{ fontSize: 24 }} aria-hidden="true">
                {item.icon}
              </div>
              <strong style={{ display: "block", marginTop: 8 }}>
                {item.title}
              </strong>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "var(--muted)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <ContactForm contactEmail={contactEmail} />

        <p className="notice">
          Kişisel verilerinizin nasıl işlendiğini{" "}
          <Link href="/gizlilik" style={{ fontWeight: 700 }}>
            Gizlilik Politikası
          </Link>{" "}
          sayfasında bulabilirsiniz. Hesaplama sonuçlarının bağlayıcı olmadığına
          dair bilgi için{" "}
          <Link href="/kullanim-sartlari" style={{ fontWeight: 700 }}>
            Kullanım Şartları
          </Link>
          ’na göz atın.
        </p>
      </div>
    </main>
  );
}
