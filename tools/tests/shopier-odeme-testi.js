/**
 * Shopier entegrasyonunun uçtan uca doğrulaması.
 * Gerçek imza algoritmasıyla hem geçerli hem sahte bildirim denenir.
 */
const crypto = require("crypto");

const BASE = "http://localhost:3000";
const SECRET = "TEST_SECRET_abcdefghijklmnop";

const hmac = (data) =>
  crypto.createHmac("sha256", SECRET).update(data).digest("base64");

function field(html, name) {
  const re = new RegExp(`name="${name}" value="([^"]*)"`);
  const m = html.match(re);
  return m ? m[1] : null;
}

function unescape(v) {
  return String(v)
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

(async () => {
  let pass = 0;
  let fail = 0;
  const ok = (label, cond, extra = "") => {
    if (cond) { pass++; console.log(`  GECTI  ${label}${extra ? " — " + extra : ""}`); }
    else { fail++; console.log(`  KALDI  ${label}${extra ? " — " + extra : ""}`); }
  };

  console.log("=== 1. Sipariş oluşturma ve Shopier formu ===");

  const res = await fetch(`${BASE}/api/siparis/olustur`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productSlug: "isletme-programi",
      fullName: "Ayşe Yılmaz Kaya",
      email: "ayse@ornek.com",
      phone: "05320000000",
      terms: true,
    }),
  });

  const data = await res.json();
  ok("sipariş oluşturuldu", data.success === true, data.message || "");

  if (!data.success) { console.log(JSON.stringify(data)); process.exit(1); }

  const html = data.checkout?.html ?? "";
  ok("Shopier formu döndü", data.checkout?.kind === "form");
  ok("form Shopier adresine gidiyor", html.includes("shopier.com/ShowProduct/api_pay4.php"));

  const orderId = field(html, "platform_order_id");
  const total = field(html, "total_order_value");
  const currency = field(html, "currency");
  const randomNr = field(html, "random_nr");
  const signature = unescape(field(html, "signature"));

  console.log(`  sipariş: ${orderId} · tutar: ${total} · random: ${randomNr}`);

  ok("tutar sunucudaki fiyattan geldi (899.00)", total === "899.00");
  ok("para birimi TL (0)", currency === "0");

  const expected = hmac(randomNr + orderId + total + currency);
  ok("ödeme imzası doğru hesaplanmış", signature === expected);

  // Ad ayrıştırma
  ok("ad ayrıştırıldı", field(html, "buyer_name") === "Ayşe");
  ok("soyad ayrıştırıldı", unescape(field(html, "buyer_surname")) === "Yılmaz Kaya");
  ok("dijital ürün tipi (1)", field(html, "product_type") === "1");
  ok("callback adresi gömülü", unescape(field(html, "callback_url")).includes("/api/odeme/bildirim"));

  console.log("\n=== 2. SAHTE bildirim (yanlış imza) ===");

  const badBody = new URLSearchParams({
    platform_order_id: orderId,
    random_nr: randomNr,
    signature: "sahteimzaBURADA==",
    status: "success",
  }).toString();

  const bad = await fetch(`${BASE}/api/odeme/bildirim`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: badBody,
  });
  const badJson = await bad.json();
  ok("sahte imza reddedildi", bad.status === 400 && badJson.success === false, `HTTP ${bad.status}`);

  console.log("\n=== 3. TUTAR OYNANMIŞ bildirim ===");

  const tamperBody = new URLSearchParams({
    platform_order_id: orderId,
    random_nr: randomNr,
    signature: hmac(randomNr + orderId),
    status: "success",
    total_order_value: "1.00",
  }).toString();

  const tamper = await fetch(`${BASE}/api/odeme/bildirim`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tamperBody,
  });
  const tamperJson = await tamper.json();
  ok("eksik tutar reddedildi", tamper.status === 400, `HTTP ${tamper.status} — ${tamperJson.message ?? ""}`);

  console.log("\n=== 4. GEÇERLİ bildirim ===");

  const goodBody = new URLSearchParams({
    platform_order_id: orderId,
    random_nr: randomNr,
    signature: hmac(randomNr + orderId),
    status: "success",
    payment_id: "SHP123456",
    installment: "1",
    total_order_value: "899.00",
  }).toString();

  const good = await fetch(`${BASE}/api/odeme/bildirim`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: goodBody,
  });
  const goodJson = await good.json();
  ok("geçerli bildirim kabul edildi", good.status === 200 && goodJson.success === true, `HTTP ${good.status}`);

  console.log("\n=== 5. Mükerrer bildirim ===");

  const dup = await fetch(`${BASE}/api/odeme/bildirim`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: goodBody,
  });
  ok("mükerrer bildirim sorunsuz karşılandı", dup.status === 200);

  console.log("\n=== 6. Sipariş durumu ve indirme ===");

  const page = await fetch(`${BASE}/siparis/${orderId}`);
  const pageHtml = await page.text();
  ok("sipariş sayfası ödendi gösteriyor", pageHtml.includes("ÖDEME ONAYLANDI"));

  const m = pageHtml.match(/\/api\/premium\/download\?product=([^&"]+)&amp;token=([^"]+)/);
  ok("indirme bağlantısı üretildi", !!m);

  if (m) {
    const url = `${BASE}/api/premium/download?product=${m[1]}&token=${m[2].replaceAll("&amp;", "&")}`;
    const dl = await fetch(url);
    ok("dosya indirildi", dl.status === 200, `tür: ${dl.headers.get("content-type")}`);
  }

  console.log(`\n=========== SONUÇ: ${pass} geçti, ${fail} kaldı ===========`);
  process.exit(fail > 0 ? 1 : 0);
})();
