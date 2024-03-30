//=============================================================================
// MPP_StatePopup.js
//=============================================================================
// Copyright (c) 2019 - 2021 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc Displays the removed or added state above the character's head during battle.
 * @author Mokusei Penguin
 * @url
 *
 * @help [version 2.0.0]
 * This plugin is for RPG Maker MV and MZ.
 *
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠ is half-width)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 *
 *  @param Added Time
 *      @desc
 *      @type number
 *          @min 0
 *          @max 999
 *      @default 45
 *
 *  @param Removed Time
 *      @desc
 *      @type number
 *          @min 0
 *          @max 999
 *      @default 35
 *
 *  @param Interval Time
 *      @desc
 *      @type number
 *          @min 1
 *          @max 999
 *      @default 30
 *
 *  @param Popup To Actor?
 *      @desc
 *      @type boolean
 *      @default true
 *
 *  @param Popup To Enemy?
 *      @desc
 *      @type boolean
 *      @default false
 *
 */

/*:ja
 * @target MV MZ
 * @plugindesc 戦闘中、解除または付加されたステートをキャラクターの頭上に表示します。
 * @author 木星ペンギン
 * @url
 *
 * @help [version 2.0.0]
 * このプラグインはRPGツクールMVおよびMZ用です。
 *
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 *
 *  @param Added Time
 *      @text 付加時の表示時間
 *      @desc
 *      @type number
 *          @min 0
 *          @max 999
 *      @default 45
 *
 *  @param Removed Time
 *      @text 解除時の表示時間
 *      @desc
 *      @type number
 *          @min 0
 *          @max 999
 *      @default 35
 *
 *  @param Interval Time
 *      @text 表示間隔
 *      @desc
 *      @type number
 *          @min 1
 *          @max 999
 *      @default 30
 *
 *  @param Popup To Actor?
 *      @text アクターにポップアップさせるかどうか？
 *      @desc
 *      @type boolean
 *      @default true
 *
 *  @param Popup To Enemy?
 *      @text 敵キャラにポップアップさせるかどうか？
 *      @desc
 *      @type boolean
 *      @default false
 *
 */

