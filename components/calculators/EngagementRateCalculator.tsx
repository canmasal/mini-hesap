"use client";

import { useMemo, useState } from "react";

import { engagementRate } from "@/lib/calculations/newTools";
import ResultRow, { percent } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

export default function EngagementRateCalculator() {
  const [followers, setFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [saves, setSaves] = useState("");
  const [reach, setReach] = useState("");
  const [posts, setPosts] = useState("1");

  const result = useMemo(
    () =>
      engagementRate({
        followers: n(followers),
        likes: n(likes),
        comments: n(comments),
        shares: n(shares),
        saves: n(saves),
        reach: n(reach),
        posts: n(posts),
      }),
    [followers, likes, comments, shares, saves, reach, posts],
  );

  const field = (label: string, value: string, set: (v: string) => void, placeholder = "", hint?: string) => (
    <label className="field">
      {label}
      <input type="number" inputMode="numeric" min="0" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );

  return (
    <div className="calc-box">
      <div className="form-grid">
        {field("Takipçi sayısı", followers, setFollowers, "20000")}
        {field("Beğeni", likes, setLikes, "850")}
        {field("Yorum", comments, setComments, "40")}
        {field("Paylaşım", shares, setShares, "15")}
        {field("Kaydetme", saves, setSaves, "30")}
        {field("Erişim (isteğe bağlı)", reach, setReach, "12000", "Gönderiyi gören tekil hesap sayısı")}
        {field("Gönderi sayısı", posts, setPosts, "1", "Birden fazla gönderinin toplamını girdiyseniz sayısını yazın")}
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Etkileşim oranı (takipçiye göre)" value={percent(result.byFollowers)} highlight hint={`Değerlendirme: ${result.level}`} />
          {result.byReach !== null && (
            <ResultRow label="Etkileşim oranı (erişime göre)" value={percent(result.byReach)} />
          )}
          <ResultRow label="Gönderi başına etkileşim" value={result.perPost.toLocaleString("tr-TR")} hint={`Toplam ${result.interactions.toLocaleString("tr-TR")} etkileşim / ${result.posts} gönderi`} />
          <div className="notice">
            Değerlendirme aralıkları (%1 altı düşük, %1–3 ortalama, %3–6 iyi, %6 üstü çok yüksek)
            kaba bir rehberdir. Küçük hesaplarda oran doğal olarak daha yüksek, büyük hesaplarda
            daha düşük çıkar; en doğru kıyas, aynı platformda benzer büyüklükteki hesaplarla yapılır.
          </div>
        </div>
      ) : (
        <div className="calc-hint">Takipçi sayınızı ve gönderinin beğeni, yorum, paylaşım sayılarını girin.</div>
      )}
    </div>
  );
}
