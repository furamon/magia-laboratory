/* ------------------------------------------------------
 * Copyright (c) 2023 udon
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 * ------------------------------------------------------*/
/*:
@target MZ
@author udon
@plugindesc
ステートビューワ ver1.0.0

@help
戦闘中にバフの付与状況の一覧、および状態異常の一覧を閲覧するための
ウィンドウを表示します。

味方と敵の一覧の表示の切り替えにはEnterキーを使用します。
元の画面に戻るにはEscキーを押下してください。

## 最終更新日 ##
2023/06/27

## 備考 ##
次のバージョンでそれぞれのアイコンの説明を表示できるようにする予定です。
不具合報告や要望は以下まで連絡いただけると助かります。
https://twitter.com/udon2481

## ツクールバージョン ##
RPGツクールMZ Version 1.6.1 で動作確認。

@param CommandButtonText
@type string
@text ボタンのテキスト
@desc ステートビューワを表示するボタンのテキストを指定します。(デフォルト値:ステート詳細)
@default ステート詳細

@param ViewerConfig
@text ステートビューワの表示設定
@desc ステートビューワの表示内容を指定できます。

    @param ActorInfoConfig
    @text ステータス表示位置
    @desc ビューワ内のキャラクター名、HP、MP、TPの表示位置を指定します。
    @parent ViewerConfig

        @param ActorInfoPositionX
        @type number
        @text X座標
        @desc キャラクターステータスの表示位置(X座標)を指定します。(デフォルト値:10)
        @default 10
        @parent ActorInfoConfig

        @param ActorInfoPositionY
        @type number
        @text Y座標
        @desc キャラクターステータスの表示位置(Y座標)を指定します。(デフォルト値:10)
        @default 10
        @parent ActorInfoConfig

    @param ShouldDisplayEnemyInformation
    @type boolean
    @text 敵情報の表示設定
    @on 表示する。
    @off 表示しない。
    @desc 敵情報を表示するかどうかを指定します。(デフォルト値:on)
    @default true
    @parent ViewerConfig

    @param BuffIconConfig
    @text バフ付与アイコンの設定
    @desc バフ付与アイコンのパラメータを設定します。
    @parent ViewerConfig

        @param BuffIconTitle
        @type string
        @text タイトル
        @desc バフアイコン一覧のタイトルを指定します。(デフォルト値:付与状態)
        @default 付与状態
        @parent BuffIconConfig

            @param BuffIconTitlePositionX
            @type number
            @text X座標
            @desc タイトルの表示位置(X座標)を指定します。(デフォルト値:170)
            @default 170
            @parent BuffIconTitle

            @param BuffIconTitlePositionY
            @type number
            @text Y座標
            @desc タイトルの表示位置(Y座標)を指定します。(デフォルト値:30)
            @default 30
            @parent BuffIconTitle

            @param BuffIconTitleWidth
            @type number
            @text 横幅
            @desc タイトルの横幅を指定します。(デフォルト値:100)
            @default 100
            @parent BuffIconTitle

        @param BuffIconPosition
        @text 表示位置
        @desc アイコン一覧の表示位置を指定します。
        @parent BuffIconConfig

            @param BuffIconPositionX
            @type number
            @text X座標
            @desc アイコンの表示位置(X座標)を指定します。(デフォルト値:290)
            @default 290
            @parent BuffIconPosition

            @param BuffIconPositionY
            @type number
            @text Y座標
            @desc アイコンの表示位置(Y座標)を指定します。(デフォルト値:30)
            @default 30
            @parent BuffIconPosition

    @param StateIconConfig
    @text 状態異常アイコンの設定
    @desc 状態異常アイコンのパラメータを設定します。
    @parent ViewerConfig

        @param StateIconTitle
        @type string
        @text タイトル
        @desc 状態異常アイコン一覧のタイトルを指定します。(デフォルト値:異常状態)
        @default 異常状態
        @parent StateIconConfig

            @param StateIconTitlePositionX
            @type number
            @text X座標
            @desc タイトルの表示位置(X座標)を指定します。(デフォルト値:170)
            @default 170
            @parent StateIconTitle

            @param StateIconTitlePositionY
            @type number
            @text Y座標
            @desc タイトルの表示位置(Y座標)を指定します。(デフォルト値:75)
            @default 75
            @parent StateIconTitle

            @param StateIconTitleWidth
            @type number
            @text 横幅
            @desc タイトルの横幅を指定します。(デフォルト値:100)
            @default 100
            @parent StateIconTitle

        @param StateIconPosition
        @text 表示位置
        @desc アイコン一覧の表示位置を指定します。
        @parent StateIconConfig

            @param StateIconPositionX
            @type number
            @text X座標
            @desc アイコンの表示位置(X座標)を指定します。(デフォルト値:290)
            @default 290
            @parent StateIconPosition

            @param StateIconPositionY
            @type number
            @text Y座標
            @desc アイコンの表示位置(Y座標)を指定します。(デフォルト値:77)
            @default 77
            @parent StateIconPosition
*/

