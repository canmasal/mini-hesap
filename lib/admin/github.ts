/**
 * Panelde yapılan içerik değişiklikleri GitHub deposuna commit olarak yazılır;
 * Vercel yeni commit'i derleyip yayınlar. Derleme hata verirse Vercel eski
 * sürümü yayında tutar, site bozulmaz.
 *
 * Ortam değişkenleri:
 *   GITHUB_TOKEN          → yalnızca bu depoda "Contents: Read and write"
 *                           yetkili, ince taneli (fine-grained) erişim anahtarı
 *   GITHUB_REPO           → varsayılan "canmasal/mini-hesap"
 *   GITHUB_BRANCH         → varsayılan "main"
 *   VERCEL_DEPLOY_HOOK_URL→ isteğe bağlı; commit sonrası yayını garantiye almak için
 */

const API = "https://api.github.com";

function config() {
  return {
    token: process.env.GITHUB_TOKEN ?? "",
    repo: process.env.GITHUB_REPO || "canmasal/mini-hesap",
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

export function githubEnabled() {
  return config().token.length > 0;
}

function headers() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config().token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "minihesap-yonetim",
  };
}

function contentsUrl(path: string) {
  const { repo } = config();
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${API}/repos/${repo}/contents/${encoded}`;
}

export type RepoFile = { content: string; sha: string };

export async function readRepoFile(path: string): Promise<RepoFile> {
  const { branch } = config();
  const res = await fetch(`${contentsUrl(path)}?ref=${encodeURIComponent(branch)}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub'dan dosya okunamadı (${res.status}). GITHUB_TOKEN yetkisini kontrol edin.`);
  }
  const data = (await res.json()) as { content?: string; sha: string; encoding?: string };
  if (!data.content) throw new Error("Dosya içeriği alınamadı (dosya çok büyük olabilir).");
  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

export async function writeRepoFile(path: string, content: string, sha: string, message: string) {
  const { branch } = config();
  const res = await fetch(contentsUrl(path), {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      sha,
      branch,
    }),
    cache: "no-store",
  });

  if (res.status === 409 || res.status === 422) {
    throw new Error("Dosya siz düzenlerken başka bir yerden değişmiş. Sayfayı yenileyip tekrar deneyin.");
  }
  if (!res.ok) {
    throw new Error(`GitHub'a kaydedilemedi (${res.status}).`);
  }

  const data = (await res.json()) as { commit?: { sha?: string; html_url?: string } };
  await triggerDeployHook();
  return { commitSha: data.commit?.sha ?? "", commitUrl: data.commit?.html_url ?? "" };
}

async function triggerDeployHook() {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, { method: "POST", cache: "no-store" });
  } catch {
    /* Webhook zaten tetiklenmiş olabilir; hata kaydı panelde gösterilmez */
  }
}

export type RecentCommit = { sha: string; message: string; date: string; url: string };

export async function recentCommits(limit = 8): Promise<RecentCommit[]> {
  const { repo, branch } = config();
  const res = await fetch(
    `${API}/repos/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=${limit}`,
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = (await res.json()) as {
    sha: string;
    html_url: string;
    commit: { message: string; author?: { date?: string } };
  }[];
  return rows.map((r) => ({
    sha: r.sha.slice(0, 7),
    message: r.commit.message.split("\n")[0],
    date: r.commit.author?.date ?? "",
    url: r.html_url,
  }));
}
