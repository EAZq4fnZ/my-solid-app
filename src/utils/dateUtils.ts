// dateUtils.ts
import { add, isAfter } from 'date-fns';

/**
 * 西暦を和暦（略称：令和06/01/01形式）に変換する
 */
export const formatToJpEra = (date: Date | string | null): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

/**
 * 西暦から和暦の「年」の部分だけを抽出する (例: 2024 -> 令和6)
 * 月、日も引数に取るのは、元号の変わり目（例: 2019-05-01）を正しく処理するため
 * 月、日を指定しない場合はデフォルトで12月31日とする（年の途中で元号が変わるケースを考慮）
 * @param arg1 year(number) or object:{ year: number; month: number; day: number } or null
 * @param month
 * @param day
 * @returns
 */
export function getJpEraYear(): string;
export function getJpEraYear(
  year: number,
  month?: number,
  day?: number,
): string;
export function getJpEraYear(dateObj: {
  year?: number;
  month?: number;
  day?: number;
}): string;
export function getJpEraYear(
  arg1?: number | { year?: number; month?: number; day?: number } | null,
  month: number = 12,
  day: number = 31,
): string {
  // 引数なしで呼び出されたら、今日 日付を与えて実行
  if (arg1 === undefined || arg1 === null) {
    const today = new Date();
    return _getEraYear(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    );
  }
  // オブジェクトで呼び出された場合 (例：getJpEraYear({ year: 2019, month: 5, day: 1 })
  if (typeof arg1 === 'object') {
    return _getEraYear(
      arg1.year ?? new Date().getFullYear(), // 年を指定しない場合は今年とする
      arg1.month ?? 12, // 月を指定しない場合は12月とする
      arg1.day ?? 31, // 日を指定しない場合は31日とする
    );
  }
  // 引数1は年、引数2は月、引数3は日
  if (typeof arg1 === 'number') return _getEraYear(arg1, month, day);

  return ''; // 不正な引数
}

/**
 * 内部用関数：和暦年の取得
 * @param year 年 (省略可、デフォルトは今年)
 * @param month 月 (省略可、デフォルトは12月)
 * @param day 日 (省略可、デフォルトは31日)
 * @return 和暦年 (例：令和6)
 */
const _getEraYear = (year: number, month: number, day: number): string => {
  const d = new Date(year, month - 1, day);
  const eraString = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'short',
    year: 'numeric',
  }).format(d);

  return eraString.replace(/年$/, '');
};

/**
 * 警告ステータスの取得
 * - 1ヶ月以上経過: critical
 * - 3週間(21日)以上経過: warn
 * - それ以外: normal
 */
export type AlertStatus = 'normal' | 'warn' | 'critical';

export const getAlertStatus = (
  targetDate: Date | string | null,
): AlertStatus => {
  if (!targetDate) return 'normal';
  const start: Date =
    typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const today = new Date();

  // 今日 日付がstartより１か月超えていれば、警告ステータス[critical]を返す
  if (isAfter(today, add(start, { months: 1 }))) return 'critical';

  // 今日 日付がstartより３週間超えていれば、警告ステータス[warn]を返す
  if (isAfter(today, add(start, { weeks: 3 }))) return 'warn';

  // それ以外（３週間以内）のため [normal]を返す
  return 'normal';
};
