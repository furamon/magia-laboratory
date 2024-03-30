//=============================================================================
//  Keke_CommonData - コモンデータ
// バージョン: 1.0.0
//=============================================================================
// Copyright (c) 2021 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc プラグインの共通データを登録する
 * @author ケケー
 * @url https://kekeelabo.com
 *
 * @help
 * 【ver.1.0.0】
 * プラグインの共通データを登録する
 * ◎キャラデータ
 * ◎フォント
 * ◎効果音
 *
 * ※フォント登録の『横幅サイズ』『半角サイズ』
 * 　フォントごとに横幅や半角の大きさが違うことがあるため、
 * 　必要があればこの項目で調整する
 * 　このフォントは横幅が狭いなと思ったなら数値を 1 より小さめにするなど
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 *
 *
 * Register common data for plug-ins
 * ◎Chara data
 * ◎Font
 * ◎Sound effects
 *
 * ※ "Width size" and "half-width size" for font registration
 *   Since the width and half-width size may differ for each font,
 *   Make adjustments in this item if necessary
 *   If you think this font has a narrow width,
 *   make the number smaller than 1, etc.
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 *
 *
 *
 * @param キャラデータ紐付け
 * @desc 紐付け元(名前・顔グラ)とキャラデータ(テキストデータ・画像データ)を紐付ける
 * @type struct<charaDataChain>[]
 * @default
 *
 * @param フォント登録
 * @desc フォントを登録する
 * @type struct<font>[]
 * @default
 *
 * @param 効果音登録
 * @desc 効果音を登録する
 * @type struct<se>[]
 * @default
 */

//==================================================
/*~struct~charaDataChain:
//==================================================
 * @param タグ
 * @desc 何を書いてもいい欄
 *
 * @param 紐元-名前
 * @desc 紐付け元とする名前。プリシア なら名前欄の [ ] 内に プリシア が含まれているとき紐付ける
 * @default 
 *
 * @param /紐元-顔グラ
 * @desc 紐付け元とする顔グラ画像
 * @type file
 * @dir img/faces
 * @default 
 *
 * @param テキストデータ
 * @desc 紐づけるテキストデータ
 * @type struct<textData>[]
 * @default 
 *
 * @param 画像データ
 * @desc 紐づける画像データ
 * @type struct<imageData>[]
 * @default 
 */

//==================================================
/*~struct~textData:
//==================================================
 * @param 紐元-ワード
 * @desc 紐付け元とするワード。笑い なら名前欄の [ ] 内に 笑い が含まれているとき紐付ける
 * @default 
 *
 * @param /紐元-顔グラ番号
 * @desc 紐付け元とするワード。笑い なら名前欄に 笑い が含まれているとき紐付ける
 * @default 
 *
 * @param 表示名
 * @desc 名前欄に表示する名前。名前欄が空欄の場合のみ表示される
 * @default
 * 
 * @param /表示名-js
 * @desc 名前欄に表示する名前をjs式で記述。名前欄が空欄の場合のみ表示される
 * @default
 *
 * @param フォント
 * @desc 使用するフォント。空欄の場合はスタイルのフォントを使う
 * @default
 *
 * @param メッセージ音-ファイル
 * @desc メッセージ音として使う音声ファイル
 * @type file
 * @dir audio/se
 * @default 
 *
 * @param メッセージ音-音量
 * @desc メッセージ音の音量
 * @default 50
 *
 * @param メッセージ音-ピッチ
 * @desc メッセージ音のピッチ
 * @default 100
 *
 * @param メッセージ音-位相
 * @desc メッセージ音の位相
 * @default 0
 *
 * @param メッセージ音-周期
 * @desc メッセージ音を鳴らす間隔。5 なら 5フレーム毎に鳴らす。0 なら 1回 だけ鳴らす
 * @default 2
 */

