import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Pazarlama İletişimi İzni",
  description: "MiniHesap pazarlama iletişimi izninin kapsamı, geri alma ve veri işleme bilgileri.",
  alternates: { canonical: "/pazarlama-iletisimi" },
};

export default function MarketingConsentPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Pazarlama İletişimi İzni" }]} />
        <p className="eyebrow">AÇIK RIZA BİLGİLENDİRMESİ</p>
        <h1>Pazarlama iletişimi izni</h1>
        <div className="prose">
          <p>Bu izin, MiniHesap ve iş ortaklarının yeni ürün, hizmet, kampanya ve fırsatları hakkında e-posta veya telefon yoluyla sizinle iletişime geçebilmesine ilişkindir.</p>
          <h2>İzin isteğe bağlıdır</h2>
          <p>Pazarlama iletişimi izni vermemeniz sohbet asistanını veya destek talebinizi kullanmanızı engellemez. İzin vermezseniz bilgileriniz yalnızca talebinize yanıt vermek amacıyla işlenir.</p>
          <h2>İzni geri alma</h2>
          <p>İzninizi istediğiniz zaman <a href="mailto:minihesap@gmail.com">minihesap@gmail.com</a> adresine yazarak veya gelen e-postalardaki abonelikten ayrılma bağlantısını kullanarak geri alabilirsiniz.</p>
          <h2>KVKK</h2>
          <p>Kişisel verilerinizin işlenmesine ilişkin ayrıntılar için <a href="/gizlilik">Gizlilik Politikası</a> sayfasını inceleyebilirsiniz.</p>
        </div>
      </div>
    </main>
  );
}