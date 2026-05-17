// src/utils/dateUtils.ts
export type IsoDateString = string & { readonly __brand: unique symbol };

/**
 * 和暦情報
 * @see {@link JpEraInfo}, {@link EraMeta}, {@link ERA_MAP}
 */
export interface JpEraInfo {
  erayear: number; // 年 (和暦 例: 8)
  year: number; // 年 (西暦 例: 2026)
  month: number; // 月 (1〜12)
  day: number; // 日 (1〜31)
  era: string; // 元号の漢字 (例: "令和")
  eraAlpha: string; // 元号のアルファベット (例: "R")
  eraText: string; // 漢字表記テキスト (例: "令和8")
  eraAlphaText: string; // 略称表記テキスト (例: "R8")
}

// 元号ごとの詳細なメタデータ定義
interface EraMeta {
  kanji: string; // 年号の漢字表記 例："令和"
  alpha: string; // 年号のアルファベット表記 例:"R"
}

// Temporal の plain.era が返すキーに完全に一致させる
const ERA_MAP: Record<string, EraMeta> = {
  meiji: { kanji: '明治', alpha: 'M' },
  taisho: { kanji: '大正', alpha: 'T' },
  showa: { kanji: '昭和', alpha: 'S' },
  heisei: { kanji: '平成', alpha: 'H' },
  reiwa: { kanji: '令和', alpha: 'R' },
};

export const IsoDateString = {
  /** 判定用の正規表現（YYYY-MM-DD） */
  REGEX: /^\d{4}-\d{2}-\d{2}$/,

  /**
   * ルーズな文字列を検証し、厳格な IsoDateString 型に安全に昇格（キャスト）する
   * @param value 検証・変換 対象の文字列
   * @returns IsoDateString 型 (安全な日付文字列 例: "2026-05-11")
   * @throws 存在しない日付の場合にエラーを投げます
   */
  parse(value: string): IsoDateString {
    if (!this.REGEX.test(value)) {
      throw new Error(
        `不正な日付フォーマットです（YYYY-MM-DDを期待）: ${value}`,
      );
    }
    try {
      // Temporal にパースさせて、実在する日付か最終チェック（例: 2月31日 などを弾く）
      Temporal.PlainDate.from(value);
      return value as IsoDateString;
    } catch (_e) {
      throw new Error(`存在しない日付です: ${value}`);
    }
  },

  /**
   * 与えられた文字列が、IsoDateString として妥当かどうかを判定するガード関数
   * @param value 判定対象の文字列
   * @returns 妥当な場合は true 、不妥当な場合は false を返します
   * @see {@link IsoDateString.parse}
   */
  isValid(value: string): value is IsoDateString {
    if (!this.REGEX.test(value)) return false;
    try {
      Temporal.PlainDate.from(value);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 年・月・日(number型)から安全に IsoDateString を生成するファクトリ
   * @param year 年 (4 桁)
   * @param month 月 (1〜12)
   * @param day 日 (1〜31)
   * @returns IsoDateString 型 (安全な日付文字列 例: "2026-05-11")
   * @see {@link Temporal.PlainDate.from}
   * @see {@link Temporal.PlainDate.toString}
   */
  fromFields(year: number, month: number, day: number): IsoDateString {
    const plain = Temporal.PlainDate.from({ year, month, day });
    return plain.toString() as IsoDateString;
  },

  /**
   * 現在時刻（システム時間）から本日の IsoDateString を生成
   * @returns IsoDateString 型 (安全な日付文字列 例: "2026-05-11")
   */
  today(): IsoDateString {
    return Temporal.Now.plainDateISO().toString() as IsoDateString;
  },

  /**
   * 安全な IsoDateString から、漢字・アルファベット双方に対応した和暦情報を取得します。
   * @param isoStr 安全な日付文字列 例: "2026-05-11"
   * @returns 和暦情報 (元号、年、ラベル)
   */
  getJpEraInfo(isoStr: IsoDateString): JpEraInfo {
    // 1. 和暦カレンダーとして Temporal オブジェクトを生成
    const plain = Temporal.PlainDate.from(isoStr).withCalendar('japanese');

    const eraKey = plain.era ?? ''; // "reiwa" などが取れる
    const erayear = plain.eraYear ?? 1; // 8 などの数値が取れる

    // 2. マップからメタデータを安全に取得（万が一のためにフォールバックを用意）
    const meta = ERA_MAP[eraKey] ?? { kanji: '不明', alpha: '?' };

    // 3. テキストの組み立て
    const yearStr = erayear === 1 ? '元' : String(erayear);
    const eraText = `${meta.kanji}${yearStr}`;

    // アルファベット表記は、1年の時は「R1年」とするのが業務システムでは一般的なため数値を使用
    const eraAlphaText = `${meta.alpha}${erayear}`;

    return {
      erayear,
      year: plain.year,
      month: plain.month,
      day: plain.day,
      era: meta.kanji,
      eraAlpha: meta.alpha,
      eraText,
      eraAlphaText,
    };
  },
};
