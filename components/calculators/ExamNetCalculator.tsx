"use client";

import { useMemo, useState } from "react";

import ResultRow from "@/components/calculators/ResultRow";
import type { ExamConfig } from "@/data/exams";

type Answer = { correct: string; wrong: string };

const fmt = (value: number, digits = 2) =>
  value.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });

/**
 * Sınav net hesaplayıcı. Ders listesi, yanlış cezası, ağırlıklar ve toplam
 * grupları sınav yapılandırmasından gelir; aynı bileşen TYT, AYT, LGS,
 * KPSS, ALES, DGS ve YDS için kullanılır.
 */
export default function ExamNetCalculator({ exam }: { exam: ExamConfig }) {
  const empty = () =>
    Object.fromEntries(exam.subjects.map((s) => [s.id, { correct: "", wrong: "" }]));

  const [answers, setAnswers] = useState<Record<string, Answer>>(empty);
  const [diploma, setDiploma] = useState("");

  function update(id: string, field: keyof Answer, value: string) {
    setAnswers((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  }

  const computed = useMemo(() => {
    const rows = exam.subjects.map((subject) => {
      const correct = Math.max(0, Number(answers[subject.id]?.correct) || 0);
      const wrong = Math.max(0, Number(answers[subject.id]?.wrong) || 0);
      const overflow = correct + wrong > subject.questions;
      const raw = exam.penalty ? correct - wrong / exam.penalty : correct;
      const net = Math.max(0, raw);
      return { ...subject, correct, wrong, net, overflow };
    });

    const touched = rows.some((row) => row.correct > 0 || row.wrong > 0);
    const hasOverflow = rows.some((row) => row.overflow);
    const byId = Object.fromEntries(rows.map((row) => [row.id, row]));

    const groups = (exam.groups ?? []).map((group) => ({
      label: group.label,
      net: group.subjects.reduce((sum, id) => sum + (byId[id]?.net ?? 0), 0),
      questions: group.subjects.reduce(
        (sum, id) => sum + (exam.subjects.find((s) => s.id === id)?.questions ?? 0),
        0
      ),
    }));

    const totalNet = rows.reduce((sum, row) => sum + row.net, 0);
    const totalQuestions = rows.reduce((sum, row) => sum + row.questions, 0);
    const totalCorrect = rows.reduce((sum, row) => sum + row.correct, 0);

    const weightedNet = exam.weighted
      ? rows.reduce((sum, row) => sum + row.net * (row.weight ?? 1), 0)
      : null;
    const maxWeighted = exam.weighted
      ? rows.reduce((sum, row) => sum + row.questions * (row.weight ?? 1), 0)
      : null;

    return {
      rows,
      touched,
      hasOverflow,
      groups,
      totalNet,
      totalQuestions,
      totalCorrect,
      weightedNet,
      maxWeighted,
    };
  }, [answers, exam]);

  const diplomaScore = Number(diploma.replace(",", "."));
  const diplomaValid = diploma !== "" && diplomaScore >= 50 && diplomaScore <= 100;

  return (
    <div className="calc-box">
      <div
        className="exam-table"
        role="table"
        aria-label={`${exam.name} doğru ve yanlış girişi`}
        data-share-ignore=""
      >
        <div className="exam-row exam-row--head" role="row">
          <span role="columnheader">Ders</span>
          <span role="columnheader">Doğru</span>
          <span role="columnheader">Yanlış</span>
          <span role="columnheader">Net</span>
        </div>

        {computed.rows.map((row) => (
          <div
            key={row.id}
            className={`exam-row${row.overflow ? " is-error" : ""}`}
            role="row"
          >
            <span className="exam-row__subject" role="rowheader">
              {row.name}
              <small>{row.questions} soru</small>
            </span>

            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={row.questions}
              value={answers[row.id]?.correct ?? ""}
              onChange={(event) => update(row.id, "correct", event.target.value)}
              aria-label={`${row.name} doğru sayısı`}
              placeholder="0"
            />

            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={row.questions}
              value={answers[row.id]?.wrong ?? ""}
              onChange={(event) => update(row.id, "wrong", event.target.value)}
              aria-label={`${row.name} yanlış sayısı`}
              placeholder="0"
            />

            <strong className="exam-row__net" aria-label={`${row.name} neti`}>
              {fmt(row.net)}
            </strong>
          </div>
        ))}
      </div>

      {computed.hasOverflow && (
        <p className="exam-error" role="alert">
          Kırmızı işaretli derslerde doğru + yanlış toplamı soru sayısını aşıyor.
        </p>
      )}

      {exam.diplomaBonus && (
        <label className="field" style={{ marginTop: 18 }}>
          Diploma notu (isteğe bağlı, 50–100)
          <input
            type="number"
            inputMode="decimal"
            min={50}
            max={100}
            step="0.01"
            value={diploma}
            onChange={(event) => setDiploma(event.target.value)}
            placeholder="85"
          />
        </label>
      )}

      <button
        type="button"
        className="btn"
        style={{ marginTop: 18 }}
        onClick={() => {
          setAnswers(empty());
          setDiploma("");
        }}
      >
        Temizle
      </button>

      {computed.touched && !computed.hasOverflow ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          {/* Ders netleri ekranda tabloda görünür; paylaşım metnine de
              girmeleri için gizli satırlar olarak tekrar yazılır. */}
          <div hidden>
            {computed.rows
              .filter((row) => row.correct > 0 || row.wrong > 0)
              .map((row) => (
                <div key={row.id} data-share-row="">
                  <span data-share-label="">{row.name}</span>
                  <span data-share-value="">
                    {fmt(row.net)} net ({row.correct}D {row.wrong}Y)
                  </span>
                </div>
              ))}
          </div>

          {computed.groups.map((group) => (
            <ResultRow
              key={group.label}
              label={group.label}
              value={`${fmt(group.net)} / ${group.questions}`}
            />
          ))}

          <ResultRow
            label={`${exam.name} toplam net`}
            value={`${fmt(computed.totalNet)} / ${computed.totalQuestions}`}
            highlight={!exam.weighted && !exam.pointsPerCorrect}
          />

          {computed.weightedNet !== null && computed.maxWeighted !== null && (
            <>
              <ResultRow
                label="Ağırlıklı net"
                hint="Türkçe, matematik ve fen ×4; diğer dersler ×1"
                value={`${fmt(computed.weightedNet)} / ${computed.maxWeighted}`}
                highlight
              />
              <ResultRow
                label="Tahmini puan (doğrusal)"
                hint="Kaba tahmindir; resmî puan standart puanlarla hesaplanır"
                value={fmt(
                  Math.min(
                    500,
                    100 + (computed.weightedNet * 400) / computed.maxWeighted
                  ),
                  1
                )}
              />
            </>
          )}

          {exam.pointsPerCorrect && (
            <ResultRow
              label={`${exam.name} puanı`}
              hint={`Her doğru ${fmt(exam.pointsPerCorrect)} puan; yanlış doğruyu götürmez`}
              value={fmt(computed.totalCorrect * exam.pointsPerCorrect)}
              highlight
            />
          )}

          {exam.diplomaBonus && diplomaValid && (
            <>
              <ResultRow
                label="OBP (diploma notu × 5)"
                value={fmt(diplomaScore * 5)}
              />
              <ResultRow
                label="Yerleştirmeye OBP katkısı"
                hint="× 0,12 · önceki yıl bir programa yerleşenlerde × 0,06"
                value={`+${fmt(diplomaScore * 5 * 0.12)}`}
              />
            </>
          )}
        </div>
      ) : (
        !computed.hasOverflow && (
          <div className="calc-hint">
            Her ders için doğru ve yanlış sayınızı girin. Netiniz anında
            hesaplanır{exam.penalty ? `; ${exam.penalty} yanlış 1 doğruyu götürür` : ""}.
          </div>
        )
      )}
    </div>
  );
}
