//=============================================================================
//  Keke_ReactionSkill - リアクションスキル
// バージョン: 1.5.9
//=============================================================================
// Copyright (c) 2022 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc リアクションスキルを自在に作成
 * @author ケケー
 * @url https://kekeelabo.com
 *
 * @help
 * 【ver.1.5.9】
 * リアクションスキルを自在に作成できる
 * あらゆるリアクションスキルを実現可能
 * リアクションスキルとは相手の行動に反応して発動するスキルのこと
 *
 * ● 特徴 ●
 *
 * ◎リアクションのタイミングを「攻撃前」「攻撃後」で選択可
 * ◎味方への攻撃に対してもリアクション発動できる
 * ◎複数のリアクションを一度に発動できる
 * ◎リアクションとしてアイテムも使用可能
 * ◎リアクション中のみ付与されるステートを設定可能
 * ◎リアクション時に好きなポップメッセージを表示できる
 * ◎発動率と発動条件をjs式で自由に設定できる
 * ◎その他リアクションに付随する様々な設定を完備
 *
 *
 * ● 使い方 ●
 *
 * 【手順1】リアクション登録
 * => プラグインパラメータ →リアクション登録
 * 　リアクションを自由に作成して登録する
 * サンプルが初期状態でいくつか入っているので参考に
 * ◎『実行スキル』『実行アイテム』が空の場合は基本的にリアクション発動しない
 *　が、例外はある
 * 　▼『ものまね』が true の場合は ものまね が実行される
 * 　▼『味方リアクション』『かばう』が true の場合は かばう のみが実行される
 *
 *
 * 【手順2】リアクションを適用
 * アクター、職業、装備、敵キャラ、ステート のメモ欄に
 *
 * <リアクション: (アクション名)/(発動率)>
 * ※アクション名はリアクション登録で登録したもの
 *
 * 例)
 * <リアクション: 切り払い>
 * 　リアクション『切り払い』が適用される
 * <リアクション: 切り払い カウンター>
 * 　リアクション『切り払い』と『カウンター』が適用される
 * <リアクション: 切り払い/50 カウンター/200>
 * 　リアクション『切り払い』と『カウンター』が適用される
 * 　『切り払い』は 基本発動率 × 50% の確率で、
 * 　『カウンター』は 基本発動率 × 200% の確率で発動
 *
 *
 * 【機能1】メモ欄からの自分のリアクション率補正
 * 　自分のリアクション発動率を変動させる
 * 　リアクションを発動しやすいキャラやスキル、ステート等を作成可能
 * アクター、職業、スキル、アイテム、装備、敵キャラ、ステート のメモ欄に
 *
 * <リアクション率: (値)>
 * ※値は百分率
 *
 * 例)
 * <リアクション率: 50>
 *  自分のリアクション発動率を 50% にする
 *
 *
 * 【機能2】メモ欄からの相手リアクション率補正
 * 　攻撃側から相手のリアクション発動率を変動させる
 * 　リアクションを発動させづらいキャラやスキル、ステート等を作成可能
 * アクター、職業、スキル、アイテム、装備、敵キャラ、ステート のメモ欄に
 *
 * <相手リアクション率: (値)>
 * ※値は百分率
 *
 * 例)
 * <相手リアクション率: 50>
 *  攻撃対象のリアクション発動率を 50% にする
 *
 *
 * 【補足】発動条件スクリプト/発動率スクリプトについて
 * 　スクリプトの中では特定の変数が使える。その説明
 * a
 * 　攻撃者。攻撃を仕掛けたバトラーのクラス。Game_ActorかGame_Enemy
 * b
 * 　被弾者。攻撃を受けたバトラーのクラス。Game_ActorかGame_Enemy
 * c
 * 　RA発動者。リアクションを発動するバトラーのクラス。Game_ActorかGame_Enemy
 * act
 * 　攻撃者スキル。攻撃者の使用したスキル/アイテムのデータオブジェクト
 * 　例)
 * 　act.id      スキルID
 * 　act.scope   攻撃範囲(1-単体 2-全体 3-ランダム)
 *   act.stypeId スキルタイプID。1～
 *   act.damage.elementId  属性ID
 *   act.damage.critical   クリティカルか
 *   act.damage.type       ダメージタイプ(1-HPダメージ 2-MPダメージ 等)
 * react
 * 　RAスキル。リアクションとして発動するスキル/アイテムのデータオブジェクト
 * 例)
 * act.stypeId == 2 && act.damage.type == 1
 * 　攻撃者スキルのスキルタイプIDが2で、かつHPダメージ技の場合のみ発動
 *
 *
 * 【備考】サンプルについて
 * 『リアクション登録』には初期状態でサンプルリアクションが入っている
 * まずは「実行スキル」か「実行アイテム」に好きなものを入れること
 * 後はそのまま使うことができる。好みで改造してみるのも
 * ※サンプルのうち『ものまね』『かばう』は、
 *　実行スキルとアイテムが空のままでも機能する
 *
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 *
 *
 * Freely create reaction skills. Any reaction skill can be realized
 * Reaction skills are skills that activate
 *   in response to the actions of the opponent.
 *
 * ● Features ●
 *
 * ◎You can select the reaction timing "before attack" or "after attack"
 * ◎ Reactions can also be triggered against attacks on allies.
 * ◎ Multiple reactions can be activated at once
 * ◎ Items can also be used as reactions
 * ◎ You can set the state that is given only during the reaction
 * ◎ You can display your favorite pop message when reacting
 * ◎ You can freely set the activation rate and activation conditions
 *   with js expressions
 * ◎ Complete with various settings associated with other reactions
 *
 *
 *
 * ● How to use ●
 *
 * [Step 1] Reaction registration
 * => Plugin parameter →Reaction registration
 *   Freely create and register reactions
 *   Some samples are included in the initial state, so please refer to them.
 * ◎Reactions are basically not triggered when "execution skill"
 *   and "execution item" are empty.
 *, but there are exceptions
 * ▼ If "impersonation" is true, he will be impersonated
 * ▼ If "friend reaction" and "cover" are true,
 *   only his cover will be executed.
 *
 *
 * [Step 2] Apply reaction
 * Actor, Class, Skill, Item, Equipment, Enemy Character, State
 *
 * <reaction: (action name)/(activation rate)>
 *
 * ※ The action name is the one registered in the reaction registration
 *
 * example)
 * <reaction: CutOff>
 *   Reaction "CutOff" is applied
 * <reaction: CutOff Counter>
 *   Reaction "CutOff" and "Counter" is applied
 * <Reaction: Cut off/50 Counter/200>
 *   Reaction "Cut off" and "Counter" are applied
 *   "Cut off" has a probability of base activation rate x 50%,
 *   "Counter" is activated with a probability of base activation rate x 200%
 *
 *
 * [Function] Reaction rate from attacking side
 * You can set skills and states that make it difficult to activate reactions
 * Actor, Class, Skill, Item, Equipment, Enemy Character, State
 *
 * <reactionRate: (value)>
 *
 * ※ Values ​​are percentages
 *
 * example)
 * <reaction Rate 50>
 *   Makes the target's reaction activation rate 50% of his
 *
 *
 * [Function 1] Correct your reaction rate from the memo column
 *   Vary your reaction activation rate
 *   It is possible to create characters, skills, states,
 *   etc. that are easy to trigger reactions
 * Actor, Class, Skill, Item, Equipment, Enemy Character, State
 *
 * <reactionRate: (value)>
 * ※ Values ​​are percentages
 *
 * example)
 * <reactionRate: 50>
 *   Make your reaction activation rate 50% of his
 *
 *
 * [Function 2] Compensation of other party's reaction rate
 *  from the memo column
 *   Vary the reaction activation rate of the opponent from the attacking side
 *   It is possible to create characters, skills, states, etc.
 *   that are difficult to activate reactions
 * Actor, Class, Skill, Item, Equipment, Enemy Character, State
 *
 * <reactionRateOppo: value>
 * ※ Values ​​are percentages
 *
 * example)
 * <reactionRateOppo: 50>
 *   Makes the target's reaction activation rate 50% of his
 *
 *
 * [Supplement] About activation condition script/activation rate script
 * Specific variables can be used in the script. Explanation
 * a
 *  attacker. Batler class that launched an attack. Game_actor or game_enemy
 * b
 * A bullet. Batler class attacked. Game_actor or game_enemy
 * c
 * RA activist. Butler class that activates reaction. Game_actor or game_enemy
 * act
 * Attacker skill. Skill/item data object used by the attacker
 *  example)
 * Act.id skill ID
 * Act.scope attack range (1-single 2-overall 3-random)
 * Act.stypeid skill type ID. 1 ~
 * Act.damage.elementid attribute ID
 * Act.damage.clitical is it critical?
 * Act.damage.type Damage type (1-HP Damage 2-MP Damage, etc.)
 * React
 * RA skill. Skill/item data objects activated as a reaction
 * example)
 * act.stypeId == 2 && act.damage.type == 1
 *   Activated only if the skill type ID of the attacker skill is 2
 *    and it is an HP damage skill.
 *
 *
 * [Remarks] About samples
 * "Reaction registration" contains sample reactions in the initial state
 * First, put whatever you like in "execution skill" or "execution item"
 * After that, you can use it as it is. You can also modify it to your liking.
 * ※ Among the samples, "impersonation" and "cover" are
 *   Works even if execution skills and items are empty
 *
 *
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 *
 *
 *
 * @param 登録
 *
 * @param リアクション登録
 * @parent 登録
 * @desc リアクションを登録する。各メモ欄から <リアクション: アクション名> で呼び出せる
 * @type struct<reaction>[]
 * @default ["{\"アクション名\":\"切り払い\",\"実行スキル\":\"1\",\"/実行アイテム\":\"\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"20\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"100\",\"発動打ち止め\":\"\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"50\",\"…かばう\":\"true\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"true\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"切り払い！\",\"かばうポップ\":\"切り払い！>%3\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1は切り払った！\",\"かばうログ\":\"%1は%3への攻撃を切り払った！\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"50\",\"フリーアニメ\":\"<フリーアニメ: 37, インパクト, -1>\"}","{\"アクション名\":\"瞬間防御\",\"実行スキル\":\"2\",\"/実行アイテム\":\"\",\"/ものまね\":\"\",\"タイミング\":\"前\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"20\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"10\",\"発動打ち止め\":\"\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"50\",\"…かばう\":\"true\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"瞬間防御！\",\"かばうポップ\":\"瞬間防御！>%3\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1はとっさに防御した！\",\"かばうログ\":\"%1は%3をとっさに守った！\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"\"}","{\"アクション名\":\"オートポーション\",\"実行スキル\":\"\",\"/実行アイテム\":\"8\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"b.hp <= b.mhp * 0.75\",\"発動率\":\"30\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"1\",\"発動打ち止め\":\"true\",\"味方リアクション\":\"\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"オートポーション！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1のオートポーション！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}","{\"アクション名\":\"オートリフレッシュ\",\"実行スキル\":\"\",\"/実行アイテム\":\"12\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"b.isRestricted()\",\"発動率\":\"20\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"2\",\"発動打ち止め\":\"true\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"オートリフレッシュ！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1のオートリフレッシュ！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}","{\"アクション名\":\"オートリバイブ\",\"実行スキル\":\"\",\"/実行アイテム\":\"11\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"b.isDead()\",\"発動率\":\"20\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"false\",\"発動順\":\"3\",\"発動打ち止め\":\"true\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"オートリバイブ！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1のオートリバイブ！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}","{\"アクション名\":\"カウンター\",\"実行スキル\":\"1\",\"/実行アイテム\":\"\",\"/ものまね\":\"false\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"30\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"20\",\"発動打ち止め\":\"\",\"味方リアクション\":\"\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"カウンター！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1のカウンター！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}","{\"アクション名\":\"フルカウンター\",\"実行スキル\":\"1\",\"/実行アイテム\":\"\",\"/ものまね\":\"\",\"タイミング\":\"前\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"20\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"100\",\"発動打ち止め\":\"\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"true\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"フルカウンター！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1のフルカウンター！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"\"}","{\"アクション名\":\"動くと撃つ！\",\"実行スキル\":\"1\",\"/実行アイテム\":\"\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"30\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"20\",\"発動打ち止め\":\"\",\"味方リアクション\":\"\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"true\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"動くと撃つ！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1の動くと撃つ！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}","{\"アクション名\":\"アイテム使うな\",\"実行スキル\":\"1\",\"/実行アイテム\":\"\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"DataManager.isItem(act)\",\"発動率\":\"100\",\"…発動率スクリプト\":\"\",\"…発動率固定\":\"\",\"発動順\":\"100\",\"発動打ち止め\":\"true\",\"味方リアクション\":\"\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"true\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"アイテムなぞ使ってんじゃねえ！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"アイテムなぞ使ってんじゃねえ！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 138, フラッシュ, -1>\"}","{\"アクション名\":\"ものまね\",\"実行スキル\":\"\",\"/実行アイテム\":\"\",\"/ものまね\":\"true\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"20\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"20\",\"発動打ち止め\":\"\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"100\",\"…かばう\":\"\",\"…アニメ引き付け\":\"\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"ものまね！\",\"かばうポップ\":\"\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"%1はものまねした！\",\"かばうログ\":\"\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}","{\"アクション名\":\"かばう\",\"実行スキル\":\"\",\"/実行アイテム\":\"\",\"/ものまね\":\"\",\"タイミング\":\"後\",\"発動設定\":\"\",\"相手条件\":\"敵からのみ\",\"…発動条件スクリプト\":\"\",\"発動率\":\"30\",\"…発動率スクリプト\":\"1 + (a.tp / a.maxTp())\",\"…発動率固定\":\"\",\"発動順\":\"30\",\"発動打ち止め\":\"\",\"味方リアクション\":\"true\",\"…味方発動率補正\":\"100\",\"…かばう\":\"true\",\"…アニメ引き付け\":\"true\",\"反応リアクション\":\"\",\"特殊効果\":\"\",\"行動ガード\":\"\",\"/行動キャンセル\":\"\",\"コスト消費\":\"true\",\"RA中ステート-自分\":\"\",\"RA中ステート-敵\":\"\",\"ポップアップとログ\":\"\",\"リアクションポップ\":\"\",\"かばうポップ\":\"かばう！>%3\",\"…ポップアップ設定\":\"\",\"リアクションログ\":\"\",\"かばうログ\":\"%1は%3をかばった！\",\"他プラグイン連携\":\"\",\"バトルウェイト-自分\":\"\",\"バトルウェイト-敵\":\"\",\"フリーアニメ\":\"<フリーアニメ: 137, フラッシュ, -1>\"}"]
 *
 * @param アニメーション
 *
 * @param 出現アニメ登録
 * @parent アニメーション
 * @desc 出現アニメーションを登録する。各ポップ設定から呼び出せる
 * @type struct<appearAnime>[]
 * @default ["{\"アニメ名\":\"小さく出る\",\"アニメ時間\":\"20\",\"ディレイ\":\"\",\"上方レイヤー\":\"\",\"アニメ内容\":\"\",\"スケール\":\"0\",\"スケールターン\":\"\",\"フェードイン\":\"0\"}","{\"アニメ名\":\"大きく出る\",\"アニメ時間\":\"20\",\"ディレイ\":\"\",\"上方レイヤー\":\"true\",\"アニメ内容\":\"\",\"スケール\":\"1.5\",\"スケールターン\":\"\",\"フェードイン\":\"\"}","{\"アニメ名\":\"飛び出る\",\"アニメ時間\":\"30\",\"ディレイ\":\"\",\"上方レイヤー\":\"true\",\"アニメ内容\":\"\",\"スケール\":\"\",\"スケールターン\":\"1.5\",\"フェードイン\":\"\"}","{\"アニメ名\":\"大きく強調\",\"アニメ時間\":\"30\",\"ディレイ\":\"\",\"上方レイヤー\":\"true\",\"アニメ内容\":\"\",\"スケール\":\"\",\"スケールターン\":\"2\",\"フェードイン\":\"\"}"]
 *
 * @param 基本の出現アニメ
 * @parent アニメーション
 * @desc 個別指定しない場合のポップアップ出現時のアニメーション。出現アニメ登録したアニメ名を書く
 * @default 大きく強調
 *
 * @param 標準のアニメ無効
 * @parent アニメーション
 * @desc 標準のダメージポップアニメを無効にする
 * @type boolean
 * @default true
 *
 * @param ポップフォント設定
 *
 * @param ポップフォント
 * @parent ポップフォント設定
 * @desc 使用するフォント。『Keke_CommonData』でフォント登録した名を書く
 * @default
 *
 * @param ポップ文字サイズ
 * @parent ポップフォント設定
 * @desc ポップアップの文字サイズ。空欄ならデータベースで設定した文字サイズ
 * @default 24
 *
 * @param ポップ文字色
 * @parent ポップフォント設定
 * @desc ポップアップの文字色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 0, 0, 0, 1
 *
 * @param ポップ縁取り幅
 * @parent ポップフォント設定
 * @desc ポップアップの縁取り幅。5 なら 5ピクセル
 * @default 7
 *
 * @param ポップ縁取り色
 * @parent ポップフォント設定
 * @desc ポップアップの縁取り色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 255, 176, 255, 1
 *
 * @param ポップその他設定
 *
 * @param ポップ表示時間
 * @parent ポップその他設定
 * @desc ポップアップの表示時間。50 なら 50フレーム
 * @default 120
 *
 * @param ポップ行間調整
 * @parent ポップその他設定
 * @desc ポップアップの行間調整。5 なら 5ピクセル 広げ、-5 なら 5ピクセル 縮める
 * @default 5
 *
 * @param アイコン表示
 * @parent ポップその他設定
 * @desc ポップアップの左にスキルアイコンを表示する
 * @type boolean
 * @default true
 *
 * @param アイコンサイズ
 * @parent ポップその他設定
 * @desc アイコンの大きさ。150 なら 150%、50 なら 50% の大きさになる
 * @default 80
 *
 * @param ポップアップ無効
 * @parent ポップその他設定
 * @desc ポップアップを表示しない
 * @type boolean
 * @default
 *
 * @param かばう設定
 *
 * @param かばう位置X
 * @parent かばう設定
 * @desc かばう移動先のX位置補正。5 なら 右に 5ピクセル ずれる
 * @default -80
 *
 * @param かばう位置Y
 * @parent かばう設定
 * @descかばう移動先のY位置補正。5 なら 下に 5ピクセル ずれる
 * @default 0
 *
 * @param かばう移動時間
 * @parent かばう設定
 * @desc かばう移動(かばう対象の近くへの移動)の所要時間。5 なら 5フレーム
 * @default 12
 *
 * @param かばう持続時間
 * @parent かばう設定
 * @desc かばう移動先に留まる時間。5 なら 5フレーム。プラグイン『Keke_SpeedStarBattle』用
 * @default 40
 */

