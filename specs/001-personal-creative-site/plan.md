# Implementation Plan: 個人創作サイト（Astro + Svelte）

**Branch**: `main`（仕様上の想定ブランチ: `001-personal-creative-site`） | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-creative-site/spec.md`

## Summary

旧サイト（SvelteKit 製 Magia Laboratory）のレイアウト・骨格を、Astro + Svelte の新プロジェクトに再現する。固定ヘッダー（タイトル・ナビゲーション・検索ボタン）、トップページ（タイトル・説明文・カテゴリリンクボタン群）、フッター（コピーライト・プライバシーポリシー・テーマ切替・トップへ戻る）を構築し、テーマ切替（ライト/ダーク/システム）と検索モーダル（全コンテンツ一覧表示のみ）を実装する。コンテンツ実データの移行・キーワード検索ロジック・SSGForm・最終更新表示は仕様上範囲外とし実装しない。

## Technical Context

**Language/Version**: TypeScript（Astro 7.2.4 / Svelte 5.56.10 / Node >= 22.12.0 / bun）

**Primary Dependencies**:
- 既存: `astro`, `@astrojs/svelte`, `svelte`, `typescript`, `unocss`（preset-wind3 / preset-typography / transformer-directives）
- 追加（dev）: `@unocss/astro`（UnoCSS の Astro 統合に必須のオプショナルピア）、`vitest`, `@vitest/coverage-v8`, `@astrojs/check`（`astro check` 用）
- 追加（runtime）: `@astrojs/rss`（RSS エンドポイント生成）

**Storage**: ファイルベース。Markdown コンテンツは Astro Content Collections（`src/content/`、実データ移行は範囲外のため空）。テーマ設定はブラウザ `localStorage`（キー: `theme`）。

**Testing**: Vitest（`getViteConfig()` ベースの `vitest.config.ts`）+ `astro check` + `biome check`。ロジックは純粋関数（`src/lib/`）に分離して単体テスト。カバレッジ目標 95%（`src/lib/**/*.ts` を対象）。

**Target Platform**: 静的サイト（SSG）。モダンブラウザ（テーマ切替・検索モーダルはクライアントサイド）。

**Project Type**: Web サイト（静的サイトジェネレーター）

**Performance Goals**: SC-001（トップページ表示から 3 秒以内に主要ナビゲーションを視認）、SC-002（テーマ切替が 1 クリック・1 秒以内に反映）

**Constraints**: FR-007 レスポンシブ対応（モバイル幅でナビが折り返す）。テーマ初期化は FOUC（初回描画時の配色ちらつき）を防ぐため `<head>` 内インラインスクリプトで行う。

**Scale/Scope**: 個人サイト。5 コレクション（blog / game / creation / lily / text）。静的ページは少数。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 判定 | 根拠 |
|------|------|------|
| I. テストファースト（TDD・95% カバレッジ） | PASS | Vitest 基盤を導入し、テーマ・検索・サイト定数のロジックを純粋関数に分離してテスト可能にする。テスト → コード → 全テスト成功後にコミットのサイクルを厳守する。 |
| II. KISS & YAGNI | PASS | 仕様範囲外（キーワード検索ロジック・コンテンツ実データ移行・SSGForm・最終更新表示・CMS）は実装しない。カテゴリページは骨格のみ。 |
| III. DRY | PASS | サイトメタ情報・ナビゲーション項目・カテゴリリンクは `src/lib/site.ts` に一元化し、ヘッダー・トップページ・フッターから参照する。 |
| IV. 安易なエラーフォールバックの禁止 | PASS | 検索モーダルはエラーを明示表示し、黙って隠さない。コンテンツ不在時は空状態メッセージを表示する（仕様のエッジケース要件）。 |
| V. セキュリティ最優先 | PASS | 秘密情報は扱わない。外部リンク（target="_blank"）には `rel="noopener noreferrer"` を付与する。 |
| ADR 記録 | PASS | 設計判断（UnoCSS 統合方式・テーマ初期化・テスト基盤・コンテンツコレクション）を `docs/adr/` に記録し、実装変更と同一コミットに含める。 |

**GATE 結果**: 違反なし。Phase 1 後に再評価する。

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-creative-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── layouts/
│   └── Layout.astro          # 共通レイアウト（ヘッダー・メイン・フッター、テーマ初期化スクリプト、lily-page クラス）
├── components/
│   ├── Header.svelte         # 固定ヘッダー（サイトタイトル・ナビ・検索ボタン）client:load
│   ├── Footer.svelte         # フッター（コピーライト・プライバシーポリシー・テーマ切替・トップへ戻る）client:load
│   ├── Search.svelte         # 検索モーダル（全コンテンツ一覧表示・空状態表示）client:load
│   └── ContentIndex.svelte   # コレクション一覧表示（カテゴリページ用）
├── lib/
│   ├── site.ts               # サイトメタ情報・ナビゲーション項目・トップページ用カテゴリリンク定数（FR-008）
│   ├── theme.ts              # テーマ切替ロジック（純粋関数: 適用・判定・永続化）
│   └── search.ts             # 検索一覧ロジック（純粋関数: 一覧整形・空状態判定）
├── content.config.ts         # コンテンツコレクション定義（blog / game / creation / lily / text）
├── content/                  # Markdown コンテンツ（実データ移行は範囲外・空）
└── pages/
    ├── index.astro           # トップページ（FR-003: タイトル・説明文・カテゴリリンクボタン群）
    ├── game.astro            # カテゴリページ（骨格・旧サイトの手書きコンテンツを再現）
    ├── lily.astro            # カテゴリページ（骨格）
    ├── creation.astro        # カテゴリページ（骨格）
    ├── blog.astro            # カテゴリページ（骨格・年別グループ表示）
    ├── text.astro            # カテゴリページ（骨格）
    ├── game/[...slug].astro  # コンテンツ詳細ページ（骨格・コレクションから生成）
    ├── lily/[...slug].astro
    ├── creation/[...slug].astro
    ├── blog/[...slug].astro
    ├── text/[...slug].astro
    ├── privacy-policy.astro  # プライバシーポリシー（FR-004 のリンク先）
    ├── 404.astro             # 404 ページ（エッジケース: 未作成ページへの遷移）
    └── rss.xml.ts            # RSS エンドポイント（FR-002 のナビリンク先）

tests/
├── site.test.ts              # site.ts 定数の検証
├── theme.test.ts             # テーマ切替ロジックの検証
└── search.test.ts            # 検索一覧ロジックの検証

docs/adr/
├── 0001-unocss-astro-integration.md   # UnoCSS の Astro 統合方式
├── 0002-theme-initialization.md        # テーマ初期化（FOUC 防止）
├── 0003-testing-setup.md              # Vitest 基盤とカバレッジ方針
└── 0004-content-collections.md         # コンテンツコレクション採用

vitest.config.ts              # getViteConfig() ベースのテスト設定
```

**Structure Decision**: 単一プロジェクト構成（Astro 標準の `src/` レイアウト）。旧 SvelteKit プロジェクトの `$lib/site.ts` → `src/lib/site.ts`、`$lib/components/*` → `src/components/*` に対応させる。Svelte コンポーネントは対話性が必要なもの（Header / Footer / Search）のみ island として `client:load` でマウントし、静的表示は Astro コンポーネントで行う。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| （なし） | - | - |
