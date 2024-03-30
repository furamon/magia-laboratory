// ===================================================
// ARTM_SkillTypelessMenuMZ
// Copyright (c) 2021 Artemis
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
// ===================================================
// [Version]
// 1.0.0 初版
// =============================================================================
/*:ja
 * @target MZ
 * @plugindesc スキルタイプメニューを省略するMZ専用プラグイン
 * @author Artemis
 *
 * @help ARTM_SkillTypelessMenuMZ.js
 * スキルタイプメニューを省略するプラグインです。
 * ※スキルタイプは必ず1つに限定して下さい。
 *
 * プラグインコマンドはありません。
 *
 */

;(() => {
	const PLUGIN_NAME = 'ARTM_SkillTypelessMenuMZ'

	const _Scene_Skill_start = Scene_Skill.prototype.start
	Scene_Skill.prototype.start = function () {
		_Scene_Skill_start.call(this)
		this.activateEx()
		this._itemWindow.activate()
		this._itemWindow.selectLast()
	}

	Scene_Skill.prototype.createSkillTypeWindow = function () {
		return
	}

	// *overridable
	Scene_Skill.prototype.createItemWindow = function () {
		const rect = this.itemWindowRect()
		this._itemWindow = new Window_SkillList(rect)
		this._itemWindow.setHelpWindow(this._helpWindow)
		this._itemWindow.setHandler('ok', this.onItemOk.bind(this))
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this))
		this.addWindow(this._itemWindow)
	}

	// *overridable
	Scene_Skill.prototype.statusWindowRect = function () {
		const ww = Graphics.boxWidth - this.mainCommandWidth()
		const wh = this.skillTypeWindowRect().height
		const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww
		const wy = this.mainAreaTop()
		return new Rectangle(wx, wy, ww, wh)
	}

	// *overridable
	Scene_Skill.prototype.refreshActor = function () {
		const actor = this.actor()
		this._statusWindow.setActor(actor)
		this._itemWindow.setActor(actor)
	}

	const _Scene_Skill_onItemCancel = Scene_Skill.prototype.onItemCancel
	Scene_Skill.prototype.onItemCancel = function () {
		this._itemWindow.deselect()
		this.popScene()
	}

	// *overridable
	Scene_Skill.prototype.onActorChange = function () {
		Scene_MenuBase.prototype.onActorChange.call(this)
		this.refreshActor()
		this.activateEx()
		this._itemWindow.activate()
		this._itemWindow.selectLast()
	}

	Scene_Skill.prototype.activateEx = function () {
		const skillType = this.actor().skillTypes()[0]
		if (this._itemWindow) {
			this._itemWindow.setStypeId(skillType)
		}
	}
})()
