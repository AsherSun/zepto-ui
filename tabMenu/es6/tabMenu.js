/*
* tabMenu
* Date: 2018/02/06
* Author: asher sun
* *****************
* @params: config 配置
* config配置说明：
* menu: 导航菜单的className ， 默认参数为：.tabMenu-header-items
* content: 内容盒子的 className , 默认参数为：.tabMenu-body-content
* indexes:  初始化的时候，当前出现的默认选项，默认为 0
* events: 切换的事件，默认点击事件: onclick,
* active: 选中项的 className, 默认为 selected
* is_slide: 是否出现滑动效果, 默认不开启，false
*
* */
class TabMenu {
	constructor(options) {
		this.init(options)
	}

	init(op) {
		this.config = $.extend({
			menu: '.tabMenu-header-items',
			content: '.tabMenu-body-content',
			indexes: 0,
			events: 'click',
			active: 'selected',
			is_slide: false
		}, op)
		// 获取dom元素
		this.getDoms(this.config)
		// 处理用户行为
		this.userTap(this.config)
	}

	// 获取 DOM 节点
	getDoms(obj) {
		this.menuDom = $(obj.menu)
		this.contentDom = $(obj.content)
	}

	// 用于点击处理
	userTap(obj) {
		this.menuDom.on(obj.events, function (e) {
			console.log(this)
		})
	}
}

$.tabMenu = function (options) {
	return new TabMenu(options)
}