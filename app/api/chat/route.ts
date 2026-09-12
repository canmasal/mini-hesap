import { calculators } from "@/data/calculators";
import { sendChatNotification } from "@/lib/mail/chat-notification";

const recentMessages = new Map<string, number>();

function getIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function fallbackReply(message: string) {
  const text = message.toLocaleLowerCase("tr-TR");

  if (text.includes("maaş") || text.includes("maas")) {
    return "Net maaşınızı hesaplamak için brüt maaş, ay ve varsa kümülatif vergi matrahı bilgisi gerekir. MiniHesap'taki Net Maaş Hesaplama aracını açıp sonucu kontrol edebilirsiniz. Hesap sonucu tahminidir; bordronuz için işvereninizin bordro birimine danışın.";
  }
  if (text.includes("kıdem") || text.includes("kidem") || text.includes("tazminat")) {
    return "Kıdem hesabında çalışma süresi, giydirilmiş brüt ücret ve güncel kıdem tavanı önemlidir. Kıdem Tazminatı Hesaplama aracımızla tahmini sonucu görebilirsiniz. İşten ayrılış nedeni ve resmi kayıtlar sonucu değiştirebilir.";
  }
  if (text.includes("kdv") || text.includes("vergi")) {
    return "KDV hesabında tutarın dahil mi hariç mi olduğu ve uygulanacak oran belirleyicidir. KDV Hesaplama aracında bu iki seçeneği ayrı ayrı inceleyebilirsiniz.";
  }
  if (text.includes("kredi") || text.includes("taksit") || text.includes("faiz")) {
    return "Kredi maliyetini değerlendirirken aylık faiz, vade, toplam geri ödeme ve dosya masraflarını birlikte karşılaştırmak gerekir. Kredi ve taksit araçlarımızla farklı senaryoları deneyebilirsiniz.";
  }
  if (text.includes("hangi araç") || text.includes("hangi hesap") || text.includes("ne kullan")) {
    return `MiniHesap'ta ${calculators.length} hesaplama aracı var. İhtiyacınızı biraz daha anlatırsanız size en uygun aracı önerebilirim. Örneğin maaş, tazminat, KDV, kira, kredi, emeklilik veya günlük bir hesap olabilir.`;
  }

  return "Bunu birlikte netleştirebiliriz. İhtiyacınızı, elinizdeki bilgileri ve ulaşmak istediğiniz sonucu biraz daha anlatır mısınız? Kişisel şifre, kart bilgisi veya özel finansal veri paylaşmayın.";
}

export async function POST(request: Request) {
  const ip = getIp(request);
  const previous = recentMessages.get(ip) || 0;

  if (Date.now() - previous < 1_500) {
    return Response.json({ error: "Bir saniye bekleyip tekrar deneyin." }, { status: 429 });
  }
  recentMessages.set(ip, Date.now());

  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (message.length < 2 || message.length > 1200) {
      return Response.json({ error: "Mesajınızı 2-1200 karakter arasında yazın." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const reply = fallbackReply(message);
      await sendChatNotification({ question: message, answer: reply, ip });
      return Response.json({ reply });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.45,
        max_tokens: 280,
        messages: [
          {
            role: "system",
            content: `Sen MiniHesap Asistanı'sın. Türkçe, sıcak, kısa ve doğal konuş. Kullanıcıya insan olduğunu söyleme; gerektiğinde AI destekli asistan olduğunu açıkça belirt. MiniHesap'taki hesaplama araçlarını öner: ${calculators.map((item) => `${item.title} (/hesaplamalar/${item.slug})`).join(", ")}. Hukuki, mali veya sağlık konusunda kesin hüküm verme; sonucu tahmini olarak çerçevele ve resmi uzman/kurum doğrulaması öner. Şifre, kart ve hassas veri isteme.`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const reply = fallbackReply(message);
      await sendChatNotification({ question: message, answer: reply, ip });
      return Response.json({ reply });
    }
    const payload = await response.json();
    const reply = payload.choices?.[0]?.message?.content?.trim() || fallbackReply(message);
    await sendChatNotification({ question: message, answer: reply, ip });
    return Response.json({ reply });
  } catch (error) {
    console.error("Chat yanıtı üretilemedi:", error);
    return Response.json({ error: "Şu anda yanıt veremiyorum. Lütfen biraz sonra tekrar deneyin." }, { status: 500 });
  }
}