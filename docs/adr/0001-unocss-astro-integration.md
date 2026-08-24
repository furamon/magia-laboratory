# ADR 0001: UnoCSS の Astro 統合方式

**Status**: 採用（2026-08-24）

## 決定事項

`@unocss/astro` を devDependency に追加し、`astro.config.mjs` の `integrations` に `UnoCSS()` を追加する。`uno.config.ts` は旧プロジェクトのものをそのまま使用する。

## 背景と理由

- UnoCSS 公式ドキュメントが Astro 統合として `@unocss/astro` を推奨している。
- `unocss` パッケージの `./astro` エクスポートは `@unocss/astro` をオプショナルピアとして要求するため、明示的に追加する。
- 旧プロジェクトの `uno.config.ts`（preset-wind3 / preset-typography / transformer-directives / btn-game / btn-lily / preflights）は diff 確認済みで同一であり、そのまま再利用できる。
- preset-wind3 の `dark:` バリアントは `.dark` クラスベースで動作するため、`<html class="dark">` の付け替え方式がそのまま有効。

## 代替案

- `@unocss/vite` を直接 Vite プラグインとして追加: Astro の Vite 設定に手動で組み込む必要があり、Astro 統合の方が公式・簡潔。
- UnoCSS なし（素の CSS）: 旧サイトのスタイル資産（btn-game / btn-lily / preflights）を活かせない。

## 影響

- ビルド時に UnoCSS がユーティリティクラスを生成し、旧サイトと同等のスタイルが再現される。
- 追加依存は devDependency のみで、ランタイムへの影響はない。
