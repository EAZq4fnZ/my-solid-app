// src/utils/factory.ts
import { type Type, type } from 'arktype';

/**
 * マスタ定数から型・配列・UI選択肢・ArkTypeバリデータまでを自動生成するファクトリー
 */
export function createMasterRegistry<T extends Record<string, string>>(
  master: T,
) {
  // バリデーション用のキー配列を自動生成 (型を厳格にキャスト)
  const codes = Object.keys(master) as unknown as readonly (keyof T)[];

  // UI Select用の value-label ペアの配列を自動生成
  const options = codes.map((code) => ({
    value: code,
    label: master[code],
  }));

  // ArkType用の結合文字列（例: "'male'|'female'|'unknown'"）を動的に生成
  // キーの文字列をシングルクォーテーションで囲んでパイプ「|」で結合します
  const expression = codes.map((code) => `'${String(code)}'`).join('|');

  // ArkType用のバリデータを動的に生成
  const schema = type(expression as unknown as 'string') as unknown as Type<
    keyof T,
    unknown
  >;

  // 成果物をまとめてオブジェクトとして返却する
  return {
    master,
    codes,
    options,
    schema,
  };
}
