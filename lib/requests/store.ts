import { promises as fs } from "fs";
import path from "path";

import type { ProgramRequest } from "./types";

export interface ProgramRequestStore {
  create(request: ProgramRequest): Promise<void>;
}

class FileProgramRequestStore implements ProgramRequestStore {
  private file = path.join(process.cwd(), "private", "program-requests.json");

  async create(request: ProgramRequest) {
    let requests: ProgramRequest[] = [];

    try {
      const raw = await fs.readFile(this.file, "utf8");
      const parsed = JSON.parse(raw);
      requests = Array.isArray(parsed) ? parsed : [];
    } catch {
      requests = [];
    }

    requests.unshift(request);
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(requests, null, 2), "utf8");
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