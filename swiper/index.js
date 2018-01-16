import 'Public/global.css'
import 'Public/rem.js'
import './less/swiper.less'
import './es6/swiper'

$('#swiper_one').swiper({
	wrapper: '.swiper-wrapper',
	slider: '.swiper-slide',
	createSliderBtn: '创建'
})
$('#swiper_two').swiper({
	wrapper: '.swiper-wrapper',
	slider: '.swiper-slide'
})
$('#swiper_three').swiper({
	wrapper: '.swiper-wrapper',
	slider: '.swiper-slide',
	autoplay: 2000
})
$('#swiper_four').swiper({
	wrapper: '.swiper-wrapper',
	slider: '.swiper-slide',
	initialSlide: 2,
	createSliderBtn: true
})
$('#swiper_five').swiper({
	wrapper: '.swiper-wrapper',
	slider: '.swiper-slide',
	initialSlide: 1,
	createSliderBtn: true,
	autoplay: 3000
})
$('#swiper_six').swiper({
	direction: '垂直',
	createSliderBtn: true
})
$('#swiper_seven').swiper({
	direction: true,
	autoplay: 1500
})
$('#swiper_nine').swiper({
	direction: true,
	createSliderBtn: true,
	initialSlide: 1
})
$('#swiper_ten').swiper({
	direction: true
})