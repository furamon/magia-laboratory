//=============================================================================
// YKP_DamageCalculation.js
//
// Copyright (c) 2019 YukiKamijo
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================
var Imported = Imported || {}
Imported.YKP_DamageCalculation = true

var YukiKP = YukiKP || {}
YukiKP.DamageCalculation = YukiKP.DamageCalculation || {}

/*:
 * @plugindesc ダメージ計算式を関数化するプラグイン。
 * @target MZ
 * @author YukiKamijo
 *
 * @help
 * ダメージの計算式をテンプレート化して、短い関数式で計算できるプラグインです。
 * よく使う計算式を共通化して、キーワードと引数で調整が出来るようになります。
 *
 * スキルのダメージ計算式に以下の記載をすると利用できます。
 *
 * YKP_DC(共通計算式の引数)
 *
 *
 * 共通計算式のリストに作った『キーワード』と『引数』を入力します。
 *   キーワードは " " で囲んで入力します。
 *   引数は数値を入力します。
 *
 *   記載例：YKP_DC("ATK", 1, 100, 3, 2)
 *     キーワード："ATK"
 *     引数１：1
 *     引数２：100
 *     ...
 *
 * 引数を省略することも可能です。
 * 省略した場合は、必ず『0』が入力されます。
 *
 * もちろん、今まで通りに計算式をエディタに入力しても問題ありません。
 *
 *
 * ◆共通計算式の利用方法
 *
 * よく利用する計算式をプラグインパラメータに登録しておくことができます。
 * 登録する際の規則は以下の通りです。
 * ・引数にするキーワードは " " で囲みます。
 * ・データ置換するには { } で囲みます
 *   置換可能なデータは次の通りです。
 *   {a.〇〇〇}：使用者の〇〇〇を参照して値に置換します。
 *   {b.〇〇〇}：対象の〇〇〇を参照して値に置換します。
 *   {v.〇}    ：変数〇番の値を参照して置換します。
 *
 *   記載例：({a.atk} * 4 - {b.def} * 2 + {v."変数ID"})
 *
 *   ※{a.isStateAffected("id")}のような特殊な参照も出来ます。
 *     ただし、{a.〇〇〇({v.△})}のような二重参照は出来ません。
 *
 *
 * ◆レートリストの利用方法
 *
 * キーワードと対応した値を設定しておきます。
 * キーワードはどのような文字でも可能です（例：1、2、1hit、2hit、単体、全体）
 * レート値は小数点第2位まで設定できます。
 *
 * 設定したレートは計算式に GetRate(key) の形式で利用できます。
 *   記載例：({a.atk} * 4 - {b.def} * 2) * GetRate("2") * GetRate("2hit") * GetRate("単体")
 *           上記は、キー「2」「2hit」「単体」に設定されたレート値でダメージ調整するような形式になります。
 *
 * 後々にバランス調整する際に、この値を調整だけで微調整が可能になります。
 *
 *
 * ◆オプション機能
 *
 * □アイテム・スキル別にリミットダメージを設定できます。
 *
 * LimitDamage(YKP_DC(...), 999);
 *   上記のように LimitDamage で囲むと、上限ダメージを再設定できます。
 *   ただし、プラグインパラメータの『最高ダメージ』を超えることは出来ません。
 *   記載例の場合、ダメージが999までしか出なくなります。
 *
 *
 * □対象にstateIdのステートが付与されている場合に倍率追加できます。
 *   注：MV制作で利用していた仕組みのため、MZでは安定した動作は保障していません。
 *
 * StateBonus(character ,rate, stateId...)
 * 使用計算式 : (character.isStateAffected(stateId) ? rate : 1)
 *
 *  使用例
 *   YKP_DC(共通計算式の引数) * StateBonus(b, 2, 4, 5)
 *
 *   攻撃力依存のダメージ計算後に対象にステートID 4番(毒)が
 *   付与されている場合にダメージが2倍になります。
 *   さらに、対象にステートID 5番(暗闇)が付与さてれいる場合は
 *   もう一度ダメージを2倍にします。(つまり、通常の4倍になる)
 *   対象にステートID 4番がなく、ステートID 5番がある場合は2倍のみ適用されます。
 *   ステートIDが3つ以上ある場合も同様に倍率を乗算します。
 *   乗算されていくので、rateを4にしたりすると4倍、16倍、64倍と跳ね上がります。
 *
 *  StateAddBonus(character ,rate, stateId...)
 *   StateBonusが乗算されていくのに対し、こちらは加算されていきます。
 *   rateを2にすれば、2倍、4倍、6倍という感じになります。
 *   付与されているステートの数だけrateを加算したい場合はこちらを使ってください。
 *
 *  どちらも対象にステートがない場合は等倍にしてくれます。
 *
 *
 * プラグインコマンドはありません。
 *
 * plugin version 2.0.3
 *
 * 2022/11/11
 * ver 2.0.3 : ダメージタイプが『HP回復』『MP回復』の時に
 *             正しく計算されていなかった問題を修正。
 *
 * 2022/10/24
 * ver 2.0.2 : GatRateのキーに文字以外が渡された時の処理を追加。
 *
 * 2022/10/23
 * ver 2.0.1 : ヘルプの修正・追記。
 *
 * 2022/10/20
 * ver 2.0.0 : 計算式システムをリファクタリング。
 *             関数化の仕組みを一新。
 *
 *
 * @param MinDamage
 * @desc 最低ダメージ値を設定します。
 * default 1
 * @default 1
 *
 * @param MaxDamage
 * @desc 最高ダメージ値を設定します。
 * default 999999
 * @default 999999
 *
 * @param EquationDataList
 * @text 共通計算式のリスト
 * @desc エディタで利用する計算式のリスト。
 * @type struct<EquationData>[]
 * @default ["{\"key\":\"AtkDamage\",\"argument\":\"[\\\"level\\\",\\\"add\\\",\\\"hit\\\",\\\"range\\\"]\",\"equation\":\"(\\\"add\\\" + {a.atk} * 4 - {b.def} * 2) * GetRate(\\\"level\\\") * GetRate(\\\"hit\\\") * GetRate(\\\"range\\\")\"}"]
 *
 * @param RateDataList
 * @text レート値のリスト
 * @desc エディタで利用する計算式でキーに対応したレート値を設定したリスト。
 * @type struct<RateData>[]
 * @default ["{\"key\":\"0\",\"rate\":\"1.00\"}","{\"key\":\"1\",\"rate\":\"0.80\"}","{\"key\":\"1hit\",\"rate\":\"1.00\"}","{\"key\":\"2hit\",\"rate\":\"0.75\"}","{\"key\":\"単体\",\"rate\":\"1.00\"}","{\"key\":\"全体\",\"rate\":\"0.90\"}"]
 *
 */
