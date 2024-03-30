//=============================================================================
// MPP_MessageEX_Op2.js
//=============================================================================
// Copyright (c) 2022 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add a fade-out type.
 * @url
 *
 * @base MPP_MessageEX
 * @orderAfter MPP_MessageEX
 *
 * @help [version 1.0.0]
 * - This plugin is for RPG Maker MZ.
 * - Add a fade-out type.
 *
 * ▼ fade-out type 4
 *  - Displays the new text as a continuation of the previous text.
 *  - MPP_MessageEX_Op1 is required to use this type.
 *  - Since special processing is performed, the display may be strange when used
 *    in combination with other message plugins.
 *  - If a conflict occurs, we can hardly handle it.
 *
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠ is half-width)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 *
 */

/*:ja
 * @target MZ
 * @plugindesc フェードアウトタイプを追加します。
 * @url
 *
 * @base MPP_MessageEX
 * @orderAfter MPP_MessageEX
 *
 * @help [version 1.0.0]
 * - このプラグインはRPGツクールMZ用です。
 * - フェードアウトタイプを追加します。
 *
 * ▼ フェードアウトタイプ 4
 *  - 新しい文章を前の文章の続きに表示します。
 *  - 顔グラフィックを使用する場合、 MPP_MessageEX_Op1 が必要です。
 *  - 特殊な処理を行っているため、他のメッセージ系プラグインと併用すると
 *    表示がおかしくなる可能性があります。
 *  - 競合が発生した場合、対応はほぼ出来ません。
 *
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 *
 */

;(() => {
	'use strict'

	const pluginName = 'MPP_MessageEX_Op3'

	// Dealing with other plugins
	const __base = (obj, prop) => {
		if (obj.hasOwnProperty(prop)) {
			return obj[prop]
		} else {
			const proto = Object.getPrototypeOf(obj)
			return function () {
				return proto[prop].apply(this, arguments)
			}
		}
	}

	//-------------------------------------------------------------------------
	// Window_Message

	const _Window_Message_initialize = Window_Message.prototype.initialize
	Window_Message.prototype.initialize = function () {
		_Window_Message_initialize.apply(this, arguments)
		this.createAccumulatedSprite()
	}

	const _Window_Message_destroyContents = __base(Window_Message.prototype, 'destroyContents')
	Window_Message.prototype.destroyContents = function () {
		if (this._accumulatedSprite && this._accumulatedSprite.bitmap) {
			this._accumulatedSprite.bitmap.destroy()
		}
		_Window_Message_destroyContents.apply(this, arguments)
	}

	Window_Message.prototype.createAccumulatedSprite = function () {
		this._accumulatedSprite = new Sprite()
		this._accumulatedSprite.anchor.y = 1
		this.addInnerChild(this._accumulatedSprite)
		this.createAccumulatedBitmap()
	}

	Window_Message.prototype.createAccumulatedBitmap = function () {
		if (this._accumulatedSprite.bitmap) {
			this._accumulatedSprite.bitmap.destroy()
		}
		this._accumulatedSprite.bitmap = new Bitmap(this.contentsWidth(), this.contentsHeight())
	}

	const _Window_Message_initMembers = Window_Message.prototype.initMembers
	Window_Message.prototype.initMembers = function () {
		_Window_Message_initMembers.apply(this, arguments)
		this._accumulateY = 0
		this._accumulateLine = false
	}

	const _Window_Message_newPage = Window_Message.prototype.newPage
	Window_Message.prototype.newPage = function (textState) {
		if (this._fadeOutType === 4 && this.isOpen()) {
			const height = this._lastBottomY + this._accumulateY
			if (height > 0) {
				const lby = this._lastBottomY
				const bitmap = this._accumulatedSprite.bitmap
				const context = bitmap.context
				context.globalCompositeOperation = 'copy'
				context.drawImage(bitmap.canvas, 0, -lby)
				context.globalCompositeOperation = 'source-over'
				context.drawImage(this.contents.canvas, 0, bitmap.height - lby)
				bitmap.baseTexture.update()
				this._accumulateY = height
			}
		} else {
			this._accumulateY = 0
		}
		_Window_Message_newPage.apply(this, arguments)
		this.origin.y = -this._accumulateY
	}

	// overwrite MPP_MessageEX
	Window_Message.prototype.updateCharacterContainer = function () {
		if (this._characterContainer) {
			const pad = this._padding
			this._characterContainer.move(pad, pad + this._accumulateY)
		}
	}

	const _Window_Message_startMessage = Window_Message.prototype.startMessage
	Window_Message.prototype.startMessage = function () {
		_Window_Message_startMessage.apply(this, arguments)
		if (this._accumulatedSprite.bitmap.height !== this.contentsHeight()) {
			this.createAccumulatedBitmap()
		}
	}

	const _Window_Message_processCharacter = __base(Window_Message.prototype, 'processCharacter')
	Window_Message.prototype.processCharacter = function (textState) {
		this.accumulateLine(textState)
		if (!this._accumulateLine) {
			_Window_Message_processCharacter.apply(this, arguments)
		}
	}

	Window_Message.prototype.accumulateLine = function (textState) {
		if (
			this._fadeOutType === 4 &&
			this._accumulateY + textState.y + textState.height > this.contents.height
		) {
			this._accumulateLine = true
		}
	}

	const _Window_Message_updateWait = Window_Message.prototype.updateWait
	Window_Message.prototype.updateWait = function () {
		return _Window_Message_updateWait.apply(this, arguments) || this.updateAccumulation()
	}

	Window_Message.prototype.updateAccumulation = function () {
		if (this._textState && this._accumulateLine) {
			const targetY = this.contents.height - this._textState.y - this._textState.height
			this._accumulateY = Math.max(this._accumulateY - 4, targetY)
			this.origin.y = -this._accumulateY
			this._accumulateLine = this._accumulateY !== targetY
			return true
		}
		return false
	}

	const _Window_Message_isWaiting = Window_Message.prototype.isWaiting
	Window_Message.prototype.isWaiting = function () {
		return _Window_Message_isWaiting.apply(this, arguments) || this._accumulateLine
	}
})()
