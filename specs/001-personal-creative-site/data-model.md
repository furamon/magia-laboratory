# Data Model: 個人創作サイト（Astro + Svelte）

**Date**: 2026-08-24
**Branch**: `main`（仕様上の想定ブランチ: `001-personal-creative-site`）

本機能のデータはすべて静的定義（TypeScript 定数）またはファイルベース（Markdown）であり、DB は使用しない。

## エンティティ一覧

### 1. サイトメタ情報（SiteMeta）

サイト全体の定数。`src/lib/site.ts` の `SITE` に定義する（FR-008）。

| フィールド | 型 | 必須 | 値 | 説明 |
|-----------|-----|------|-----|------|
| `TITLE` | `string` | 必須 | `"Magia Laboratory"` | サイトタイトル |
| `DESCRIPTION` | `string` | 必須 | `"ゲーム攻略、百合作品などのサイト。"` | サイト説明文 |
| `AUTHOR` | `string` | 必須 | `"Furamon"` | 著者名 |

**検証ルール**: すべて非空文字列。`as const` でリテラル型を固定する。

### 2. ナビゲーション項目（NavigationItem）

ヘッダーに表示するナビゲーションリンクの定義。`src/lib/site.ts` の `NAVI` に定義する（FR-002）。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `href` | `string` | 必須 | リンク先 URL（サイト内パスまたは `/rss.xml`） |
| `label` | `string` | 必須 | 表示ラベル |

**定義値（表示順）**:

| ラベル | href |
|--------|------|
| Game | `/game` |
| Lily | `/lily` |
| Creation | `/creation` |
| Diary | `/blog` |
| RSS | `/rss.xml` |

**検証ルール**: ラベルは非空。href は `/` で始まる。表示順は定義順（配列順）を正とする。

### 3. トップページ用カテゴリリンク（TopCategoryLink）

トップページのカテゴリボタン群の定義。`src/lib/site.ts` の `TOP_CATEGORY_LINKS` に定義する（FR-003）。

**重要**: ヘッダーのナビゲーション項目（エンティティ 2）とは**別エンティティ**として管理する（Clarifications 2026-08-24 の決定事項）。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `label` | `string` | 必須 | カテゴリ見出し（Game / Creation / Lily / etc. / Some Links） |
| `links` | `TopCategoryLinkItem[]` | 必須 | カテゴリ内のリンクボタン群 |

**TopCategoryLinkItem**:

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `label` | `string` | 必須 | ボタン表示ラベル |
| `href` | `string` | 必須 | リンク先 URL |
| `external` | `boolean` | 任意（既定 false） | 外部リンクかどうか（true なら `target="_blank"` + `rel="noopener noreferrer"`） |

**定義値（旧サイトのトップページから引き継ぎ、表示順を正とする）**:

| カテゴリ | リンク（label → href） |
|----------|------------------------|
| Game | PlayGuide → `/game/guide`、PlayDiary → `/game/playdiary`、TalkRoom → `/game/talk`、GameList → `https://gamelist.magialabs.blog`（外部） |
| Creation | Dear Claudias → `/creation/dearclaudias`、Lightning Rubellum → `/creation/lightningrubellum` |
| Lily | Coming Soon...（リンクなし・プレースホルダー） |
| etc. | Infomation → `/text/infomation`、Text → `/text`、Diary → `/blog`、BBS → `https://alliera.magialabs.blog/`（外部）、Mastodon Server → `https://claudias.magialabs.blog/`（外部） |
| Some Links | Pixiv → `https://www.pixiv.net/users/74381242`（外部）、YouTube → `https://m.youtube.com/channel/UCmoakOUjAai3AW1d2Ip_wxg`（外部）、Github → `https://github.com/Furamon`（外部）、X (Twitter) → `https://twitter.com/FuramonMagia`（外部） |

**検証ルール**: ラベルは非空。外部リンクは `https://` で始まる。内部リンクは `/` で始まる。

### 4. テーマ設定（Theme）

