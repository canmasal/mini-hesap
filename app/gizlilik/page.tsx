import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "MiniHesap gizlilik politikası: hangi verileri işliyoruz, çerezler, reklam ve analitik hizmetleri, KVKK kapsamındaki haklarınız.",
  alternates: { canonical: "/gizlilik" },
};

const LAST_UPDATED = "10 Eylül 2026";

export default function PrivacyPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Gizlilik Politikası" },
          ]}
        />

        <p className="eyebrow">YASAL</p>
        <h1>Gizlilik Politikası</h1>

        <p className="page-lead">
          MiniHesap olarak gizliliğinize önem veriyoruz. Bu politika, siteyi
          kullandığınızda hangi verilerin işlendiğini ve haklarınızı açıklar.
        </p>

        <span className="updated">Son güncelleme: {LAST_UPDATED}</span>

        <div className="prose">
          <h2>1. Kısaca özet</h2>
          <p>
            Hesaplama araçlarına girdiğiniz maaş, borç, tarih ve tutar gibi
            bilgiler <strong>sunucularımıza gönderilmez</strong>. Hesaplamalar
            tamamen tarayıcınızda çalışır. Borç Takip ve Ön Muhasebe
            araçlarındaki kayıtlar yalnızca kendi cihazınızın tarayıcı
            deposunda (localStorage) tutulur.
          </p>

          <h2>2. İşlenen veriler</h2>
          <h3>2.1 Siz girmediğiniz sürece toplanmayan veriler</h3>
          <p>
            Site kullanımı için üyelik gerekmez; ad, e-posta, kimlik veya ödeme
            bilgisi talep edilmez.
          </p>

          <h3>2.2 Otomatik olarak oluşan teknik veriler</h3>
          <ul>
            <li>IP adresi ve yaklaşık konum (ülke/şehir düzeyinde)</li>
            <li>Tarayıcı ve cihaz türü, işletim sistemi</li>
            <li>Ziyaret edilen sayfalar, kalış süresi, yönlendiren adres</li>
          </ul>
          <p>
            Bu veriler site güvenliği, hata tespiti ve genel kullanım
            istatistikleri için kullanılır.
          </p>

          <h3>2.3 İletişim formu</h3>
          <p>
            <Link href="/iletisim">İletişim</Link> sayfasındaki formu
            kullanırsanız, ilettiğiniz ad, e-posta adresi ve mesaj içeriği
            yalnızca talebinize yanıt vermek amacıyla işlenir; pazarlama
            amacıyla kullanılmaz ve üçüncü taraflarla paylaşılmaz.
          </p>

          <h3>2.4 Program talebi ve AI ürün danışmanı</h3>
          <p>
            <Link href="/program-talebi">Program Talebi</Link> formunu
            kullandığınızda adınız, e-posta adresiniz ve program fikriniz talebi
            değerlendirmek ve size dönüş yapmak için kaydedilir. AI ürün
            danışmanı, yazdığınız açıklamayı özetlemek ve netleştirici sorular
            önermek için kullanılabilir. AI çıktısı karar veya taahhüt değildir.
            Özel nitelikli kişisel veri, şifre, kart bilgisi ve finansal sır
            paylaşmayın. Yapılandırıldığında açıklama, AI hizmeti sağlayıcısına
            işlenmek üzere aktarılabilir.
          </p>

          <h3>2.5 Müşteri temsilcisi iletişim formu</h3>
          <p>
            Sohbet asistanındaki iletişim formunda ad soyad, telefon ve e-posta
            bilgilerinizi yalnızca size dönüş yapmak amacıyla iletebilirsiniz.
            KVKK aydınlatma metni onayı zorunludur; pazarlama iletişimi izni
            ayrıca ve isteğe bağlıdır. Pazarlama izninin kapsamı ve geri alma
            yöntemi için <Link href="/pazarlama-iletisimi">Pazarlama İletişimi İzni</Link> sayfasını inceleyin.
          </p>

          <h2>3. Çerezler</h2>
          <p>
            Sitede iki tür çerez kullanılabilir:
          </p>
          <ul>
            <li>
              <strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri ve
              tercihlerinizin hatırlanması için gereklidir.
            </li>
            <li>
              <strong>Reklam ve ölçümleme çerezleri:</strong> Reklam alanlarının
              gösterimi ve performans ölçümü için üçüncü taraflarca
              yerleştirilebilir.
            </li>
          </ul>
          <p>
            Çerezleri tarayıcı ayarlarınızdan istediğiniz zaman
            silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellemek
            bazı özelliklerin çalışmamasına yol açabilir.
          </p>

          <h2>4. Reklam ve üçüncü taraf hizmetler</h2>
          <p>
            Sitede reklam alanları bulunabilir. Reklam sağlayıcıları (örneğin
            Google AdSense) ilgi alanına dayalı reklam gösterimi için çerez
            kullanabilir. Google’ın reklam çerezi tercihlerinizi{" "}
            <a
              href="https://myadcenter.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Reklam Ayarları
            </a>{" "}
            üzerinden yönetebilirsiniz.
          </p>

          <h2>5. Verilerin saklanması ve aktarımı</h2>
          <p>
            Teknik günlük kayıtları yalnızca güvenlik ve hata analizi için
            gereken süre boyunca saklanır. Verileriniz yasal zorunluluk
            dışında üçüncü kişilere satılmaz veya devredilmez. Barındırma ve
            reklam altyapısı nedeniyle veriler yurt dışındaki sunucularda
            işlenebilir.
          </p>

          <h2>6. Çocukların gizliliği</h2>
          <p>
            Site 13 yaş altındaki kullanıcılara yönelik değildir ve bilerek bu
            yaş grubundan kişisel veri toplanmaz.
          </p>

          <h2>7. KVKK kapsamındaki haklarınız</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca; kişisel
            verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep
            etme, düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme
            haklarına sahipsiniz. Taleplerinizi{" "}
            <Link href="/iletisim">İletişim</Link> sayfasından iletebilirsiniz.
          </p>

          <h2>8. Değişiklikler</h2>
          <p>
            Bu politika gerektiğinde güncellenebilir. Güncel sürüm her zaman bu
            sayfada yayımlanır ve yukarıdaki “son güncelleme” tarihi
            değiştirilir.
          </p>
        </div>
      </div>
    </main>
  );
}
