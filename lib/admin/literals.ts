/**
 * Yönetim paneli için TypeScript veri dosyası okuyucu.
 *
 * Kaynak kodu çalıştırmadan tarar ve "anahtar: değer" biçimindeki düz
 * metin, sayı ve true/false değerlerini düzenlenebilir alanlar olarak
 * çıkarır. Kaydederken yalnızca bu değerlerin yazıldığı karakterler
 * değiştirilir; dosyanın geri kalanı (formüller, tipler, şablon metinler,
 * fonksiyonlar) olduğu gibi kalır. Böylece panelden yapılan bir değişiklik
 * dosyanın sözdizimini bozamaz.
 *
 * Kapsam dışı kalanlar (yalnızca "Gelişmiş düzenleme" ile değişir):
 * - `...` şablon metinleri (içinde hesaplanan değer olabilir),
 * - formül içindeki sayılar (ör. `brüt * 0.15`),
 * - nesne anahtarları ("tyt-net": { ... } gibi; adres/slug bozulmasın),
 * - import yolları ve tip tanımlarındaki metinler.
 */

export type FieldKind = "string" | "number" | "boolean";

export type Field = {
  /** Kaynak koddaki başlangıç konumu; alanın kimliği olarak kullanılır */
  start: number;
  end: number;
  kind: FieldKind;
  /** Kaynaktaki ham yazım */
  raw: string;
  /** Kullanıcıya gösterilen değer */
  value: string;
  /** Anahtar yolu, ör. "MINIMUM_WAGE › employerCost › noIncentive" */
  path: string[];
  /** 1'den başlayan satır numarası */
  line: number;
  /** Alanın hemen üstündeki tek satırlık açıklama yorumu, varsa */
  hint: string;
  /** En yakın bölüm başlığı yorumu (/* Asgari ücret *\/ gibi) */
  section: string;
};

type Frame = { key: string; isArray: boolean; index: number; open: string; code: boolean };

const IDENT = /[A-Za-z0-9_$]/;
const KEY_BEFORE = /([A-Za-z_$][\w$]*|"[^"\n]+"|'[^'\n]+')\s*\??\s*:\s*$/;
const CONST_BEFORE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=\s*$/;

function unquoteKey(key: string) {
  return key.replace(/^["']|["']$/g, "");
}

/** Tek veya çift tırnaklı metni çözer. */
export function decodeString(raw: string): string {
  const body = raw.slice(1, -1);
  let out = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch !== "\\") {
      out += ch;
      continue;
    }
    const next = body[++i];
    switch (next) {
      case "n": out += "\n"; break;
      case "t": out += "\t"; break;
      case "r": out += "\r"; break;
      case "0": out += "\0"; break;
      case "b": out += "\b"; break;
      case "f": out += "\f"; break;
      case "v": out += "\v"; break;
      case "u": {
        if (body[i + 1] === "{") {
          const close = body.indexOf("}", i);
          out += String.fromCodePoint(parseInt(body.slice(i + 2, close), 16));
          i = close;
        } else {
          out += String.fromCharCode(parseInt(body.slice(i + 1, i + 5), 16));
          i += 4;
        }
        break;
      }
      case "x":
        out += String.fromCharCode(parseInt(body.slice(i + 1, i + 3), 16));
        i += 2;
        break;
      case "\n":
        break;
      default:
        out += next ?? "";
    }
  }
  return out;
}

/** Kullanıcının girdiği metni geçerli bir TS metin değerine çevirir. */
export function encodeString(value: string): string {
  return JSON.stringify(value.replace(/\r\n?/g, "\n"));
}

/** "31,23" veya "1.500,75" gibi girişleri sayıya çevirir; geçersizse null. */
export function normalizeNumber(input: string): string | null {
  let s = input.trim().replace(/\s/g, "");
  if (!s) return null;
  if (s.includes(",")) {
    // Türkçe yazım: nokta binlik ayıracı, virgül ondalık
    s = s.replace(/\./g, "").replace(",", ".");
  }
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  return s;
}

