//=============================================================================
// Keke_SpeedStarBattle - スピードスターバトル
// バージョン: 2.4.8
//=============================================================================
// Copyright (c) 2021 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 流れるように疾走する快速バトル
 * @author ケケー
 * @url https://kekeelabo.com
 *
 * @help
 * 【ver.2.4.8】
 * 流れるように疾走する快速バトル
 * スピード調整も柔軟
 * ツクールMZ/MV両対応
 *
 * ● 特徴 ●
 *
 * ■なめらかで速い
 * ◎早送りではなく、各キャラ同時に行動していくという形で高速化を実現
 *   そのため、なめらかな動きのままで速い
 * ◎普通に早送りもできる
 *
 * ■柔軟なスピード調整
 * ◎ゲーム中、動的にバトルスピードを変更できる
 *   ザコ戦は速め、ボス戦はじっくりめなど
 * ◎オプションでバトルスピードを変更できる
 *   プレイヤーの好みでスピード調整させることが可能
 *
 *
 * ● 使い方 ●
 *
 * ■推奨プラグイン
 * フロントビュー戦闘で使う場合は、
 * 『Keke_FrontViewPlus.js』との併用をお勧めしています
 * (併用しないと味方側のダメージポップが上手く表示されない)
 * DL先: https://www.kekeelabo.com/?i=32
 *
 *
 * ■バトルウェイト
 * 本プラグインでは、素の状態では各キャラ一斉に行動する
 * ただそれでは何が何やらわからないので、行動ごとにウェイトをかける
 * このウェイトが『バトルウェイト』
 * 30 なら 30フレーム 待ったあと次のキャラが行動する
 * バトルウェイトを変えることでバトルスピードを自在に調整できる
 * ウェイトが少ないほど速く、多いほど遅くなる
 *
 *
 * ■バトルウェイト補正
 * スキル(アイテム)のエフェクトの長さに応じてウェイトに補正をかける
 * 長いエフェクトほどウェイトも長く、短いエフェクトは短く
 * プラグインパラメータ → バトルウェイト → バトルウェイト補正
 * で補正の大きさを設定できる
 *
 *
 * ■基本のバトルウェイトを設定
 * ◇プラグインパラメータ → バトルウェイト → 基本バトルウェイト
 * バトルウェイト乱数も設定するとウェイトの長さをランダムにできる
 *
 *
 * ■スキル(アイテム)個別にバトルウェイトを設定
 * ◇スキル(アイテム)のメモ欄に
 * <バトルウェイト: 値>
 * 例:
 * <バトルウェイト: 60>
 *   バトルウェイトが 30 加算される
 *
 *
 * ■実際のバトルウェイト値
 * 基本のバトルウェイト + スキル(アイテム)のバトルウェイト
 * つまり合計
 *
 * ※バトルウェイトが 0 になると、
 * 　プラグインコマンドやオプションでのスピード調整が無意味になってしまう
 * 　0 に何をかけても 0 だからである
 *
 *
 * ■各動作速度
 * スキル(アイテム)のアニメーション
 * バトラーの移動、モーション、エフェクト
 * の動作速度を調整できる。2 なら 2倍速に、0.5 なら 0.5倍速になる
 *
 *
 * ■スキル(アイテム)別にアニメ速度を設定
 * ◇スキル(アイテム)のメモ欄に
 * <アニメ速度: 値>
 * ★例)
 * <アニメ速度: 2>
 *   アニメ速度が 2倍速 になる
 *
 * ※アニメ速度は演出の速度であり、バトル進行速度には影響しない
 * バトルスピードを決めるのはあくまでバトルウェイト
 *
 *
 * ■タイムプログレス速度
 * タイムプログレスバトルの進行速度を調整できる
 *
 *
 * ■タイムオートファスト
 * タイムプログレスバトル時用の機能
 * 誰もコマンド入力や行動をしていない無意味な待ち時間を、
 * 自動的にゲージ速度を加速して飛ばす
 *
 *
 * ■ボタン長押し早送り
 * ボタン長押し(決定、シフト、タッチ)でバトルを早送りできる
 * 1.5 なら 1.5倍速 に、 0.5 なら 0.5倍速 になる
 * 早送りとはいうが遅くすることも可能
 * プラグインパラメータ → 早送り倍率
 * で早送りの速さを設定できる
 *
 *
 * ■ポップウェイト
 * 行動開始からダメージポッブが出るまでの時間
 * 30 なら 30フレーム後 に出る
 *
 *
 * ■スキル(アイテム)別にポップウェイトを設定
 * ◇スキル(アイテム)のメモ欄に
 * <ポップウェイト: 値>
 * ★例)
 * <ポップウェイト: 60>
 * 　ポップウェイトが 60 になる
 *
 * ※ ポップウェイトの本質
 * ダメージポップが出るまでの時間とは、
 * すなわち「スキルの効果が出るまでの時間」である
 * 早く効果を出したいスキルはポップウェイトを短く、
 * 遅く出したいスキルは長くするとよい
 *
 *
 * ■コラプスウェイト
 * 敵のコラプス(崩壊エフェクト)の待ち時間
 * 60 なら 60 フレーム待つ
 * 0 なら待ち時間なし
 * -1 ならコラプス終了まで待つ(デフォルトと同じ動作)
 *
 *
 * ■敵キャラ別にコラプスウェイトを設定
 * ◇敵キャラのメモ欄に
 * <コラプスウェイト: 値>
 * ★例)
 * <コラプスウェイト: 60>
 * 　コラプスを 60フレーム 待つ
 * <コラプスウェイト: 0>
 * 　待ち時間なし。
 * <コラプスウェイト: -1>
 * 　コラプス終了まで待つ
 *
 *
 * ■ゲーム中にバトルスピードを変更
 * ◎MZの場合
 * プラグインコマンド → バトルスピード変更  → バトルスピード
 * ◎MVの場合
 * プラグインコマンドに、
 *   battleSpeedSpsb 速度率
 * ★例)
 * battleSpeedSpsb 1.5
 * 　バトルスピードが 1.5倍 になる
 * ※Spsb は SpeedStarBattle の略
 *
 *
 * ■ゲーム中にバトル高速化を無効
 * ◎MZの場合
 * プラグインコマンド → バトルスピード変更  → 高速化無効
 * ◎MVの場合
 * プラグインコマンドに、
 *   battleSpeedSpsb on/off
 * ★例)
 * battleSpeedSpsb off
 * 　バトル高速化が無効になる。on で有効に戻す
 *
 *
 * ■オプションでバトルスピードを変更
 * ◇プラグインパラメータ → オプション → オプション追加リスト
 * 　標準でバトルスピード項目が追加されている
 * 　必要ないなら消す
 * 　※MVではなし
 *
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 *
 *
 * A fast battle that runs like a flow
 * Flexible speed adjustment
 * Compatible with both Maker MZ/MV
 *
 * ● Features ●
 *
 * Smooth and fast
 * ◎ Rather than fast-forwarding,
 *   speeding up is achieved by having each character act at the same time.
 *   Therefore, the movement remains smooth and fast.
 * ◎ You can also fast-forward normally
 *
 * Flexible speed adjustment
 * ◎ You can dynamically change the battle speed during the game
 *   Be quick in small fights, slow down in boss fights, etc.
 * ◎ You can change the battle speed with options
 *   It is possible to adjust the speed according to the player's preference
 *
 *
 * ● How to use ●
 *
 * ■ Recommended plug-ins
 * When used in front view combat,
 * Recommended to use with "Keke_FrontViewPlus.js"
 * (If not used together,
 *   damage pops on the ally side will not be displayed well)
 * DL dir: https://www.kekeelabo.com/?i=32
 *
 *
 * ■ Battle weight
 * In this plug-in, all characters act simultaneously in the original state
 * However, since you don't know what's going on with that, weight each action
 * This weight is "battle weight"
 * If 30, he waits 30 frames before the next character acts
 * You can freely adjust the battle speed by changing the battle weight
 * Fewer weights are faster, more weights are slower
 *
 *
 * ■ Battle weight correction
 * Correct the weight according to the length of the skill (item) effect
 * Longer effects have longer weights, shorter effects have shorter weights
 * Plugin Parameter → Battle Weight → Battle Weight Correction
 * You can set the amount of correction with *
 *
 *
 * ■ Set the basic battle weight
 * ◇ Plugin Parameter → Battle Weight → Basic Battle Weight
 * If you also set the battle weight random number,
 *   you can randomize the length of the wait
 *
 *
 * ■Set battle weight for each skill (item)
 * ◇ In the skill (item) memo field
 * <battleweight: value>
 * ★ example)
 * <battleWeight: 60>
 *   Adds 30 Battle Weight
 *
 *
 * ■ Actual battle weight value
 * Base Battle Weight + Skill (Item) Battle Weight
 * i.e. total
 *
 * ※ When Battle Weight reaches 0,
 *   speed adjustment with plugin commands and options becomes useless
 *   0 multiplied by anything is 0
 *
 *
 * ■ Each operation speed
 * Skill (item) animation
 * Battler movement, motion and effects
 * You can adjust the operating speed of 2 is 2x speed, 0.5 is 0.5x speed
 *
 *
 * ■ Set animation speed for each skill (item)
 * ◇ In the skill (item) memo field
 * <animeSpeed: value>
 * ★ example)
 * <animeSpeed: 2>
 *   Double animation speed
 *
 * ※ The animation speed is the speed of the production,
 * and does not affect the battle progress speed.
 * Battle speed is determined by battle weight
 *
 *
 * ■ Time progress speed
 * You can adjust the progress speed of the time progress battle
 *
 *
 * ■ Time Auto Fast
 * Function for time progress battle
 * A meaningless waiting time when no one is inputting commands
 *   or taking actions,
 * Automatically accelerate gauge speed and fly
 *
 *
 * ■ Pop Weight
 * Time from action start to damage pop
 * If 30, exit after 30 frames
 *
 *
 * ■ Set pop weight for each skill (item)
 * ◇ In the skill (item) memo field
 * <popWait: value>
 * ★ example)
 * <popWait: 60>
 *   Pop weight becomes 60
 *
 * ※ Essence of pop weight
 * What is the time until the damage pop appears?
 * In other words, it is "the time until the skill takes effect"
 * Shorter pop weight for skills that you want to take effect quickly,
 * It is better to lengthen skills that you want to use later
 *
 *
 * ■ Collapse weight
 * Enemy Collapse Wait Time
 * If 60, waits 60 frames
 * If 0, means no wait
 * If -1, wait until collapse ends (same behavior as default)
 *
 *
 * ■ Set the collapse weight for each enemy character
 * ◇ In the memo column of the enemy character
 * <collapseWait: value>
 * ★ example)
 * <CollapseWait: 60>
 *   Collapse weight becomes 60
 *
 *
 * ■ Change the battle speed during the game
 * ◎ For MZ
 * Plugin Command → Change Battle Speed ​​→ Battle Speed
 * ◎ For MV
 * in plugin command
 *   battleSpeedSpsb speed rate
 * ★ example)
 * battleSpeedSpsb 1.5
 *   Increases battle speed by 1.5x
 * ※ Spsb stands for his SpeedStarBattle
 *
 *
 * ■ Disable battle acceleration during the game
 * ◎ For MZ
 * Plugin Command → Change Battle Speed ​​→ Disable Acceleration
 * ◎ For MV
 * in plugin command
 *   battleSpeedSpsb on/off
 * ★ example)
 * battleSpeedSpsb off
 *   Battle acceleration is disabled. re-enable with on
 *
 *
 * ■ Change battle speed with options
 * ◇ Plugin Parameters → Options → Option Addition List
 * Battle speed item is added as standard
 * turn it off if you don't need it
 * ※ Not in MV
 *
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 *
 *
 *
 * @param ■バトルウェイト
 *
 * @param 基本バトルウェイト
 * @parent ■バトルウェイト
 * @desc battleWaitBasic 行動ごとにかかるウェイトの基本値。5 なら 5フレーム のウェイトを加算。基本 40
 * @default 40
 *
 * @param バトルウェイト補正(短)
 * @parent ■バトルウェイト
 * @desc battelWaitRevise(short) エフェクトが短い場合のバトルウェイト短縮補正。基本 0.25
 * @default 0.25
 *
 * @param バトルウェイト補正(長)
 * @parent ■バトルウェイト
 * @desc battelWaitRevise(long) エフェクトが長い場合のバトルウェイト延長補正。基本 0.25
 * @default 0.25
 *
 * @param バトルウェイト乱数
 * @parent ■バトルウェイト
 * @desc battleWaitRand 行動ごとにかかるウェイトの乱数。5 なら -5〜0フレーム のウェイトを加算。基本 0
 * @default 0
 *
 * @param ■各動作速度
 *
 * @param アニメ速度
 * @parent ■各動作速度
 * @desc animeSpeed スキル(アイテム)のアニメーションの速さ。1.5 なら 1.5倍速。基本 1.1
 * @default 1.1
 *
 * @param ムーブ速度
 * @parent ■各動作速度
 * @desc amoveSpeed バトラーの移動前に一歩出たりとか)の速さ。1.5 なら 1.5倍速。基本 1.1
 * @default 1.1
 *
 * @param モーション速度
 * @parent ■各動作速度
 * @desc motionSpeed バトラーのモーションの速さ。1.5 なら 1.5倍速。基本 1.1
 * @default 1.1
 *
 * @param エフェクト速度
 * @parent ■各動作速度
 * @desc effectSpeed バトラーのエフェクト(コラプスとか)の速さ。1.5 なら 1.5倍速。基本 1.1
 * @default 1.1
 *
 * @param 早送り倍率
 * @parent ■各動作速度
 * @desc fastRate ボタン長押し(決定、シフト、タッチ)での加速率。5 なら 5倍。基本 5
 * @default 5
 *
 * @param ■タイムプログレス速度
 *
 * @param タイムゲージ速度
 * @parent ■タイムプログレス速度
 * @desc timeGaugeSpeed タイムゲージが溜まる速さ。1.5 なら 1.5倍速。基本 1
 * @default 1
 *
 * @param タイムオートファスト
 * @parent ■タイムプログレス速度
 * @desc timeAutoFast タイムプログレスの待ち時間に加速する。その加速率。1.5 なら 1.5倍速。基本 5
 * @default 5
 *
 * @param ■ウェイト
 *
 * @param 基本ポップウェイト
 * @parent ■ウェイト
 * @desc popWaitBasic ダメージポップが出るまでの時間。5 なら 5フレーム後 に出る。基本 20
 * @default 20
 *
 * @param 通常コラプスウェイト
 * @parent ■ウェイト
 * @desc collapseWaitNormal 通常コラプス時の次にいくまでの時間。5 なら 5フレーム 待つ。-1 ならコラプス終了まで待つ。基本 0
 * @default 0
 *
 * @param ボスコラプスウェイト
 * @parent ■ウェイト
 * @desc collapseWaitBoss ボスコラプス時の次にいくまでの時間。5 なら 5フレーム 待つ。-1 ならコラプス終了まで待つ。基本 -1
 * @default -1
 *
 * @param ■その他
 *
 * @param オプション追加リスト
 * @parent ■その他
 * @desc optionAddList このリストにある項目がオプションに表示される。名前を変えてもいいが、a- の部分は消さないこと
 * @type string[]
 * @default ["a-バトルスピード"]
 *
 * @param バトルログ無効
 * @parent ■その他
 * @desc noBattleLog バトルログを非表示にするか。基本 false
 * @type boolean
 * @default false
 *
 *
 *
 * @command バトルスピード変更
 * @desc changeBattleSpeed バトル速度を変更する
 *
 * @arg バトルスピード
 * @desc battleSpeed バトルの進行速度。1.5 なら 1.5倍速
 *
 * @arg 高速化無効
 * @desc noBattleFast バトル高速化を無効にする
 * @type boolean
 *
 *
 *
 * @command パラメータリセット
 * @desc parameterReset バトルスピード関連のパラメータを初期状態に戻す
 */

