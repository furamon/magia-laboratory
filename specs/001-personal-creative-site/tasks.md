---

description: "個人創作サイト（Astro + Svelte）の実装タスク一覧"

---

# Tasks: 個人創作サイト（Astro + Svelte）

**Input**: Design documents from `/specs/001-personal-creative-site/`

**Prerequisites**: plan.md（必須）、spec.md（ユーザーストーリー）、research.md、data-model.md、contracts/

**Tests**: 本プロジェクトは憲章（テストファースト・カバレッジ 95%）により TDD が必須のため、各ストーリーにテストタスクを含める。テストは必ず実装より先に書き、失敗を確認してから実装する。

**Organization**: タスクはユーザーストーリー単位でグループ化し、各ストーリーを独立して実装・テストできるようにする。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並行実行可能（別ファイル・未完了タスクへの依存なし）
- **[Story]**: 所属するユーザーストーリー（US1〜US4）
- 説明には正確なファイルパスを含める

## Path Conventions

- 単一プロジェクト構成（Astro 標準の `src/` レイアウト）。`src/`・`tests/` はリポジトリルート直下。

---

## Phase 1: Setup（共有インフラ）

**Purpose**: プロジェクト初期化と基本構造の構築

- [ ] T001 依存関係を追加する: `bun add -d @unocss/astro vitest @vitest/coverage-v8 @astrojs/check && bun add @astrojs/rss`（research.md セクション 1・3・6）
- [ ] T002 `astro.config.mjs` に UnoCSS 統合を追加する（`import UnoCSS from '@unocss/astro'` + `integrations: [svelte(), UnoCSS()]`。`uno.config.ts` は既存のものをそのまま使用）
- [ ] T003 `vitest.config.ts` を Astro 公式の `getViteConfig()` ヘルパーで作成する（research.md セクション 3）
- [ ] T004 `package.json` の scripts に `test`（`vitest run`）・`coverage`（`vitest run --coverage`）・`check`（`astro check`）・`totalcheck`（`astro check && biome check . && vitest run`）を追加する
- [ ] T005 [P] ADR 0001（UnoCSS の Astro 統合方式）を `docs/adr/0001-unocss-astro-integration.md` に記録する
- [ ] T006 [P] ADR 0003（Vitest 基盤とカバレッジ方針）を `docs/adr/0003-testing-setup.md` に記録する

---

## Phase 2: Foundational（ブロッキング前提条件）

**Purpose**: 全ユーザーストーリーの前提となるコア基盤。このフェーズ完了前にストーリー実装を開始してはならない。

**⚠️ CRITICAL**: このフェーズが完了するまでユーザーストーリーの作業は開始できない

- [ ] T007 `tests/site.test.ts` を書く（TDD: 先に書き、失敗を確認する。`SITE` / `NAVI` / `TOP_CATEGORY_LINKS` のラベル・href 形式・表示順・外部リンクの `https://` 検証。data-model.md エンティティ 1〜3 の検証ルール）
- [ ] T008 `src/lib/site.ts` を実装する（`SITE`（TITLE / DESCRIPTION / AUTHOR）・`NAVI`（Game / Lily / Creation / Diary / RSS の 5 項目）・`TOP_CATEGORY_LINKS`（Game / Creation / Lily / etc. / Some Links の 5 カテゴリ、data-model.md の定義値を `as const` で固定。T007 のテストを成功させる）
- [ ] T009 `src/content.config.ts` を作成する（`glob()` ローダーで blog / game / creation / lily / text の 5 コレクションを定義。スキーマ: `title` 必須・`date` / `description` / `draft` 任意。research.md セクション 4）
- [ ] T010 [P] ADR 0004（コンテンツコレクション採用）を `docs/adr/0004-content-collections.md` に記録する

**Checkpoint**: 基盤完成。ユーザーストーリーの実装を並行開始できる。

---

## Phase 3: User Story 1 - サイト全体のレイアウトとナビゲーション（Priority: P1）🎯 MVP

**Goal**: 固定ヘッダー（サイトタイトル・ナビゲーション・検索ボタン）・メイン・フッター（コピーライト・プライバシーポリシー・トップへ戻る）の 3 領域を旧サイトと同等の配置で再現する（FR-001 / FR-002 / FR-004）。

**Independent Test**: `astro dev --background` で開発サーバーを起動し、トップページでヘッダー・メイン・フッターの 3 領域が旧サイトと同等の配置で表示され、スクロールしてもヘッダーが固定されたままであることを目視確認できる。ナビゲーション 5 項目（Game / Lily / Creation / Diary / RSS）が表示され、各リンク先（`/game` 等・`/rss.xml`）が 404 にならないこと。

### Implementation for User Story 1

