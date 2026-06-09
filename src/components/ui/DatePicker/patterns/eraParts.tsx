// src/components/ui/DatePicker/patterns/eraParts.tsx
import { formatCustom } from '@/lib/date';

/**
 * 【和暦対応】ビューモードを判定し、カレンダーヘッダー文字列を和暦に変換してレンダリングする
 */
// biome-ignore lint/suspicious/noExplicitAny: Ark UI 内部の複雑なコンテキスト型マッピングを回避するため any を許容
export const renderEraRangeText = (api: any) => {
  // 上位層から api がシグナルとして渡ってきた場合と、展開済みのオブジェクトとして渡ってきた場合の双方に対応する防衛ロジック
  const datePicker = typeof api === 'function' ? api() : api;
  const view = datePicker.view;

  if (view === 'year') {
    const startYear = Math.floor(datePicker.focusedValue.year / 10) * 10;
    return (
      <span class="text-zinc-100 font-medium">
        {startYear}年 〜 {startYear + 9}年
      </span>
    );
  }

  if (view === 'month') {
    const year = datePicker.focusedValue.year;
    const dummyIso = `${year}-01-01`;
    const eraYearText = formatCustom(dummyIso, 'ENEYT年');
    return <span class="text-zinc-100 font-medium">{eraYearText}</span>;
  }

  const start = datePicker.visibleRange.start;
  const isoStr = `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}`;
  const eraText = formatCustom(isoStr, 'ENEYT年MM月');

  return <span class="text-zinc-100 font-medium">{eraText}</span>;
};