;(() => {
	//- プラグイン名
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]

	//- ツクールMVか
	function isMv() {
		return typeof ColorManager == 'undefined'
	}

	//- ツクールMZか
	function isMz() {
		return typeof ColorManager != 'undefined'
	}

	//==================================================
	//--  パラメータ受け取り
	//==================================================

	//- 真偽化
	function toBoolean(str) {
		if (!str) {
			return false
		}
		const str2 = str.toString().toLowerCase()
		if (str2 == 'true' || str2 == 'on') {
			return true
		}
		if (str2 == 'false' || str2 == 'off') {
			return false
		}
		return Number(str)
	}

	const parameters = PluginManager.parameters(pluginName)

	//- バトルウェイト
	const keke_battleWaitBasic = Number(parameters['基本バトルウェイト'])
	const keke_battleWaitReviseShort = Number(parameters['バトルウェイト補正(短)'])
	const keke_battleWaitReviseLong = Number(parameters['バトルウェイト補正(長)'])
	const keke_battleWaitRandom = Number(parameters['バトルウェイト乱数'])

	//- 各動作速度
	const keke_animeSpeed = Number(parameters['アニメ速度'])
	const keke_moveSpeed = Number(parameters['ムーブ速度'])
	const keke_motionSpeed = Number(parameters['モーション速度'])
	const keke_effectSpeed = Number(parameters['エフェクト速度'])
	const keke_turboRate = Number(parameters['早送り倍率'])

	//- タイムプログレス速度
	const keke_timeGaugeSpeed = Number(parameters['タイムゲージ速度'])
	const keke_timeAutoFast = Number(parameters['タイムオートファスト'])

	//- ウェイト
	const keke_popWaitBasic = Number(parameters['基本ポップウェイト'])
	const keke_collapseWaitBasic = Number(parameters['通常コラプスウェイト'])
	const keke_collapseWaitBoss = Number(parameters['ボスコラプスウェイト'])

	//- その他
	const keke_optionAddList = JSON.parse(parameters['オプション追加リスト'])
	const keke_noBattleLog = toBoolean(parameters['バトルログ無効'])

	//==================================================
	//-- 公開
	//==================================================

	//- アニメ速度の取得(公開)
	Game_Temp.prototype.getAnimeSpeedKeSpsb = function (action = null) {
		return getAnimeSpeed(action)
	}

	//==================================================
	//--  プラグインコマンド
	//==================================================

	//- バトルスピード変更
	if (isMz()) {
		PluginManager.registerCommand(pluginName, 'バトルスピード変更', (args) => {
			const gs = $gameSystem
			if (!gs._speedStarInitedKe) {
				gs.initSpeedStarBattleKe()
			}
			if (args['バトルスピード']) {
				gs._battleSpeedPlcKe = Number(args['バトルスピード'])
			}
			if (args['高速化無効']) {
				gs._noSpeedStarKe = toBoolean(args['高速化無効'])
			}
		})

		//- パラメータリセット
		PluginManager.registerCommand(pluginName, 'パラメータリセット', (args) => {
			$gameSystem.initSpeedStarBattleKe()
		})
	}

	//- MVのプラグインコマンド(コア追加)
	if (isMv()) {
		const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
		Game_Interpreter.prototype.pluginCommand = function (command, args) {
			_Game_Interpreter_pluginCommand.apply(this, arguments)
			switch (command) {
				case 'battleSpeedSpsb':
					if (args[0] == 'on') {
						$gameSystem._noSpeedStarKe = false
					} else if (args[0] == 'off') {
						$gameSystem._noSpeedStarKe = true
					} else {
						$gameSystem._battleSpeedPlcKe = Number(args[0])
					}
			}
		}
	}

	//==================================================
	//--  共通開始
	//==================================================

	// ゲームシステム/開始(コア追加)
	const _Game_System_initialize = Game_System.prototype.initialize
	Game_System.prototype.initialize = function () {
		_Game_System_initialize.apply(this)
		// スピードスターバトルの初期化
		this.initSpeedStarBattleKe(this)
	}

	//- バトルマネージャー/戦闘開始(コア追加)
	const _BattleManager_startBattle = BattleManager.startBattle
	BattleManager.startBattle = function () {
		_BattleManager_startBattle.apply(this)
		// スピードスターバトルの初期化
		const gs = $gameSystem
		if (!gs._speedStarInitedKe) {
			gs.initSpeedStarBattleKe()
		}
		// 変数の初期化
		initVariables()
	}

	//- シーンオプション/開始(コア追加)
	const _Scene_Options_initialize = Scene_Options.prototype.initialize
	Scene_Options.prototype.initialize = function () {
		_Scene_Options_initialize.apply(this)
		// スピードスターバトルの初期化
		const gs = $gameSystem
		if (!gs._speedStarInitedKe) {
			gs.initSpeedStarBattleKe()
		}
	}

	//- スピードスターバトルの初期化
	Game_System.prototype.initSpeedStarBattleKe = function () {
		// スピードスター無効
		this._noSpeedStarKe = false
		// バトルスピード
		this._battleSpeedOptKe = 100
		this._battleSpeedPlcKe = 1
		// バトルウェイト
		this._battleWaitBscKe = keke_battleWaitBasic
		this._battleWaitRdmKe = keke_battleWaitRandom
		this._battleWaitSklKe = null
		// アニメ速度
		this._animeSpeedKe = keke_animeSpeed
		this._animeSpeedOptKe = 1
		// タイム速度
		this._timeSpeedKe = keke_timeGaugeSpeed
		this._timeSpeedOptKe = 1
		// 全体変数の初期化
		initGlobalVariable()
		// 初期化済みフラグ
		this._speedStarInitedKe = true
	}

	//- 変数の初期化
	function initVariables() {
		// パーティの変数を初期化
		getAllBattlers().forEach((battler) => {
			battler._popWaitingKe = null
			battler._inPopWaitKe = null
			battler._tempBattlerKe = null
			battler._popWaitsKe = null
		})
		// 全体変数の初期化
		initGlobalVariable()
	}

	//- 全体変数の初期化
	function initGlobalVariable() {
		const bm = BattleManager
		bm._battleWaitKe = 0
		bm._collapseWaitKe = null
		bm._actionAnimesKe = []
	}

	//==================================================
	//--  共通終了
	//==================================================

	//- バトルマネージャー/バトル終了の更新(コア追加)
	const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd
	BattleManager.updateBattleEnd = function () {
		_BattleManager_updateBattleEnd.apply(this)
		// 変数の初期化
		initVariables()
	}

	//==================================================
	//--  プラグインデータ
	//==================================================

	//- バトルウェイト
	function battleWait() {
		const gs = $gameSystem
		// 基本値×プラグインコマンド分×早押し分
		let speed =
			gs._battleWaitSklKe != null
				? gs._battleWaitSklKe
				: gs._battleWaitBscKe - Math.randomInt(gs._battleWaitRdmKe)
		speed = Math.max(speed, 0) * (1 / battleSpeed()) * (1 / longPressFast())
		return Math.round(speed)
	}

	//- アニメ速度
	function animeSpeed() {
		const gs = $gameSystem
		return gs._animeSpeedKe * battleSpeed(true) * longPressFast(true)
	}

	//- タイム速度
	function timeSpeed() {
		const gs = $gameSystem
		return gs._timeSpeedKe * longPressFast(true)
	}

	//- バトルスピード
	function battleSpeed(half) {
		const gs = $gameSystem
		const speeds = [gs._battleSpeedOptKe / 100, gs._battleSpeedPlcKe]
		let result = []
		speeds.forEach((speed, i) => {
			if (half) {
				result[i] = 1 + (speed - 1) / 2
			} else {
				result[i] = speed
			}
		})
		return result[0] * result[1]
	}

	Game_System.prototype.battleSpeedKe = function (half) {
		return battleSpeed(half)
	}

	//- ボタン長押し早送り-システム
	function longPressFast(half) {
		let result = 1
		// 長押し中は早送り
		if (Input.isLongPressed('ok') || Input.isPressed('shift') || TouchInput.isLongPressed()) {
			if (half) {
				result = 1 + (keke_turboRate - 1) / 2
			} else {
				result = keke_turboRate
			}
		}
		// ボタン長押し早送り中フラグ
		BattleManager._inLongPressFastKeSpsb = result != 1
		return result
	}

	//- フルスピードか
	function isFullSpeed() {
		if ($gameSystem._battleSpeedOptKe >= 300) {
			return true
		}
		if (BattleManager._inLongPressFastKeSpsb) {
			return true
		}
		return false
	}

	//==================================================
	//-- 同時行動の開始
	//==================================================

	//- インヴォークアクション(コア追加)
	const _BattleManager_invokeAction = BattleManager.invokeAction
	BattleManager.invokeAction = function (subject, target) {
		// ポップウェイト発動時でなければ
		if (!this._invokePopWaitKe && !$gameSystem._noSpeedStarKe) {
			// バトル&ポップウェイトの取得
			getBattlePopWait(subject, target)
			// 仮ターゲットの処理
			processTempTarget(subject, target)
			return
		}
		_BattleManager_invokeAction.apply(this, arguments)
	}

	//- バトル & ポップウェイトの取得
	function getBattlePopWait(subject, target) {
		if (!subject) {
			return
		}
		const bm = BattleManager
		const action = bm._action
		const item = action.item()
		// アイテムデータを保存
		action._itemKe = { id: action._item.itemId(), isSkill: action._item.isSkill() }
		// アニメスピードを取得
		const aniSpeed = getAnimeSpeed()
		// ポップウェイトの取得
		const popWait = getPopWait(item, aniSpeed)
		// スキルのバトルウェイト取得
		getBattleWaitSkill(item, subject, aniSpeed)
		// ターゲットにウェイト & インヴォーク情報を適用
		if (!target._popWaitsKe) {
			target._popWaitsKe = []
		}
		target._popWaitsKe.push({ wait: popWait, subjectId: battlerToId(subject), action: action })
		// サブジェクトのポップ待ち中フラグを加算
		if (subject._popWaitingKe == null) {
			subject._popWaitingKe = 0
		}
		setTimeout(addPopWaiting, 0, subject)
		// ターゲットにポップウェイト中フラグ
		target._inPopWaitKe = true
		// 行動者を保存
		bm._subjectKeSpsb = subject
	}

	//- ポップ待ちフラグの加算
	function addPopWaiting(subject) {
		if (!subject || subject._popWaitingKe == null) {
			return
		}
		subject._popWaitingKe++
	}

	//- 仮ターゲットの処理
	function processTempTarget(subject, target) {
		// プラグイン『スマートAI』がなければリターン
		if (!PluginManager._scripts.some((n) => n == 'Keke_SmartAI')) {
			return
		}
		const bm = BattleManager
		//  仮バトラーズがなければ作成
		if (!bm._tempBattlersKe) {
			bm._tempBattlersKe = []
		}
		// 仮ターゲットがなければ作成
		if (!target._tempBattlerKe) {
			target._tempBattlerKe = makeTempBattler(target)
			bm._tempBattlersKe.push(target)
		}
		// 仮サブジェクトがなければ作成
		if (!subject._tempBattlerKe) {
			subject._tempBattlerKe = makeTempBattler(subject)
			bm._tempBattlersKe.push(subject)
		}
		// 仮アプリー
		bm._action._isTempApplyKe = true
		bm._action.apply(target._tempBattlerKe)
		bm._action._isTempApplyKe = false
	}

	//- 仮バトラーの作成
	function makeTempBattler(battler) {
		// 影マスター対応
		const kage = battler._kageMasterKe
		battler._kageMasterKe = null
		const tempBattler = JsonEx.makeDeepCopy(battler)
		tempBattler._isTempKe = true
		tempBattler._oriBattlerKe = battler
		battler._kageMasterKe = kage
		return tempBattler
	}

	//- 仮アプリー中はTP変動させない(コア追加)
	const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect
	Game_Action.prototype.applyItemUserEffect = function (target) {
		if (this._isTempApplyKe) {
			return
		}
		_Game_Action_applyItemUserEffect.apply(this, arguments)
	}

	//- 仮サブジェクトの取得(コア追加)
	const _Game_Action_subject = Game_Action.prototype.subject
	Game_Action.prototype.subject = function () {
		let subject = _Game_Action_subject.apply(this)
		if (subject && subject._tempBattlerKe && this._isTempApplyKe) {
			subject = subject._tempBattlerKe
		}
		return subject
	}

	//- ポップウェイトの取得
	function getPopWait(item, aniSpeed) {
		const bm = BattleManager
		// 基本設定を取得
		let popWait = !item.animationId ? 0 : keke_popWaitBasic
		// メモから取得
		const popMemo = item.meta['ポップウェイト'] || item.meta['popWait']
		popWait = popMemo != null ? Number(popMemo) : popWait
		// チェイン時はチェインウェイト取得
		if (bm._skillChainNumKe) {
			const chainMemo = item.meta['チェインウェイト'] || item.meta['chainWait']
			popWait += chainMemo != null ? Number(chainMemo) * bm._skillChainNumKe : 0
		}
		// アニメ速度による補正
		if (popWait > 0) {
			popWait = Math.round(popWait / aniSpeed)
		}
		return popWait
	}

	//- スキルのバトルウェイト取得
	function getBattleWaitSkill(item, subject, aniSpeed) {
		const bm = BattleManager
		// メモからバトルウェイトを取得
		const btwMemo = item.meta['バトルウェイト'] || item.meta['battleWait']
		$gameSystem._battleWaitSklKe = btwMemo ? Number(btwMemo) : null
		if (btwMemo) {
			bm._actionAnimesKe = []
			return
		}
		// 取得できなかったらアニメの保存
		if (!bm._actionAnimesKe) {
			bm._actionAnimesKe = []
		}
		const animeId = item.animationId
		// 通常攻撃アニメ
		if (animeId < 0) {
			// アクターのみ
			if (subject._actorId) {
				const atk1 = subject.attackAnimationId1()
				if (atk1) {
					bm._actionAnimesKe.push(atk1)
				}
				const atk2 = subject.attackAnimationId2()
				if (atk2) {
					bm._actionAnimesKe.push(atk2)
				}
			}
			// 通常アニメ
		} else if (animeId >= 1) {
			bm._actionAnimesKe.push({ id: animeId, speed: aniSpeed })
		}
	}

	//- エンドアクション(コア追加)
	const _BattleManager_endAction = BattleManager.endAction
	BattleManager.endAction = function () {
		// バトルウェイトをセット
		if (this._phase == 'action' && !$gameSystem._noSpeedStarKe) {
			this._battleWaitKe = Math.round(
				battleWait() * (this._battleWaitRateKeRask != null ? this._battleWaitRateKeRask : 1)
			)
			// バトルウェイトの補正
			reviseBattleWait()
			// 防御ならウェイトなし
			if (this._action.item().id == this._subject.guardSkillId()) {
				this._battleWaitKe = 1
			}
			$gameSystem._battleWaitSklKe = null
		}
		_BattleManager_endAction.apply(this)
		// 仮バトラーの消去
		if (this._tempBattlersKe && this._tempBattlersKe.length) {
			this._tempBattlersKe.forEach((battler) => (battler._tempBattlerKe = null))
			this._tempBattlersKe = []
		}
	}

	//- バトルウェイトの補正
	function reviseBattleWait() {
		const bm = BattleManager
		// アニメがない場合
		if (!bm._actionAnimesKe || !bm._actionAnimesKe.length) {
			//bm._battleWaitKe = Math.round(bm._battleWaitKe / 2);
			return
		}
		let animes = bm._actionAnimesKe
		// アニメの重複を削除
		animes = [...new Set(animes)]
		const aniMv = $plugins.filter((p) => p.name == 'AnimationMv')[0]
		const dynamicMv = $plugins.filter((p) => p.name == 'NRP_DynamicAnimationMV2MZ')[0]
		let maxTiming = null
		// 最大タイミングを取得
		animes.forEach((a) => {
			let animation = $dataAnimations[a.id]
			let timing = null
			if (isEmptyAnimation(animation) && (aniMv || dynamicMv)) {
				const mvAnimes = window['$dataMvAnimations']
				if (!mvAnimes || !mvAnimes[a.id]) {
					return
				}
				timing = mvAnimes[a.id].frames.length + 1
			} else {
				timing = getAnimeMaxTiming(animation)
			}
			timing = timing / a.speed
			if (timing > maxTiming) {
				maxTiming = timing
			}
		})
		// 補正計算
		let wait = bm._battleWaitKe
		const reviseOn =
			(keke_battleWaitReviseShort || keke_battleWaitReviseLong) &&
			$gameSystem._battleWaitSklKe == null
		if (maxTiming != null && reviseOn) {
			let reviseWait = (wait * (maxTiming - 60)) / 60
			reviseWait =
				reviseWait > 0
					? reviseWait * keke_battleWaitReviseLong
					: reviseWait * keke_battleWaitReviseShort
			wait = wait + reviseWait
		}
		bm._battleWaitKe = Math.round(wait)
		// アニメを消去
		bm._actionAnimesKe = []
	}

	//- アニメがないか
	function isEmptyAnimation(animation) {
		return (
			animation &&
			!animation.effectName &&
			(!animation.flashTimings || animation.flashTimings.length === 0) &&
			(!animation.soundTimings || animation.soundTimings.length === 0)
		)
	}

	//- アニメの最大タイミングの取得
	function getAnimeMaxTiming(animation) {
		if (!animation) {
			return 0
		}
		// MVの場合
		if (isMv()) {
			return animation.frames.length * 4
		}
		// MZの場合
		let maxTiming = 0
		let end = 0
		const speed = animation.speed / 100
		const timings = animation.soundTimings.concat(animation.flashTimings)
		for (const timing of timings) {
			end = (timing.frame + (timing.duration ? timing.duration : 0)) / speed
			if (end > maxTiming) {
				maxTiming = end
			}
		}
		return maxTiming
	}

	//==================================================
	//--  ポップウェイトの更新
	//==================================================

	//- ポップウェイトの更新 呼び出し(コア追加)
	const _Scene_Battle_update = Scene_Battle.prototype.update
	Scene_Battle.prototype.update = function () {
		_Scene_Battle_update.apply(this)
		// ポップウェイトの更新
		updatePopWait()
	}

	//- ポップウェイトの更新
	function updatePopWait() {
		getAllBattlers().forEach((battler) => {
			// ポップウェイトの更新-個別
			updatePopWaitEach(battler)
		})
	}

	//- ポップウェイトの更新-個別
	function updatePopWaitEach(battler) {
		if ($gameSystem._noSpeedStarKe) {
			return
		}
		if (!battler._popWaitsKe || !battler._popWaitsKe.length) {
			return
		}
		// 戦闘終了したら終了
		if (BattleManager._phase == 'battleEnd') {
			battler._popWaitsKe = []
		}
		// ウェイト値を減らす
		battler._popWaitsKe.forEach((d, i) => {
			let wait = d.wait
			battler._popWaitsKe[i].wait = --wait
		})
		// カウント0になったものがあるか判定
		battler._popWaitsKe.forEach((p, i) => {
			// あったら
			if (p.wait <= 0) {
				const subject = idToBattler(p.subjectId)
				if (subject) {
					// 行動者のポップウェイト中フラグを減らす
					subject._popWaitingKe--
					// インヴォークアクション(特殊)
					invokeActionEx(subject, battler, p.action)
				}
				// データ消去
				battler._popWaitsKe[i] = null
			}
		})
		// null を消去
		battler._popWaitsKe = battler._popWaitsKe.filter((d) => d != null)
		// 終了
		if (!battler._popWaitsKe.length) {
			// バトラーのポップウェイト中フラグを解除
			battler._inPopWaitKe = null
		}
	}

	//- インヴォークアクション(特殊)
	function invokeActionEx(subject, target, action) {
		if (BattleManager._escaped) {
			return
		}
		// アイテムが空になったいたら保存データから復元
		let isRestore = false
		if (!action.item()) {
			const d = action._itemKe
			if (d.isSkill) {
				action.setSkill(d.id)
			} else {
				action.setItem(d.id)
			}
			isRestore = true
		}
		const bm = BattleManager
		// 変数入れ替え
		const nowSubject = bm._subject
		bm._subject = subject
		const nowAction = bm._action
		bm._action = action
		// インヴォークアクション
		bm._invokePopWaitKe = true
		bm.invokeAction(subject, target)
		bm._invokePopWaitKe = false
		// 変数戻す
		bm._subject = nowSubject
		bm._action = nowAction
		// 復元したアイテムを消去
		if (isRestore) {
			action.clear()
		}
	}

	//- ダメージポップアップをすぐ起動
	const _Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults
	Window_BattleLog.prototype.displayActionResults = function (subject, target) {
		_Window_BattleLog_displayActionResults.apply(this, arguments)
		// すぐに次のメソッドを呼び出し
		while (this._methods.length > 0) {
			this.callNextMethod()
		}
	}

	const _Window_BattleLog_popupDamage = Window_BattleLog.prototype.popupDamage
	Window_BattleLog.prototype.popupDamage = function (target) {
		_Window_BattleLog_popupDamage.apply(this, arguments)
		if (!target.isDamagePopupRequested()) {
			return
		}
		if ($gameTemp._fullAnimeStatusKe && $gameTemp._fullAnimeStatusKe.onDamagePop(target)) {
			return
		}
		// すぐにダメージポップアップのセットアッブ
		setupDamagePopup(target)
	}

	//- ダメージポップアップのセットアップ
	function setupDamagePopup(target) {
		const targetSprite = searchSpriteBattler(target)
		if (!targetSprite) {
			return
		}
		if (isMv()) {
			target.startDamagePopup()
			targetSprite.setupDamagePopup()
		} else {
			targetSprite.createDamageSprite()
		}
		// ポップアップを解除
		target.clearDamagePopup()
		target._result.clear()
	}

	//- アクション適用時の自己リザルトクリアを抑制(コア追加)
	let suppressResultClear = false
	const _Game_Action_apply = Game_Action.prototype.apply
	Game_Action.prototype.apply = function (target) {
		suppressResultClear = true
		_Game_Action_apply.apply(this, arguments)
		suppressResultClear = false
	}

	//- ポップウェイト中はリザルトクリアしない(コア追加)
	const _Game_Battler_clearResult = Game_Battler.prototype.clearResult
	Game_Battler.prototype.clearResult = function () {
		if (suppressResultClear && this._damagePopup) {
			return
		}
		if ($gameParty.inBattle()) {
			if (this._popWaitsKe && this._popWaitsKe.length) {
				return
			}
		}
		_Game_Battler_clearResult.apply(this)
	}

	//- 誰かがポップウェイト中か
	function inPopWaitSomeone() {
		return [...$gameParty.aliveMembers(), ...$gameTroop.aliveMembers()].some(
			(battler) => battler._inPopWaitKe
		)
	}

	//- ポップウェイト中はターン終了しない
	const _BattleManager_endTurn = BattleManager.endTurn
	BattleManager.endTurn = function () {
		if (!isTpb(this) && inPopWaitSomeone()) {
			return
		}
		_BattleManager_endTurn.apply(this)
	}

	//- タイムプログレスか
	function isTpb(bm) {
		if (isMv()) {
			return false
		}
		return bm.isTpb()
	}

	//==================================================
	//--  バトルウェイトの更新
	//==================================================

	//- バトルウェイトの更新(コア追加)
	const _Spriteset_Battle_isAnimationPlaying = Spriteset_Battle.prototype.isAnimationPlaying
	Spriteset_Battle.prototype.isAnimationPlaying = function () {
		if ($gameSystem._noSpeedStarKe) {
			return _Spriteset_Battle_isAnimationPlaying.apply(this)
		}
		let wait = false
		// バトルウェイトがあるときはウェイト
		if (BattleManager._battleWaitKe) {
			BattleManager._battleWaitKe--
			if (BattleManager._battleWaitKe <= 0) {
				// バトルウェイトの終了
				endBattleWait()
			}
			wait = true
		}
		// コラプスウェイトがあるときはウェイト
		if (BattleManager._collapseWaitKe) {
			BattleManager._collapseWaitKe--
			wait = true
		}
		return wait
	}

	//- バトルウェイトの終了
	function endBattleWait() {
		// ログ消去予約のセット
		setLogClearAppo()
	}

	//- アクターのアクション中は前進維持(コア追加)
	const _Sprite_Actor_shouldStepForward = Sprite_Actor.prototype.shouldStepForward
	Sprite_Actor.prototype.shouldStepForward = function () {
		let result = _Sprite_Actor_shouldStepForward.apply(this)
		const battler = this._battler
		if (battler._popWaitingKe || isActing(battler)) {
			result = true
		}
		return result
	}

	//- 行動中か
	function isActing(battler) {
		const bm = BattleManager
		return bm._battleWaitKe && bm._subjectKeSpsb == battler
	}

	//==================================================
	//--  バトルログの処理
	//==================================================

	//- ログ一括実行(コア追加)
	const _Window_BattleLog_callNextMethod = Window_BattleLog.prototype.callNextMethod
	Window_BattleLog.prototype.callNextMethod = function () {
		_Window_BattleLog_callNextMethod.apply(this)
		// 一括判定
		let clamp = true
		if ($gameSystem._noSpeedStarKe || BattleManager._phase == 'start') {
			return
		}
		if (!isFullSpeed()) {
			// 『FesStyleCutin』対応
			if (
				clamp &&
				PluginManager._scripts.some((n) => n == 'FesStyleCutin') &&
				this._methods.length &&
				this._methods.some((method) => method.name.match(/cutin/i))
			) {
				return
			}
		}
		// 一括処理
		while (this._methods.length > 0) {
			const method = this._methods.shift()
			// メソッド処理
			if (method.name && this[method.name]) {
				this[method.name].apply(this, method.params)
			} else {
				throw new Error('Method not found: ' + method.name)
			}
		}
	}

	//- ログを全て改行させる(コア再定義)
	Window_BattleLog.prototype.pushBaseLine = function () {}

	//- ログのウェイトを無効(コア追加)
	const _Window_BattleLog_wait = Window_BattleLog.prototype.wait
	Window_BattleLog.prototype.wait = function () {
		let wait = false
		if ($gameSystem._noSpeedStarKe) {
			wait = true
		}
		if (!wait) {
			return
		}
		_Window_BattleLog_wait.apply(this)
	}

	//- ログの移動待ちを無効(コア追加)
	const _Window_BattleLog_waitForMovement = Window_BattleLog.prototype.waitForMovement
	Window_BattleLog.prototype.waitForMovement = function () {
		if (!$gameSystem._noSpeedStarKe) {
			return
		}
		_Window_BattleLog_waitForMovement.apply(this)
	}

	//- ログを特定状況で高速モードに
	const _Window_BattleLog_isFastForward = Window_BattleLog.prototype.isFastForward
	Window_BattleLog.prototype.isFastForward = function () {
		let fast = false
		if (isFullSpeed()) {
			fast = true
		}
		// 『FesStyleCutin』対応
		if (
			!fast &&
			PluginManager._scripts.some((n) => n == 'FesStyleCutin') &&
			this._methods.length &&
			this._methods.some((method) => method.name.match(/cutin/i))
		) {
			fast = true
		}
		if (fast) {
			return true
		}
		return _Window_BattleLog_isFastForward.apply(this)
	}

	//- アクション終了時にログをクリアしない
	const _Window_BattleLog_endAction = Window_BattleLog.prototype.endAction
	Window_BattleLog.prototype.endAction = function (subject) {
		_Window_BattleLog_endAction.apply(this, arguments)
		this._methods.splice(this._methods.length - 2, 1)
	}

	//- ログ消去予約のセット
	function setLogClearAppo() {
		const scene = SceneManager._scene
		// ログ消去時間
		scene._logWindow._clearAppoKe = 30
	}

	//- ログ消去予約の解除(コア追加)
	const _Window_BattleLog_clear = Window_BattleLog.prototype.clear
	Window_BattleLog.prototype.clear = function () {
		_Window_BattleLog_clear.apply(this)
		this._clearAppoKe = null
	}

	//- ログ消去予約の更新(コア追加)
	const _Window_BattleLog_update = Window_BattleLog.prototype.update
	Window_BattleLog.prototype.update = function () {
		_Window_BattleLog_update.apply(this)
		if (this._clearAppoKe) {
			this._clearAppoKe--
			if (!this._clearAppoKe) {
				this.clear()
			}
		}
	}

	//- アクション開始時にログクリア
	const _BattleManage_startAction = BattleManager.startAction
	BattleManager.startAction = function () {
		// ログクリア
		const scene = SceneManager._scene
		const logWindow = scene._logWindow
		if (logWindow) {
			logWindow.clear()
			// ダメージカウントもクリア
			logWindow._damageCountKeSpsb = 0
		}
		_BattleManage_startAction.apply(this)
	}

	//==================================================
	//--  その他同時行動に付随する処理
	//==================================================

	//- スプライトセットの移動待ちを無効(コア追加)
	const _Spriteset_Battle_isAnyoneMoving = Spriteset_Battle.prototype.isAnyoneMoving
	Spriteset_Battle.prototype.isAnyoneMoving = function () {
		if (!$gameSystem._noSpeedStarKe) {
			return
		}
		_Spriteset_Battle_isAnyoneMoving.apply(this)
	}

	//- 入力中も全滅判定(コア追加)
	const _BattleManager_updateEvent = BattleManager.updateEvent
	BattleManager.updateEvent = function () {
		let result = _BattleManager_updateEvent.apply(this)
		if (this._phase == 'input' && this.checkBattleEnd()) {
			result = true
		}
		return result
	}

	//- 戦闘終了時にウェイト消去(コア追加)
	const _BattleManager_endBattle = BattleManager.endBattle
	BattleManager.endBattle = function (result) {
		_BattleManager_endBattle.apply(this, arguments)
		this._battleWaitKe = 0
	}

	//- 行動モーションを中断させない
	const _Sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion
	Sprite_Actor.prototype.refreshMotion = function () {
		const actor = this._actor
		const action = BattleManager._action
		const actionSubject = action ? action.subject() : null
		if (BattleManager._battleWaitKe && actor == actionSubject) {
			return
		}
		_Sprite_Actor_refreshMotion.apply(this)
	}

	//- インプット中に行動不能になったら次へ(コア追加)
	const _BattleManager_updatePhase = BattleManager.updatePhase
	BattleManager.updatePhase = function (timeActive) {
		_BattleManager_updatePhase.apply(this, arguments)
		if (this._phase == 'input' && this._currentActor) {
			const actor = this._currentActor
			if (actor.hp == 0 || actor.isRestricted()) {
				actor.refresh()
				this.selectNextCommand()
			}
		}
	}

	//- アニメエラー防止(コア追加)
	const _Sprite_Animation_targetSpritePosition = Sprite_Animation.prototype.targetSpritePosition
	Sprite_Animation.prototype.targetSpritePosition = function (sprite) {
		if (!sprite || !sprite.parent) {
			return { x: 0, y: 0 }
		}
		return _Sprite_Animation_targetSpritePosition.apply(this, arguments)
	}

	//- ポップウェイト中は自動付与ステート表示をしない(コア追加)
	const _Window_BattleLog_displayAutoAffectedStatus =
		Window_BattleLog.prototype.displayAutoAffectedStatus
	Window_BattleLog.prototype.displayAutoAffectedStatus = function (target) {
		if (target._inPopWaitKe) {
			return
		}
		_Window_BattleLog_displayAutoAffectedStatus.apply(this, arguments)
	}

	//==================================================
	//--  各動作速度
	//==================================================

	//- アニメ速度の取得
	function getAnimeSpeed(action = null) {
		if (!$gameParty.inBattle()) {
			return 1
		}
		action = action ? action : BattleManager._action
		const basic = Math.max(animeSpeed(), 0.1)
		if (!action) {
			return basic
		}
		const item = action.item()
		if (!item) {
			return basic
		}
		const note = item.meta['アニメ速度'] || item.meta['animeSpeed']
		if (!note) {
			return basic
		}
		const speed = Math.max(animeSpeed() * Number(note), 0.1)
		return speed
	}

	//- アニメ作成時にアクション取得(コア追加)
	const _Sprite_Animation_initMembers = Sprite_Animation.prototype.initMembers
	Sprite_Animation.prototype.initMembers = function () {
		_Sprite_Animation_initMembers.apply(this)
		if ($gameParty.inBattle()) {
			this._actionKe = BattleManager._action
		}
	}

	//- アニメーション速度(コア追加)
	const _Sprite_Animation_updateEffectGeometry = Sprite_Animation.prototype.updateEffectGeometry
	Sprite_Animation.prototype.updateEffectGeometry = function () {
		_Sprite_Animation_updateEffectGeometry.apply(this)
		if (!this._handle) {
			return
		}
		// 初回のみアニメ速度の取得
		if (!this._animeSpeedKe) {
			this._animeSpeedKe = getAnimeSpeed(this._actionKe)
		}
		// パーティクル速度を変更
		const fastRate = Math.max((this._animation.speed / 100) * this._animeSpeedKe, 0.1)
		if (fastRate != 1) {
			this._handle.setSpeed(fastRate)
		}
	}

	//- アニメフラッシュ速度(コア追加)
	const _Sprite_Animation_processFlashTimings = Sprite_Animation.prototype.processFlashTimings
	Sprite_Animation.prototype.processFlashTimings = function () {
		// 初回のみアニメ速度の取得
		if (!this._animeSpeedKe) {
			if (BattleManager._subject) {
				this._animeSpeedKe = getAnimeSpeed()
			}
		}
		// フラッシュタイミングを変更
		const fastRate = this._animeSpeedKe
		if (fastRate != 1) {
			for (const timing of this._animation.flashTimings) {
				if (Math.round(timing.frame / fastRate) === this._frameIndex) {
					this._flashDuration = Math.round(timing.duration / fastRate)
					this._flashColor = timing.color.clone()
				}
			}
			// それ以外は通常
		} else {
			_Sprite_Animation_processFlashTimings.apply(this)
		}
	}

	//- アニメサウンド速度(コア追加)
	const _Sprite_Animation_processSoundTimings = Sprite_Animation.prototype.processSoundTimings
	Sprite_Animation.prototype.processSoundTimings = function () {
		// 初回のみアニメ速度の取得
		if (!this._animeSpeedKe) {
			if (BattleManager._subject) {
				this._animeSpeedKe = getAnimeSpeed()
			}
		}
		// SEタイミングを変更
		const fastRate = this._animeSpeedKe
		if (fastRate != 1) {
			for (const timing of this._animation.soundTimings) {
				if (Math.round(timing.frame / fastRate) === this._frameIndex) {
					AudioManager.playSe(timing.se)
				}
			}
		} else {
			_Sprite_Animation_processSoundTimings.apply(this)
		}
	}

	//- アニメ作成時にアクション取得-MV(コア追加)
	if (isMz()) {
		const _Sprite_AnimationMV_initMembers = Sprite_AnimationMV.prototype.initMembers
		Sprite_AnimationMV.prototype.initMembers = function () {
			_Sprite_AnimationMV_initMembers.apply(this)
			if ($gameParty.inBattle()) {
				this._actionKe = BattleManager._action
			}
		}
	}

	//- アニメーション速度-MZ(コア追加)
	if (isMz()) {
		const _Sprite_AnimationMV_setupRate = Sprite_AnimationMV.prototype.setupRate
		Sprite_AnimationMV.prototype.setupRate = function () {
			_Sprite_AnimationMV_setupRate.apply(this)
			// 初回のみアニメ速度の取得
			if (!this._animeSpeedKe) {
				this._animeSpeedKe = getAnimeSpeed(this._actionKe)
			}
			// 速度を変更
			this._rate = Math.round(this._rate / this._animeSpeedKe)
		}
	}

	//- アニメーション速度-MV(コア追加)
	if (isMv()) {
		const _Sprite_Animation_setupRate = Sprite_Animation.prototype.setupRate
		Sprite_Animation.prototype.setupRate = function () {
			_Sprite_Animation_setupRate.apply(this)
			// 初回のみアニメ速度の取得
			if (!this._animeSpeedKe) {
				this._animeSpeedKe = getAnimeSpeed(this._actionKe)
			}
			// 速度を変更
			this._rate = Math.round(this._rate / this._animeSpeedKe)
		}
	}

	//- バトルムーブ速度(コア追加)
	const _Sprite_Battler_startMove = Sprite_Battler.prototype.startMove
	Sprite_Battler.prototype.startMove = function (x, y, duration) {
		// 加速レート
		const fastRate = Math.max(keke_moveSpeed, 1)
		// 移動時間を変更
		duration = Math.round(duration / fastRate)
		_Sprite_Battler_startMove.apply(this, arguments)
	}

	//- モーション速度(コア追加)
	const _Sprite_Actor_motionSpeed = Sprite_Actor.prototype.motionSpeed
	Sprite_Actor.prototype.motionSpeed = function () {
		let result = _Sprite_Actor_motionSpeed.apply(this)
		// 加速レート
		const fastRate = Math.max(keke_motionSpeed, 1)
		// 速度変更
		result = Math.round(result / fastRate)
		return result
	}

	//- バトルエフェクト速度(コア追加)
	const _Sprite_Enemy_startEffect = Sprite_Enemy.prototype.startEffect
	Sprite_Enemy.prototype.startEffect = function (effectType) {
		_Sprite_Enemy_startEffect.apply(this, arguments)
		// 加速レート
		const fastRate = Math.max(keke_effectSpeed, 0.1)
		// エフェクト時間を変更
		this._effectDuration = Math.round(this._effectDuration / fastRate)
	}

	//==================================================
	//--  タイムプログレス速度
	//==================================================

	//- タイム速度(コア追加)
	const _Game_Battler_tpbAcceleration = Game_Battler.prototype.tpbAcceleration
	Game_Battler.prototype.tpbAcceleration = function () {
		let result = _Game_Battler_tpbAcceleration.apply(this)
		// グローバル速度
		result *= timeSpeed()
		// オートファストレート
		result *= autoFastRate()
		return result
	}

	//- オートファストレート
	function autoFastRate() {
		// パーティコマンド中はリターン
		if (SceneManager._scene._partyCommandWindow.active) {
			return 1
		}
		// インプット時はリターン
		if (BattleManager.actor()) {
			return 1
		}
		// アクション中はリターン
		if (BattleManager._phase == 'action') {
			return 1
		}
		// リアクション中はリターン
		if ($gameParty._inReactionKe) {
			return 1
		}
		// オートファストを適用
		return keke_timeAutoFast
	}

	//==================================================
	//--  コラプスウェイト
	//==================================================

	//- コラプスウェイトの処理(コア追加)
	const _Sprite_Enemy_isEffecting = Sprite_Enemy.prototype.isEffecting
	Sprite_Enemy.prototype.isEffecting = function () {
		// コラプスがない場合
		if (!this._effectType) {
			// コラプスウェイトがあるならウェイト終了
			if (BattleManager._collapseWaitKe != null) {
				BattleManager._collapseWaitKe = null
			}
			// コラプスがあるならウェイト適用(コラプスウェイトが未設定の時のみ)
		} else if (this._effectType.match(/collapse/i) && BattleManager._collapseWaitKe == null) {
			// ウェイト基本値
			const isBoss = this._effectType.match(/bossCollapse/i) ? true : false
			let wait = isBoss ? keke_collapseWaitBoss : keke_collapseWaitBasic
			// メモからウェイト値取得
			const obje = this._battler.enemy()
			if (obje) {
				const w = obje.meta['コラプスウェイト'] || obje.meta['collapseWait']
				if (w) {
					wait = Number(w)
				}
			}
			// 0 以上のときウェイトセット、マイナスの時は通常ウェイト
			if (wait >= 0) {
				BattleManager._collapseWaitKe = wait
			} else {
				BattleManager._collapseWaitKe = null
			}
		}
		// コラプスウェイトがない時は通常ウェイト
		if (BattleManager._collapseWaitKe == null) {
			return _Sprite_Enemy_isEffecting.apply(this)
		}
	}

	//==================================================
	//--  フロントビュースプライト
	//==================================================

	//- フロントビュー時もアクタースプライトを作る(コア追加)
	/*const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.apply(this);
        if ($gameSystem.isSideView()) { return; }
        if (this._actorSprites.length) { return; }
        this._actorSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_Actor();
            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite)
            sprite.visible = false;
       }
    };*/

	//==================================================
	//--  標準機能の無効化
	//==================================================

	//- ログ表示無効(コア追加)
	const _Scene_Battle_updateLogWindowVisibility = Scene_Battle.prototype.updateLogWindowVisibility
	Scene_Battle.prototype.updateLogWindowVisibility = function () {
		_Scene_Battle_updateLogWindowVisibility.apply(this)
		if (keke_noBattleLog) {
			this._logWindow.visible = false
		}
	}

	//==================================================
	//--  エフェクト調整
	//==================================================

	//- 連撃時アニメーションを繰り返さない(コア追加)
	/*const _Window_BattleLog_showAnimation = Window_BattleLog.prototype.showAnimation;
    Window_BattleLog.prototype.showAnimation = function(subject, targets, animationId) {
        let pre = null;
        // 同ターゲットが連続したら省く
        targets = targets.filter((target, i) => {
            if (target == pre) { return false; }
            pre = target;
            return true;
        }, this);
        _Window_BattleLog_showAnimation.apply(this, arguments);
    };*/

	//==================================================
	//--  オプション
	//==================================================

	//- マネージャー(バトルスピード)
	Object.defineProperty(ConfigManager, 'battleSpeed', {
		get: function () {
			return $gameSystem._battleSpeedOptKe
		},
		set: function (value) {
			$gameSystem._battleSpeedOptKe = value
		},
		configurable: true
	})

	//- マネージャー(バトルウェイト)
	Object.defineProperty(ConfigManager, 'battleWait', {
		get: function () {
			return $gameSystem._battleWaitOptKe
		},
		set: function (value) {
			$gameSystem._battleWaitOptKe = value
		},
		configurable: true
	})

	//- マネージャー(アニメ速度)
	Object.defineProperty(ConfigManager, 'animeSpeed', {
		get: function () {
			return $gameSystem._animeSpeedOptKe
		},
		set: function (value) {
			$gameSystem._animeSpeedOptKe = value
		},
		configurable: true
	})

	//- マネージャー(タイム速度)
	Object.defineProperty(ConfigManager, 'timeSpeed', {
		get: function () {
			return $gameSystem._timeSpeedOptKe
		},
		set: function (value) {
			$gameSystem._timeSpeedOptKe = value
		},
		configurable: true
	})

	//- オプションに項目追加(コア追加)
	const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList
	Window_Options.prototype.makeCommandList = function () {
		_Window_Options_makeCommandList.apply(this)
		// バトルスピードオブションの追加
		if (isMz()) {
			this.addBattleSpeedOptionsKeSpsb()
		}
	}

	//- バトルスピードオブションの追加
	Window_Options.prototype.addBattleSpeedOptionsKeSpsb = function () {
		// 追加したフラグ
		let added = false
		// 追加項目を展開
		for (let item of keke_optionAddList) {
			// 項目名設定
			if (item.startsWith('a-')) {
				item = item.replace(/^\w+-/, '')
				this.addCommand(item, 'battleSpeed')
			}
			if (item.startsWith('b-')) {
				item = item.replace(/^\w+-/, '')
				this.addCommand(item, 'battleWait')
			}
			if (item.startsWith('c-')) {
				item = item.replace(/^\w+-/, '')
				this.addCommand(item, 'animeSpeed')
			}
			if (item.startsWith('d-')) {
				item = item.replace(/^\w+-/, '')
				this.addCommand(item, 'timeSpeed')
			}
			added = true
		}
		// リサイズ
		this.resizeKe()
	}

	//- オプションのリサイズ
	Window_Options.prototype.resizeKe = function () {
		// コマンド数取得
		let cmdNum = this._list.length
		// ハイト変更(画面ハイトは超えない)
		let height = Math.min(Graphics.boxHeight, this.fittingHeight(cmdNum))
		this.height = height
		// Y位置変更
		this.y = (Graphics.boxHeight - this.height) / 2
	}

	//- オプションウインドウのハイト拡大(コア追加)
	const _Scene_Options_optionsWindowRect = Scene_Options.prototype.optionsWindowRect
	Scene_Options.prototype.optionsWindowRect = function () {
		let result = _Scene_Options_optionsWindowRect.apply(this)
		result.height = Graphics.height
		return result
	}

	//- ステータステキスト(コア追加)
	const _Window_Options_statusText = Window_Options.prototype.statusText
	Window_Options.prototype.statusText = function (index) {
		let result = _Window_Options_statusText.apply(this, arguments)
		// シンボルと値を取得
		const symbol = this.commandSymbol(index)
		const value = this.getConfigValue(symbol)
		// バトルスピードのとき
		if (symbol == 'battleSpeed') {
			return this.volumeStatusText(value)
			// バトルウェイトのとき
		} else if (symbol == 'battleWait') {
			return value + 'フレーム'
			// アニメ速度のとき
		} else if (symbol == 'animeSpeed') {
			return this.volumeStatusText(value)
			// タイム速度のとき
		} else if (symbol == 'timeSpeed') {
			return this.volumeStatusText(value)
		}
		return result
	}

	//- 決定ボタン時の処理(コア追加)
	const _Window_Options_processOk = Window_Options.prototype.processOk
	Window_Options.prototype.processOk = function () {
		const symbol = this.commandSymbol(this.index())
		// バトルスピードのとき
		if (symbol == 'battleSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, true, true)
			// バトルウェイトのとき
		} else if (symbol == 'battleWait') {
			this.changeBattleSpeedValueKeSpsb(symbol, true, true)
			// アニメ速度のとき
		} else if (symbol == 'animeSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, true, true)
			// タイム速度のとき
		} else if (symbol == 'timeSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, true, true)
			// それ以外のとき
		} else {
			_Window_Options_processOk.apply(this)
		}
	}

	//- 右カーソルの処理(コア追加)
	const _Window_Options_cursorRight = Window_Options.prototype.cursorRight
	Window_Options.prototype.cursorRight = function () {
		const symbol = this.commandSymbol(this.index())
		// バトルスピードのとき
		if (symbol == 'battleSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, true, true)
			// バトルウェイトのとき
		} else if (symbol == 'battleWait') {
			this.changeBattleSpeedValueKeSpsb(symbol, true, true)
			// アニメ速度のとき
		} else if (symbol == 'animeSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, true, true)
			// タイム速度のとき
		} else if (symbol == 'timeSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, true, true)
			// それ以外のとき
		} else {
			_Window_Options_cursorRight.apply(this)
		}
	}

	//- 左カーソルの処理(コア追加)
	const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft
	Window_Options.prototype.cursorLeft = function () {
		const symbol = this.commandSymbol(this.index())
		// バトルスピードのとき
		if (symbol == 'battleSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, false, true)
			// バトルウェイトのとき
		} else if (symbol == 'battleWait') {
			this.changeBattleSpeedValueKeSpsb(symbol, false, true)
			// アニメ速度のとき
		} else if (symbol == 'animeSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, false, true)
			// タイム速度のとき
		} else if (symbol == 'timeSpeed') {
			this.changeBattleSpeedRateKeSpsb(symbol, false, true)
			// それ以外のとき
		} else {
			_Window_Options_cursorLeft.apply(this)
		}
	}

	//- 数値の変更(バトルウェイト)
	Window_Options.prototype.changeBattleSpeedValueKeSpsb = function (symbol, forward, wrap) {
		const lastValue = this.getConfigValue(symbol)
		const max = 100
		const min = 0
		const offset = 5
		let value = lastValue + (forward ? offset : -offset)
		if (wrap) {
			if (value > max) {
				value = min
			}
			if (value < min) {
				value = max
			}
		}
		value = value.clamp(0, max)
		this.changeValue(symbol, value)
	}

	//- レートの変更-バトルスピード
	Window_Options.prototype.changeBattleSpeedRateKeSpsb = function (symbol, forward, wrap) {
		const lastValue = this.getConfigValue(symbol)
		const max = 500
		const min = 50
		const offset = 10
		let value = lastValue + (forward ? offset : -offset)
		if (wrap) {
			if (value > max) {
				value = min
			}
			if (value < min) {
				value = max
			}
		}
		value = value.clamp(0, max)
		this.changeValue(symbol, value)
	}

	//- コンフィグデータ保存(コア追加)
	const _ConfigManager_makeData = ConfigManager.makeData
	ConfigManager.makeData = function () {
		let config = _ConfigManager_makeData.apply(this)
		// ゲーム開始時用
		config._battleSpeedOptKe = $gameSystem._battleSpeedOptKe
		config._battleWaitOptKe = $gameSystem._battleWaitOptKe
		config._animeSpeedOptKe = $gameSystem._animeSpeedOptKe
		config._timeSpeedOptKe = $gameSystem._timeSpeedOptKe
		// ニューゲーム用
		this._battleSpeedOptKe = $gameSystem._battleSpeedOptKe
		this._battleWaitOptKe = $gameSystem._battleWaitOptKe
		this._animeSpeedOptKe = $gameSystem._animeSpeedOptKe
		this._timeSpeedOptKe = $gameSystem._timeSpeedOptKe
		return config
	}

	//- ゲーム開始時に呼び出し(コア追加)
	const _ConfigManager_applyData = ConfigManager.applyData
	ConfigManager.applyData = function (config) {
		_ConfigManager_applyData.apply(this, arguments)
		const items = keke_optionAddList
		if (items.filter((item) => item.startsWith('a-')).length) {
			this._battleSpeedOptKe = config._battleSpeedOptKe
		}
		if (items.filter((item) => item.startsWith('b-')).length) {
			this._battleWaitOptKe = config._battleWaitOptKe
		}
		if (items.filter((item) => item.startsWith('c-')).length) {
			this._animeSpeedOptKe = config._animeSpeedOptKe
		}
		if (items.filter((item) => item.startsWith('d-')).length) {
			this._timeSpeedOptKe = config._timeSpeedOptKe
		}
	}

	//- ニューゲーム時に呼び出し(コア追加)
	const _DataManager_setupNewGame = DataManager.setupNewGame
	DataManager.setupNewGame = function () {
		_DataManager_setupNewGame.apply(this)
		cm = ConfigManager
		if (cm._battleSpeedOptKe) {
			$gameSystem._battleSpeedOptKe = cm._battleSpeedOptKe
		}
		if (cm._battleWaitOptKe) {
			$gameSystem._battleWaitOptKe = cm._battleWaitOptKe
		}
		if (cm._animeSpeedOptKe) {
			$gameSystem._animeSpeedOptKe = cm._animeSpeedOptKe
		}
		if (cm._timeSpeedOptKe) {
			$gameSystem._timeSpeedOptKe = cm._timeSpeedOptKe
		}
	}

	//==================================================
	//--  配列基本 /ベーシック
	//==================================================

	//- ハッシュのディープコピー
	function copyHash(hash) {
		const copy = {}
		Object.keys(hash).forEach((k) => {
			if (!hash[k]) {
				copy[k] = hash[k]
				return
			}
			if (hash[k].constructor.name == 'Object') {
				copy[k] = copyHash(hash[k])
			} else if (hash[k].constructor.name == 'Array') {
				copy[k] = copyArray(hash[k])
			} else {
				copy[k] = hash[k]
			}
		})
		return copy
	}

	//- 配列のディープコピー
	function copyArray(array) {
		const copy = []
		array.forEach((v, i) => {
			if (v.constructor.name == 'Object') {
				copy[i] = copyHash(v)
			} else if (v.constructor.name == 'Array') {
				copy[i] = copyArray(v)
			} else {
				copy[i] = v
			}
		})
		return copy
	}

	//==================================================
	//--  バトラー基本 /ベーシック
	//==================================================

	//- 全てのバトラーの取得
	function getAllBattlers() {
		return [...$gameParty.members(), ...$gameTroop.members()]
	}

	//- バトラーをIDに変換
	function battlerToId(battler) {
		const d = {}
		d.type = battler._enemyId ? 'enemy' : 'actor'
		d.id = battler._enemyId ? battler.index() : battler._actorId
		return d
	}

	//- IDをバトラーに変換
	function idToBattler(d) {
		if (!d) {
			return null
		}
		if (d.type == 'enemy') {
			return $gameTroop.members()[d.id]
		} else {
			return $gameParty.members().find((actor) => actor._actorId == d.id)
		}
	}

	//==================================================
	//--  スプライト基本 /ベーシック
	//==================================================

	//- バトラースプライトの検索
	function searchSpriteBattler(battler) {
		const spriteset = SceneManager._scene._spriteset
		let result = null
		const sprites = battler._enemyId ? spriteset._enemySprites : spriteset._actorSprites
		for (const sprite of sprites) {
			if (!sprite._battler) {
				continue
			}
			if (
				(battler._actorId && sprite._battler._actorId == battler._actorId) ||
				(battler._enemyId && sprite._battler.index() == battler.index())
			) {
				result = sprite
				break
			}
		}
		return result
	}
})()
