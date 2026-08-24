# Magia Laboratory

Astro/Svelteベースの静的サイトジェネレーター（SSG）プロジェクトです。
Markdownによるコンテンツ管理と、UnoCSSによるスタイリングをサポートしています。

## 特徴

- **Astro**: MarkdownによるSSG
- **Svelte**: 高速な静的サイト生成
- **UnoCSS**: ユーティリティファーストの高速なCSSエンジン
- **Docker**: コンテナ化による容易なデプロイ

## 開発環境のセットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

## Docker によるデプロイ

このプロジェクトはDockerを使用して簡単にデプロイできます。

### 1. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、必要な環境変数を設定します。

```bash
cp .env.example .env
```

### 2. Docker Compose での起動

```bash
docker compose up -d
```

これにより、以下の2つのコンテナが起動します：
- **app**: SvelteKitアプリケーション（Node.jsアダプターを使用）
- **webhook**: GitHubからのWebhookを受け取り、自動デプロイを行うサーバー

### 3. Webhookによる自動デプロイ（オプション）

GitHubリポジトリにプッシュされた際に自動でデプロイを行うには、GitHubのWebhookを設定します。

1. GitHubリポジトリの `Settings` > `Webhooks` > `Add webhook` を開きます。
2. 以下の設定を行います：
   - **Payload URL**: `http://your-server-ip:3001/hooks`
   - **Content type**: `application/json`
   - **Secret**: `.env` ファイルの `WEBHOOK_SECRET` と同じ値
3. 「Add webhook」をクリックして保存します。

これで、`main` ブランチに変更がプッシュされると、自動的にビルドとデプロイが実行されます。

## 残タスク

- テストコード（これは任意） — コアルーティング関数の単体テスト
- AGENTS.md作成（これも任意）
- プライバシーポリシーなどをmdに（これも任意）