/*~struct~EquationData:
 *
 * @param key
 * @text キーワード
 * @desc エディタの計算式に入力するキーワード。この名称は一意である必要があります。
 * @type string
 * @default AtkDamage
 *
 * @param argument
 * @text 引数
 * @desc キーワードによる計算に使う引数を設定。
 * @type string[]
 * @default ["level","add","hit","range"]
 *
 * @param equation
 * @text 実行計算式
 * @desc キーワードに対応した基本計算式。
 * @type string
 * @default ("add" + {a.atk} * 4 - {b.def} * 2) * GetRate("level") * GetRate("hit") * GetRate("range")
 *
 */
/*~struct~RateData:
 *
 * @param key
 * @text レートキー
 * @desc 計算に使うレートのキーを設定します。この値は一意である必要があります。
 * @type string
 * @default 0
 *
 * @param rate
 * @text ダメージ倍率
 * @desc このキーを指定した際のダメージ倍率を設定。
 * @type number
 * @decimals 2
 * @default 1.00
 *
 */

// struct<> => JSON.Object
YukiKP.DamageCalculation.structureData = function (params) {
	return JSON.parse(
		JSON.stringify(params, function (key, value) {
			try {
				return JSON.parse(value)
			} catch (e) {
				try {
					return eval(value)
				} catch (e) {
					return value
				}
			}
		})
	)
}

YukiKP.DamageCalculation.structData = function (params) {
	return params ? this.structureData(params) : []
}

YukiKP.DamageCalculation.Parameters = PluginManager.parameters('YKP_DamageCalculation')
YukiKP.DamageCalculation.MinDamage = Number(YukiKP.DamageCalculation.Parameters['MinDamage'])
YukiKP.DamageCalculation.MaxDamage = Number(YukiKP.DamageCalculation.Parameters['MaxDamage'])
YukiKP.DamageCalculation.EquationDataList = YukiKP.DamageCalculation.structData(
	YukiKP.DamageCalculation.Parameters['EquationDataList']
)
YukiKP.DamageCalculation.RateDataList = YukiKP.DamageCalculation.structData(
	YukiKP.DamageCalculation.Parameters['RateDataList']
)

// 関数呼び出しコマンド
YKP_DC = function () {
	// 引数がなければ無効
	if (arguments.length === 0) return 0

	// 引数1 : キー
	const key = arguments[0]

	// キーから計算式データを取得
	const equationData = YukiKP.DamageCalculation.EquationDataList.find((el) => el.key === key)

	// 引数2～ : 計算式の引数
	let arg = []
	for (let index = 1; index < arguments.length; index++) {
		if (equationData.argument.length < index - 1) break
		arg.push({ key: equationData.argument[index - 1], value: arguments[index] })
	}

	// 計算式に引数を埋め込み
	const equation = equationData.equation.split('"')
	let result = ''
	for (str of equation) {
		const argument = arg.find((el) => el.key === str)
		if (argument) {
			// 引数として設定されている部分
			result += argument.value
		} else if (equationData.argument.find((el) => el === str)) {
			// 引数リストに登録があるが、値が渡されていない場合は"0"にする
			result += '0'
		} else {
			// 計算式で定義された部分
			result += str
		}
	}

	return YukiKP.DamageCalculation.CrateDamage(result)
}

