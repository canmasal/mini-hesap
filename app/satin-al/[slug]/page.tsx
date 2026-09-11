import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import CheckoutForm from "@/components/CheckoutForm";
import { premiumProducts, findPremiumProduct } from "@/data/premiumProducts";
import { paymentsEnabled } from "@/lib/payments/provider";
import { emailEnabled } from "@/lib/mail/send";

export function generateStaticParams() {
  return premiumProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findPremiumProduct(slug);

  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: `${product.title} — Satın Al`,
    description: product.description,
    alternates: { canonical: `/satin-al/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findPremiumProduct(slug);

  if (!product) notFound();

  const enabled = paymentsEnabled();
  const mail = emailEnabled();

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Premium", href: "/premium" },
            { label: "Satın Al" },
          ]}
        />

        <p className="eyebrow">GÜVENLİ SATIN ALMA</p>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)" }}>
          <span aria-hidden="true">{product.icon}</span> {product.title}
        </h1>

        <p className="page-lead">{product.tagline}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginTop: 10,
            alignItems: "start",
          }}
        >
          <div>
            <CheckoutForm
              productSlug={product.slug}
              productTitle={product.title}
              price={product.price}
              paymentsEnabled={enabled}
              emailEnabled={mail}
            />
          </div>

          <aside
            style={{
              marginTop: 35,
              padding: 24,
              borderRadius: "var(--r-lg)",
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: 18 }}>Bu pakette neler var?</h2>

            <ul
              style={{
                paddingLeft: 18,
                color: "var(--ink-soft)",
                lineHeight: 1.85,
                fontSize: 14,
              }}
            >
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 18 }}>
              <strong>İçerik:</strong> {product.sheets.join(" · ")}
            </p>

            <div className="notice" style={{ marginTop: 18 }}>
              <strong>Teslimat:</strong> Ödeme onaylandıktan hemen sonra
              indirme bağlantınız ekranda görünür{mail ? " ve e-posta adresinize gönderilir" : ""}.
              Siparişiniz 30 gün boyunca en fazla 10 kez indirilebilir.
            </div>

            <p style={{ fontSize: 13, marginTop: 14 }}>
              <Link href="/iade-kosullari" style={{ textDecoration: "underline" }}>
                İptal ve iade koşulları
              </Link>
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
