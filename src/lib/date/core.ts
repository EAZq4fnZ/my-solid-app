// src/types/date/withTimeZone.ts
import { Temporal } from '@js-temporal/polyfill';
import type {
  CalendarParts,
  DateProviderConfig,
  DateTimeModule,
  EraInfoFetcher,
  IsoDateString,
  IsoDateTimeString,
} from '@/types/date';
import { EraFormatMode } from '@/types/date';
import { normalizeJapaneseInput } from '@/utils/string';

/**
 * 内部純粋関数: 届いた表示用文字列パーツを使い、テンプレートに沿って高速置換する
 */
const formatByTemplate = (
  parts: CalendarParts,
  template: string,
  fetchEraInfo: EraInfoFetcher,
): string => {
  const eraInfo = fetchEraInfo(parts);

  const replacements: Record<string, string> = {
    YYYY: String(eraInfo.ceYear),
    EYT: eraInfo.eraYearText, // "元", "02", "08"
    EY: String(eraInfo.eraYear),
    EN: eraInfo.eraName, // 🌟 ET から EN へ統一（日本の場合は "令和"）
    EA: eraInfo.eraAbbr, // "R", "H"
    MAT: eraInfo.monthAbbrText, // "Jan", "Ram."
    MT: eraInfo.monthText, // "05", "ラマダーン"
    MM: String(eraInfo.month).padStart(2, '0'),
    DT: eraInfo.dayText, // "25", "25th"
    DD: String(eraInfo.day).padStart(2, '0'),
    DWT: eraInfo.dayOfWeekText, // "月曜日", "Monday"
    HH: String(eraInfo.hour).padStart(2, '0'),
    mm: String(eraInfo.minute).padStart(2, '0'),
    ss: String(eraInfo.second).padStart(2, '0'),
  };

  //
  return template.replace(
    /YYYY|EYT|MAT|DWT|EY|EN|EA|MT|MM|DT|DD|HH|mm|ss/g,
    (match) => replacements[match],
  );
};

/**
 * 日付/時刻表示用モジュールを作成する
 * @param config
 * @returns DateTimeModule
 */
