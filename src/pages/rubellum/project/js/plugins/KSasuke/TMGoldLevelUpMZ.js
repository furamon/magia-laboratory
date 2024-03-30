//============================================================================
// TMPlugin - お金でレベルアップ MZ版
// (Level up not by exp but by paying gold for RMMZ)
// Version: 1.0.0
// Last Update: 2023/11/28
// URL : http://www.moonwhistle.org/tkoolMZ/TMGoldLevelUpMZ.zip
//----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky http://hikimoki.sakura.ne.jp/
// Copyright (c) 2023 Sasuke KANNAZUKI (神無月サスケ)
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//============================================================================
// [Update History]
// [[TMGoldLevelUp.js]]
// 2017/Jan/17 Ver1.2.1 Latest MV version by Tomoaky
//
// [[TMGoldLevelUpMZ.js]]
// 2023/Nov/27 Ver1.0.0 First MZ version by Sasuke KANNAZUKI
//

/*:
 * @target MZ
 * @plugindesc 経験値ではなくお金を消費して任意のタイミングで
 * アクターをレベルアップさせることができます。
 *
 * @author 神無月サスケ, tomoaky
 * @url http://www.moonwhistle.org/tkoolMZ/TMGoldLevelUpMZ.zip
 *
 * @param levelUpCommand
 * @text レベルアップコマンド名
 * @desc メニューに表示するレベルアップコマンド（空にすれば無効）初期値: レベルアップ
 * @default レベルアップ
 * @type string
 *
 * @param currentGold
 * @text お金の項目名
 * @desc ステータスに表示するお金の項目名 初期値: 所持金
 * @default 所持金
 * @type string
 *
 * @param learnSkill
 * @text スキルの項目名
 * @desc ステータスに表示する覚えるスキルの項目名 初期値: 覚えるスキル
 * @default 覚えるスキル
 * @type string
 *
 * @param textDummy
 * @text レベルアップ画面用テキスト
 * @desc レベルアップシーンで表示する文字列の設定
 * @default
 *
 * @param execLevelUpText
 * @parent textDummy
 * @text 実行コマンド名
 * @desc 選択することで実際にレベルアップを行うコマンド名
 * @type string
 * @default レベルアップする
 *
 * @param cancelLevelUpText
 * @parent textDummy
 * @text キャンセルコマンド名
 * @desc レベルアップをキャンセルするコマンド名
 * @type string
 * @default キャンセル
 *
 * @param levelUpSe
 * @text レベルアップ時SE
 * @desc レベルアップ時に鳴らす効果音のSE名 初期値: Up4
 * @default Up4
 * @dir /audio/se/
 * @type file
 *
 * @param levelUpSeParam
 * @parent levelUpSe
 * @text SEパラメータ
 * @desc レベルアップ時に鳴らす効果音のパラメータ
 * @type struct<SeParametersJpn>
 * @default {"volume":"90", "pitch":"100", "pan":"0"}
 *
 * @param useButton
 * @text アクター変更のボタン表示？
 * @desc アクター変更のボタンを表示するかどうか 初期値: true
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @command invoke
 * @text レベルアップシーン起動
 * @desc お金でレベルアップするシーンを呼び出します。
 *
 * @help
 * TMPlugin - お金でレベルアップ MZ版 Ver1.0.0
 *
 * 使い方:
 *
 *   このプラグインを導入すればメニューコマンドにレベルアップコマンドが
 *   追加され、お金を消費することでアクターのレベルを上げることができる
 *   ようになります。
 *
 *   レベルアップコマンド名(lavelUpCommand) を空文字にした場合、
 *   メニューからレベルアップコマンドを削除することができます。
 *   この場合はプラグインコマンドを使ってイベントからレベルアップシーンを
 *   呼び出してください。
 *
 *
 * プラグインコマンド:
 *   ・レベルアップシーン起動
 *
 * メモ欄タグ（アクター）:
 *
 *   <goldLevelUpRate:1.5>
 *     メモ欄にこのタグがついているアクターはレベルアップに必要な金額が
 *     1.5 倍になります。
 */

/*~struct~SeParametersJpn:
 * @param volume
 * @text ボリューム
 * @desc
 * @type number
 * @max 1000
 * @min 0
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @desc
 * @type number
 * @max 1000
 * @min 10
 * @default 100
 *
 * @param pan
 * @text 位相
 * @desc -100:左 100:右
 * @type number
 * @max 100
 * @min -100
 * @default 0
 */

