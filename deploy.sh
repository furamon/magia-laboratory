#!/bin/sh
# systemd 用デプロイスクリプト
# Webhookサーバーから呼び出され、git pull後 ビルドして systemd サービスを再起動する
set -e

echo "[deploy] リポジトリを更新中..."
cd /opt/magia-laboratory
# デプロイを root で実行するため、所有者が別ユーザーのリポジトリを安全に扱えるよう -c で許可する
# （設定ファイルを書き込まないので ProtectSystem 等の read-only 環境でも動作する）
git -c safe.directory=/opt/magia-laboratory remote set-url origin https://${GITHUB_TOKEN}@github.com/furamon/magia-laboratory.git
git -c safe.directory=/opt/magia-laboratory pull origin main

echo "[deploy] 依存関係をインストール中..."
/usr/local/bin/bun install --frozen-lockfile

echo "[deploy] ビルド中..."
/usr/local/bin/bun run build

echo "[deploy] systemd サービスを再起動中..."
sudo systemctl restart magia-laboratory

echo "[deploy] デプロイ完了"
