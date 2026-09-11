import { promises as fs } from "fs";
import path from "path";

import type { Order, OrderStore } from "./types";

/**
 * Sipariş deposu.
 *
 * Geliştirme ve tek sunucu kurulumlarında dosya tabanlı depo kullanılır.
 * Vercel gibi sunucusuz ortamlarda dosya sistemi kalıcı olmadığı için
 * Supabase (Postgres) deposu devreye girer; ortam değişkenleri tanımlıysa
 * otomatik seçilir.
 */

/* =========================================================
   DOSYA TABANLI DEPO
========================================================= */

class FileOrderStore implements OrderStore {
  private file = path.join(process.cwd(), "private", "orders.json");

  private async readAll(): Promise<Order[]> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async writeAll(orders: Order[]) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(orders, null, 2), "utf8");
  }

  async create(order: Order) {
    const all = await this.readAll();
    all.unshift(order);
    await this.writeAll(all);
  }

  async get(id: string) {
    const all = await this.readAll();
    return all.find((o) => o.id === id) ?? null;
  }

  async findByProviderRef(ref: string) {
    const all = await this.readAll();
    return all.find((o) => o.providerRef === ref) ?? null;
  }

  async update(id: string, patch: Partial<Order>) {
    const all = await this.readAll();
    const i = all.findIndex((o) => o.id === id);
    if (i === -1) return null;

    all[i] = { ...all[i], ...patch };
    await this.writeAll(all);
    return all[i];
  }

  async list(limit = 100) {
    const all = await this.readAll();
    return all.slice(0, limit);
  }
}

/* =========================================================
   SUPABASE (POSTGREST) DEPOSU
   Ek paket gerektirmemesi için REST arayüzü doğrudan kullanılır.
========================================================= */

class SupabaseOrderStore implements OrderStore {
  constructor(
    private url: string,
    private key: string
  ) {}

  private endpoint(qs = "") {
    return `${this.url}/rest/v1/orders${qs}`;
  }

  private headers(extra: Record<string, string> = {}) {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async create(order: Order) {
    const res = await fetch(this.endpoint(), {
      method: "POST",
      headers: this.headers({ Prefer: "return=minimal" }),
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      throw new Error(`Sipariş kaydedilemedi (${res.status})`);
    }
  }

  private async first(qs: string): Promise<Order | null> {
    const res = await fetch(this.endpoint(qs), { headers: this.headers() });
    if (!res.ok) return null;

    const rows = (await res.json()) as Order[];
    return rows[0] ?? null;
  }

  async get(id: string) {
    return this.first(`?id=eq.${encodeURIComponent(id)}&limit=1`);
  }

  async findByProviderRef(ref: string) {
    return this.first(`?providerRef=eq.${encodeURIComponent(ref)}&limit=1`);
  }

  async update(id: string, patch: Partial<Order>) {
    const res = await fetch(
      this.endpoint(`?id=eq.${encodeURIComponent(id)}`),
      {
        method: "PATCH",
        headers: this.headers({ Prefer: "return=representation" }),
        body: JSON.stringify(patch),
      }
    );

    if (!res.ok) return null;
    const rows = (await res.json()) as Order[];
    return rows[0] ?? null;
  }

  async list(limit = 100) {
    const res = await fetch(
      this.endpoint(`?order=createdAt.desc&limit=${limit}`),
      { headers: this.headers() }
    );

    if (!res.ok) return [];
    return (await res.json()) as Order[];
  }
}

/* =========================================================
   SEÇİM
========================================================= */

let cached: OrderStore | null = null;

export function getOrderStore(): OrderStore {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  cached = url && key ? new SupabaseOrderStore(url, key) : new FileOrderStore();

  return cached;
}

/** Hangi deponun kullanıldığı (yönetim ekranında göstermek için). */
export function orderStoreKind() {
  return process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? "supabase"
    : "dosya";
}
