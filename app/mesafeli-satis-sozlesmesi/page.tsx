import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "MiniHesap dijital ürün satışlarına ilişkin mesafeli satış sözleşmesi.",
  alternates: { canonical: "/mesafeli-satis-sozlesmesi" },
};

export default function DistanceSalesPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Mesafeli Satış Sözleşmesi" },
          ]}
        />

        <p className="eyebrow">YASAL</p>
        <h1>Mesafeli Satış Sözleşmesi</h1>

        <p className="page-lead">
          Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
          Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir.
        </p>

        <div className="prose">
          <div className="notice notice-warn">
            <strong>Bu sayfa henüz tamamlanmamıştır.</strong> Firma bilgileri
            girilmeden ve ticari kayıt tamamlanmadan bu site üzerinden satış
            yapılmamaktadır. Ürünlerle ilgilenmek için{" "}
            <Link href="/iletisim" style={{ fontWeight: 700 }}>
              iletişim sayfasından
            </Link>{" "}
            bize yazabilirsiniz.
          </div>

          <h2>Madde 1 — Taraflar</h2>
          <p>
            <strong>SATICI:</strong> <em>[Ticari unvan]</em>, <em>[adres]</em>,{" "}
            <em>[vergi dairesi ve numarası]</em>, <em>[telefon]</em>,{" "}
            <em>[e-posta]</em>, minihesap.net
          </p>
          <p>
            <strong>ALICI:</strong> Sipariş sırasında belirttiği ad, soyad,
            e-posta ve iletişim bilgileriyle tanımlanan kişi.
          </p>

          <div className="notice notice-warn">
            <strong>Site sahibine not:</strong> Köşeli parantezli alanlar
            yayına almadan önce gerçek firma bilgilerinizle doldurulmalıdır.
          </div>

          <h2>Madde 2 — Sözleşmenin konusu</h2>
          <p>
            İşbu sözleşmenin konusu, ALICI&apos;nın minihesap.net üzerinden
            elektronik ortamda siparişini verdiği, aşağıda nitelikleri ve satış
            fiyatı belirtilen dijital ürünün satışı ve elektronik teslimi ile
            ilgili tarafların hak ve yükümlülüklerinin belirlenmesidir.
          </p>

          <h2>Madde 3 — Sözleşme konusu ürün</h2>
          <p>
            Ürünün türü, miktarı, satış bedeli ve ödeme şekli, sipariş
            sırasında ALICI&apos;ya gösterilen ve onaylanan bilgilerdir. Güncel
            ürün listesi ve fiyatlar{" "}
            <Link href="/premium">Premium Ürünler</Link> sayfasında yer alır.
            Fiyatlara KDV dâhildir. Dijital ürün olduğundan kargo ücreti
            alınmaz.
          </p>

          <h2>Madde 4 — Teslimat</h2>
          <p>
            Ürün, ödeme onaylandıktan sonra elektronik ortamda derhal teslim
            edilir. Teslim, indirme bağlantısının ALICI&apos;nın sipariş
            sayfasında görüntülenmesi ve e-posta adresine gönderilmesiyle
            gerçekleşmiş sayılır.
          </p>
          <p>
            İndirme bağlantısı satın alma tarihinden itibaren 30 gün süreyle ve
            en fazla 10 indirme hakkıyla geçerlidir. Bu süre içinde teknik bir
            aksaklık yaşanması hâlinde SATICI, ALICI&apos;ya yeni bağlantı
            sağlar.
          </p>

          <h2>Madde 5 — Cayma hakkının bulunmaması</h2>
          <p>
            Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/1-ğ maddesi uyarınca,
            elektronik ortamda anında ifa edilen ve tüketiciye anında teslim
            edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı
            kullanılamaz.
          </p>
          <p>
            ALICI, siparişi onaylarken bu durumu açıkça kabul eder. İndirme
            işlemi başladıktan sonra iade ve cayma talebinde bulunulamaz.
          </p>

          <h2>Madde 6 — ALICI&apos;nın yükümlülükleri</h2>
          <ul>
            <li>
              Sipariş sırasında verdiği bilgilerin doğru ve eksiksiz olmasından
              sorumludur. Hatalı e-posta adresi nedeniyle teslimat
              yapılamamasından SATICI sorumlu tutulamaz.
            </li>
            <li>
              Satın aldığı dijital ürünü çoğaltamaz, yeniden satamaz, ücretsiz
              veya ücretli olarak üçüncü kişilerle paylaşamaz, internette
              yayınlayamaz.
            </li>
            <li>
              Ürünü yalnızca kendi kişisel veya kendi işletmesinin kullanımı
              için kullanabilir.
            </li>
          </ul>

          <h2>Madde 7 — Fikri mülkiyet</h2>
          <p>
            Ürünlerin tüm fikri mülkiyet hakları SATICI&apos;ya aittir. Satın
            alma, ALICI&apos;ya yalnızca kişisel kullanım lisansı verir;
            mülkiyet devri anlamına gelmez.
          </p>

          <h2>Madde 8 — Sorumluluğun sınırı</h2>
          <p>
            Ürünlerdeki hesaplamalar bilgilendirme amaçlıdır; resmî defter,
            beyanname, bordro veya mali müşavir hizmeti yerine geçmez.
            ALICI&apos;nın bu ürünlerden elde ettiği sonuçlara dayanarak aldığı
            kararlardan doğabilecek doğrudan veya dolaylı zararlardan SATICI
            sorumlu tutulamaz.
          </p>

          <h2>Madde 9 — Kişisel verilerin korunması</h2>
          <p>
            Sipariş kapsamında toplanan ad, e-posta ve telefon bilgileri
            yalnızca siparişin ifası, faturalandırma ve destek amacıyla
            işlenir. Ayrıntılı bilgi{" "}
            <Link href="/gizlilik">Gizlilik Politikası</Link> sayfasındadır.
          </p>

          <h2>Madde 10 — Uyuşmazlıkların çözümü</h2>
          <p>
            İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca
            ilan edilen parasal sınırlar dâhilinde Tüketici Hakem Heyetleri,
            bu sınırların üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri
            yetkilidir.
          </p>

          <h2>Madde 11 — Yürürlük</h2>
          <p>
            ALICI, siparişi onayladığında işbu sözleşmenin tüm koşullarını
            kabul etmiş sayılır. Sözleşme elektronik ortamda kurulmuş olup
            SATICI nezdinde saklanır.
          </p>
        </div>
      </div>
    </main>
  );
}
