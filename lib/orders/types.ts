/** Sipariş ve lisans veri modeli. Ödeme sağlayıcısından bağımsızdır. */

export type OrderStatus =
  /** Sipariş oluşturuldu, ödeme bekleniyor */
  | "bekliyor"
  /** Ödeme onaylandı, indirme açık */
  | "odendi"
  /** Ödeme başarısız veya iptal edildi */
  | "basarisiz"
  /** İade edildi, indirme kapatıldı */
  | "iade";

export type Order = {
  /** Kısa, tahmin edilemez sipariş kimliği (URL'de görünür) */
  id: string;
  productSlug: string;
  productTitle: string;
  /** Kuruş cinsinden; kayan nokta hatası olmaması için tam sayı */
  amountKurus: number;
  currency: "TRY";
  email: string;
  fullName: string;
  phone?: string;
  status: OrderStatus;
  /** Ödeme sağlayıcısının kendi referansı */
  providerRef?: string;
  provider: string;
  createdAt: string;
  paidAt?: string;
  /** Kaç kez indirildi (kötüye kullanım takibi) */
  downloadCount: number;
  /** İndirme hakkının bittiği an */
  downloadExpiresAt?: string;
  /** Log ve iade incelemesi için */
  ip?: string;
};

export type NewOrderInput = {
  productSlug: string;
  email: string;
  fullName: string;
  phone?: string;
  ip?: string;
};

/** Sipariş deposu. Dosya tabanlı ve Supabase uygulamaları vardır. */
export interface OrderStore {
  create(order: Order): Promise<void>;
  get(id: string): Promise<Order | null>;
  findByProviderRef(ref: string): Promise<Order | null>;
  update(id: string, patch: Partial<Order>): Promise<Order | null>;
  list(limit?: number): Promise<Order[]>;
}

/** İndirme hakkının satın almadan sonra geçerli olduğu süre */
export const DOWNLOAD_WINDOW_DAYS = 30;

/** Aynı sipariş için izin verilen en fazla indirme sayısı */
export const MAX_DOWNLOADS = 10;
