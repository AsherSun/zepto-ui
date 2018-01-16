/*
*Swiper插件
*日期：2017-3-24
*config参数说明
*---------
*container：必填项操作的DOM
*wrapper：操作父dom
*slide：滚动列表
*initialSlide:从第几项开始
*direction：滚动方向(horizontal(横向),vertical(纵向))
*autoplay: 自由滚动
*pagination：索引
*startFn：开始函数
*endFn: 滚动结束函数
*/
;(function ($) {
	function Swiper(container, config) {
		// 判断传进来的是否为DOM对象上 的选择器
		if (!container && !(typeof container == 'string')) {
			alert('参数不对！');
		}
		this.config = {
			// 操作父 DOM
			wrapper: '',
			// 滚动列表
			slide: '',
			// 从第几项开发
			initialSlide: 0,
			// 滚动方向
			direction: 'horizontal',
			// 自动播放
			autoplay: 0,
			// 图片轮播的切换按钮
			pagination: '',
			// 开始函数
			startFn: function () {
			},
			// 结束函数
			endFn: function () {
			}
		};
		//默认参数扩展 isPlainObject 是否为 object 对象
		if (config && $.isPlainObject(config)) {
			$.extend(this.config, config);
		}
		/*创建变量*/
		// 获取整个swiper 盒子
		this.container = $(container);
		// 判断 是否需要操作wrapper dom。 如果需要就在 swiper盒子中查找 否则 赋值为默认dom
		this.wrapper = this.config.wrapper ? this.container.find(this.config.wrapper) : this.container.find('.swiper-wrapper');
		// 轮播的每一项图片
		this.slide = this.config.slide ? this.wrapper.find(this.config.slide) : this.wrapper.find('.swiper-slide');
		// 轮播的用来包装 切换按钮 的盒子
		this.pagination = this.config.pagination ? this.container.find(this.config.pagination) : '';
		// 轮播方向
		this.direction = this.config.direction;
		// 页面初始化的时候，展示第几项
		this.initialSlide = this.config.initialSlide || 0;
		// 根据轮播的方向，获取整个 swiper 盒子的宽或者高
		this.step = this.direction == 'horizontal' ? this.slide.first().width() : this.slide.first().height();
		// 总共有多少项
		this.len = this.slide.length;
		//
		this.num = 0;
		this.translate = 0;
		this.translateChange = 0;
		// 坐标值
		this.startX = 0;
		this.startY = 0;
		// 开关
		this.flag = false;
		// 定时器
		this.timer = null;
		// 判断是否需要定时轮播，如果需要则把时间用户传进来的时间赋值
		this.autoplay = this.config.autoplay ? this.config.autoplay : 0;
		// 初始化 方法
		this.init();
	};

	Swiper.prototype = {
		init: function () {
			this.methods();
			this._initialSlide();
			this._pagination();
			this._current(this.num);
			this.value = this.number;
		},
		_initialSlide: function (number) {
			var _this = this;
			if (number || number == 0) {
				_this.num = number;
				_this._current(_this.num);
				_this.translate = -_this.num * _this.step;
				_this._tarnslate(_this.translate);
			} else if (_this.initialSlide) {
				_this.num = _this.initialSlide;
				_this._current(_this.num);
				_this.translate = -_this.num * _this.step;
				_this._tarnslate(_this.translate);
			}
		},
		_pagination: function () {
			var _this = this;
			if (_this.pagination) {
				var _html = '';
				for (var i = 0; i < _this.len; i++) {
					_html += '<span class="swiper-pagination-bullet"></span>';
				}
				this.pagination.html(_html);
			}
		},
		_tarnslate: function (number) {
			if (this.direction == 'horizontal') {
				this.container.addClass('horizontal');
				this.wrapper.css('transform', 'translate3d(' + number + 'px,0,0)');
			} else if (this.direction == 'vertical') {
				this.container.addClass('vertical');
				this.wrapper.css('transform', 'translate3d(0,' + number + 'px,0)');
			}
		},
		methods: function () {
			var _this = this;
			this.wrapper.on('touchstart', function (e) {
				_this.touchstart(e);
			});
			this.wrapper.on('touchmove', function (e) {
				_this.touchsmove(e);
			});
			this.wrapper.on('touchend', function (e) {
				_this.touchend(e);
			});
			this._autoplay();
		},
		_autoplay: function () {
			var _this = this;
			if (!_this.autoplay) return false;
			this.timer = setInterval(function () {
				_this._interval(_this)
			}, _this.autoplay);
		},
		_interval: function (_this) {
			_this.num++;
			if (_this.num >= _this.len) {
				_this.num = 0;
			}
			_this.translate = -_this.num * _this.step;
			_this._current(_this.num);
			_this._tarnslate(_this.translate);
			_this.wrapper.css('transition', 'all .6s cubic-bezier(0.12, 0.52, 0.58, 0.88) 0s');
		},
		_current: function (number) {
			var _this = this;
			if (_this.pagination) {
				_this.pagination.find('span').removeClass('swiper-pagination-bullet-active').eq(number).addClass('swiper-pagination-bullet-active');
			}

			this.slide.removeClass('swiper-slide-active').eq(number).addClass('swiper-slide-active');
		},
		touchstart: function (e) {
			var _this = this,
				ev = e.originalEvent ? e.originalEvent.changedTouches[0] : e.changedTouches[0];
			clearInterval(_this.timer);
			_this.startX = ev.pageX ? ev.pageX : ev.clientX;
			_this.startY = ev.pageY ? ev.pageY : ev.clientY;
			_this.flag = true;
			_this.num = _this.translate / _this.step;
			_this._tarnslate(_this.translate);
			_this.translateChange = _this.translate;
			_this.wrapper.css('transition', 'none');
			_this.config.startFn(_this.num);
		},
		touchsmove: function (e) {
			var _this = this,
				ev = e.originalEvent ? e.originalEvent.changedTouches[0] : e.changedTouches[0],
				endX = ev.pageX ? ev.pageX : ev.clientX,
				endY = ev.pageY ? ev.pageY : ev.clientY;
			if (_this.flag) {
				e.preventDefault();
				if (this.direction == 'horizontal') {
					_this.translate = endX - _this.startX + _this.translateChange;
				} else if (this.direction == 'vertical') {
					_this.translate = endY - _this.startY + _this.translateChange;
				}
				_this._tarnslate(_this.translate);
			}
		},
		touchend: function (e) {
			var _this = this;
			var ev = e.originalEvent ? e.originalEvent.changedTouches[0] : e.changedTouches[0],
				endX = ev.pageX ? ev.pageX : ev.clientX,
				endY = ev.pageY ? ev.pageY : ev.clientY;
			_this.flag = false;
			if (_this.translate < 0) {
				_this.num = Math.abs(Math.round(_this.translate / _this.step));
			} else {
				_this.num = 0;
			}
			if (_this.num < 0) {
				_this.num = 0;
				_this.translate = 0;
			} else if (_this.num >= _this.len) {
				_this.num = _this.len - 1;
				_this.translate = -_this.num * _this.step;
			} else {
				_this.translate = -_this.num * _this.step;
			}
			_this.wrapper.css('transition', 'all .6s cubic-bezier(0.12, 0.52, 0.58, 0.88) 0s');
			_this._current(_this.num);
			_this._tarnslate(_this.translate);
			_this._autoplay();
			_this.config.endFn(_this.num);
		}
	};

	window.Swiper = Swiper;
})(window.jQuery || $);