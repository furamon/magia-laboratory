# ADR 0007: Pages CMS 導入とカテゴリページの CMS 編集可能化

**Status**: 採用（2026-08-25）

## 決定事項

Pages CMS（https://pagescms.org/、`.pages.yml` が設定ファイル）を導入し、コンテンツを管理画面から編集可能にする。加えて、`src/pages/` 内の `index.astro` 以外のカテゴリランディングページ（game / lily / creation / text の 4 ページ）の本文を、各既存コレクション直下の `index.md` に移行し、CMS 編集可能にする。

## 背景と理由

- ADR 0006 で Keystatic を廃止し Markdown 手編集に回帰したが、非技術者の編集を容易にするため、軽量な Git ベース CMS（Pages CMS）の導入が望まれた。
- Pages CMS は `.pages.yml` 1 ファイルで設定でき、依存パッケージの追加や SSR 構成の変更が不要（リポジトリ内のファイルを直接編集する方式）なため、Keystatic のような運用コストを発生させない。
- カテゴリランディングページは現在 `.astro` 内に HTML 直書きされており、内容がコードに埋もれていた。これを `index.md` に移すことで、タイトル・説明文・カード（リンクボタン）群を CMS で編集できる。

## 代替案

- 専用の `page` コレクションを新設: 既存コレクションの `index.md` を流用できるため不採用（DRY、ルート設計の重複回避）。
- Decap CMS / TinaCMS: 導入・運用コストが Pages CMS より高く、必要機能（Markdown 編集）に差がないため不採用。

## 影響

- **スキーマ拡張**: `src/content.config.ts` のコレクションスキーマに `links`（カード 1 件のオブジェクト配列: `label` / `href` / `external` / `description`）を追加。
- **コンテンツ移行**: 4 カテゴリページの内容を各コレクション直下の `index.md`（`src/content/{game,creation,lily,text}/index.md`）に移動。カード群は frontmatter の `links`、説明文等の本文は Markdown 本文に記述。
- **ページ変更**: `game.astro` / `creation.astro` / `lily.astro` / `text.astro` を `getEntry(コレクション, "index")` で `index.md` を読み込み、既存のボタンカード見た目（`btn-game` / `btn-lily`）を維持して描画するよう変更。
- **重複 URL 防止**: 各 `[...slug].astro` の `getStaticPaths()` で `id !== "index"` を除外し、`/game`（= `/game/index`）と `/game/index` の 2 経路が共存しないようにした。
- **CMS 設定**: `.pages.yml` の各コレクションに `links`（`type: object` + `list: true`）を追加し、CMS 画面からカードを編集可能にした。
- `404.astro` / `privacy-policy.astro` は静的ページとして維持（範囲外）。
