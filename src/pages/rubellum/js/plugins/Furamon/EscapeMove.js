/*:
 * @target MV MZ
 * @plugindesc SVで逃げたときちゃんと画面外に出るようにする
 * @author Furamon
 */

;(() => {
	'use strict'
	Sprite_Actor.prototype.retreat = function () {
		this.startMove(600, 0, 15)
	}

	BattleManager.displayEscapeSuccessMessage = function () {}

	// Sprite_Actor.prototype.stepForward = function () {
	//     this.startMove(-48, 0, 4);
	// };

	// Sprite_Actor.prototype.stepBack = function () {
	//     this.startMove(0, 0, 3);
	// };
})()
