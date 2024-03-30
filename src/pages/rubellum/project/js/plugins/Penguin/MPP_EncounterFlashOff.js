//=============================================================================
// MPP_EncounterFlashOff.js
//=============================================================================
// Copyright (c) 2023 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc Turns the flash effect of the encounter effect on/off.
 * @author Mokusei Penguin
 * @url
 *
 * @help [version 1.0.0]
 * - This plugin is for RPG Maker MV and MZ.
 * - Turns the flash effect of the encounter effect on/off.
 * - This flag is not included in save data.
 *
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠ is half-width)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 *
 *  @command encounterFlash
 *      @desc
 *      @arg boolean
 *          @desc
 *          @type boolean
 *          @default true
 *
 *
 *  @param Default
 *      @desc
 *      @type boolean
 *      @default true
 *
 */

/*:ja
 * @target MV MZ
 * @plugindesc 戦闘開始エフェクトのフラッシュ効果をON/OFFします。
 * @author 木星ペンギン
 * @url
 *
 * @help [version 1.0.0]
 * - このプラグインはRPGツクールMVおよびMZ用です。
 * - 戦闘開始エフェクトのフラッシュ効果をON/OFFします。
 * - このフラグはセーブデータに含まれません。
 *
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 *
 *  @command encounterFlash
 *      @text エンカウントフラッシュ
 *      @desc
 *      @arg boolean
 *          @text 許可/禁止
 *          @desc
 *          @type boolean
 *          @default true
 *
 *
 *  @param Default
 *      @text 初期値
 *      @desc
 *      @type boolean
 *      @default true
 *
 */

;(() => {
	'use strict'

	const pluginName = 'MPP_EncounterFlashOff'

	// Plugin Parameters
	const parameters = PluginManager.parameters(pluginName)
	const param_Default = parameters['Default'] === 'true'

	let temp_encounterFlash = param_Default

	//-------------------------------------------------------------------------
	// Game_Temp

	const _Game_Temp_initialize = Game_Temp.prototype.initialize
	Game_Temp.prototype.initialize = function () {
		_Game_Temp_initialize.apply(this, arguments)
		temp_encounterFlash = param_Default
	}

	//-------------------------------------------------------------------------
	// Game_Interpreter

	const _mzCommands = {
		EncounterFlash: { name: 'encounterFlash', keys: ['boolean'] }
	}
	Object.assign(_mzCommands, {
		エンカウントフラッシュ: _mzCommands.EncounterFlash
	})

	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments)
		const mzCommand = _mzCommands[command]
		if (mzCommand) {
			const args2 = Object.assign({}, ...mzCommand.keys.map((k, i) => ({ [k]: args[i] })))
			PluginManager.callCommandMV(this, pluginName, mzCommand.name, args2)
		}
	}

	//-------------------------------------------------------------------------
	// PluginManager

	if (!PluginManager.registerCommand && !PluginManager._commandsMV) {
		PluginManager._commandsMV = {}

		PluginManager.registerCommandMV = function (pluginName, commandName, func) {
			const key = pluginName + ':' + commandName
			this._commandsMV[key] = func
		}

		PluginManager.callCommandMV = function (self, pluginName, commandName, args) {
			const key = pluginName + ':' + commandName
			const func = this._commandsMV[key]
			if (typeof func === 'function') {
				func.bind(self)(args)
			}
		}
	}

	const _registerCommandName = PluginManager.registerCommand
		? 'registerCommand'
		: 'registerCommandMV'

	PluginManager[_registerCommandName](pluginName, 'encounterFlash', (args) => {
		temp_encounterFlash = args.boolean === 'true'
	})

	//-------------------------------------------------------------------------
	// Scene_Map

	const _Scene_Map_startFlashForEncounter = Scene_Map.prototype.startFlashForEncounter
	Scene_Map.prototype.startFlashForEncounter = function (duration) {
		if (temp_encounterFlash) {
			_Scene_Map_startFlashForEncounter.apply(this, arguments)
		}
	}
})()
