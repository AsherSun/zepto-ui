/*
	基于zepto 开发 上拉加载、下拉刷新插件：

	1.	如果滚动条滚动到底部，那么需要触发数据加载 (上拉加载数据)
		问题：
			怎么判断 滚动条是否滚动到底部？
			怎么加载？
			怎么触发加载？
	2. 如果首次加载页面没有数据，那么也需要触发数据加载
		问题：
			怎么判断页面是否有数据？
				判断条件：文档高度 < 用户设备的高度 

	3. 如果用户进行下拉刷新，那么就触发数据加载
		问题：
			怎么判断用户是否进行了下拉刷新？
			下拉刷新的数据怎么加载？
			怎么触发加载？
	4.	加载的loading提示在什么时候插入？

	瀑布流加载的config配置默认参数：
		1.	scrollArea 滚动区域
		2.	loading 提示
		3.	up 下拉刷新的方法
		4.	down 上拉加载的方法
		5.	distance 下拉刷新的默认间距 用来判断用户行为是否需要下拉刷新

		// 在插件开发过程中新增的 默认参数
		docInitSwitch：用于决定是否多次执行 docInitNoData() 方法, 默认可以多次执行
		downLoading: 上拉加载的loading动画
		upLoading：下拉加载的loading动画
	
*/
(function ($) {
	const win = window
	$.fn.upRefresh = function (options) {
		return new PullRefresh(this, options)
	}

	class PullRefresh {
		// 构造函数
		constructor(el, options) {
			// 用于阻止多次创建 上拉加载的loading提示
			this.downLoadDom
			// 用于阻止多次创建 下拉刷新的loading提示
			this.upLoadDom
			// 当前的 $ 对象
			this.elDom = el
			this.flag = true
			// 用来缓存移动端事件中用户行为的坐标值
			this.startCoordinate = 0
			this.moveCoordinate = 0
			this.init(options)
		}

		// 初始化函数
		init(options) {
			this.config = $.extend({
				scrollArea: win,
				up: null,
				down: null,
				downLoading: {
					domStruct: `<div class="loadingTwo" >
												<div class="animateTwo"></div>
												<div class="hintText" style="font-size:10px;">Loading</div>
											</div>`,
					style: `.loadingTwo{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:wrap column;flex-flow:wrap column;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.loadingTwo .animateTwo{position:relative}.loadingTwo .animateTwo:before{content:'';display:block;width:.4rem;height:.4rem;border-radius:50%;border:3px solid rgba(0,0,0,.3)}.loadingTwo .animateTwo:after{content:'';display:block;position:absolute;width:.4rem;height:.4rem;border-radius:50%;top:0;bottom:0;border:3px solid transparent;border-left-color:#45b0e0;-webkit-animation-name:circle;animation-name:circle;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-timing-function:linear;animation-timing-function:linear;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-direction:normal;animation-direction:normal}@keyframes circle{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes circle{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}`,
					//
					sign: '.loadingTwo'
				},
				upLoading: {
					domStruct: `<div class="loadingThree">
												<div class="animateThree">
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
													<span class="circle"></span>
												</div>
												<div class="hintText">正在加载下一页</div>
											</div>`,
					style: `.loadingThree{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:column wrap;flex-flow:column wrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.loadingThree .animateThree{position:relative;width:.4rem;height:.4rem;-webkit-animation-name:animateThree;animation-name:animateThree;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-timing-function:linear;animation-timing-function:linear;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-direction:normal;animation-direction:normal;-webkit-animation-delay:0;animation-delay:0}.loadingThree .animateThree .circle{position:absolute;top:0;left:0;width:.4rem;height:.4rem}.loadingThree .animateThree .circle:first-child{-webkit-transform:rotate(30deg);transform:rotate(30deg);opacity:.083}.loadingThree .animateThree .circle:nth-child(2){-webkit-transform:rotate(60deg);transform:rotate(60deg);opacity:.166}.loadingThree .animateThree .circle:nth-child(3){-webkit-transform:rotate(90deg);transform:rotate(90deg);opacity:.249}.loadingThree .animateThree .circle:nth-child(4){-webkit-transform:rotate(120deg);transform:rotate(120deg);opacity:.332}.loadingThree .animateThree .circle:nth-child(5){-webkit-transform:rotate(150deg);transform:rotate(150deg);opacity:.415}.loadingThree .animateThree .circle:nth-child(6){-webkit-transform:rotate(180deg);transform:rotate(180deg);opacity:.498}.loadingThree .animateThree .circle:nth-child(7){-webkit-transform:rotate(210deg);transform:rotate(210deg);opacity:.581}.loadingThree .animateThree .circle:nth-child(8){-webkit-transform:rotate(240deg);transform:rotate(240deg);opacity:.664}.loadingThree .animateThree .circle:nth-child(9){-webkit-transform:rotate(270deg);transform:rotate(270deg);opacity:.747}.loadingThree .animateThree .circle:nth-child(10){-webkit-transform:rotate(300deg);transform:rotate(300deg);opacity:.83}.loadingThree .animateThree .circle:nth-child(11){-webkit-transform:rotate(330deg);transform:rotate(330deg);opacity:.913}.loadingThree .animateThree .circle:last-chid{-webkit-transform:rotate(360deg);transform:rotate(360deg);opacity:.996}.loadingThree .animateThree .circle:after{content:'';position:absolute;width:.04rem;height:.08rem;top:0;left:.2rem;background-color:#7b8084}@keyframes animateThree{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes animateThree{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}`,
					sign: `.loadingThree`
				},
				distance: 50,
				// 定义一个开关 用于决定是否多次执行 docInitNoData 方法 默认为 可以 多次执行
				docInitSwitch: false
			}, options)
			// 滚动行为
			this.scrollEvent()
			// 判断页面初始化时有没有数据
			this.docInitNoData()
			// 用户行为事件初始化
			this.touchStart()
			this.touchMove()
			this.touchEnd()
		}

		// 先获取 document 文档高度
		getDocHeight() {
			return $(document).height()
		}

		// 获取浏览器滚动高度
		getWinHeight() {
			return $(win).scrollTop()
		}

		// 获取当前设备的高度
		getScreenHeight() {
			return $(win).height()
		}

		// 上拉加载的条件
		isLoadData() {
			// console.log('ssss',this.getDocHeight() - this.getWinHeight() )
			// console.log(this.getScreenHeight() - 50)
			if (this.getDocHeight() - this.getWinHeight() <= this.getScreenHeight() && this.flag) {
				this.flag = false
				this.loadDomIsShwo('show')
				return true
			}
			return false
		}

		// load-data
		loadData() {
			if (this.isLoadData()) {
				// console.log('滚动到底部了，你需要加载数据')
				// 动态添加 loading加载动画
				this.creatDownLoadDom()
				setTimeout(() => {
					// 处理数据加载
					this.config.down(this)
					// loading是否隐藏
					this.loadDomIsShwo()
				}, 1000)
			}

		}

		// 绑定滚动事件
		scrollEvent() {
			$(this.config.scrollArea).scroll(() => {
				// 数据加载
				this.loadData()
			})
		}

		// 判断页面初始化的时候有没有数据，如果没有那么就 执行 加载方法
		// 文档高度 < 用户设备高度，就去获取数据进行DOM渲染
		docInitNoData() {
			// console.log('docInitNoData')
			if (this.getDocHeight() > this.getScreenHeight()) return false;
			this.loadData()
			if (this.config.docInitSwitch) return true
			setTimeout(() => {
				this.docInitNoData()
			}, 1200)
			return true
		}

		// 用于动态创建 loading 加载的
		creatDownLoadDom() {
			if (this.downLoadDom || $(this.config.downLoading.sign).length) return false
			this.downLoadDom = true
			$('body').append(`<style>${this.config.downLoading.style}</style>`).append(this.config.downLoading.domStruct)
		}

		// 用于加载完处理loading的出现，隐藏
		loadDomIsShwo(condition) {
			if (condition) {
				$(this.config.downLoading.sign).show()
			} else {
				$(this.config.downLoading.sign).hide()
			}
		}

		// 处理 用户下拉刷新的业务
		/*
			在处理之前先要获取用户的操作行为
				根据移动端事件来进行判断用于行为

					事件中的要使用的知识点：
						事件对象的 targetTouches 与 changedTouches 属性的区别
						clientX/clientY 与 pageX/pageY 与screenX/screenY 的区别，需要理解三者对应的不同业务场景

				判断用户是否需要下拉刷新的业务，我们就需要知道用户手指在 屏幕上 垂直方向的移动距离 根据移动距离来决定是否进行下拉刷新业务
						
		*/

		// touchStart 事件
		touchStart() {
			this.elDom.on('touchstart', (e) => {
				// console.log(e.targetTouches[0])
				// console.log('e.targetTouches[0].clientY', e.targetTouches[0].clientY)
				this.startCoordinate = e.targetTouches[0].clientY
				// console.log('e.targetTouches[0].pageY', e.targetTouches[0].pageY)
				// console.log('e.targetTouches[0].screenY', e.targetTouches[0].screenY)
			})
		}

		// touchmove 事件
		touchMove() {
			this.elDom.on('touchmove', (e) => {
				this.moveCoordinate = e.targetTouches[0].clientY
				// 在这里判断是否需要下拉刷新
				// 判断条件（垂直方向）：开始坐标值 - 移动坐标值 >= this.config.distance 则触发

				// console.log('moveCoordinate', startCoordinate)
				// console.log('startCoordinate', moveCoordinate)
				if (this.upLoadData()) {
					this.createUploadDom()
					$(this.config.upLoading.sign).show()
					$(this.config.upLoading.sign).css('top', (this.upLoadData() - this.config.distance))
				}
			})
		}

		// touchend 事件
		touchEnd() {
			this.elDom.on('touchend', (e) => {
				if (this.upLoadData()) {
					$(this.config.upLoading.sign).css('top', 50)
					setTimeout(() => {
						this.config.up(this)
						$(this.config.upLoading.sign).css('top', 0)
						$(this.config.upLoading.sign).hide()
					}, 1000)
					this.moveCoordinate = 0
					this.startCoordinate = 0
				}
			})
		}

		// 下拉刷新条件
		upLoadData() {
			console.log((this.startCoordinate - this.moveCoordinate) * -1)
			console.log('this.config.distance', this.config.distance)
			if ((this.startCoordinate - this.moveCoordinate) * -1 >= this.config.distance && $(this.config.scrollArea).scrollTop() === 0) {
				return Math.abs(this.startCoordinate - this.moveCoordinate)
			}
			return false
		}

		// 用于创建 下拉刷新的DOM提示
		createUploadDom() {
			if (this.upLoadDom || $(this.config.upLoading.sign).length) return false
			this.upLoadDom = true
			$('body').append(`<style>${this.config.upLoading.style}</style>`).append(this.config.upLoading.domStruct)
		}
	}
})($ || window.Zepto || window.jQuery);

/*
	后续处理的BUG：
		上拉加载时：
			多次触发加载函数 ----》 flag处理
			下拉刷新之后。用户点击页面可能会触发加载函数。 ----》加载完成清楚 缓存的坐标值
	
*/

