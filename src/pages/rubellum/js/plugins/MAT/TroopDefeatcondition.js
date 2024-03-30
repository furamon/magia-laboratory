//=============================================================================
// TroopDefeatcondition.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ver1.01 敵グループの全滅判定に手を加えます。
 * @author まっつＵＰ
 *
 * @param defaultcondition
 * @desc OFFの場合全滅判定時に
 * 敵グループの生存者数を評価しません。
 * @type boolean
 * @default false
 *
 * @param conditionSw
 * @desc デフォルトの敵グループの全滅判定
 * スイッチの値の評価を加えます。
 * @type switch
 * @default 10
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * デフォルトの戦闘の勝利条件は敵の全滅判定がtrueになることであり
 * このプラグインはこの仕様を変更するものではなく
 * 敵の全滅判定の処理に手を加えるものです。
 *
 * パラメータ「defaultcondition」がONの時は
 *
 * 敵グループの生存者数0
 * パラメータ「conditionSw」のスイッチON
 *
 * の二つの条件を満足する場合に全滅判定にtrueを返します。
 *
 * パラメータ「defaultcondition」がOFFの時は
 *
 * パラメータ「conditionSw」のスイッチON
 *
 * の条件を満たす場合に全滅判定にtrueを返します。
 *
 *
 * パラメータ「conditionSw」に有効なスイッチが設定されていないか
 * スイッチがONになっていない場合はデフォルトの戦闘の勝利条件を
 * 満たすことができないので注意してください。
 * なお、敵グループの生存者数0の時はエネミーの選択の際に
 * 決定を押すことができないのでゲーム上詰まないよう注意してください。
 *
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *
 * ver1.01 敵対象のアイテム（スキル）選択の有効状態の処理を追加
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 *
 */

;(function () {
	var parameters = PluginManager.parameters('TroopDefeatcondition')
	var TDdefaultcondition = parameters['defaultcondition'] === 'true'
	var TDconditionSw = Number(parameters['conditionSw'] || 0)

	DataManager.TDopposcopearray = function () {
		return [1, 2, 3, 4, 5, 6]
	}

	DataManager.TDcheckscope = function (list, item) {
		return list.contains(item.scope)
	}

	DataManager.TDcanuseforoppo = function (item) {
		if (!DataManager.TDcheckscope(DataManager.TDopposcopearray(), item)) return true
		return $gameTroop.TDisvalid()
	}

	//敵の対象がいるかどうか
	Game_Troop.prototype.TDisvalid = function () {
		return this.aliveMembers().length !== 0
	}

	//オーバーライド
	Game_Troop.prototype.isAllDead = function () {
		if (TDdefaultcondition) {
			var result = Game_Unit.prototype.isAllDead.call(this)
		} else {
			var result = true
		}
		if (TDconditionSw > 0) {
			var sw = $gameSwitches.value(TDconditionSw)
		} else {
			var sw = false
		}
		return result && sw
	}

	//オーバーライド
	Window_BattleSkill.prototype.isEnabled = function (item) {
		var enable = Window_SkillList.prototype.isEnabled.call(this, item)
		return enable && DataManager.TDcanuseforoppo(item)
	}

	//オーバーライド
	Window_BattleItem.prototype.isEnabled = function (item) {
		var enable = Window_ItemList.prototype.isEnabled.call(this, item)
		return enable && DataManager.TDcanuseforoppo(item)
	}

	//オーバーライド
	Window_BattleEnemy.prototype.isCurrentItemEnabled = function () {
		return $gameTroop.TDisvalid()
	}
})()
