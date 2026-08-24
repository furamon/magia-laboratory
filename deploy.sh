#!/bin/sh
# systemd 用デプロイスクリプト
# Webhookサーバーから呼び出され、git pull後 ビルドして systemd サービスを再起動する
set -e

echo "[deploy] リポジトリを更新中..."
cd /opt/magia-laboratory
git remote set-url origin https://${GITHUB_TOKEN}@github.com/furamon/magia-laboratory.git
git pull origin main

echo "[deploy] 依存関係をインストール中..."
bun install --frozen-lockfile

echo "[deploy] ビルド中..."
bun run build

echo "[deploy] systemd サービスを再起動中..."
systemctl restart magia-laboratory

echo "[deploy] デプロイ完了"
