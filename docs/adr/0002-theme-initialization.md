# ADR 0002: テーマ初期化・FOUC 防止

**Status**: 採用（2026-08-24）

## 決定事項

テーマ初期化は `Layout.astro` の `<head>` 内インライン `<script is:inline>` で行う。`localStorage.theme`（未保存時は `system`）を読み、`prefers-color-scheme` に基づいて `<html class="dark">` を付与する。テーマ切替ロジックは `src/lib/theme.ts` の純粋関数（`applyTheme` / `resolveTheme` / `getStoredTheme` / `setStoredTheme`）に分離し、`Footer.svelte` から呼び出す。

## 背景と理由

- 旧実装（Footer.svelte の onMount で初期化）は初回描画後にテーマが適用されるため FOUC（初回描画時の配色ちらつき）が発生する。
- SSG では HTML が先に配信されるため、`<head>` 内のインラインスクリプトで初期化するのが標準的な対策。
- `html.dark` の color-scheme 切り替えは既存 preflights に定義済み。

## 代替案

- 旧実装のまま onMount で初期化: FOUC が残るため不採用。
- `@unocss/preset-wind3` の `@dark` バリアント（prefers-color-scheme メディアクエリ）: ユーザー選択の「ライト」を尊重できないため不採用。

## 影響

- 初回訪問時（未保存）はシステム設定に基づく配色が適用される。
- テーマ選択は `localStorage["theme"]`（`light` / `dark` / `system`）に永続化され、リロード後も維持される。
