//=============================================================================
//  Keke_WeaponPower - 武器威力
// バージョン: 1.1.5
//=============================================================================
// Copyright (c) 2021 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc パラメータ『武器威力』を増設する
 * @author ケケー
 * @url https://kekeelabo.com
 *
 * @help
 * 【ver.1.1.5】
 * パラメータ『武器威力』を増設する
 * ◎武器威力を独立して存在させ、ダメージ計算の幅を広げられる
 * ◎武器タイプ別に武器威力を設定できる
 * 　剣の威力、弓の威力など
 *
 *
 * ● 使い方 ●
 *
 * ■【1】武器威力を設定する
 * => 装備、アクター、職業、スキル、アイテム、敵キャラ、ステート のメモ欄に
 * 　<武器威力: 威力, 武器タイプ名>
 * 例)
 * <武器威力: 10>
 * 　装備中の武器の武器威力を 10 加算
 * <武器威力: 10, 剣>
 * 　武器タイプ『剣』の武器威力を 10 加算
 *　 ※あらかじめ武器タイプ『剣』を作っておくこと
 * <武器威力: 10, 剣, 弓>
 * 　武器タイプ『剣』『弓』の武器威力を 10 加算
 * <武器威力: 10, 全>
 * 　全ての武器タイプの武器威力を 10 加算
 * <武器威力: -10>
 * 　武器威力を 10 減算
 * <武器威力: *1.2>
 * 　武器威力を 1.2 倍
 * <武器威力: /2>
 * 　武器威力を 1/2 倍
 * ◎武器威力というが、武器以外にも防具やステート等あらゆる項目に設定できる
 * ◎武器タイプを設定しない場合は、装備中の武器の武器威力を上げる
 * ◎武器タイプが『全』の場合、全ての武器タイプの武器威力を上げる
 *
 *
 * ■【2】スキルのダメージ計算式から武器威力を参照する
 * => スキル/アイテム → ダメージ → 計算式
 * 　a.wpn
 * 防御側の場合は
 * 　b.wpn
 * 例)
 * a.atk * a.wpn - b.def
 * 　使い手の攻撃力と武器威力を掛ける計算式
 *
 *
 * ■【3】スキルの使用武器を設定する
 * スキル/アイテムのメモ欄に
 * 　<使用武器: 武器タイプ名>
 * 例)
 * <使用武器: 剣>
 * 　武器タイプ『剣』の武器威力を反映する
 * <使用武器: 剣, 弓>
 * 　武器タイプ『剣』『弓』の武器威力を反映する
 * <使用武器: 全>
 * 　全ての武器威力を反映する
 * ◎使用武器を設定しなかった場合は、装備中の武器が使用武器となる
 *
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 *
 *
 * Increase the parameter "weapon power"
 * ◎ Weapon power exists independently,
 *   expanding the range of damage calculation
 * ◎ Weapon power can be set for each weapon type
 *   Sword power, bow power, etc.
 *
 *
 * ● How to use ●
 *
 * ■【1】Set Weapon Power
 * => In the memo column of Equipment, Actor, Class, Skill, Item,
 *   Enemy Character, State
 * <WeaponPower: Power, Weapon Type Name>
 * example)
 * <WeaponPower: 10>
 *   Add 10 to Weapon Power of Weapon Type "None"
 * <WeaponPower: 10, Sword>
 *   Add 10 to Weapon Power of weapon type "Sword"
 *   ※ Create a weapon type "sword" in advance
 * <WeaponPower: 10, Sword, Bow>
 *   Add 10 to weapon power of weapon type "sword" and "bow"
 * <WeaponPower: 10, All>
 *   Adds 10 to weapon power for all weapon types
 * <WeaponPower: -10>
 *   Decrease weapon power by 10
 * <WeaponPower: *1.2>
 *   Increase weapon power by 1.2 times
 * <WeaponPower: /2>
 *   1/2 times weapon power
 * ◎ Weapon power can be set for all items other than weapons.
 * ◎ If you do not set a weapon type, the weapon type will be "None".
 *   Weapon power is reflected in the "none" weapon used skill
 * ◎ If the weapon type is "Sword",
 *   Reflect weapon power on skills that have "sword" as the weapon used
 * ◎ If the weapon type is "all", it corresponds to all skills
 *
 *
 * ■ [2] Refer to weapon power from skill
 * => Skill/Item → Damage → Formula
 *   a.wpn
 * for defenders
 *   b.wpn
 * example)
 *   a.atk * a.wpn - b.def
 *   Formula for multiplying user's attack power and weapon power
 *
 *
 * ■ [3] Set the weapon used for the skill
 * In the skill/item memo field
 * <useWeapon: Weapon type name>
 * example)
 * <useWeapon: Sword>
 *   Reflects the weapon power of the weapon type "sword"
 * <useWeapon: Sword, Bow>
 *   Reflects the weapon power of the weapon type "sword" and "bow"
 * <useWeapon: All>
 *   Reflects all weapon power
 * ◎ If you do not set a weapon to use, the weapon to use will be "none".
 *   Reflects weapon power of weapon type "none"
 *
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 */

