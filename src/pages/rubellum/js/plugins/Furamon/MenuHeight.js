/*:
 * @plugindesc メニュー項目の文字サイズと間隔を調整
 * @target MZ
 * @author Furamon
 * @help メニュー画面の各項目の高さを変える
 *
 * @param commandSpacing
 * @text メニュー項目の間隔
 * @desc デフォルトの間隔からどれだけ変えるか。デフォルトは40。少数可（第2位まで）
 * @type number
 * @default 0
 * @decimals 2
 * @min -1000
 */

;(() => {
	'use strict'

	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]
	const params = PluginManager.parameters(pluginName)

	Window_Base.prototype.lineHeight = function () {
		return $gameSystem.mainFontSize() + 10 + parseFloat(params.commandSpacing)
	}

	Window_Selectable.prototype.lineHeight = function () {
		return $gameSystem.mainFontSize() + 10 + parseFloat(params.commandSpacing)
	}
})()
