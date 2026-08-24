## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Quality Gates

- 実装完了時は必ず `npm run totalcheck`（`astro check` + `biome check .` + `vitest run`）を実行し、すべて合格してから完了とする。
- カバレッジ目標は 95%（`npm run coverage` で確認。対象: `src/lib/**/*.ts`）。
- テストは TDD で実装より先に書き、失敗を確認してから実装する（憲章）。

## Project Structure

- 単一プロジェクト構成（Astro 標準の `src/` レイアウト）。
- サイト定数（`SITE` / `NAVI` / `TOP_CATEGORY_LINKS`）は `src/lib/site.ts` に一元管理（DRY）。
- テーマ切替ロジックは `src/lib/theme.ts`、検索一覧ロジックは `src/lib/search.ts` の純粋関数に分離。
- 対話性が必要なコンポーネント（Header / Footer / Search）は Svelte island として `client:load` でマウント。
- コンテンツは `src/content/{collection}/` の Markdoc（`.mdoc`、blog / game / creation / lily / text の 5 コレクション）。
- `src/content.config.ts` の glob ローダーは各コレクションのディレクトリを `base` に指定し、エントリ ID をコレクション相対（例: `game/guide/nectaris/system`）にする。`base` を `./src/content` にすると ID にコレクション名が重複し、URL が `/blog/blog/...` になるため注意。
- コンテンツは Keystatic（`keystatic.config.ts`、GitHub モード）で管理する。管理画面は `/keystatic`。slug に `/` を含めるとフォルダ階層（例: `guide/fireemblem/fe1-darkdragon`）として保存できる。
- サイトは SSR（`@astrojs/node` standalone）で配信し、systemd（`deploy/magia-laboratory.service`）でデーモン化する。
- 設計判断は `docs/adr/` に記録する。

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
