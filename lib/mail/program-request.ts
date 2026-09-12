import type { ProgramRequest } from "@/lib/requests/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendProgramRequestNotification(request: ProgramRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.PROGRAM_REQUEST_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  if (!apiKey || !from || !to) return { sent: false, reason: "yapilandirilmadi" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: request.email,
        subject: `[MiniHesap] Yeni program talebi: ${request.id}`,
        html: `<div style="font-family:system-ui;line-height:1.7;color:#10231a"><h2>Yeni program talebi</h2><p><strong>Talep no:</strong> ${escapeHtml(request.id)}</p><p><strong>Ad:</strong> ${escapeHtml(request.name)}</p><p><strong>E-posta:</strong> ${escapeHtml(request.email)}</p><p><strong>Kategori:</strong> ${escapeHtml(request.category)}</p><p><strong>Talep:</strong><br>${escapeHtml(request.description).replaceAll("\n", "<br>")}</p><p><strong>AI özeti:</strong><br>${escapeHtml(request.aiSummary)}</p></div>`,
      }),
    });

    return { sent: response.ok };
  } catch {
    return { sent: false, reason: "istisna" };
  }
}