フッターのテーマ切替で選択される値。`src/lib/theme.ts` に定義する（FR-005）。

| 値 | 説明 |
|----|------|
| `light` | ライトテーマ |
| `dark` | ダークテーマ |
| `system` | OS の配色設定に追従（デフォルト） |

**状態遷移**:

```text
[任意のテーマ] --ユーザーがボタンクリック--> [選択したテーマ]
[system] --OS の配色設定変更--> [dark | light]（表示のみ・保存値は system のまま）
```

**永続化**: `localStorage` のキー `theme` に保存。未保存時は `system` を既定とする。

**検証ルール**: 値は上記 3 値のいずれか。不正な保存値（例: `"blue"`）は `system` として扱う。

**適用ルール**:
- `dark` → `<html>` に `dark` クラスを付与
- `light` → `dark` クラスを除去
- `system` → `prefers-color-scheme: dark` が true なら付与、false なら除去

### 5. コンテンツエントリ（ContentEntry）

Markdown コンテンツ。Astro Content Collections で管理する（`src/content.config.ts`）。実データ移行は範囲外のため、初期状態ではコレクションは空。

**コレクション**: `blog` / `game` / `creation` / `lily` / `text`（`src/content/{collection}/` 配下）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `title` | `string` | 必須 | 記事タイトル |
| `date` | `string`（ISO 8601） | 任意 | 公開日 |
| `description` | `string` | 任意 | 説明文 |
| `draft` | `boolean` | 任意（既定 false） | true なら公開一覧から除外 |

**検証ルール**: `title` は非空。`draft: true` のエントリは一覧・検索・RSS から除外する。

**関連**: カテゴリページ（`/game` 等）はコレクションの公開エントリ一覧を表示し、詳細ページ（`/game/[...slug]` 等）は 1 エントリを表示する。検索モーダルは全コレクションの公開エントリを一覧表示する。

## エンティティ間の関係

```text
SiteMeta (1) ──参照──> Layout.astro（title / description / author）
NavigationItem (5) ──参照──> Header.svelte（ナビゲーション表示）
TopCategoryLink (5) ──参照──> index.astro（カテゴリボタン群表示）
Theme (1) ──永続化──> localStorage("theme")
ContentEntry (N) ──生成──> カテゴリページ / 詳細ページ / 検索一覧 / RSS
```

## 状態遷移（該当するもののみ）

### テーマ設定

| 遷移 | トリガー | 結果 |
|------|----------|------|
| 任意 → `light` | フッターのライトボタンクリック | `localStorage.theme = "light"`、`<html>` から `dark` クラス除去 |
| 任意 → `dark` | フッターのダークボタンクリック | `localStorage.theme = "dark"`、`<html>` に `dark` クラス付与 |
| 任意 → `system` | フッターのシステムボタンクリック | `localStorage.theme = "system"`、OS 設定に応じて `dark` クラス付与/除去 |
| `system`（表示のみ） | OS の配色設定変更 | `dark` クラス付与/除去（保存値は `system` のまま） |
| 初回訪問（未保存） | ページ読み込み | `system` として扱い、OS 設定に応じて表示 |

### 検索モーダル

| 遷移 | トリガー | 結果 |
|------|----------|------|
| 閉 → 開 | ヘッダーの検索ボタンクリック | モーダル表示・全コンテンツ一覧表示 |
| 開 → 閉 | 閉じるボタン / バックドロップクリック / Esc | モーダル非表示 |

## 検証ルールの実装方針

- エンティティ 1〜3 は `as const` のリテラル型で型レベル検証し、単体テスト（`tests/site.test.ts`）でラベル・href の形式を検証する。
- エンティティ 4 は `src/lib/theme.ts` の純粋関数（`resolveTheme` / `applyTheme` / `getStoredTheme`）で検証し、単体テスト（`tests/theme.test.ts`）で 3 値以外の扱い・localStorage 永続化・OS 設定追従を検証する。
- エンティティ 5 は Astro Content Collections の Zod スキーマで検証する。
