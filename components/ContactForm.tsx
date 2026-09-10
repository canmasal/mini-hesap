"use client";

import { useState } from "react";

type Errors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const subjects = [
  "Genel soru",
  "Hata bildirimi",
  "Yeni araç önerisi",
  "Premium ürün / satın alma",
  "Reklam ve iş birliği",
  "KVKK / veri talebi",
];

export default function ContactForm({ contactEmail }: { contactEmail?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate(): Errors {
    const next: Errors = {};

    if (name.trim().length < 2) {
      next.name = "Lütfen adınızı yazın.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      next.email = "Geçerli bir e-posta adresi girin.";
    }

    if (message.trim().length < 10) {
      next.message = "Mesajınız en az 10 karakter olmalı.";
    }

    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) return;
    if (!contactEmail) return;

    const body = [
      `Ad Soyad: ${name.trim()}`,
      `E-posta: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    window.location.href =
      `mailto:${contactEmail}` +
      `?subject=${encodeURIComponent(`[MiniHesap] ${subject}`)}` +
      `&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  if (!contactEmail) {
    return (
      <div className="notice notice-warn" style={{ marginTop: 30 }}>
        <strong>İletişim adresi henüz tanımlanmadı.</strong> Site sahibi
        <code> .env.local</code> dosyasına{" "}
        <code>NEXT_PUBLIC_CONTACT_EMAIL=ornek@alanadi.com</code> satırını
        ekleyip sunucuyu yeniden başlattığında bu form aktif olur.
      </div>
    );
  }

  return (
    <form className="calc-box" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="contact-name">
          Ad Soyad *
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adınız Soyadınız"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <span className="field-error" id="contact-name-error" role="alert">
              {errors.name}
            </span>
          )}
        </label>

        <label className="field" htmlFor="contact-email">
          E-posta *
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ornek@mail.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <span className="field-error" id="contact-email-error" role="alert">
              {errors.email}
            </span>
          )}
        </label>
      </div>

      <label className="field" htmlFor="contact-subject" style={{ marginTop: 18 }}>
        Konu
        <select
          id="contact-subject"
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="field" htmlFor="contact-message" style={{ marginTop: 18 }}>
        Mesaj *
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Mesajınızı buraya yazın..."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-message-hint"
          }
        />
        {errors.message ? (
          <span className="field-error" id="contact-message-error" role="alert">
            {errors.message}
          </span>
        ) : (
          <span className="field-hint" id="contact-message-hint">
            {message.trim().length} karakter · Lütfen kişisel/finansal
            bilgilerinizi paylaşmayın.
          </span>
        )}
      </label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        <button className="btn btn-green" type="submit">
          Mesajı Gönder
        </button>

        <a className="btn btn-outline" href={`mailto:${contactEmail}`}>
          Doğrudan e-posta yaz
        </a>
      </div>

      {sent && (
        <div className="notice notice-ok" role="status">
          E-posta uygulamanız hazırlanan mesajla açıldı. Açılmadıysa doğrudan{" "}
          <strong>{contactEmail}</strong> adresine yazabilirsiniz.
        </div>
      )}

      <p className="field-hint" style={{ marginTop: 14 }}>
        Form gönderildiğinde mesajınız e-posta uygulamanız üzerinden iletilir;
        bilgiler sunucumuzda saklanmaz.
      </p>
    </form>
  );
}
