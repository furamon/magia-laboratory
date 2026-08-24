# Research: 個人創作サイト（Astro + Svelte）

**Date**: 2026-08-24
**Branch**: `main`（仕様上の想定ブランチ: `001-personal-creative-site`）

## 調査対象

旧サイト（`magia-laboratory-old`、SvelteKit 製）のソースコードと、Astro 7 / Svelte 5 / UnoCSS 66 の公式ドキュメントを調査し、以下の技術的未知数を解決した。

## 1. UnoCSS の Astro 統合方式

- **Decision**: `@unocss/astro` を devDependency に追加し、`astro.config.mjs` の `integrations` に `UnoCSS()` を追加する。`uno.config.ts` は既存のものをそのまま使用する。
- **Rationale**: UnoCSS 公式ドキュメント（integrations/astro）が Astro 統合として `@unocss/astro` を推奨している。`unocss` パッケージの `./astro` エクスポート（`unocss/astro`）は `@unocss/astro` をオプショナルピアとして要求するため、`bun add -d @unocss/astro` で追加する。`uno.config.ts` は旧プロジェクトと同一ファイル（diff 確認済み）であり、preset-wind3 の `dark:` バリアントは `.dark` クラスベース（`variantMatcher(".dark", ...)`）で動作するため、`<html class="dark">` の付け替え方式がそのまま有効。
- **Alternatives considered**:
  - `@unocss/vite` を直接 `vite` プラグインとして追加: Astro の Vite 設定に手動で組み込む必要があり、Astro 統合の方が公式・簡潔。
  - UnoCSS なし（素の CSS）: 旧サイトのスタイル資産（btn-game / btn-lily / preflights）を活かせない。

## 2. テーマ初期化と FOUC 防止

- **Decision**: テーマ初期化は `Layout.astro` の `<head>` 内インライン `<script is:inline>` で行い、`localStorage.theme`（未保存時は `system`）を読み、`prefers-color-scheme` に基づいて `<html class="dark">` を付与する。テーマ切替ロジックは `src/lib/theme.ts` の純粋関数（`applyTheme` / `resolveTheme` / `getStoredTheme`）に分離し、`Footer.svelte` から呼び出す。
- **Rationale**: 旧実装（Footer.svelte の onMount で初期化）は初回描画後にテーマが適用されるため FOUC が発生する。SSG では HTML が先に配信されるため、`<head>` 内のインラインスクリプトで初期化するのが標準的な対策。`html.dark` の color-scheme 切り替えは既存 preflights に定義済み。
- **Alternatives considered**:
  - 旧実装のまま onMount で初期化: FOUC が残るため不採用。
  - `@unocss/preset-wind3` の `@dark` バリアント（prefers-color-scheme メディアクエリ）: ユーザー選択の「ライト」を尊重できないため不採用。

## 3. テスト基盤（Vitest + Astro）

- **Decision**: `vitest` と `@vitest/coverage-v8` を devDependency に追加し、`vitest.config.ts` を Astro 公式の `getViteConfig()` ヘルパーで構成する。テスト対象は `src/lib/**/*.ts` の純粋関数（site / theme / search）とし、カバレッジ目標 95%。`package.json` に `test` / `coverage` / `check` / `totalcheck` スクリプトを追加する。
- **Rationale**: Astro 公式ドキュメント（guides/testing）が `getViteConfig()` による Vitest 構成を推奨。旧プロジェクトも Vitest を使用しており、ロジックを純粋関数に分離するテスト戦略（Search.svelte のロジックを純粋関数としてテストする方式）を踏襲する。Svelte コンポーネント自体のテストはブラウザ環境が必要で複雑になるため、ロジック分離で代替する（旧プロジェクトの VRMCanvas.test.ts と同じ方針）。
- **Alternatives considered**:
  - `@vitest/browser-playwright` によるコンポーネントテスト: セットアップが重く、KISS 原則に反するため不採用。
  - Playwright E2E: 初期リリースでは不要（quickstart の目視確認で代替）。

## 4. コンテンツ管理（Astro Content Collections）

- **Decision**: `src/content.config.ts` に `glob()` ローダーで 5 コレクション（blog / game / creation / lily / text）を定義し、`src/content/{collection}/` に Markdown を配置する。スキーマは `title`（必須）・`date`・`description`・`draft`（オプション）の共通形。カテゴリページと詳細ページは `getCollection()` / `getEntry()` で生成する。
- **Rationale**: Astro 公式のコンテンツ管理方式であり、frontmatter の型検証・draft 除外・ルーティング生成が標準機能で得られる。旧実装の `content.server.ts`（import.meta.glob + gray-matter）は Astro では不要になる。コンテンツ実データの移行は仕様上範囲外のため、コレクション定義と骨格ページのみを実装する。
- **Alternatives considered**:
  - 旧実装の import.meta.glob + gray-matter を移植: Astro の標準機能と重複し、DRY に反するため不採用。
  - コンテンツコレクションなし（ハードコード）: 将来のコンテンツ追加を考慮すると不適切。

## 5. 検索モーダル（初期リリース: 全コンテンツ一覧表示）

