import 'babel-polyfill'
import 'Public/rem'
import 'Public/global.css'
import './less/tip.less'
import './less/tips-ui.less'
import './es6/Tips'

// 如果页面引入 了 tips 的样式，则需要将插件内部内置的样式 赋空
$('.bbt-button').click(function () {
	new Tip({
		text: 'hello',
		tipStyle: ''
	})
})