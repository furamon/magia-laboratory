//=============================================================================
//  Keke_SpeedStarBattlePatch - スピードスターバトルパッチ
// バージョン: 1.0.1
//=============================================================================
// Copyright (c) 2022 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MV
 * @plugindesc スピードスターバトルのバグ対策パッチ
 * @author ケケー
 * @url https://kekeelabo.com
 * z
 * @help
 * 【ver.1.0.1】
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 */

;(() => {
	//- プラグイン名
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]

	const _Scene_Battle_updateBattleProcess = Scene_Battle.prototype.updateBattleProcess
	Scene_Battle.prototype.updateBattleProcess = function () {
		_Scene_Battle_updateBattleProcess.apply(this)
		if (this.isAnyInputWindowActive()) {
			const inputActor = this._actorCommandWindow._actor
			if (inputActor && !inputActor.canInput()) {
				this.selectNextCommand()
				this._partyCommandWindow.active = false
				this._actorCommandWindow.active = false
				this._skillWindow.active = false
				this._itemWindow.active = false
				this._actorWindow.active = false
				this._enemyWindow.active = false
			}
		}
	}
})()
