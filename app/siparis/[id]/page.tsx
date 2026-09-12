import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { findPurchasable } from "@/data/plans";
import { getOrderStore } from "@/lib/orders/store";
import { createDownloadToken } from "@/lib/orders/tokens";
import { MAX_DOWNLOADS } from "@/lib/orders/types";
import { havaleInfo } from "@/lib/payments/havale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Siparişiniz",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ durum?: string }>;
}) {
  const { id } = await params;
  const { durum } = await searchParams;

  const order = await getOrderStore().get(id);

  if (!order) {
    return (
      <main className="page">
        <div className="container">
          <h1>Sipariş bulunamadı</h1>
          <p className="page-lead">
            Bu bağlantı geçersiz olabilir. Sorun devam ederse{" "}
            <Link href="/iletisim" style={{ fontWeight: 700 }}>
              bize yazın
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  const product = findPurchasable(order.productSlug);
  const failed = durum === "basarisiz" || order.status === "basarisiz";
  const paid = order.status === "odendi";
  const havale = havaleInfo();

  /* İndirme bağlantıları yalnızca ödenmiş siparişler için, kısa ömürlü
     üretilir. Pakette birden çok dosya olduğundan her dosya için ayrı
     bağlantı çıkarılır; jeton hepsinde ortaktır. */
  let downloads: { label: string; url: string }[] = [];

  if (paid && product) {
    const token = createDownloadToken({
      orderId: order.id,
      productSlug: order.productSlug,
      /* Bağlantı 2 saat geçerli; sayfa yenilenince yenisi üretilir */
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
    });

    const base = `/api/premium/download?product=${encodeURIComponent(
      order.productSlug
    )}&token=${encodeURIComponent(token)}`;

    downloads = product.files.map((file) => ({
      label: file.label,
      url: `${base}&file=${encodeURIComponent(file.fileName)}`,
    }));
  }

  const isBundle = downloads.length > 1;

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Siparişiniz" }]}
        />

        <div style={{ maxWidth: 720 }}>
          {paid && (
            <>
              <div style={{ fontSize: 52 }} aria-hidden="true">
                ✅
              </div>
              <p className="eyebrow">ÖDEME ONAYLANDI</p>
              <h1>Teşekkürler, {order.fullName.split(" ")[0]}!</h1>
              <p className="page-lead">
                <strong>{order.productTitle}</strong> için ödemeniz alındı.
                {isBundle
                  ? ` Paketinizdeki ${downloads.length} dosyayı aşağıdan tek tek indirebilirsiniz.`
                  : " Dosyanızı aşağıdan indirebilirsiniz."}
              </p>

              <div className="order-downloads">
                {downloads.map((item, index) => (
                  <a
                    key={item.url}
                    className={`btn ${index === 0 && !isBundle ? "btn-green" : "btn-ghost"}`}
                    href={item.url}
                  >
                    ⬇ {isBundle ? item.label : "Dosyayı İndir"}
                  </a>
                ))}
              </div>

              <div className="notice notice-ok">
                <strong>İndirme bilgileri.</strong> Bağlantı 2 saat geçerlidir;
                süresi dolarsa bu sayfayı yenilemeniz yeterli. Siparişiniz{" "}
                {order.downloadExpiresAt
                  ? new Date(order.downloadExpiresAt).toLocaleDateString("tr-TR")
                  : "—"}{" "}
                tarihine kadar en fazla {MAX_DOWNLOADS} kez indirilebilir.{" "}
                {order.downloadCount > 0 ? (
                  <>
                    Şu ana kadar {order.downloadCount} kez indirdiniz.
                    {order.firstDownloadedAt && (
                      <>
                        <br />İlk başarılı indirme: {new Date(order.firstDownloadedAt).toLocaleString("tr-TR")}
                      </>
                    )}
                  </>
                ) : (
                  <>Dosya henüz indirilmedi.</>
                )}
              </div>

              <div className="notice">
                <strong>Bu sayfayı kaydedin.</strong> Sipariş numaranız:{" "}
                <code>{order.id}</code>
                <br />
                Bu adresi yer imlerinize ekleyin; dosyanıza tekrar buradan
                ulaşabilirsiniz.
              </div>
            </>
          )}

          {failed && (
            <>
              <div style={{ fontSize: 52 }} aria-hidden="true">
                ⚠️
              </div>
              <p className="eyebrow">ÖDEME TAMAMLANAMADI</p>
              <h1>Ödeme alınamadı</h1>
              <p className="page-lead">
                Kartınızdan tahsilat yapılmadı. Tekrar deneyebilir veya farklı
                bir kartla ödeme yapabilirsiniz.
              </p>

              {product && (
                <Link
                  className="btn btn-green"
                  href={`/satin-al/${product.slug}`}
                  style={{ marginTop: 20 }}
                >
                  Tekrar Dene
                </Link>
              )}
            </>
          )}

          {!paid && !failed && order.provider === "havale" && (
            <>
              <div style={{ fontSize: 52 }} aria-hidden="true">
                🏦
              </div>
              <p className="eyebrow">ÖDEME BEKLENİYOR</p>
              <h1>Siparişiniz alındı</h1>
              <p className="page-lead">
                Son adım: aşağıdaki hesaba havale/EFT yapın. Ödemeniz
                görüldüğünde indirme bağlantınız bu sayfada açılır ve size
                e-posta gönderilir.
              </p>

              <div
                style={{
                  marginTop: 22,
                  padding: 22,
                  borderRadius: "var(--r-lg)",
                  background: "var(--surface)",
                  border: "2px solid var(--brand)",
                }}
              >
                <h2 style={{ marginTop: 0, fontSize: 17 }}>Havale bilgileri</h2>

                <div className="panel-row">
                  <span>Alıcı</span>
                  <span className="amount">{havale.alici}</span>
                </div>

                {havale.banka && (
                  <div className="panel-row">
                    <span>Banka</span>
                    <span className="amount">{havale.banka}</span>
                  </div>
                )}

                <div className="panel-row">
                  <span>IBAN</span>
                  <span
                    className="amount"
                    style={{ fontFamily: "monospace", fontSize: 15 }}
                  >
                    {havale.iban}
                  </span>
                </div>

                <div className="panel-row">
                  <span>Tutar</span>
                  <span
                    className="amount"
                    style={{ fontSize: 19, color: "var(--brand-deep)" }}
                  >
                    {(order.amountKurus / 100).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </span>
                </div>

                <div className="notice notice-warn" style={{ marginTop: 16 }}>
                  <strong>Açıklama kısmına mutlaka yazın:</strong>
                  <div
                    style={{
                      marginTop: 8,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "#fff",
                      border: "1px solid var(--line)",
                      fontFamily: "monospace",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    {order.id}
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 13 }}>
                    Bu numara olmadan ödemenizi siparişinizle
                    eşleştiremeyiz ve teslimat gecikir.
                  </p>
                </div>
              </div>

              <div className="notice">
                Havaleler genelde aynı gün, hafta sonu ve tatillerde ilk iş
                günü onaylanır. Onaylandığında bu sayfayı yenilemeniz
                yeterlidir.
              </div>
            </>
          )}

          {!paid && !failed && order.provider !== "havale" && (
            <>
              <div style={{ fontSize: 52 }} aria-hidden="true">
                ⏳
              </div>
              <p className="eyebrow">ÖDEME BEKLENİYOR</p>
              <h1>Siparişiniz alındı</h1>
              <p className="page-lead">
                Ödemeniz henüz onaylanmadı. Bankanızdan onay geldiğinde bu sayfa
                indirme bağlantınızı gösterecek. Birkaç dakika sonra sayfayı
                yenileyin.
              </p>
            </>
          )}

          <div
            style={{
              marginTop: 30,
              padding: 20,
              borderRadius: "var(--r-md)",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              fontSize: 14,
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: 16 }}>Sipariş özeti</h2>

            <div className="panel-row">
              <span>Ürün</span>
              <span className="amount">{order.productTitle}</span>
            </div>
            <div className="panel-row">
              <span>Tutar</span>
              <span className="amount">
                {(order.amountKurus / 100).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}{" "}
                ₺
              </span>
            </div>
            <div className="panel-row">
              <span>E-posta</span>
              <span className="amount">{order.email}</span>
            </div>
            <div className="panel-row">
              <span>Tarih</span>
              <span className="amount">
                {new Date(order.createdAt).toLocaleString("tr-TR")}
              </span>
            </div>
            <div className="panel-row">
              <span>Durum</span>
              <span className="amount">
                {paid ? "Ödendi" : failed ? "Başarısız" : "Bekliyor"}
              </span>
            </div>
          </div>

          <p style={{ marginTop: 22, fontSize: 14 }}>
            Sorun yaşarsanız sipariş numaranızla birlikte{" "}
            <Link href="/iletisim" style={{ fontWeight: 700 }}>
              iletişim sayfasından
            </Link>{" "}
            yazın.
          </p>
        </div>
      </div>
    </main>
  );
}
