import 'babel-polyfill'
import 'Public/rem'
import 'Public/global.css'
import './less/tip.less'
import './less/tips-ui.less'
import './es6/Tips'

$('.bbt-button').click(function () {
	new Tip({
		text: 'hello'
	})
})