//==================================================
/*~struct~reaction:
//==================================================
 * @param アクション名
 * @desc リアクションの名前。メモ欄からの呼び出しに使う
 *
 * @param 実行スキル
 * @desc リアクションとして実行するスキル
 * @type skill
 *
 * @param /実行アイテム
 * @desc リアクションとして実行するアイテム
 * @type item
 *
 * @param /ものまね
 * @desc 相手の行動をそのまま返す
 * @type boolean
 * @default 
 *
 * @param タイミング
 * @desc リアクションを繰り出すタイミング
 * @type select
 * @option 前
 * @option 後
 * @default 後
 *
 * @param 発動設定
 * 
 * @param 相手条件
 * @parent 発動設定
 * @desc 敵からの攻撃時のみリアクション発動するか、味方からのみ発動するか、全ての相手に発動するか
 * @type select
 * @option 敵からのみ
 * @option 味方からのみ
 * @option すべての相手
 * @default 敵からのみ
 *
 * @param …発動条件スクリプト
 * @parent 発動設定
 * @desc RA発動条件。js式で記述。a:攻撃者 b:被弾者 c:RA発動者 act:攻撃者スキル(act.idでスキルID) react:RAスキル v:変数
 * @type multiline_string
 * @default 
 *
 * @param 発動率
 * @parent 発動設定
 * @desc リアクションの発動率。百分率。5 なら 5%
 * @type 
 * @default 50
 *
 * @param …発動率スクリプト
 * @parent 発動設定
 * @desc RA発動率補正。js式で記述。a:攻撃者 b:被弾者 c:RA発動者 act:攻撃者スキル(act.idでスキルID) react:RAスキル v:変数
 * @type multiline_string
 * @default 
 * 
 * @param …発動率固定
 * @parent 発動設定
 * @desc 発動率を固定し、攻撃側からのリアクション率の影響を受けなくなる
 * @type boolean
 * @default 
 *
 * @param 発動順
 * @parent 発動設定
 * @desc リアクションの発動順。数値が高いほど先に発動する
 * @default 0
 *
 * @param 発動打ち止め
 * @parent 発動設定
 * @desc このリアクションが発動した時点で、以降のリアクションの発動を打ち止めにする
 * @type boolean
 * @default 
 * 
 * @param 味方リアクション
 * @parent 発動設定
 * @desc 味方への攻撃に対してもリアクションを発動する
 * @type boolean
 * @default 
 *
 * @param …味方発動率補正
 * @parent 発動設定
 * @desc 味方リアクション時の発動率補正。50 なら通常の発動率の 50%
 * @default 100
 *
 * @param …かばう
 * @parent 発動設定
 * @desc 味方リアクション時、本来のターゲットの代わりに自分がターゲットになる
 * @type boolean
 * @default 
 *
 * @param …アニメ引き付け
 * @parent 発動設定
 * @desc かばうの際、アニメーションも自分の方に表示する
 * @type boolean
 * @default 
 *
 * @param 反応リアクション
 * @parent 発動設定
 * @desc ターゲットに関係なく相手の行動に大してリアクションを発動する
 * @type boolean
 * @default 
 * 
 * @param 特殊効果
 * 
 * @param 行動ガード
 * @parent 特殊効果
 * @desc 相手の行動の効果を無効化する(エフェクトは表示される)
 * @type boolean
 * @default 
 *
 * @param /行動キャンセル
 * @parent 特殊効果
 * @desc 相手の行動のキャンセルする(エフェクトも表示されない)
 * @type boolean
 * @default 
 *
 * @param コスト消費
 * @parent 特殊効果
 * @desc MPやTP、アイテムの個数などを消費する
 * @type boolean
 * @default true
 *
 * @param RA中ステート-自分
 * @parent 特殊効果
 * @desc リアクション中のみ自分にかけるステート。5 なら iD5 のステート
 * @type state
 * @default 
 *
 * @param RA中ステート-敵
 * @parent 特殊効果
 * @desc リアクション中のみ敵側にかけるステート。5 なら iD5 のステート
 * @type state
 * @default 
 * 
 * @param 回数分繰り返し
 * @parent 特殊効果
 * @desc 相手の行動の連続回数分だけリアクションも繰り返す
 * @type boolean
 *
 * @param ポップアップとログ
 * 
 * @param リアクションポップ
 * @parent ポップアップとログ
 * @desc リアクション発動時に表示するポップアップ。%1:発動者, %2:スキル
 *
 * @param かばうポップ
 * @parent ポップアップとログ
 * @desc かばう発動時に表示するポップアップ。%1:発動者, %2:スキル, %3:かばう対象
 *
 * @param …ポップアップ設定
 * @parent ポップアップとログ
 * @desc ポップアップの設定
 * @type struct<popCfg>
 *
 * @param リアクションログ
 * @parent ポップアップとログ
 * @desc リアクション発動時に表示するログメッセージ。%1:発動者, %2:スキル
 *
 * @param かばうログ
 * @parent ポップアップとログ
 * @desc かばう発動時に表示するログメッセージ。%1:発動者, %2:スキル, %3:かばう対象
 *
 * @param 他プラグイン連携
 * 
 * @param バトルウェイト-自分
 * @parent 他プラグイン連携
 * @desc 自分のバトルウェイトの増減補正。50 なら 50%。プラグイン『Keke_SpeedStarBattle』用
 *
 * @param バトルウェイト-敵
 * @parent 他プラグイン連携
 * @desc 敵側のバトルウェイトの増減補正。50 なら 50%。プラグイン『Keke_SpeedStarBattle』用
 *
 * @param フリーアニメ
 * @parent 他プラグイン連携
 * @desc フリーアニメを再生する。メモ欄同様に記述。プラグイン『Keke_FreeAnime』が必要
 * @type multiline_string
 */

//==================================================
/*~struct~invokeCondition:
//==================================================
 * @param 相手条件
 * @desc 敵からの攻撃時のみリアクション発動するか、味方からのみ発動するか、全ての相手に発動するか
 * @type select
 * @option 敵からのみ
 * @option 味方からのみ
 * @option すべての相手
 * @default 敵からのみ
 * 
 * @param 条件リスト
 * @desc 実行条件のリスト。バトラーの能力値や状態、変数など
 * @type struct<battlerCondition>[]
 */

//==================================================
/*~struct~battlerCondition:
//==================================================
 * @param バトラー
 * @desc 条件とするバトラー
 * @type select
 * @option リアクション発動者
 * @option 被弾した者
 * @option 攻撃した者
 * @default リアクション発動者
 * 
 * @param 条件-能力値
 * @desc 条件とする能力値。バトラークラスの変数名を書く。atk、def など
 * 
 * @param /条件-変数
 * @desc 条件とする変数
 * @type variable
 * 
 * @param 比較演算子
 * @desc 条件と値の比較演算子
 * @type select
 * @option ==
 * @option >
 * @option >=
 * @option <
 * @option <=
 * @option !=
 * @default >=
 * 
 * @param 値
 * @desc 条件と比較する値・* / % を先頭につけて演算可能。*2 なら 能力値の 2倍 など
 * 
 * @param …値-能力値
 * @desc 値を能力値で指定。。バトラークラスの変数名を書く。atk、def など
 * 
 * @param …値-変数
 * @desc  値を変数で指定
 * 
 * @param 関数条件
 * @desc バトラークラスの関数を条件とする。isDead、isRestricted、isAlive など
 */

//==================================================
/*~struct~popCfg:
//==================================================
 * @param フォント
 * @desc 使用するフォント。『Keke_CommonData』でフォント登録しそのフォント名を書く。空欄ならメインフォント
 * @default 
 * 
 * @param 文字サイズ
 * @desc ポップアップの文字サイズ。空欄だと標準サイズ。+1 で標準サイズ + 1、-1 で標準サイズ - 1
 * @default
 *
 * @param 文字色
 * @desc ポップアップの文字色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 *
 * @param 縁取り幅
 * @desc ポップアップの縁取り幅。5 なら 5ピクセル。+1 で 標準 + 1ピクセル、-1 で 標準 - 1ピクセル 
 * @default 
 *
 * @param 縁取り色
 * @desc ポップアップの縁取り色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 * 
 * @param 出現アニメ
 * @desc ポップアップ出現時のアニメーション。出現アニメ登録したアニメ名を書く
 * @default 
 * 
 * @param 無効
 * @desc ポップアップを表示しない
 * @type boolean
 * @default 
 */

//==================================================
/*~struct~appearAnime:
//==================================================
 * @param アニメ名
 * @desc アニメーションの名前。各ポップ設定からの呼び出しに使う
 *
 * @param アニメ時間
 * @desc アニメの実行時間。5 なら 5フレーム
 * @default 15
 * 
 * @param ディレイ
 * @desc アニメ開始を遅らせる。5 なら 5フレーム 待ってから開始
 * @default 
 * 
 * @param 上方レイヤー
 * @desc 通常より上のレイヤーに配置する
 * @type boolean
 * @default 
 * 
 * @param アニメ内容
 * 
 * @param スケール
 * @parent アニメ内容
 * @desc 拡縮アニメ。2 なら サイズ2倍→1倍、0.5 なら サイズ0.5倍→1倍
 * @default 
 * 
 * @param スケールターン
 * @parent アニメ内容
 * @desc 拡縮アニメ-往復。2 なら サイズ1倍→2倍→1倍。0.5 なら サイズ1倍→0.5倍→1倍
 * @default 
 * 
 * @param フェードイン
 * @parent アニメ内容
 * @desc 不透明度アニメ。50 なら 不透明度50→255
 * @default
 * 
 
 * 
 
 */

