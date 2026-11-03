/**
 * Hazır örnek hesap sayfası olan ama rehberi bulunmayan araçların
 * rehberleri: netten brüte maaş ve tapu harcı.
 *
 * Örnek rakamlar derleme anında araçlarla aynı formüllerden hesaplanır;
 * data/parameters.ts güncellendiğinde rehber de kendiliğinden güncellenir.
 */

import type { Guide } from "@/data/guides";
import {
  INCOME_TAX_BRACKETS_WAGE,
  MINIMUM_WAGE,
  PARAMETERS_YEAR as Y,
  RATES,
  tl,
} from "@/data/parameters";
import { DEED_RATE, deedFeeOf, grossForNetOf, yearlyGrossForNetOf } from "@/lib/calculations/longtailExtra";

const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;

/* Netten brüte örnekleri */
const ex30 = grossForNetOf(30000);
const ex50 = grossForNetOf(50000);
const year50 = yearlyGrossForNetOf(50000);
const dec50 = year50[year50.length - 1];
const firstLimit = INCOME_TAX_BRACKETS_WAGE[0].limit;

/* Tapu harcı örneği */
const deedExample = 3000000;
const deed = deedFeeOf(deedExample);

export const hesapGuides: Guide[] = [
  /* =======================================================
     NETTEN BRÜTE MAAŞ
  ======================================================= */
  {
    slug: "netten-brute-maas-nasil-hesaplanir",
    title: "Netten Brüte Maaş Nasıl Hesaplanır?",
    metaTitle: `Netten Brüte Maaş Hesaplama ${Y} Rehberi`,
    description: `Anlaşılan net maaşın brüt karşılığı nasıl bulunur? ${Y} kesinti oranları, vergi dilimi etkisi, asgari ücret istisnası ve örnek hesaplamalar.`,
    category: "Çalışan Hakları",
    icon: "🔁",
    published: "2026-11-03",
    updated: "2026-11-03",
    readingMinutes: 6,
    tool: { slug: "netten-brute-maas", label: "Netten Brüte Maaş Hesaplama" },
    intro: `İş tekliflerinde maaş çoğu zaman net konuşulur, ama bordro ve sözleşme brüt üzerinden düzenlenir. Net bir tutarın brüt karşılığını bulmak, brütten nete hesabı tersine çevirmektir. Bu rehberde ${Y} oranlarıyla bu dönüşümün nasıl yapıldığını, aynı net için yıl içinde neden daha yüksek brüt gerektiğini ve sözleşmede nelere dikkat edilmesi gerektiğini anlatıyoruz.`,
    sections: [
      {
        heading: "Neden basit bir oranla bölünmez?",
        body: [
          "Brütten nete geçerken dört kesinti yapılır: SGK işçi payı, işsizlik sigortası, gelir vergisi ve damga vergisi. İlk ikisi sabit orandır, ama gelir vergisi yıl başından itibaren biriken <strong>kümülatif matraha</strong> göre artan oranlıdır ve asgari ücrete isabet eden kısım vergiden istisnadır.",
          "Bu yüzden \"net × 1,3 = brüt\" gibi sabit bir çarpan bazı maaşlarda yakın, bazılarında belirgin biçimde yanlış sonuç verir. Doğru yöntem, brütten nete hesabı tersine çözmektir: istenen neti veren brüt tutar deneme yoluyla (ikili arama) bulunur. Hesaplayıcımız da bu yöntemi kullanır.",
        ],
      },
      {
        heading: `${Y} yılında kesinti oranları`,
        body: [
          `- <strong>SGK işçi payı:</strong> ${pct(RATES.sgkEmployee)}`,
          `- <strong>İşsizlik sigortası işçi payı:</strong> ${pct(RATES.unemploymentEmployee)}`,
          `- <strong>Gelir vergisi:</strong> ${INCOME_TAX_BRACKETS_WAGE.map((b) => pct(b.rate)).join(", ")} dilimleri; ilk dilim ${tl(firstLimit)} kümülatif matraha kadar`,
          `- <strong>Damga vergisi:</strong> binde ${(RATES.stampTax * 1000).toLocaleString("tr-TR")}`,
          `Asgari ücret (${tl(MINIMUM_WAGE.gross)} brüt) üzerinden hesaplanan gelir ve damga vergisi kadar tutar her çalışanın vergisinden düşülür. Bu nedenle net asgari ücret ${tl(MINIMUM_WAGE.net)}'dir ve bu tutarın altında bir net için brüt hesaplanamaz.`,
        ],
      },
      {
        heading: `Örnek: ${tl(30000)} ve ${tl(50000)} net maaş`,
        body: [
          `<strong>${tl(30000)} net</strong> için ocak ayında gereken brüt <strong>${tl(ex30.grossSalary)}</strong>. Bu brütten ${tl(ex30.sgkEmployee)} SGK primi, ${tl(ex30.unemploymentEmployee)} işsizlik sigortası, ${tl(ex30.incomeTax)} gelir vergisi ve ${tl(ex30.stampTax)} damga vergisi kesilir.`,
          `<strong>${tl(50000)} net</strong> için ocak ayında gereken brüt <strong>${tl(ex50.grossSalary)}</strong>. Kesintilerin toplamı ${tl(ex50.grossSalary - ex50.netSalary)}'dir.`,
          "İki örnekte brüt/net oranının farklı olması, vergi istisnasının düşük maaşlarda görece daha büyük pay tutmasından kaynaklanır.",
        ],
      },
      {
        heading: "Aynı net için yıl içinde brüt neden artar?",
        body: [
          `Gelir vergisi kümülatif matraha göre hesaplandığı için yıl ilerledikçe maaşın bir kısmı daha yüksek dilime girer. Net maaşı sabit tutmak isteyen işveren brütü artırmak zorunda kalır.`,
          `Örneğin her ay ${tl(50000)} net ödenmesi için ocakta ${tl(year50[0].gross)} brüt yeterliyken aralıkta ${tl(dec50.gross)} brüt gerekir. Yıllık toplam brüt ${tl(year50.reduce((s, r) => s + r.gross, 0))} olur.`,
          "Asgari ücret istisnasının kendi kümülatif matrahı da yıl içinde dilim değiştirdiği için bazı aylarda gereken brüt bir miktar düşebilir; bu bir hata değil, istisnanın artmasının sonucudur.",
        ],
      },
      {
        heading: "Net maaşla anlaşırken nelere dikkat etmeli?",
        body: [
          "- Sözleşmede ücretin <strong>net</strong> olduğu ve vergi diliminden doğan farkın işverence karşılanacağı açıkça yazılmalıdır. Aksi hâlde yıl içinde net maaşınız düşebilir.",
          "- Kıdem ve ihbar tazminatı, fazla mesai ve yıllık izin ücreti <strong>brüt</strong> ücret üzerinden hesaplanır. Brüt tutarın bordroda doğru gösterildiğini kontrol edin.",
          "- Yemek, yol gibi yan haklar ayrıca ödeniyorsa bunların vergi ve SGK istisna sınırları net-brüt hesabını etkiler.",
          "- İşverenin size maliyeti brütün de üzerindedir; işveren SGK ve işsizlik payları eklenir.",
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} yılında net asgari ücretin brütü ne kadar?`,
        answer: `${Y} yılında net asgari ücret ${tl(MINIMUM_WAGE.net)}, brüt asgari ücret ${tl(MINIMUM_WAGE.gross)}'dir. Asgari ücretli çalışan gelir ve damga vergisi ödemez; yalnızca SGK ve işsizlik sigortası primi kesilir.`,
      },
      {
        question: "Netten brüte hesap ocak ayı dışında farklı mı çıkar?",
        answer: "Evet. Yıl içinde kümülatif vergi matrahı büyüdükçe aynı net için gereken brüt artar. Hesaplayıcıda ayı ve önceki aylardan devreden matrahı girerek o aya ait brütü bulabilirsiniz.",
      },
      {
        question: "Brüt ile net arasındaki fark yaklaşık ne kadardır?",
        answer: `İlk vergi diliminde kalan maaşlarda kesintiler brütün yaklaşık %15–20'si kadardır. Maaş yükseldikçe ve yıl ilerledikçe bu oran artar. Örneğin ocak ayında ${tl(30000)} net için brüt ${tl(ex30.grossSalary)}, ${tl(50000)} net için ${tl(ex50.grossSalary)}'dir.`,
      },
    ],
    related: [
      "brutten-nete-maas-hesaplama",
      `isveren-maliyeti-${Y}-nasil-hesaplanir`,
      `gelir-vergisi-dilimleri-${Y}`,
    ],
  },

  /* =======================================================
     TAPU HARCI
  ======================================================= */
  {
    slug: "tapu-harci-nasil-hesaplanir",
    title: "Tapu Harcı Nasıl Hesaplanır?",
    metaTitle: `Tapu Harcı Nasıl Hesaplanır? ${Y} Oranı ve Örnek`,
    description: `Tapu harcı oranı, alıcı ve satıcı payları, harcın hangi bedel üzerinden alındığı, düşük bedel beyanının cezası ve örnek hesaplama.`,
    category: "Vergi",
    icon: "🏠",
    published: "2026-11-03",
    updated: "2026-11-03",
    readingMinutes: 5,
    tool: { slug: "tapu-harci", label: "Tapu Harcı Hesaplama" },
    intro: `Konut, arsa veya işyeri alım satımında tapu devri sırasında hem alıcıdan hem satıcıdan tapu harcı alınır. Harç, ev alırken peşinattan sonra en büyük masraf kalemidir. Bu rehberde oranı, harcın hangi bedel üzerinden hesaplandığını ve düşük bedel göstermenin sonuçlarını anlatıyoruz.`,
    sections: [
      {
        heading: "Tapu harcı oranı",
        body: [
          `492 sayılı Harçlar Kanunu'na bağlı 4 sayılı tarifeye göre taşınmaz satışında harç oranı <strong>binde 20</strong>'dir (${pct(DEED_RATE)}). Bu oran alıcı ve satıcı için <strong>ayrı ayrı</strong> uygulanır; toplam harç satış bedelinin ${pct(DEED_RATE * 2)}'ü kadardır.`,
          `Kanuna göre her taraf kendi payını öder. Uygulamada tarafların anlaşmasıyla harcın tamamını alıcının ödemesi yaygındır; bu, tarafların kendi aralarındaki bir anlaşmadır.`,
        ],
      },
      {
        heading: "Harç hangi bedel üzerinden alınır?",
        body: [
          "Harç, tapuda beyan edilen satış (devir ve iktisap) bedeli üzerinden hesaplanır. Ancak beyan edilen bedel, taşınmazın <strong>emlak vergisi değerinden</strong> az olamaz. 7566 sayılı Kanunla 19.12.2025'ten itibaren tarifedeki ifade de bu şekilde netleştirildi: harç, emlak vergisi değerinden az olmamak üzere beyan edilen bedel üzerinden alınır.",
          "Beyan edilecek bedel gerçek satış bedelidir. Banka havalesi kayıtları ve konut kredisinde düzenlenen ekspertiz raporu gibi belgeler gerçek bedeli gösterdiği için düşük beyan sonradan tespit edilebilir.",
        ],
      },
      {
        heading: `Örnek: ${tl(deedExample)} satış bedeli`,
        body: [
          `- Alıcı payı: ${tl(deedExample)} × ${pct(DEED_RATE)} = <strong>${tl(deed.eachSide)}</strong>`,
          `- Satıcı payı: ${tl(deedExample)} × ${pct(DEED_RATE)} = <strong>${tl(deed.eachSide)}</strong>`,
          `- Toplam tapu harcı: <strong>${tl(deed.total)}</strong>`,
          "Bunlara ek olarak tapu müdürlüğü işlem başına döner sermaye hizmet bedeli tahsil eder. Bu tutar il ve işlem türüne göre değiştiği için harçtan ayrı düşünülmelidir.",
        ],
      },
      {
        heading: "Düşük bedel göstermenin sonuçları",
        body: [
          "Satış bedelini düşük göstermek harcı azaltmış gibi görünse de risklidir. Eksik ödenen harç tespit edildiğinde fark, gecikme faizi ve vergi ziyaı cezasıyla birlikte istenir. 7566 sayılı Kanunla bu ceza, 19.12.2025'ten itibaren eksik harcın %25'i yerine <strong>bir katı</strong> olarak uygulanmaktadır.",
          "Tapudaki bedel, alıcının ileride yapacağı satışta maliyet bedeli olarak da kullanılır; düşük beyan, beş yıl dolmadan satış yapıldığında değer artış kazancı hesabında aleyhe sonuç doğurabilir.",
        ],
      },
      {
        heading: "Ödeme ve işlem adımları",
        body: [
          "- Satış başvurusu e-Tapu veya Web Tapu üzerinden ya da tapu müdürlüğüne gidilerek yapılır.",
          "- Randevu oluşturulduktan sonra harç ve döner sermaye tutarları tahakkuk eder; ödeme anlaşmalı bankalar veya online kanallarla yapılır.",
          "- Ödeme dekontu ve kimliklerle randevu saatinde tapu müdürlüğünde imza atılır; tapu aynı gün yeni malik adına düzenlenir.",
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} yılında tapu harcı oranı kaç?`,
        answer: `Alıcı ve satıcı için ayrı ayrı binde 20 (${pct(DEED_RATE)}), toplamda ${pct(DEED_RATE * 2)}. Örneğin ${tl(deedExample)} bedelli bir evde her taraf ${tl(deed.eachSide)}, toplam ${tl(deed.total)} öder.`,
      },
      {
        question: "Tapu harcını kim öder?",
        answer: "Kanuna göre alıcı ve satıcı kendi paylarını öder. Taraflar harcın tamamının alıcı tarafından ödenmesi konusunda anlaşabilir; bu durumda alıcı toplam %4'ü öder.",
      },
      {
        question: "Satış bedeli emlak vergisi değerinden düşük olabilir mi?",
        answer: "Harç açısından hayır. Beyan edilen bedel emlak vergisi değerinin altındaysa harç emlak vergisi değeri üzerinden hesaplanır.",
      },
      {
        question: "Tapu harcı konut kredisine eklenebilir mi?",
        answer: "Genellikle hayır. Bankalar kredi tutarını ekspertiz değerine göre belirler; tapu harcı ve diğer masraflar alıcının kendi bütçesinden karşılanır. Masrafları önceden hesaplamak için konut kredisi masrafları rehberine bakabilirsiniz.",
      },
    ],
    related: ["konut-kredisi-masraflari", "emlak-vergisi-nasil-hesaplanir"],
  },
];