//==================================================
/*~struct~imageData:
//==================================================
 * @param 紐元-ワード
 * @desc 紐付け元とするワード。笑い なら名前欄の [ ] 内に 笑い が含まれているとき紐付ける
 * @default 
 *
 * @param /紐元-顔グラ番号
 * @desc 紐付け元とする顔グラ番号。0 か空欄なら全ての番号と紐付ける
 * @default 
 *
 * @param 使用ピクチャ
 * @desc 画像として使用するピクチャ。指定しない場合は元の顔グラが使用される
 * @type file
 * @dir img/pictures
 * @default 
 *
 * @param /使用敵グラ
 * @desc 画像として使用する敵グラ。指定しない場合は元の顔グラが使用される
 * @type file
 * @dir img/enemies
 * @default 
 * 
 * @param /使用敵グラSV
 * @desc 画像として使用するサイドビュー用敵グラ。指定しない場合は元の顔グラが使用される
 * @type file
 * @dir img/sv_enemies
 * @default 
 *
 * @param ずらしX
 * @desc 画像のX位置ずらし幅。5 なら 5ピクセル 右へ
 * @default 
 *
 * @param ずらしY
 * @desc 画像のY位置ずらし幅。5 なら 5ピクセル 下へ
 * @default 
 *
 * @param スケール
 * @desc 画像の拡大率。1.5 なら 1.5倍
 * @default 
 *
 * @param スケールX
 * @desc 画像のX拡大率。1.5 なら 1.5倍
 * @default 
 *
 * @param スケールY
 * @desc 画像のY拡大率。1.5 なら 1.5倍
 * @default 
 * 
 * @param 横幅
 * @desc 画像の表示横幅。50 なら 50ピクセル。空欄なら高さに合わせる。演算可。gw:画面横幅
 * @default // メッセージ開始をオン
        //changeMessageStart(windo, true);
 *
 * @param 高さ
 * @desc 画像の表示縦高。50 なら 50ピクセル。空欄なら横幅に合わせる。演算可。gw:画面高さ
 * @default 
 * 
 * @param 切り取り表示
 * @desc 画像の一部だけを切り取って表示する
 * @type boolean
 * @default true
 *
 * @param …左端
 * @desc 切り取り範囲の左端。5 なら画像左端から、画像横幅 × 5% の位置
 * @default 0
 *
 * @param …右端
 * @desc 切り取り範囲の右端。5 なら画像右端から、画像横幅 × 5% の位置
 * @default 100
 *
 * @param …上端
 * @desc 切り取り範囲の上端。5 な 画像上端から、画像縦高 × 5% の位置
 * @default 0
 *
 * @param …下端
 * @desc 切り取り範囲の縦高。5 なら画像下端から、画像横幅 × 5% の位置
 * @default 100
 * 
 * @param 回転角
 * @desc 画像の回転角。0〜360度。90 で右に 90度、-90 で左に 90度
 * @default 
 *
 * @param 不透明度
 * @desc 画像の不透明度。0〜255
 * @default 
 *
 * @param カラー赤
 * @desc 画像のカラートーン・赤。-255〜255
 * @default 
 *
 * @param カラー緑
 * @desc 画像のカラートーン・緑。-255〜255
 * @default 
 *
 * @param カラー青
 * @desc 画像のカラートーン・青。-255〜255
 * @default 
 *
 * @param カラー灰
 * @desc 画像のカラートーン・グレー。-255〜255
 * @default 
 * 
 * @param 色相
 * @desc 画像の色相。0～255
 * @default 
 *　
 * @param スケール-スキン
 * @desc 画像スキンの拡大率。1.5 なら 1.5倍
 * @default 
 * 
 * @param スケールX-スキン
 * @desc 画像スキンのX拡大率。1.5 なら 1.5倍
 * @default 
 * 
 * @param スケールY-スキン
 * @desc 画像スキンのY拡大率。1.5 なら 1.5倍
 * @default 
 * 
 * @param フォーム
 * @desc 画像の切り取り形状
 * @type select
 * @option スクエア
 * @option 円形
 * @option 横アーモンド
 * @option 縦アーモンド
 * @option ダイヤ
 * @option ギザギザ
 * @option ギザギザ-滑らか
 * @option なし
 * @default
 *
 * @param …フォーム設定
 * @desc 各フォームの詳細な設定
 * @type struct<formCfg>
 * 
 * @param 背景色
 * @desc 画像の背景の色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 *
 * @param 外枠幅
 * @desc 画像の外枠の幅。5 なら 5ピクセル
 *
 * @param 外枠色
 * @desc 画像の外枠の色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 */

