# ADR 0005: Keystatic 導入（CMS）

**Status**: 採用（2026-08-24）

## 決定事項

Astro サイトに Keystatic（https://keystatic.com/）を導入し、5 コレクション（blog / game / creation / lily / text）を管理画面から編集可能にする。本番運用は GitHub モードで行い、コンテンツは Keystatic 標準の Markdoc（`.mdoc`）形式に移行する。

## 背景と理由

- コンテンツを非技術者でも編集できるようにするため、CMS 管理画面が必要になった。
- Keystatic は Astro 公式の統合（`@keystatic/astro`）を提供しており、既存の Astro Content Collections と組み合わせて使える。
- 本番で編集するには GitHub モード（GitHub App 認証）が必須であり、Node.js サーバーサイド（SSR）が必要になる。

## 代替案

- 旧実装のまま Markdown を手編集: 編集者に git 操作と Markdown 知識を要求するため不採用。
- 他 CMS（Decap / TinaCMS 等）: Astro との統合度・GitHub 連携の容易さで Keystatic が優位。
- ローカルモードのみ: 本番での編集ができないため不採用。

## 影響

- **SSR 化**: 静的配信（nginx）から Node アダプタ（`@astrojs/node`）による SSR に変更。`Dockerfile` を nginx → Node に変更し、systemd でデーモン化する。
- **コンテンツ形式**: `.md` → `.mdoc`（Markdoc）に移行。`src/content.config.ts` の glob パターンを変更。
- **依存追加**: `@keystatic/core` / `@keystatic/astro` / `@astrojs/react` / `@astrojs/markdoc` / `@astrojs/node`。
- **環境変数**: `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` / `KEYSTATIC_SECRET` / `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` が必要。
- **GitHub App セットアップ**: 対話的な手順（GitHub 上での App 作成・権限付与）が別途必要。
