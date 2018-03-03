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
* tab_action: 选项卡的切换行为, 默认显示隐藏, slide 滑动效果, scale 缩放效果
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
			tab_action: ''
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
		this.contentDomWidth = this.contentDom.offset().width
		this.contentDomParent = this.contentDom.parent()
		this.showIndex(obj.indexes, obj.active)
	}

	// 处理初始化默认选择第几个选项
	showIndex(...args) {
		if(args[0] >= this.menuDom.length || args[0] < 0) return false
		this.menuDom.eq(args[0]).addClass(args[1]).siblings().removeClass(args[1])
		this.switchMode(args[0])
	}
	// 用于点击处理
	userTap(obj) {
		let self = this
		this.menuDom.on(obj.events, function (e) {
			// console.log($(this).index())
			$(this).addClass(obj.active).siblings().removeClass(obj.active)
			// 判断选项卡以何种方式切换 slide
			self.switchMode($(this).index())
		})
	}

	//  slide 滑动逻辑
	openSlide(i) {
		this.contentDomParent.css({
			transition: 'transform ease .5s',
			transform: `translate3d(${i * this.contentDomWidth * -1}px, 0, 0)`
		})
	}

	// scale 缩放 逻辑
	openScale(i) {
		this.contentDomParent.css('position', 'relative')
		this.contentDom.eq(i).css({
			transition: 'transform ease .5s',
			position: 'static',
			transform: 'scale3d(1,1,1)'
		}).siblings().css({
			transition: 'transform ease .5s',
			transform: 'scale3d(0,0,0)',
			position: 'absolute'
		})
	}

	// 选项卡切换方式的判断
	switchMode(i) {
		switch(this.config.tab_action){
			case 'slide':
				this.openSlide(i)
				break
			case 'scale':
				this.openScale(i)
				break
			default:
				this.contentDom.eq(i).show().siblings().hide()
		}
	}
}

$.tabMenu = function (options) {
	return new TabMenu(options)
}