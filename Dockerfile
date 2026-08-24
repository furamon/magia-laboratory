# Astro 静的サイト用マルチステージ Dockerfile
# ビルドステージ: Bun で Astro の静的ビルドを実行
# 実行ステージ: nginx で dist/ を配信

FROM oven/bun:1 AS builder
WORKDIR /app

# 依存関係のインストール
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ソースコードのコピーとビルド
COPY . .
RUN bun run build

# 実行ステージ
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
