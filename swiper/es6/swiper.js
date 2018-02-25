/*
*  思考 :
*  swiper 插件该如何写？ config配置参数该如何设计？
*  1. 是否自动轮播 默认 false ===> 不会自动轮播
*  2. 是否创建轮播的切换按钮 默认 false ===》 不会创建
*  3. 横向轮播与纵向轮播 默认false ===> 水平方向 。只要不为 false 则是垂直方向
*  4. 页面初始化的时候，从第几项开始？ 默认为 0
*  5. 是否需要 增加轮播的开始 fn 与结束 fn ？？？
*
* */
/*
* 1. 绑定移动端移动事件 touchstart  touchmove touchend
* 2. 是否创建 分页器
* 3. 处理用户逻辑
*
*
* */
-function ($) {

	class Swiper {
		constructor(options, dom) {
			if (!dom.length) {
				return false
			}
			this.el = dom
			// 用于缓存坐标值
			this.startX = 0
			this.startY = 0
			// translate3d() 中 x 轴或者 y 轴的值
			this.translate = 0
			// touchend 事件结束将要决定 轮播了多少距离
			this.translateChange = 0
			// 定时器
			this.time = null
			this._init(options)
		}

		_init(options) {
			this.config = $.extend({
				// 轮播列表的父元素 ==
				wrapper: '.as_swiper_wrapper',
				// 每一个轮播项
				slider: '.as_swiper_slider',
				// 用来控制是否 创建 轮播的切换按钮
				createSliderBtn: '',
				// 用来控制是否自动 轮播
				autoplay: '',
				// 用来控制 是水平方向轮播还是垂直方向轮播
				direction: '',
				// 初始化的时候 显示哪个轮播项
				initialSlide: 0,
				// 用于判断是否滑动多个滑块
				multiMove: false,
				// 用来处理滑块业务结束之后要处理的业务 默认参数为当前轮播项的索引
				endFn: null
			}, options)

			// 初始化的时候缓存定时器的时间
			this.msec = this.computeTime()
			// 事件源
			this._addEventTouch()
			// 用来 查找需要的元素
			this.findDom()
			// 判断有没有超过边界
			if (this.config.initialSlide < 0 || this.config.initialSlide > this._slider.length - 1) this.config.initialSlide = 0
			// 创建按钮
			this._createSliderBtn()
			// 自动轮播
			this.autoplay()
			// 在这里调用是因为 要控制 页面初始化的时候显示第几个轮播项
			this.swiperTab()
		}

		// 用来查找 元素
		findDom() {
			this._wrapper = this.el.find(this.config.wrapper)
			this._slider = this.el.find(this.config.slider)
			try{
				this._sliderWidth = this._slider.offset().width
				this._sliderHeight = this._slider.offset().height
			}catch(e) {
				// console.log(e)
			}
		}

		// 创建 轮播的切换按钮 (分页器）
		_createSliderBtn() {
			if (!this.config.createSliderBtn) return false
			let btnList = $('<ul class="as_pagination"></ul>')
			for (let i = 0; i < this._slider.length; i++) {
				btnList.append($(`<li class="as_pagination_item"></li>`))
			}
			this.el.append(btnList)
			this.addSliderBtnClass()
		}

		// 给 分页器 添加 class
		addSliderBtnClass() {
			this.el.find('.as_pagination_item').eq(this.config.initialSlide).addClass('swiper_selected').siblings().removeClass('swiper_selected')
		}

		// 事件
		_addEventTouch() {
			this.el.on('touchstart', e => this._touchStart(e))
			this.el.on('touchmove', e => this._touchMove(e))
			this.el.on('touchend', e => this._touchEnd(e))
			/*
			* 移动端事件需要清楚的知识概念：
			* TouchEvent.changedTouches ====》 涉及触发当前事件的触摸点的列表
			* TouchEvent.targetTouches ====》 当前element 元素对象上的所有触摸点的列表
			* TouchEvent.touches ====》 当前屏幕上所有触摸点的列表
			* Touch.clientX ====》 返回触点相对于可见区域（浏览器窗口）左边沿的X坐标，不包括任何滚动偏移
			* Touch.clientY ====》 返回触点相对于可见区域（浏览器窗口）上边沿的Y坐标，不包括任何滚动偏移
			* Touch.pageX ====》 触点相对于HTML 文档左边沿的X 坐标，和 clientX 属性不同，这个值是相对与整个html文档坐标，和用户滚动位置无关. 因此当存在水平滚动的偏移时, 这个值包含了水平滚动的偏移.
			* Touch.pageY ====》 触点相对于HTML 文档上边沿的Y 坐标，和 clientX 属性不同，这个值是相对与整个html文档坐标，和用户滚动位置无关. 因此当存在水平滚动的偏移时, 这个值包含了水平滚动的偏移.
			* Touch.screenX ====》 返回触点相对于屏幕左边沿的X坐标，不包含页面滚动的偏移量
			* Touch.screenY ====》 返回触点相对于屏幕上边沿的Y坐标，不包含页面滚动的偏移量
			* */
		}

		_touchStart(e) {
			// 获取用户的起始坐标点
			this.ss = clearInterval(this.time)
			this.startX = e.changedTouches[0].clientX
			this.startY = e.changedTouches[0].clientY
			// 开始的时候缓存索引 主要用于Touchemove 中的逻辑 减一是因为 touchend 中的索引会 ++ || --
			this.cacheIndex = this.config.initialSlide - 1
		}

		_touchMove(e) {
			e.preventDefault()
			let moveEndX = e.changedTouches[0].clientX
			let moveEndY = e.changedTouches[0].clientY
			// 计算 this.translate的值
			// 计算 this.config.initialSlide
			this.translate = this.config.direction ? moveEndY - this.startY : moveEndX - this.startX
			// console.log(this.translate)

			/*
			* 改变 translate3d 的值
			* */
			this._wrapper.css('transition', 'none')
			// this._wrapper.css({
			// 	'transition': 'none',
			// 	'transform': `translate3d(${this.translate + this.translateChange}px,0,0)`
			// })
			// console.log(Math.round(Math.abs(this.translate / this._sliderHeight)))
			// 开启多个持续操作
			if (this.config.multiMove) this.config.initialSlide = this.cacheIndex + Math.floor(this.translate / this._sliderHeight) * -1
			this._wrapperTranslate(this.translate + this.translateChange)
		}

		_touchEnd(e) {
			let endX = e.changedTouches[0].clientX
			let endY = e.changedTouches[0].clientY
			/*
			* 在手指离开的时候计算 this.config.initialSlide 的值
			* 怎么计算？
			* 根据：this.translate 的值来计算
			*
			* */
			/*
			* 需要判断左滑还是右滑：
			*  根据： this.translate > 0 往右反之往左
			*
			* */
			// 如果没有滑到一半则为 阻止下面执行
			let bool = this.config.direction ? Math.abs(this.translate) > this._sliderHeight / 3 : Math.abs(this.translate) > this._sliderWidth / 3
			if (bool) {
				/*if (this.translate > 0) {
					this.config.initialSlide--
					this.translateChange = this._sliderWidth * this.config.initialSlide * -1
					this._wrapper.css({
						'transition': 'transform .5s ease-out',
						'transform': `translate3d(${this.translateChange}px,0,0)`
					})
					console.log('往右', this.config.initialSlide)
				} else {
					this.config.initialSlide++
					// 缓存当前 transalte3d() 最终的值
					this.translateChange = this._sliderWidth * this.config.initialSlide * -1
					this._wrapper.css({
						'transition': 'transform .5s ease-out',
						'transform': `translate3d(${this.translateChange}px,0,0)`
					})
					console.log('往左', this.config.initialSlide)
				}*/
				// 判断 用户行为是： 往左还是往右 || 往上还是往下
				this.advanceOrRetreat()
				this.translate = 0
			} else {
				console.log('没有达到一半')
				this.translate = this.config.direction ? endY - this.startY - this.translate : endX - this.startX - this.translate
				this._wrapper.css('transition', 'transform .5s ease-out')
				this._wrapperTranslate(this.translate + this.translateChange)
				// this._wrapper.css({
				// 		'transition': 'transform .5s ease-out',
				// 		'transform': `translate3d(${this.translate + this.translateChange}px,0,0)`
				// })
			}
			if (this.config.autoplay) this.autoplay()
			this.config.endFn && this.config.endFn(this.config.initialSlide)
		}

		// 轮播切换
		swiperTab() {
			this.translateChange = this.config.direction ? this._sliderHeight * this.config.initialSlide * -1 : this._sliderWidth * this.config.initialSlide * -1
			this._wrapper.css('transition', 'transform .5s ease-out')
			// this._wrapper.css({
			// 	'transition': 'transform .5s ease-out',
			// 	'transform': `translate3d(${this.translateChange}px,0,0)`
			// })
			this._wrapperTranslate(this.translateChange)
		}

		// 判断 用户行为是： 往左还是往右 || 往上还是往下
		advanceOrRetreat(bool) {
			if (this.translate > 0) {
				this.config.initialSlide--
				if (this.config.initialSlide <= 0) {
					this.config.initialSlide = 0
				}
				// console.log('往右', this.config.initialSlide)
			} else {
				this.config.initialSlide++
				// 缓存当前 transalte3d() 最终的值
				if (this.config.initialSlide >= this._slider.length && !bool) {
					this.config.initialSlide = this._slider.length - 1
				} else {
					this.config.initialSlide %= this._slider.length
				}
				// console.log('往左', this.config.initialSlide)
			}
			this.swiperTab()
			// 底部按钮 切换样式
			this.addSliderBtnClass()
		}

		// 自动轮播业务
		autoplay() {
			// 默认不会轮播
			if (!this.config.autoplay) return false
			this.time = setInterval(() => {
				this.advanceOrRetreat(true)
			}, this.msec)
		}

		// 计算轮播时间
		computeTime() {
			return Number(this.config.autoplay) || 1000
		}

		// 封装: 位移 ====》 水平还是垂直
		_wrapperTranslate(distance) {
			if (this.config.direction) {
				this._wrapper.css('transform', `translate3d(0, ${distance}px, 0)`)
			} else {
				this._wrapper.css('transform', `translate3d(${distance}px, 0, 0)`)
			}
		}
	}

	$.fn.swiper = function (options) {
		return new Swiper(options, this)
	}
}($)