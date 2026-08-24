# ADR 0004: コンテンツコレクション採用

**Status**: 採用（2026-08-24）

## 決定事項

`src/content.config.ts` に `glob()` ローダーで 5 コレクション（blog / game / creation / lily / text）を定義し、`src/content/{collection}/` に Markdown を配置する。スキーマは `title`（必須）・`date`・`description`・`draft`（任意）の共通形とする。カテゴリページと詳細ページは `getCollection()` / `getEntry()` で生成する。

## 背景と理由

- Astro 公式のコンテンツ管理方式であり、frontmatter の型検証・draft 除外・ルーティング生成が標準機能で得られる。
- 旧実装の `content.server.ts`（import.meta.glob + gray-matter）は Astro では不要になる。
- コンテンツ実データの移行は仕様上範囲外のため、コレクション定義と骨格ページのみを実装する。

## 代替案

- 旧実装の import.meta.glob + gray-matter を移植: Astro の標準機能と重複し、DRY に反するため不採用。
- コンテンツコレクションなし（ハードコード）: 将来のコンテンツ追加を考慮すると不適切。

## 影響

- コレクションは初期状態で空（実データ移行は範囲外）。
- カテゴリページ・詳細ページ・検索一覧・RSS はコレクションから生成される。