export function createDateTimeModule(
  config: DateProviderConfig,
): DateTimeModule {
  /**
   * 入力文字列を正規化する
   * @param value string
   * @returns string
   */
  const normalize = (value: string): string => {
    return normalizeJapaneseInput(value.trim()).replace(/\//g, '-');
  };

  /**
   * 入力文字列を「YYYY-MM-DD」または「YYYY-MM-DDTHH:mm:ss」の標準形に整える
   * @param value string 入力文字列
   * @param mode string 'date' | 'datetime'
   * @returns IsoDateString/IsoDateTimeString 標準形に整えた入力文字列(YYYY-MM-DDまたはYYYY-MM-DDTHH:mm:ss+オフセット)
   */
  function tryFromRaw(value: string, mode: 'date'): IsoDateString | null;
  function tryFromRaw(
    value: string,
    mode: 'datetime',
  ): IsoDateTimeString | null;
  function tryFromRaw(
    value: string,
    mode: 'date' | 'datetime',
  ): IsoDateString | IsoDateTimeString | null {
    const rawText = normalize(value); // 入力文字列を正規化
    if (!rawText) return null; // 空文字は無視、null を返す

    try {
      // IIFEによる文字列の整流・JSTへのタイムゾーン変換アジャスト
      const plain = (() => {
        // タイムゾーン情報付き日時文字列 → 指定タイムゾーンのPLainDateTimeへ変換
        if (/\[[A-Za-z_]+\/[A-Za-z_]+\]$/.test(rawText)) {
          return Temporal.ZonedDateTime.from(rawText)
            .withTimeZone(config.timezone)
            .toPlainDateTime()
            .toString();
        }
        // 時差オフセット付き日時文字列 → 指定タイムゾーンのPLainDateTimeへ変換
        if (/(?:Z|[+-]\d{2}:\d{2})$/.test(rawText)) {
          return Temporal.Instant.from(rawText)
            .toZonedDateTimeISO(config.timezone)
            .toPlainDateTime()
            .toString();
        }
        // 日時文字列 → 日・時刻間スペースに「T」を挿入して 指定タイムゾーンのPLainDateTimeへ変換
        //const isoFormated = rawText.replace(' ', 'T');
        const isoFormated = `${rawText}[${config.timezone}]`;
        return Temporal.PlainDateTime.from(isoFormated).toString();
      })();

      // 各プロバイダでの文字列クレンジング、元号・和暦➔西暦数値への翻訳
      const { year, month, day, timeParts } = config.parser(plain);
      // 年・月・日が揃わない場合は不完全な入力があったとして null を返す
      if (year === null || month === null || day === null) {
        return null;
      }

      if (mode === 'date') {
        // 一旦 PlainDate へ変換、日付の正規化・妥当性の検証
        return Temporal.PlainDate.from({
          year,
          month,
          day,
        }).toString() as IsoDateString;
      }
      // ↓ datetime モードの場合
      const rawHour = timeParts[0] as number;
      const rawMinute = timeParts[1] as number;
      const rawSecond = timeParts[2];
      // 時・分が欠けている場合は不完全な入力があったとして null を返す
      // 秒はオプショナルとする (UIからの入力は分まで)（例: "2026/05/31 14:30" を許容）
      if (rawHour == null || rawMinute == null) {
        return null;
      }
      // 一旦 ZonedDateTime へ変換することで、日付の正規化・妥当性の検証
      const datetime = Temporal.ZonedDateTime.from({
        year,
        month,
        day,
        hour: rawHour,
        minute: rawMinute,
        second: rawSecond ?? 0,
        timeZone: config.timezone,
      });
      
      return datetime.toString({
        calendarName: 'never',
        offset: 'auto',
        timeZoneName: 'never',
        fractionalSecondDigits: 0,
      }) as IsoDateTimeString;
    } catch {
      return null; // 妥当性の検証に失敗・異常があれば、null を返す
    }
  }
  /**
   * 入力文字列を「YYYY-MM-DD」または「YYYY-MM-DDTHH:mm:ss+オフセット」の標準形に整える
   * @param value
   * @param mode
   * @returns IsoDateString/IsoDateTimeString
   */
  function fromRaw(value: string, mode: 'date'): IsoDateString;
  function fromRaw(value: string, mode: 'datetime'): IsoDateTimeString;
  function fromRaw(
    value: string,
    mode: 'date' | 'datetime',
  ): IsoDateString | IsoDateTimeString {
    // biome-ignore lint/suspicious/noExplicitAny: <mode: 'date' | 'datetime'両対応のためany型を使用>
    const result = tryFromRaw(value, mode as any);
    if (!result) {
      throw new Error('Invalid date format:"{value}"');
    }
    return result as IsoDateString | IsoDateTimeString;
  }

  const formatCache = new Map<string, string>();

  const toFormat = (isoStr: string, template: string): string => {
    const key = `${isoStr}::${template}`; // 結果をキャッシュするためのキー(日付文字列 + 置換テンプレート)
    const cached = formatCache.get(key); // キーとキャッシュがあれば、その結果を返す
    if (cached !== undefined) {
      return cached;
    }

    try {
      const zdt = Temporal.ZonedDateTime.from(isoStr).withTimeZone(
        config.timezone,
      );
      const localized = zdt.withCalendar(config.calendarId);

      const parts: CalendarParts = {
        ceYear: zdt.year,
        era: localized.era,
        eraYear: localized.eraYear ?? localized.year,
        year: localized.year,
        month: localized.month,
        day: localized.day,
        hour: localized.hour,
        minute: localized.minute,
        second: localized.second,
        dayOfWeek: localized.dayOfWeek,
      };
      const result = formatByTemplate(parts, template, config.fetchEraInfo);
      formatCache.set(key, result); // 結果をキャッシュに保存しておき、次回からは再利用
      return result; // そして結果を返す
    } catch {
      return '---';
    }
  };

  const toDisplay = (
    isoStr: string,
    mode: EraFormatMode = EraFormatMode.Ymd,
  ): string => {
    // 指定した形式で toFormat を実行
    const templateMap: Record<EraFormatMode, string> = {
      [EraFormatMode.Ymd]: 'YYYY/MM/DD',
      [EraFormatMode.YmdDash]: 'YYYY-MM-DD',
      [EraFormatMode.Full]: 'YYYY(ENEYT年)/MT/DT', //
      [EraFormatMode.Abbr]: 'EAEYT/MT/DT',
      [EraFormatMode.Tiny]: 'EYT/MT/DT',
      [EraFormatMode.Jp]: 'ENEYT年MT月DT日',
    };

    return toFormat(isoStr, templateMap[mode] ?? 'YYYY/MT/DT');
  };

  const today = (): IsoDateString => {
    return Temporal.Now.plainDateISO(
      config.timezone,
    ).toString() as IsoDateString;
  };
  const now = (): IsoDateTimeString => {
    return Temporal.Now.zonedDateTimeISO(config.timezone).toString({
      calendarName: 'never',
      offset: 'auto',
      timeZoneName: 'never',
      fractionalSecondDigits: 0,
    }) as IsoDateTimeString;
  };

  const isValid = (value: string, mode: 'date' | 'datetime'): boolean => {
    // biome-ignore lint/suspicious/noExplicitAny: <mode: 'date' | 'datetime'両対応のためany型を使用>
    return tryFromRaw(value, mode as any) !== null;
  };

  function fromParts (year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    timezone: string = config.timezone,
    mode: 'date' | 'datetime' = 'date',
  ): IsoDateString | IsoDateTimeString | null {
    const d = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (mode === 'date') {
      return tryFromRaw(d, 'date') as IsoDateString;
    }
    const dt = `${d}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}[${timezone}]`;
    return tryFromRaw(dt, 'datetime') as IsoDateTimeString;
  };

  return {
    timezone: config.timezone,
    calendarId: config.calendarId,
    normalize,
    tryFromRaw,
    fromRaw,
    toDisplay,
    toFormat,
    today,
    now,
    isValid,
    fromParts,
  };
}
