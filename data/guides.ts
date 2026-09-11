/**
 * Rehber yazıları.
 *
 * Her yazı ilgili hesaplama aracına bağlıdır; okuyucu konuyu anladıktan
 * sonra doğrudan hesaplamaya geçer. Arama motoru trafiğinin ana kaynağı
 * bu sayfalardır.
 */

export type GuideSection = {
  heading: string;
  /** Paragraflar; "- " ile başlayan satırlar madde listesi olur */
  body: string[];
};

export type Guide = {
  slug: string;
  title: string;
  /** Sayfa başlığı (SEO) */
  metaTitle: string;
  description: string;
  category: "Çalışan Hakları" | "Finans" | "Vergi" | "Günlük";
  icon: string;
  /** Yayın tarihi (ISO) */
  published: string;
  updated: string;
  /** Okuma süresi (dakika) */
  readingMinutes: number;
  /** Yazının bağlandığı hesaplama aracı */
  tool: { slug: string; label: string };
  /** Giriş paragrafı */
  intro: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  /** İlgili diğer rehberler */
  related: string[];
};

export const guides: Guide[] = [
  /* =======================================================
     KIDEM TAZMİNATI
  ======================================================= */
  {
    slug: "kidem-tazminati-nasil-hesaplanir",
    title: "Kıdem Tazminatı Nasıl Hesaplanır?",
    metaTitle: "Kıdem Tazminatı Nasıl Hesaplanır? 2026 Hesaplama Rehberi",
    description:
      "Kıdem tazminatı şartları, giydirilmiş brüt ücret, kıdem tavanı ve vergi kesintileri. Örnek hesaplamalarla adım adım anlatım.",
    category: "Çalışan Hakları",
    icon: "💼",
    published: "2026-09-11",
    updated: "2026-09-11",
    readingMinutes: 7,
    tool: { slug: "kidem", label: "Kıdem Tazminatı Hesaplama" },
    intro:
      "Kıdem tazminatı, en az bir yıl çalıştıktan sonra iş sözleşmesi kanunda sayılan nedenlerle sona eren işçiye ödenen toplu paradır. Tutarı belirleyen üç şey vardır: çalışma süreniz, giydirilmiş brüt ücretiniz ve dönemin kıdem tavanı. Bu rehberde üçünü de örneklerle açıklıyoruz.",
    sections: [
      {
        heading: "Kıdem tazminatına kimler hak kazanır?",
        body: [
          "Kıdem tazminatının ilk şartı aynı işverende en az <strong>1 yıl</strong> çalışmış olmaktır. Bir yıldan kısa süreli çalışmalarda kıdem tazminatı doğmaz.",
          "İkinci şart, iş sözleşmesinin kıdeme hak kazandıran bir nedenle sona ermesidir. Bunlar şunlardır:",
          "- İşveren tarafından haklı neden olmaksızın işten çıkarılma",
          "- İşçinin haklı nedenle iş sözleşmesini feshetmesi (ücretin ödenmemesi, mobbing, sigortasız çalıştırılma gibi)",
          "- Erkek işçi için askerlik görevi",
          "- Kadın işçi için evlilik tarihinden itibaren bir yıl içinde ayrılma",
          "- Emeklilik, yaşlılık veya malullük aylığı almak amacıyla ayrılma",
          "- İşçinin ölümü (mirasçılarına ödenir)",
          "Kendi isteğiyle istifa eden işçi kural olarak kıdem tazminatı alamaz. Yukarıdaki istisnalar dışında istifa, tazminat hakkını ortadan kaldırır.",
        ],
      },
      {
        heading: "Giydirilmiş brüt ücret nedir?",
        body: [
          "Kıdem tazminatı çıplak brüt maaş üzerinden değil, <strong>giydirilmiş brüt ücret</strong> üzerinden hesaplanır. Giydirilmiş ücret, brüt maaşınıza düzenli olarak ödenen yan hakların eklenmiş hâlidir.",
          "Hesaba katılan yan haklar:",
          "- Yemek yardımı (nakit veya kart)",
          "- Yol ve ulaşım yardımı",
          "- Düzenli ödenen ikramiye ve primler",
          "- Yakacak, giyim, konut yardımı",
          "- Düzenli ödenen sosyal yardımlar",
          "Hesaba katılmayanlar: fazla mesai ücreti, yıllık izin ücreti, bir defaya mahsus ödenen primler ve arızi nitelikteki ödemeler.",
          "Örnek: Brüt maaşı 60.000 TL olan bir çalışan aylık 3.000 TL yemek ve 2.500 TL yol yardımı alıyorsa, giydirilmiş brüt ücreti 65.500 TL olur. Kıdem hesabı bu tutar üzerinden yapılır.",
        ],
      },
      {
        heading: "Kıdem tazminatı formülü",
        body: [
          "Temel formül basittir: her tam çalışma yılı için <strong>30 günlük giydirilmiş brüt ücret</strong> ödenir. Bir yıldan artan süreler ay ve gün olarak orantılanır.",
          "Kıdem tazminatı = (Giydirilmiş günlük ücret × 30) × Çalışılan yıl",
          "Örnek: 65.500 TL giydirilmiş brüt ücretle 6 yıl 4 ay çalışmış bir işçi için:",
          "- Günlük ücret: 65.500 ÷ 30 = 2.183,33 TL",
          "- Yıllık tazminat: 2.183,33 × 30 = 65.500 TL",
          "- Çalışma süresi: 6 yıl 4 ay = 6,33 yıl",
          "- Brüt kıdem tazminatı: 65.500 × 6,33 = <strong>414.615 TL</strong>",
        ],
      },
      {
        heading: "Kıdem tavanı: en kritik nokta",
        body: [
          "Kıdem tazminatında yasal bir üst sınır vardır. Giydirilmiş brüt ücretiniz ne kadar yüksek olursa olsun, her yıl için ödenecek tutar <strong>kıdem tazminatı tavanını</strong> aşamaz.",
          "Tavan tutarı her yıl <strong>ocak ve temmuz aylarında</strong> memur maaş katsayılarına göre güncellenir. Yani yılda iki kez değişir.",
          "Bu, yüksek maaşlı çalışanlar için ciddi fark yaratır. Giydirilmiş ücreti tavanın üzerinde olan bir çalışan, hesaplamada kendi ücretini değil tavan tutarını kullanır.",
          "Hesaplama yaparken mutlaka <strong>işten ayrılış tarihinizde geçerli olan</strong> tavan tutarını kullanın. Eski bir tavanla yapılan hesap yanıltıcı olur.",
        ],
      },
      {
        heading: "Kıdem tazminatından hangi vergiler kesilir?",
        body: [
          "Kıdem tazminatı vergi açısından avantajlıdır: <strong>gelir vergisi kesilmez</strong>. Yalnızca damga vergisi kesintisi yapılır.",
          "SGK primi de kesilmez. Bu nedenle kıdem tazminatının brütü ile neti arasındaki fark çok küçüktür.",
          "İhbar tazminatı ise tam tersidir: hem gelir vergisine hem damga vergisine tabidir. İkisini karıştırmamak gerekir; aynı anda alsanız bile vergileri farklı hesaplanır.",
        ],
      },
      {
        heading: "Sık yapılan hatalar",
        body: [
          "- <strong>Çıplak maaş üzerinden hesaplamak.</strong> Yemek ve yol yardımını eklemeyi unutmak tazminatı olduğundan düşük gösterir.",
          "- <strong>Eski tavan tutarını kullanmak.</strong> Tavan yılda iki kez değişir; güncel tutarı kullanın.",
          "- <strong>Fazla mesaiyi hesaba katmak.</strong> Fazla mesai ücreti giydirilmiş ücrete dâhil edilmez.",
          "- <strong>İhbar ile karıştırmak.</strong> İkisi ayrı haklardır ve vergileri farklıdır.",
          "- <strong>Kısmi yılları yok saymak.</strong> 6 yıl 4 ay çalıştıysanız 6 yıl değil, 6,33 yıl üzerinden hesaplanır.",
        ],
      },
      {
        heading: "Zamanaşımı ve ödeme zamanı",
        body: [
          "Kıdem tazminatı, iş sözleşmesinin sona erdiği tarihte muaccel olur; yani işveren derhal ödemekle yükümlüdür.",
          "Geciken ödemeler için <strong>mevduata uygulanan en yüksek faiz</strong> işletilir. Bu, normal yasal faizden yüksektir.",
          "Kıdem tazminatı alacağında zamanaşımı süresi <strong>5 yıldır</strong>. Bu süre iş sözleşmesinin feshedildiği tarihten işlemeye başlar.",
          "Ödeme yapılmazsa önce arabuluculuğa başvurmak zorunludur; anlaşma sağlanamazsa iş mahkemesinde dava açılır.",
        ],
      },
    ],
    faqs: [
      {
        question: "1 yıldan az çalışana kıdem tazminatı ödenir mi?",
        answer:
          "Hayır. Kıdem tazminatının ön şartı aynı işverende en az 1 yıl çalışmış olmaktır. 11 ay 29 gün çalışan bir işçi kıdem tazminatına hak kazanamaz.",
      },
      {
        question: "İstifa edersem kıdem tazminatı alabilir miyim?",
        answer:
          "Kural olarak hayır. Ancak askerlik, evlilik (kadın işçi için evlilikten itibaren 1 yıl içinde), emeklilik ve işverenin haklı neden doğuran davranışları (ücret ödememe, mobbing gibi) durumunda istifa etseniz de kıdem tazminatı hakkınız doğar.",
      },
      {
        question: "Kıdem tazminatından gelir vergisi kesilir mi?",
        answer:
          "Hayır. Kıdem tazminatı gelir vergisinden istisnadır; yalnızca damga vergisi kesilir. SGK primi de kesilmez.",
      },
      {
        question: "Kıdem tavanı neden önemli?",
        answer:
          "Tavan, her çalışma yılı için ödenecek azami tutarı sınırlar. Giydirilmiş brüt ücreti tavanın üzerinde olan çalışanlar, hesaplamada kendi ücretlerini değil tavan tutarını kullanır. Tavan her yıl ocak ve temmuzda güncellenir.",
      },
      {
        question: "Kıdem tazminatı ne zaman ödenmeli?",
        answer:
          "İş sözleşmesinin sona erdiği tarihte ödenmesi gerekir. Gecikmesi hâlinde mevduata uygulanan en yüksek faiz işletilir. Alacak için zamanaşımı süresi 5 yıldır.",
      },
    ],
    related: [
      "ihbar-tazminati-ve-ihbar-suresi",
      "brutten-nete-maas-hesaplama",
    ],
  },

  /* =======================================================
     NET MAAŞ
  ======================================================= */
  {
    slug: "brutten-nete-maas-hesaplama",
    title: "Brüt Maaştan Net Maaş Nasıl Hesaplanır?",
    metaTitle: "Brütten Nete Maaş Hesaplama 2026 | Kesintiler Rehberi",
    description:
      "Brüt maaştan net maaşa giden yol: SGK primi, işsizlik sigortası, gelir vergisi dilimleri, damga vergisi ve asgari ücret istisnası.",
    category: "Çalışan Hakları",
    icon: "💰",
    published: "2026-09-11",
    updated: "2026-09-11",
    readingMinutes: 6,
    tool: { slug: "net-maas", label: "Net Maaş Hesaplama" },
    intro:
      "İş görüşmesinde konuşulan rakam genelde brüttür, ama eve giren para nettir. Aradaki fark dört kesintiden oluşur: SGK primi, işsizlik sigortası, gelir vergisi ve damga vergisi. Bu rehberde her birinin nasıl hesaplandığını ve net maaşınızın yıl içinde neden düştüğünü açıklıyoruz.",
    sections: [
      {
        heading: "Brütten nete giden dört kesinti",
        body: [
          "Net maaş, brüt maaştan şu kesintiler düşülerek bulunur:",
          "- <strong>SGK işçi payı (%14):</strong> Emeklilik, sağlık ve iş kazası sigortası için kesilir.",
          "- <strong>İşsizlik sigortası işçi payı (%1):</strong> İşsiz kaldığınızda ödenek almanızı sağlar.",
          "- <strong>Gelir vergisi:</strong> Kümülatif matraha göre artan oranlı kesilir.",
          "- <strong>Damga vergisi (binde 7,59):</strong> Brüt ücret üzerinden kesilir.",
          "SGK ve işsizlik primleri brüt ücretin tamamı üzerinden değil, <strong>SGK tavanına</strong> kadar olan kısmı üzerinden hesaplanır. Tavanın üzerindeki kazançtan prim kesilmez.",
        ],
      },
      {
        heading: "Gelir vergisi matrahı nasıl bulunur?",
        body: [
          "Gelir vergisi brüt maaşın tamamı üzerinden değil, <strong>vergi matrahı</strong> üzerinden hesaplanır.",
          "Vergi matrahı = Brüt ücret − SGK işçi payı − İşsizlik işçi payı",
          "Örnek: 60.000 TL brüt maaş için",
          "- SGK işçi payı: 60.000 × %14 = 8.400 TL",
          "- İşsizlik payı: 60.000 × %1 = 600 TL",
          "- Vergi matrahı: 60.000 − 8.400 − 600 = <strong>51.000 TL</strong>",
          "Gelir vergisi bu 51.000 TL üzerinden, dilim oranlarına göre hesaplanır.",
        ],
      },
      {
        heading: "Vergi dilimleri ve yıl içinde maaşın düşmesi",
        body: [
          "Türkiye'de gelir vergisi <strong>artan oranlıdır</strong> ve dilimler yıllık kümülatif matraha göre işler. Yıl başında %15 ile başlarsınız; matrahınız biriktikçe üst dilimlere geçersiniz ve oran %20, %27, %35, %40'a kadar çıkar.",
          "Bu yüzden brüt maaşınız hiç değişmese bile <strong>net maaşınız yıl içinde düşer</strong>. Çoğu çalışanın haziran-temmuz aylarında fark ettiği bu azalma bir hata değil, dilim değişiminin sonucudur.",
          "Kümülatif matrah her yıl ocak ayında sıfırlanır; bu nedenle ocak maaşı genelde yılın en yüksek netidir.",
          "İş değiştirdiğinizde eski işyerinden gelen kümülatif matrah devam eder. Bu yüzden yıl ortasında iş değiştirenlerin ilk maaşı beklediğinden düşük çıkabilir.",
        ],
      },
      {
        heading: "Asgari ücret istisnası",
        body: [
          "Tüm çalışanlar, brüt maaşları ne olursa olsun, asgari ücrete karşılık gelen kısım için <strong>gelir vergisi ve damga vergisi istisnasından</strong> yararlanır.",
          "Bu istisna, hesaplanan vergiden düşülür. Yani 100.000 TL brüt kazanan bir çalışan da asgari ücret kadarlık kısım için vergi ödemez.",
          "İstisna tutarları asgari ücretle birlikte her yıl güncellenir. Hesaplama yaparken güncel tutarları kullanmak gerekir.",
        ],
      },
      {
        heading: "İşverene maliyet: madalyonun diğer yüzü",
        body: [
          "Brüt maaş işverenin toplam maliyeti değildir. İşveren ayrıca şu payları öder:",
          "- SGK işveren payı (genelde %20,5, teşviklerle düşebilir)",
          "- İşsizlik sigortası işveren payı (%2)",
          "Yani 60.000 TL brüt maaşın işverene maliyeti yaklaşık 73.500 TL'dir. Maaş pazarlığı yaparken bu farkı bilmek işe yarar: işverene 10.000 TL ek maliyet, size yaklaşık 8.200 TL brüt, ona da yaklaşık 5.800 TL net olarak yansır.",
        ],
      },
    ],
    faqs: [
      {
        question: "Net maaşım neden yıl içinde düşüyor?",
        answer:
          "Gelir vergisi kümülatif matraha göre artan oranlıdır. Yıl içinde kazancınız biriktikçe üst vergi dilimine geçersiniz ve kesilen vergi artar. Brüt maaşınız değişmese bile net maaşınız düşer. Matrah her ocak ayında sıfırlanır.",
      },
      {
        question: "SGK primi maaşın tamamından mı kesilir?",
        answer:
          "Hayır. SGK ve işsizlik primleri, SGK tavanına kadar olan kazanç üzerinden kesilir. Tavanın üzerindeki kısımdan prim alınmaz; bu nedenle çok yüksek maaşlarda prim oranı efektif olarak düşer.",
      },
      {
        question: "İş değiştirirsem vergi dilimim sıfırlanır mı?",
        answer:
          "Hayır. Kümülatif vergi matrahı yıl boyunca devam eder; yeni işvereniniz eski işyerinizden gelen matrahı dikkate alır. Bu yüzden yıl ortasında iş değiştirenlerin ilk maaşı beklenenden düşük çıkabilir.",
      },
      {
        question: "Asgari ücret istisnası herkese uygulanır mı?",
        answer:
          "Evet. Brüt maaşı ne olursa olsun tüm ücretliler, asgari ücrete karşılık gelen kısım için gelir vergisi ve damga vergisi istisnasından yararlanır.",
      },
    ],
    related: ["kidem-tazminati-nasil-hesaplanir", "kdv-nedir-nasil-hesaplanir"],
  },

  /* =======================================================
     İHBAR TAZMİNATI
  ======================================================= */
  {
    slug: "ihbar-tazminati-ve-ihbar-suresi",
    title: "İhbar Tazminatı ve İhbar Süresi",
    metaTitle: "İhbar Tazminatı Hesaplama 2026 | İhbar Süreleri Rehberi",
    description:
      "İhbar süreleri, ihbar tazminatı hesaplama, kimin kime ödeyeceği ve kıdem tazminatından farkları.",
    category: "Çalışan Hakları",
    icon: "📋",
    published: "2026-09-11",
    updated: "2026-09-11",
    readingMinutes: 5,
    tool: { slug: "ihbar", label: "İhbar Tazminatı Hesaplama" },
    intro:
      "İhbar tazminatı, iş sözleşmesini bildirim süresine uymadan sona erdiren tarafın diğer tarafa ödediği tutardır. Kıdem tazminatının aksine bu tazminat çift yönlüdür: usulsüz ayrılan işçi de işverene ihbar tazminatı ödemek zorunda kalabilir.",
    sections: [
      {
        heading: "İhbar süreleri ne kadar?",
        body: [
          "İhbar süresi, çalışma süresine göre kanunla belirlenmiştir:",
          "- 6 aydan az çalışma: <strong>2 hafta</strong>",
          "- 6 ay – 1,5 yıl arası: <strong>4 hafta</strong>",
          "- 1,5 yıl – 3 yıl arası: <strong>6 hafta</strong>",
          "- 3 yıldan fazla: <strong>8 hafta</strong>",
          "Bu süreler asgari sürelerdir. İş sözleşmesi veya toplu iş sözleşmesiyle artırılabilir, ancak azaltılamaz.",
        ],
      },
      {
        heading: "İhbar tazminatı nasıl hesaplanır?",
        body: [
          "İhbar tazminatı, ihbar süresine karşılık gelen giydirilmiş brüt ücrettir.",
          "İhbar tazminatı = (Giydirilmiş günlük ücret) × (İhbar süresi × 7 gün)",
          "Örnek: 4 yıl çalışmış, giydirilmiş brüt ücreti 65.500 TL olan bir işçi için:",
          "- İhbar süresi: 8 hafta = 56 gün",
          "- Günlük ücret: 65.500 ÷ 30 = 2.183,33 TL",
          "- Brüt ihbar tazminatı: 2.183,33 × 56 = <strong>122.266 TL</strong>",
          "Kıdem tazminatında olduğu gibi burada da <strong>giydirilmiş</strong> ücret kullanılır; yemek ve yol yardımı hesaba dâhildir.",
        ],
      },
      {
        heading: "Kıdem ile ihbar arasındaki farklar",
        body: [
          "İki tazminat sık karıştırılır ama önemli farkları vardır:",
          "- <strong>Yön:</strong> Kıdem sadece işverenden işçiye ödenir. İhbar iki yönlüdür; usulsüz ayrılan işçi de öder.",
          "- <strong>Süre şartı:</strong> Kıdem için en az 1 yıl gerekir. İhbarda böyle bir şart yoktur; 3 aylık çalışanın da ihbar hakkı vardır.",
          "- <strong>Vergi:</strong> Kıdemden yalnızca damga vergisi kesilir. İhbardan hem gelir vergisi hem damga vergisi kesilir.",
          "- <strong>Tavan:</strong> Kıdemde yasal tavan vardır, ihbarda yoktur.",
          "Bu yüzden ihbar tazminatının brütü ile neti arasındaki fark, kıdeme göre çok daha büyüktür.",
        ],
      },
      {
        heading: "İhbar süresi içinde iş arama izni",
        body: [
          "İhbar süresi boyunca çalışmaya devam eden işçiye, iş araması için <strong>günde en az 2 saat</strong> ücretli izin verilmesi zorunludur.",
          "İşçi isterse bu saatleri toplu olarak da kullanabilir; bu durumda ayrılacağı günden önceki günlere denk getirilir.",
          "İşveren bu izni vermezse, izin süresine ait ücreti <strong>yüzde yüz zamlı</strong> ödemek zorunda kalır.",
        ],
      },
      {
        heading: "İhbar tazminatı hangi durumlarda ödenmez?",
        body: [
          "- İşçi <strong>haklı nedenle</strong> derhal fesih hakkını kullanmışsa (ücretin ödenmemesi, mobbing gibi) ihbar tazminatı ödemez.",
          "- İşveren <strong>haklı nedenle</strong> derhal fesih yapmışsa (İş Kanunu m.25/II — ahlak ve iyi niyet kurallarına aykırılık) işçiye ihbar tazminatı ödemez.",
          "- Taraflar ihbar süresine uymuşsa tazminat doğmaz; süre çalışılarak geçirilir.",
          "- Belirli süreli iş sözleşmelerinde, sözleşme kendiliğinden sona erdiğinde ihbar tazminatı gerekmez.",
        ],
      },
    ],
    faqs: [
      {
        question: "İstifa edersem ihbar tazminatı öder miyim?",
        answer:
          "İhbar süresine uymadan aniden ayrılırsanız, işverene ihbar tazminatı ödemeniz gerekebilir. İhbar süresini çalışarak geçirirseniz veya haklı nedenle fesih yaparsanız ödeme yükümlülüğünüz doğmaz.",
      },
      {
        question: "1 yıldan az çalışan ihbar tazminatı alabilir mi?",
        answer:
          "Evet. Kıdem tazminatının aksine ihbar tazminatında asgari çalışma süresi şartı yoktur. 3 ay çalışan bir işçi de 2 haftalık ihbar hakkına sahiptir.",
      },
      {
        question: "İhbar tazminatından hangi vergiler kesilir?",
        answer:
          "İhbar tazminatı hem gelir vergisine hem damga vergisine tabidir. Kıdem tazminatında ise yalnızca damga vergisi kesilir. Bu nedenle ihbarın brüt-net farkı daha büyüktür.",
      },
      {
        question: "İş arama izni kaç saat?",
        answer:
          "İhbar süresi içinde çalışan işçiye günde en az 2 saat ücretli iş arama izni verilmelidir. İşveren bu izni kullandırmazsa, o sürenin ücretini yüzde yüz zamlı öder.",
      },
    ],
    related: [
      "kidem-tazminati-nasil-hesaplanir",
      "brutten-nete-maas-hesaplama",
    ],
  },

  /* =======================================================
     KDV
  ======================================================= */
  {
    slug: "kdv-nedir-nasil-hesaplanir",
    title: "KDV Nedir, Nasıl Hesaplanır?",
    metaTitle: "KDV Hesaplama 2026 | KDV Dahil Hariç Hesaplama Rehberi",
    description:
      "KDV oranları, KDV dahil ve hariç hesaplama, ödenecek ve devreden KDV, KDV beyannamesi mantığı.",
    category: "Vergi",
    icon: "🧮",
    published: "2026-09-11",
    updated: "2026-09-11",
    readingMinutes: 6,
    tool: { slug: "kdv", label: "KDV Hesaplama" },
    intro:
      "KDV, mal ve hizmet satışlarında alıcıdan tahsil edilip devlete aktarılan bir tüketim vergisidir. İşletmeler için KDV bir gelir değil, emanet alınan bir tutardır. Bu rehberde KDV dahil-hariç hesaplamayı, ödenecek KDV mantığını ve sık yapılan hataları anlatıyoruz.",
    sections: [
      {
        heading: "KDV oranları",
        body: [
          "Türkiye'de üç temel KDV oranı uygulanır:",
          "- <strong>%1:</strong> Temel gıda maddelerinin bir kısmı, gazete, dergi gibi ürünler",
          "- <strong>%10:</strong> Gıda, konaklama, sağlık gibi indirimli orana tabi mal ve hizmetler",
          "- <strong>%20:</strong> Genel oran; aksi belirtilmedikçe tüm mal ve hizmetler",
          "Hangi ürünün hangi orana tabi olduğu Bakanlar Kurulu kararlarıyla belirlenir ve zaman zaman değişir. Emin değilseniz mali müşavirinize danışın.",
        ],
      },
      {
        heading: "KDV hariç tutardan KDV dahil tutara",
        body: [
          "En basit yön budur. KDV hariç tutarı orana göre çarparsınız:",
          "KDV tutarı = Matrah × Oran",
          "KDV dahil toplam = Matrah + KDV tutarı",
          "Örnek: 10.000 TL'lik bir hizmet, %20 KDV ile:",
          "- KDV: 10.000 × 0,20 = 2.000 TL",
          "- KDV dahil toplam: <strong>12.000 TL</strong>",
        ],
      },
      {
        heading: "KDV dahil tutardan KDV'yi ayırmak",
        body: [
          "Elinizde yalnızca KDV dahil toplam varsa, ters hesaplama yapmanız gerekir. Burada en sık yapılan hata, toplam tutarı doğrudan %20 ile çarpmaktır — bu <strong>yanlış sonuç verir</strong>.",
          "Doğru formül:",
          "Matrah = KDV dahil tutar ÷ (1 + Oran)",
          "KDV = KDV dahil tutar − Matrah",
          "Örnek: 12.000 TL KDV dahil tutardan KDV'yi ayıralım (%20):",
          "- Matrah: 12.000 ÷ 1,20 = 10.000 TL",
          "- KDV: 12.000 − 10.000 = <strong>2.000 TL</strong>",
          "Yanlış yöntemle 12.000 × 0,20 = 2.400 TL bulunurdu; aradaki 400 TL fark, fatura kesen için ciddi bir hatadır.",
        ],
      },
      {
        heading: "Ödenecek KDV ve devreden KDV",
        body: [
          "İşletmeler iki tür KDV takip eder:",
          "- <strong>Hesaplanan KDV:</strong> Satışlarınızda müşteriden tahsil ettiğiniz KDV",
          "- <strong>İndirilecek KDV:</strong> Alışlarınızda tedarikçiye ödediğiniz KDV",
          "Ay sonunda ikisi mahsup edilir:",
          "Ödenecek KDV = Hesaplanan KDV − İndirilecek KDV",
          "Sonuç pozitifse bu tutarı devlete ödersiniz. Negatifse — yani alışlarınızın KDV'si satışlarınızınkinden fazlaysa — aradaki fark <strong>devreden KDV</strong> olarak sonraki aya aktarılır; devlet size para iadesi yapmaz, bir sonraki ayın borcundan düşülür.",
          "Bu yüzden yoğun stok alımı yapılan aylarda ödenecek KDV çıkmaz, devreden KDV birikir.",
        ],
      },
      {
        heading: "KDV neden işletmenin geliri değildir?",
        body: [
          "En yaygın muhasebe hatası, KDV dahil ciroyu gelir sanmaktır. Tahsil ettiğiniz KDV size ait değildir; devlet adına geçici olarak elinizde durur.",
          "Bu yüzden kârlılık hesabı her zaman <strong>KDV hariç (matrah)</strong> tutarlar üzerinden yapılmalıdır. KDV dahil tutarlardan kâr hesaplamak, kârınızı olduğundan yüksek gösterir.",
          "Örnek: 120.000 TL KDV dahil satış ve 60.000 TL KDV dahil alış yapan bir işletmenin kârı 60.000 TL değildir. Matrahlar 100.000 ve 50.000 TL olduğundan gerçek brüt kâr 50.000 TL'dir; aradaki 10.000 TL ödenecek KDV'dir.",
        ],
      },
      {
        heading: "Beyan ve ödeme zamanı",
        body: [
          "KDV beyannamesi, kural olarak takip eden ayın belirlenen gününe kadar verilir ve aynı dönemde ödenir. Beyan dönemleri mükellefiyet türüne göre aylık veya üç aylık olabilir.",
          "Beyanname verilmemesi veya geç verilmesi usulsüzlük cezası doğurur. Ödeme geciktiğinde gecikme zammı işler.",
          "Güncel beyan ve ödeme tarihleri Gelir İdaresi Başkanlığı tarafından duyurulur; takvimi mali müşavirinizle takip edin.",
        ],
      },
    ],
    faqs: [
      {
        question: "1.000 TL'nin %20 KDV'si kaç TL?",
        answer:
          "1.000 TL KDV hariç bir tutarsa KDV 200 TL, KDV dahil toplam 1.200 TL olur. Eğer 1.000 TL zaten KDV dahil ise, matrah 833,33 TL ve KDV 166,67 TL'dir.",
      },
      {
        question: "KDV dahil tutardan KDV nasıl bulunur?",
        answer:
          "Toplam tutarı (1 + oran) değerine bölerek matrahı bulur, sonra toplamdan matrahı çıkarırsınız. %20 için toplamı 1,20'ye bölmek gerekir. Toplamı doğrudan %20 ile çarpmak yanlış sonuç verir.",
      },
      {
        question: "Devreden KDV geri alınabilir mi?",
        answer:
          "Kural olarak nakden iade edilmez; sonraki dönemlerin ödenecek KDV'sinden mahsup edilir. İhracat ve indirimli orana tabi işlemler gibi belirli durumlarda iade talep edilebilir.",
      },
      {
        question: "Kâr hesabı KDV dahil mi yapılmalı?",
        answer:
          "Hayır. KDV işletmenin geliri değildir, devlet adına tahsil edilir. Kârlılık her zaman KDV hariç (matrah) tutarlar üzerinden hesaplanmalıdır.",
      },
    ],
    related: ["brutten-nete-maas-hesaplama", "konut-kredisi-masraflari"],
  },

  /* =======================================================
     KONUT KREDİSİ
  ======================================================= */
  {
    slug: "konut-kredisi-masraflari",
    title: "Ev Alırken Karşılaşacağınız Masraflar",
    metaTitle: "Konut Kredisi Masrafları 2026 | Ev Alım Maliyeti Rehberi",
    description:
      "Tapu harcı, ekspertiz, DASK, kredi tahsis ücreti ve diğer masraflar. Ev alırken cebinizden çıkacak gerçek tutarı hesaplayın.",
    category: "Finans",
    icon: "🏡",
    published: "2026-09-11",
    updated: "2026-09-11",
    readingMinutes: 6,
    tool: { slug: "konut-kredisi", label: "Konut Kredisi ve Masraf Hesaplama" },
    intro:
      "Ev alırken en sık yapılan hata, bütçeyi yalnızca peşinat ve taksite göre planlamaktır. Oysa tapuda ve banka sürecinde ortaya çıkan masraflar, konut bedelinin %4-6'sına ulaşabilir. Bu rehberde hangi masrafın neden çıktığını ve kaça mal olduğunu anlatıyoruz.",
    sections: [
      {
        heading: "Tapu harcı: en büyük kalem",
        body: [
          "Tapu harcı, satış bedeli üzerinden hesaplanan ve toplamda <strong>%4</strong> olan bir vergidir. Kanuna göre alıcı ve satıcı %2'şer öder.",
          "Ancak uygulamada çoğu satışta tamamı alıcıya bırakılır. Pazarlık aşamasında bunu açıkça konuşun; %2'lik fark 4 milyon TL'lik bir konutta 80.000 TL demektir.",
          "Harç, beyan edilen satış bedeli üzerinden alınır ve bu bedel <strong>emlak vergisi değerinin altında olamaz</strong>. Düşük beyan hem yasal risk hem de ileride satarken yüksek değer artışı kazancı vergisi doğurur.",
          "Tapu harcının yanında ayrıca döner sermaye ücreti ödenir.",
        ],
      },
      {
        heading: "Banka masrafları",
        body: [
          "- <strong>Ekspertiz (değerleme) ücreti:</strong> Banka, konutun gerçek piyasa değerini bağımsız bir şirkete tespit ettirir. Rapor, kullanabileceğiniz kredinin üst sınırını belirler. Ücreti genelde alıcı öder.",
          "- <strong>Kredi tahsis ücreti:</strong> Bankalar konut kredilerinde kredi tutarının <strong>binde 5'ini aşmayacak</strong> şekilde tahsis ücreti alabilir. Bu üst sınır mevzuatla belirlenmiştir; daha fazlası talep edilirse itiraz edin.",
          "- <strong>İpotek tesis masrafı:</strong> Konutun banka lehine ipotek edilmesi işlemine ait masraf.",
          "Ekspertiz raporu, konutun beyan ettiğiniz değerden düşük çıkarsa kredi tutarınız da düşer. Bu durumda aradaki farkı peşinattan karşılamanız gerekir; bütçenizde bu ihtimale pay bırakın.",
        ],
      },
      {
        heading: "Sigortalar",
        body: [
          "- <strong>DASK (Zorunlu Deprem Sigortası):</strong> Adı üstünde zorunludur. Tapu işlemleri ve kredi kullanımı için şarttır. Primi konutun büyüklüğüne, yapı tipine ve bulunduğu deprem bölgesine göre değişir.",
          "- <strong>Konut sigortası:</strong> Yasal zorunluluk değildir, ancak bankalar kredi süresince yaptırılmasını şart koşar. Yangın, su baskını, hırsızlık gibi riskleri kapsar.",
          "- <strong>Hayat sigortası:</strong> Bazı bankalar kredi şartı olarak talep eder. Zorunlu değildir; ancak reddettiğinizde faiz oranınız yükselebilir. Maliyetini faiz farkıyla karşılaştırın.",
          "Sigortaları bankanın önerdiği şirketten almak zorunda değilsiniz. Teklif toplayıp karşılaştırmak ciddi tasarruf sağlar.",
        ],
      },
      {
        heading: "Toplam nakit ihtiyacı",
        body: [
          "Tapuda hazır bulundurmanız gereken nakit = Peşinat + tüm masraflar.",
          "Örnek: 4.500.000 TL'lik bir konut, 1.500.000 TL peşinat ile alınıyorsa:",
          "- Tapu harcı (%2): 90.000 TL",
          "- Döner sermaye: yaklaşık 6.000 TL",
          "- Ekspertiz: yaklaşık 6.500 TL",
          "- DASK: yaklaşık 2.500 TL",
          "- Konut sigortası: yaklaşık 4.000 TL",
          "- Kredi tahsis ücreti (3.000.000 × binde 5): 15.000 TL",
          "- İpotek ve diğer: yaklaşık 2.000 TL",
          "Toplam masraf yaklaşık <strong>126.000 TL</strong>. Yani tapuda 1.500.000 değil, <strong>1.626.000 TL</strong> hazır olmalıdır.",
        ],
      },
      {
        heading: "Unutulan gizli maliyetler",
        body: [
          "Taşınma sonrası ortaya çıkan ve bütçeye girmeyen kalemler:",
          "- Emlakçı komisyonu (genelde satış bedelinin %2'si + KDV)",
          "- Taşınma masrafları",
          "- Tadilat, boya, mutfak-banyo yenileme",
          "- Abonelik açılışları (elektrik, su, doğalgaz güvence bedelleri)",
          "- İlk yıl emlak vergisi ve aidat",
          "Bu kalemler kolayca 100.000 TL'yi bulur. Ev bütçesi yaparken konut bedelinin üzerine <strong>%8-10</strong> pay bırakmak gerçekçi bir yaklaşımdır.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ev alırken tapu harcını kim öder?",
        answer:
          "Kanunen alıcı ve satıcı %2'şer öder, toplam %4'tür. Ancak uygulamada çoğu zaman tamamı alıcıya bırakılır. Bu, pazarlık konusudur; sözleşme öncesinde netleştirin.",
      },
      {
        question: "Kredi tahsis ücreti ne kadar olabilir?",
        answer:
          "Konut kredilerinde kredi tutarının binde 5'ini aşamaz. Bu üst sınır mevzuatla belirlenmiştir; daha yüksek bir tutar talep edilirse bankaya itiraz edebilirsiniz.",
      },
      {
        question: "Bankanın istediği sigortayı yaptırmak zorunda mıyım?",
        answer:
          "DASK zorunludur. Konut ve hayat sigortasında ise bankanın anlaşmalı şirketini kullanma zorunluluğunuz yoktur; başka şirketlerden teklif alıp karşılaştırabilirsiniz.",
      },
      {
        question: "Ev alırken toplam ne kadar masraf çıkar?",
        answer:
          "Tapu harcı, ekspertiz, sigortalar ve banka masrafları toplamda konut bedelinin %4-6'sını bulur. Emlakçı komisyonu, taşınma ve tadilat da eklendiğinde %8-10'a çıkabilir.",
      },
    ],
    related: ["kdv-nedir-nasil-hesaplanir", "brutten-nete-maas-hesaplama"],
  },
];

export function findGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function guidesForTool(toolSlug: string) {
  return guides.filter((g) => g.tool.slug === toolSlug);
}
