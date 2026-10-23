# ADR 0009: 外部リンクを新しいタブで開く

**Status**: 採用（2026-10-23）

## 決定事項

外部リンク（http / https の絶対 URL）は常に `target="_blank"` + `rel="noopener noreferrer"` で新しいタブに開く。サイト内リンク（相対パス・アンカー）は同一タブのまま遷移する。判定ロジックは `src/lib/external-links.ts` に集約する。

- **Markdown 本文**: `src/lib/external-links.ts` の `externalLinksPlugin`（Sätteri の HAST プラグイン）を `astro.config.mjs` の `markdown.processor`（`satteri({ hastPlugins: [...] })`）へ渡し、`<a>` 要素の `href` を見て属性を付与する。本文側に `target` を書く必要はない。
- **カテゴリカード**: `shouldOpenInNewTab()` が `external: true` または絶対 URL のいずれかで新規タブと判定し、`index.astro`（トップ）と `game` / `lily` / `creation` / `text` の各 `index.astro` が共通で使う。
- ヘッダー / フッター / 検索モーダル / 一覧カードなどサイト内ナビゲーションは対象外（同一タブ）。

## 背景と理由

- 外部サイトへの参照（攻略サイト、配布元、SNS 等）が本文に多数あり、読者の離脱を防ぎつつサイトを開いたまま参照させたい。
- 従来はカードの `external: true` フラグのみで新規タブを制御していたが、`href` が絶対 URL でもフラグを付け忘れると同一タブ遷移になっており、判定が二重管理になっていた。
- 判定を `href` ベースの純粋関数へ寄せることで、Markdown 本文・カード・将来のリンク表示箇所で挙動が一致する（DRY）。

## 代替案

- **`markdown.rehypePlugins`（rehype プラグイン）**: Astro 7 では Sätteri が既定の Markdown プロセッサとなり `markdown.remarkPlugins` / `markdown.rehypePlugins` は非推奨。利用には `@astrojs/markdown-remark`（unified パイプライン）の追加が必要で、既定構成から外れるため不採用。
- **コンポーネントテストで `<Content components={{ a }}>` を差し替え**: Astro コンポーネントの用意とレンダリング経路の変更が必要で、Markdown 本文と MDX で挙動が割れる。HAST プラグインの方が一箇所で完結するため不採用。
- **全リンクを新規タブ化**: サイト内回遊のたびにタブが増え、戻る操作も効かなくなるため不採用。

## 影響

- `@astrojs/markdown-satteri`（`satteri()` を利用するため）を dependencies、`satteri`（プラグイン型とテストでの実行のため）を devDependencies に追加した。
- テストは `tests/external-links.test.ts` に置き、判定関数の単体検証に加え、`satteri` の `markdownToHtml` で実際に属性が付くことまで確認する。カバレッジ対象は従来どおり `src/lib/**/*.ts`。
- カードで新規タブにしたいが URL が相対パスの場合は、従来どおり `external: true` を明示する。
