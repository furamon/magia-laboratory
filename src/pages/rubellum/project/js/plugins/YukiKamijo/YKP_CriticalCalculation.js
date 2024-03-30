//=============================================================================
// YKP_CriticalCalculation.js
//
// Copyright (c) 2021 YukiKamijo
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

var Imported = Imported || {}
Imported.YKP_CriticalCalculation = true

var YukiKP = YukiKP || {}
YukiKP.CriticalCalculation = YukiKP.CriticalCalculation || {}

/*:
 * @plugindescクリティカルの発生率とダメージ倍率を変更するプラグイン。
 * @target MZ
 * @author YukiKamijo
 *
 * @param criticalDamageRate
 * @text クリティカルダメージ倍率
 * @desc クリティカル発生時のダメージ倍率を設定します。
 * @type number
 * @decimals 1
 * @default 3.0
 *
 * @param addCriticalTarget
 * @text 会心率加算の対象範囲
 * @desc 会心率を加算補正するデータを設定します。
 * @default 1
 * @type select
 * @option 加算しない
 * @value 0
 * @option 全てのスキル
 * @value 1
 * @option 特定のスキル
 * @value 2
 * @option 一部補正変更
 * @value 3
 *
 * @param addCriticalParam
 * @text 会心率加算補正
 * @desc 会心率を加算補正するデータを設定します。
 * @type string
 * @default a.luk / 10
 *
 * @help YKP_CriticalCalculation.js
 *
 * クリティカルの発生率とダメージ倍率を変更するプラグインです。
 *
 * 会心率に特定の数値を加算したり、クリティカルダメージの倍率を変更できます。
 *
 * 会心率の加算について
 *  加算するには、addCriticalTargetで「加算しない」以外を選択しておきます。
 *  会心率の加算は戦闘中のスキルに反映されるため、ステータス画面からは確認できません。
 *  スキル計算式同様の入力が可能となっており、a.atkと入力すると使用者の攻撃力分だけ会心率が上昇します。
 *
 *  「全てのスキル」に加算する場合は、addCriticalParamの値が自動的に反映されます。
 *
 *  「特定のスキル」に加算する場合は、加算したいスキルのメモ欄に<AddCri:xxxxxxx>と記述します。
 *  xxxxxxxの部分が加算補正する値になります。（省略するとaddCriticalParamの値）
 *
 *  「一部補正変更」に加算する場合は、メモ欄に<AddCri:xxxxxxx>の記載がない場合のみ、
 *  addCriticalParamの値が自動的に反映されます。
 *
 * パラメータ設定の説明。
 * criticalDamageRate     : クリティカルダメージ倍率
 * addCriticalTarget      : 会心率加算の対象範囲
 * addCriticalParam       : 会心率加算補正
 *
 *
 * plugin version 1.1.0
 *
 * ver 1.1.0 : コア1.5.0のアップデートによって
 *             動作しなくなっていた問題を修正。
 */

;(() => {
	'use strict'
	const pluginName = 'YKP_CriticalCalculation'

	// 初期パラメータ設定
	const parameters = PluginManager.parameters(pluginName)
	const criticalDamageRate = Number(parameters['criticalDamageRate'])
	const addCriticalTarget = parameters['addCriticalTarget']
	const addCriticalParam = parameters['addCriticalParam']

	// クリティカルダメージの倍率を設定
	// =============================================================================================
	YukiKP.CriticalCalculation.Game_Action_applyCritical = Game_Action.prototype.applyCritical
	Game_Action.prototype.applyCritical = function (damage) {
		return Math.floor(damage * criticalDamageRate)
	}
	// =============================================================================================

	// 会心率に数値を加算する
	// =============================================================================================
	YukiKP.CriticalCalculation.itemCri = function (item) {
		if (!!item.meta['AddCri']) {
			return item.meta['AddCri']
		}
		return 0
	}

	YukiKP.CriticalCalculation.convartTarget = function (text) {
		let result = ''
		const paramList = text.split('.')

		for (const param of paramList) {
			const target = param.slice(-1)
			if (target === 'a') {
				result = result + 'this.subject().'
				result = result + param.slice(0, -1)
			} else if (target === 'b') {
				result = result + 'target.'
				result = result + param.slice(0, -1)
			} else {
				result = result + param
			}
		}
		return result
	}

	YukiKP.CriticalCalculation.Game_Action_itemCri = Game_Action.prototype.itemCri
	Game_Action.prototype.itemCri = function (target) {
		const critical = YukiKP.CriticalCalculation.Game_Action_itemCri.call(this, target)
		if (critical === 0) return critical

		const item = this.item()
		let correction = 0

		switch (addCriticalTarget) {
			case '0':
				break
			case '1':
				correction = eval(YukiKP.CriticalCalculation.convartTarget(addCriticalParam)) / 100
				break
			case '2':
				correction =
					eval(YukiKP.CriticalCalculation.convartTarget(YukiKP.CriticalCalculation.itemCri(item))) /
					100
				break
			case '3':
				correction =
					YukiKP.CriticalCalculation.itemCri(item) !== 0
						? eval(
								YukiKP.CriticalCalculation.convartTarget(YukiKP.CriticalCalculation.itemCri(item))
							) / 100
						: eval(YukiKP.CriticalCalculation.convartTarget(addCriticalParam)) / 100
				break
		}
		return critical + correction
	}
	// =============================================================================================
})()
