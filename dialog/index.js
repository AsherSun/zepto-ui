import 'babel-polyfill'
import './es6/dialog'
import './less/dialog.less'
import './less/style.css'
import 'Public/rem'
import 'Public/global.css'

$('.title').click(function () {
	$.dialog({
		title: '温馨提示！',
		message: '一入编程深似海，六块腹肌变一块	<br>无双才慧映青柠，花容月貌在魔都，面向对象面向君，不负代码不负卿'
	})
})

$('.noTitle').click(function () {
	$.dialog({
		message: '一入编程深似海，六块腹肌变一块	<br>无双才慧映青柠，花容月貌在魔都，面向对象面向君，不负代码不负卿'
	})
})

$('.moreBtns').click(function () {
	$.dialog({
		title: '温馨提示！',
		message: '一入编程深似海，六块腹肌变一块	<br>无双才慧映青柠，花容月貌在魔都，面向对象面向君，不负代码不负卿',
		button: [
			{
				text: '取消'
			},
			{
				text: '确认',
				callback: function () {
					alert(111);
				}
			}
		]
	})
})