/**
 * Çalışan hakları rehberleri: fazla mesai, kıdem + ihbar, yıllık izin,
 * emeklilik, doğum izni, işsizlik maaşı.
 *
 * Sık değişen resmî tutarlar (asgari ücret, tavanlar) rakamla yazılmaz;
 * örneklerdeki tutarlar açıkça örnek olarak verilir.
 */

import type { Guide } from "@/data/guides";

export const calisanGuides: Guide[] = [
  /* =======================================================
     FAZLA MESAİ
  ======================================================= */
  {
    slug: "fazla-mesai-ucreti-nasil-hesaplanir",
    title: "Fazla Mesai Ücreti Nasıl Hesaplanır?",
    metaTitle: "Fazla Mesai Ücreti Nasıl Hesaplanır? %50 Zam ve Örnekler",
    description:
      "Haftalık 45 saat sınırı, saatlik ücretin bulunması, %50 zamlı fazla mesai ve %25 zamlı fazla süreli çalışma. Örneklerle adım adım.",
    category: "Çalışan Hakları",
    icon: "⏱️",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 6,
    tool: { slug: "fazla-mesai", label: "Fazla Mesai Hesaplama" },
    intro:
      "Haftalık yasal çalışma süresini aşan her saat için işçiye zamlı ücret ödenir. Hesabın özü üç adımdır: saatlik ücreti bulmak, fazla çalışılan saati doğru saymak ve doğru zam oranını uygulamak. Bu rehberde üçünü de örneklerle anlatıyoruz.",
    sections: [
      {
        heading: "Fazla mesai ne zaman başlar?",
        body: [
          "İş Kanunu'na göre haftalık en fazla çalışma süresi <strong>45 saattir</strong>. Bu süreyi aşan çalışmalar <strong>fazla çalışma (fazla mesai)</strong> sayılır.",
          "Günlük değil haftalık toplam esas alınır. Örneğin bir gün 10 saat, başka bir gün 6 saat çalışıp haftayı 45 saatte tamamlarsanız fazla mesai doğmaz.",
          "Sözleşmenizde haftalık süre 45 saatten azsa (örneğin 40 saat), 40 ile 45 saat arasındaki çalışmalar <strong>fazla süreli çalışma</strong> adını alır ve farklı bir oranla ödenir.",
        ],
      },
      {
        heading: "Saatlik ücret nasıl bulunur?",
        body: [
          "Aylık ücretli çalışanlarda saatlik ücret genellikle şu formülle bulunur:",
          "Saatlik ücret = Aylık brüt ücret ÷ 225",
          "225 sayısı, 30 günlük ay ve günlük ortalama 7,5 saatlik çalışmadan gelir (30 × 7,5).",
          "Örnek: Aylık brüt ücreti 45.000 TL olan çalışanın saatlik ücreti 45.000 ÷ 225 = <strong>200 TL</strong> olur.",
        ],
      },
      {
        heading: "Zam oranları: %50 ve %25",
        body: [
          "- <strong>Fazla çalışma</strong> (45 saati aşan): her saat için normal saatlik ücretin <strong>%50 fazlası</strong>, yani 1,5 katı ödenir.",
          "- <strong>Fazla süreli çalışma</strong> (sözleşmedeki süre ile 45 saat arası): her saat için <strong>%25 fazlası</strong>, yani 1,25 katı ödenir.",
          "Örnek: Saatlik ücreti 200 TL olan çalışan bir ayda 10 saat fazla mesai yaptıysa:",
          "- Fazla mesai saat ücreti: 200 × 1,5 = 300 TL",
          "- Aylık fazla mesai: 300 × 10 = <strong>3.000 TL brüt</strong>",
          "Fazla mesai ücreti brüttür; normal maaş gibi SGK primi, gelir vergisi ve damga vergisi kesintisine tabidir.",
        ],
      },
      {
        heading: "Ücret yerine serbest zaman",
        body: [
          "İşçi isterse fazla mesai ücreti yerine serbest zaman kullanabilir. Bu durumda her bir saat fazla çalışma için <strong>1 saat 30 dakika</strong>, her bir saat fazla süreli çalışma için <strong>1 saat 15 dakika</strong> serbest zaman verilir.",
          "Serbest zaman altı ay içinde, çalışma süresi içinde ve ücret kesintisi yapılmadan kullandırılmalıdır.",
        ],
      },
      {
        heading: "Yıllık sınır ve onay",
        body: [
          "Fazla çalışma yılda <strong>270 saati</strong> geçemez. Fazla çalışma yaptırılabilmesi için işçinin yazılı onayı gerekir; bu onay genellikle iş sözleşmesine eklenir.",
          "Denkleştirme uygulanan işyerlerinde, iki aylık dönem içinde haftalık ortalama 45 saati aşmayan çalışmalar fazla mesai sayılmaz. Bordronuzda fazla mesai görmüyorsanız önce denkleştirme uygulanıp uygulanmadığını sorun.",
        ],
      },
    ],
    faqs: [
      {
        question: "Fazla mesai ücreti kaç kat ödenir?",
        answer:
          "Haftalık 45 saati aşan her saat için normal saatlik ücretin 1,5 katı ödenir. Sözleşmedeki süre 45 saatten azsa, o süre ile 45 saat arasındaki çalışma 1,25 kat ödenir.",
      },
      {
        question: "Saatlik ücret neden 225'e bölünerek bulunur?",
        answer:
          "Aylık ücret 30 günü karşılar ve günlük ortalama çalışma 7,5 saat kabul edilir. 30 × 7,5 = 225 saat olduğundan aylık brüt ücret 225'e bölünür.",
      },
      {
        question: "Fazla mesai ücretinden vergi kesilir mi?",
        answer:
          "Evet. Fazla mesai ücreti normal ücretin parçasıdır; SGK primi, işsizlik sigortası primi, gelir vergisi ve damga vergisi kesilir.",
      },
      {
        question: "Ödenmeyen fazla mesai ücreti için ne yapabilirim?",
        answer:
          "Alacak için zamanaşımı 5 yıldır. Önce zorunlu arabuluculuğa başvurulur, anlaşma olmazsa iş mahkemesinde dava açılır. Giriş-çıkış kayıtları, mesajlar ve tanık beyanları delil olarak kullanılabilir.",
      },
    ],
    related: ["brutten-nete-maas-hesaplama", "yillik-izin-suresi-nasil-hesaplanir"],
  },

  /* =======================================================
     KIDEM + İHBAR BİRLİKTE
  ======================================================= */
  {
    slug: "kidem-ve-ihbar-tazminati-birlikte-hesaplama",
    title: "Kıdem ve İhbar Tazminatı Birlikte Nasıl Hesaplanır?",
    metaTitle: "Kıdem ve İhbar Tazminatı Birlikte Hesaplama: Toplam Alacak Rehberi",
    description:
      "İşten çıkarılınca kıdem ve ihbar tazminatı birlikte nasıl hesaplanır, vergileri neden farklıdır, toplam net alacak nasıl bulunur? Örnekli anlatım.",
    category: "Çalışan Hakları",
    icon: "🧾",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 6,
    tool: { slug: "kidem-ihbar", label: "Kıdem + İhbar Birlikte Hesaplama" },
    intro:
      "İşveren tarafından haklı bir neden olmadan ve bildirim süresine uyulmadan işten çıkarılan çalışan, çoğu zaman kıdem ve ihbar tazminatını birlikte alır. İkisi aynı ücret üzerinden hesaplansa da şartları ve vergileri farklıdır. Toplam alacağı doğru görmek için ikisini ayrı hesaplayıp sonra birleştirmek gerekir.",
    sections: [
      {
        heading: "İki tazminatın farkı",
        body: [
          "- <strong>Kıdem tazminatı</strong>, en az 1 yıllık çalışmanın karşılığıdır. Her tam yıl için 30 günlük giydirilmiş brüt ücret ödenir ve yıllık tutar kıdem tavanını aşamaz.",
          "- <strong>İhbar tazminatı</strong>, işverenin yasal bildirim süresine uymamasının karşılığıdır. Bildirim süresi kadar ücret ödenir; tavan uygulanmaz.",
          "Aynı işten çıkarmada ikisi birden doğabilir; biri diğerini ortadan kaldırmaz.",
        ],
      },
      {
        heading: "İhbar süreleri",
        body: [
          "İhbar tazminatı çalışma süresine göre belirlenen bildirim süresi üzerinden hesaplanır:",
          "- 6 aydan az: <strong>2 hafta</strong>",
          "- 6 ay – 1,5 yıl: <strong>4 hafta</strong>",
          "- 1,5 yıl – 3 yıl: <strong>6 hafta</strong>",
          "- 3 yıldan fazla: <strong>8 hafta</strong>",
        ],
      },
      {
        heading: "Örnek: toplam alacağın hesabı",
        body: [
          "6 yıl 4 ay çalışmış, giydirilmiş brüt ücreti 65.500 TL olan ve bildirimsiz işten çıkarılan bir çalışan düşünelim. Ücretin tavanın altında kaldığını varsayıyoruz.",
          "- Günlük giydirilmiş ücret: 65.500 ÷ 30 = 2.183,33 TL",
          "- Brüt kıdem tazminatı: 65.500 × 6,33 yıl ≈ <strong>414.615 TL</strong>",
          "- İhbar süresi: 3 yıldan fazla çalıştığı için 8 hafta = 56 gün",
          "- Brüt ihbar tazminatı: 2.183,33 × 56 ≈ <strong>122.267 TL</strong>",
          "Toplam brüt alacak yaklaşık 536.882 TL'dir. Net tutar ise vergiler farklı olduğu için ayrı ayrı hesaplanır.",
        ],
      },
      {
        heading: "Vergiler neden farklı?",
        body: [
          "- <strong>Kıdem tazminatından</strong> yalnızca damga vergisi (binde 7,59) kesilir. Gelir vergisi ve SGK primi kesilmez.",
          "- <strong>İhbar tazminatından</strong> hem gelir vergisi hem damga vergisi kesilir. Gelir vergisi, çalışanın yıl içindeki kümülatif matrahına göre belirlenen dilimden hesaplanır.",
          "Bu nedenle ihbar tazminatının neti, brütüne göre belirgin şekilde düşer. Yılın sonlarına doğru işten çıkarılanlarda üst vergi dilimine girildiği için fark daha da büyüyebilir.",
        ],
      },
      {
        heading: "Dikkat edilmesi gerekenler",
        body: [
          "- Kıdem hesabında <strong>işten ayrılış tarihindeki kıdem tavanını</strong> kullanın; tavan yılda iki kez güncellenir.",
          "- Kullanılmamış yıllık izin ücreti de fesihte ödenir; toplam alacağa ekleyin.",
          "- İstifa eden çalışan ihbar tazminatı alamaz; bildirim süresine uymadan istifa ederse işverene ihbar tazminatı ödemesi gerekebilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kıdem ve ihbar tazminatı aynı anda alınabilir mi?",
        answer:
          "Evet. İşveren haklı neden olmadan işten çıkarır ve bildirim süresini beklemeden sözleşmeyi sona erdirirse ikisi birlikte ödenir.",
      },
      {
        question: "İhbar tazminatına tavan uygulanır mı?",
        answer:
          "Hayır. Tavan yalnızca kıdem tazminatında uygulanır. İhbar tazminatı giydirilmiş brüt ücretin tamamı üzerinden hesaplanır.",
      },
      {
        question: "İşveren ihbar süresini çalıştırarak geçirirse ne olur?",
        answer:
          "İşveren bildirim süresini tanıyıp o süre boyunca çalıştırırsa ihbar tazminatı doğmaz. Bu süre içinde işçiye yeni iş araması için günde en az 2 saat izin verilmesi gerekir.",
      },
    ],
    related: ["kidem-tazminati-nasil-hesaplanir", "ihbar-tazminati-ve-ihbar-suresi"],
  },

  /* =======================================================
     YILLIK İZİN
  ======================================================= */
  {
    slug: "yillik-izin-suresi-nasil-hesaplanir",
    title: "Yıllık İzin Süresi Nasıl Hesaplanır?",
    metaTitle: "Yıllık İzin Süresi Nasıl Hesaplanır? 14, 20 ve 26 Gün Kuralı",
    description:
      "Kıdeme göre 14, 20 ve 26 günlük izin hakları, yaşa bağlı istisnalar, hafta tatili ve resmî tatillerin sayılmaması, kullanılmayan izin ücreti.",
    category: "Çalışan Hakları",
    icon: "🏖️",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 5,
    tool: { slug: "yillik-izin", label: "Yıllık İzin Hesaplama" },
    intro:
      "Yıllık ücretli izin, aynı işyerinde en az bir yıl çalışan her işçinin hakkıdır ve süresi kıdeme göre artar. İzin süresini belirlerken hafta tatilleri ve resmî tatiller hesaba katılmaz; bu yüzden takvimde gördüğünüz izin, yasal izin gününden uzun olabilir.",
    sections: [
      {
        heading: "Kıdeme göre izin süreleri",
        body: [
          "- 1 yıldan 5 yıla kadar (5 yıl hariç): <strong>14 gün</strong>",
          "- 5 yıldan 15 yıla kadar (15 yıl hariç): <strong>20 gün</strong>",
          "- 15 yıl ve daha fazla: <strong>26 gün</strong>",
          "Bu süreler yasal alt sınırdır. İş sözleşmesi veya toplu sözleşmeyle daha uzun izin verilebilir, daha kısa verilemez.",
        ],
      },
      {
        heading: "Yaşa bağlı istisna",
        body: [
          "<strong>18 yaşından küçük</strong> ve <strong>50 yaşından büyük</strong> işçilere verilecek yıllık izin süresi <strong>20 günden az olamaz</strong>.",
          "Örnek: 52 yaşında, 2 yıldır çalışan bir işçinin kıdemi 14 güne karşılık gelse de en az 20 gün izin hakkı vardır.",
        ],
      },
      {
        heading: "Hangi günler izinden sayılmaz?",
        body: [
          "İzin süresi hesaplanırken şu günler izin gününden düşülmez, izne eklenir:",
          "- Hafta tatili günleri",
          "- Ulusal bayram ve genel tatil günleri",
          "Örnek: Cumartesi çalışmayan bir işçi 14 günlük iznini kullanırken araya giren cumartesi-pazar günleri ve resmî tatiller sayılmaz. Bu yüzden izin takvimde yaklaşık 2,5 – 3 haftaya yayılır.",
        ],
      },
      {
        heading: "İzin nasıl kullanılır?",
        body: [
          "İzin kural olarak bölünemez. Ancak taraflar anlaşırsa, bir bölümü <strong>10 günden az olmamak</strong> üzere en fazla üçe bölünebilir.",
          "İşveren izin tarihini işyerinin işleyişine göre belirleyebilir; ancak izni hiç kullandırmamak ya da ücretini ödeyerek izin hakkını ortadan kaldırmak iş devam ederken mümkün değildir.",
          "İzin başlamadan önce izin süresine ait ücret peşin ödenir veya avans olarak verilir.",
        ],
      },
      {
        heading: "Kullanılmayan izin ücreti",
        body: [
          "İş sözleşmesi hangi nedenle sona ererse ersin, kullanılmamış yıllık izin günlerinin ücreti işçiye ödenir. İstifa etmek bu hakkı ortadan kaldırmaz.",
          "Hesap, sözleşmenin sona erdiği tarihteki ücret üzerinden yapılır: günlük brüt ücret × kullanılmayan izin günü.",
          "Kullanılmayan izin ücreti alacağında zamanaşımı, sözleşmenin sona erdiği tarihten itibaren 5 yıldır.",
        ],
      },
    ],
    faqs: [
      {
        question: "5 yılı doldurduğum gün izin hakkım 20 güne çıkar mı?",
        answer:
          "Evet. 5. hizmet yılını doldurduğunuz tarihten itibaren hak kazanacağınız izin 20 gündür. Aynı şekilde 15. yılı doldurduğunuzda 26 güne çıkar.",
      },
      {
        question: "Cumartesi günleri izinden sayılır mı?",
        answer:
          "Cumartesi işyerinde çalışma günü değilse, yani hafta tatili kapsamındaysa izinden sayılmaz. Cumartesi çalışılan işyerlerinde ise iş günü olarak izinden düşülür.",
      },
      {
        question: "İstifa edersem kullanmadığım izinlerin parası ödenir mi?",
        answer:
          "Evet. Sözleşme hangi nedenle sona ererse ersin kullanılmamış izin ücreti ödenir.",
      },
    ],
    related: ["fazla-mesai-ucreti-nasil-hesaplanir", "kidem-tazminati-nasil-hesaplanir"],
  },

  /* =======================================================
     EMEKLİLİK / EYT
  ======================================================= */
  {
    slug: "emeklilik-ne-zaman-eyt-sartlari",
    title: "Ne Zaman Emekli Olurum? EYT ve Emeklilik Şartları",
    metaTitle: "Ne Zaman Emekli Olurum? EYT, Prim Günü ve Yaş Şartları Rehberi",
    description:
      "Sigorta başlangıç tarihine göre emeklilik şartları: EYT kapsamı, prim günü, sigortalılık süresi ve yaş şartı. Borçlanma ile emekliliği öne çekme.",
    category: "Çalışan Hakları",
    icon: "🎯",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 7,
    tool: { slug: "emeklilik", label: "Emeklilik / EYT Hesaplama" },
    intro:
      "Emeklilik şartlarınızı belirleyen en önemli bilgi, <strong>ilk sigorta girişinizin tarihidir</strong>. Aynı yaşta ve aynı prim gününe sahip iki kişi, sigortaya farklı yıllarda girdiyse çok farklı tarihlerde emekli olabilir. Bu rehber SSK (4/A) kapsamındaki çalışanlar için temel kuralları özetler.",
    sections: [
      {
        heading: "1. adım: sigorta başlangıç tarihinizi öğrenin",
        body: [
          "e-Devlet'te SGK'nın <strong>4A Hizmet Dökümü</strong> hizmetinden ilk işe giriş tarihinizi ve toplam prim gününüzü görebilirsiniz.",
          "Dikkat: Stajyerlik, çıraklık veya yurt dışı çalışmaları gibi kayıtlar sigorta başlangıcını daha eski bir tarihe çekebilir. Dökümü tarihleriyle birlikte inceleyin.",
        ],
      },
      {
        heading: "8 Eylül 1999 öncesi girenler (EYT kapsamı)",
        body: [
          "2023'teki düzenlemeyle bu gruptaki çalışanlar için <strong>yaş şartı kaldırıldı</strong>. Emeklilik için iki şartın birlikte sağlanması gerekir:",
          "- <strong>Sigortalılık süresi:</strong> kadınlarda 20 yıl, erkeklerde 25 yıl",
          "- <strong>Prim günü:</strong> giriş tarihine göre kademeli olarak 5.000 ile 5.975 gün arası",
          "Sigortalılık süresi, ilk girişten bugüne geçen takvim süresidir; arada çalışmadığınız dönemler de bu süreye dâhildir. Prim günü ise fiilen prim ödenen günlerin toplamıdır.",
        ],
      },
      {
        heading: "8 Eylül 1999 – 30 Nisan 2008 arası girenler",
        body: [
          "Bu grupta temel şart <strong>7.000 prim günü</strong> ile birlikte kadınlarda <strong>58</strong>, erkeklerde <strong>60 yaşı</strong> doldurmaktır.",
          "Alternatif olarak, 25 yıl sigortalılık süresi ve 4.500 prim günü ile birlikte yaş şartını (kadın 58, erkek 60) sağlayanlar da emekli olabilir.",
        ],
      },
      {
        heading: "1 Mayıs 2008 ve sonrası girenler",
        body: [
          "Bu grupta şart <strong>7.200 prim günü</strong> ve yaş şartıdır. Yaş şartı bugün kadınlarda 58, erkeklerde 60'tır ve 2036 yılından itibaren kademeli olarak artarak <strong>65'e</strong> çıkacaktır.",
          "Yani bu gruptakiler için emeklilik yaşını, prim gününü tamamladıkları yılın hangi kademeye denk geldiği belirler.",
        ],
      },
      {
        heading: "Borçlanma ile emekliliği öne çekmek",
        body: [
          "Bazı süreleri prim ödeyerek sigortalılığınıza ekleyebilirsiniz. En yaygın borçlanma türleri:",
          "- <strong>Askerlik borçlanması:</strong> askerlikte geçen süre prim gününe eklenir. İlk işe girişten önceki askerlik, sigorta başlangıcını da geriye çekebilir.",
          "- <strong>Doğum borçlanması:</strong> kadın sigortalılar doğum sonrası çalışmadıkları süreler için borçlanabilir.",
          "- <strong>Yurt dışı borçlanması:</strong> yurt dışında geçen çalışma süreleri için yapılır.",
          "Borçlanmanın emeklilik tarihinizi ne kadar öne çektiğini hesaplamadan ödeme yapmayın; bazen yalnızca prim gününü artırır, tarihi değiştirmez.",
        ],
      },
      {
        heading: "Kesin sonuç için",
        body: [
          "Bu rehberdeki kurallar genel çerçeveyi verir; kademeli tablolar giriş tarihinize göre gün bazında değişir. Kesin emeklilik tarihiniz için e-Devlet'teki SGK hizmetlerini kullanın veya bir SGK müdürlüğünden hizmet dökümünüzle birlikte bilgi alın.",
        ],
      },
    ],
    faqs: [
      {
        question: "EYT'den kimler yararlanır?",
        answer:
          "İlk sigorta girişi 8 Eylül 1999 ve öncesi olanlar. Bu kişiler için yaş şartı aranmaz; sigortalılık süresi (kadın 20, erkek 25 yıl) ve giriş tarihine göre belirlenen prim günü şartı yeterlidir.",
      },
      {
        question: "Sigortalılık süresi ile prim günü aynı şey mi?",
        answer:
          "Hayır. Sigortalılık süresi ilk girişten bugüne geçen takvim süresidir. Prim günü ise fiilen prim ödenmiş günlerin toplamıdır. Arada çalışılmayan yıllar sigortalılık süresine sayılır ama prim gününe eklenmez.",
      },
      {
        question: "Stajyerlik sigortası emeklilikte sayılır mı?",
        answer:
          "Stajyerlik döneminde yalnızca iş kazası ve meslek hastalığı sigortası yapıldığından bu süre kural olarak sigorta başlangıcı sayılmaz. Çıraklık sözleşmeli dönemler için ise durum farklı olabilir; güncel mevzuatı SGK'dan teyit edin.",
      },
      {
        question: "Askerlik borçlanması emekliliği öne çeker mi?",
        answer:
          "Prim gününüzü mutlaka artırır. Askerlik ilk işe girişinizden önceyse, borçlanılan gün kadar sigorta başlangıç tarihiniz de geriye çekilir; bu da emeklilik tarihini öne alabilir.",
      },
    ],
    related: ["kidem-tazminati-nasil-hesaplanir", "bes-birikim-ve-devlet-katkisi"],
  },

  /* =======================================================
     DOĞUM VE SÜT İZNİ
  ======================================================= */
  {
    slug: "dogum-izni-ve-sut-izni",
    title: "Doğum İzni ve Süt İzni Nasıl Hesaplanır?",
    metaTitle: "Doğum İzni ve Süt İzni: Süreler, Analık Ödeneği ve Hesaplama",
    description:
      "Doğum öncesi ve sonrası izin süreleri, çoğul gebelik, süt izni, SGK analık ödeneği ve hesaplanması. Çalışan anneler için adım adım rehber.",
    category: "Çalışan Hakları",
    icon: "👶",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 6,
    tool: { slug: "dogum-izni", label: "Doğum ve Süt İzni Hesaplama" },
    intro:
      "Çalışan kadınların doğum öncesi ve sonrası ücretli izin hakkı İş Kanunu ile güvence altındadır. İzin süresince işveren maaş ödemez; bunun yerine şartları sağlayan sigortalıya SGK tarafından <strong>analık ödeneği</strong> verilir. Bu rehberde izin sürelerini, süt iznini ve ödeneğin hesaplanmasını anlatıyoruz.",
    sections: [
      {
        heading: "Doğum izni süreleri",
        body: [
          "Kadın işçiye toplam <strong>16 hafta</strong> doğum izni verilir:",
          "- Doğumdan önce <strong>8 hafta</strong>",
          "- Doğumdan sonra <strong>8 hafta</strong>",
          "<strong>Çoğul gebelikte</strong> doğum öncesi süreye 2 hafta eklenir; toplam izin 18 hafta olur.",
          "Sağlık durumu uygunsa ve doktor onaylarsa, kadın işçi doğumdan önceki 3 haftaya kadar çalışabilir. Bu durumda çalıştığı süreler doğum sonrası izne eklenir.",
          "Erken doğumda, doğumdan önce kullanılamayan izin süresi doğum sonrasına eklenir.",
        ],
      },
      {
        heading: "Analık ödeneği nasıl hesaplanır?",
        body: [
          "İzin süresince SGK'dan analık ödeneği alınabilmesi için doğumdan önceki bir yıl içinde <strong>en az 90 gün</strong> kısa vadeli sigorta primi bildirilmiş olması gerekir.",
          "Ödenek, günlük kazancın <strong>üçte ikisi</strong> üzerinden ve fiilen çalışılmayan her gün için ödenir. Günlük kazanç, son 12 ayda prim bildirilen son 3 aylık kazanç üzerinden belirlenir.",
          "Örnek: Günlük kazancı 1.500 TL olan bir sigortalı için:",
          "- Günlük analık ödeneği: 1.500 × 2/3 = 1.000 TL",
          "- 16 hafta (112 gün) için toplam: 1.000 × 112 = <strong>112.000 TL</strong>",
          "Ödeneğin hesaplanmasında kullanılan günlük kazanca yasal bir üst sınır uygulanır.",
        ],
      },
      {
        heading: "Süt izni",
        body: [
          "Bir yaşından küçük çocuğu olan kadın işçiye çocuğunu emzirmesi için günde toplam <strong>1,5 saat</strong> süt izni verilir.",
          "Süt izninin hangi saatlerde ve kaç parça kullanılacağını işçi kendisi belirler. Bu süre günlük çalışma süresinden sayılır; ücretten kesinti yapılamaz.",
          "Uygulamada birçok işyerinde süt izni, işçi ile işveren anlaşarak haftalık toplam süre şeklinde birleştirilip kullanılır.",
        ],
      },
      {
        heading: "Doğum sonrası diğer haklar",
        body: [
          "- <strong>Ücretsiz izin:</strong> Doğum sonrası izin bitiminde kadın işçiye talebi hâlinde 6 aya kadar ücretsiz izin verilir.",
          "- <strong>Yarım çalışma:</strong> Doğum sonrası izin bitiminden itibaren belirli bir süre haftalık çalışma süresinin yarısı kadar ücretsiz izin kullanılabilir; bu süre için şartları sağlayanlara ödenek verilir.",
          "- <strong>Kısmi süreli çalışma:</strong> Ebeveynlerden biri, çocuk mecburi ilköğretim çağına gelinceye kadar kısmi süreli çalışma talep edebilir.",
          "- <strong>Babalık izni:</strong> Eşi doğum yapan erkek işçiye ücretli doğum izni verilir.",
        ],
      },
      {
        heading: "Önemli not",
        body: [
          "Doğum ve babalık izni süreleri zaman zaman yasal düzenlemelerle değiştirilebilmektedir. İzin planınızı yapmadan önce güncel süreleri işyerinizin insan kaynakları birimi, SGK veya ALO 170 hattından teyit edin.",
        ],
      },
    ],
    faqs: [
      {
        question: "Doğum izninde maaşımı işveren mi öder?",
        answer:
          "Hayır. Doğum izni süresince işveren ücret ödemekle yükümlü değildir. Şartları sağlayan sigortalıya SGK tarafından analık ödeneği verilir. Bazı işverenler toplu veya bireysel sözleşmeyle aradaki farkı ayrıca öder.",
      },
      {
        question: "Analık ödeneği için kaç gün prim gerekir?",
        answer:
          "Doğumdan önceki bir yıl içinde en az 90 gün kısa vadeli sigorta primi bildirilmiş olmalıdır.",
      },
      {
        question: "Süt izni hangi saatlerde kullanılır?",
        answer:
          "Süt izninin saatlerini ve kaç parça kullanılacağını işçi belirler. Günde toplam 1,5 saattir ve çalışma süresinden sayılır.",
      },
    ],
    related: ["yillik-izin-suresi-nasil-hesaplanir", "brutten-nete-maas-hesaplama"],
  },

  /* =======================================================
     İŞSİZLİK MAAŞI
  ======================================================= */
  {
    slug: "isizlik-maasi-sartlari-ve-hesaplama",
    title: "İşsizlik Maaşı Şartları ve Hesaplama",
    metaTitle: "İşsizlik Maaşı Nasıl Hesaplanır? Şartlar, Süre ve Tutar Rehberi",
    description:
      "İşsizlik maaşı için 600 gün prim ve 120 gün kesintisiz çalışma şartı, maaş süreleri, tutarın hesaplanması ve İŞKUR başvurusu. Örnekli anlatım.",
    category: "Çalışan Hakları",
    icon: "🛟",
    published: "2026-09-13",
    updated: "2026-09-13",
    readingMinutes: 5,
    tool: { slug: "issizlik-maasi", label: "İşsizlik Maaşı Hesaplama" },
    intro:
      "İşsizlik maaşı (işsizlik ödeneği), kendi isteği ve kusuru dışında işini kaybeden sigortalılara İŞKUR tarafından belirli bir süre ödenen gelirdir. Hak kazanmak için prim şartını sağlamak ve süresi içinde başvurmak gerekir. Tutar ise son aylardaki kazancınıza göre hesaplanır.",
    sections: [
      {
        heading: "Hak kazanma şartları",
        body: [
          "- Son 3 yıl içinde en az <strong>600 gün</strong> işsizlik sigortası primi ödenmiş olması",
          "- İşten ayrılmadan önceki son <strong>120 gün</strong> kesintisiz prim ödenmiş olması",
          "- İş sözleşmesinin <strong>kendi isteği ve kusuru dışında</strong> sona ermesi",
          "- İşten ayrıldıktan sonra <strong>30 gün içinde</strong> İŞKUR'a başvurulması",
          "Kendi isteğiyle istifa edenler ve ahlak ve iyi niyet kurallarına aykırı davranış nedeniyle çıkarılanlar işsizlik maaşı alamaz. Ancak ücretin ödenmemesi gibi haklı nedenlerle istifa edenler hak kazanabilir.",
        ],
      },
      {
        heading: "İşsizlik maaşı kaç ay ödenir?",
        body: [
          "Süre, son 3 yıldaki prim gününe göre belirlenir:",
          "- 600 gün prim: <strong>180 gün</strong> (6 ay)",
          "- 900 gün prim: <strong>240 gün</strong> (8 ay)",
          "- 1.080 gün prim: <strong>300 gün</strong> (10 ay)",
        ],
      },
      {
        heading: "Tutar nasıl hesaplanır?",
        body: [
          "İşsizlik maaşı, son 4 aylık prime esas brüt kazançların ortalamasının <strong>%40'ı</strong> kadardır.",
          "Bu tutar, <strong>aylık brüt asgari ücretin %80'ini</strong> geçemez. Yüksek maaşlı çalışanlar üst sınıra takılır.",
          "Ödenekten yalnızca <strong>damga vergisi</strong> kesilir.",
          "Örnek: Son 4 aylık brüt kazanç ortalaması 40.000 TL olan ve üst sınıra takılmayan bir kişi için:",
          "- Brüt işsizlik maaşı: 40.000 × %40 = 16.000 TL",
          "- Damga vergisi: 16.000 × binde 7,59 ≈ 121 TL",
          "- Net aylık ödeme: ≈ <strong>15.879 TL</strong>",
        ],
      },
      {
        heading: "Başvuru ve ödeme",
        body: [
          "Başvuru e-Devlet üzerinden veya İŞKUR il müdürlüklerinden yapılabilir. İşten ayrılış bildirgesinin işveren tarafından SGK'ya doğru kodla bildirilmiş olması gerekir.",
          "30 günlük başvuru süresi geçirilirse hak tamamen kaybolmaz; ancak geç kalınan süre, ödeme süresinden düşülür.",
          "Ödenek her ayın sonunda aylık olarak ödenir. İşsizlik maaşı alınan süre boyunca genel sağlık sigortası primleri de İŞKUR tarafından ödenir.",
        ],
      },
    ],
    faqs: [
      {
        question: "İstifa edersem işsizlik maaşı alabilir miyim?",
        answer:
          "Kural olarak hayır. Ancak ücretin ödenmemesi, mobbing veya sigortasız çalıştırılma gibi haklı nedenlerle sözleşmeyi feshedenler işsizlik maaşına hak kazanabilir.",
      },
      {
        question: "Son 120 gün kesintisiz ne demek?",
        answer:
          "İşten ayrılmadan hemen önceki 120 günün tamamında prim ödenmiş olması gerekir. Bu süre içinde başka bir işyerine geçmiş olmanız sorun değildir; önemli olan prim bildiriminin kesintisiz olmasıdır.",
      },
      {
        question: "İşsizlik maaşı alırken çalışabilir miyim?",
        answer:
          "Hayır. Sigortalı olarak yeni bir işe girdiğinizde ödeme kesilir. Kalan hakkınızı, şartları tekrar sağladığınızda kullanabileceğiniz durumlar için İŞKUR'dan bilgi alın.",
      },
    ],
    related: ["kidem-ve-ihbar-tazminati-birlikte-hesaplama", "kidem-tazminati-nasil-hesaplanir"],
  },
];
