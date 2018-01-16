import 'Public/global.css'
import 'Public/rem.js'
import './less/cityPicker.css'
import './../swiper/es6/swiper'

$('.as_content_slot').eq(0).swiper({
	multiMove: true,
	wrapper: '.as_content_list',
	slider: '.as_content_list_item',
	direction: true
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
})