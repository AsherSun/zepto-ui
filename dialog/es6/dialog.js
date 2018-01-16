/*
	Dialog
	Date：2017/10/21
	Author: AsherSun
	**********************

	config参数说明：
	title: 标题 default: ''
	message: 内容 default: ''
	button: 按钮 default: [{text:'确认'}]
	isMaskShow: 是否隐藏遮罩层 default: falsee
	技术交流群 ：135170291
*/

(($) => {
	class Dialog {
		constructor(options) {
			// 默认参数
			this.config = {
				title: '',
				message: '',
				button: [
					{
						text: '确认'
					}
				],
				isMaskShow: false
			};
			// 配置参数拷贝
			if (options && $.isPlainObject(options)) $.extend(this.config, options);
			this.init();
		}

		init() {
			this.$body = $('body');
			// 创建弹出窗口
			this.dialogWindow = $('<div class="wptdialog"></div>');

			// 创建内容提示盒子
			this.dialogBox = $('<div class="dialog-main"></div>');
			// 创建装载按钮盒子
			this.dialogBtnBox = $('<div class="dialog-main-btn"></div>')
			// create
			this.create();
		}

		create() {
			// 验证是否需要遮罩层
			// 创建遮罩层
			if (!this.config.isMaskShow) {
				// let mask = $('<div class="dialog-mask"></div>');
				this.dialogWindow.append($('<div class="dialog-mask"></div>'));
			}
			// 验证是否传入标题
			if (this.config.title) {
				// 先创建标题
				// let dialogTitle = $(`<div class="dialog-main-title">${this.config.title}</div>`);
				this.dialogBox.append($(`<div class="dialog-main-title">${this.config.title}</div>`));
				// console.log(this.dialogBox);
			}

			// 验证是否传入内容
			if (this.config.message) {
				// 先创建内容
				//let dialogMessage = $(`<div class="dialog-main-txt">${this.config.message}</div>`);
				this.dialogBox.append($(`<div class="dialog-main-txt">${this.config.message}</div>`));
				// console.log(this.dialogBox);
			}

			// 创建按钮
			this.createBtns();
			// 添加内容
			this.dialogWindow.append(this.dialogBox);
			this.$body.append(this.dialogWindow);
		}

		createBtns() {
			let _this = this;
			$(this.config.button).each((index, item) => {
				let text = item.text ? item.text : 'Button',
					fn = item.callback ? item.callback : null;
				// 创建按钮
				let button = $(`<a href="javascript:;" class="btn-item">${text}</a>`);
				let btnBox = this.dialogBtnBox.append(button);
				this.dialogBox.append(btnBox);

				button.click(() => {
					// 判断是否需要回调函数
					fn && fn();
					// hide 掉 Dialog
					this.hide();
				})
			});
		}

		hide() {
			let _this = this;
			setTimeout(function () {
				_this.dialogWindow.remove();
			}, 300);
		}
	}

	// window.Dialog = Dialog;
	$.dialog = function (options) {
		return new Dialog(options);
	}
})($ || window.Zepto || window.jQuery);