- [ ] T011 [P] [US1] `src/layouts/Layout.astro` を作成する（`title?` / `description?` / `lilyPage?` props。`<head>` に `SITE` 由来の `<title>`・`<meta name="description">`・`<meta name="author">`・favicon、`<Header />`（client:load）・`<main>` スロット（`padding: 8rem 1rem 8rem`）・`<Footer />`（client:load）。`lilyPage` 時は `<body>` に `lily-page` クラス付与。contracts/components.md 参照）
- [ ] T012 [P] [US1] `src/components/Header.svelte` を作成する（`SITE.TITLE` + favicon、`NAVI` の 5 項目を `/` 区切りで表示、検索ボタン（`aria-label="Search"`、モーダル連携は US4 で実装）。スタイル: `fixed top-0 right-0 left-0 z-50 py-6 bg-neutral-100/75 dark:bg-neutral-900/75`）
- [ ] T013 [P] [US1] `src/components/Footer.svelte` を作成する（コピーライト `© {currentYear} {SITE.TITLE}`、プライバシーポリシーリンク `/privacy-policy`、トップへ戻るボタン（`aria-label="Back to top"`、`window.scrollTo({ top: 0, behavior: "smooth" })`）。テーマ切替ボタンは US3 で追加）
- [ ] T014 [US1] `src/pages/index.astro` を `Layout.astro` を使用する骨格に書き換える（メイン領域は空。タイトル・カテゴリボタンは US2 で実装）
- [ ] T015 [P] [US1] `src/pages/404.astro` を作成する（文言「404: ページが見つかりませんでした。ごめんね。」+「トップに戻る」ボタン（`btn-game`）。research.md セクション 9）
- [ ] T016 [P] [US1] `src/pages/privacy-policy.astro` を作成する（旧実装の内容（管理人・コメント・メディア・Cookie・埋め込みコンテンツ等）を再現。research.md セクション 10）
- [ ] T017 [P] [US1] `src/pages/rss.xml.ts` を作成する（`@astrojs/rss` を使用。サイト URL `https://magialabs.blog`、blog コレクションの公開エントリ最新 20 件、`<language>ja</language>`。contracts/routes.md 参照）

**Checkpoint**: User Story 1 が単独で機能し、独立テスト可能になる。

---

## Phase 4: User Story 2 - トップページのコンテンツ表示（Priority: P1）

**Goal**: トップページにサイトタイトル「Magia Laboratory」・説明文・カテゴリボタン群（Game / Creation / Lily / etc. / Some Links）を表示し、各カテゴリページ（骨格）とコンテンツ詳細ページを提供する（FR-003 / FR-007）。

**Independent Test**: トップページで各カテゴリのリンクボタンが旧サイトと同じラベル・並びで表示され、内部リンクは同一タブで遷移、外部リンクは新規タブ（`target="_blank"` + `rel="noopener noreferrer"`）で開くことを確認できる。モバイル幅（375px）でナビが折り返し・カテゴリ列が縦積みになること。

### Implementation for User Story 2

- [ ] T018 [P] [US2] `src/pages/index.astro` にタイトル（h1、text-5xl font-bold）・説明文（text-xl font-bold）・`TOP_CATEGORY_LINKS` のカテゴリボタン群を実装する（md 以上で 3 列。Game 系 `btn-game` / Lily 系 `btn-lily`。外部リンクは `target="_blank"` + `rel="noopener noreferrer"`。contracts/routes.md のトップページ契約参照）
- [ ] T019 [P] [US2] `src/pages/game.astro` を作成する（旧サイトの見出し「ゲームのページ」・手書きコンテンツ（`btn-game` リンク）を再現し、`ContentIndex.svelte` でコレクション一覧を表示。research.md セクション 7）
- [ ] T020 [P] [US2] `src/pages/lily.astro` を作成する（骨格。`lilyPage` レイアウト使用）
- [ ] T021 [P] [US2] `src/pages/creation.astro` を作成する（骨格）
- [ ] T022 [P] [US2] `src/pages/blog.astro` を作成する（骨格。`ContentIndex.svelte` を `groupByYear` で使用）
- [ ] T023 [P] [US2] `src/pages/text.astro` を作成する（骨格）
- [ ] T024 [P] [US2] `src/components/ContentIndex.svelte` を作成する（props: `entries` / `baseHref` / `groupByYear?`。エントリのカード一覧（タイトル・日付・説明）、`groupByYear` 時は年別グループ。contracts/components.md 参照）
- [ ] T025 [P] [US2] `src/pages/game/[...slug].astro` を作成する（`getCollection()` / `getEntry()` で生成。エントリの `title`（h1、text-5xl）と Markdown 本文を `render()` で表示。未存在時は「404」+「ページが見つかりませんでした。」+一覧へ戻るリンク）
- [ ] T026 [P] [US2] `src/pages/lily/[...slug].astro` を作成する（T025 と同様）
- [ ] T027 [P] [US2] `src/pages/creation/[...slug].astro` を作成する（T025 と同様）
- [ ] T028 [P] [US2] `src/pages/blog/[...slug].astro` を作成する（T025 と同様）
- [ ] T029 [P] [US2] `src/pages/text/[...slug].astro` を作成する（T025 と同様）

