import 'babel-polyfill'
import 'Public/global.css'
import 'Public/rem'
import './less/style.less'
// popover 头部弹出菜单样式
import './less/headerPopover.less'
// popover 底部弹出菜单样式
import './less/footerPopover.less'
// popover 分享弹出菜单样式
import './less/sharePopover.less'
// popover 列表弹出菜单样式
import './less/listPopover.less'
import './es6/popover'

Zepto(() => {
	// 头部弹出菜单
	$('header > span').click(function () {
		$(this).popover({
			contentBoxSelector: 'header-sheare',
			popoverContent: [
				{
					text: `
								<a href="javascript:void(0);"><i class="iconfont icon-wechat-copy"></i><span>分享到微信</span></a>
							`,
					callBack() {
						console.log('选项一', this);
					}
				},
				{
					text: `
								<a href="javascript:void(0);"><i class="iconfont icon-iconfont"></i><span>分享到朋友圈</span></a>
							`,
					callBack() {
						console.log('选项二', this);
					}
				},
				{
					text: `
								<a href="javascript:void(0);"><i class="iconfont icon-weibo"></i><span>分享到微博</span></a>
							`,
					callBack() {
						console.log('选项三', this);
					}
				},
				{
					text: `
								<a href="javascript:void(0);"><i class="iconfont icon-qq"></i><span>分享到QQ</span></a>
							`,
					callBack() {
						console.log('选项四', this);
					}
				},
				{
					text: `
								<a href="javascript:void(0);"><i class="iconfont icon-kongjian"></i><span>分享到QQ空间</span></a>
							`,
					callBack() {
						console.log('选项五', this);
					}
				},
				{
					text: `
								<a href="javascript:void(0);"><i class="iconfont icon-shuaxin"></i><span>刷新</span></a>
							`,
					callBack() {
						location.href = location.href;
					}
				}
			]
		})
	})
	// 分享弹出菜单
	$('section > .btn_1').click(function () {
		$(this).popover({
			title: '<div class="msg">分享给小伙伴</div>',
			listBoxSelector: 'popover-list',
			contentBoxSelector: 'popover-content flip-up',
			popoverContent: [
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -51px"></div>
									<span>一键分享</span>
								</a>
							`,
					callBack() {
						console.log('选项一', this);
					}
				},
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -102px"></div>
									<span>新浪微博</span>
								</a>
							`,
					callBack() {
						console.log('选项二', this);
					}
				},
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -153px"></div>
									<span>QQ好友</span>
								</a>
							`,
					callBack() {
						console.log('选项三', this);
					}
				},
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -204px"></div>
									<span>QQ空间</span>
								</a>
							`,
					callBack() {
						console.log('选项四', this);
					}
				},
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -255px"></div>
									<span>百度贴吧</span>
								</a>
							`,
					callBack() {
						console.log('选项五', this);
					}
				},
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -306px"></div>
									<span>豆瓣</span>
								</a>
							`,
					callBack() {
						console.log('选项六', this);
					}
				},
				{
					text: `
								<a href="javascript:;" class="btn-share" target="_blank">
									<div class="icon" style="background-position-y: -357px"></div>
									<span>二维码</span>
								</a>
							`,
					callBack() {
						console.log('选项七', this);
					}
				}
			]
		})
	})
	// 列表弹出菜单
	$('section > .btn_2').click(function () {
		$(this).popover({
			title: '分享给小伙伴',
			listBoxSelector: 'popoverList',
			contentBoxSelector: 'popoverContent flip-up',
			popoverContent: [
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项一', this);
					}
				},
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项二', this);
					}
				},
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项三', this);
					}
				},
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项四', this);
					}
				},
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项五', this);
					}
				},
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项六', this);
					}
				},
				{
					text: `<a>items-1</a>`,
					callBack() {
						console.log('选项七', this);
					}
				}
			]
		})
	})
	// 底部弹出菜单
	$('footer > a').click(function () {
		$(this).popover({
			contentBoxSelector: 'footer_popover',
			listBoxSelector: 'footer_popover_list',
			popoverContent: [
				{
					text: `<a >items-1</a>`,
					callBack() {
						console.log('选项一', this)
					}
				},
				{
					text: `<a >items-2</a>`,
					callBack() {
						console.log('选项二', this)
					}
				},
				{
					text: `<a >items-3</a>`,
					callBack() {
						console.log('选项三', this)
					}
				},
				{
					text: `<a >items-4</a>`,
					callBack() {
						console.log('选项四', this)
					}
				},
				{
					text: `<a >items-5</a>`,
					callBack() {
						console.log('选项五', this)
					}
				}
			]
		})
	})
})