//==================================================
/*~struct~font:
//==================================================
 * @param フォント名
 * @desc フォントの名前。フォントの呼び出しに使う
 *
 * @param フォントファイル
 * @desc フォントのファイル。fontsフォルダに置いてあるファイルの名前を入力する。拡張子まで入れること
 *
 * @param 横幅サイズ
 * @desc テキスト幅測定時の横幅の大きさ。1.5 なら 1.5倍。フォントに応じて調整する
 * 
 * @param 半角サイズ
 * @desc テキスト幅測定時の半角の大きさ。1.5 なら 1.5倍。フォントに応じて調整する
 * @default 1
 */

//==================================================
/*~struct~cutFrame:
//==================================================
 * @param 左端
 * @desc 切り取り範囲の左端。5 なら画像左端から、画像横幅 × 5% の位置
 * @default 0
 *
 * @param 右端
 * @desc 切り取り範囲の右端。5 なら画像右端から、画像横幅 × 5% の位置
 * @default 100
 *
 * @param 上端
 * @desc 切り取り範囲の上端。5 な 画像上端から、画像縦高 × 5% の位置
 * @default 0
 *
 * @param 下端
 * @desc 切り取り範囲の縦高。5 なら画像下端から、画像横幅 × 5% の位置
 * @default 100
 */

//==================================================
/*~struct~formCfg:
//==================================================
 * @param スクエア-線丸み
 * @desc スクエア形の直線を丸くする。5 なら 5ピクセル分 丸まる
 * @default 0
 *
 * @param スクエア-角丸み
 * @desc スクエア形の角を丸くする。5 なら 5ピクセル分 丸まる
 * @default 0
 *
 * @param ダイヤ-線丸み
 * @desc ダイヤ形の直線を丸くする。5 なら 5ピクセル 丸まる
 * @default 0
 *
 * @param ギザギザ-トゲ数X
 * @desc ギザギザ形の横方向のトゲの本数。1本〜
 * @type number
 * @min 1
 * @default 1
 *
 * @param ギザギザ-トゲ数Y
 * @desc ギザギザ形の縦方向のトゲの本数。1本〜。3 以上の奇数にすると電撃形になる
 * @type number
 * @min 1
 * @default 1
 *
 * @param ギザギザ-トゲ長さX
 * @desc ギザギザ形の横方向のトゲの長さ。50 なら 50ピクセル
 * @default 10
 *
 * @param ギザギザ-トゲ長さY
 * @desc ギザギザ形の縦方向のトゲの長さ。50 なら 50ピクセル
 * @default 10
 *
 * @param ギザギザ-トゲ長さ乱数
 * @desc ギザギザ形のトゲの長さのランダム幅。20 なら 80%〜100% の範囲で散らばる
 * @default 0
 *
 * @param 全形状-上開け
 * @desc 顔グラ/立ち絵の上の方だけ形状でくり抜かずに開ける
 * @type boolean
 * @default true
 */

//==================================================
/*~struct~se:
//==================================================
 * @param 効果音名
 * @desc  効果音の名前。 効果音の呼び出しに使う
 *
 * @param  効果音ファイル
 * @desc  効果音のファイル
 * @type file
 * @dir audio/se
 */

