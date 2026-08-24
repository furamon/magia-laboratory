# ADR 0006: Keystatic 廃止と Markdown 手編集への回帰

**Status**: 採用（2026-08-24）

## 決定事項

Keystatic（`@keystatic/astro` / `@keystatic/core`）を削除し、コンテンツ管理を素の Markdown（`.md`）手編集に戻す。コンテンツ形式は Markdoc（`.mdoc`）から Markdown（`.md`）へ再移行する。

## 背景と理由

- Keystatic の管理画面が実運用上不便であり、編集フローがかえって手間になっていた。
- コンテンツ編集者は git 操作と Markdown に慣れており、CMS 管理画面の必要性が薄れた。
- 依存（`@keystatic/core` / `@keystatic/astro` / `@astrojs/react` / `@astrojs/markdoc`）と GitHub App 認証の運用コストを削減できる。

## 代替案

- Keystatic を維持: 管理画面の不便さが解消されないため不採用。
- 他 CMS へ移行: 導入・運用コストに見合う利点がなく不採用。

## 影響

- **依存削除**: `@keystatic/core` / `@keystatic/astro` / `@astrojs/react` / `@astrojs/markdoc` を削除。`astro.config.mjs` から各統合を除去。
- **コンテンツ形式**: `.mdoc` → `.md` にリネーム。`src/content.config.ts` の glob パターンを `**/*.md` に変更。
- **Markdoc タグ変換**: `{% table %}` などの Markdoc 固有タグを標準 Markdown テーブルに変換。
- **設定削除**: `keystatic.config.ts` と `tests/keystatic.test.ts` を削除。
- **環境変数削除**: `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` / `KEYSTATIC_SECRET` / `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` を `.env.example` から削除。
- **SSR は維持**: `@astrojs/node`（standalone）による SSR 配信は引き続き利用する。
