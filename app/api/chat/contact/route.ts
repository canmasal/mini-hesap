import { randomUUID } from "crypto";

import { getProgramRequestStore } from "@/lib/requests/store";
import type { ProgramRequest } from "@/lib/requests/types";
import { sendChatNotification } from "@/lib/mail/chat-notification";

const recentContacts = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const previous = recentContacts.get(ip) || 0;
  if (Date.now() - previous < 60_000) {
    return Response.json({ error: "Lütfen yeni bir iletişim kaydı göndermeden önce bekleyin." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const kvkkConsent = body.kvkkConsent === true;
    const marketingConsent = body.marketingConsent === true;

    if (name.length < 2 || name.length > 100) return Response.json({ error: "Ad soyadınızı kontrol edin." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return Response.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    if (!/^[\d\s()+-]{10,20}$/.test(phone)) return Response.json({ error: "Geçerli bir telefon numarası girin." }, { status: 400 });
    if (!kvkkConsent) return Response.json({ error: "KVKK aydınlatma metnini okuyup onaylamanız gerekir." }, { status: 400 });

    recentContacts.set(ip, Date.now());
    const requestRecord: ProgramRequest = {
      id: `CHAT-${randomUUID().slice(0, 8).toUpperCase()}`,
      name,
      email,
      phone,
      description: `Sohbet müşteri temsilcisi iletişim talebi. Pazarlama iletişimi izni: ${marketingConsent ? "verildi" : "verilmedi"}.`,
      category: "Müşteri temsilcisi",
      aiSummary: "Ziyaretçi sohbet üzerinden iletişim bilgilerini bıraktı.",
      aiQuestions: [],
      status: "yeni",
      createdAt: new Date().toISOString(),
      ip,
      kvkkConsent,
      marketingConsent,
    };

    await getProgramRequestStore().create(requestRecord);
    await sendChatNotification({
      question: `İletişim formu: ${name}, ${phone}, ${email}. Pazarlama izni: ${marketingConsent ? "Evet" : "Hayır"}.`,
      answer: "Müşteri temsilcisi iletişim talebi kaydedildi.",
      ip,
    });

    return Response.json({ ok: true, requestId: requestRecord.id });
  } catch (error) {
    console.error("Chat iletişim kaydı alınamadı:", error);
    return Response.json({ error: "Bilgileriniz kaydedilemedi. Lütfen tekrar deneyin." }, { status: 500 });
  }
}