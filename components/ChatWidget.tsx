"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ChatMessage = { role: "assistant" | "user"; text: string };

const welcome: ChatMessage = {
  role: "assistant",
  text: "Merhaba, ben MiniHesap Asistanı. Maaş, tazminat, KDV, kredi veya başka bir hesaplama hakkında yardımcı olabilirim. Ne hesaplamak istiyorsunuz?",
};

const INTAKE_KEY = "minihesap-chat-intake";

const emptyIntake = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  kvkkConsent: false,
  marketingConsent: false,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [intake, setIntake] = useState(emptyIntake);
  const [intakeError, setIntakeError] = useState("");
  const [intakeLoading, setIntakeLoading] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTAKE_KEY)) setStarted(true);
    } catch {
      /* sessionStorage kapalı olabilir */
    }
  }, []);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;

    setMessage("");
    setMessages((current) => [...current, { role: "user", text }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const payload = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", text: response.ok ? payload.reply : payload.error },
      ]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "Bağlantıda kısa bir sorun oldu. Lütfen tekrar deneyin." }]);
    } finally {
      setLoading(false);
    }
  }

  async function startChat(event: React.FormEvent) {
    event.preventDefault();
    if (intakeLoading) return;

    const firstName = intake.firstName.trim();
    const lastName = intake.lastName.trim();
    if (firstName.length < 2 || lastName.length < 2) {
      setIntakeError("Ad ve soyadınızı kontrol edin.");
      return;
    }

    setIntakeError("");
    setIntakeLoading(true);
    try {
      const response = await fetch("/api/chat/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          phone: intake.phone.trim(),
          email: intake.email.trim(),
          kvkkConsent: intake.kvkkConsent,
          marketingConsent: intake.marketingConsent,
        }),
      });
      const payload = await response.json();
      // 429: bu oturumda kısa süre önce kayıt bırakılmış; sohbeti yine de başlatıyoruz.
      if (!response.ok && response.status !== 429) {
        throw new Error(payload.error || "Bilgileriniz kaydedilemedi.");
      }
      try {
        sessionStorage.setItem(INTAKE_KEY, firstName);
      } catch {
        /* sessionStorage kapalı olabilir */
      }
      setMessages([
        welcome,
        { role: "assistant", text: `Hoş geldiniz ${firstName}. Sorunuzu yazabilirsiniz.` },
      ]);
      setStarted(true);
      setIntake(emptyIntake);
    } catch (error) {
      setIntakeError(error instanceof Error ? error.message : "Bilgileriniz kaydedilemedi.");
    } finally {
      setIntakeLoading(false);
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <section className="chat-panel" aria-label="MiniHesap Asistanı">
          <header className="chat-header">
            <span className="chat-avatar" aria-hidden="true">✦</span>
            <div className="chat-identity">
              <strong>MiniHesap Asistanı</strong>
              <span><i className="chat-online-dot" aria-hidden="true" /> Şu an çevrimiçi · 7/24 yanıt</span>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Sohbeti kapat">×</button>
          </header>

          {!started ? (
            <form className="chat-intake" onSubmit={startChat}>
              <h3>Sohbete başlamadan önce</h3>
              <p>Ekibimizin gerekirse dönüş yapabilmesi için bilgilerinizi paylaşın.</p>

              <div className="chat-intake-card">
                <div className="chat-intake-row">
                  <label className="chat-field">
                    <span>Ad</span>
                    <input
                      value={intake.firstName}
                      onChange={(event) => setIntake({ ...intake, firstName: event.target.value })}
                      placeholder="Ayşe"
                      autoComplete="given-name"
                      required
                    />
                  </label>
                  <label className="chat-field">
                    <span>Soyad</span>
                    <input
                      value={intake.lastName}
                      onChange={(event) => setIntake({ ...intake, lastName: event.target.value })}
                      placeholder="Yılmaz"
                      autoComplete="family-name"
                      required
                    />
                  </label>
                </div>

                <label className="chat-field">
                  <span>Telefon</span>
                  <input
                    value={intake.phone}
                    onChange={(event) => setIntake({ ...intake, phone: event.target.value })}
                    placeholder="+90 5xx xxx xx xx"
                    type="tel"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="chat-field">
                  <span>E-posta</span>
                  <input
                    value={intake.email}
                    onChange={(event) => setIntake({ ...intake, email: event.target.value })}
                    placeholder="ad@sirket.com"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <label className="chat-consent">
                <input
                  type="checkbox"
                  checked={intake.kvkkConsent}
                  onChange={(event) => setIntake({ ...intake, kvkkConsent: event.target.checked })}
                  required
                />
                <span><Link href="/gizlilik" target="_blank">KVKK aydınlatma metnini</Link> okudum; bilgilerimin işlenmesini onaylıyorum.</span>
              </label>

              <label className="chat-consent">
                <input
                  type="checkbox"
                  checked={intake.marketingConsent}
                  onChange={(event) => setIntake({ ...intake, marketingConsent: event.target.checked })}
                />
                <span>Kampanya ve yeni ürün duyurularını e-posta ile almak istiyorum. <Link href="/pazarlama-iletisimi" target="_blank">Bilgi</Link></span>
              </label>

              {intakeError && <small className="chat-intake-error" role="alert">{intakeError}</small>}

              <button type="submit" className="chat-intake-submit" disabled={intakeLoading}>
                {intakeLoading ? "Gönderiliyor..." : "Sohbeti başlat"}
              </button>

              <small className="chat-intake-note">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
                  <path d="M12 2.5 4.5 5.8v5.1c0 4.6 3.2 8.9 7.5 10.1 4.3-1.2 7.5-5.5 7.5-10.1V5.8L12 2.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="m8.9 12.1 2.1 2.1 4.1-4.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Bilgileriniz üçüncü taraflarla paylaşılmaz.
              </small>
            </form>
          ) : (
            <>
              <div className="chat-messages" aria-live="polite">
                {messages.map((item, index) => (
                  <div className={`chat-message chat-message-${item.role}`} key={`${item.role}-${index}`}>
                    {item.text}
                  </div>
                ))}
                {loading && <div className="chat-message chat-message-assistant">Düşünüyorum...</div>}
              </div>

              <form className="chat-form" onSubmit={send}>
                <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Sorunuzu yazın..." maxLength={1200} aria-label="Sohbet mesajı" />
                <button className="btn btn-green" type="submit" disabled={loading || !message.trim()} aria-label="Mesajı gönder">Gönder</button>
              </form>
            </>
          )}
        </section>
      )}
      <button type="button" className="chat-launcher" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Sohbeti kapat" : "MiniHesap Asistanı ile sohbet et"}>
        <span aria-hidden="true">✦</span>
        <span>{open ? "Kapat" : "Asistana sor"}</span>
      </button>
    </div>
  );
}
