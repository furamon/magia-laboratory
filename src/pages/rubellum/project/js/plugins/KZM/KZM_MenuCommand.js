/*
 * ----------------------------------------------------
 * Copyright (c) 有栖かずみ / Arisu Kazumi
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * ----------------------------------------------------
 */

/*:
 * @plugindesc メニュー項目の文字サイズと間隔を調整
 * @target MZ
 * @author 有栖かずみ / Arisu Kazumi
 * @url https://a-kazumi.com/plugins
 * @help メニュー画面の各項目の間隔を変更できます。
 *
 * 2024/02/18 ver1.0.3 URL表記を変更。文字コードをUTF-8のBOM付きに変更。プログラムは変更なし
 * 2024/02/06 ver1.0.2 公開用にきちんとした書き方に修正
 * 2023/10/22 ver1.0.1 ファイル名をKZM_MenuCommand.jsに変更
 * 2023/03/10 ver1.0.0 作成
 *
 * @param commandFontSize
 * @text メニュー項目の文字サイズ
 * @desc デフォルトの文字サイズからどれだけ変更するか、数値を入力してください（小数第2位まで、0未満も可能）。
 * @type number
 * @default 0
 * @decimals 2
 * @min -1000
 *
 * @param commandSpacing
 * @text メニュー項目の間隔
 * @desc デフォルトの間隔からどれだけ変更するか、数値を入力してください（小数第2位まで、0未満も可能）。
 * @type number
 * @default 0
 * @decimals 2
 * @min -1000
 */

;(() => {
	'use strict'

	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]
	const params = PluginManager.parameters(pluginName)

	Window_MenuCommand.prototype.resetFontSettings = function () {
		this.contents.fontFace = $gameSystem.mainFontFace()
		this.contents.fontSize = $gameSystem.mainFontSize() + parseFloat(params.commandFontSize)
		this.resetTextColor()
	}

	Window_MenuCommand.prototype.lineHeight = function () {
		return $gameSystem.mainFontSize() + 10 + parseFloat(params.commandSpacing)
	}
})()
