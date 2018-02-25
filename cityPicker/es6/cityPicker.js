/*
* 思考：省市区三级联动插件该怎么写？
* 1.  是否需要使用者自己解析数据格式？
* 2.  如果是插件内部解析数据,并渲染。该怎么做？
* 3.  数据格式是唯一性的吗？
* 4.  是否需要暴露插件的生命周期函数 ？
*
* */

-function ($) {
	"use strict";
	$.fn.cityPicker = function (options) {
		return new CityPick(options, this)
	}

	class CityPick {
		constructor(options, dom) {
			if (!dom.length) return false
			this.el = dom
			this.addressValue = ['北京市', '北京市', '东城区']
			this.init(options)
		}

		init(options) {
			this.config = $.extend({
				// 数据地址
				url: '',
				// 事件名称
				eventName: 'click'
			}, options)
			// 绑定事件
			this.el.on(this.config.eventName, () => {
				this.createDOM()
			})
		}

		// 创建DOM 节点
		createDOM() {
			// 最高父级 ====> 创建的DOM数的根节点
			this.as_picker = $('<section class="as_picker"></section>')
			// 遮罩层盒子
			this.as_mask = $('<div class="as_mask"></div>')
			// 装载主体内容的盒子
			this.as_section = $('<section class="as_section"></section>')
			// 装载按钮的盒子
			this.as_headBtn = $('<header class="as_headBtn"></header>')
			// 取消按钮
			this.as_cancel = $('<a class="as_cancel">取消</a>')
			// 确认按钮
			this.as_confirm = $('<a class="as_confirm">确认</a>')
			// 装载列表内容的盒子
			this.as_content = $('<footer class="as_content"></footer>')
			this.createSlot()
			this.as_content_mask = $('<div class="as_content_mask"></div>')
			this.as_content_indicator = $('<div class="as_content_indicator"></div>')
			this.as_content_list = $('<ul class="as_content_list"></ul>')
			this.as_headBtn.append(this.as_cancel, this.as_confirm)
			this.as_section.append(this.as_headBtn, this.as_content)
			this.as_picker.append(this.as_mask, this.as_section)
			$('body').append(this.as_picker)
			$('.as_content_slot').append(this.as_content_mask, this.as_content_indicator, this.as_content_list)
			this.analysisJson()
			this.el.html(this.addressValue.join('-'))
		}

		// 创建 slot 节点
		createSlot() {
			for (let i = 0; i < 3; i++) {
				let as_content_slot = $(`<div class="as_content_slot" id="as_content_slot_${i}"></div>`)
				this.as_content.append(as_content_slot)
			}
		}

		// 根据地址解析数据
		analysisJson() {
			let self = this
			$.getJSON(this.config.url, data => {
				// console.log(data)
				let province = data.data
				let len = province.length
				for (let i = 0; i < len; i++) {
					$('.as_content_slot').eq(0).find('.as_content_list').append($(`<li class="as_content_list_item">${province[i].name}</li>`))
				}
				for (let i = 0; i < province[0]['city'].length; i++) {
					$('.as_content_slot').eq(1).find('.as_content_list').append($(`<li class="as_content_list_item">${province[0]['city'][i].name}</li>`))
				}
				for (let i = 0; i < province[0]['city'][0]['area'].length; i++) {
					$('.as_content_slot').eq(2).find('.as_content_list').append($(`<li class="as_content_list_item">${province[0]['city'][0]['area'][i]}</li>`))
				}
				// 城市
				let city = province[0].city
				// 区域
				let area = city[0].area
				for (let i = 0; i < $('.as_content_slot').length; i++) {
					$(`.as_content_slot`).eq(i).swiper({
						wrapper: '.as_content_list',
						slider: '.as_content_list_item',
						direction: true,
						multiMove: true,
						endFn: function (index) {
							switch (i) {
								case 0:
									city = province[index].city
									// console.log(city)
									let cityLen = city.length
									let cityI = 0
									let cityArr = []
									for (; cityI < cityLen; cityI++) {
										cityArr.push(`<li class="as_content_list_item">${city[cityI].name}</li>`)
									}
									let cityChildArr = []
									for (let cityJ = 0; cityJ < city[0].area.length; cityJ++) {
										cityChildArr.push(`<li class="as_content_list_item">${city[0].area[cityJ]}</li>`)
									}
									$('.as_content_slot').eq(1).find('.as_content_list').html(cityArr.join(''))
									$('.as_content_slot').eq(2).find('.as_content_list').css('transform', 'translate3d(0px, 0px, 0px)').html(cityChildArr.join(''))
									// 添加地址
									self.addressValue[0] = province[index].name
									self.addressValue[1] = province[index].city[0].name
									self.addressValue[2] = province[index].city[0].area[0]
									self.el.html(self.addressValue.join('-'))
									console.log('0', self.addressValue)
									// 再次调用 swiper 插件 这是 city 滑块
									$(`.as_content_slot`).eq(1).swiper({
										wrapper: '.as_content_list',
										slider: '.as_content_list_item',
										direction: true,
										multiMove: true,
										endFn: function (index) {
											try {
												area = city[index].area
											} catch (e) {
												// console.log(e)
												area = province[0].city[index] ? province[0].city[index].area : []
												// console.log(area)
											}
											let areaLen = area.length
											let areaI = 0
											let areaArr = []
											for (; areaI < areaLen; areaI++) {
												areaArr.push(`<li class="as_content_list_item">${area[areaI]}</li>`)
											}
											// 添加地址
											self.addressValue[1] = city[index].name
											self.addressValue[2] = city[index].area[0]
											self.el.html(self.addressValue.join('-'))
											console.log('1', self.addressValue)
											// console.log(i, areaArr)
											$('.as_content_slot').eq(2).find('.as_content_list').html(areaArr.join(''))
											// 再次调用 swiper 插件，这是 area 滑块
											$(`.as_content_slot`).eq(2).swiper({
												wrapper: '.as_content_list',
												slider: '.as_content_list_item',
												direction: true,
												multiMove: true,
												endFn: function (index) {
													self.addressValue[2] = area[index]
													self.el.html(self.addressValue.join('-'))
													console.log('2', self.addressValue)
												}
											})
										}
									})
									break
								case 1:
									/*
										area = city[index].area
										上面语句在插件初始化的时候，如果用户滑动第二个 代表 city 的区域，会报错 。原因是 city还是个空数组，因为没有滑动第一个 代表 省 的区域
									*/
									try {
										area = city[index].area
									} catch (e) {
										console.log(e)
										area = province[0].city[index].area
										// console.log(area)
									}
									let areaLen = area.length
									let areaI = 0
									let areaArr = []
									for (; areaI < areaLen; areaI++) {
										areaArr.push(`<li class="as_content_list_item">${area[areaI]}</li>`)
									}
									// console.log(i, areaArr)
									$('.as_content_slot').eq(2).find('.as_content_list').html(areaArr.join(''))
									break
								case 2:
									self.addressValue[2] = province[0].city[0].area[index]
									self.el.html(self.addressValue.join('-'))
									console.log('area', self.addressValue)
									break
								default:
									console.log('出错')
							}
						}
					})
				}
			})
			this.addressEvents()
		}

		// 确定地址
		addressEvents() {
			let than = this
			// 确定
			this.as_confirm.on('click', function () {
				than.el.html(than.addressValue.join('-'))
				than.as_picker.remove()
			})
			// 取消
			this.as_cancel.on('click', function () {
				than.as_picker.remove()
			})
		}
	}
}($)