/*
	菜单弹出插件
	Author: Asher Sun
	versions：0.0.1

	popover();


	********************
	config 配置：

	title: 菜单标题
	mask: 弹出菜单时是否出现遮罩层
	popoverContent: 菜单内容
	listBoxSelector: 菜单盒子的父元素样式表选择器,
	contentBoxSelector:  菜单容器的样式表选择器

*/

// popover 菜单弹出插件。在zepto原型下扩展
;($=>{
	$.fn.popover = function(options){
		return new popover(this,options);
	}
	class popover{
		constructor(el,options){
			// 默认配置
			this.config = {
				// 标题
				title:'',
				// 遮罩层
				mask:true,
				// 菜单
				popoverContent:null,
				// 菜单盒子的父元素样式表选择器
				listBoxSelector:'',
				// 菜单容器的样式表选择器
				contentBoxSelector:''
			}

			this.$el = el;
			// 当前 this 指向的 DOM 元素
			this.init(options);
		}

		init(options) {
			this.opts = $.extend(true,{},this.config,options);
			// 当前元素的 parent
			this.parentDom = this.$el.parent();
			//console.log(this.parentDom);
			// 创建遮罩层
			this.maskDom = $('<div class="popover-mask"></div>');
			// 创建菜单窗口
			this.windowDom = $('<div class="popover-window"></div>');
			// 创建菜单容器
			this.contentDom = $('<div class="'+this.opts.contentBoxSelector+'"></div>');
			// 创建标题盒子
			this.titleBoxDom = $('<div class="popover-title"></div>');
			// 创建菜单盒子
			this.listBoxDom = $('<div class="'+this.opts.listBoxSelector+'"></div>');
			//
			this.created();

		}

		// 创建 DOM
		created() {
			// 判断是否会创建多个
			let self = this;
			if(!this.isMoreDom()){
				// 判断是否创建遮罩层
				if(this.opts.mask){
					// 创建遮罩层
					this.windowDom.append(this.maskDom);
				}else{
					$('#section-content').on('touchstart',function(e){
						self.parentDom.find('.popover-window').remove();
					});
				}
				// 添加标题
				if(this.opts.title){
					this.titleBoxDom.append(this.opts.title);
					// 创建标题盒子
					this.contentDom.append(this.titleBoxDom);
				}
				// 菜单内容
				this.createPopoverContent();
				// 创建菜单盒子
				this.contentDom.append(this.listBoxDom);
				// 创建菜单容器
				this.windowDom.append(this.contentDom);
				// 创建菜单窗口
				this.parentDom.append(this.windowDom);
				// 解决窗口滚动问题 如果页面中有上拉加载等业务 使用 position:fixed 解决窗口滚动问题会触发上拉加载业务。由此造成BUG，所以使用overflow:hidden;
				//$('body').css({'position':'fixed','width':'100%'});
				this.remove();
			}
		}
		// 判断当前元素是否为多个
		isMoreDom() {
			if(this.parentDom.find('.popover-window').length >= 1)return true;
		}
		// 点击遮罩层菜单窗口元素
		remove() {
			this.maskDom.on('tap touchstart',(e)=>{
				this.contentDom.removeClass('flip-up').addClass('flip-down');
				let time = setTimeout(()=>{
					this.parentDom.find('.popover-window').remove();
					clearTimeout(time);
				},550);
			});
		}
		// 创建菜单内容
		createPopoverContent() {
			let self = this;
			// 判断是否创建默认菜单
			$(this.opts.popoverContent).each((i,items)=>{
				// 添加菜单
				items.text?this.listBoxDom.append(items.text):console.log('请传入内容');
				if(items.callBack)this.listBoxDom.children().eq(i).on('tap',function(e){
					e = e || event;
					items.callBack.call(this);
				});
			});
		}
	}
})($ || window.Zepto || window.jQuery);