//=============================================================================
// SkillDamageFuramon.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc ダメージ計算式
 * @author Furamon
 *
 * @help 計算式用
 *
 * @param weekVal
 * @text 弱点しきい値
 * @desc 防御無視する属性有効度のしきい値
 * @default 150
 * @type number
 */

/**
 * 物理攻撃
 * power: スキル威力 a: 行動主体 b: 行動対象 s: スキルデータ
 */

function physicalAttack(power, a, b, s) {
	// 変数写し
	let weapon = a.atk // 武器威力
	let atk = a.mat
	let def = b.def
	let level = a.level
	let weekVal = PluginManager.parameters('SkillDamageFuramon')['weekVal']

	// 弱点属性をついたなら
	if (s.calcElementRate(b) * 100 >= weekVal) {
		def = 0 // 防御無視
	}

	const damage = Math.floor(
		Math.max((power * (weapon + 6)) / 40 - def * 4, 0) * ((atk * level) / 120 + 2)
	)
	return damage
}

/**
 * 魔法攻撃
 * a: 行動主体 b: 行動対象 s: スキルデータ
 */
function magicalAttack(power, a, b, s) {
	// 変数写し
	let weapon = a.atk // 武器威力
	let atk = a.mat
	let def = b.mdf
	let level = a.level
	let weekVal = PluginManager.parameters('SkillDamageFuramon')['weekVal']

	// 弱点属性をついたなら
	if (s.calcElementRate(b) * 100 >= weekVal) {
		def = 0 // 防御無視
	}

	const damage = Math.floor(
		Math.max((power * (weapon + 6)) / 40 - def * 4, 0) * ((atk * level) / 120 + 2)
	)
	return damage
}
