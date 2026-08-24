# コンポーネント契約（Component Contracts）

**Date**: 2026-08-24
**Branch**: `main`（仕様上の想定ブランチ: `001-personal-creative-site`）

Svelte コンポーネント（island）と Astro コンポーネントの props・イベント契約を定義する。

## Svelte コンポーネント（island）

### Header.svelte

サイト共通ヘッダー。`client:load` でマウントする。

| 項目 | 内容 |
|------|------|
| Props | なし（`SITE` / `NAVI` は `src/lib/site.ts` から直接参照） |
| 表示 | サイトタイトル（`SITE.TITLE` + favicon）、ナビゲーション（`NAVI` の 5 項目を `/` 区切りで表示）、検索ボタン |
| イベント | 検索ボタンクリック → 内部の `Search.svelte` の `open` を true にする |
| スタイル | `fixed top-0 right-0 left-0 z-50 py-6 bg-neutral-100/75 dark:bg-neutral-900/75`（旧実装と同一） |
| アクセシビリティ | 検索ボタンに `aria-label="Search"` |

### Footer.svelte

サイト共通フッター。`client:load` でマウントする。

| 項目 | 内容 |
|------|------|
| Props | なし |
| 表示 | コピーライト（`© {currentYear} {SITE.TITLE}`）、プライバシーポリシーリンク（`/privacy-policy`）、テーマ切替ボタン 3 個（ライト / ダーク / システム）、トップへ戻るボタン |
| イベント | テーマボタンクリック → `src/lib/theme.ts` の関数で適用・永続化。トップへ戻るボタンクリック → `window.scrollTo({ top: 0, behavior: "smooth" })` |
| テーマ状態 | `localStorage["theme"]` を初期値とし、選択中ボタンをハイライト表示 |
| アクセシビリティ | 各ボタンに `aria-label`（`Light theme` / `Dark theme` / `System theme` / `Back to top`） |

### Search.svelte

検索モーダル。Header.svelte の内部で使用する。

| 項目 | 内容 |
|------|------|
| Props | `open: boolean`（bindable、Header から制御） |
| 表示 | バックドロップ + モーダル。検索入力欄（プレースホルダー「検索...」）と結果一覧 |
| 初期リリースの挙動 | モーダルを開くと**全コンテンツの一覧**を表示（キーワード検索ロジックは実装しない）。コンテンツが 0 件の場合は「コンテンツがありません」を表示 |
| 一覧データ | ビルド時に `src/lib/search.ts` の `buildSearchIndex()` で生成した配列を props で受け取る |
| イベント | 閉じるボタン / バックドロップクリック / Esc キー → `open = false` |
| アクセシビリティ | 入力欄に `aria-label="検索クエリを入力"`、閉じるボタンに `aria-label="閉じる"` |

### ContentIndex.svelte

コレクション一覧表示。カテゴリページ（Astro）から使用する。

| 項目 | 内容 |
|------|------|
| Props | `entries: { slug: string; data: { title: string; date?: string; description?: string } }[]`、`baseHref: string`、`groupByYear?: boolean` |
| 表示 | エントリのカード一覧（タイトル・日付・説明）。`groupByYear` が true の場合は年別にグループ化 |
| イベント | なし（静的表示） |

## Astro コンポーネント

### Layout.astro

全ページ共通レイアウト。

| 項目 | 内容 |
|------|------|
| Props | `title?: string`、`description?: string`、`lilyPage?: boolean` |
| 表示 | `<head>`（メタ情報・テーマ初期化インラインスクリプト・favicon）、`<Header />`（client:load）、`<main>` にスロット、`<Footer />`（client:load） |
| テーマ初期化 | `<head>` 内 `<script is:inline>` で `localStorage["theme"]` を読み、`system` なら `prefers-color-scheme` を判定して `<html class="dark">` を付与 |

## 純粋関数モジュール（テスト対象）

### src/lib/site.ts

| エクスポート | 型 | 説明 |
|-------------|-----|------|
| `SITE` | `{ TITLE: string; DESCRIPTION: string; AUTHOR: string }` | サイトメタ情報（FR-008） |
| `NAVI` | `{ href: string; label: string }[]` | ヘッダーナビゲーション 5 項目（FR-002） |
| `TOP_CATEGORY_LINKS` | `{ label: string; links: { label: string; href: string; external?: boolean }[] }[]` | トップページ用カテゴリリンク（FR-003） |

### src/lib/theme.ts

| エクスポート | シグネチャ | 説明 |
|-------------|-----------|------|
| `Theme` | `"light" \| "dark" \| "system"` | テーマの値型 |
| `resolveTheme` | `(stored: string \| null) => Theme` | 保存値を検証し、不正値は `system` にフォールバック |
| `applyTheme` | `(theme: Theme, root: HTMLElement, media: MediaQueryList) => void` | `<html>` の `dark` クラスを付与/除去 |
| `getStoredTheme` | `(storage: Storage) => Theme` | `localStorage["theme"]` を読み検証 |
| `setStoredTheme` | `(theme: Theme, storage: Storage) => void` | `localStorage["theme"]` に保存 |

### src/lib/search.ts

| エクスポート | シグネチャ | 説明 |
|-------------|-----------|------|
| `SearchIndexEntry` | `{ url: string; title: string; description?: string; collection: string }` | 検索一覧の 1 件 |
| `buildSearchIndex` | `(collections: { name: string; entries: { id: string; data: { title: string; description?: string; draft?: boolean } }[] }[]) => SearchIndexEntry[]` | 全コレクションの公開エントリから一覧を生成（draft 除外・URL 整形） |
