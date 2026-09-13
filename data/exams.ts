/**
 * Sınav net hesaplayıcılarının yapılandırmaları.
 *
 * Soru sayıları sınavların güncel oturum yapısına göredir. ÖSYM veya MEB
 * yapıyı değiştirirse yalnızca bu dosya güncellenir.
 */

export type ExamSubject = {
  id: string;
  name: string;
  questions: number;
  /** Ağırlıklı nette çarpan (LGS) */
  weight?: number;
};

export type ExamConfig = {
  name: string;
  subjects: ExamSubject[];
  /** Kaç yanlışın bir doğruyu götürdüğü; yanlışın etkisi yoksa undefined */
  penalty?: number;
  /** Alt toplamlar (ör. AYT puan türleri, KPSS GY/GK) */
  groups?: { label: string; subjects: string[] }[];
  /** Ağırlıklı net ve doğrusal puan tahmini gösterilsin mi (LGS) */
  weighted?: boolean;
  /** Yanlışın etkisiz olduğu, doğru başına puanlanan sınavlar (YDS) */
  pointsPerCorrect?: number;
  /** OBP katkısı alanı gösterilsin mi (YKS) */
  diplomaBonus?: boolean;
};

export const exams: Record<string, ExamConfig> = {
  "tyt-net": {
    name: "TYT",
    penalty: 4,
    diplomaBonus: true,
    subjects: [
      { id: "turkce", name: "Türkçe", questions: 40 },
      { id: "sosyal", name: "Sosyal Bilimler", questions: 20 },
      { id: "matematik", name: "Temel Matematik", questions: 40 },
      { id: "fen", name: "Fen Bilimleri", questions: 20 },
    ],
  },

  "ayt-net": {
    name: "AYT",
    penalty: 4,
    diplomaBonus: true,
    subjects: [
      { id: "matematik", name: "Matematik", questions: 40 },
      { id: "fizik", name: "Fizik", questions: 14 },
      { id: "kimya", name: "Kimya", questions: 13 },
      { id: "biyoloji", name: "Biyoloji", questions: 13 },
      { id: "edebiyat", name: "Türk Dili ve Edebiyatı", questions: 24 },
      { id: "tarih1", name: "Tarih-1", questions: 10 },
      { id: "cografya1", name: "Coğrafya-1", questions: 6 },
      { id: "tarih2", name: "Tarih-2", questions: 11 },
      { id: "cografya2", name: "Coğrafya-2", questions: 11 },
      { id: "felsefe", name: "Felsefe Grubu", questions: 12 },
      { id: "din", name: "Din Kültürü / Ek Felsefe", questions: 6 },
    ],
    groups: [
      { label: "Sayısal (SAY) netleri", subjects: ["matematik", "fizik", "kimya", "biyoloji"] },
      {
        label: "Eşit ağırlık (EA) netleri",
        subjects: ["matematik", "edebiyat", "tarih1", "cografya1"],
      },
      {
        label: "Sözel (SÖZ) netleri",
        subjects: ["edebiyat", "tarih1", "cografya1", "tarih2", "cografya2", "felsefe", "din"],
      },
    ],
  },

  "lgs-puan": {
    name: "LGS",
    penalty: 3,
    weighted: true,
    subjects: [
      { id: "turkce", name: "Türkçe", questions: 20, weight: 4 },
      { id: "matematik", name: "Matematik", questions: 20, weight: 4 },
      { id: "fen", name: "Fen Bilimleri", questions: 20, weight: 4 },
      { id: "inkilap", name: "T.C. İnkılap Tarihi", questions: 10, weight: 1 },
      { id: "din", name: "Din Kültürü", questions: 10, weight: 1 },
      { id: "ingilizce", name: "Yabancı Dil", questions: 10, weight: 1 },
    ],
  },

  "kpss-net": {
    name: "KPSS",
    penalty: 4,
    subjects: [
      { id: "turkce", name: "Türkçe", questions: 30 },
      { id: "matematik", name: "Matematik", questions: 30 },
      { id: "tarih", name: "Tarih", questions: 27 },
      { id: "cografya", name: "Coğrafya", questions: 18 },
      { id: "vatandaslik", name: "Vatandaşlık", questions: 9 },
      { id: "guncel", name: "Güncel Bilgiler", questions: 6 },
    ],
    groups: [
      { label: "Genel Yetenek netleri", subjects: ["turkce", "matematik"] },
      {
        label: "Genel Kültür netleri",
        subjects: ["tarih", "cografya", "vatandaslik", "guncel"],
      },
    ],
  },

  "ales-net": {
    name: "ALES",
    penalty: 4,
    subjects: [
      { id: "sayisal", name: "Sayısal", questions: 50 },
      { id: "sozel", name: "Sözel", questions: 50 },
    ],
  },

  "dgs-net": {
    name: "DGS",
    penalty: 4,
    subjects: [
      { id: "sayisal", name: "Sayısal", questions: 50 },
      { id: "sozel", name: "Sözel", questions: 50 },
    ],
  },

  "yds-puan": {
    name: "YDS",
    pointsPerCorrect: 1.25,
    subjects: [{ id: "yds", name: "Yabancı Dil", questions: 80 }],
  },
};