;(() => {
	//- プラグイン名
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]

	//==================================================
	//--  文字列オート変換 /ベーシック
	//==================================================

	// 文字列のハッシュ化
	function strToHash(str) {
		if (!str || !str.length) {
			return {}
		}
		let hash = {}
		const strs = JSON.parse(str)
		let val = null
		let val2 = null
		for (let key in strs) {
			val = strs[key]
			if (!key || !val) {
				continue
			}
			val2 = strToAuto(val, key)
			hash[key] = val2
		}
		return hash
	}

	// 文字列のリスト化
	function strToList(str) {
		if (!str || !str.length) {
			return []
		}
		let array = JSON.parse(str)
		return array.map((val, i) => {
			return strToAuto(val)
		}, this)
	}

	// 文字列の自動処理
	function strToAuto(val, key = '') {
		let val2 = null
		let match = null
		let end = false
		if (!end) {
			if (val[0] == '{') {
				val2 = strToHash(val)
				end = true
			}
		}
		if (!end) {
			if (val[0] == '[') {
				val2 = strToList(val)
				end = true
			}
		}
		if (!end) {
			val = val + ','
		}
		if (!end) {
			match = val.match(/^\s*(-?\d+,\s*-?\d+,\s*-?\d+,?\s*-?\d*\.?\d*)\s*,$/)
			if (match && !val.match(/[^\d\.\-,\s]/)) {
				if (
					key.match(/(カラー|色)/) &&
					!key.includes('トーン') &&
					!key.includes('ブレンド') &&
					!key.includes('配色') &&
					!key.includes('着色') &&
					!key.includes('フラッシュ') &&
					!key.includes('チェンジ') &&
					!key.includes('選択')
				) {
					val2 = 'rgba(' + match[1] + ')'
				} else {
					val2 = eval('[' + match[1] + ']')
				}
				end = true
			}
		}
		if (!end) {
			match = val.match(/(-?\d+\.?\d*),\s*/g)
			if (match && match.length >= 2 && !val.match(/[^\d\.\-,\s]/)) {
				val2 = eval('[' + match.reduce((r, s) => r + s) + ']')
				end = true
			}
		}
		if (!end) {
			match = val.match(/^(true|false)\s*,/)
			if (match) {
				val2 = match[1] == 'true' ? true : false
				end = true
			}
		}
		if (!end) {
			match = val.match(/^(-?\d+\.?\d*)\s*,/)
			if (match && !val.match(/[^\d\.\-,\s]/)) {
				val2 = Number(match[1])
				end = true
				end = true
			}
		}
		if (!end) {
			match = val.match(/^.+,.+/)
			if (match) {
				val2 = val
					.replace(/\s/g, '')
					.split(',')
					.filter((v) => v)
				end = true
			}
		}
		if (!end) {
			if (val[0] == '"') {
				val = val.slice(1)
			}
			val2 = val.slice(0, -1)
		}
		return val2
	}

	//==================================================
	//--  パラメータ受け取り
	//==================================================

	const parameters = PluginManager.parameters(pluginName)

	const keke_charaDataChain = strToList(parameters['キャラデータ紐付け'])
	const keke_fontList = strToList(parameters['フォント登録'])
	const keke_seList = strToList(parameters['効果音登録'])

	//==================================================
	//--  公開
	//==================================================

	//- データのグローバル化(コア追加)
	const _Game_Temp_initialize = Game_Temp.prototype.initialize
	Game_Temp.prototype.initialize = function () {
		_Game_Temp_initialize.apply(this)
		this._charaDataChainKe = keke_charaDataChain
		this._fontListKe = keke_fontList
		this._seListKe = keke_seList
	}

	//- 効果音ファイルの取得
	Game_Temp.prototype.getSeFileKe = function (seName) {
		if (!seName) {
			return
		}
		let file = null
		// 名前からファイルを検索
		for (let d of this._seListKe) {
			if (d['効果音名'] == seName) {
				file = d['効果音ファイル']
				break
			}
		}
		return file
	}

	//==================================================
	//--  フォントロード
	//==================================================

	//- 追加フォントロード 呼び出し(コア追加)
	const _Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts
	Scene_Boot.prototype.loadGameFonts = function () {
		// 追加フォントロード
		fontLoadPlus()
		_Scene_Boot_loadGameFonts.call(this)
	}

	//- 追加フォントロード
	function fontLoadPlus() {
		const fm = FontManager
		fm._loadFontsKe = keke_fontList.map((data) => {
			const fileName = data['フォントファイル']
			const family = data['フォント名']
			if (fileName && !fm._states[family]) {
				const url = fm.makeUrl(fileName)
				// フォントロードの開始
				fm.startLoading(family, url)
			}
		})
	}
})()
