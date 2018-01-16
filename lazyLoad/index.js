import 'babel-polyfill'
import './less/lazyLoad.less'
import './es6/lazyLoad'
import 'Public/global.css'
import 'Public/rem'
import {data} from './data/data'

(function () {
	var ulDom = document.getElementsByTagName('ul');
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			// img 元素加载
			// ulDom[i].innerHTML += `<li><img data-lazyload-src='${data[i][j]}'></li>`;
			// 背景图加载
			ulDom[i].innerHTML += `<li data-lazyload-src='${data[i][j]}'></li>`;
		}
	}
})();

// 插件调用
$.lazyLoad({
	callback: function (...args) {
		if (!args[2]) {
			$(args[0]).css('padding-top', '85%')
		}
	}
})