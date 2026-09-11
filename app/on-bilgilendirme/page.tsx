import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { premiumProducts } from "@/data/premiumProducts";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description:
    "MiniHesap dijital ürün satışlarına ilişkin ön bilgilendirme formu: satıcı bilgileri, ürün, fiyat, teslimat ve cayma hakkı.",
  alternates: { canonical: "/on-bilgilendirme" },
};

export default function PreInfoPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Ön Bilgilendirme Formu" },
          ]}
        />

        <p className="eyebrow">YASAL</p>
        <h1>Ön Bilgilendirme Formu</h1>

        <p className="page-lead">
          Mesafeli Sözleşmeler Yönetmeliği uyarınca, siparişinizi vermeden önce
          aşağıdaki bilgileri okumanız gerekmektedir.
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

          <h2>1. Satıcı bilgileri</h2>
          <ul>
            <li>
              <strong>Unvan:</strong>{" "}
              <em>[Ticari unvanınız buraya yazılacak]</em>
            </li>
            <li>
              <strong>Adres:</strong> <em>[Açık adres]</em>
            </li>
            <li>
              <strong>Vergi dairesi / numarası:</strong>{" "}
              <em>[Vergi dairesi ve no]</em>
            </li>
            <li>
              <strong>MERSİS / Ticaret sicil no:</strong> <em>[Varsa]</em>
            </li>
            <li>
              <strong>E-posta:</strong> <em>[İletişim e-postası]</em>
            </li>
            <li>
              <strong>Telefon:</strong> <em>[Telefon]</em>
            </li>
            <li>
              <strong>İnternet adresi:</strong> minihesap.net
            </li>
          </ul>

          <div className="notice notice-warn">
            <strong>Site sahibine not:</strong> Yukarıdaki köşeli parantezli
            alanlar yayına almadan önce gerçek firma bilgilerinizle
            doldurulmalıdır. Bu bilgiler olmadan mesafeli satış yapmak mevzuata
            aykırıdır.
          </div>

          <h2>2. Sözleşme konusu ürün</h2>
          <p>
            Sözleşme konusu, MiniHesap tarafından hazırlanan ve internet
            üzerinden elektronik olarak teslim edilen dijital ürünlerdir
            (Excel şablonları, Access veritabanı paketleri ve masaüstü
            programı). Satışa sunulan ürünler, nitelikleri ve güncel satış
            fiyatları{" "}
            <Link href="/premium">Premium Ürünler</Link> sayfasında yer alır.
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 14 }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid var(--line)",
                    padding: "8px 4px",
                  }}
                >
                  Ürün
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "2px solid var(--line)",
                    padding: "8px 4px",
                  }}
                >
                  Fiyat (KDV dâhil)
                </th>
              </tr>
            </thead>
            <tbody>
              {premiumProducts.map((p) => (
                <tr key={p.slug}>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid var(--line-soft)",
                    }}
                  >
                    {p.title}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      textAlign: "right",
                      borderBottom: "1px solid var(--line-soft)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.price.toLocaleString("tr-TR")} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>3. Ödeme şekli</h2>
          <p>
            Ödemeler, anlaşmalı ödeme kuruluşunun güvenli sayfası üzerinden
            kredi kartı veya banka kartı ile yapılır. Kart bilgileriniz
            MiniHesap sunucularına iletilmez ve tarafımızca saklanmaz.
          </p>

          <h2>4. Teslimat</h2>
          <p>
            Ürün dijitaldir; kargo ve teslimat masrafı yoktur. Ödeme
            onaylandıktan hemen sonra indirme bağlantısı sipariş sayfanızda
            görüntülenir ve belirttiğiniz e-posta adresine gönderilir. İndirme
            hakkı satın alma tarihinden itibaren <strong>30 gün</strong> ve en
            fazla <strong>10 indirme</strong> ile sınırlıdır.
          </p>

          <h2>5. Cayma hakkı — önemli</h2>
          <p>
            Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/1-ğ maddesi uyarınca,
            elektronik ortamda anında ifa edilen ve tüketiciye anında teslim
            edilen gayrimaddi mallara ilişkin sözleşmelerde{" "}
            <strong>cayma hakkı kullanılamaz</strong>.
          </p>
          <p>
            Bu nedenle indirme işlemi başladıktan sonra ürün iade edilemez.
            Sipariş onayı sırasında bu durumu ayrıca onaylamanız istenir.
            İndirme yapılmamış siparişlerde iade talebiniz değerlendirilir;
            ayrıntılar{" "}
            <Link href="/iade-kosullari">İptal ve İade Koşulları</Link>{" "}
            sayfasındadır.
          </p>

          <h2>6. Uyuşmazlık çözümü</h2>
          <p>
            Şikâyet ve itirazlar için, mal veya hizmeti satın aldığınız veya
            ikametgâhınızın bulunduğu yerdeki Tüketici Hakem Heyetlerine veya
            Tüketici Mahkemelerine başvurabilirsiniz. Parasal sınırlar her yıl
            Ticaret Bakanlığı tarafından güncellenir.
          </p>

          <h2>7. Ürün gereksinimleri</h2>
          <p>
            Satın almadan önce ürünün çalışması için gereken yazılımlara sahip
            olduğunuzdan emin olun:
          </p>
          <ul>
            <li>
              <strong>Excel şablonları:</strong> Microsoft Excel 2016 veya
              üzeri. LibreOffice Calc ve Google E-Tablolar ile de açılır, ancak
              bazı biçimlendirmeler farklı görünebilir.
            </li>
            <li>
              <strong>Access + Excel paketi:</strong> Microsoft Access veya
              ücretsiz Microsoft Access Database Engine kurulu olmalıdır.
              Yalnızca Windows.
            </li>
            <li>
              <strong>Masaüstü programı:</strong> Windows 10 veya üzeri. Başka
              kurulum gerekmez.
            </li>
          </ul>
          <p>
            Bu gereksinimlerin karşılanmaması iade sebebi olarak kabul
            edilmez; satın almadan önce kontrol etmeniz gerekir.
          </p>
        </div>
      </div>
    </main>
  );
}
