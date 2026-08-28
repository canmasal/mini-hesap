export default function ContactPage() {
  return (
    <main className="page">
      <div className="container">
        <div className="eyebrow">MİNİHESAP</div>
        <h1>İletişim</h1>
        <p className="page-lead">İletişim formu yayın öncesinde gerçek bir form servisine bağlanacaktır.</p>
        <div className="calc-box">
          <label className="field">Ad Soyad<input placeholder="Adınız Soyadınız" /></label>
          <label className="field" style={{ marginTop: 18 }}>E-posta<input type="email" placeholder="ornek@mail.com" /></label>
          <label className="field" style={{ marginTop: 18 }}>Mesaj<textarea rows={6} placeholder="Mesajınız" /></label>
          <button className="btn btn-green" style={{ marginTop: 18 }} type="button">Gönder</button>
        </div>
      </div>
    </main>
  );
}
