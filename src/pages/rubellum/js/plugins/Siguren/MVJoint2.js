/**
 * @param {Window_Base} window_
 * @param {Rectangle} rect
 * @param {(window:Window_Base,rect:Rectangle)=>void} initFunction
 */
function window_initializeMVMZ(window_, rect, initFuncton) {
	if (Utils.RPGMAKER_NAME === 'MZ') {
		initFuncton.call(window_, rect)
		return
	}
	if (Utils.RPGMAKER_NAME === 'MV') {
		initFuncton.call(window_, rect.x, rect.y, rect.width, rect.height)
		return
	}
	throw new Error('Unknown RPG MAKER:' + Utils.RPGMAKER_NAME)
}
