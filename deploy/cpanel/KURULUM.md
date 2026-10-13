# MiniHesap — cPanel kurulumu (BefHosting)

Bu klasör çalışmaya hazır Next.js sunucusudur; sunucuda `npm install` veya
derleme yapılmaz. Gereken: cPanel "Application Manager" ve Node.js 20 veya üstü.

## 1. Dosyaları yükle
1. cPanel → Dosya Yöneticisi → ana klasörde (public_html'in DIŞINDA)
   `minihesap-app` adında klasör oluştur.
2. `minihesap-cpanel.zip` dosyasını bu klasöre yükle, sağ tık → Extract.
   Klasörün içinde doğrudan `app.js`, `server.js`, `.next`, `public`,
   `node_modules` görünmeli.

## 2. Uygulamayı kaydet
cPanel → Yazılım → Application Manager → Register Application
- Application Name: `minihesap`
- Deployment Domain: `minihesap.net`
- Base Application URL: `/` (boş bırak)
- Uygulama Yolu: `minihesap-app`
- Deployment Environment: Üretim
- Environment Variables (Add Variable):
  - `NODE_ENV` = `production`
  - `OPENAI_API_KEY` = (OpenAI anahtarı — sohbet asistanı için)
  - `CHAT_NOTIFY_EMAIL` = (bildirim e-postası)
- Deploy

## 3. Güncelleme
Yeni sürümde zip'i aynı klasöre yükleyip üzerine açın, ardından
Application Manager'da uygulamanın yanında "Restart"/"Ensure dependencies"
yerine yalnızca yeniden başlatın (veya `tmp/restart.txt` dosyasına dokunun).
`private/orders.json` ve `private/requests.json` sitenin kayıtlarıdır; silmeyin.

## 4. DNS (en son, test bittikten sonra)
Alan adı yöneticisinde minihesap.net ve www için A kaydını BefHosting sunucu
IP'sine çevirin; Vercel kayıtlarını (76.76.21.21 / cname.vercel-dns.com) kaldırın.
cPanel → SSL/TLS Status → AutoSSL ile sertifikayı alın.
