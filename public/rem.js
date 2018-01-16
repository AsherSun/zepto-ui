(function () {
	function rem(grid) {
		// 获取移动设备的宽度
		let html = document.documentElement
		let equipmentWidth = html.getBoundingClientRect().width
		// 设置根节点大小
		if (equipmentWidth > 640) {
			equipmentWidth = 640
		}
		html.style.fontSize = (equipmentWidth / grid) + 'px'
	}

	rem(7.5);
	window.onresize = function () {
		rem(7.5);
	}
})();