**Checkpoint**: User Story 1 と 2 がそれぞれ独立して動作する。

---

## Phase 5: User Story 3 - テーマ切り替え（ライト/ダーク/システム）（Priority: P2）

**Goal**: フッターのボタンでライト・ダーク・システムの 3 テーマを切り替えられ、選択を `localStorage`（キー `theme`）に永続化する（FR-005）。初回訪問時はシステム設定に追従し、FOUC を防ぐため `<head>` 内インラインスクリプトで初期化する。

**Independent Test**: フッターのテーマボタンクリックで配色が即座に切り替わり、リロード後も選択が維持されることを確認できる。`localStorage["theme"]` の値が `light` / `dark` / `system` のいずれかであること。

### Tests for User Story 3（TDD 必須）⚠️

> **NOTE: このテストを先に書き、実装前に失敗を確認する**

- [ ] T030 [P] [US3] `tests/theme.test.ts` を書く（`resolveTheme` の不正値フォールバック・`applyTheme` のクラス付与/除去・`getStoredTheme` / `setStoredTheme` の永続化・`system` 時の OS 設定追従。data-model.md エンティティ 4 の検証ルール）

### Implementation for User Story 3

- [ ] T031 [US3] `src/lib/theme.ts` を実装する（`Theme` 型・`resolveTheme` / `applyTheme` / `getStoredTheme` / `setStoredTheme`。contracts/components.md のシグネチャ通り。T030 のテストを成功させる）
- [ ] T032 [US3] `src/layouts/Layout.astro` の `<head>` にテーマ初期化インライン `<script is:inline>` を追加する（`localStorage["theme"]` を読み、`system` なら `prefers-color-scheme` を判定して `<html class="dark">` を付与。research.md セクション 2）
- [ ] T033 [US3] `src/components/Footer.svelte` にテーマ切替ボタン 3 個（ライト / ダーク / システム）を追加する（`aria-label`（Light theme / Dark theme / System theme）、クリックで `src/lib/theme.ts` の関数を呼び適用・永続化、選択中ボタンをハイライト表示。contracts/components.md 参照）
- [ ] T034 [P] [US3] ADR 0002（テーマ初期化・FOUC 防止）を `docs/adr/0002-theme-initialization.md` に記録する

**Checkpoint**: User Story 1〜3 がそれぞれ独立して動作する。

---

## Phase 6: User Story 4 - 検索機能（Priority: P3）

**Goal**: ヘッダーの検索ボタンから検索モーダルを開き、全コンテンツの一覧を表示する（FR-006）。キーワード検索ロジックは仕様範囲外のため実装しない。コンテンツ 0 件時は「コンテンツがありません」を表示する。

**Independent Test**: 検索ボタンクリックでモーダルが開き、全コンテンツ一覧（0 件時は空状態メッセージ）が表示されることを確認できる。閉じるボタン / バックドロップクリック / Esc キーで閉じること。

### Tests for User Story 4（TDD 必須）⚠️

> **NOTE: このテストを先に書き、実装前に失敗を確認する**

- [ ] T035 [P] [US4] `tests/search.test.ts` を書く（`buildSearchIndex` の draft 除外・URL 整形（`/blog/{id}` 形式）・空コレクション時の空配列。contracts/components.md のシグネチャ通り）

### Implementation for User Story 4

- [ ] T036 [US4] `src/lib/search.ts` を実装する（`SearchIndexEntry` 型・`buildSearchIndex`。T035 のテストを成功させる）
- [ ] T037 [US4] `src/components/Search.svelte` を作成する（props: `open`（bindable）+ 一覧データ。バックドロップ + モーダル、検索入力欄（プレースホルダー「検索...」・`aria-label="検索クエリを入力"`）、全コンテンツ一覧表示、0 件時「コンテンツがありません」、閉じるボタン（`aria-label="閉じる"`）/ バックドロップ / Esc で `open = false`。contracts/components.md 参照）
- [ ] T038 [US4] `src/components/Header.svelte` に `Search.svelte` を組み込み、検索ボタンクリックで `open` を true にする
- [ ] T039 [US4] `src/layouts/Layout.astro` でビルド時に `buildSearchIndex()` で検索一覧を生成し、`Header.svelte` へ props で渡す（research.md セクション 5）

**Checkpoint**: 全ユーザーストーリーが独立して機能する。

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 複数ストーリーにまたがる改善・検証・基盤更新

