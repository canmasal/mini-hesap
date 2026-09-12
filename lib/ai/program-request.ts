type ProgramAnalysis = {
  category: string;
  summary: string;
  questions: string[];
};

const fallbackAnalysis: ProgramAnalysis = {
  category: "Genel program",
  summary:
    "İsteğiniz, günlük iş akışınızı kolaylaştıracak özel bir program fikri olarak kayda alındı.",
  questions: [
    "Programı en çok hangi cihazda kullanacaksınız?",
    "İlk sürümde mutlaka olması gereken üç özelliği hangileri?",
  ],
};

function cleanAnalysis(value: unknown): ProgramAnalysis {
  if (!value || typeof value !== "object") return fallbackAnalysis;

  const item = value as Partial<ProgramAnalysis>;
  const questions = Array.isArray(item.questions)
    ? item.questions.filter((question): question is string => typeof question === "string").slice(0, 3)
    : [];

  return {
    category: typeof item.category === "string" && item.category.trim()
      ? item.category.trim().slice(0, 80)
      : fallbackAnalysis.category,
    summary: typeof item.summary === "string" && item.summary.trim()
      ? item.summary.trim().slice(0, 500)
      : fallbackAnalysis.summary,
    questions: questions.length ? questions : fallbackAnalysis.questions,
  };
}

export async function analyzeProgramRequest(description: string): Promise<ProgramAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackAnalysis;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Sen MiniHesap ürün danışmanısın. Kullanıcının program fikrini Türkçe olarak kısa ve uygulanabilir biçimde sınıflandır. Sadece JSON döndür: {category:string,summary:string,questions:string[]}. Kod, finansal tavsiye veya hassas veri isteme.",
          },
          { role: "user", content: description },
        ],
      }),
    });

    if (!response.ok) return fallbackAnalysis;
    const payload = await response.json();
    return cleanAnalysis(JSON.parse(payload.choices?.[0]?.message?.content || "{}"));
  } catch {
    return fallbackAnalysis;
  }
}