function prevSignificant(src: string, pos: number): string {
  for (let i = pos - 1; i >= 0; i--) {
    const c = src[i];
    if (!/\s/.test(c)) return c;
  }
  return "";
}

function nextSignificant(src: string, pos: number): string {
  for (let i = pos; i < src.length; i++) {
    const c = src[i];
    if (/\s/.test(c)) continue;
    // satır sonu yorumunu atla
    if (c === "/" && src[i + 1] === "/") {
      const nl = src.indexOf("\n", i);
      if (nl === -1) return "";
      i = nl;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const close = src.indexOf("*/", i + 2);
      if (close === -1) return "";
      i = close + 1;
      continue;
    }
    return c;
  }
  return "";
}

/** Bir değer, nesne/dizi öğesi olarak tek başına mı duruyor? */
function isStandaloneValue(src: string, start: number, end: number) {
  const before = prevSignificant(src, start);
  const after = nextSignificant(src, end);
  return (before === ":" || before === "[" || before === ",") &&
    (after === "," || after === "}" || after === "]");
}

const REGEX_PREFIX = new Set(["", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "<", ">", "~", "^"]);

/** Kaynak koddaki düzenlenebilir değerleri çıkarır. */
export function extractFields(src: string): Field[] {
  const fields: Field[] = [];
  const stack: Frame[] = [];
  let section = "";
  let i = 0;

  const lineStarts: number[] = [0];
  for (let k = 0; k < src.length; k++) if (src[k] === "\n") lineStarts.push(k + 1);
  const lineOf = (pos: number) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= pos) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };

  const keyBefore = (pos: number) => {
    const text = src.slice(Math.max(0, pos - 300), pos);
    const m = text.match(KEY_BEFORE);
    if (m) return unquoteKey(m[1]);
    const c = text.match(CONST_BEFORE);
    if (c) return c[1];
    return "";
  };

  const currentPath = () => {
    const parts: string[] = [];
    for (const f of stack) if (f.key) parts.push(f.key);
    return parts;
  };

  /** Fonksiyon gövdesi veya çağrı içinde miyiz? (oradaki değerler kod sayılır) */
  const inCode = () => stack.some((f) => f.code);

  /** Değer tek başına mı, yoksa en üst düzeyde `const X = değer;` mi? */
  const editable = (start: number, end: number) => {
    if (inCode()) return false;
    if (isStandaloneValue(src, start, end)) return true;
    return stack.length === 0 &&
      prevSignificant(src, start) === "=" &&
      nextSignificant(src, end) === ";" &&
      CONST_BEFORE.test(src.slice(Math.max(0, start - 200), start));
  };

  /** Alanın satırının hemen üstündeki /** açıklama *\/ yorumu */
  const hintFor = (pos: number) => {
    const lineStart = src.lastIndexOf("\n", pos) + 1;
    const keyLineStart = /^\s*["']/.test(src.slice(lineStart, pos)) && /:\s*$/.test(src.slice(Math.max(0, lineStart - 200), lineStart - 1))
      ? src.lastIndexOf("\n", lineStart - 2) + 1
      : lineStart;
    const m = src.slice(Math.max(0, keyLineStart - 400), keyLineStart).match(/\/\*\*?((?:(?!\*\/)[\s\S])*)\*\/\s*$/);
    if (!m) return "";
    return m[1].replace(/^\s*\*+/gm, "").replace(/\s+/g, " ").trim().slice(0, 300);
  };

  const ownLabel = (pos: number) => {
    const top = stack[stack.length - 1];
    const k = keyBefore(pos);
    if (k) return k;
    if (top?.isArray) return `#${top.index + 1}`;
    return "";
  };

  /** Şablon metni (`...${...}...`) sonuna kadar atlar. */
  const skipTemplate = (from: number): number => {
    let j = from + 1;
    while (j < src.length) {
      const c = src[j];
      if (c === "\\") { j += 2; continue; }
      if (c === "`") return j + 1;
      if (c === "$" && src[j + 1] === "{") {
        j = skipCode(j + 2, "}");
        continue;
      }
      j++;
    }
    return j;
  };

  const skipQuoted = (from: number): number => {
    const q = src[from];
    let j = from + 1;
    while (j < src.length) {
      const c = src[j];
      if (c === "\\") { j += 2; continue; }
      if (c === q) return j + 1;
      if (c === "\n") return j; // kapanmamış metin; güvenli çıkış
      j++;
    }
    return j;
  };

  const skipRegex = (from: number): number => {
    let j = from + 1;
    let inClass = false;
    while (j < src.length) {
      const c = src[j];
      if (c === "\\") { j += 2; continue; }
      if (c === "\n") return j;
      if (inClass) { if (c === "]") inClass = false; }
      else if (c === "[") inClass = true;
      else if (c === "/") {
        j++;
        while (j < src.length && /[a-z]/i.test(src[j])) j++;
        return j;
      }
      j++;
    }
    return j;
  };

  /** ${ ... } içindeki kodu, kapanan ayraca kadar atlar. */
  function skipCode(from: number, closer: string): number {
    let depth = 0;
    let j = from;
    while (j < src.length) {
      const c = src[j];
      if (c === "'" || c === '"') { j = skipQuoted(j); continue; }
      if (c === "`") { j = skipTemplate(j); continue; }
      if (c === "/" && src[j + 1] === "/") { const nl = src.indexOf("\n", j); j = nl === -1 ? src.length : nl; continue; }
      if (c === "/" && src[j + 1] === "*") { const e = src.indexOf("*/", j + 2); j = e === -1 ? src.length : e + 2; continue; }
      if (c === "{" || c === "(" || c === "[") depth++;
      else if (c === "}" || c === ")" || c === "]") {
        if (depth === 0 && c === closer) return j + 1;
        depth--;
      }
      j++;
    }
    return j;
  }

  while (i < src.length) {
    const c = src[i];

    // Yorumlar
    if (c === "/" && src[i + 1] === "/") {
      const nl = src.indexOf("\n", i);
      i = nl === -1 ? src.length : nl;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const e = src.indexOf("*/", i + 2);
      const end = e === -1 ? src.length : e + 2;
      const text = src.slice(i + 2, end - 2).replace(/^\s*\*+/gm, "").trim();
      // Tek satırlık başlık yorumları bölüm adı olur: /* Asgari ücret  */
      if (src[i + 2] !== "*" && !text.includes("\n") && text.length > 0 && text.length < 70 && stack.length === 0) {
        const cleaned = text.replace(/[-=─━_]{2,}/g, "").trim();
        if (cleaned && !/^[-=─\s]+$/.test(cleaned)) section = cleaned;
      }
      i = end;
      continue;
    }

    // Düzenli ifade
    if (c === "/") {
      const prev = prevSignificant(src, i);
      const word = src.slice(Math.max(0, i - 7), i).trimEnd();
      if (REGEX_PREFIX.has(prev) || /\breturn$/.test(word)) {
        i = skipRegex(i);
        continue;
      }
      i++;
      continue;
    }

    if (c === "`") { i = skipTemplate(i); continue; }

    if (c === '"' || c === "'") {
      const end = skipQuoted(i);
      const raw = src.slice(i, end);
      const lineText = src.slice(lineStarts[lineOf(i) - 1], end);
      const isImport = /^\s*(import|export)\b.*\bfrom\s*$/.test(lineText.slice(0, i - lineStarts[lineOf(i) - 1])) ||
        /^\s*import\s/.test(lineText);
      if (raw.length >= 2 && raw.endsWith(c) && !isImport && editable(i, end)) {
        fields.push({
          start: i,
          end,
          kind: "string",
          raw,
          value: decodeString(raw),
          path: [...currentPath(), ownLabel(i)].filter(Boolean),
          line: lineOf(i),
          hint: hintFor(i),
          section,
        });
      }
      i = end;
      continue;
    }

    // Sayılar
    if (/[0-9]/.test(c) && !IDENT.test(src[i - 1] ?? "") && src[i - 1] !== ".") {
      const m = src.slice(i).match(/^[0-9][0-9_]*(\.[0-9_]+)?([eE][+-]?[0-9]+)?/);
      const raw = m ? m[0] : c;
      const end = i + raw.length;
      if (!IDENT.test(src[end] ?? "") && src[end] !== "." && /^\d+(\.\d+)?$/.test(raw) && editable(i, end)) {
        fields.push({
          start: i,
          end,
          kind: "number",
          raw,
          value: raw,
          path: [...currentPath(), ownLabel(i)].filter(Boolean),
          line: lineOf(i),
          hint: hintFor(i),
          section,
        });
      }
      i = end;
      continue;
    }

    // true / false
    if ((c === "t" || c === "f") && !IDENT.test(src[i - 1] ?? "") && src[i - 1] !== ".") {
      const word = src.startsWith("true", i) ? "true" : src.startsWith("false", i) ? "false" : "";
      if (word && !IDENT.test(src[i + word.length] ?? "")) {
        const end = i + word.length;
        if (editable(i, end)) {
          fields.push({
            start: i,
            end,
            kind: "boolean",
            raw: word,
            value: word,
            path: [...currentPath(), ownLabel(i)].filter(Boolean),
            line: lineOf(i),
            hint: hintFor(i),
            section,
          });
        }
        i = end;
        continue;
      }
    }

    // Tanımlayıcıları tek parça geç (içlerindeki rakamlar sayı sayılmasın)
    if (IDENT.test(c)) {
      let j = i;
      while (j < src.length && IDENT.test(src[j])) j++;
      i = j;
      continue;
    }

    if (c === "{" || c === "[" || c === "(") {
      const top = stack[stack.length - 1];
      let key = c === "(" ? "" : keyBefore(i);
      if (!key && top?.isArray && c !== "(") key = `#${top.index + 1}`;
      const before = src.slice(Math.max(0, i - 3), i).trimEnd();
      const prev = prevSignificant(src, i);
      const code = c === "(" || (c === "{" && (prev === ")" || before.endsWith("=>")));
      stack.push({ key, isArray: c === "[", index: 0, open: c, code });
      i++;
      continue;
    }

    if (c === "}" || c === "]" || c === ")") {
      stack.pop();
      i++;
      continue;
    }

    if (c === ",") {
      const top = stack[stack.length - 1];
      if (top?.isArray) top.index++;
      i++;
      continue;
    }

    if (c === ";" && stack.length === 0) {
      i++;
      continue;
    }

    i++;
  }

  return fields;
}

