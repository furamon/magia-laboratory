/*:
 * @target MV MZ
 * @plugindesc AdditionalClassesとAbilitySystemの競合回避パッチ
 * @author Furamon
 * @base NRP_AdditionalClasses
 * @orderAfter NRP_AdditionalClasses
 * @base AdditionalCCSceneCustom
 * @orderAfter AdditionalCCSceneCustom
 * @base AbilitySystemCustom
 * @orderAfter AbilitySystemCustom
 * @help
 * NRP_AdditionalClasses.js、AdditionalCCSceneCustom.js、AbilitySystem.jsのあとに置くこと。
 */

;(() => {
	/**
	 * 追加職業のレベルアップでアビリティスキル習得時、習得の
	 * 表示がされない不具合を修正
	 */
	{
		let _lastSkills = []

		const _AdditionalClass_changeExp = AdditionalClass.prototype.changeExp
		AdditionalClass.prototype.changeExp = function () {
			_lastSkills = this.actor().skills({ includeHasAbilitySkills: true })
			_AdditionalClass_changeExp.apply(this, arguments)
		}

		const _AdditionalClass_displayLevelUp = AdditionalClass.prototype.displayLevelUp
		AdditionalClass.prototype.displayLevelUp = function () {
			const newSkills = this.actor()
				.skills({ includeHasAbilitySkills: true })
				.filter((skill) => !_lastSkills.includes(skill))
			_AdditionalClass_displayLevelUp.call(this, newSkills)
		}
	}
})()
