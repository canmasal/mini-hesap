import { randomUUID } from "crypto";

import { analyzeProgramRequest } from "@/lib/ai/program-request";
import { sendProgramRequestNotification } from "@/lib/mail/program-request";
import { getProgramRequestStore } from "@/lib/requests/store";
import type { ProgramRequest } from "@/lib/requests/types";

const recentRequests = new Map<string, number>();

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const previous = recentRequests.get(ip) || 0;

  if (Date.now() - previous < 60_000) {
    return Response.json({ error: "Lütfen yeni bir talep göndermeden önce biraz bekleyin." }, { status: 429 });
  }

  recentRequests.set(ip, Date.now());

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";

    if (honeypot) return Response.json({ ok: true });
    if (name.length < 2 || name.length > 100) {
      return Response.json({ error: "Adınızı kontrol edin." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }
    if (description.length < 20 || description.length > 4000) {
      return Response.json({ error: "Program fikrinizi en az 20, en fazla 4000 karakterle anlatın." }, { status: 400 });
    }

    const analysis = await analyzeProgramRequest(description);
    const requestRecord: ProgramRequest = {
      id: `PRG-${randomUUID().slice(0, 8).toUpperCase()}`,
      name,
      email,
      phone,
      kvkkConsent: body.kvkkConsent === true,
      marketingConsent: body.marketingConsent === true,
      description,
      category: analysis.category,
      aiSummary: analysis.summary,
      aiQuestions: analysis.questions,
      status: "yeni",
      createdAt: new Date().toISOString(),
      ip,
    };

    await getProgramRequestStore().create(requestRecord);
    await sendProgramRequestNotification(requestRecord);

    return Response.json({
      ok: true,
      requestId: requestRecord.id,
      summary: analysis.summary,
      questions: analysis.questions,
    });
  } catch (error) {
    console.error("Program talebi alınamadı:", error);
    return Response.json({ error: "Talebiniz kaydedilemedi. Lütfen tekrar deneyin." }, { status: 500 });
  }
}