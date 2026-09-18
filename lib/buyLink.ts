/**
 * Satın alma bağlantısı.
 *
 * Ürünlerin ödemesi Shopier mağazasından (shopier.com/miniihesap) alınır.
 * Shopier'de karşılığı açılmış her kalem doğrudan kendi ürün sayfasına gider;
 * henüz açılmamış olanlar site içindeki /satin-al akışında kalır, böylece
 * mağazaya ürün eklendikçe tek satır veri değişikliğiyle devreye girerler.
 */

export type Buyable = {
  slug: string;
  /** Shopier ürün sayfası; tanımlıysa satın alma oraya yönlenir */
  shopierUrl?: string;
};

/** Butonun gideceği adres */
export const buyHref = (item: Buyable) => item.shopierUrl ?? `/satin-al/${item.slug}`;

/** Adres site dışına çıkıyor mu (yeni sekme ve rel gerekir) */
export const isExternalBuy = (item: Buyable) => Boolean(item.shopierUrl);

/** Site dışı bağlantılarda kullanılacak ortak nitelikler */
export const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" } as const;
