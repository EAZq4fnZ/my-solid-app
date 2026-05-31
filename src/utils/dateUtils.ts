// src/utils/dateUtils.ts
import { Temporal } from '@js-temporal/polyfill';
import type { IsoDateString } from '@/types/date';

// アラートレベルを管理するEnum
export enum PatientAlertLevel {
  Normal = 'normal',
  Warning = 'warning',
  Critical = 'critical',
}

/**
 * 最終訪問日から通院警告アラートレベルを決定する
 * @param isoStr IsoDateString (安全な日付文字列)
 * @returns enum PatientAlertLevel (緊急(critical), 警告(warning), 通常(normal))
 */
export function getAlertStatus(isoStr: IsoDateString): PatientAlertLevel {
  // 現在日付と最終訪問日の差を計算
  const duration = Temporal.Now.plainDateISO().since(
    Temporal.PlainDate.from(isoStr),
    {
      largestUnit: 'months',
      smallestUnit: 'weeks',
    },
  );

  if (duration.months >= 1) PatientAlertLevel.Critical; // 1ヶ月以上経過 => Critical:緊急

  if (duration.weeks >= 3) return PatientAlertLevel.Warning; // 3週間以上(& 1ヶ月未満) => Warning:警告

  return PatientAlertLevel.Normal; // 3週間未満 => Normal:通常
}
