// src/lib/date/providers/iso8601.ts
import type { CalendarParts, EraInfo, ParsedDateParts } from '@/types/date';

const ISO_WEEK_DAYS = [
  { name: '', abbr: '' }, // 0番目（ダミー）
  { name: 'Monday', abbr: 'Mon' }, // 1 (月曜日)
  { name: 'Tuesday', abbr: 'Tue' }, // 2 (火曜日)
  { name: 'Wednesday', abbr: 'Wed' }, // 3 (水曜日)
  { name: 'Thursday', abbr: 'Thu' }, // 4 (木曜日)
  { name: 'Friday', abbr: 'Fri' }, // 5 (金曜日)
  { name: 'Saturday', abbr: 'Sat' }, // 6 (土曜日)
  { name: 'Sunday', abbr: 'Sun' }, // 7 (日曜日)
] as const;

const MONTHS = [
  { name: '', abbr: '' }, // 0番目（ダミー）
  {name:'January' ,abbr :'Jan'}, 
  {name:'February', abbr:'Feb'},
  {name:'March', abbr:'Mar'}, 
  {name:'April', abbr:'Apr'}, 
  {name:'May', abbr:'May'}, 
  {name:'June', abbr:'Jun'}, 
  {name:'July', abbr:'Jul'}, 
  {name:'August', abbr:'Aug'}, 
  {name:'September', abbr:'Sep'}, 
  {name:'October', abbr:'Oct'}, 
  {name:'November', abbr:'Nov'}, 
  {name:'December', abbr:'Dec'},
] as const;

export const parseIso8601RawText = (text: string): ParsedDateParts => {
  // オフセットを抽出 (Z または +HH:mm)
  const offsetMatch = text.match(/(Z|[+-]\d{2}:?\d{2})/i);
  const offset = offsetMatch ? offsetMatch[0].toUpperCase() : undefined;

  // オフセットを取り除いた状態で数値を取得
  const digitsOnly = text.replace(offsetMatch ? offsetMatch[0] : '', '');
  const nums = digitsOnly.split(/\D+/).filter(Boolean).map(Number);

  return {
    year: nums[0] ?? null,
    month: nums[1] ?? null,
    day: nums[2] ?? null,
    timeParts: [nums[3] ?? 0, nums[4] ?? 0, nums[5] ?? 0],
    offset: offset ?? 'Z', // オフセットがなければ 'Z' を代入
  };
};

export const fetchIdo8601EraInfo= (parts:CalendarParts):EraInfo => ({
      ...parts,
      eraName: 'Common Era',
      eraAbbr: 'CE',
      eraYearText: String(parts.year).padStart(4, '0'),
      monthText: String(parts.month).padStart(2, '0'),
      monthAbbrText: MONTHS[parts.month]?.abbr??'',
      dayText: String(parts.day).padStart(2, '0'),
      dayOfWeekText: ISO_WEEK_DAYS[parts.dayOfWeek]?.abbr ?? '',
    });