// キーに対応したレート値を取得
GetRate = function (key) {
	const RateData = YukiKP.DamageCalculation.RateDataList.find((el) => '' + el.key === '' + key)
	if (RateData) return RateData.rate
	return 1
}

// ダメージの上限値を固定させる
YukiKP.DamageCalculation.limitDamage = YukiKP.DamageCalculation.MaxDamage
YukiKP.DamageCalculation.makeDamageValue = Game_Action.prototype.makeDamageValue
Game_Action.prototype.makeDamageValue = function (target, critical) {
	const result = YukiKP.DamageCalculation.makeDamageValue.call(this, target, critical)
	const item = this.item()
	const sign = [3, 4].includes(item.damage.type) ? -1 : 1
	if (sign === -1) {
		return result
	}
	return YukiKP.DamageCalculation.MinMaxDamageCheck(result)
}

// Game_Action 計算式の仕様を変更
YukiKP.DamageCalculation.subject = {}
YukiKP.DamageCalculation.target = {}
YukiKP.DamageCalculation.evalDamageFormula = Game_Action.prototype.evalDamageFormula
Game_Action.prototype.evalDamageFormula = function (target) {
	YukiKP.DamageCalculation.subject = this.subject()
	YukiKP.DamageCalculation.target = target
	return YukiKP.DamageCalculation.evalDamageFormula.call(this, target)
}

// MinDamage、MaxDamage反映関数
YukiKP.DamageCalculation.MinMaxDamageCheck = function (damage) {
	let result = damage
	if (damage < YukiKP.DamageCalculation.MinDamage) {
		result = YukiKP.DamageCalculation.MinDamage
	} else if (damage > YukiKP.DamageCalculation.limitDamage) {
		result = YukiKP.DamageCalculation.limitDamage
	} else if (damage > YukiKP.DamageCalculation.MaxDamage) {
		result = YukiKP.DamageCalculation.MaxDamage
	}
	YukiKP.DamageCalculation.limitDamage = YukiKP.DamageCalculation.MaxDamage
	return result
}

// 文字列計算式を実行する
YukiKP.DamageCalculation.RunString = function (str) {
	return Function('"use strict"; return (' + str + ')')()
}

// 計算式でダメージ計算
YukiKP.DamageCalculation.CrateDamage = function (str) {
	let equationStr = str

	// キーをレート値に置き換え
	while (true) {
		// 置換文字の始点
		const rateIndex = equationStr.indexOf('GetRate(')
		if (rateIndex < 0) break

		// 置換文字の終点
		const rateEndIndex = equationStr.indexOf(')', rateIndex)

		const key = equationStr.substring(rateIndex + 8, rateEndIndex)
		const value = GetRate(key)

		const leftStr = equationStr.slice(0, rateIndex)
		const rightStr = equationStr.slice(rateEndIndex + 1, equationStr.length)
		equationStr = leftStr + value + rightStr
	}

	// [a.]をsubjectに置き換える
	equationStr = this.convertStr(equationStr, 'a.', 'this.subject.')
	// [b.]をtargetに置き換える
	equationStr = this.convertStr(equationStr, 'b.', 'this.target.')
	// [v.]を$gameVariablesに置き換える
	equationStr = this.convertStr(equationStr, 'v.', '$gameVariables._data[', ']')

	return Math.floor(this.RunString(equationStr))
}

// 文字列の置換処理
YukiKP.DamageCalculation.convertStr = function (str, before, after, endStr = '') {
	let result = str
	while (true) {
		// 置換文字の始点
		const battlerIndex = result.indexOf('{' + before)
		if (battlerIndex < 0) break

		// 置換文字の終点
		const strEndIndex = result.indexOf('}', battlerIndex)

		const leftStr = result.slice(0, battlerIndex)
		const rightStr = result.slice(strEndIndex + 1, result.length)
		const paramStr = result.slice(battlerIndex + 3, strEndIndex) + endStr
		const paramData = this.getParam(after, paramStr) ? this.getParam(after, paramStr) : 1
		result = leftStr + paramData + rightStr
	}
	return result
}

// パラメータ取得
YukiKP.DamageCalculation.getParam = function (targetStr, paramName) {
	return eval(targetStr + paramName)
}

// ダメージ上限を付ける
LimitDamage = function (damage, limit) {
	YukiKP.DamageCalculation.limitDamage = limit
	return damage
}

// ステートによるダメージ倍率(乗算)
StateBonus = function (character, rate, ...args) {
	let damageRate = 1
	let state = null
	while (args.length > 0) {
		state = args.shift()
		damageRate *= character.isStateAffected(state) ? rate : 1
	}
	return damageRate
}

// ステートによるダメージ倍率(加算)
StateAddBonus = function (character, rate, ...args) {
	let damageRate = 0
	let state = null
	while (args.length > 0) {
		state = args.shift()
		damageRate += character.isStateAffected(state) ? rate : 0
	}
	return damageRate !== 0 ? damageRate : 1
}