export type FieldChange = { start: number; kind: FieldKind; original: string; value: string };

/**
 * Değişiklikleri kaynağa uygular. Her değişiklik, alanın konumu ve eski
 * değeriyle birlikte doğrulanır; tutmayan bir alan varsa hiçbir şey
 * değiştirilmez ve hata fırlatılır.
 */
export function applyChanges(src: string, changes: FieldChange[]): string {
  const fields = new Map(extractFields(src).map((f) => [f.start, f]));
  const edits: { start: number; end: number; text: string }[] = [];

  for (const ch of changes) {
    const f = fields.get(ch.start);
    if (!f || f.kind !== ch.kind || f.value !== ch.original) {
      throw new Error(`Satır alanı bulunamadı veya bu arada değişti (konum ${ch.start}).`);
    }
    let text: string;
    if (f.kind === "string") {
      text = encodeString(ch.value);
    } else if (f.kind === "number") {
      const n = normalizeNumber(ch.value);
      if (n === null) throw new Error(`Satır ${f.line}: "${ch.value}" geçerli bir sayı değil.`);
      text = n;
    } else {
      if (ch.value !== "true" && ch.value !== "false") {
        throw new Error(`Satır ${f.line}: evet/hayır değeri geçersiz.`);
      }
      text = ch.value;
    }
    if (text !== f.raw) edits.push({ start: f.start, end: f.end, text });
  }

  edits.sort((a, b) => b.start - a.start);
  let out = src;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}
