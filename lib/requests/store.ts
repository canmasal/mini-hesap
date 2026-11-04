import { promises as fs } from "fs";
import path from "path";

import type { ProgramRequest, ProgramRequestStatus } from "./types";

export interface ProgramRequestStore {
  create(request: ProgramRequest): Promise<void>;
  /** En yeniden eskiye */
  list(limit?: number): Promise<ProgramRequest[]>;
  setStatus(id: string, status: ProgramRequestStatus): Promise<boolean>;
}

class FileProgramRequestStore implements ProgramRequestStore {
  private file = path.join(process.cwd(), "private", "program-requests.json");

  private async readAll(): Promise<ProgramRequest[]> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async writeAll(requests: ProgramRequest[]) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(requests, null, 2), "utf8");
  }

  async create(request: ProgramRequest) {
    const requests = await this.readAll();
    requests.unshift(request);
    await this.writeAll(requests);
  }

  async list(limit = 100) {
    return (await this.readAll()).slice(0, limit);
  }

  async setStatus(id: string, status: ProgramRequestStatus) {
    const requests = await this.readAll();
    const item = requests.find((r) => r.id === id);
    if (!item) return false;
    item.status = status;
    await this.writeAll(requests);
    return true;
  }
}

class SupabaseProgramRequestStore implements ProgramRequestStore {
  constructor(
    private url: string,
    private key: string
  ) {}

  async create(request: ProgramRequest) {
    const response = await fetch(`${this.url}/rest/v1/program_requests`, {
      method: "POST",
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Program talebi kaydedilemedi (${response.status})`);
    }
  }

  private headers(extra: Record<string, string> = {}) {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async list(limit = 100) {
    const response = await fetch(
      `${this.url}/rest/v1/program_requests?order=createdAt.desc&limit=${limit}`,
      { headers: this.headers(), cache: "no-store" }
    );
    if (!response.ok) return [];
    return (await response.json()) as ProgramRequest[];
  }

  async setStatus(id: string, status: ProgramRequestStatus) {
    const response = await fetch(
      `${this.url}/rest/v1/program_requests?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: this.headers({ Prefer: "return=minimal" }),
        body: JSON.stringify({ status }),
      }
    );
    return response.ok;
  }
}

let cached: ProgramRequestStore | null = null;

export function getProgramRequestStore() {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  cached = url && key
    ? new SupabaseProgramRequestStore(url, key)
    : new FileProgramRequestStore();

  return cached;
}