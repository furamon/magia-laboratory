//=============================================================================
// Keke_SeamlessLikeTransfar - シームレス風場所移動
// バージョン: 1.0.3
//=============================================================================
// Copyright (c) 2023 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc シームレス風の場所移動
 * @author ケケー
 * @url https://kekeelabo.com
 *
 * @help
 * 【ver.1.0.3】
 * シームレス風のなめらかな場所移動ができるようになる
 *
 *
 * ● 使い方 ●
 * ◎イベントコマンド『場所移動』をフェード「なし」で実行すると、
 * 　自動的にシームレス風場所移動になる
 * 　フェード「黒」「白」の場合はそのまま
 * ◎プラグインコマンドでフェード時間をいつでも変更できる
 * 　フェード時間を 0 にすると、元のフェード「なし」と同じになる
 * ◎フェード「黒」「白」のフェード時間も変更可能
 *
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 *
 *
 * @param シームレスフェード時間
 * @desc シームレス風場所移動のフェード時間。5 なら 5フレーム。基本値 20
 * @default 20
 *
 * @param 黒フェード時間
 * @desc 黒フェード場所移動のフェード時間。5 なら 5フレーム。基本値 24
 * @default
 *
 * @param 白フェード時間
 * @desc 白フェード場所移動のフェード時間。5 なら 5フレーム。基本値 24
 * @default
 *
 *
 *
 * @command シームレス風フェード時間
 * @desc シームレス風場所移動のフェード時間を変更する
 *
 * @arg シームレス風フェード時間
 * @desc シームレス風場所移動のフェード時間。5 なら 5フレーム。基本値 20
 * @default
 *
 *
 *
 * @command 黒フェード時間
 * @desc 黒フェード場所移動のフェード時間を変更する
 *
 * @arg 黒フェード時間
 * @desc 黒フェード場所移動のフェード時間。5 なら 5フレーム。基本値 24
 * @default
 *
 *
 *
 * @command 白フェード時間
 * @desc 白フェード場所移動のフェード時間を変更する
 *
 * @arg 白フェード時間
 * @desc 白フェード場所移動のフェード時間。5 なら 5フレーム。基本値 24
 * @default
 */

