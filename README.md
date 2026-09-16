# Magia Laboratory

Astro/Svelteベースの静的サイトジェネレーター（SSG）プロジェクトです。
Markdownによるコンテンツ管理と、UnoCSSによるスタイリングをサポートしています。

## 特徴

- **Astro**: MarkdownによるSSG
- **Svelte**: 高速な静的サイト生成
- **UnoCSS**: ユーティリティファーストの高速なCSSエンジン

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## デプロイ（systemd による永続化）

自宅サーバーで Astro を SSR（`@astrojs/node` standalone）配信する。ビルド成果物 `dist/server/entry.mjs` を systemd サービスが起動し、`Restart=always` で永続化する。外部公開は Nginx / Cloudflare Tunnel 側で行う。

### 構成

| サービス | ユニット | ポート | 役割 |
| --- | --- | --- | --- |
| `magia-laboratory` | `deploy/magia-laboratory.service` | 4321 | サイト本体（`node ./dist/server/entry.mjs`） |
| `magia-webhook` | `deploy/magia-webhook.service` | 4322 | GitHub Webhook 受信 → `deploy.sh` 実行 |

### 前提

- Node.js >= 22.12.0
- 配置先: `/opt/magia-laboratory`（`deploy/*.service` の `WorkingDirectory` と一致させる）
- 両ユニットは root で実行（`User=` 未指定）。`deploy.sh` が `sudo systemctl restart` を呼ぶため。

### 初回セットアップ

```bash
# 1. 配置
sudo git clone https://github.com/furamon/magia-laboratory.git /opt/magia-laboratory
cd /opt/magia-laboratory

# 2. 環境変数
cp .env.example .env   # WEBHOOK_SECRET / GITHUB_TOKEN / PUBLIC_SSGFORM_URL を記入

# 3. ビルド
npm ci
npm run build

# 4. ユニット配置と有効化
sudo cp deploy/magia-laboratory.service deploy/magia-webhook.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now magia-laboratory magia-webhook
```

### 環境変数（`.env`）

- `WEBHOOK_SECRET`: GitHub Webhook と同じシークレット（HMAC-SHA256 検証）
- `GITHUB_TOKEN`: `deploy.sh` の `git pull` 認証用（private リポジトリの場合）
- `PUBLIC_SSGFORM_URL`: 問い合わせフォーム送信先
- `PORT` / `HOST`: ユニット内で指定するため `.env` 不要（Webhook の `PORT` は 4322）

### 自動デプロイ（Webhook）

GitHub リポジトリの Webhook に `https://<公開ドメイン>/hooks`、Content type `application/json`、Secret に `WEBHOOK_SECRET` と同値を設定する。`push` イベント受信時に `deploy.sh` が走り、`git pull` → `npm ci` → `npm run build` → `systemctl restart magia-laboratory` を実行する。

`deploy.sh` は `ProtectSystem=full` / `ProtectHome=true` 環境で動作するよう、npm キャッシュ・ログを `/opt/magia-laboratory/.npm-cache` などに退避し、`ASTRO_TELEMETRY_DISABLED=1` を設定している。

### 手動デプロイ・運用

```bash
# 手動デプロイ
sudo sh /opt/magia-laboratory/deploy.sh

# 状態確認・ログ
systemctl status magia-laboratory magia-webhook
journalctl -u magia-laboratory -f

# 再起動・停止
sudo systemctl restart magia-laboratory
sudo systemctl stop magia-laboratory
```

### トラブルシュート

- サービスが起動しない: `journalctl -u magia-laboratory -n 50` でエラー確認。`dist/server/entry.mjs` の有無（`npm run build` 未実行）を確認する。
- ビルドが落ちる: `ProtectHome=true` により `/root` が read-only。npm/Astro の書き込み先を `/opt` 配下に置く（`deploy.sh` の `npm_config_cache` 等を参照）。
- Webhook が 403: `WEBHOOK_SECRET` と GitHub 側 Secret の不一致。署名は生リクエストボディで検証する。
- `git pull` が失敗: `deploy.sh` は `-c safe.directory=/opt/magia-laboratory` を付与して実行する。所有者不一致の場合は合わせる。

## 残タスク

- プライバシーポリシーやカテゴリトップなどをmdに（任意）
