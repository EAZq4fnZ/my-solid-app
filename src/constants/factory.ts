// src/utils/factory.ts
import { type } from 'arktype';

/**
 * マスタ定数から型・配列・UI選択肢・ArkTypeバリデータまでを自動生成するファクトリー
 */
export function createMasterRegistry<T extends Record<string, string>>(
  master: T,
) {
  // 1. バリデーション用のキー配列を自動生成 (型を厳格にキャスト)
  const codes = Object.keys(master) as unknown as readonly (keyof T)[];

  // 2. UI Select用の value-label ペアの配列を自動生成
  const options = codes.map((code) => ({
    value: code,
    label: master[code],
  }));

  // 3. ArkType用の列挙型バリデータを自動生成
  // type.enumerated は文字列配列を受け取るため、一度 string[] にキャストして渡す
  const schema = type.enumerated(...(codes as readonly string[]));

  // 成果物をまとめてオブジェクトとして返却する
  return {
    master,
    codes,
    options,
    schema,
  };
}