;(() => {
	//- プラグイン名
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]

	//==================================================
	//--  スプライト追加 /ベーシック
	//==================================================

	//- 破棄付きスプライト
	function SpriteKeSmtr() {
		this.initialize(...arguments)
	}

	SpriteKeSmtr.prototype = Object.create(Sprite.prototype)
	SpriteKeSmtr.prototype.constructor = SpriteKeSmtr

	SpriteKeSmtr.prototype.destroy = function () {
		if (this.bitmap && !this.bitmap._url) {
			this.bitmap.destroy()
		}
		Sprite.prototype.destroy.apply(this)
	}

	//==================================================
	//--  パラメータ受け取り
	//==================================================

	const parameters = PluginManager.parameters(pluginName)

	const keke_seamlessFadeTime = Number(parameters['シームレスフェード時間'])
	const keke_blackFadeTime = Number(parameters['黒フェード時間'])
	const keke_whiteFadeTime = Number(parameters['白フェード時間'])

	//==================================================
	//--  プラグインコマンド
	//==================================================

	//- シームレス風フェード時間
	PluginManager.registerCommand(pluginName, 'シームレス風フェード時間', (args) => {
		const time = args['シームレス風フェード時間']
		if (!time) {
			return
		}
		// フェード時間の変更
		changeFadeTime(Number(time), 'seamless')
	})

	//- 黒フェード時間
	PluginManager.registerCommand(pluginName, '黒フェード時間', (args) => {
		const time = args['黒フェード時間']
		if (!time) {
			return
		}
		// フェード時間の変更
		changeFadeTime(Number(time), 'black')
	})

	//- 白フェード時間
	PluginManager.registerCommand(pluginName, '白フェード時間', (args) => {
		const time = args['白フェード時間']
		if (!time) {
			return
		}
		// フェード時間の変更
		changeFadeTime(Number(time), 'white')
	})

	//==================================================
	//--  共通開始
	//==================================================

	//- スプライトセット・マップ(コア追加)
	const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize
	Spriteset_Map.prototype.initialize = function () {
		_Spriteset_Map_initialize.apply(this)
		// マップ移動後はシームレス風場所移動の開始2
		if (inSeamlessTransfar()) {
			startSeamlessTransfar2(this)
		}
	}

	//==================================================
	//--  共通更新
	//==================================================

	//- スプライトセット・マップ(コア追加)
	const _Spriteset_Map_updateParallax = Spriteset_Map.prototype.updateParallax
	Spriteset_Map.prototype.updateParallax = function () {
		_Spriteset_Map_updateParallax.apply(this)
		// シームレススナップ消去の更新
		updateSeamlessSnapDel()
	}

	//==================================================
	//--  共通終了
	//==================================================

	//- シーンマップ(コア追加)
	const _Scene_Map_terminate = Scene_Map.prototype.terminate
	Scene_Map.prototype.terminate = function () {
		// マップ移動時はシームレス風場所移動の開始1
		if ($gamePlayer._newMapId) {
			startSeamlessTransfar1()
		}
		_Scene_Map_terminate.apply(this)
	}

	//- スプライトの破棄
	function destroySprite(sprite, force) {
		if (!sprite) {
			return
		}
		sprite.children.forEach((s) => destroySprite(s))
		if (sprite.bitmap && !sprite.bitmap._url) {
			sprite.bitmap.destroy()
		}
		if (sprite._texture) {
			sprite.destroy()
		}
	}

	//==================================================
	//--  シームレス風場所移動
	//==================================================

	let _inSeamlessTransfar = false
	let seamlessSnap = null

	//- シームレス風場所移動の初期化
	function initSeamlessTransfar() {
		if ($gameMap._fadeTimeKeSmtr) {
			return
		}
		$gameMap._fadeTimeKeSmtr = {
			seamless: keke_seamlessFadeTime,
			black: keke_blackFadeTime,
			white: keke_whiteFadeTime
		}
	}

	//- フェード時間の変更
	function changeFadeTime(time, type = 'seamless') {
		// シームレス風場所移動の初期化
		initSeamlessTransfar()
		$gameMap._fadeTimeKeSmtr[type] = time
	}

	//- フェード時間の取得
	function getFadeTime(type = 'seamless') {
		// シームレス風場所移動の初期化
		initSeamlessTransfar()
		return $gameMap._fadeTimeKeSmtr[type]
	}

	//- シームレス風場所移動の開始1
	function startSeamlessTransfar1(scene) {
		// フェードなしでなければリターン
		if ($gamePlayer._fadeType != 2) {
			return
		}
		_inSeamlessTransfar = true
	}

	//- シームレス風場所移動の開始2
	function startSeamlessTransfar2(spriteset) {
		spriteset = spriteset || SceneManager._scene._spriteset
		SceneManager._scene._spriteset = spriteset
		// シームレス中フラグを消去
		_inSeamlessTransfar = false
		// シームレススナップのセット
		setSeamlessSnap(spriteset)
	}

	//- シームレススナップのセット
	function setSeamlessSnap(spriteset) {
		if (seamlessSnap) {
			return
		}
		// 画像と時間をセット
		const fadeTime = getFadeTime('seamless')
		seamlessSnap = {
			sprite: new SpriteKeSmtr(SceneManager._backgroundBitmap),
			time: fadeTime,
			count: fadeTime
		}
	}

	// シームレススナップ消去の更新
	function updateSeamlessSnapDel() {
		if (!seamlessSnap) {
			return
		}
		// バグ防止に古いスナップが残っていたら破棄
		if (!seamlessSnap.sprite.transform) {
			destroySeamlessSnap()
			return
		}
		// スナップをチルド
		SceneManager._scene.addChild(seamlessSnap.sprite)
		// カウントを減らす
		seamlessSnap.count--
		seamlessSnap.sprite.opacity -= 255 / seamlessSnap.time
		// カウント 0 になったらシームレススナップの破棄
		if (seamlessSnap.count <= 0) {
			destroySeamlessSnap()
		}
	}

	// シームレススナップの破棄
	function destroySeamlessSnap() {
		destroySprite(seamlessSnap.sprite)
		seamlessSnap = null
	}

	//- シームレス風場所移動中か
	function inSeamlessTransfar() {
		return _inSeamlessTransfar
	}

	//==================================================
	//--  黒白フェード時間の変更
	//==================================================

	//- フェードイン時間の変更
	const _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn
	Scene_Base.prototype.startFadeIn = function (duration, white) {
		// フェード時間の取得-黒白
		if (this.constructor.name == 'Scene_Map' && !inBattleTransition(this)) {
			const time = getFadeTime_colored(white)
			if (time) {
				duration = time
			}
		}
		_Scene_Base_startFadeIn.call(this, duration, white)
	}

	//- フェードアウト時間の変更
	const _Scene_Base_startFadeOut = Scene_Base.prototype.startFadeOut
	Scene_Base.prototype.startFadeOut = function (duration, white) {
		// フェード時間の取得-黒白
		if (this.constructor.name == 'Scene_Map' && !inBattleTransition(this)) {
			const time = getFadeTime_colored(white)
			if (time) {
				duration = time
			}
		}
		_Scene_Base_startFadeOut.call(this, duration, white)
	}

	//- フェード時間の取得-黒白
	function getFadeTime_colored(white) {
		// シームレス風場所移動の初期化
		initSeamlessTransfar()
		// タイプ別に時間を取得
		const type = white ? 'white' : 'black'
		return getFadeTime(type)
	}

	//- バトル遷移中か
	function inBattleTransition(scene) {
		const sceneName = scene ? scene.constructor.name : ''
		const nextScene = SceneManager._nextScene
		const nextSceneName = nextScene ? nextScene.constructor.name : ''
		const preSceneClass = SceneManager._previousClass
		const preSceneName = preSceneClass ? preSceneClass.name : ''
		if (sceneName == 'Scene_Map' && nextSceneName == 'Scene_Battle') {
			return true
		}
		if (preSceneName == 'Scene_Battle' && sceneName == 'Scene_Map') {
			return true
		}
		return false
	}
})()
