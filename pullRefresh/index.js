import 'babel-polyfill'
import 'Public/global.css'
import 'Public/rem'
import './less/loading_1.less'
import './less/loading_2.less'
import './less/loadData.less'
import './less/tabLoad.less'
import {getRandomColor} from "./es6/getRandomColor"
import './es6/loadData'

// loadData html
$(function ($) {
	let i = 0
	let n = 10
	let j = -1
	let m = -5
	$('ul').upRefresh({
		scrollArea: window,
		up: function () {
			let c = getRandomColor();
			for (; j > m; j--) {
				$('ul').children().eq(0).before(`<li style='color:${c}'>up-item: ${j} data</li>`)
			}
			j = m
			m -= 4
		},
		down: function (self) {
			// console.log(self)
			let c = getRandomColor();
			for (; i < n; i++) {
				$('ul').append(`<li style="background-color:${c};color: #FFF">down-item: ${i} data</li>`)
			}
			self.flag = true
			i = n
			n += 10
		},
		distance: 100
	})
})

// tabLoad html
$(function ($) {
	loadData(0)
	$('.container').eq(0).show().siblings().hide()
	$('.navMenu-item').click(function () {
		$(this).addClass('selected').siblings().removeClass('selected')
		let index = $(this).index()
		$('.container').eq(index).show().siblings().hide()
		if (index === 0) {
			return false
		} else {
			if (!$('.container').eq(index).attr('data-sing')) {
				$('.container').eq(index).attr('data-sing', 'data-sing')
				loadData(index)
			}
		}
	})

	function loadData(index) {
		$('.container').eq(index).upRefresh({
			scrollArea: window,
			up: function () {
				if ($('.container').eq(index).css('display') === 'block') {
					let color = getRandomColor()
					for (let i = -1; i > -5; i--) {
						$('.container').eq(index).children().eq(0).before(`<li class='container-list' style='color:${color}'>第${index + 1}个选项卡</li>`)
					}
				}
			},
			down: function (self) {
				if ($('.container').eq(index).css('display') === 'block') {
					let color = getRandomColor()
					for (let i = 0; i < 10; i++) {
						$('.container').eq(index).append(`<li class='container-list' style='background-color:${color};color:#FFF'>第${index + 1}个选项卡</li>`)
					}
				}
				self.flag = true
			},
			distance: 100
		})
	}
})