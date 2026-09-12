"use client";

import { useState } from "react";

type Result = { requestId: string; summary: string; questions: string[] };

export default function ProgramRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/program-talebi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, description, website: "" }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Talep gönderilemedi.");
      setResult(payload);
      setName("");
      setEmail("");
      setDescription("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Talep gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="calc-box" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="program-name">
          Ad Soyad *
          <input id="program-name" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="field" htmlFor="program-email">
          E-posta *
          <input id="program-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
      </div>

      <label className="field" htmlFor="program-description" style={{ marginTop: 18 }}>
        Nasıl bir program istiyorsunuz? *
        <textarea
          id="program-description"
          rows={8}
          minLength={20}
          maxLength={4000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Örn. Küçük işletmem için stok, gelir-gider ve müşteri takibi yapan basit bir program istiyorum..."
          required
        />
        <span className="field-hint">{description.length}/4000 · Kişisel veya finansal sırlarınızı yazmayın.</span>
      </label>

      <button className="btn btn-green" type="submit" disabled={loading} style={{ marginTop: 20 }}>
        {loading ? "Talebiniz inceleniyor..." : "AI ile talep oluştur"}
      </button>

      {error && <div className="notice notice-warn" role="alert">{error}</div>}
      {result && (
        <div className="notice notice-ok" role="status">
          <strong>Talebiniz alındı: {result.requestId}</strong>
          <p>{result.summary}</p>
          <p><strong>Netleştirmemiz faydalı olacak noktalar:</strong></p>
          <ul>{result.questions.map((question) => <li key={question}>{question}</li>)}</ul>
        </div>
      )}
    </form>
  );
}