// GitHub Webhook listener (TypeScript)

import { exec } from "node:child_process";
import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import express from "express";

const app = express();
const PORT: number = Number(process.env["PORT"]) || 4322;
// GitHub Webhookで設定するシークレットキーと同じものを使用
const SECRET: string = process.env["WEBHOOK_SECRET"] || "your_super_secret_key";
// ビルドスクリプトのパス
const BUILD_SCRIPT_PATH: string =
	process.env["BUILD_SCRIPT_PATH"] || "/opt/magia-laboratory/deploy.sh";

// GitHub は生リクエストボディに対して HMAC を計算するため、
// 再シリアライズした JSON ではなく生ボディを検証する必要がある。
app.use(express.raw({ type: "application/json" }));

// GitHub Webhookペイロード検証ミドルウェア
const verifySignature = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const signature = req.headers["x-hub-signature-256"] as string | undefined;
	if (!signature) {
		res.status(401).send("No signature provided");
		return;
	}

	const hmac = crypto.createHmac("sha256", SECRET);
	const digest = `sha256=${hmac.update(req.body as Buffer).digest("hex")}`;

	if (signature === digest) {
		next();
	} else {
		console.error("Signature mismatch:", signature, "vs", digest);
		res.status(403).send("Invalid signature");
	}
};

app.post("/hooks", verifySignature, (req: Request, res: Response): void => {
	// x-github-event ヘッダーを確認し、'push' イベントのみを処理
	const event = req.headers["x-github-event"] as string | undefined;
	if (event !== "push") {
		res.status(200).send("Event ignored");
		return;
	}

	console.log("Push event received. Starting build script...");
	res.status(200).send("Webhook received and build initiated.");

	// ビルド/デプロイスクリプトを非同期で実行
	exec(
		`sh ${BUILD_SCRIPT_PATH}`,
		(error: Error | null, stdout: string, stderr: string) => {
			if (error) {
				console.error(`Exec error: ${error}`);
				return;
			}
			console.log(`Build Script Output: \n${stdout}`);
			if (stderr) {
				console.error(`Build Script Stderr: \n${stderr}`);
			}
		},
	);
});

app.listen(PORT, () => {
	console.log(`Webhook listener running on port ${PORT}`);
});

export { app, verifySignature };
