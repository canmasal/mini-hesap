import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "İptal ve İade Koşulları",
  description:
    "MiniHesap dijital ürünlerinde iptal, iade ve destek koşulları.",
  alternates: { canonical: "/iade-kosullari" },
};

export default function RefundPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "İptal ve İade Koşulları" },
          ]}
        />

        <p className="eyebrow">YASAL</p>
        <h1>İptal ve İade Koşulları</h1>

        <p className="page-lead">
          Dijital ürünlerde iade kuralları fiziksel ürünlerden farklıdır.
          Satın almadan önce bu sayfayı okumanızı öneririz.
        </p>

        <div className="prose">
          <h2>Kısaca</h2>
          <ul>
            <li>
              <strong>İndirme yapılmadıysa:</strong> Siparişinizi iptal edip
              tam iade alabilirsiniz.
            </li>
            <li>
              <strong>İndirme yapıldıysa:</strong> Mevzuat gereği cayma hakkı
              sona erer, iade yapılamaz.
            </li>
            <li>
              <strong>Ürün hatalıysa:</strong> İndirmiş olsanız bile onarım
              veya tam iade hakkınız vardır.
            </li>
          </ul>

          <h2>1. Cayma hakkının kapsamı</h2>
          <p>
            Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/1-ğ maddesi uyarınca,
            elektronik ortamda anında ifa edilen ve tüketiciye anında teslim
            edilen gayrimaddi mallarda cayma hakkı kullanılamaz. Dijital
            ürünlerimiz bu kapsamdadır.
          </p>
          <p>
            Bu nedenle sipariş onayı sırasında, indirme başladıktan sonra cayma
            hakkınızın sona ereceğini ayrıca onaylamanız istenir.
          </p>

          <h2>2. İndirme yapılmamış siparişler</h2>
          <p>
            Ödemesi alınmış ancak dosyayı hiç indirmemiş olduğunuz siparişlerde
            iptal talebinizi kabul ediyoruz. Talebinizi{" "}
            <Link href="/iletisim">iletişim sayfasından</Link> sipariş
            numaranızla birlikte iletin. İade, ödemeyi yaptığınız karta
            yapılır; bankanıza bağlı olarak hesabınıza yansıması 3–14 iş günü
            sürebilir.
          </p>

          <h2>3. Ayıplı ürün</h2>
          <p>
            Ürün açılmıyorsa, formülleri çalışmıyorsa veya tanıtımda belirtilen
            özellikleri taşımıyorsa, indirmiş olsanız dahi haklarınız saklıdır.
            Bu durumda sırasıyla şu seçenekler sunulur:
          </p>
          <ul>
            <li>Sorunun giderildiği düzeltilmiş sürümün ücretsiz gönderilmesi</li>
            <li>Sorun giderilemiyorsa bedelin tamamının iadesi</li>
          </ul>
          <p>
            Lütfen sorunu ekran görüntüsü ve kullandığınız program sürümüyle
            birlikte bildirin; böylece hızlıca çözebiliriz.
          </p>

          <h2>4. İade sebebi sayılmayan durumlar</h2>
          <ul>
            <li>
              Gerekli yazılımın bilgisayarınızda bulunmaması (örneğin Access
              paketi için Microsoft Access veya Access Database Engine
              kurulu olmaması). Gereksinimler{" "}
              <Link href="/on-bilgilendirme">Ön Bilgilendirme Formu</Link>&apos;nda
              belirtilmiştir.
            </li>
            <li>
              Ürünün beklentinizi karşılamaması, ancak tanıtımda belirtilen
              özellikleri taşıması.
            </li>
            <li>
              Yanlış ürün satın alınması. Satın almadan önce ürün açıklamasını
              ve içerik listesini inceleyin; emin değilseniz bize sorun.
            </li>
            <li>Ürünün üçüncü kişilerle paylaşılması veya yeniden satılması.</li>
          </ul>

          <h2>5. İndirme sorunları</h2>
          <p>
            İndirme bağlantınızın süresi dolduysa sipariş sayfanızı yenilemeniz
            yeterlidir; yeni bağlantı otomatik üretilir. İndirme hakkınız
            dolduysa veya 30 günlük süre geçtiyse bize yazın, siparişinizi
            doğrulayıp erişiminizi yeniden açalım. Bu durum ücretlendirilmez.
          </p>

          <h2>6. Başvuru</h2>
          <p>
            Tüm talepleriniz için{" "}
            <Link href="/iletisim">iletişim sayfasını</Link> kullanın.
            Başvurunuzu en geç 3 iş günü içinde yanıtlıyoruz. Başvurunuzda
            sipariş numaranızı belirtmeniz süreci hızlandırır.
          </p>

          <h2>7. Tüketici hakları</h2>
          <p>
            Bu koşullar, 6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;dan
            doğan haklarınızı sınırlamaz. Anlaşmazlık hâlinde Tüketici Hakem
            Heyetlerine veya Tüketici Mahkemelerine başvurabilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