- [ ] T040 [P] `quickstart.md` の検証シナリオ 1〜7 を実行し、すべての期待結果を満たすことを確認する
- [ ] T041 [P] `Dockerfile` / `docker-compose.yml` を Astro 用に更新する（既存は SvelteKit 用のため。research.md セクション 14）
- [ ] T042 `AGENTS.md` を更新する（本機能の開発手順・検証コマンド（`bun run totalcheck` 等）を反映）
- [ ] T043 `bun run totalcheck` と `bun run coverage` を実行し、全チェック合格とカバレッジ 95% 達成を確認する（憲章の品質ゲート）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup（Phase 1）**: 依存なし。即開始可能
- **Foundational（Phase 2）**: Phase 1 完了に依存。全ユーザーストーリーをブロック
- **User Stories（Phase 3+）**: すべて Foundational 完了に依存
  - US1（P1）→ US2（P1）→ US3（P2）→ US4（P3）の優先順で実装
  - US3 は US1 の Footer / Layout に依存（ボタン追加・インラインスクリプト追加）
  - US4 は US1 の Header と Foundational の content.config.ts に依存
- **Polish（最終 Phase）**: 全ユーザーストーリー完了に依存

### User Story Dependencies

- **User Story 1（P1）**: Foundational 完了後に開始。他ストーリーへの依存なし
- **User Story 2（P1）**: Foundational 完了後に開始（`TOP_CATEGORY_LINKS` / content.config.ts を使用）。US1 の Layout を使用
- **User Story 3（P2）**: US1 完了後に開始（Footer / Layout に追加実装）
- **User Story 4（P3）**: US1 完了後に開始（Header に組み込み）。各ストーリーは独立テスト可能

### Within Each User Story

- テスト（TDD）は必ず実装より先に書き、失敗を確認してから実装する
- 実装 → テスト成功 → コミットの順を厳守する（憲章）
- ストーリー完了後に次の優先度へ進む

### Parallel Opportunities

- Phase 1 の [P] タスク（ADR 2 件）は並行実行可能
- Phase 2 の [P] タスク（ADR 0004）は並行実行可能
- US1 の [P] タスク（Layout / Header / Footer / 404 / privacy-policy / rss.xml）は並行実行可能
- US2 の [P] タスク（カテゴリページ 5 件・詳細ページ 5 件・ContentIndex）は並行実行可能
- US3 の [P] タスク（テスト + ADR 0002）は並行実行可能
- US4 の [P] タスク（テスト）は並行実行可能
- 異なるユーザーストーリーは別メンバーで並行作業可能（US1 完了後）

---

## Parallel Example: User Story 1

```bash
# レイアウト・コンポーネント・ページを一括で並行起動:
Task: "src/layouts/Layout.astro を作成する"
Task: "src/components/Header.svelte を作成する"
Task: "src/components/Footer.svelte を作成する"
Task: "src/pages/404.astro を作成する"
Task: "src/pages/privacy-policy.astro を作成する"
Task: "src/pages/rss.xml.ts を作成する"
```

---

## Implementation Strategy

### MVP First（User Story 1 のみ）

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了（CRITICAL - 全ストーリーをブロック）
3. Phase 3: User Story 1 完了
4. **STOP and VALIDATE**: User Story 1 を独立テスト（quickstart シナリオ 1・6・7）
5. 必要ならデプロイ・デモ

### Incremental Delivery

1. Setup + Foundational 完了 → 基盤完成
2. User Story 1 追加 → 独立テスト → デモ（MVP!）
3. User Story 2 追加 → 独立テスト → デモ
4. User Story 3 追加 → 独立テスト → デモ
5. User Story 4 追加 → 独立テスト → デモ
6. 各ストーリーは既存ストーリーを壊さずに価値を追加

### Parallel Team Strategy

複数開発者の場合:

1. チームで Setup + Foundational を共同完了
2. Foundational 完了後:
   - 開発者 A: User Story 1
   - 開発者 B: User Story 2（US1 の Layout 完成後）
   - 開発者 C: User Story 3（US1 完了後）
3. 各ストーリーを独立して完了・統合

---

## Notes

- [P] タスク = 別ファイル・依存なし
- [Story] ラベルはタスクをユーザーストーリーへ対応付ける
- 各ユーザーストーリーは独立して完了・テスト可能
- テストは実装前に失敗を確認する（TDD）
- タスクまたは論理グループごとにコミットする
- 各チェックポイントでストーリーを独立検証する
- 避けるべきこと: 曖昧なタスク、同一ファイルの競合、独立性を壊すストーリー間依存
- 仕様範囲外（キーワード検索ロジック・コンテンツ実データ移行・SSGForm・最終更新表示）は実装しない（YAGNI）
