// EnemyPlacementEx.js Ver.1.0.0
// MIT License (C) 2023 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
 * @target MZ
 * @plugindesc 敵キャラの配置を拡張します。
 * @author あわやまたな (Awaya_Matana)
 * @url https://awaya3ji.seesaa.net/
 * @help 【使い方】
 * (1) [パラメータ]を設定します。
 * (2) [データベース]-[システム2]の[UIエリアの幅][UIエリアの高さ]の数値を
 * 大きくします。
 * (3) 敵キャラの配置範囲が広がります。
 *
 * 【仕様】
 * 敵キャラの配置範囲はエディタで厳しく制限されています。
 * またその範囲は、システム2の[UIエリアの幅][UIエリアの高さ]に依存しています。
 *
 * よってこのプラグインは[システム2]ではなく、[パラメータ]のUIエリアをゲーム上に
 * 反映します。
 * つまり、[システム2]のUIエリアは敵キャラの配置範囲を指定する為だけの設定値に
 * なります。
 *
 * [更新履歴]
 * 2023/02/06：Ver.1.0.0　公開。
 *
 * @param uiAreaWidth
 * @text UIエリアの幅
 * @desc -1：エディタの数値を使用。
 * @type number
 * @min -1
 * @default 816
 *
 * @param uiAreaHeight
 * @text UIエリアの幅
 * @desc -1：エディタの数値を使用。
 * @type number
 * @min -1
 * @default 624
 */

'use strict'
{
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]
	const parameters = PluginManager.parameters(pluginName)
	const uiAreaWidth = Number(parameters['uiAreaWidth'])
	const uiAreaHeight = Number(parameters['uiAreaHeight'])

	const _Scene_Boot_adjustBoxSize = Scene_Boot.prototype.adjustBoxSize
	Scene_Boot.prototype.adjustBoxSize = function () {
		if (uiAreaWidth > -1) {
			$dataSystem.advanced.uiAreaWidth = uiAreaWidth
		}
		if (uiAreaHeight > -1) {
			$dataSystem.advanced.uiAreaHeight = uiAreaHeight
		}
		_Scene_Boot_adjustBoxSize.call(this)
	}
}