- **Decision**: `Search.svelte` はモーダル表示・全コンテンツ一覧表示・空状態表示（コンテンツが 0 件のとき「コンテンツがありません」）までを実装する。一覧データはビルド時に `src/lib/search.ts` の純粋関数（`buildSearchIndex`）で生成し、Svelte コンポーネントへ props で渡す。キーワード検索ロジック・API エンドポイントは実装しない。
- **Rationale**: 仕様（FR-006・Clarifications）で「初期リリースはモーダル表示＋全コンテンツ一覧表示まで、キーワード検索ロジックは後続フェーズ」と確定済み。旧実装の `/api/search` エンドポイントとデバウンス検索は YAGNI により実装しない。エッジケース（検索対象コンテンツが存在しない場合の空表示）は仕様要件として実装する。
- **Alternatives considered**:
  - 旧実装の API 検索を移植: 仕様範囲外のため不採用。

## 6. RSS エンドポイント

- **Decision**: `src/pages/rss.xml.ts` を Astro のエンドポイントとして実装し、`@astrojs/rss` パッケージを使用する。サイト URL は `https://magialabs.blog`（旧実装と同じ）。
- **Rationale**: FR-002 のナビゲーションに RSS リンクが含まれるため、リンク先として RSS エンドポイントが必要。`@astrojs/rss` は Astro 公式の RSS 生成ライブラリで、旧実装の手書き XML 生成より簡潔。
- **Alternatives considered**:
  - 手書き XML 生成（旧実装の移植）: 公式ライブラリで代替可能なため不採用。

## 7. カテゴリページのスコープ

- **Decision**: カテゴリページ（/game /lily /creation /blog /text）は旧サイトの手書きコンテンツ（説明文・リンクボタン）を再現した骨格ページとして実装する。コンテンツ一覧（ContentIndex）はコレクションが空のため空表示となるが、コンポーネントは用意する。
- **Rationale**: 仕様の Assumptions で「コンテンツ実データの移行は範囲外、まずレイアウトと骨格の再現を優先」と明記されている。ナビゲーションリンク先が 404 にならないよう、骨格ページを用意する（エッジケース要件）。
- **Alternatives considered**:
  - カテゴリページを 404 のままにする: エッジケース（未作成ページへの遷移）で 404 表示は許容されるが、旧サイト同等のレイアウト再現（FR-001）の観点から骨格ページを用意する。

## 8. トップページの「最終更新」と SSGForm

- **Decision**: 実装しない。
- **Rationale**: 仕様の Key Entities に「最終更新」は含まれず、SSGForm も仕様に記載がない。コンテンツ実データ移行が範囲外のため、最新記事表示は空になる。YAGNI により不採用。
- **Alternatives considered**: なし。

## 9. 404 ページ

- **Decision**: `src/pages/404.astro` を実装し、旧実装（+error.svelte）の文言「404: ページが見つかりませんでした。ごめんね。」と「トップに戻る」ボタンを再現する。
- **Rationale**: エッジケース「ナビゲーションリンク先のページが未作成の場合」への対応。Astro の静的サイトでは `404.astro` が 404 ページとしてビルドされる。
- **Alternatives considered**: なし。

## 10. プライバシーポリシー

- **Decision**: `src/pages/privacy-policy.astro` として旧実装の内容（管理人・コメント・メディア・Cookie・埋め込みコンテンツ等）を再現する。
- **Rationale**: FR-004 でフッターにプライバシーポリシーへのリンクが必須。旧実装の本文をそのまま引き継ぐ。
- **Alternatives considered**: なし。

## 11. サイトメタ情報の一元管理（FR-008）

- **Decision**: `src/lib/site.ts` に `SITE`（TITLE / DESCRIPTION / AUTHOR）、`NAVI`（ヘッダーナビ 5 項目）、`TOP_CATEGORY_LINKS`（トップページ用カテゴリリンク）を定義し、全ページ・コンポーネントから参照する。`Layout.astro` の `<title>` / `<meta name="description">` は `SITE` から生成する。
- **Rationale**: FR-008 の要件。旧実装の `site.ts` を拡張し、ヘッダーナビ（FR-002）とトップページ用カテゴリリンク（FR-003）を別エンティティとして定義する（Clarifications の決定事項）。
- **Alternatives considered**: なし。

## 12. レスポンシブ対応（FR-007）

- **Decision**: 旧実装のクラス構成（`flex flex-wrap`、`md:flex-row`、`sm:grid-cols-2` 等）をそのまま引き継ぎ、モバイル幅ではヘッダーナビが折り返し、トップページのカテゴリ列が縦積みになるようにする。
- **Rationale**: 旧実装が既にレスポンシブ対応済みであり、UnoCSS のユーティリティクラスをそのまま再現するのが最も確実。
- **Alternatives considered**: なし。

## 13. ビルド・チェック基盤

- **Decision**: `package.json` に `check`（`astro check`）、`test`（`vitest run`）、`coverage`（`vitest run --coverage`）、`totalcheck`（`astro check && biome check . && vitest run`）を追加する。`@astrojs/check` を devDependency に追加する。
- **Rationale**: 憲章の品質ゲート（`bun run totalcheck`）を満たすため。Astro の型チェックは `astro check`（`@astrojs/check`）が公式。
- **Alternatives considered**: なし。

## 14. デプロイ・Docker

- **Decision**: 本フェーズでは変更しない。既存の Dockerfile / docker-compose.yml は SvelteKit 用のため、デプロイ設定の更新は後続フェーズ（実装完了後）のタスクとして tasks.md に記載する。
- **Rationale**: 仕様はレイアウト・骨格の再現に限定されており、デプロイ基盤の更新は実装フェーズで判断する。
- **Alternatives considered**: なし。
