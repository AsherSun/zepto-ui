/*
	Tips
	Date: 2018/03/05
	Author: asher sun
	**********************
	@params: config
	**********************
	config配置说明：
	text: 内容 , 默认: ''
	delay: 延迟 , 默认: 3s
*/

class Tip {
	constructor(op) {
		// 创建 tip 提示 盒子
		this.tipBox = $('<div class="bbt-ui-tip"></div>')
		this.init(op)
	}

	init(op) {
		this.config = $.extend({
			text: '',
			tipStyle: `<style tips="tips">
				.bbt-ui-tip {
					position: fixed;
					z-index: 2001;
					background-color: #edf2fc;
					width: 100%;
					text-align: center;
					line-height: 1.8;
					font-size: 14px;
					left: 50%;
					transform: translateX(-50%);
					top: -100%;
					padding: 12px 10px;
					box-sizing: border-box;
					transition: top 1s ease;
				}
			  </style>`,
			delay: 3000,
		}, op)
		this.insertTip(this.config)
	}

	// 消息插入到文档中
	insertTip(config) {
		if (!config.text) return false
		this.addTipStyle(config)
		$('body').append(this.tipBox.text(config.text))
		this.showTip(config)
	}

	// 显示
	showTip(config) {
		setTimeout(() => {
			this.tipBox.css('top', '0')
		}, 50)
		this.removeTip(config)
	}

	// 自删
	removeTip(config) {
		setTimeout(() => {
			this.tipBox.css('top', '-100%')
		}, config.delay)
		setTimeout(() => {
			this.tipBox.remove()
		}, config.delay + 150)
	}

	// 插入样式
	addTipStyle(config) {
		if(!config.tipStyle) return false
		if($('[tips="tips"]')[0]) return false
		$('head').append(config.tipStyle)
	}
}

window.Tip = Tip

$.tip = function (options) {
	return new Tip(options)
}