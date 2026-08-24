# SvelteKit サイト用マルチステージ Dockerfile
# ビルドステージ: Bun + SvelteKit のビルドを実行
# 実行ステージ: ビルド成果物のみで軽量実行

FROM oven/bun:1 AS builder
WORKDIR /app

# 依存関係のインストール
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ソースコードのコピーとビルド
COPY . .
RUN bun run build

# 実行ステージ
FROM oven/bun:1 AS runner
WORKDIR /app

# builder ステージから成果物をコピー
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json /app/bun.lock ./

# 本番用依存関係のみインストール
RUN bun install --production --frozen-lockfile

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "./build/index.js"]
