//============================================================================
// GotoSkill.js
//============================================================================

/*:ja
 * @plugindesc ver1.02 アクターコマンドなら俺の横で寝てるよ。
 * @author まっつＵＰ
 *
 * @param allowskill
 * @desc バトル中にパーティ全員が選択可能なスキルのIDです。
 * できるだけどんな状況でも発動できるスキルにしてください。
 * @default 1
 *
 * @param allowposi
 * @desc 0の時はallowskillのIDのスキルを先頭に
 * それ以外の場合は末尾に置きます。
 * @default 1
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * パーティコマンドの後のアクターコマンドを飛ばしてスキル選択から開始するようになります。
 * このアクターの表示スキルは全てのスキルタイプを対象とします。
 *
 * スキル選択がキャンセルされた時はパーティコマンドまたは前のアクターのスキル選択に戻ります。
 *
 * allowskillパラメータのスキルIDは汎用性の高いものをしっかり選んでください。
 * このスキルが発動できない場合は選択可能なスキルがなくなって最悪プレイヤーが詰みます。
 * また、このパラメータが0の時はスキルの追加がされません。
 *
 * YEP_BattleEngineCore(ver1.43a想定)と共に利用する場合はその改変が必要です。
 * 以下の記述をコメントアウト。
 * 全てのYanfly.BEC.Scene_Battle_startPartyCommandSelection.call(this);
 * その中で一番目のthis._helpWindow.clear();
 *
 * また、YEP_CoreEngineよりもこのプラグインを下に、
 * このプラグインより下にYEP_BattleEngineCoreを置くようにしてください。
 *
 * そうでない場合にMOG_BattleHud(v3.1)と共に利用する場合にはその改変が必要です。
 * this._help_layout.visible = this._helpWindow.visible; を
 * if(!this._party_layout.visible){
 * this._help_layout.visible = this._helpWindow.visible;
 * }else{
 * this._help_layout.visible = 0;
 * }
 * にしてください。
 *
 * また、MOG_BattleHudをこのプラグインよりも下に置くようにしてください。
 *
 * なお、バトルシーン中にonSkillCancelはご利用になれませんので
 * 他のプラグインでこれを呼び出す記述等ある場合は
 * selectPreviousCommandに変えればおそらく動作します。
 *
 * ver1.01 allowskillパラメータの改良、allowposiの追加。
 * ver1.02 MOG_BattleHudの一部競合対策
 *
 * 利用規約(2019/9/7変更)：
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：まっつＵＰ
 *
 */

;(function () {
	var parameters = PluginManager.parameters('GotoSkill')
	var GSallowskill = Number(parameters['allowskill'] || 1)
	var GSallowposi = Number(parameters['allowposi'] || 1)

	Scene_Battle.prototype.isAnyInputWindowActive = function () {
		return (
			this._partyCommandWindow.active ||
			//this._actorCommandWindow.active ||
			this._skillWindow.active ||
			this._itemWindow.active ||
			this._actorWindow.active ||
			this._enemyWindow.active
		)
	}

	Scene_Battle.prototype.stop = function () {
		Scene_Base.prototype.stop.call(this)
		if (this.needsSlowFadeOut()) {
			this.startFadeOut(this.slowFadeSpeed(), false)
		} else {
			this.startFadeOut(this.fadeSpeed(), false)
		}
		this._statusWindow.close()
		this._partyCommandWindow.close()
		//this._actorCommandWindow.close();
	}

	Scene_Battle.prototype.updateStatusWindow = function () {
		if ($gameMessage.isBusy()) {
			this._statusWindow.close()
			this._partyCommandWindow.close()
			//this._actorCommandWindow.close();
		} else if (this.isActive() && !this._messageWindow.isClosing()) {
			this._statusWindow.open()
		}
	}

	Scene_Battle.prototype.createAllWindows = function () {
		this.createLogWindow()
		this.createStatusWindow()
		this.createPartyCommandWindow()
		this.createActorCommandWindow()
		this.createHelpWindow()
		this.createSkillWindow()
		this.createItemWindow()
		this.createActorWindow()
		this.createEnemyWindow()
		this.createMessageWindow()
		this.createScrollTextWindow()
		this._actorCommandWindow.hide() //追加
	}

	Scene_Battle.prototype.createSkillWindow = function () {
		var wy = this._helpWindow.y + this._helpWindow.height
		var wh = this._statusWindow.y - wy
		this._skillWindow = new Window_BattleSkill(new Rectangle(0, wy, Graphics.boxWidth, wh))
		this._skillWindow.setHelpWindow(this._helpWindow)
		this._skillWindow.setHandler('ok', this.onSkillOk.bind(this))
		this._skillWindow.setHandler('cancel', this.selectPreviousCommand.bind(this))
		//キャンセル時に呼び出す処理を変更し、前のコマンドに戻るようにした。
		this.addWindow(this._skillWindow)
	}

	Scene_Battle.prototype.startPartyCommandSelection = function () {
		this.refreshStatus()
		this._statusWindow.deselect()
		this._statusWindow.open()
		this._skillWindow.close() //追加
		this._helpWindow.close() //追加
		//this._actorCommandWindow.close();
		this._partyCommandWindow.setup()
	}

	Scene_Battle.prototype.startActorCommandSelection = function () {
		this._statusWindow.select(BattleManager.actor().index())
		this._partyCommandWindow.close()
		//this._actorCommandWindow.setup(BattleManager.actor());
		this.commandSkill() //追加
	}

	Scene_Battle.prototype.commandSkill = function () {
		this._skillWindow.setActor(BattleManager.actor())
		//var ss = $dataSystem.skillTypes.length;
		//this._skillWindow.setStypeId //全部だ。
		this._skillWindow.refresh()
		this._skillWindow.open() //追加
		this._helpWindow.open() //追加
		this._skillWindow.show()
		this._skillWindow.activate()
	}

	Scene_Battle.prototype.onActorCancel = function () {
		this._actorWindow.hide()
		/*switch (this._actorCommandWindow.currentSymbol()) {
    case 'skill':*/
		this._skillWindow.show() //アクターコマンドはもうこの世にいないのよ。
		this._skillWindow.activate()
		/*break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }*/
	}

	Scene_Battle.prototype.onEnemyCancel = function () {
		this._enemyWindow.hide()
		/*switch (this._actorCommandWindow.currentSymbol()) {
    case 'attack':
        this._actorCommandWindow.activate();
        break;
    case 'skill':*/
		this._skillWindow.show() //アクターコマンドはもうこの世にいないのよ。
		this._skillWindow.activate()
		/*break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }*/
	}

	Scene_Battle.prototype.endCommandSelection = function () {
		this._partyCommandWindow.close()
		//this._actorCommandWindow.close();
		this._statusWindow.deselect()
	}

	Window_SkillList.prototype.includes = function (item) {
		if ($gameParty.inBattle()) {
			//バトル中のみスキルタイプ判定を行わない。
			return item //追加
		} else {
			return item && item.stypeId === this._stypeId
		}
	}

	var _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList
	Window_SkillList.prototype.makeItemList = function () {
		_Window_SkillList_makeItemList.call(this)
		if ($gameParty.inBattle() && GSallowskill > 0) {
			if (GSallowposi == 0) {
				this._data.unshift($dataSkills[GSallowskill]) //追加
			} else {
				this._data.push($dataSkills[GSallowskill]) //追加
			}
		}
	}
})()
