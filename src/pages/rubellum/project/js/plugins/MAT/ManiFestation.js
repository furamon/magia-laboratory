//============================================================================
// ManiFestation.js
//============================================================================

/*:ja
 * @plugindesc ver1.11 レベルアップ時にアイテムを入手します。
 * @author まっつＵＰ
 *
 * @param displayitem
 * @desc 0でなければこの効果で入手したアイテムを表示します。
 * @default 1
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * 職業ののノートタグ
 *
 * Lv+itemまたはWeaponまたはArmor+このアクターのレベル
 * :の後にアイテムID（複数可）
 *
 * <Lvitemx: y>
 * <LvWeaponx: y, y>
 * <LvArmorx: y, y, y>
 *
 * 例:<Lvitem2: 9>
 * レベル2にレベルアップした時ID9のアイテムを入手する。
 *
 * 例:<LvWeapon3: 9, 10>
 * レベル3にレベルアップした時ID9,ID10の武器を入手する。
 *
 * ver1.10 パラメータを一つ撤廃、アイテムを複数入手できるようにしました。
 * ver1.11 表示されるアイテム名が余分に表示される可能性を排除。
 *
 * 利用規約(2019/9/7変更)：
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：まっつＵＰ
 *
 */

;(function () {
	var parameters = PluginManager.parameters('ManiFestation')
	var MFdisplayitem = Number(parameters['displayitem'] || 1)
	var MFarray = []

	var _Game_Actor_refresh = Game_Actor.prototype.refresh
	Game_Actor.prototype.refresh = function () {
		_Game_Actor_refresh.call(this)
		MFarray = []
	}

	var _Game_Actor_levelUp = Game_Actor.prototype.levelUp
	Game_Actor.prototype.levelUp = function () {
		_Game_Actor_levelUp.call(this)
		this.LevelItem()
	}

	var _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp
	Game_Actor.prototype.displayLevelUp = function (newSkills) {
		_Game_Actor_displayLevelUp.call(this, newSkills)
		this.displayLevelItem()
	}

	Game_Actor.prototype.LevelItem = function () {
		this.LevelItemFind('Lvitem', $dataItems)
		this.LevelItemFind('LvWeapon', $dataWeapons)
		this.LevelItemFind('LvArmor', $dataArmors)
	}

	Game_Actor.prototype.LevelItemFind = function (text, obj) {
		var level = text + this._level
		var mani = this.currentClass().meta[level]
		if (!mani) return
		mani = JSON.parse('[' + mani + ']')
		mani.forEach(function (item) {
			$gameParty.gainItem(obj[item], 1, true)
			MFarray.push(obj[item])
		})
	}

	Game_Actor.prototype.displayLevelItem = function () {
		if (!MFdisplayitem) return
		if (!MFarray.length) return
		MFarray.forEach(function (item) {
			$gameMessage.add(TextManager.obtainItem.format(item.name))
		})
	}
})()
