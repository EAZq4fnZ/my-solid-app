// src/utils/dateUtils.ts
import { add, isAfter } from 'date-fns';

const JP_ERA_LONG_FORMATTER = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
  era: 'long',
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
});

const JP_ERA_NARROW_FORMATTER = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
  era: 'narrow',
});

/**
 * 日付を和暦に変換する
 * @param date Date, ISO文字列, 数値, または {year, month, day} オブジェクト
 * @returns 和暦文字列 "令和06年01月01日" または "令和元年01月01日"
 */
export const formatToJpEra = (
  date: Date | string | number | null | undefined,
): string => {
  const d = toDate(date);
  if (!d) return '-';

  return JP_ERA_LONG_FORMATTER.format(d);
};

/**
 * 和暦情報の型定義
 * - era: "令和"
 * - year: 6 (計算用数値。元年は 1)
 * - label: "令和06年" または "令和元年"
 * - isValid: 日付が正しく、和暦が取得できたか (正しく取得できたら true)
 */
export interface JpEraInfo {
  era: string;  // 和暦の年号（明治・大正・昭和・平成・令和～）
  eraNarrow:string, // 和暦の略号(M・T・S・H・R～)
  wyear: number;  // 変換前の西暦 年
  year: number; // 和暦での 年
  isJp1st: boolean; // 年が「元年」かどうか？
  isValid: boolean; // 西暦 → 和暦 変換ができたか？
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
  const normalizedDate = toDate(arg); // 不正なら null を返し

  const date = normalizedDate; // 
  // 日付が不正で日付変換できなかった場合
  if (Number.isNaN(normalizedDate)||!date){
    return{
      era:'', eraNarrow:'', wyear:0,year:0,isJp1st:false, isValid:false
    }
  }

  try {
    // 文字列操作ではなく、Intl のパーツ取得機能で精密に抽出
    const longParts = JP_ERA_LONG_FORMATTER.formatToParts(date);
    const narrowParts =JP_ERA_NARROW_FORMATTER.formatToParts(date);

    const era:string = longParts.find((p) => p.type === 'era')?.value ?? '';
    const eraNarrow:string = narrowParts.find((p)=>p.type==='era')?.value??'';
    const yearStr:string = longParts.find((p) => p.type === 'year')?.value ?? '';
    // "元" なら 1 に。それ以外は数字のみを抽出して数値化（NaNなら1に倒す）
    const yearNum:number =
      yearStr === '元' ? 1 : parseInt(yearStr.replace(/\D/g, ''), 10) || 1;
    // 正常に変換、和暦情報を取得できた場合
    return {  
      era :era,
      eraNarrow:eraNarrow,
      year: yearNum,
      wyear: date.getFullYear(),
      isJp1st:yearNum===1,
      isValid: !!normalizedDate && era !== '',
    };
  } catch (_e) {  // 日付不正などは不正時のeraInfoを返している
    // Intl 未対応環境や予期せぬエラー時のフォールバック
    return {
      era: '',
      eraNarrow:'',
      year: 0,
      wyear: date.getFullYear(),
      isJp1st:false,
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
