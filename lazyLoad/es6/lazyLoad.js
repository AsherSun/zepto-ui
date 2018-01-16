/*
	图片按需加载 : 在 zepto || jquery 下扩展
	Author: Asher Sun
	versions：0.0.1

	lazyLoad(); 构造方法

	************************

	config配置：

	style：图片出现的样式 默认配置： <style>[data-src]{transition:opacity .7s ease; opacity:0;}</style>

	styleSign：style 的 标识：默认为 ID 选择器，可以配置class 选择器 。默认配置: #lazyLoad

	el：按需加载的dom 元素，默认为 class 选择器，现只支持class 选择器。默认配置：.lazyLoad

	attr: 图片路径存放的自定义属性，默认配置为：data-src

	scrollArea: 滚动区域，默认为 window

	callback : function 处理数据加载完之后的业务 args[0] 为 dom对象 args[1]为url args[2] 为元素类型，img元素返回true
*/

// 图片按需加载 在 zepto 下扩展
;($ => {
	// 
	$.lazyLoad = options => new lazyLoad(options);

	class lazyLoad {
		constructor(options) {
			// 用于生成style标签
			this.isAddStyle = false;
			this.init(options);
		}

		init(options) {
			// 默认配置
			this.config = $.extend(true, {}, {
				style: `[data-lazyload-src]{transition:opacity 1.5s ease; opacity:0;}`,
				el: '[data-lazyload-src]',
				attr: 'data-lazyload-src',
				scrollArea: window,
				time: 1500,
				callback: null
			}, options);
			// 添加样式
			this.addStyle();
			// 核心业务，懒加载
			this.load();
			// 滚动区域
			this.scroll();
		}

		// 文档高度
		dh() {
			return document.documentElement.clientHeight;
		}

		// 获取所有元素
		allDom() {
			return $(this.config.el);
		}

		// 添加样式
		addStyle() {
			if (!this.isAddStyle) {
				this.isAddStyle = true;
				$('head').append(`<style>${this.config.style}</style>`);
			}
		}

		// 加载
		load() {
			this.allDom().each((i, item) => {
				// 获取缓存在自定义属性中的数据 （url）
				let urls = $(item).attr(this.config.attr);
				// 获取DOM元素的宽高、left/top/bottom/right信息集合
				// getBoundingClientRect方法说明， MDN 飞机票：https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
				let react = item.getBoundingClientRect();
				// 根据元素top/bottom等信息进行判断
				if (react.top < this.dh() && react.bottom >= 0) {
					// 对每个进行懒加载业务的DOM对象绑定标识。该标识用来处理懒加载完成之后lazyLoad插件的自行销毁。
					$(item).attr('data-lazyload-id', i)
					// 判断什么元素 img 元素为 true ，其他元素为false
					if (this.judgeElementType(item)) {
						// img图片加载
						this.imgLoad(item, urls)
						// 暴露到插件外部的回调函数
						this.config.callback && this.config.callback.call(this, item, urls, this.judgeElementType(item))
					} else {
						// 背景图加载
						this.bgImgLoad(item, urls)
						this.config.callback && this.config.callback.call(this, item, urls, this.judgeElementType(item))
					}
					// 在addStyle方法中，opacity属性为 0，所以这里让图片淡入
					$(item).css('opacity', '1')
					// 销毁插件 。
					this.removeAttr(item)
				}
			});
		}

		// img元素加载
		imgLoad(item, ulrs) {
			item.src = ulrs;
		}

		// 其他元素的背景图加载
		bgImgLoad(item, ulrs) {
			$(item).css({
				'background-image': `url('${ulrs}')`
			})
		}

		/*
			加载完 删除插件自带属性 (销毁插件)
			如何判断加载完成？
				1、可以根据 img 的 src属性 或者background-image 属性
				2、自定义一个标识符属性，根据自定义的属性来判断是否加载过，我们选择这个条件
		*/
		removeAttr(item) {
			if ($(item).attr('data-lazyload-id')) {
				setTimeout(() => {
					$(item).removeAttr(this.config.attr)
				}, this.config.time)
			}
		}

		/*
			1. 判断是img元素 还是背景图 返回值：boolean
					根据 DOM 操作中的 tagName 属性
					MDN 飞机票 ：https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName 
		*/
		judgeElementType(el) {
			if (el.tagName === 'IMG') return true
		}

		/*
			添加滚动区域
		*/
		scroll() {
			$(this.config.scrollArea).on('scroll', () => {
				this.load()
			})
		}

		// 判断style标识
		// getSign() {
		// 	switch (this.signType()) {
		// 		case 'id':
		// 			return this.config.styleSign.replace('#', '');
		// 			break;
		// 		case 'class':
		// 			return this.config.styleSign.replace('.', '');
		// 			break;
		// 		default:
		// 			return this.config.styleSign;
		// 			break;
		// 	}
		// }

		// // 标识类型
		// signType() {
		// 	let sign = /^#/.test(this.config.styleSign) ? 'id' : 'class';
		// 	return sign;
		// }

		getSign() {
			switch (this.signType()) {
				case 'id':
					return this.config.styleSign.replace('#', '');
					break;
				case 'class':
					return this.config.styleSign.replace('.', '');
					break;
				default:
					return this.config.styleSign;
					break;
			}
		}

		signType() {
			let sign = /^#/.test(this.config.styleSign) ? 'id' : 'class';
			return sign;
		}
	}
})($ || window.Zepto || window.jQuery);