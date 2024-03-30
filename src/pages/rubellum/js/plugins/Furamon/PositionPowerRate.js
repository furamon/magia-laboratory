/*:ja
 * @target MZ
 * @plugindesc アクターの並び順で与えるダメージを変える
 * @author Furamon
 * @license MIT
 *
 *
 * @param attackDamageRate
 * @desc 与えるダメージ倍率。先頭から順に並び順対応。2つ目以降に指定がなければ最後の値。
 * @type number[]
 * @text 与えるダメージ倍率
 * @default ["100"]
 *
 * @help
 * version: 1.0.0
 * バトルアクターが先頭から何番目かで与えるダメージを変えます。
 * スキルのメモ欄に<PositionIgnore>と入力するとこれを無視したスキルを使うことができます。
 *
 * Thanks to DarkPlasma!（https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_PositionDamageRate.js）
 */

;(() => {
	'use strict'

	const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
		return arguments[1]
	})

	// パラメータ取得はDarkPlasma様のプラグイン参考
	const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName)

	const pluginParameters = pluginParametersOf(pluginName)

	const settings = {
		attackDamageRate: JSON.parse(pluginParameters.attackDamageRate || '["100"]').map((e) => {
			return Number(e || 0)
		})
	}

	// 最終ダメージそのものを変える
	const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue
	Game_Action.prototype.makeDamageValue = function () {
		if (BattleManager._action) {
			const item = BattleManager._action.item()
			if (item.meta.PositionIgnore === true) {
				return _Game_Action_makeDamageValue.apply(this, arguments)
			} else {
				return Math.round(
					_Game_Action_makeDamageValue.apply(this, arguments) * this.matRateByPosition()
				)
			}
		}
	}

	Game_Action.prototype.matRateByPosition = function () {
		// 行動主体が敵なら無条件で1
		if (this.subject().isEnemy()) return 1
		// 並び順を取得
		const actors = $gameParty.members()
		const index = actors.findIndex((a) => a.actorId() === this.subject().actorId())
		return (
			(settings.attackDamageRate.length > index
				? settings.attackDamageRate[index]
				: settings.attackDamageRate[settings.attackDamageRate.length - 1]) / 100
		)
	}
})()