;(() => {
	//- プラグイン名
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1]

	//==================================================
	//--  スプライト追加 /ベーシック
	//==================================================

	//- 破棄付きスプライト
	function SpriteKeRask() {
		this.initialize(...arguments)
	}

	SpriteKeRask.prototype = Object.create(Sprite.prototype)
	SpriteKeRask.prototype.constructor = SpriteKeRask

	SpriteKeRask.prototype.destroy = function () {
		if (this.bitmap && !this.bitmap._url) {
			this.bitmap.destroy()
		}
		if (this._texture) {
			Sprite.prototype.destroy.apply(this)
		}
	}

	//==================================================
	//--  文字列オート変換 /ベーシック
	//==================================================

	//- 文字列のハッシュ化
	function strToHash(str) {
		if (!str || !str.length) {
			return {}
		}
		let hash = {}
		const strs = JSON.parse(str)
		let val = null
		let val2 = null
		for (let key in strs) {
			val = strs[key]
			if (!key || !val) {
				continue
			}
			val2 = strToAuto(val, key)
			hash[key] = val2
		}
		return hash
	}

	//- 文字列のリスト化
	function strToList(str) {
		if (!str || !str.length) {
			return []
		}
		let array = JSON.parse(str)
		return array.map((val, i) => {
			return strToAuto(val)
		})
	}

	//- 文字列の自動処理
	function strToAuto(val, key = '') {
		let val2 = null
		let match = null
		let end = false
		if (!end) {
			if (val[0] == '{') {
				val2 = strToHash(val)
				end = true
			}
		}
		if (!end) {
			if (val[0] == '[') {
				val2 = strToList(val)
				end = true
			}
		}
		if (!end) {
			val = val + ','
		}
		if (!end) {
			match = val.match(/^\s*(-?\d+,\s*-?\d+,\s*-?\d+,?\s*-?\d*\.?\d*)\s*,$/)
			if (match && !val.match(/[^\d\.\-,\s]/)) {
				if (
					key.match(/(カラー|色|塗り)/) &&
					!key.includes('トーン') &&
					!key.includes('ブレンド') &&
					!key.includes('配色') &&
					!key.includes('着色') &&
					!key.includes('フラッシュ') &&
					!key.includes('チェンジ') &&
					!key.includes('選択')
				) {
					val2 = 'rgba(' + match[1] + ')'
				} else {
					val2 = JSON.parse('[' + match[1] + ']')
				}
				end = true
			}
		}
		if (!end) {
			match = val.match(/(-?\d+\.?\d*),\s*/g)
			if (match && match.length >= 2 && !val.match(/[^\d\.\-,\s]/)) {
				val2 = JSON.parse('[' + match.reduce((r, s) => r + s).replace(/,$/, '') + ']')
				end = true
			}
		}
		if (!end) {
			match = val.match(/^(true|false)\s*,/)
			if (match) {
				val2 = match[1] == 'true' ? true : false
				end = true
			}
		}
		if (!end) {
			match = val.match(/^(-?\d+\.?\d*)\s*,/)
			if (match && !val.match(/[a-z]/)) {
				val2 = Number(match[1])
				end = true
				end = true
			}
		}
		if (!end) {
			if (val[0] == '"') {
				val = val.slice(1)
			}
			val2 = val.slice(0, -1)
		}
		return val2
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

	let parameters = PluginManager.parameters(pluginName)

	//- 登録
	const keke_reactionList = strToList(parameters['リアクション登録'])

	//- アニメーション
	const keke_appearAnimeList = strToList(parameters['出現アニメ登録'])
	const keke_appearAnimeBasic = parameters['基本の出現アニメ']
	const keke_noDefoAnime = toBoolean(parameters['標準のアニメ無効'])

	//- ポップフォント設定
	const keke_fontFace = parameters['ポップフォント']
	const keke_fontSize = Number(parameters['ポップ文字サイズ'])
	const keke_fontColor = 'rgba(' + parameters['ポップ文字色'] + ')'
	const keke_outWidth = Number(parameters['ポップ縁取り幅'])
	const keke_outColor = 'rgba(' + parameters['ポップ縁取り色'] + ')'

	//- ポップその他設定
	const keke_popShowTime = Number(parameters['ポップ表示時間'])
	const keke_paddingOffset = Number(parameters['ポップ行間調整'])
	const keke_showIcon = toBoolean(parameters['アイコン表示'])
	const keke_iconSize = Number(parameters['アイコンサイズ'])
	const keke_popupInvalid = toBoolean(parameters['ポップアップ無効'])

	//- かばう設定
	const keke_subX = Number(parameters['かばう位置X'])
	const keke_subY = Number(parameters['かばう位置Y'])
	const keke_subMoveTime = Number(parameters['かばう移動時間'])
	const keke_subKeepTime = Number(parameters['かばう持続時間'])

	parameters = null

	//==================================================
	//--  公開
	//==================================================

	//- リアクション中か
	Game_Party.prototype.inReactionKe = function () {
		return this._inReactionKe
	}

	//==================================================
	//--  他プラグイン連携
	//==================================================

	//- 文字サイズ率の取得
	function getFontSizeRate(fontName) {
		if (!fontName || !$gameTemp._fontListKe) {
			return { width: 1, half: 1 }
		}
		let widthSize = 1
		let halfSize = 1
		// フォントリスト展開
		for (const data of $gameTemp._fontListKe) {
			// 名前が適合したら取得
			if (data['フォント名'] == fontName) {
				widthSize = data['横幅サイズ'] || 1
				halfSize = data['半角サイズ'] || 1
				break
			}
		}
		return { width: widthSize, half: halfSize }
	}

	//==================================================
	//--  共通処理
	//==================================================

	// リアクション用変数
	let reactionQueues = { pre: [], after: [] }
	let currentQueue = null
	let oriSubject = null
	let oriAction = null
	let subUser = null
	let selfState = null
	let oppoState = null
	let popBattlers = []

	//- スタートアクション(コア追加)
	const _BattleManager_startAction = BattleManager.startAction
	BattleManager.startAction = function () {
		// リアクションの開始
		if (startReaction()) {
			return
		}
		_BattleManager_startAction.apply(this)
		// 本来の行動者が行動したら保存を消去
		if (oriSubject && isSameBattler(oriSubject, this._subject)) {
			oriSubject = null
		}
	}

	//- エンドアクション(コア追加)
	const _BattleManager_endAction = BattleManager.endAction
	BattleManager.endAction = function () {
		// リアクションポップ中フラグを解除
		popBattlers.forEach((battler) => {
			battler._inReactionPopKe = null
		})
		popBattlers = []
		_BattleManager_endAction.apply(this)
		// リアクションの終了
		endReaction()
	}

	//- インヴォークアクション(コア追加)
	const _BattleManager_invokeAction = BattleManager.invokeAction
	BattleManager.invokeAction = function (subject, target) {
		// スピードスターバトル時の通常インヴォークアクション
		if (isSpeedStar() && !this._invokePopWaitKe) {
			_BattleManager_invokeAction.apply(this, arguments)
			return
		}
		// かばうの適用
		target = applySubstitute(subject, target)
		// 行動がガードされる時はリターン
		let guarded = false
		if (subject._isGuardedBattlersKe) {
			// ガードされるか
			guarded = isGuarded(subject, target)
		}
		if (!guarded) {
			_BattleManager_invokeAction.apply(this, arguments)
		}
		// 各種解除の更新
		updateRemEach(subject)
		// バグ防止のため時間をおいてもう1回
		//setTimeout(updateRemEach, 100, subject);
	}

	//- ガードされるか
	function isGuarded(subject, target) {
		if (!subject._isGuardedBattlersKe || !subject._isGuardedBattlersKe.length) {
			return false
		}
		return subject._isGuardedBattlersKe.find((b) => isSameBattler(getBattlerByData(b), target))
	}

	//- 各種解除の更新
	function updateRemEach(subject, force) {
		const bm = BattleManager
		if (!force && bm._targets && bm._targets.length) {
			return
		}
		if (!force && bm._skillChainsKe && bm._skillChainsKe.length) {
			return
		}
		if (!force && subject._popWaitingKe) {
			return
		}
		// ガードされるバトラーを消去
		subject._isGuardedBattlersKe = null
		// RA中ステートの解除
		remReactionState(subject)
		// リアクションバトラーを展開
		let battlers = subject._reactBattlersKe
			? subject._reactBattlersKe.map((d) => getBattlerByData(d))
			: []
		battlers.push(subject)
		battlers.forEach((battler) => {
			//const battler = getBattlerByData(data);
			// リアクションバトラーフラグを解除
			if (battler._isReactBattlerKe) {
				battler._isReactBattlerKe.on = false
			}
			// かばう対象を検索
			if (battler._subTargetsKe && battler._subTargetsKe.length) {
				battler._subTargetsKe.forEach((data) => {
					// かばう発動者の解除
					remSubSubject(getBattlerByData(data))
				})
				battler._subTargetsKe = []
			}
		})
	}

	//==================================================
	//-- リアクションの起動
	//==================================================

	//- リアクションの開始
	function startReaction() {
		if ($gameParty.inReactionKe()) {
			return
		}
		let result = false
		// リアクション中フラグのセット
		setInReaction()
		// リアクションの準備
		const d = prepareReaction()
		const subject = d.subject
		const action = d.action
		const targets = d.targets
		const reactBattlers = []
		// アクションがリアクションならリターン
		if (action._isReactionKe) {
			return
		}
		// 相手リアクション率の取得
		let reactRateOppo = getReactionRateOppo(subject, action)
		// 前回の各種解除の更新
		updateRemEach(subject, true)
		// 自分のリアクション
		targets.forEach((target) => {
			// 全リアクションの検索
			const reactions = searchReactionAll(subject, target, action)
			// リアクションの追加
			if (addReaction(subject, action, d, reactions, target, reactRateOppo, reactBattlers)) {
				result = true
			}
			/*if (!reactions || !reactions.length) { return; }
            // 自分リアクション率の取得
            const reactRate = getReactionRateSelf(target, null) * (reactRateOppo / 100);
            reactions.forEach(reaction => {
                // リアクションキューのセット
                const queue = setReactionQueue(reaction, target, subject, action, reactRate, null, d.oriTargets);
                // 前リアクションならリターン予約
                if (queue && (reaction["タイミング"] == "前" || reaction["/行動キャンセル"])) { result = true; }
            });
            reactBattlers.push(target);*/
		})
		// 味方のリアクション
		targets.forEach((target) => {
			// 味方のリアクションを検索
			const rs = searchFriendReaction(target, subject, action, reactBattlers)
			if (!rs || !rs.length) {
				return
			}
			rs.forEach((r) => {
				const reactions = r.reactions
				const user = r.user
				// リアクションの追加-味方リアクション
				if (
					addReaction(subject, action, d, reactions, user, reactRateOppo, reactBattlers, target)
				) {
					result = true
				}
				/* 自分リアクション率の取得
                const reactRate = getReactionRateSelf(user, null) * (reactRateOppo / 100);
                reactions.forEach(reaction => {
                    // リアクションキューのセット
                    const queue = setReactionQueue(reaction, user, subject, action, reactRate, target, d.oriTargets);
                    // 前リアクションならリターン予約
                    if  (queue && (reaction["タイミング"] == "前" || reaction["/行動キャンセル"])) { result = true; }
                });
                reactBattlers.push(user);*/
			})
		})
		// 反応リアクション
		const members = subject._actorId ? $gameTroop.aliveMembers() : $gameParty.aliveMembers()
		members.forEach((target) => {
			// 全アクションを検索-反応リアクション
			const reactions = searchReactionAll(subject, target, action, null, true)
			// リアクションの追加
			if (addReaction(subject, action, d, reactions, target, reactRateOppo, reactBattlers)) {
				result = true
			}
		})
		// キューの追加処理
		processQueueAdd()
		// リアクションがあるなら本来の行動者を保存
		if (reactionQueues.on) {
			oriSubject = subject
			// リアクションバトラーを保存
			subject._reactBattlersKe = reactBattlers.map((b) => getBattlerData(b))
		}
		// !前キューがなければリターン差し止め
		if (!reactionQueues.pre.length) {
			result = false
		}
		return result
	}

	//- リアクションの追加
	function addReaction(
		subject,
		action,
		d,
		reactions,
		user,
		reactRateOppo,
		reactBattlers,
		subTarget
	) {
		if (!reactions || !reactions.length) {
			return false
		}
		let result = false
		// 自分リアクション率の取得
		const reactRate = getReactionRateSelf(user, null) * (reactRateOppo / 100)
		reactions.forEach((reaction) => {
			// リアクションキューのセット
			const queue = setReactionQueue(
				reaction,
				user,
				subject,
				action,
				reactRate,
				subTarget,
				d.oriTargets
			)
			// 前リアクションならリターン予約
			if (queue && (reaction.data['タイミング'] == '前' || reaction.data['/行動キャンセル'])) {
				result = true
			}
		})
		reactBattlers.push(user)
		return result
	}

	//- リアクションの準備
	function prepareReaction() {
		let d = {}
		const bm = BattleManager
		d.subject = bm._subject
		d.action = d.subject.currentAction()
		// ターゲットを保存
		const oriTargets = d.action.makeTargets()
		d.oriTargets = oriTargets.map((t) => getBattlerData(t))
		// リアクション用ターゲット
		d.targets = Array.from(new Set(oriTargets))
		// 本来のアクションを保存
		oriAction = d.subject.currentAction()
		// 前回の使用データを消去
		subUser = null
		// 行動者のリアクション実行中フラグを解除
		d.subject._doingReactionKe = null
		return d
	}

	//- 自分リアクション率の取得
	function getReactionRateSelf(subject, action) {
		// 全てのメタの取得-数値リスト
		const nums = getAllMetaNums(
			subject,
			['リアクション率', '自分リアクション率', 'reactRate', 'reactRateSelf'],
			action
		)
		if (!nums || !nums.length) {
			return 100
		}
		let rate = 100
		nums.forEach((num) => {
			rate *= num / 100
		})
		return Math.round(rate)
	}

	//- 相手リアクション率の取得
	function getReactionRateOppo(subject, action) {
		// 全てのメタの取得-数値リスト
		const nums = getAllMetaNums(subject, ['相手リアクション率', 'reactRateOppo'], action)
		if (!nums || !nums.length) {
			return 100
		}
		let rate = 100
		nums.forEach((num) => {
			rate *= num / 100
		})
		return Math.round(rate)
	}

	//- 全リアクションの検索
	function searchReactionAll(subject, user, action, subTarget, reflect) {
		let reactions = []
		// 前リアクションの検索
		let list = searchReaction('前', subject, user, action, subTarget, reflect)
		if (list) {
			reactions = [...reactions, ...list]
		}
		// 後リアクションの検索
		list = searchReaction('後', subject, user, action, subTarget, reflect)
		if (list) {
			reactions = [...reactions, ...list]
		}
		return reactions
	}

	//- リアクションの検索
	function searchReaction(phase, subject, user, action, subTarget, reflect) {
		// リアクションの取得
		let reactions = getReactions(user)
		if (!reactions || !reactions.length) {
			return
		}
		// リアクションの実行判定
		reactions = reactions.filter((reaction) =>
			judgeReaction1(reaction, user, phase, subTarget, reflect)
		)
		if (!reactions || !reactions.length) {
			return
		}
		return reactions
	}

	// 味方のリアクションを検索
	function searchFriendReaction(user, subject, action, reactBattlers) {
		// 味方グループを取得
		let groop = user._actorId ? $gameParty.aliveMembers() : $gameTroop.aliveMembers()
		groop = groop.filter((b) => b.isAlive() && !isSameBattler(b, user))
		// グループ全員を検索
		let rs = []
		for (let battler of groop) {
			if (reactBattlers && reactBattlers.some((b) => isSameBattler(b, battler))) {
				return
			}
			// 全リアクションの検索
			let reactions = searchReactionAll(subject, battler, battler, user)
			if (!reactions || !reactions.length) {
				continue
			}
			rs.push({ user: battler, reactions: reactions })
		}
		return rs
	}

	//- リアクションの取得
	function getReactions(target) {
		// 全てのメタの取得-文字列リスト
		let strs = getAllMetaStrs(target, ['リアクション', 'reaction'])
		if (!strs || !strs.length) {
			return null
		}
		const args = []
		// 名前と確率を取得
		strs.forEach((str) => {
			const ss = str.split('/')
			args.push({ name: ss[0], rate: ss[1] ? Number(ss[1]) : 100 })
		})
		// 重複を削除
		const args2 = []
		args.forEach((arg) => {
			if (args2.some((a) => a.name == arg.name)) {
				return
			}
			args2.push(arg)
		})
		// データを取得
		const args3 = []
		args2.forEach((arg) => {
			const reaction = keke_reactionList.find((d) => d['アクション名'] == arg.name)
			if (!reaction) {
				return
			}
			args3.push({ data: reaction, per: arg.rate })
		})
		return args3
	}

	//- リアクションの実行判定1
	function judgeReaction1(reactionData, user, phase, subTarget, reflect) {
		const reaction = reactionData.data
		// 行動可能か
		if (!user.isAlive() || user.isRestricted()) {
			return false
		}
		// タイミング
		const timing = reaction['タイミング']
		if ((timing == '前' || timing == '一方的') && phase != '前') {
			return
		}
		if (timing == '後' && phase != '後') {
			return
		}
		// 通常リアクション判定
		if (!subTarget && !reflect) {
			if (reaction['反応リアクション']) {
				return false
			}
			// 味方リアクション判定
		} else if (subTarget && !reflect) {
			if (!reaction['味方リアクション']) {
				return false
			}
			if (reaction['反応リアクション']) {
				return false
			}
		} else if (reflect && !subTarget) {
			if (!reaction['反応リアクション']) {
				return false
			}
		}
		return true
	}

	//- リアクションの実行判定2
	function judgeReaction2(queue, subject, user, action, subTarget, isHead) {
		// 先行判定済みならリターン
		if (queue.judged) {
			return true
		}
		// 行動ガード・行動キャンセル・かばう時のみ先行判定
		if (isHead) {
			if (!queue.actGuard && !queue.actCancel && !queue.isSubstitute) {
				return true
			}
			// 先行判定済みフラグ
			queue.judged = true
		}
		// 行動可能か
		if (!user.isAlive() || user.isRestricted()) {
			return false
		}
		// スクリプト用変数
		const a = user
		const b = subTarget || user
		const c = subject
		const act = oriAction ? oriAction.item() || {} : {}
		const react = action.item() || {}
		const v = $gameVariables._data
		// 相手条件
		if (queue.byCondition) {
			const bc = queue.byCondition
			const opp = isByOpponent(subject, user)
			const frd = !opp
			if (bc == '敵からのみ' && !opp) {
				return false
			}
			if (bc == '味方からのみ' && !frd) {
				return false
			}
		}
		// 発動条件スクリプト
		if (queue.conditionScript) {
			const cs = queue.conditionScript
			const r = newFunc(cs, a, b, c, act, react, v)
			if (!r) {
				return false
			}
		}
		// 発動率
		let reactRate = queue.reactRate
		const reactRevise = queue.perRevise != null ? queue.perRevise / 100 : 1
		reactRate = reactRate != null && !queue.perFix ? reactRate / 100 : 1
		let per = Number(queue.per) * reactRevise * reactRate
		if (queue.perScript) {
			const ps = queue.perScript
			per *= newFunc(ps, a, b, c, act, react, v)
		}
		per = Math.round((per * queue.per2) / 100)
		if (per != null) {
			if (Math.randomInt(100) >= per) {
				return false
			}
		}
		// コストが足りるか
		if (queue.payCost) {
			const item = action.item()
			if (item) {
				if (!user.canUse(item)) {
					return false
				}
			}
		}
		return true
	}

	//- ニューファンク
	let funcs = {}

	function newFunc(str, a, b, c, act, react, v) {
		if (!funcs[str]) {
			funcs[str] = new Function('a', 'b', 'c', 'act', 'react', 'v', 'return ' + str)
			return funcs[str](a, b, c, act, react, v)
		} else {
			return funcs[str](a, b, c, act, react, v)
		}
	}

	//- 発動条件の判定
	/*function judgeConditions(condition, subject, user, subTarget) {
        if (!condition) { return true; }
        const opp = isByOpponent(subject, user);
        const frd = !opp;
        if (condition["相手条件"] == "敵からのみ" && !opp) { return false; }
        if (condition["相手条件"] == "味方からのみ" && !frd) { return false; }
        if (!conditionList(condition["条件リスト"], subject, user, subTarget)) { return false; }
        return true;
    };*/

	//- 条件リスト
	function conditionList(cons, subject, user, subTarget) {
		if (!cons || !cons.length) {
			return true
		}
		for (let con of cons) {
			// バトラー
			const bn = con['バトラー']
			const battler = bn == '攻撃した者' ? subject : bn == '被弾した者' ? subTarget || user : user
			// 条件
			const param = con['条件-能力値']
				? battler[con['条件-能力値']]
				: con['/条件-変数']
					? $gameVariables.value(con['/条件-変数'])
					: null
			const ope = con['比較演算子']
			// 値
			const valParam = con['…値-能力値'] ? battler[con['…値-能力値']] || 0 : 0
			const valVar = con['…値-変数'] ? $gameVariables.value(con['…値-変数']) || 0 : 0
			const valTotal = valParam + valVar
			const match = con['値'] ? con['値'].toString().match(/[\+\*\/\%]/) : null
			const numOpe = match ? match[0] : ''
			const val2 = con['値'] ? Number(con['値'].toString().replace(/[\+\*\/\%]/g, '')) : 0
			let val = 0
			if (!valTotal) {
				val = val2
			} else {
				if (numOpe == '*') {
					val = valTotal * val2
				} else if (numOpe == '/') {
					val = valTotal / val2
				} else if (numOpe == '%') {
					val = valTotal % val2
				} else {
					val = valTotal + val2
				}
			}
			// 数値比較
			if (!numComparison(param, val, ope)) {
				return false
			}
			// 関数条件
			if (con['関数条件']) {
				const mn = con['関数条件']
				if (typeof battler[mn] == 'function') {
					return battler[mn]()
				}
			}
		}
		return true
	}

	//- 数値比較
	function numComparison(v1, v2, ope) {
		if (v1 == null || v2 == null || ope == null) {
			return true
		}
		v1 = Number(v1)
		v2 = Number(v2)
		if (ope == '==' || ope == '=') {
			return v1 == v2
		} else if (ope == '>') {
			return v1 > v2
		} else if (ope == '>=') {
			return v1 >= v2
		} else if (ope == '<') {
			return v1 < v2
		} else if (ope == '<=') {
			return v1 <= v2
		} else if (ope == '!=') {
			return v1 != v2
		}
		return true
	}

	//- 敵からの行動か
	function isByOpponent(subject, target) {
		let result = false
		if (subject._actorId && target._enemyId) {
			result = true
		}
		if (subject._enemyId && target._actorId) {
			result = true
		}
		return result
	}

	//- リアクションキューのセット
	function setReactionQueue(reactionData, user, subject, action, reactRate, subTarget, oriTargets) {
		const reaction = reactionData.data
		// 実行アクションを取得
		let skillId = reaction['実行スキル']
		let itemId = reaction['/実行アイテム']
		if (reaction['/ものまね']) {
			const item = action.item()
			const isSkill = action._item.isSkill()
			if (isSkill) {
				skillId = item.id
				itemId = null
			} else {
				itemId = item.id
				skillId = null
			}
		}
		// キューを作成
		const queue = { subject: subject, user: user, reactRate: reactRate, subTarget: subTarget }
		// 名前
		queue.name = reaction['アクション名']
		// アクション作成
		queue.action = new Game_Action(user)
		// 使用スキル/アイテム
		if (skillId) {
			queue.action.setSkill(skillId)
		} else if (itemId) {
			queue.action.setItem(itemId)
		}
		// タイミング
		queue.timing = reaction['タイミング'] || '後'
		// 相手条件
		queue.byCondition = reaction['相手条件']
		// 発動条件スクリプト
		queue.conditionScript = reaction['…発動条件スクリプト']
		// 発動率
		queue.per = reaction['発動率']
		queue.per2 = reactionData.per
		queue.perScript = reaction['…発動率スクリプト']
		queue.perRevise = reaction['…味方発動率補正']
		queue.perFix = reaction['…発動率固定']
		// 発動順
		queue.order = reaction['発動順'] || 0
		// 打ち止め
		queue.stopsAfter = reaction['発動打ち止め']
		// 行動ガード
		queue.actGuard = reaction['行動ガード']
		queue.actCancel = reaction['/行動キャンセル']
		// コスト消費
		queue.payCost = reaction['コスト消費']
		// RA中ステート
		queue.stateSelf = reaction['RA中ステート-自分']
		queue.stateOpp = reaction['RA中ステート-敵']
		// 回数分繰り返し
		queue.repeatNum = reaction['回数分繰り返し'] ? action.item().repeats || 1 : 1
		// かばう
		queue.isSubstitute = subTarget && reaction['…かばう'] && isNeedSubstitute(user, subTarget)
		queue.subX = keke_subX
		queue.subY = keke_subY
		queue.subMoveTime = keke_subMoveTime
		queue.subKeepTime = keke_subKeepTime
		queue.attractsAnime = reaction['…アニメ引き付け']
		// リアクションポップ
		queue.reactionPop = reaction['リアクションポップ'] || ''
		const popCfg = reaction['…ポップアップ設定'] || {}
		queue.popCfg = popCfg
		queue.popFontFace = popCfg['フォント'] || keke_fontFace
		queue.popFontEachSize = getFontSize(popCfg['文字サイズ'])
		queue.popFontBaseSize = getFontSize(keke_fontSize)
		queue.popFontColor = popCfg['文字色'] || keke_fontColor || 'rgba(255, 208, 255, 1)'
		queue.popOutW = getOutWidth(popCfg['縁取り幅'])
		queue.popOutColor = popCfg['縁取り色'] || keke_outColor || 'rgba(0, 0, 0, 1)'
		queue.popInvalid = popCfg['無効'] != null ? popCfg['無効'] : keke_popupInvalid
		// リアクションログ
		queue.reactionLog = reaction['リアクションログ'] || ''
		// かばうメッセージ
		if (queue.isSubstitute) {
			queue.substitutePop = reaction['かばうポップ'] || ''
			queue.substituteLog = reaction['かばうログ'] || ''
		}
		// バトルウェイト補正
		queue.bwReviseOpp = reaction['バトルウェイト-敵'] != null ? reaction['バトルウェイト-敵'] : 100
		queue.bwReviseSelf =
			reaction['バトルウェイト-自分'] != null ? reaction['バトルウェイト-自分'] : 100
		// フリーアニメ
		queue.freeAnime = reaction['フリーアニメ']
		// かばうでなく、アクションもないならリターン
		if (!queue.isSubstitute && !queue.action.item()) {
			return
		}
		// 現在のアクションステートを保存
		queue.oriActionState = user._actionState
		queue.oriTpbState = user._tpbState
		// キューの挿入
		for (let i = 0; i < queue.repeatNum; i++) {
			insertQueue(queue)
		}
		// 元のアクションを保存
		saveOriAction(queue, user, subject, action, queue.timing, oriTargets)
		// リアクションバトラーフラグをオン
		if (!user._isReactBattlerKe) {
			user._isReactBattlerKe = { count: 0 }
		}
		user._isReactBattlerKe.on = true
		user._isReactBattlerKe.count += 1
		// 発動者のリアクション打ち止めフラグをオフ
		user._stopsReactionKe = null
		// キュー実行済みフラグをオフ
		didQueue = null
		// フラグを進める
		if (queue.timing == '前') {
			queue.pre = 1
		} else if (queue.timing == '後') {
			queue.after = 1
		}
		return queue
	}

	//- キューの挿入
	function insertQueue(queue) {
		const timing = queue.timing
		if (timing == '前') {
			reactionQueues.pre.push(queue)
		} else if (timing == '後') {
			reactionQueues.after.push(queue)
		}
	}

	//- 元のアクションを保存
	function saveOriAction(queue, target, subject, action, timing, oriTargets) {
		// 行動者のターゲットを保存
		action._targetsKeRask = oriTargets
		// セット
		queue.ori = {
			target: target,
			targetAction: target.currentAction(),
			subject: subject,
			subjectAction: action
		}
	}

	//- 作成したターゲットの復元(コア追加)
	const _Game_Action_makeTargets = Game_Action.prototype.makeTargets
	Game_Action.prototype.makeTargets = function () {
		if (this._targetsKeRask) {
			return this._targetsKeRask.map((d) => getBattlerByData(d))
		}
		return _Game_Action_makeTargets.apply(this)
	}

	//- キューの追加処理
	function processQueueAdd() {
		const qs = reactionQueues
		const preQueue = qs.pre[0]
		// キューの実行判定2
		qs.pre = qs.pre.filter((queue) =>
			judgeReaction2(queue, queue.subject, queue.user, queue.action, queue.subTarget, true)
		)
		qs.after = qs.after.filter((queue) =>
			judgeReaction2(queue, queue.subject, queue.user, queue.action, queue.subTarget, true)
		)
		// 前キューがなくなった場合は本来のアクションの復元
		/*if (preQueue && !qs.pre.length) {
            restoreOriAction(preQueue);
        }*/
		// キューの有効判定
		if (qs.pre.length || qs.after.length) {
			qs.on = true
		} else {
			qs.on = false
		}
		if (!qs.on) {
			return
		}
		// 発動順を適用
		qs.pre.sort((a, b) => b.order - a.order)
		qs.after.sort((a, b) => b.order - a.order)
		// キューを全て統合
		let total = [...qs.pre, ...qs.after]
		// 行動ガードの処理
		total.forEach((queue) => {
			processActGuard(queue)
		})
		// かばう発動者の選択
		subQueue = choiceSubstituteUser(total)
		// かばうの処理
		if (subQueue) {
			processSubstitute(subQueue)
		}
		// バトルウェイト率を取得
		total = [...qs.pre, ...qs.after]
		let bwRate = 100
		total.forEach((queue) => {
			bwRate = Math.min(bwRate, queue.bwReviseOpp)
		})
		// バトルウェイト補正の適用
		applyBattleWaitRevise(bwRate)
		// フェイズ変更
		BattleManager._phase = 'turn'
	}

	//- 行動ガードの処理
	function processActGuard(queue) {
		if (!queue.actGuard || queue.actCancel) {
			return
		}
		// ガードされるバトラーをセット
		const subject = queue.subject
		const target = queue.user
		const subTarget = queue.subTarget
		// 行動者がガードされる対象をセット
		if (!subject._isGuardedBattlersKe) {
			subject._isGuardedBattlersKe = []
		}
		// 使用者
		subject._isGuardedBattlersKe.push(getBattlerData(target))
	}

	// かばう発動者の選択
	function choiceSubstituteUser(total) {
		let select = null
		// かばう可能キューを取得
		const subs = total.filter(
			(queue) => queue.isSubstitute && isNeedSubstitute(queue.subject, queue.subTarget)
		)
		// ガード者を優先的に取得
		select = subs.find((queue) => queue.actGuard)
		// かばうキューを取得
		if (!select) {
			select = subs[0]
		}
		// 選んだ以外のかばうキューは中止する
		delQueues = total.filter((queue) => queue.isSubstitute && queue != select)
		delQueues.forEach((queue) => {
			queue.stops = true
		})
		return select
	}

	//- かばうの処理
	function processSubstitute(queue) {
		const user = queue.user
		const subTarget = queue.subTarget
		const actionName = queue.action.item() ? queue.action.item().name : ''
		const bm = BattleManager
		// かばう発動者のセット
		setSubUser(user, subTarget, queue.attractsAnime)
		// かばう対象のセット
		setSubTarget(user, subTarget, queue)
		// RA中ステートの適用
		applyReactionState(queue)
		// 純かばう時のみの処理
		if (!queue.action.item()) {
			// かばうポップを表示
			if (queue.substitutePop) {
				const subText = queue.substitutePop
					? queue.substitutePop.format(user.name(), actionName, subTarget.name())
					: ''
				createPopSprite(user, queue, subText)
			}
			// かばうログを表示
			if (queue.substituteLog) {
				bm._logWindow.addText(queue.substituteLog.format(user.name(), actionName, subTarget.name()))
			}
			// フリーアニメ・スキルの実行
			doFreeAnimeSkill(user, subTarget, queue)
		}
		// かばう発動者を保存
		subUser = user
	}

	//- かばうが必要か
	function isNeedSubstitute(subject, subTarget) {
		// かばう対象が防御中ならfalse
		if (subTarget.isGuard()) {
			return false
		}
		// かばう対象がガードするならfalse
		if (isGuarded(subject, subTarget)) {
			return false
		}
		// かばう対象をかばう者がいるならfalse
		if (subTarget._subUserKe) {
			return false
		}
		return true
	}

	//- バトルウェイト補正の適用
	function applyBattleWaitRevise(rate) {
		if (!isSpeedStar()) {
			return
		}
		const bm = BattleManager
		bm._battleWaitRateKeRask = rate == 100 ? null : rate / 100
	}

	//- スピードスターバトルフラグ
	function isSpeedStar() {
		const gs = $gameSystem
		return gs._speedStarInitedKe && !gs._noSpeedStarKe
	}

	//- リアクションキューの初期化
	function initReactionQueue() {
		reactionQueues = { pre: [], after: [] }
		currentQueue = null
		remInReaction()
	}

	//- リアクション中フラグのセット
	function setInReaction() {
		$gameParty._inReactionKe = true
	}

	//- リアクション中フラグの解除
	function remInReaction() {
		$gameParty._inReactionKe = false
		// 本来のアクションを消去
		oriAction = null
	}

	//- リアクションキュー実行中か
	/*function inReactionQueue() {
        return reactionQueues.on || currentQueue || $gameParty.inReactionKe();
    };*/

	//- リアクション中はバトルイベントを更新しない
	//let inBattleEventStop = null;

	/*const _BattleManager_updateEventMain = BattleManager.updateEventMain;
    BattleManager.updateEventMain = function() {
        if (inReactionQueue()) {
            inBattleEventStop = true;
            return false;
        }
        inBattleEventStop = null;
        return _BattleManager_updateEventMain.apply(this);
    };*/

	//- バトルイベント中はターン入力開始しない
	/*const _BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function() {
        if ($gameTroop.isEventRunning() && inBattleEventStop) {
            return;
        }
        _BattleManager_endTurn.apply(this);
    };*/

	//- バトルイベント中はTPB更新しない
	/*const _BattleManager_updateTpb = BattleManager.updateTpb;
    BattleManager.updateTpb = function() {
        if ($gameTroop.isEventRunning() && inBattleEventStop) {
            return;
        }
        _BattleManager_updateTpb.apply(this);
    }*/

	/*const _BattleManager_isPartyTpbInputtable = BattleManager.isPartyTpbInputtable
    BattleManager.isPartyTpbInputtable = function() {
        let result = _BattleManager_isPartyTpbInputtable.apply(this);
        if (inBattleEventStop) {
            result = false;
        }
        return result;
    }*/

	/*const _BattleManager_updateStart = BattleManager.updateStart;
    BattleManager.updateStart = function() {
        if (inBattleEventStop) {
            return;
        }
        _BattleManager_updateStart.apply(this);
    }*/

	//==================================================
	//-- リアクションの更新
	//==================================================

	//- ターンの更新(コア追加);
	const _BattleManager_updatePhase = BattleManager.updatePhase
	BattleManager.updatePhase = function (timeActive) {
		if (reactionQueues.on && this._phase == 'turn' && !currentQueue) {
			// リアクションキューの実行
			doReactionQueue()
		}
		_BattleManager_updatePhase.apply(this, arguments)
		// リアクション終了の更新
		if (!currentQueue && !reactionQueues.on) {
			remInReaction()
		}
	}

	let actionId = 0

	//- リアクションキューの実行
	function doReactionQueue() {
		// キューの取り出し
		const queue = pickoutQueue()
		if (!queue) {
			return
		}
		const user = queue.user
		const action = queue.action
		const bm = BattleManager
		// 打ち止めなら次のキューへ
		if (queue.stops || user._stopsReactionKe) {
			nextQueue(queue)
			return
		}
		// リアクションの実行判定2。falseなら次のキューへ
		if (!judgeReaction2(queue, queue.subject, user, action, queue.subTarget)) {
			nextQueue(queue)
			return
		}
		// 発動打ち止めなら打ち止めフラグをオン
		if (queue.stopsAfter) {
			user._stopsReactionKe = true
		}
		// 本来の行動者をバトル順に戻す
		if (bm._subject && bm._subject.currentAction()) {
			bm._actionBattlers.unshift(bm._subject)
		}
		let target = null
		// リアクションを開始
		if (action.item()) {
			// リアクションの対象をセット
			if (action.isForOne()) {
				if (action.isForOpponent()) {
					target = queue.subject
					action.setTarget(target.index())
				} else if (action.isForFriend() && !action.isForUser()) {
					target = queue.subTarget || queue.user
					action.setTarget(target.index())
				}
			}
			user._actions.unshift(action)
			bm._subject = user
			bm.startAction()
			user.removeCurrentAction()
			// 発動者にリアクション実行中フラグ
			user._doingReactionKe = action
		}
		// バトルウェイト補正の適用
		applyBattleWaitRevise(queue.bwReviseSelf != null ? queue.bwReviseSelf : 100)
		// アクションにリアクションフラグ
		action._isReactionKe = true
		// 現在のキューをセット
		currentQueue = queue
		// コスト無消費フラグ
		user._noCostKeRask = !queue.payCost
		// RA中ステートの適用
		applyReactionState(queue)
		const actionName = action.item() ? action.item().name : ''
		// アクションのアイコン番号を取得
		const iconIndex = action.item() ? action.item().iconIndex : 0
		// かばうポップを表示
		if (queue.substitutePop && action.item()) {
			const subText = queue.substitutePop
				? queue.substitutePop.format(user.name(), actionName, queue.subTarget.name())
				: ''
			createPopSprite(user, queue, subText, iconIndex)
			// リアクションポップを表示
		} else if (queue.reactionPop) {
			const reactText = queue.reactionPop ? queue.reactionPop.format(user.name(), actionName) : ''
			createPopSprite(user, queue, reactText, iconIndex)
		}
		// かばうログを表示
		if (queue.substituteLog && action.item()) {
			bm._logWindow.addText(
				queue.substituteLog.format(user.name(), actionName, queue.subTarget.name())
			)
			// リアクションログを表示
		} else if (queue.reactionLog) {
			bm._logWindow.addText(queue.reactionLog.format(user.name(), actionName))
		}
		// フリーアニメ・スキルの実行
		if (action.item()) {
			doFreeAnimeSkill(user, target, queue)
		}
		// リアクションフラグを進める
		if (queue.pre) {
			queue.pre = 2
		} else if (queue.after) {
			queue.after = 2
		}
		// キュー実行済みフラグをオン
		didQueue = true
		// アクションがない場合はすぐにリアクションの終了
		if (!action.item()) {
			endReaction()
		}
	}

	//- キューの取り出し
	function pickoutQueue() {
		if (!reactionQueues.on) {
			return
		}
		let queue = null
		// 前リアクション
		if (reactionQueues.pre.length) {
			queue = reactionQueues.pre.shift()
		}
		// 後リアクション
		if (!oriSubject) {
			if (!queue && reactionQueues.after.length) {
				queue = reactionQueues.after.shift()
			}
		}
		// キューが空になったらオフ
		if (!reactionQueues.pre.length && !reactionQueues.after.length) {
			reactionQueues.on = null
		}
		return queue
	}

	//- 次のキューへ
	function nextQueue(queue) {
		const phase = queue.timing == '前' ? 'pre' : 'after'
		const length = reactionQueues[phase].length
		// キューが残っていれば次のキューへ
		if (length) {
			doReactionQueue()
			// 残っていなければリアクションを終了
		} else {
			if (queue.timing == '前') {
				queue.pre = 2
			} else {
				queue.after = 2
			}
			currentQueue = queue
			// リアクションの終了
			endReaction(true)
		}
	}

	//- フリーアニメ・スキルの実行
	function doFreeAnimeSkill(subject, target, queue) {
		if (!isFreeAnime() || !queue.freeAnime) {
			return
		}
		// アニメファイルとコモンを取得
		const metaList = metaAll(queue.freeAnime, ['フリーアニメ', 'freeAnime'])
		if (!metaList || !metaList.length) {
			return
		}
		metaList.forEach((meta) => {
			//-フリーアニメ・スキルの実行-個別
			BattleManager.doFreeAnimeSkillKe(meta, subject, [target])
		})
	}

	//- フリーアニメフラグ
	function isFreeAnime() {
		return PluginManager._scripts.some((n) => n == 'Keke_FreeAnime')
	}

	//- コスト消費無効(コア追加)
	const _Game_Battler_useItem = Game_Battler.prototype.useItem
	Game_Battler.prototype.useItem = function (item) {
		if (this._noCostKeRask) {
			this._noCostKeRask = null
			return
		}
		_Game_Battler_useItem.apply(this, arguments)
	}

	//- RA中ステートの適用
	function applyReactionState(queue) {
		// 自分
		if (queue.stateSelf) {
			queue.user.addState(queue.stateSelf)
			selfState = queue.stateSelf
		}
		// 相手
		if (queue.stateOpp) {
			queue.subject.addState(queue.stateOpp)
			oppoState = queue.stateOpp
		}
	}

	//- かばう発動者のセット
	function setSubUser(subject, target, attractsAnime) {
		target._subUserKe = { user: getBattlerData(subject), attractsAnime: attractsAnime }
	}

	//- かばう対象のセット
	function setSubTarget(subject, target, queue) {
		// 移動用
		const data = getBattlerData(target)
		if (!subject._subTargetPacksKe) {
			subject._subTargetPacksKe = []
		}
		subject._subTargetPacksKe.unshift({
			target: data,
			x: queue.subX,
			y: queue.subY,
			moveTime: queue.subMoveTime,
			keepTime: queue.subKeepTime
		})
		// 解除用
		if (!subject._subTargetsKe) {
			subject._subTargetsKe = []
		}
		subject._subTargetsKe.push(data)
		// かばう中の移動-フルアニメ
		moveInSubstituteFullAnime(subject)
	}

	//- かばう発動者の解除
	function remSubSubject(target) {
		if (!target._subUserKe || !target._subUserKe.user) {
			return
		}
		const user = target._subUserKe.user
		// かばう対象の解除予約
		if (user) {
			appoSubTargetRem(getBattlerByData(user))
		}
		target._subUserKe = null
	}

	//- かばう対象の解除予約
	function appoSubTargetRem(user) {
		if (!user._subTargetPacksKe || !user._subTargetPacksKe.length) {
			return false
		}
		if (!isSpeedStar()) {
			return
		}
		const sub = user._subTargetPacksKe[0]
		const bs = 1 //$gameSystem.battleSpeedKe();
		setTimeout(remSubTarget, Math.round(((sub.keepTime / bs) * 1000) / 60), user)
	}

	//- かばう対象の解除
	function remSubTarget(subject) {
		if (!subject._subTargetPacksKe) {
			return
		}
		subject._subTargetPacksKe.pop()
		// かばう戻り移動-フルアニメ
		if (!subject._subTargetPacksKe.length) {
			moveBackSubstituteFullAnime(subject)
		}
	}

	//- かばうの適用
	function applySubstitute(subject, target) {
		if (!target._subUserKe) {
			return target
		}
		if (!isConflictBattler(subject, target)) {
			return target
		}
		const sub = target._subUserKe
		// かばう敵がなければ保存
		/*if (!sub.enemy) {
            sub.enemy = getBattlerData(subject);
        // あれば敵が変わったか判定
        } else {
            const preEnemy = getBattlerByData(sub.enemy);
            // 変わったなら終了
            if (!isSameBattler(subject, preEnemy)) {
               remSubSubject(target);
               return target;
            }
        }*/
		// ターゲットを変更
		const newTarget = getBattlerByData(sub.user)
		// かばう発動者が行動不能なら終了
		if (!newTarget.isAlive() || newTarget.isRestricted()) {
			remSubSubject(target)
			return target
		}
		target = newTarget
		return target
	}

	//- スプライトアクターの位置更新(コア追加)
	const _Sprite_Actor_updateTargetPosition = Sprite_Actor.prototype.updateTargetPosition
	Sprite_Actor.prototype.updateTargetPosition = function () {
		// かばう中の移動
		if (moveInSubstitute(this)) {
			return
		}
		_Sprite_Actor_updateTargetPosition.apply(this)
	}

	//- かばう中の移動
	function moveInSubstitute(battlerSprite) {
		const battler = battlerSprite._battler
		if (!battler._subTargetPacksKe || !battler._subTargetPacksKe.length) {
			return false
		}
		const sub = battler._subTargetPacksKe[0]
		if (sub.moved) {
			return true
		}
		const subTarget = getBattlerByData(sub.target)
		const subSprite = searchSpriteBattler(subTarget)
		const x = subSprite.x - battlerSprite._homeX + sub.x
		const y = subSprite.y - battlerSprite._homeY + sub.y
		battlerSprite.startMove(x, y, sub.moveTime)
		sub.moved = true
		return true
	}

	//- かばう中の移動-フルアニメ
	function moveInSubstituteFullAnime(battler) {
		if (!getFullAnimeStatus()) {
			return
		}
		if (!battler._subTargetPacksKe || !battler._subTargetPacksKe.length) {
			return
		}
		const sub = battler._subTargetPacksKe[0]
		const asi = getFullAnimeAsi(battler)
		const subTarget = getBattlerByData(sub.target)
		const subFaceBase = getFullAnimeAsi(subTarget).faceBaseSprite
		const x = subFaceBase.x + sub.x - asi.faceHomeX
		const y = subFaceBase.y + sub.y - asi.faceHomeY
		// フルアニメ顔移動の開始
		startFaceMoveFullAnime(battler, x, y, sub.moveTime)
	}

	//- かばう戻り移動-フルアニメ
	function moveBackSubstituteFullAnime(battler) {
		if (!getFullAnimeStatus()) {
			return
		}
		// フルアニメ顔移動の開始
		startFaceMoveFullAnime(battler, 0, 0, 12)
	}

	//- かばう移動先の取得
	/*function getSubstitutePos(battler, targetX, targetY) {
        const sub = battler._subTargetPacksKe[0];
        if (sub.moved) { return null; }
        const pos = {};
        const subTarget = getBattlerByData(sub.target);
        const subSprite = searchSpriteBattler(subTarget);
        pos.x = subSprite.x - battlerSprite._homeX + sub.x;
        pos.y = subSprite.y - battlerSprite._homeY + sub.y;
        sub.moved = true;
        return pos;
    };*/

	//- かばう時のアニメ引き付け
	const _Window_BattleLog_showAnimation = Window_BattleLog.prototype.showAnimation
	Window_BattleLog.prototype.showAnimation = function (subject, targets, animationId) {
		targets = targets.map((battler) => {
			if (battler && battler._subUserKe && battler._subUserKe.attractsAnime) {
				return getBattlerByData(battler._subUserKe.user)
			}
			return battler
		})
		_Window_BattleLog_showAnimation.apply(this, arguments)
	}

	//==================================================
	//--  リアクションの終了
	//==================================================

	//- リアクションの終了
	function endReaction(end) {
		// バトル終了チェック
		if (checkBattleEnd()) {
			return
		}
		// キューがなければフラグ解除してリターン
		if (!currentQueue) {
			if (!reactionQueues.on) {
				remInReaction()
			}
			return
		}
		const queue = currentQueue
		// 前リアクションの終了
		endPreReaction(queue)
		// 後リアクションの終了
		endAfterReaction(queue)
		// 発動者のリアクション実行中フラグを解除
		queue.user._doingReactionKe = null
		// リアクション使用者のアクションステートを戻す
		queue.user._actionState = queue.oriActionState
		//queue.user._tpbState = queue.oriTpbState;
		// 全て終了
		if (!currentQueue && !reactionQueues.on) {
			// リアクション中フラグの解除
			remInReaction()
			// かばう対象の解除(非スピードスター)
			if (!isSpeedStar() && subUser) {
				remSubTarget(subUser)
			}
		}
	}

	//- バトル終了チェック
	function checkBattleEnd() {
		if (!$gameTroop.isAllDead() && !$gameParty.isAllDead()) {
			return false
		}
		// リアクションキューの初期化
		initReactionQueue()
		BattleManager._phase = 'turnEnd'
		BattleManager._subject = null
		return true
	}

	//- 前リアクションの終了
	function endPreReaction(queue) {
		if (!queue.pre || queue.pre <= 1) {
			return
		}
		const ori = queue.ori
		const target = ori.target
		// 本来の行動者のアクション後の終了
		if (queue.pre == 3) {
			// フラグを初期化
			currentQueue = null
			// リアクションキューの実行
			//if (reactionQueues.pre.length) { doReactionQueue(); }
			return
		}
		// RA中ステートの解除予約-前
		appoReactionStateRem(ori.subject, target, oppoState, selfState)
		//  前キューがなくなったら
		if (!reactionQueues.pre.length) {
			// 本来のアクションの復元
			restoreOriAction(queue)
			// 前リアクションフラグを進める
			queue.pre = 3
			return
		}
		// フラグを初期化
		currentQueue = null
	}

	//- 後リアクションの終了
	function endAfterReaction(queue) {
		if (!queue.after || queue.after <= 1) {
			return
		}
		const ori = queue.ori
		const target = ori.target
		// RA中ステートの解除予約-後
		appoReactionStateRem(target, ori.subject, selfState, oppoState)
		// リアクション使用者を行動者から消去
		if (queue.user == BattleManager._subject) {
			BattleManager._subject = null
		}
		// フラグを初期化
		currentQueue = null
	}

	//- 本来のアクションの復元
	function restoreOriAction(queue) {
		const bm = BattleManager
		const ori = queue.ori
		const subject = ori.subject
		// 行動キャンセル時はアクション終了
		if (queue.actCancel) {
			subject._actions = []
			bm.endBattlerActions(subject)
			// それ以外はアクションを復元
		} else {
			bm._subject = subject
			subject._actions.unshift(ori.subjectAction)
			bm.startAction()
			subject.removeCurrentAction()
		}
	}

	//- RA中ステートの解除予約
	function appoReactionStateRem(subject, target, subjectState, targetState) {
		// 予約をセット
		if (!subject._remsReactionStatesKe) {
			subject._remsReactionStatesKe = []
		}
		subject._remsReactionStatesKe.push({
			targetData: getBattlerData(target),
			subjectState: subjectState,
			targetState: targetState
		})
		selfState = null
		oppoState = null
	}

	//- RA中ステートの解除
	function remReactionState(subject) {
		if (!subject || !subject._remsReactionStatesKe) {
			return
		}
		subject._remsReactionStatesKe.forEach((rems) => {
			// 攻撃者のステートの消去
			if (rems.subjectState) {
				subject.removeState(rems.subjectState)
			}
			// リアクション発動者のステートの消去
			if (rems.targetState) {
				getBattlerByData(rems.targetData).removeState(rems.targetState)
			}
		})
		subject._remsReactionStatesKe = []
	}

	//- 戦闘終了時のフラグ解除
	const _Game_Party_onBattleEnd = Game_Party.prototype.onBattleEnd
	Game_Party.prototype.onBattleEnd = function () {
		_Game_Party_onBattleEnd.apply(this)
		// リアクションキューの初期化
		initReactionQueue()
		subUser = null
		selfState = null
		oppoState = null
		this.allMembers().forEach((actor) => {
			actor._isReactBattlerKe = null
			actor._reactBattlersKe = null
			actor._stopsReactionKe = null
			actor._isGuardedBattlersKe = null
			actor._noCostKeRask = null
			actor._subUserKe = null
			actor._subTargetsKe = null
			// RA中ステートの解除
			remReactionState(actor)
			// かばう対象の解除
			remSubTarget(actor)
		})
	}

	//- リアクションではアクション終了処理をしない(コア追加)
	const _BattleManager_endBattlerActions = BattleManager.endBattlerActions
	BattleManager.endBattlerActions = function (battler) {
		// 終了アクションがリアクションか判定
		if (isSameAction(battler._doingReactionKe, this._action)) {
			// バトラーのリアクション中フラグを解除
			setTimeout(remBattlerReactionDoing, 0, battler)
			return
		}
		_BattleManager_endBattlerActions.apply(this, arguments)
	}

	//- バトラーのリアクション中フラグを解除
	function remBattlerReactionDoing(battler) {
		battler._doingReactionKe = null
	}

	//- 同じアクションか
	function isSameAction(action1, action2) {
		if (!action1 || !action2) {
			return false
		}
		if (action1.subject() != action2.subject()) {
			return false
		}
		const item1 = action1._item
		const item2 = action2._item
		if (item1._dataClass != item2._dataClass) {
			return false
		}
		if (item1.itemId() != item2.itemId()) {
			return false
		}
		return true
	}

	//==================================================
	//--  リアクションメッセージ
	//==================================================

	let popText = ''
	let popIconIndex = null
	let popFontFace = null
	let popFontSize = null
	let popFontColor = null
	let popOutW = null
	let popOutColor = null
	let popPadding = null
	let popTime = null
	let popAnime = null

	//- ポップスプライトの形成
	function createPopSprite(battler, cfg, text, iconIndex) {
		if (cfg.popInvalid) {
			return
		}
		// リアクションポップ中フラグ
		battler._inReactionPopKe = true
		if (!popBattlers.some((b) => isSameBattler(b, battler))) {
			popBattlers.push(battler)
		}
		let viewer = null
		let asi = getFullAnimeAsi(battler)
		let fast = getFullAnimeStatus()
		let lastPop = {}
		// フルアニメ
		if (asi) {
			viewer = asi
			lastPop = asi.damages[asi.damages.length - 1] || {}
			// ダメージスプライトの破棄
			if (!(lastPop && (lastPop._isSkillPopKe || lastPop._isReactionPopKe))) {
				viewer.damages.forEach((d) => setDestroyDamage(fast, d, asi))
				viewer.damages = []
			}
			// 通常
		} else {
			// バトラースプライトの取得
			viewer = searchSpriteBattler(battler)
			if (!viewer) {
				return
			}
			lastPop = viewer._damages[viewer._damages.length - 1] || {}
			// ダメージスプライトの破棄
			if (!(lastPop && (lastPop._isSkillPopKe || lastPop._isReactionPopKe))) {
				viewer._damages.forEach((d) => setDestroyDamage(fast, d))
				viewer._damages = []
			}
		}
		// ダメージスプライトの形成
		popText = text
		popIconIndex = iconIndex && keke_showIcon ? iconIndex : 0
		popFontFace = cfg.popFontFace
		const eachSize = cfg.popFontEachSize
		const baseSize = cfg.popFontBaseSize
		popFontSize = eachSize
		popFontColor = cfg.popFontColor
		popOutW = cfg.popOutW
		popOutColor = cfg.popOutColor
		const sizeOffset = eachSize && baseSize ? Math.max(eachSize - baseSize, 0) : 0
		popPadding = popFontSize + keke_paddingOffset + sizeOffset
		popTime = keke_popShowTime
		popAnime = cfg['出現アニメ'] || keke_appearAnimeBasic
		// フルアニメの形成
		let newPop = null
		if (viewer.isAsi) {
			fast.createDamageSprite(battler, viewer)
			newPop = asi.damages[asi.damages.length - 1] || {}
			// 通常の形成
		} else {
			viewer.createDamageSprite()
			newPop = viewer._damages[viewer._damages.length - 1] || {}
			// 画面外に出さない
			const startX = viewer.x + viewer.damageOffsetX()
			const startY = viewer.y + viewer.damageOffsetY()
			noOutScreen(newPop, newPop._widthKe, newPop._heightKe, startX, startY)
		}
		popText = ''
		popFontFace = null
		popFontSize = null
		popFontColor = null
		popOutW = null
		popOutColor = null
		popPadding = null
		popTime = null
		popAnime = null
		// 最初の位置を保存
		newPop._oriXKe = newPop.x
		newPop._oriYKe = newPop.y
	}

	// ダメージポップ破棄のセット
	function setDestroyDamage(body, damage, asi) {
		const time = Math.round((damage._duration / 60) * 1000)
		setTimeout(destroyDamage, time, body, damage, asi)
	}

	// ダメージポップの破棄
	function destroyDamage(body, damage, asi) {
		if (!body) {
			return
		}
		body.destroyDamageSprite(damage, asi)
	}

	//- ポップアップの行間調整(コア追加)
	const _Sprite_Actor_createDamageSprite = Sprite_Actor.prototype.createDamageSprite
	Sprite_Actor.prototype.createDamageSprite = function () {
		const lastPop = this._damages[this._damages.length - 1]
		_Sprite_Actor_createDamageSprite.apply(this)
		const curPop = this._damages[this._damages.length - 1]
		if (lastPop) {
			const padding = Math.max(curPop._popPaddingKeRask, lastPop._popPaddingKeRask)
			if (padding) {
				curPop.y += 16 - padding
			}
		}
	}

	const _Sprite_Enemy_createDamageSprite = Sprite_Enemy.prototype.createDamageSprite
	Sprite_Enemy.prototype.createDamageSprite = function () {
		const lastPop = this._damages[this._damages.length - 1]
		_Sprite_Enemy_createDamageSprite.apply(this)
		const curPop = this._damages[this._damages.length - 1]
		if (lastPop) {
			const padding = Math.max(curPop._popPaddingKeRask, lastPop._popPaddingKeRask)
			if (padding) {
				curPop.y += 16 - padding
			}
		}
	}

	//- スプライトダメージ・セットアップ(コア追加)
	const _Sprite_Damage_setup = Sprite_Damage.prototype.setup
	Sprite_Damage.prototype.setup = function (target) {
		// バトラーを保存
		this._battlerKe = target
		// テキストポップの形成
		if (popText) {
			createTextPop(this, popText)
			// 行間と表示時間を変更
			if (popPadding) {
				this._popPaddingKeRask = popPadding
			}
			if (popTime) {
				this._duration = popTime
			}
			// 出現アニメの開始
			if (popAnime) {
				startAppearAnime(this, popAnime)
			}
			// リアクションポップフラグをオン
			this._isReactionPopKe = true
			return
		}
		_Sprite_Damage_setup.apply(this, arguments)
	}

	//- スプライトダメージポップ・更新(コア追加)
	const _Sprite_Damage_update = Sprite_Damage.prototype.update
	Sprite_Damage.prototype.update = function () {
		// バトル終了時はすぐ消す
		if (this._isReactionPopKe && BattleManager._phase == 'battleEnd') {
			this._duration = 1
		}
		// 出現アニメの更新
		if (this._isReactionPopKe && updateAppearAnime(this)) {
			return
		}
		_Sprite_Damage_update.apply(this)
	}

	//- テキストポップの形成
	function createTextPop(popSprite, text) {
		const fontSize = popSprite.fontSize()
		const ow = popSprite.outlineWidth()
		const h = fontSize + ow * 2
		const sizeRate = getFontSizeRate(popSprite.fontFace())
		let w = strWidth(text, fontSize, sizeRate) + ow * 2
		// アイコンを形成
		let iw = 0
		let ih = 0
		if (popIconIndex) {
			const anchorX = popSprite._anchorXKe != null ? popSprite._anchorXKe : 0.5
			const iconSprite = createIconSprite(popIconIndex)
			ih = Math.floor((h * keke_iconSize) / 100)
			iconSprite.scale.y = ih / ImageManager.iconHeight
			iconSprite.scale.x = iconSprite.scale.y
			iw = Math.floor(ImageManager.iconWidth * iconSprite.scale.x)
			w += iw
			iconSprite.x = -w * anchorX + iw / 2 + ow * (0.5 - anchorX)
			iconSprite.y = -40
			iconSprite.ry = iconSprite.y
			popSprite.addChild(iconSprite)
			iconSprite.dy = 0
		}
		// テキストを形成
		const textSprite = popSprite.createChildSprite(w + ow, h)
		textSprite.bitmap.drawText(text, 0, ow / 2, w, h, 'center')
		textSprite.dy = 0
		if (iw) {
			textSprite.x += iw / 2
		}
		// サイズを保存
		popSprite._widthKe = w + iw
		popSprite._heightKe = Math.max(h, ih)
	}

	//- 画面外に出さない
	function noOutScreen(sprite, w, h, startX, startY) {
		const overL = sprite.x - w / 2
		const overR = sprite.x + w / 2 - Graphics.width
		const overU = sprite.y - h / 2
		const overD = sprite.y + h / 2 - Graphics.height
		if (overL < 0) {
			sprite.x -= overL
		} else if (overR > 0) {
			sprite.x -= overR
		}
		if (overU < 0 || overD > 0) {
			sprite.x = startX
			sprite.y = startY
		}
	}

	//- テキストポップのフォント
	const _Sprite_Damage_fontFace = Sprite_Damage.prototype.fontFace
	Sprite_Damage.prototype.fontFace = function () {
		if (popFontFace) {
			return popFontFace
		}
		return _Sprite_Damage_fontFace.apply(this)
	}

	//- テキストポップの文字サイズ
	const _Sprite_Damage_fontSize = Sprite_Damage.prototype.fontSize
	Sprite_Damage.prototype.fontSize = function () {
		if (popFontSize) {
			return popFontSize
		}
		return _Sprite_Damage_fontSize.apply(this)
	}

	//- テキストポップの文字色
	const _Sprite_Damage_damageColor = Sprite_Damage.prototype.damageColor
	Sprite_Damage.prototype.damageColor = function () {
		if (popFontColor) {
			return popFontColor
		}
		return _Sprite_Damage_damageColor.apply(this)
	}

	//- テキストポップの縁取り幅
	const _Sprite_Damage_outlineWidth = Sprite_Damage.prototype.outlineWidth
	Sprite_Damage.prototype.outlineWidth = function () {
		if (popOutW) {
			return popOutW
		}
		return _Sprite_Damage_outlineWidth.apply(this)
	}

	//- テキストポップの縁取り色
	const _Sprite_Damage_outlineColor = Sprite_Damage.prototype.outlineColor
	Sprite_Damage.prototype.outlineColor = function () {
		if (popOutColor) {
			return popOutColor
		}
		return _Sprite_Damage_outlineColor.apply(this)
	}

	//- フルアニメステータスの取得
	function getFullAnimeStatus() {
		if ($gameSystem.isSideView()) {
			return null
		}
		return $gameTemp._fullAnimeStatusKe
	}

	//- フルアニメステータスASIの取得
	function getFullAnimeAsi(battler) {
		if ($gameSystem.isSideView()) {
			return null
		}
		if (!getFullAnimeStatus()) {
			return null
		}
		const asi = $gameTemp.getFullAnimeStatusAsiKe(battler)
		if (!asi || !asi.faceBaseSprite) {
			return null
		}
		return asi
	}

	//- フルアニメ顔移動の開始
	function startFaceMoveFullAnime(battler, x, y, timeMax) {
		if ($gameSystem.isSideView()) {
			return null
		}
		if (!getFullAnimeStatus()) {
			return null
		}
		const fullAnime = $gameTemp._fullAnimeStatusKe
		const asi = $gameTemp.getFullAnimeStatusAsiKe(battler)
		fullAnime.startFaceMove(battler, asi, x, y, timeMax)
	}

	//- アイコンビットマップを破棄させない
	const _Sprite_Damage_destroy = Sprite_Damage.prototype.destroy
	Sprite_Damage.prototype.destroy = function (options) {
		for (const child of this.children) {
			if (child.bitmap && child.bitmap._url) {
				child.destroy()
			}
		}
		if (!this._texture) {
			return
		}
		_Sprite_Damage_destroy.apply(this, arguments)
	}

	// リアクションポップ中フラグ時はポップアップを消さない
	const _Sprite_Damage_updateOpacity = Sprite_Damage.prototype.updateOpacity
	Sprite_Damage.prototype.updateOpacity = function () {
		if (this._isReactionPopKe && this._battlerKe && this._battlerKe._inReactionPopKe) {
			this.opacity = 255
			return
		}
		_Sprite_Damage_updateOpacity.apply(this)
	}

	const _Sprite_Damage_isPlaying = Sprite_Damage.prototype.isPlaying
	Sprite_Damage.prototype.isPlaying = function () {
		if (this._isReactionPopKe && this._battlerKe && this._battlerKe._inReactionPopKe) {
			return true
		}
		return _Sprite_Damage_isPlaying.apply(this)
	}

	//==================================================
	//--  出現アニメ
	//==================================================

	//- 出現アニメの開始
	function startAppearAnime(sprite, animeName) {
		if (!animeName) {
			return
		}
		const drift = {}
		// パラメータ
		const d = keke_appearAnimeList.filter((a) => a['アニメ名'] == animeName)[0]
		if (!d || d['無効']) {
			return
		}
		const timeMax = d['アニメ時間'] || 0
		if (!timeMax) {
			return
		}
		const scale = d['スケール']
		const scaleT = d['スケールターン']
		const opacity = d['フェードイン']
		const delay = d['ディレイ']
		const easing = 'EO'
		// アニメ時間
		drift.timeMax = timeMax
		drift.duration = timeMax
		// ディレイ
		if (delay) {
			drift.delay = delay
		}
		// スケール
		if (scale != null && scale != 1) {
			// スケールX
			drift.scaleXs = makeDrift([{ val: 1, easing: easing }], scale, timeMax, 'スケールX')
			sprite.scale.x = scale
			// スケールY
			drift.scaleYs = makeDrift([{ val: 1, easing: easing }], scale, timeMax, 'スケールY')
			sprite.scale.y = scale
		}
		// スケールターン
		if (scaleT != null && scaleT != 1) {
			// スケールXターン
			drift.scaleXTs = makeDrift([{ val: scaleT, easing: 'TN' }], 1, timeMax, 'スケールXターン')
			// スケールYターン
			drift.scaleYTs = makeDrift([{ val: scaleT, easing: 'TN' }], 1, timeMax, 'スケールYターン')
		}
		// 不透明度
		if (opacity != null && opacity != 255) {
			drift.opacities = makeDrift([{ val: 255, easing: easing }], opacity, timeMax, '不透明度')
			sprite.opacity = opacity
		}
		// レイヤー
		if (d['上方レイヤー']) {
			setTimeout(childUpperLayer, 0, sprite)
		}
		// 変数セット
		sprite._driftKe = drift
		// 標準のアニメを無効
		const noDefoAnime = keke_noDefoAnime
		if (noDefoAnime) {
			sprite._noDefoAnimeKe = true
			sprite.children.forEach((child) => {
				child.y = 0
			})
		}
	}

	//- 標準のダメージアニメを無効(コア追加)
	const _Sprite_Damage_updateChild = Sprite_Damage.prototype.updateChild
	Sprite_Damage.prototype.updateChild = function (sprite) {
		if (this._noDefoAnimeKe) {
			return
		}
		_Sprite_Damage_updateChild.apply(this, arguments)
	}

	//- 上方レイヤーへのチルド
	function childUpperLayer(sprite) {
		SceneManager._scene._windowLayer.addChild(sprite)
	}

	//- 変動の作成
	function makeDrift(datas, current, time, word) {
		if (!datas || !datas.length) {
			return
		}
		if (word == '回転角') {
			current %= 360
		}
		let ds = []
		// データの数だけ処理
		datas.forEach((data) => {
			if (data.val == null) {
				return
			}
			const d = {}
			d.num = data.num || 1
			d.datas = data.datas || ['', '']
			const extra = data.extra || ''
			d.break = extra.includes('B')
			d.jump = extra.includes('J')
			d.direction = extra.includes('D')
			d.isCos = extra.includes('C')
			d.isRandom = d.datas[1].includes('~')
			d.easing = data.easing || 'E'
			d.easingRate = data.easingRate || 1
			d.timeMax = time / d.num
			d.duration = d.timeMax
			d.start = roundDecimal(current, 1000000)
			d.target = Number(data.val)
			d.vol = d.target - d.start
			d.current = d.start
			d.end = 0
			// 終点
			if (d.easing == 'TN' || d.easing == 'RD') {
				d.end = d.start
			} else {
				d.end = d.target
			}
			ds.push(d)
		})
		return ds
	}

	//- 出現アニメの更新
	function updateAppearAnime(sprite) {
		if (!sprite._driftKe) {
			return
		}
		const drift = sprite._driftKe
		let scaling = false
		// ディレイ
		if (drift.delay) {
			drift.delay--
			if (!drift.delay) {
				sprite.visible = true
			}
			return true
		}
		// スケールX
		if (drift.scaleXs && drift.scaleXs.length) {
			let scaleXs = updateDrift(drift.scaleXs, 'スケールX')
			scaleXs.forEach((v) => (sprite.scale.x += v))
			scaling = true
		}
		// スケールY
		if (drift.scaleYs && drift.scaleYs.length) {
			let scaleYs = updateDrift(drift.scaleYs, 'スケールY')
			scaleYs.forEach((v) => (sprite.scale.y += v))
		}
		// スケールXターン
		if (drift.scaleXTs && drift.scaleXTs.length) {
			let scaleXTs = updateDrift(drift.scaleXTs, 'スケールXターン')
			scaleXTs.forEach((v) => (sprite.scale.x += v))
			scaling = true
		}
		// スケールYターン
		if (drift.scaleYTs && drift.scaleYTs.length) {
			let scaleYTs = updateDrift(drift.scaleYTs, 'スケールYターン')
			scaleYTs.forEach((v) => (sprite.scale.y += v))
		}
		// 不透明度
		if (drift.opacities && drift.opacities.length) {
			let opacities = updateDrift(drift.opacities, '不透明度')
			opacities.forEach((v) => (sprite.opacity += v))
		}
		// カウントを減らす
		drift.duration--
		// 終了
		if (!drift.duration) {
			sprite._driftKe = null
		}
		// スケールアニメ中の位置補正
		if (scaling) {
			// Y位置補正
			sprite.y = sprite._oriYKe + (sprite._heightKe * (sprite.scale.y - 1)) / 2
			// 画面外に出さない
			noOutScreen(
				sprite,
				sprite._widthKe * sprite.scale.x,
				sprite._heightKe * sprite.scale.y,
				sprite._oriXKe,
				sprite._oriYKe
			)
		}
		return true
	}

	//- 変動の更新
	function updateDrift(ds, word) {
		let rs = []
		// データの数だけ処理
		ds.forEach((d) => {
			// カウントを減らす
			d.duration--
			let r = 0
			next = applyEasing(
				d.current,
				d.start,
				d.target,
				d.duration,
				d.timeMax,
				d.easing,
				d.easingRate
			)
			r = next - d.current
			d.current = next
			// 終了
			if (d.duration <= 0) {
				// 終了値に合わせる
				r += roundDecimal(d.end - next, 1000000)
				d.num--
				d.duration = d.timeMax
			}
			if (r) {
				rs.push(r)
			}
		})
		return rs
	}

	//==================================================
	//--  イージング
	//==================================================

	//- イージングの適用
	function applyEasing(current, start, target, duration, timeMax, easing, easingRate = 1) {
		// イージングの処理
		if (easing.match(/ei|eo|e/i)) {
			return processEasing(current, target, duration + 1, timeMax, easing, easingRate)
		}
		// カービング
		if (easing.match(/tn|cg|fk|cf|rd|bk/i)) {
			return processCurving(current, start, target, duration + 1, timeMax, easing, easingRate)
		}
	}

	//- イージングの処理
	function processEasing(current, target, duration, timeMax, easing, easingRate = 1) {
		const lt = calcEasing((timeMax - duration) / timeMax, easing, easingRate)
		const t = calcEasing((timeMax - duration + 1) / timeMax, easing, easingRate)
		const start = (current - target * lt) / (1 - lt)
		return start + (target - start) * t
	}

	//- イージングの計算
	function calcEasing(t, easing, easingRate = 1) {
		const exponent = 2 * easingRate
		switch (easing.toUpperCase()) {
			case 'EI':
				return easeIn(t, exponent)
			case 'EO':
				return easeOut(t, exponent)
			case 'E':
				return easeInOut(t, exponent)
			default:
				return t
		}
	}

	//- 各イージング処理
	function easeIn(t, exponent) {
		return Math.pow(t, exponent) || 0.001
	}

	function easeOut(t, exponent) {
		return 1 - (Math.pow(1 - t, exponent) || 0.001)
	}

	function easeInOut(t, exponent) {
		if (t < 0.5) {
			return easeIn(t * 2, exponent) / 2
		} else {
			return easeOut(t * 2 - 1, exponent) / 2 + 0.5
		}
	}

	//- カービングの処理
	function processCurving(current, start, target, duration, timeMax, easing, easingRate = 1) {
		// 0 の時の処理
		if (duration <= 0) {
			return easing.match(/tn|rd|bk/i) ? start : target
		}
		let result = 0
		// ターン
		if (easing.toUpperCase() == 'TN') {
			result = processTurn(current, start, target, duration, timeMax, easingRate)
			// チャージ
		} else if (easing.toUpperCase() == 'CG') {
			result = processCharge(current, start, target, duration, timeMax, easingRate)
			// フック
		} else if (easing.toUpperCase() == 'FK') {
			result = processFook(current, start, target, duration, timeMax, easingRate)
			// チャージフック
		} else if (easing.toUpperCase() == 'CF') {
			result = processChargeFook(current, start, target, duration, timeMax, easingRate)
			// ラウンド
		} else if (easing.toUpperCase() == 'RD') {
			result = processRound(current, start, target, duration, timeMax, easingRate)
			// バック
		} else if (easing.toUpperCase() == 'BK') {
			result = processBack(current, start, target, duration, timeMax, easingRate)
		}
		return result
	}

	//- ターンの処理
	function processTurn(current, start, target, duration, timeMax, easingRate) {
		let result = 0
		const d1 = Math.round(timeMax / 2)
		const d2 = timeMax - d1
		if (duration > d2) {
			result = processEasing(current, target, duration - d2, d1, 'eo', easingRate)
		} else {
			result = processEasing(current, start, duration, d2, 'ei', easingRate)
		}
		return result
	}

	//- チャージの処理
	function processCharge(current, start, target, duration, timeMax, easingRate) {
		let result = 0
		const d1 = Math.round(timeMax / 3)
		const d2 = timeMax - d1
		if (duration > d2) {
			result = processEasing(current, start + (start - target) * easingRate, duration - d2, d1, 'e')
		} else {
			result = processEasing(current, target, duration, d2, 'e')
		}
		return result
	}

	//- フックの処理
	function processFook(current, start, target, duration, timeMax, easingRate) {
		let result = 0
		const d1 = Math.round((timeMax * 2) / 3)
		const d2 = timeMax - d1
		if (duration > d2) {
			result = processEasing(
				current,
				target + (target - start) * easingRate,
				duration - d2,
				d1,
				'e'
			)
		} else {
			result = processEasing(current, target, duration, d2, 'e')
		}
		return result
	}

	//- チャージフックの処理
	function processChargeFook(current, start, target, duration, timeMax, easingRate) {
		let result = 0
		const d1 = Math.round(timeMax / 4)
		const d3 = Math.round(timeMax / 4)
		const d2 = timeMax - d1 - d3
		if (duration > d2 + d3) {
			result = processEasing(
				current,
				start + (start - target) * easingRate,
				duration - d2 - d3,
				d1,
				'e'
			)
		} else if (duration > d3) {
			result = processEasing(
				current,
				target + (target - start) * easingRate,
				duration - d3,
				d2,
				'e'
			)
		} else {
			result = processEasing(current, target, duration, d3, 'e')
		}
		return result
	}

	//- ラウンドの処理
	function processRound(current, start, target, duration, timeMax, easingRate) {
		let result = 0
		const d1 = Math.round(timeMax / 4)
		const d2 = Math.round(timeMax / 2)
		const d3 = timeMax - d1 - d2
		if (duration > d2 + d3) {
			result = processEasing(current, target, duration - d2 - d3, d1, 'eo')
		} else if (duration > d3) {
			result = processEasing(current, start + (start - target) * easingRate, duration - d3, d2, 'e')
		} else {
			result = processEasing(current, start, duration, d3, 'ei')
		}
		return result
	}

	//- バックの処理
	function processBack(current, start, target, duration, timeMax, easingRate) {
		let result = 0
		const d1 = 1
		const d2 = timeMax - d1
		if (duration > d2) {
			result = processEasing(current, target, duration - d2, d1, 'e', easingRate)
		} else {
			result = processEasing(current, start, duration, d2, 'e', easingRate)
		}
		return result
	}

	//- 小数点を丸める
	function roundDecimal(val, rate) {
		const newVal = Math.floor(val * rate) / rate
		return newVal
	}

	//==================================================
	//--  テキスト基本 /ベーシック
	//==================================================

	//- 文字列幅
	function strWidth(str, fontSize, sizeRate = {}) {
		return strBytes(str, 0.5, sizeRate.half || 1) * fontSize * (sizeRate.width || 1)
	}

	//- 文字列バイト数
	function strBytes(str, rate = 1, halfSize = 1) {
		let byte = 0
		for (let i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i)
			if (
				(c >= 0x0 && c < 0x81) ||
				c === 0xf8f0 ||
				(c >= 0xff61 && c < 0xffa0) ||
				(c >= 0xf8f1 && c < 0xf8f4)
			) {
				byte += 1 * (rate * halfSize)
			} else {
				byte += 2 * rate
			}
		}
		return byte
	}

	//- 文字サイズの取得
	function getFontSize(size) {
		const mainSize = keke_fontSize || $gameSystem.mainFontSize()
		if (!size) {
			return mainSize
		}
		const sizeStr = size.toString()
		if (sizeStr.includes('+')) {
			const plus = Number(sizeStr.replace('+', ''))
			size = mainSize + plus
		} else if (sizeStr.includes('-')) {
			const minus = Number(sizeStr.replace('-', ''))
			size = mainSize - minus
		}
		return Number(size)
	}

	//- 縁取り幅の取得
	function getOutWidth(size) {
		const mainSize = keke_outWidth || 3
		if (!size) {
			return mainSize
		}
		const sizeStr = size.toString()
		if (sizeStr.includes('+')) {
			const plus = Number(sizeStr.replace('+', ''))
			size = mainSize + plus
		} else if (sizeStr.includes('-')) {
			const minus = Number(sizeStr.replace('-', ''))
			size = mainSize - minus
		}
		return Number(size)
	}

	//==================================================
	//--  比較基本 /ベーシック  --//
	//==================================================

	//- 同じバトラーか
	function isSameBattler(a, b) {
		if (!a) {
			return !b
		}
		if (!b) {
			return !a
		}
		if (a._actorId) {
			if (!b._actorId) {
				return false
			}
			return a._actorId == b._actorId
		} else {
			if (!b._enemyId) {
				return false
			}
			return a.index() == b.index()
		}
	}

	//- 敵対バトラーか
	function isConflictBattler(a, b) {
		if (!a || !b) {
			return false
		}
		if (a._actorId) {
			return b._enemyId
		} else {
			return b._actorId
		}
	}

	//==================================================
	//--  データ基本 /ベーシック  --//
	//==================================================

	//- バトラーデータの取得
	function getBattlerData(battler) {
		if (battler._actorId) {
			return { type: 'actor', id: battler._actorId }
		} else {
			return { type: 'enemy', index: battler.index() }
		}
	}

	//- データからのバトラー取得
	function getBattlerByData(data) {
		if (data.type == 'actor') {
			return $gameParty.allMembers().find((actor) => actor._actorId == data.id)
		} else {
			return $gameTroop.members()[data.index]
		}
	}

	//==================================================
	//--  スプライト基本 /ベーシック
	//==================================================

	//- スプライトの検索-バトラー
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

	//==================================================
	//--  アイコンスプライト /ベーシック
	//==================================================

	//- アイコンスプライトの形成
	function createIconSprite(iconIndex) {
		const sprite = new SpriteKeRask()
		sprite.anchor.x = 0.5
		sprite.anchor.y = 1
		const bitmap = ImageManager.loadSystem('IconSet')
		sprite.bitmap = bitmap
		const pw = ImageManager.iconWidth
		const ph = ImageManager.iconHeight
		const sx = (iconIndex % 16) * pw
		const sy = Math.floor(iconIndex / 16) * ph
		sprite.setFrame(sx, sy, pw, ph)
		return sprite
	}

	//==================================================
	//--  メタ配列 /ベーシック
	//==================================================

	// 全てのメタを合算
	function addUpAllMeta(battler, words, action) {
		let data = null
		let array = []
		// バトラー値
		data = battler._actorId ? battler.actor() : battler.enemy()
		if (data) {
			metaAll(data.note, words).forEach((e) => array.push(e))
		}
		if (battler._actorId) {
			// 職業値
			data = battler.currentClass()
			if (data) {
				metaAll(data.note, words).forEach((e) => array.push(e))
			}
			// 装備値
			battler._equips.forEach((equip) => {
				data = equip.object()
				if (data) {
					metaAll(data.note, words).forEach((e) => array.push(e))
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
		// スペース削除
		//if (delSpace) { array = array.map(e => e.replace(/\s/g, "")); }
		// 空の要素は削除
		array = array.filter((e) => e)
		return array
	}

	//- 全取得メタ
	function metaAll(note, words) {
		const result = []
		words.forEach((word) => {
			const regText = '<' + word + ':([^>]*)>'
			const regExp_g = new RegExp(regText, 'g')
			const regExp = new RegExp(regText)
			const matches = note.match(regExp_g)
			if (matches) {
				matches.forEach(function (line) {
					result.push(line.match(regExp)[1])
				})
			}
		})
		return result
	}

	//- 全てのメタの取得-文字列リスト
	function getAllMetaStrs(subject, words, action) {
		const array = addUpAllMeta(subject, words, action)
		if (!array || !array.length) {
			return []
		}
		let strings = []
		array.forEach((string) => {
			if (!string) {
				return
			}
			const strs = string.split(/,|\s|\n/)
			strs.forEach((str) => {
				if (!str) {
					return
				}
				strings.push(str)
			})
		})
		return strings
	}

	//- 全てのメタの取得-数値リスト
	function getAllMetaNums(subject, words, action) {
		const array = addUpAllMeta(subject, words, action)
		if (!array || !array.length) {
			return []
		}
		let nums = []
		array.forEach((string) => {
			if (!string) {
				return
			}
			const strs = string.split(/,|\s/)
			strs.forEach((str) => {
				if (!str) {
					return
				}
				const num = Number(str)
				if (isNaN(num)) {
					return
				}
				nums.push(num)
			})
		})
		return nums
	}
})()
