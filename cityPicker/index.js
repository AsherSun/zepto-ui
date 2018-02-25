import 'babel-polyfill'
import 'Public/global.css'
import 'Public/rem.js'
import './less/cityPicker.css'
import './../swiper/es6/swiper'
import './es6/cityPicker'

$('.btn').cityPicker({
	url: 'https://easy-mock.com/mock/5a4c79ccc353ef665d0f42bc/cityPicker/cityPicker'
})

/*console.log($('.as_content_slot'))
$('.as_content_slot').eq(0).swiper({
	wrapper: '.as_content_list',
	slider: '.as_content_list_item',
	direction: true,
	multiMove: true
})
$('.as_content_slot').eq(1).swiper({
	wrapper: '.as_content_list',
	slider: '.as_content_list_item',
	direction: true,
	multiMove: true
})
$('.as_content_slot').eq(2).swiper({
	wrapper: '.as_content_list',
	slider: '.as_content_list_item',
	direction: true,
	multiMove: true
})*/
