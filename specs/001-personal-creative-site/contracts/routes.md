# ルート契約（Route Contracts）

**Date**: 2026-08-24
**Branch**: `main`（仕様上の想定ブランチ: `001-personal-creative-site`）

本サイトが公開する URL と、各 URL の表示内容・メタ情報の契約を定義する。

## ルート一覧

| パス | ページ | 生成元 | 要件 |
|------|--------|--------|------|
| `/` | トップページ | `src/pages/index.astro` | FR-003 |
| `/game` | Game カテゴリページ | `src/pages/game.astro` | FR-001 |
| `/lily` | Lily カテゴリページ | `src/pages/lily.astro` | FR-001 |
| `/creation` | Creation カテゴリページ | `src/pages/creation.astro` | FR-001 |
| `/blog` | Diary カテゴリページ | `src/pages/blog.astro` | FR-001 |
| `/text` | Text カテゴリページ | `src/pages/text.astro` | FR-001 |
| `/game/[...slug]` | Game コンテンツ詳細 | `src/pages/game/[...slug].astro` | - |
| `/lily/[...slug]` | Lily コンテンツ詳細 | `src/pages/lily/[...slug].astro` | - |
| `/creation/[...slug]` | Creation コンテンツ詳細 | `src/pages/creation/[...slug].astro` | - |
| `/blog/[...slug]` | Diary コンテンツ詳細 | `src/pages/blog/[...slug].astro` | - |
| `/text/[...slug]` | Text コンテンツ詳細 | `src/pages/text/[...slug].astro` | - |
| `/privacy-policy` | プライバシーポリシー | `src/pages/privacy-policy.astro` | FR-004 |
| `/rss.xml` | RSS フィード | `src/pages/rss.xml.ts` | FR-002（ナビリンク先） |
| `/404`（任意パス） | 404 ページ | `src/pages/404.astro` | エッジケース |

## 共通契約

### メタ情報（FR-008）

全ページは `src/lib/site.ts` の `SITE` を参照し、以下を出力する。

- `<title>`: `{ページ固有タイトル} - Magia Laboratory`（トップページのみ `Magia Laboratory`）
- `<meta name="description">`: ページ固有の説明文（未定義の場合は `SITE.DESCRIPTION`）
- `<meta name="author">`: `SITE.AUTHOR`
- `<link rel="icon">`: `/favicon.svg`（既存アセット）

### レイアウト（FR-001）

全ページは `src/layouts/Layout.astro` を使用し、以下を共通表示する。

- 上部: 固定ヘッダー（`position: fixed; top: 0; z-index: 50`）
- 中央: `<main>`（`padding: 8rem 1rem 8rem`）
- 下部: フッター
- `/lily` 配下のページは `<body>` に `lily-page` クラスを付与（既存 preflights の配色を適用）

### テーマ（FR-005）

- `<html>` 要素の `dark` クラスでダークテーマを適用（UnoCSS preset-wind3 の `dark:` バリアント）
- 初期化は `<head>` 内インラインスクリプトで行い、FOUC を防止する
- 保存キー: `localStorage["theme"]`、値: `light` / `dark` / `system`（既定 `system`）

## ページ別契約

### トップページ `/`

| 項目 | 内容 |
|------|------|
| タイトル | `Magia Laboratory`（h1、text-5xl font-bold） |
| 説明文 | `ゲーム攻略、百合作品などのサイト。`（text-xl font-bold） |
| カテゴリボタン群 | `TOP_CATEGORY_LINKS` の定義に従い、3 列（md 以上）で表示。内部リンクは遷移、外部リンクは `target="_blank"` + `rel="noopener noreferrer"` で新規タブ表示 |
| ボタンスタイル | Game 系: `btn-game`、Lily 系: `btn-lily`（既存 UnoCSS ルール） |

### カテゴリページ `/game` `/lily` `/creation` `/blog` `/text`

| 項目 | 内容 |
|------|------|
| タイトル | 旧サイトの見出し（例: `/game` は「ゲームのページ」） |
| 説明文・リンク | 旧サイトの手書きコンテンツを再現（例: `/game` は「げーむのやりこみ」等の `btn-game` リンク） |
| コンテンツ一覧 | `ContentIndex.svelte` でコレクションの公開エントリを表示（blog のみ年別グループ）。コレクションが空の場合は空表示 |

### コンテンツ詳細 `/game/[...slug]` 等

| 項目 | 内容 |
|------|------|
| タイトル | エントリの `title`（h1、text-5xl） |
| 本文 | Markdown をレンダリング（`render()` 使用） |
| 404 時 | 「404」と「ページが見つかりませんでした。」を表示し、一覧へ戻るリンクを表示 |

### 404 ページ

| 項目 | 内容 |
|------|------|
| 文言 | `404: ページが見つかりませんでした。ごめんね。` |
| アクション | 「トップに戻る」ボタン（`btn-game`） |

### RSS フィード `/rss.xml`

| 項目 | 内容 |
|------|------|
| 形式 | RSS 2.0（`application/rss+xml; charset=utf-8`） |
| サイト URL | `https://magialabs.blog` |
| 対象 | blog コレクションの公開エントリ（最新 20 件） |
| 各 item | `title` / `link` / `guid` / `pubDate` / `description` |

## 外部リンク契約

トップページのカテゴリリンクに含まれる外部リンクは、旧サイトと同じ URL を引き継ぐ（Assumptions）。

| ラベル | URL |
|--------|-----|
| GameList | `https://gamelist.magialabs.blog` |
| BBS | `https://alliera.magialabs.blog/` |
| Mastodon Server | `https://claudias.magialabs.blog/` |
| Pixiv | `https://www.pixiv.net/users/74381242` |
| YouTube | `https://m.youtube.com/channel/UCmoakOUjAai3AW1d2Ip_wxg` |
| Github | `https://github.com/Furamon` |
| X (Twitter) | `https://twitter.com/FuramonMagia` |

すべて `target="_blank"` + `rel="noopener noreferrer"` で新規タブ表示する。