//
// register pluguin information
//
Imported = window.Imported || {}
Imported.TMGoldLevelUp = true

TMParam = window.TMParam || {}
TMPlugin = window.TMPlugin || {}
;(() => {
	//
	// process parameters
	//
	const pluginName = 'TMGoldLevelUpMZ'

	TMPlugin.GoldLevelUp = {}
	TMPlugin.GoldLevelUp.Parameters = PluginManager.parameters(pluginName)
	const parameters = TMPlugin.GoldLevelUp.Parameters

	TMPlugin.GoldLevelUp.LevelUpCommand = parameters['levelUpCommand']
	TMPlugin.GoldLevelUp.CurrentGold = parameters['currentGold']
	TMPlugin.GoldLevelUp.LearnSkill = parameters['learnSkill']
	const levelUpSe = JSON.parse(parameters['levelUpSeParam'])
	Object.keys(levelUpSe).map((param) => (levelUpSe[param] = +levelUpSe[param]))
	TMPlugin.GoldLevelUp.LevelUpSe = levelUpSe
	TMPlugin.GoldLevelUp.LevelUpSe.name = parameters['levelUpSe']

	TMPlugin.GoldLevelUp.UseButton = eval(parameters['useButton'])

	const execLevelUpText = parameters['execLevelUpText']
	const cancelLevelUpText = parameters['cancelLevelUpText']

	//--------------------------------------------------------------------------
	// TextManager
	//

	Object.defineProperty(TextManager, 'goldLevelUp', {
		get: () => {
			return TMPlugin.GoldLevelUp.LevelUpCommand
		},
		configurable: true
	})

	//--------------------------------------------------------------------------
	// Game_Actor
	//

	Game_Actor.prototype.nextRequiredGold = function () {
		const rate = +this.actor().meta.goldLevelUpRate || 1
		return Math.floor(this.nextRequiredExp() * rate)
	}

	//--------------------------------------------------------------------------
	// Game_Interpreter
	//

	PluginManager.registerCommand(pluginName, 'invoke', (args) => {
		SoundManager.playOk()
		SceneManager.push(Scene_GoldLevelUp)
	})

	//--------------------------------------------------------------------------
	// Window_MenuCommand
	//

	const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands
	Window_MenuCommand.prototype.addOriginalCommands = function () {
		_Window_MenuCommand_addOriginalCommands.call(this)
		if (TMPlugin.GoldLevelUp.LevelUpCommand) {
			this.addCommand(TMPlugin.GoldLevelUp.LevelUpCommand, 'levelUp', true)
		}
	}

	//--------------------------------------------------------------------------
	// Window_Status
	//

	Window_Status.prototype.drawExpInfo = function (x, y) {
		const lineHeight = this.lineHeight()
		const expNext = TextManager.expNext.format(TextManager.level)
		const value = this._actor.isMaxLevel() ? '-------' : this._actor.nextRequiredGold()
		this.changeTextColor(this.systemColor())
		this.drawText(expNext, x, y + lineHeight * 0, 270)
		this.drawText(TMPlugin.GoldLevelUp.CurrentGold, x, y + lineHeight * 2, 270)
		this.resetTextColor()
		this.drawCurrencyValue(value, TextManager.currencyUnit, x, y + lineHeight * 1, 270)
		this.drawCurrencyValue($gameParty.gold(), TextManager.currencyUnit, x, y + lineHeight * 3, 270)
	}

	//--------------------------------------------------------------------------
	// Window_GoldLevelUpCommand
	//

	function Window_GoldLevelUpCommand() {
		this.initialize.apply(this, arguments)
	}

	Window_GoldLevelUpCommand.prototype = Object.create(Window_HorzCommand.prototype)
	Window_GoldLevelUpCommand.prototype.constructor = Window_GoldLevelUpCommand

	Window_GoldLevelUpCommand.prototype.initialize = function (rect) {
		Window_HorzCommand.prototype.initialize.call(this, rect)
	}

	Window_GoldLevelUpCommand.prototype.maxCols = function () {
		return 2
	}

	Window_GoldLevelUpCommand.prototype.makeCommandList = function () {
		this.addCommand(execLevelUpText, 'levelUp', this.canLevelUp())
		this.addCommand(cancelLevelUpText, 'cancelCommand')
	}

	Window_GoldLevelUpCommand.prototype.canLevelUp = function () {
		return (
			this._actor &&
			!this._actor.isMaxLevel() &&
			$gameParty.gold() >= this._actor.nextRequiredGold()
		)
	}

	Window_GoldLevelUpCommand.prototype.setActor = function (actor) {
		this._actor = actor
		this.refresh()
	}

	Window_GoldLevelUpCommand.prototype.playOkSound = function () {
		if (this.currentSymbol() === 'levelUp') {
			// レベルアップ効果音を鳴らす (Play level up SE)
			AudioManager.playStaticSe(TMPlugin.GoldLevelUp.LevelUpSe)
		} else {
			SoundManager.playCancel()
		}
	}

	//--------------------------------------------------------------------------
	// Window_GoldLevelUpStatus
	//

	function Window_GoldLevelUpStatus() {
		this.initialize.apply(this, arguments)
	}

	Window_GoldLevelUpStatus.prototype = Object.create(Window_Status.prototype)
	Window_GoldLevelUpStatus.prototype.constructor = Window_GoldLevelUpStatus

	Window_GoldLevelUpStatus.prototype.initialize = function (rect) {
		Window_Status.prototype.initialize.call(this, rect)
		this.refresh()
	}

	Window_GoldLevelUpStatus.prototype.refresh = function () {
		this.contents.clear()
		if (this._actor) {
			if (!this._actor.isMaxLevel()) {
				this._tempActor = JsonEx.makeDeepCopy(this._actor)
				this._tempActor.levelUp()
			} else {
				this._tempActor = null
			}
			const lineHeight = this.lineHeight()
			this.drawBlock1()
			this.drawHorzLine(lineHeight * 1)
			// It needs to redraw HP/MP/TP
			this.refreshInnerChildren()
			this.drawBlock2()
			this.drawHorzLine(lineHeight * 6 - 20)
			this.drawBlock3(lineHeight * 7 - 40)
		}
	}

	Window_GoldLevelUpStatus.prototype.refreshInnerChildren = function () {
		this._innerChildren.forEach((c) => this._clientArea.removeChild(c))
		this._innerChildren = []
		this._additionalSprites = {}
	}

	Window_GoldLevelUpStatus.prototype.drawBlock3 = function (y) {
		this.drawParameters(48, y)
		this.drawMhpAndMmp(432, y)
		this.drawSkills(432, y + this.lineHeight() * 2)
	}

	Window_GoldLevelUpStatus.prototype.drawHorzLine = function (y) {
		const lineY = y + 7
		const width = this.contentsWidth()
		this.contents.paintOpacity = 48
		this.contents.fillRect(0, lineY, width, 2, this.lineColor())
		this.contents.paintOpacity = 255
	}

	Window_GoldLevelUpStatus.prototype.lineColor = function () {
		return ColorManager.normalColor()
	}

	//
	// draw current parameters
	//
	Window_GoldLevelUpStatus.prototype.drawParamBase = function (x, y, originId, num) {
		const lineHeight = this.lineHeight()
		for (let i = 0; i < num; i++) {
			const paramId = i + originId
			const y2 = y + lineHeight * i
			this.changeTextColor(ColorManager.systemColor())
			this.drawText(TextManager.param(paramId), x, y2, 120)
			this.resetTextColor()
			this.drawText(this._actor.param(paramId), x + 140, y2, 48, 'right')
			if (this._tempActor) {
				this.drawRightArrow(x + 188, y2)
				this.drawNewParam(x + 222, y2, paramId)
			}
		}
	}

	Window_GoldLevelUpStatus.prototype.drawParameters = function (x, y) {
		this.drawParamBase(x, y, 2, 6)
	}

	Window_GoldLevelUpStatus.prototype.drawMhpAndMmp = function (x, y) {
		this.drawParamBase(x, y, 0, 2)
	}

	//
	// draw new parameters of next level
	//
	Window_GoldLevelUpStatus.prototype.drawRightArrow = function (x, y) {
		Window_EquipStatus.prototype.drawRightArrow.call(this, x, y)
	}

	Window_GoldLevelUpStatus.prototype.rightArrowWidth = function () {
		return Window_EquipStatus.prototype.rightArrowWidth.call(this)
	}

	Window_GoldLevelUpStatus.prototype.drawNewParam = function (x, y, paramId) {
		if (this._tempActor && this._actor) {
			Window_EquipStatus.prototype.drawNewParam.call(this, x, y, paramId)
		}
	}

	Window_GoldLevelUpStatus.prototype.paramWidth = function () {
		return Window_EquipStatus.prototype.paramWidth.call(this)
	}

	//
	// draw skills to learn
	//
	Window_GoldLevelUpStatus.prototype.drawSkills = function (x, y) {
		const lineHeight = this.lineHeight()
		this.changeTextColor(ColorManager.systemColor())
		this.drawText(TMPlugin.GoldLevelUp.LearnSkill, x, y + lineHeight * 0, 270)
		this.resetTextColor()
		if (this._tempActor) {
			let i = 0
			this._tempActor.currentClass().learnings.forEach((learning) => {
				if (learning.level === this._tempActor._level) {
					const skill = $dataSkills[learning.skillId]
					this.drawItemName(skill, x, y + lineHeight * ++i)
				}
			}, this)
		}
	}

	//--------------------------------------------------------------------------
	// Scene_Menu
	//

	const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow
	Scene_Menu.prototype.createCommandWindow = function () {
		_Scene_Menu_createCommandWindow.call(this)
		this._commandWindow.setHandler('levelUp', this.commandPersonal.bind(this))
	}

	const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk
	Scene_Menu.prototype.onPersonalOk = function () {
		switch (this._commandWindow.currentSymbol()) {
			case 'levelUp':
				SceneManager.push(Scene_GoldLevelUp)
				break
			default:
				_Scene_Menu_onPersonalOk.call(this)
				break
		}
	}

	//--------------------------------------------------------------------------
	// Scene_GoldLevelUp
	//

	function Scene_GoldLevelUp() {
		this.initialize.apply(this, arguments)
	}

	Scene_GoldLevelUp.prototype = Object.create(Scene_MenuBase.prototype)
	Scene_GoldLevelUp.prototype.constructor = Scene_GoldLevelUp

	Scene_GoldLevelUp.prototype.initialize = function () {
		Scene_MenuBase.prototype.initialize.call(this)
	}

	Scene_GoldLevelUp.prototype.create = function () {
		Scene_MenuBase.prototype.create.call(this)
		this.createCommandWindow()
		this.createStatusWindow()
	}

	Scene_GoldLevelUp.prototype.start = function () {
		Scene_MenuBase.prototype.start.call(this)
		this._statusWindow.refresh()
	}

	Scene_GoldLevelUp.prototype.needsPageButtons = function () {
		return true
	}

	//
	// create windows
	//
	Scene_GoldLevelUp.prototype.createCommandWindow = function () {
		const rect = this.commandWindowRect()
		this._commandWindow = new Window_GoldLevelUpCommand(rect)
		this._commandWindow.setHandler('levelUp', this.commandLevelUp.bind(this))
		this._commandWindow.setHandler('cancelCommand', this.popScene.bind(this))
		this._commandWindow.setHandler('pagedown', this.nextActor.bind(this))
		this._commandWindow.setHandler('pageup', this.previousActor.bind(this))
		this._commandWindow.setHandler('cancel', this.popScene.bind(this))
		this.addWindow(this._commandWindow)
	}

	Scene_GoldLevelUp.prototype.commandWindowRect = function () {
		const wy = this.mainAreaTop()
		const ww = Graphics.boxWidth
		const wh = this.calcWindowHeight(1, true)
		return new Rectangle(0, wy, ww, wh)
	}

	Scene_GoldLevelUp.prototype.createStatusWindow = function () {
		const rect = this.statusWindowRect()
		this._statusWindow = new Window_GoldLevelUpStatus(rect)
		this.addWindow(this._statusWindow)
		this.refreshActor()
	}

	Scene_GoldLevelUp.prototype.statusWindowRect = function () {
		const wy = this._commandWindow.y + this._commandWindow.height
		const ww = Graphics.boxWidth
		const wh = Graphics.boxHeight - wy
		return new Rectangle(0, wy, ww, wh)
	}

	//
	// process handlers
	//
	Scene_GoldLevelUp.prototype.commandLevelUp = function () {
		const actor = this.actor()
		$gameParty.loseGold(actor.nextRequiredGold())
		actor.changeExp(actor.currentExp() + actor.nextRequiredExp(), false)
		this._commandWindow.refresh()
		this._statusWindow.refresh()
		this._commandWindow.activate()
	}

	Scene_GoldLevelUp.prototype.refreshActor = function () {
		const actor = this.actor()
		this._commandWindow.setActor(actor)
		this._statusWindow.setActor(actor)
	}

	Scene_GoldLevelUp.prototype.onActorChange = function () {
		Scene_MenuBase.prototype.onActorChange.call(this)
		this.refreshActor()
		this._commandWindow.activate()
	}
})()