var Imported = Imported || {}
Imported['VblActorStateViewer'] = 1.0
;(() => {
	'use strict'

	const pluginName = 'VblActorStateViewer'
	const params = PluginManager.parameters(pluginName)

	let VblStateViewerArguments = {}
	// ステートビューワの設定
	VblStateViewerArguments.commandButtonText = params.CommandButtonText
	VblStateViewerArguments.actorInfoPositionX = Number(params.ActorInfoPositionX)
	VblStateViewerArguments.actorInfoPositionY = Number(params.ActorInfoPositionY)
	VblStateViewerArguments.shouldDisplayEnemyInformation =
		params.ShouldDisplayEnemyInformation === 'true'
	// バフアイコンの設定
	VblStateViewerArguments.buffIconTitle = params.BuffIconTitle
	VblStateViewerArguments.buffIconTitlePositionX = Number(params.BuffIconTitlePositionX)
	VblStateViewerArguments.buffIconTitlePositionY = Number(params.BuffIconTitlePositionY)
	VblStateViewerArguments.buffIconTitleWidth = Number(params.BuffIconTitleWidth)
	VblStateViewerArguments.buffIconPositionX = Number(params.BuffIconPositionX)
	VblStateViewerArguments.buffIconPositionY = Number(params.BuffIconPositionY)
	// ステートアイコンの設定
	VblStateViewerArguments.stateIconTitle = params.StateIconTitle
	VblStateViewerArguments.stateIconTitlePositionX = Number(params.StateIconTitlePositionX)
	VblStateViewerArguments.stateIconTitlePositionY = Number(params.StateIconTitlePositionY)
	VblStateViewerArguments.stateIconTitleWidth = Number(params.StateIconTitleWidth)
	VblStateViewerArguments.stateIconPositionX = Number(params.StateIconPositionX)
	VblStateViewerArguments.stateIconPositionY = Number(params.StateIconPositionY)

	// プラグインで使用する定数
	let VblStateViewerConst = {}
	// アイコン間のマージン
	VblStateViewerConst.iconMargin = 5
	// 残りターン数関係の定数（座標の基準点はアイコンの左上端）
	VblStateViewerConst.turnNumberPositionX = 25
	VblStateViewerConst.turnNumberPositionY = -15
	VblStateViewerConst.turnNumberWidth = 30
	VblStateViewerConst.turnNumberHeight = 15
	VblStateViewerConst.turnNumberFontSize = 15
	// 戦闘不能のステートID（戦闘不能の敵キャラは表示しない設定で使用）
	VblStateViewerConst.deadStateId = 1

	// 味方キャラのステートビューワ
	class VblActorStateViewer extends Window_MenuActor {
		constructor(rect) {
			super(rect)

			this.openness = 0
			this.opacity = 255
		}

		static create() {
			const rect = this.windowRectangle()
			return new VblActorStateViewer(rect)
		}

		static windowRectangle() {
			const x = 0
			const y = 0
			const width = Graphics.boxWidth
			const height = Graphics.boxHeight
			return new Rectangle(x, y, width, height)
		}

		// override
		close() {
			this.select(0)
			super.close()
		}

		// 最初に誰かを選択していないと、後の処理で未設定のactorIdを参照してしまいエラーになる。
		// そこでselect(0)で戦闘のアクターを選択する。
		// override
		open() {
			super.open()
			this.select(0)
			this.refresh()
			this.show()
		}

		// override
		drawItem(index) {
			this.drawItemStatus(index)
		}

		// override
		drawItemStatus(index) {
			const actor = this.actor(index)
			const rect = this.itemRect(index)

			// アクターステータス
			this.drawActorSimpleStatus(actor, rect.x, rect.y)
			// バフ情報
			this.drawBuffTitle(rect.x, rect.y)
			this.drawBuffIcons(actor, rect.x, rect.y)
			// ステート情報
			this.drawStateTitle(rect.x, rect.y)
			this.drawStateIcons(actor, rect.x, rect.y)
		}

		// override
		drawActorSimpleStatus(actor, x, y) {
			const actorX = VblStateViewerArguments.actorInfoPositionX + x
			const actorY = VblStateViewerArguments.actorInfoPositionY + y
			const lineHeight = this.lineHeight()

			this.drawActorName(actor, actorX, actorY)
			this.placeBasicGauges(actor, actorX, actorY + lineHeight)

			// アクターのフェイスアイコンを表示する場合は以下を有効にする。
			// this.drawActorIcons(actor, actorX, actorY + lineHeight * 2);
		}

		drawBuffTitle(x, y) {
			const title = VblStateViewerArguments.buffIconTitle
			const titleX = VblStateViewerArguments.buffIconTitlePositionX + x
			const titleY = VblStateViewerArguments.buffIconTitlePositionY + y
			const width = VblStateViewerArguments.buffIconTitleWidth
			const height = this.lineHeight()

			this.drawText(title, titleX, titleY, width, height, 'left')
		}

		// 引数のx,yはウィンドウ枠の左上(いわば基準点)
		drawBuffIcons(actor, x, y) {
			const oldFontSize = this.contents.fontSize
			try {
				this.contents.fontSize = VblStateViewerConst.turnNumberFontSize
				const configs = this.buffConfigs(actor)

				// アイコン表示
				const iconX = VblStateViewerArguments.buffIconPositionX + x
				const iconY = VblStateViewerArguments.buffIconPositionY + y
				this.drawIcons(configs, iconX, iconY)
				// 残りターン数表示
				const turnX = VblStateViewerConst.turnNumberPositionX + iconX
				const turnY = VblStateViewerConst.turnNumberPositionY + iconY
				this.drawTurns(configs, turnX, turnY)
			} finally {
				this.contents.fontSize = oldFontSize
			}
		}

		buffConfigs(actor) {
			return actor._buffs
				.map((level, id) => {
					return { level: level, id: id }
				})
				.filter((buff) => {
					return buff.level !== 0
				})
				.map((buff) => {
					return {
						icon: actor.buffIconIndex(buff.level, buff.id),
						turn: actor._buffTurns[buff.id] + 1,
						width: VblStateViewerConst.turnNumberWidth,
						height: VblStateViewerConst.turnNumberHeight,
						turnVisible: true
					}
				})
		}

		drawStateTitle(x, y) {
			const title = VblStateViewerArguments.stateIconTitle
			const titleX = VblStateViewerArguments.stateIconTitlePositionX + x
			const titleY = VblStateViewerArguments.stateIconTitlePositionY + y
			const width = VblStateViewerArguments.stateIconTitleWidth
			const height = this.lineHeight()

			this.drawText(title, titleX, titleY, width, height, 'left')
		}

		drawStateIcons(actor, x, y) {
			const oldFontSize = this.contents.fontSize
			try {
				this.contents.fontSize = VblStateViewerConst.turnNumberFontSize
				const configs = this.stateConfigs(actor)

				// アイコン表示
				const iconX = VblStateViewerArguments.stateIconPositionX + x
				const iconY = VblStateViewerArguments.stateIconPositionY + y
				this.drawIcons(configs, iconX, iconY)
				// 残りターン数表示
				const turnX = VblStateViewerConst.turnNumberPositionX + iconX
				const turnY = VblStateViewerConst.turnNumberPositionY + iconY
				this.drawTurns(configs, turnX, turnY)
			} finally {
				this.contents.fontSize = oldFontSize
			}
		}

		stateConfigs(actor) {
			const statesJson = actor.states()
			return actor._states
				.map((id, index) => {
					return { id: id, index: index }
				})
				.filter((state) => {
					return statesJson[state.index].iconIndex > 0
				})
				.map((state) => {
					return {
						icon: statesJson[state.index].iconIndex,
						turn: actor._stateTurns[state.id] + 1,
						width: VblStateViewerConst.turnNumberWidth,
						height: VblStateViewerConst.turnNumberHeight,
						turnVisible: statesJson[state.index].autoRemovalTiming !== 0
					}
				})
		}

		drawIcons(configs, x, y) {
			const nextX = ImageManager.iconWidth + VblStateViewerConst.iconMargin

			let iconX = x
			for (const config of configs) {
				this.drawIcon(config.icon, iconX, y)
				iconX += nextX
			}
		}

		drawTurns(configs, x, y) {
			const nextX = ImageManager.iconWidth + VblStateViewerConst.iconMargin

			let turnX = x
			for (const config of configs) {
				if (config.turnVisible) {
					this.drawText(config.turn, turnX, y, config.width, config.height, 'left')
				}
				turnX += nextX
			}
		}
	}

	// 敵キャラのステートビューワ
	class VblEnemyStateViewer extends VblActorStateViewer {
		constructor(rect) {
			super(rect)
		}

		static create() {
			const rect = this.windowRectangle()
			return new VblEnemyStateViewer(rect)
		}

		static windowRectangle() {
			const x = 0
			const y = 0
			const width = Graphics.boxWidth
			const height = Graphics.boxHeight
			return new Rectangle(x, y, width, height)
		}

		// 戦闘不能になった敵は表示しない。
		actors() {
			return $gameTroop.members().filter((member) => {
				return !member.isStateAffected(VblStateViewerConst.deadStateId)
			})
		}

		// override
		actor(index) {
			return this.actors()[index]
		}

		// override
		maxItems() {
			return this.actors().length
		}

		// override
		drawAllItems() {
			const minIndex = 0
			const maxIndex = this.actors().length
			for (let i = minIndex; i < maxIndex; i++) {
				this.drawItem(i)
			}
		}

		// override
		drawItem(index) {
			this.drawItemBackground(index)
			super.drawItem(index)
		}

		// override
		placeBasicGauges(actor, x, y) {
			const lineHeight = this.gaugeLineHeight()

			this.placeGauge(actor, 'hp', x, y)
			this.placeGauge(actor, 'mp', x, y + lineHeight)
		}

		// 同一の敵キャラには同一のIDが割り当てられているため、hashのkeyが衝突してしまいスプライトを上書きしてしまう。
		// そのため、keyに座標を含めることで衝突を回避する。
		// override
		placeGauge(actor, type, x, y) {
			const key = 'enemy%1-gauge-%2-%3-%4'.format(actor.actorId(), type, x, y)
			const sprite = this.createInnerSprite(key, Sprite_Gauge)
			sprite.setup(actor, type)
			sprite.move(x, y)
			sprite.show()
		}

		// 敵キャラ数 > 味方キャラ数の状況で味方キャラの数より大きいindexの敵キャラにカーソルをあわせると、
		// Window_MenuActor.prototype.processOk()にて、「$gameParty.members()」の配列から配列外のindexを参照しようとして例外になる。
		// それを防ぐため、ここで蓋をする。
		// override
		processOk() {
			this.callOkHandler()
		}
	}

	// Window_MenuActorはGame_Actorを使用する前提になっており、敵の情報を管理するGame_Enemyと一部インターフェースが一致しない。
	// そこで、Game_EnemyでWindow_MenuActorを利用できるよう、Game_ActorとGame_Enemyのインターフェースを一致させる。
	Game_Enemy.prototype.actorId = function () {
		return this.enemyId()
	}

	Game_Enemy.prototype.actor = function () {
		return this.enemy()
	}

	// ステートビューワのインスタンス作成
	Scene_Battle.prototype.createVblActorStateViewer = function () {
		//this._vblActorStateViewer.setHelpWindow(this._helpWindow);

		this._vblActorStateViewer = VblActorStateViewer.create()
		this._vblActorStateViewer.setHandler('ok', this.switchStateViewerFromActorToEnemy.bind(this))
		this._vblActorStateViewer.setHandler('cancel', this.closeVblActorStateViewer.bind(this))
		this.addWindow(this._vblActorStateViewer)

		if (VblStateViewerArguments.shouldDisplayEnemyInformation) {
			this._vblEnemyStateViewer = VblEnemyStateViewer.create()
			this._vblEnemyStateViewer.setHandler('ok', this.switchStateViewerFromEnemyToActor.bind(this))
			this._vblEnemyStateViewer.setHandler('cancel', this.closeVblActorStateViewer.bind(this))
			this.addWindow(this._vblEnemyStateViewer)
		}
	}

	// プレイヤーのステート表示
	Scene_Battle.prototype.switchStateViewerFromEnemyToActor = function () {
		this._vblActorStateViewer.activate()
		this._vblActorStateViewer.open()
		if (VblStateViewerArguments.shouldDisplayEnemyInformation) {
			this._vblEnemyStateViewer.close()
		}
	}

	// 敵キャラのステート表示
	Scene_Battle.prototype.switchStateViewerFromActorToEnemy = function () {
		if (VblStateViewerArguments.shouldDisplayEnemyInformation) {
			this._vblEnemyStateViewer.activate()
			this._vblEnemyStateViewer.open()
			this._vblActorStateViewer.close()
		}
	}

	// ステートビューワを閉じる
	Scene_Battle.prototype.closeVblActorStateViewer = function () {
		this._vblActorStateViewer.deactivate()
		this._vblActorStateViewer.close()

		if (VblStateViewerArguments.shouldDisplayEnemyInformation) {
			this._vblEnemyStateViewer.deactivate()
			this._vblEnemyStateViewer.close()
		}

		//this._helpWindow.hide();

		if (BattleManager.isInputting()) {
			if (this._vblSourceWindow) {
				this._vblSourceWindow.activate()
			}
		}
	}

	// ステートビューワを開く
	Scene_Battle.prototype.openVblActorStateViewer = function () {
		this._vblActorStateViewer.activate()
		this._vblActorStateViewer.open()
		this._vblSourceWindow = this.switchSourceWindowFromVblActorStateViewer()

		this._partyCommandWindow.deactivate()
		this._actorCommandWindow.deactivate()
	}

	// ビューワを閉じるときの遷移先のウィンドウを記録しておく。
	// ビューワを開いた時点のウィンドウを保持する。
	Scene_Battle.prototype.switchSourceWindowFromVblActorStateViewer = function () {
		if (this._partyCommandWindow.isOpen()) {
			return this._partyCommandWindow
		}
		if (this._actorCommandWindow.isOpen()) {
			return this._actorCommandWindow
		}
		return null
	}

	// ステートビューワ操作中の場合はウィンドウの切り替えを阻止する。
	const _VblActorStateViewer_Scene_Battle_changeInputWindow =
		Scene_Battle.prototype.changeInputWindow
	Scene_Battle.prototype.changeInputWindow = function () {
		if (this._vblActorStateViewer.active) {
			return
		}

		_VblActorStateViewer_Scene_Battle_changeInputWindow.apply(this)
	}

	// メソッドのフック
	// まず、baseの処理を実行したあと、書き換えた処理を実行する
	function postfaceHook(baseClass, methodName, newAction) {
		if (baseClass.prototype[methodName]) {
			baseClass = baseClass.prototype
		} else if (!baseClass[methodName]) {
			throw new Error('hook destination is not found.')
		}

		const oldAction = baseClass[methodName]
		baseClass[methodName] = function () {
			const returnValue = oldAction.apply(this, arguments)

			// 元の処理の実行結果を引数に追加する
			arguments[arguments.length] = returnValue
			arguments.length++

			return newAction.apply(this, arguments)
		}
	}

	// 他のウィンドウと同じタイミングでステートビューワのインスタンスを作成
	postfaceHook(Scene_Battle, 'createDisplayObjects', function () {
		this.createVblActorStateViewer()
	})

	// 戦闘中のコマンドにステート表示のボタンを追加
	postfaceHook(Window_PartyCommand, 'makeCommandList', function () {
		this.addCommand(VblStateViewerArguments.commandButtonText, pluginName)
	})

	// ステート表示のボタン押下時の処理
	postfaceHook(Scene_Battle, 'createPartyCommandWindow', function () {
		this._partyCommandWindow.setHandler(pluginName, this.openVblActorStateViewer.bind(this))
	})
})()
