function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("\n", "<br>");
}

export async function sendChatNotification(input: {
  question: string;
  answer: string;
  ip: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.CHAT_NOTIFY_EMAIL || process.env.PROGRAM_REQUEST_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  if (!apiKey || !from || !to) return { sent: false, reason: "yapilandirilmadi" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "[MiniHesap] Yeni müşteri temsilcisi sorusu",
        html: `<div style="font-family:system-ui;line-height:1.7;color:#10231a"><h2>Yeni sohbet sorusu</h2><p><strong>Ziyaretçi sorusu:</strong><br>${escapeHtml(input.question)}</p><p><strong>Bot yanıtı:</strong><br>${escapeHtml(input.answer)}</p><p style="color:#617066;font-size:12px">IP: ${escapeHtml(input.ip)}</p></div>`,
      }),
    });

    return { sent: response.ok };
  } catch (error) {
    console.error("Chat bildirimi gönderilemedi:", error);
    return { sent: false, reason: "istisna" };
  }
}