;(() => {
	'use strict'

	const pluginName = 'MPP_StatePopup'

	// Plugin Parameters
	const parameters = PluginManager.parameters(pluginName)
	const param_AddedTime = Number(parameters['Added Time'] || 45)
	const param_RemovedTime = Number(parameters['Removed Time'] || 35)
	const param_IntervalTime = Number(parameters['Interval Time'] || 30)
	const param_PopupToActor = parameters['Popup To Actor?'] === 'true'
	const param_PopupToEnemy = parameters['Popup To Enemy?'] === 'true'

	//-------------------------------------------------------------------------
	// Game_ActionResult

	const _Game_ActionResult_clear = Game_ActionResult.prototype.clear
	Game_ActionResult.prototype.clear = function () {
		_Game_ActionResult_clear.apply(this, arguments)
		this.removedDebuffs = []
		this._affectedBuffLevels = {}
	}

	const _Game_ActionResult_isStatusAffected = Game_ActionResult.prototype.isStatusAffected
	Game_ActionResult.prototype.isStatusAffected = function () {
		return (
			_Game_ActionResult_isStatusAffected.apply(this, arguments) || this.removedDebuffs.length > 0
		)
	}

	Game_ActionResult.prototype.setAffectedBuffLevel = function (paramId, level) {
		this._affectedBuffLevels[paramId] = level
	}

	Game_ActionResult.prototype.getAffectedBuffLevel = function (paramId) {
		return this._affectedBuffLevels[paramId] || 0
	}

	Game_ActionResult.prototype.isDebuffRemoved = function (paramId) {
		return this.removedDebuffs.includes(paramId)
	}

	Game_ActionResult.prototype.pushRemovedDebuff = function (paramId) {
		if (!this.isDebuffRemoved(paramId)) {
			this.removedDebuffs.push(paramId)
		}
	}

	//-------------------------------------------------------------------------
	// Game_Battler

	const _Game_Battler_initMembers = Game_Battler.prototype.initMembers
	Game_Battler.prototype.initMembers = function () {
		_Game_Battler_initMembers.apply(this, arguments)
		this._statePopup = false
	}

	const _Game_Battler_addBuff = Game_Battler.prototype.addBuff
	Game_Battler.prototype.addBuff = function (paramId, turns) {
		_Game_Battler_addBuff.apply(this, arguments)
		if (this._result.isBuffAdded(paramId)) {
			this._result.setAffectedBuffLevel(paramId, this.buff(paramId))
		}
	}

	const _Game_Battler_addDebuff = Game_Battler.prototype.addDebuff
	Game_Battler.prototype.addDebuff = function (paramId, turns) {
		_Game_Battler_addDebuff.apply(this, arguments)
		if (this._result.isDebuffAdded(paramId)) {
			this._result.setAffectedBuffLevel(paramId, this.buff(paramId))
		}
	}

	const _Game_Battler_removeBuff = Game_Battler.prototype.removeBuff
	Game_Battler.prototype.removeBuff = function (paramId) {
		if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
			this._result.setAffectedBuffLevel(paramId, this.buff(paramId))
			if (this.isDebuffAffected(paramId)) {
				this.eraseBuff(paramId)
				this._result.pushRemovedDebuff(paramId)
				this.refresh()
			}
		}
		_Game_Battler_removeBuff.apply(this, arguments)
	}

	Game_Battler.prototype.clearStatePopup = function () {
		this._statePopup = false
	}

	Game_Battler.prototype.isStatePopupRequested = function () {
		return this._statePopup
	}

	Game_Battler.prototype.startStatePopup = function () {
		this._statePopup = true
	}

	Game_Battler.prototype.shouldPopupState = function () {
		return this._result.isStatusAffected()
	}

	//-------------------------------------------------------------------------
	// Window_BattleLog

	const _Window_BattleLog_popupDamage = Window_BattleLog.prototype.popupDamage
	Window_BattleLog.prototype.popupDamage = function (target) {
		_Window_BattleLog_popupDamage.apply(this, arguments)
		if (target.shouldPopupState()) {
			target.startStatePopup()
		}
	}

	const _Window_BattleLog_displayChangedBuffs = Window_BattleLog.prototype.displayChangedBuffs
	Window_BattleLog.prototype.displayChangedBuffs = function (target) {
		_Window_BattleLog_displayChangedBuffs.apply(this, arguments)
		const result = target.result()
		this.displayBuffs(target, result.removedDebuffs, TextManager.buffRemove)
	}

	//-------------------------------------------------------------------------
	// Sprite_Battler

	const _Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers
	Sprite_Battler.prototype.initMembers = function () {
		_Sprite_Battler_initMembers.apply(this, arguments)
		this._popupStates = []
	}

	const _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup
	Sprite_Battler.prototype.updateDamagePopup = function () {
		this.updateStatePopup()
		_Sprite_Battler_updateDamagePopup.apply(this, arguments)
	}

	Sprite_Battler.prototype.updateStatePopup = function () {
		this.setupStatePopup()
		if (this._popupStates.length > 0) {
			if (!this._popupStates[0].isPlaying()) {
				this.destroyTopPopupStateSprite()
			}
		}
	}

	Sprite_Battler.prototype.setupStatePopup = function () {
		if (this._battler.isStatePopupRequested()) {
			if (this.isPopupState()) {
				this.processPopupStateRequests()
			}
			this._battler.clearStatePopup()
			if (!this._battler.isDamagePopupRequested()) {
				this._battler.clearResult()
			}
		}
		if (this._battler._atbDamagePopup && this.isPopupState()) {
			this.setupStatePopup(this._battler._atbResult)
		}
	}

	Sprite_Battler.prototype.isPopupState = function () {
		return this._battler.isSpriteVisible()
	}

	Sprite_Battler.prototype.processPopupStateRequests = function () {
		const result = this._battler.result()
		for (const iconIndex of this.addedPopupStateIcons(result)) {
			this.createPopupStateSprite(iconIndex, 'added')
		}
		for (const iconIndex of this.removedPopupStateIcons(result)) {
			this.createPopupStateSprite(iconIndex, 'removed')
		}
	}

	Sprite_Battler.prototype.addedPopupStateIcons = function (result) {
		return [
			...this.addedStateIcons(result),
			...this.generatorAddedBuffIcons(result),
			...this.generatorAddedDebuffIcons(result)
		].filter((iconIndex) => iconIndex > 1)
	}

	Sprite_Battler.prototype.addedStateIcons = function (result) {
		return result.addedStateObjects().map((state) => state.iconIndex)
	}

	Sprite_Battler.prototype.generatorAddedBuffIcons = function* (result) {
		for (const paramId of result.addedBuffs) {
			const level = result.getAffectedBuffLevel(paramId)
			yield this._battler.buffIconIndex(level, paramId)
		}
	}

	Sprite_Battler.prototype.generatorAddedDebuffIcons = function* (result) {
		for (const paramId of result.addedDebuffs) {
			const level = result.getAffectedBuffLevel(paramId)
			yield this._battler.buffIconIndex(level, paramId)
		}
	}

	Sprite_Battler.prototype.removedPopupStateIcons = function (result) {
		return [
			...this.removedStateIcons(result),
			...this.generatorRemovedBuffIcons(result),
			...this.generatorRemovedDebuffIcons(result)
		].filter((iconIndex) => iconIndex > 1)
	}

	Sprite_Battler.prototype.removedStateIcons = function (result) {
		return result.removedStateObjects().map((state) => state.iconIndex)
	}

	Sprite_Battler.prototype.generatorRemovedBuffIcons = function* (result) {
		for (const paramId of result.removedBuffs) {
			const level = result.getAffectedBuffLevel(paramId)
			yield this._battler.buffIconIndex(level, paramId)
		}
	}

	Sprite_Battler.prototype.generatorRemovedDebuffIcons = function* (result) {
		for (const paramId of result.removedDebuffs) {
			const level = result.getAffectedBuffLevel(paramId)
			yield this._battler.buffIconIndex(level, paramId)
		}
	}

	Sprite_Battler.prototype.createPopupStateSprite = function (iconIndex, type) {
		const last = this._popupStates[this._popupStates.length - 1]
		const sprite = new Sprite_PopupState()
		const offsetY = Math.min(this.stateOffsetY(), this.y - 20)
		const delay = last ? last.delay + param_IntervalTime : 0
		sprite.move(this.x, this.y - offsetY)
		sprite.setup(iconIndex, type, delay)
		sprite.pseudo3dAltitude = () => offsetY
		this._popupStates.push(sprite)
		this.parent.addChild(sprite)
	}

	Sprite_Battler.prototype.destroyTopPopupStateSprite = function () {
		const sprite = this._popupStates.shift()
		if (sprite) {
			this.parent.removeChild(sprite)
			sprite.destroy()
		}
	}

	Sprite_Battler.prototype.stateOffsetY = function () {
		if (this.mainSprite) {
			return this.mainSprite().height
		} else {
			return this._effectTarget.height
		}
	}

	//-------------------------------------------------------------------------
	// Sprite_Actor

	Sprite_Actor.prototype.isPopupState = function () {
		return Sprite_Battler.prototype.isPopupState.call(this) && param_PopupToActor
	}

	//-------------------------------------------------------------------------
	// Sprite_Enemy

	Sprite_Enemy.prototype.isPopupState = function () {
		return Sprite_Battler.prototype.isPopupState.call(this) && param_PopupToEnemy
	}

	Sprite_Enemy.prototype.stateOffsetY = function () {
		return Math.round((this.bitmap.height + 40) * 0.9)
	}

	//-------------------------------------------------------------------------
	// Sprite_PopupState

	class Sprite_PopupState extends Sprite {
		constructor() {
			super()
			this.bitmap = ImageManager.loadSystem('IconSet')
			this.setFrame(0, 0, 0, 0)
			this.anchor.x = 0.5
			this.anchor.y = 0.5
			this.visible = false
			this._iconIndex = 0
			this._duration = 0
			this._popupType = null
			this._delay = 0
			this._flashColor = [0, 0, 0, 0]
		}

		get delay() {
			return this._delay
		}

		setup(iconIndex, type, delay) {
			this._iconIndex = iconIndex
			this._popupType = type
			this._delay = delay
			if (type === 'added') {
				this._duration = param_AddedTime + 15
				this._flashColor = [255, 255, 255, 255]
			} else {
				this._duration = param_RemovedTime + 40
				this._flashColor = [0, 0, 0, 0]
			}
		}

		update() {
			super.update()
			if (!this.updateDelay()) {
				this.updateMove()
				this.updateFlash()
				this.updateFrame()
				this.visible = true
			}
		}

		updateDelay() {
			if (this._delay > 0) {
				this._delay--
				return true
			}
			return false
		}

		updateMove() {
			if (this._duration > 0) {
				if (this._popupType === 'added') {
					this.updateAddedMove()
				} else {
					this.updateRemovedMove()
				}
				this._duration--
			}
		}

		updateAddedMove() {
			const d = this._duration
			const base = param_AddedTime
			if (d > base) {
				const radian = ((d - base) * Math.PI) / 30
				this.scale.x = Math.cos(radian)
				this.anchor.y = 0.5 - (d - base) / base
			} else {
				this.scale.x = 1
				this.anchor.y = 0.5
			}
		}

		updateRemovedMove() {
			const d = this._duration
			const base = param_RemovedTime
			if (d < 40) {
				this.anchor.y = d / 40 - 0.5
				this.blendMode = 1
				this.opacity = (255 * d) / 40
			}
		}

		updateFlash() {
			if (this._flashColor[3] > 0) {
				this._flashColor[3] = Math.max(this._flashColor[3] - 10, 0)
				this.setBlendColor(this._flashColor)
			}
		}

		updateFrame() {
			const pw = ImageManager.iconWidth || Window_Base._iconWidth
			const ph = ImageManager.iconHeight || Window_Base._iconHeight
			const sx = (this._iconIndex % 16) * pw
			const sy = Math.floor(this._iconIndex / 16) * ph
			this.setFrame(sx, sy, pw, ph)
		}

		isPlaying() {
			return this._duration > 0
		}
	}
})()
