// src/utils/dateUtils.ts
import { add, isAfter } from 'date-fns';

/**
 * 日付を和暦に変換する
 * @param date Date, ISO文字列, 数値, または {year, month, day} オブジェクト
 * @returns 和暦文字列 "令和6年1月1日" または "令和元年1月1日"
 */
export const formatToJpEra = (
  date: Date | string | number | null | undefined,
): string => {
  const d = toDate(date);
  if (!d) return '-';

  return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

/**
 * 和暦情報の型定義
 * - era: "令和"
 * - year: 6 (計算用数値。元年は 1)
 * - label: "令和6年" または "令和元年"
 * - isValid: 日付が正しく、和暦が取得できたか (正しく取得できたら true)
 */
export interface JpEraInfo {
  era: string;
  year: number;
  label: string;
  isValid: boolean;
}

/**
 * 日付から和暦の詳細情報（元号、年、ラベル、有効性）を取得する
 * @param arg Date, ISO文字列, 数値, または {year, month, day} オブジェクト
 * @returns JpEraInfo
 */
export const getJpEraInfo = (
  arg?:
    | Date
    | string
    | number
    | { year?: number; month?: number; day?: number }
    | null,
): JpEraInfo => {
  const normalizedDate = toDate(arg); // 不正なら null
  const date = normalizedDate ?? new Date(); // 不正なら「今日」を計算のベースにする
  const isValid = !!normalizedDate; // もともとの入力が正しかったか

  try {
    const formatter = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
      era: 'long',
      year: 'numeric',
    });

    // 文字列操作ではなく、Intl のパーツ取得機能で精密に抽出
    const parts = formatter.formatToParts(date);

    const era = parts.find((p) => p.type === 'era')?.value ?? '';
    const yearStr = parts.find((p) => p.type === 'year')?.value ?? '';

    // "元" なら 1 に。それ以外は数字のみを抽出して数値化（NaNなら1に倒す）
    const yearNum =
      yearStr === '元' ? 1 : parseInt(yearStr.replace(/\D/g, ''), 10) || 1;

    return {
      era,
      year: yearNum,
      label: era && yearStr ? `${era}${yearStr}年` : '不明',
      isValid: isValid && era !== '',
    };
  } catch (_e) {
    // Intl 未対応環境や予期せぬエラー時のフォールバック
    return {
      era: '',
      year: date.getFullYear(),
      label: String(date.getFullYear()),
      isValid: false,
    };
  }
};

/**
 * 警告ステータスの型
 * - 1ヶ月以上経過: critical
 * - 3週間(21日)以上経過: warn
 * - それ以外: normal
 */
export type AlertStatus = 'normal' | 'warn' | 'critical';

export interface AlertResult {
  status: AlertStatus;
  isCritical: boolean;
  isWarning: boolean;
}

/**
 * 警告ステータスの取得
 * @param targetDate Date, ISO文字列, 数値, または {year, month, day} オブジェクト
 * @returns 警告ステータス AlertResult
 * - 1ヶ月以上経過: critical
 * - 3週間(21日)以上経過: warn
 * - それ以外: normal
 */
export const getAlertStatus = (
  targetDate: Date | string | null,
): AlertResult => {
  const start = toDate(targetDate);

  if (!start) return { status: 'normal', isCritical: false, isWarning: false };

  const today = new Date();

  // 今日が判定日より1ヶ月以上経過していれば status:critical
  const isCritical = isAfter(today, add(start, { months: 1 }));
  // 一ヶ月以上経過おらず、3週間(21日)以上経過していれば status:warn
  const isWarning = !isCritical && isAfter(today, add(start, { weeks: 3 }));

  return {
    status: isCritical ? 'critical' : isWarning ? 'warn' : 'normal',
    isCritical,
    isWarning,
  };
};

/**
 * 引数を Date オブジェクトに変換する内部ユーティリティ
 * 不正な値（不正な文字列やNaN）が渡された場合は null を返す
 * @param arg Date, ISO文字列, 数値, または {year, month, day} オブジェクト
 * @returns Date
 */
const toDate = (
  arg:
    | Date
    | string
    | number
    | { year?: number; month?: number; day?: number }
    | null
    | undefined,
): Date | null => {
  if (!arg) return null;
  if (arg instanceof Date) return Number.isNaN(arg.getTime()) ? null : arg;

  if (typeof arg === 'object' && 'year' in arg) {
    const d = new Date(arg.year ?? 0, (arg.month ?? 1) - 1, arg.day ?? 1);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(arg as string | number);
  return Number.isNaN(d.getTime()) ? null : d;
};