;(() => {
	//- プラグイン名
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]

	//==================================================
	//--  武器威力
	//==================================================

	//- プロパティ定義
	Object.defineProperties(Game_BattlerBase.prototype, {
		wpn: {
			get() {
				return getWeaponPower(this)
			},
			configurable: true
		}
	})

	// アクションを保存
	let action = null
	const _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula
	Game_Action.prototype.evalDamageFormula = function (target) {
		action = this
		return _Game_Action_evalDamageFormula.call(this, target)
	}

	// 武器威力の取得
	function getWeaponPower(battler) {
		const item = action.item()
		let useWeapons = []
		// スキルから使用武器を取得
		metaAll(item.note, ['使用武器', 'useWeapon']).forEach((wtypeName) => {
			useWeapons.push(wtypeName)
		})
		// 装備中の武器を取得
		let equipWeapons = []
		if (battler._actorId) {
			battler.equips().forEach((equip) => {
				if (equip && equip.wtypeId) {
					equipWeapons.push($dataSystem.weaponTypes[equip.wtypeId])
				}
			})
			// 敵の場合は全装備扱い
		} else {
			equipWeapons = ['全']
		}
		// スキルの使用武器がない場合は装備中の最初の武器を使用武器とする
		if (!useWeapons.length) {
			useWeapons = [equipWeapons[0]]
		}
		// メモ欄から武器威力のメタ配列を取得
		const array = totalAllMetaArray(battler, ['武器威力', 'weaponAtk'], action)
		// メタ配列を合算
		let pow = 0
		let rate = 1
		array.forEach((e) => {
			if (!e) {
				return
			}
			const es = e.replace(/\s/g, '').split(',')
			// 威力値
			let val = es[0]
			// 増幅武器
			let ampWeapons = es.splice(1)
			// 増幅武器がなければ装備中の武器を対象に
			if (!ampWeapons.length) {
				ampWeapons = equipWeapons
			}
			// 増幅武器が使用武器と適合するか判定
			let ok = false
			if (
				ampWeapons.some((t) => t.match(/^(全|all)$/)) ||
				useWeapons.some((r) => r.match(/^(全|all)$/))
			) {
				ok = true
			} else if (ampWeapons.length) {
				ok = useWeapons.some((useName) => ampWeapons.some((ampName) => ampName == useName))
			} else {
				ok = !useWeapons.length
			}
			if (!ok) {
				return
			}
			// 威力計算
			if (val.includes('+')) {
				val = val.replace('+', '')
				pow += Number(val)
			} else if (val.includes('-')) {
				val = val.replace('-', '')
				pow -= Number(val)
			} else if (val.includes('*')) {
				val = val.replace('*', '')
				rate *= Number(val)
			} else if (val.includes('/')) {
				val = val.replace('/', '')
				rate /= Number(val)
			} else {
				pow += Number(val)
			}
		})
		if (pow == 0) {
			pow = 1
		}
		pow = Math.max(0, pow * rate) || 1
		return pow
	}

	//==================================================
	//--  メタ配列 /ベーシック
	//==================================================

	//- 全てのメタ配列を合算
	function totalAllMetaArray(battler, words, action) {
		// イニット
		let array = []
		let data = null
		// バトラー値
		data = battler.actorId ? battler.actor() : battler.enemy()
		if (data) {
			metaAll(data.note, words).forEach((e) => array.push(e))
		}
		if (battler._actorId) {
			// 職業値
			data = battler.currentClass()
			if (data) {
				metaAll(data.note, words).forEach((e) => array.push(e))
			}
			// 多重職業プラグインに対応
			if (battler.additionalClassObjects) {
				battler.additionalClassObjects().forEach((data) => {
					if (data) {
						metaAll(data.note, words).forEach((e) => array.push(e))
					}
				})
			}
			// 装備値
			battler.equips().forEach((data) => {
				if (data) {
					metaAll(data.note, words).forEach((e) => {
						// 対象武器の指定がなれば今の武器を対象に
						if (!e.split(',')[1] && data.wtypeId) {
							e += ',' + $dataSystem.weaponTypes[data.wtypeId]
						}
						array.push(e)
					})
				}
			})
		}
		// ステート値
		battler._states.forEach((stateId) => {
			data = $dataStates[stateId]
			if (data) {
				metaAll(data.note, words).forEach((e) => array.push(e))
			}
		})
		// アクション値
		if (action) {
			data = action.item()
			if (data) {
				metaAll(data.note, words).forEach((e) => array.push(e))
			}
		}
		// 空の要素は削除
		array = array.filter((e) => e)
		return array
	}

	//- 全取得メタ
	function metaAll(note, words) {
		let result = []
		words.forEach((word) => {
			const regText = '<' + word + ':([^>]*)>'
			const regExp_g = new RegExp(regText, 'g')
			const regExp = new RegExp(regText)
			const matches = note.match(regExp_g)
			if (matches) {
				matches.forEach(function (line) {
					result.push(line.match(regExp)[1].replace(/\s/g, ''))
				})
			}
		})
		return result
	}
})()
