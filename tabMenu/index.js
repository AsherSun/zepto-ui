import 'babel-polyfill'
import 'Public/rem'
import 'Public/global.css'
import './es6/tabMenu'
import './less/tabMenu.less'

// 普通切换
$.tabMenu({
	menu: '.tabMenu-none-header-items',
	content: '.tabMenu-none-body-content',
	indexes: 1
})
// 滑动切换
$.tabMenu({
	menu: '.tabMenu-slide-header-items',
	content: '.tabMenu-slide-body-content',
	tab_action: 'slide',
	indexes: 2
})
// 缩放切换
$.tabMenu({
	menu: '.tabMenu-scale-header-items',
	content: '.tabMenu-scale-body-content',
	tab_action: 'scale',
	indexes: 3
})