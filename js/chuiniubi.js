(function($) {
	$.fn.scrollfn = function(Options, ImgBoxId) {
		var ImgBox = $(ImgBoxId),
			Defaults = {
				InterTime: 5000,
				OverTime: 1000,
				type: 0, //0是左右滚动切换效果 1 是渐隐渐露效果 3直接的显示与隐藏效果
				leftbtn: null, //左右切换按钮的类名设置
				rightbtn: null,
				Titleul: null, //显示标题的UL 的名称
				Btnul: null, //设置按钮的UL 类名 
				BannerBtnclass: "current", //设置激活时按钮的类名
				isAutomatic: 0, //自动执行效果的开关
				deomShownum: 1, //滚动框架内要显示的滚动的子元素的个数 0表示一个默认是0,此阀值是为了处理滚动样式下框架可显示多个时滚动到最后出现                           //的滚动空白，保证最后一个显示的情况下直接滚动回第一个
				BnanerGeshu: 1, //在滚动效果下的滚动个数，只对拥有左右按钮时有意义 
				ImgBoxChild: "li", //设置切换框架下的子元素标签 默认形式是li 可以自定义元素类型或者是类名
//				Textbox: "#textbox" //显示浮层的div   
			},
			Options = $.extend({}, Defaults, Options);
		var i = 1,
			timer;
		//前期的判断效果
		//如果没有标题隐藏title
		if (Options.Titleul) {
			var _Titleul = $(Options.Titleul);
			_Titleul.children("li").hide().first().show();
		}
		//为type=1和2的效果下做处理 显示第一个隐藏后面的
		if (Options.type == 1 || Options.type == 2) {
			ImgBox.children(Options.ImgBoxChild).hide()
			ImgBox.children(Options.ImgBoxChild).first().show()
		}
		if (Options.rightbtn != null || Options.leftbtn != null) {
			if (ImgBox.children(Options.ImgBoxChild).length <= Options.deomShownum) {
				$(Options.rightbtn).hide();
				$(Options.leftbtn).hide();
			}
		}
		//获取& 按钮处理的方法
		function btnFn(num) {
				if (Options.Btnul) {
					var _Btnul = $(Options.Btnul);
					_Btnul.children("li").removeClass(Options.BannerBtnclass).eq(num).addClass(Options.BannerBtnclass);
				}
			}
			//获取 &标题处理方法

		function titFn(num) {
				if (Options.Titleul) {
					var _Titleul = $(Options.Titleul);
					if (_Titleul.children("li:visible").index() == num) {
						//相等的时候为空处理 及 没有效果
					} else {
						_Titleul.children("li").stop(true, true).slideUp(Options.OverTime).eq(num).slideDown(Options.OverTime);
					}
				}
			}
			//处理自动滚动的方法 默认自动左右形式的

		function startDirection() {
				if (Options.BnanerGeshu * i > ImgBox.children(Options.ImgBoxChild).length - Options.deomShownum) {
					i = 0;
				}
				switch (Options.type) {
					case 0:
						ImgBox.animate({
								"left": -ImgBox.children(Options.ImgBoxChild).outerWidth(true) * Options.BnanerGeshu * i
							},
							Options.OverTime);
						break;
					case 1:
						ImgBox.children(Options.ImgBoxChild).hide();
						ImgBox.children(Options.ImgBoxChild).eq(i).fadeIn(Options.OverTime);
						break;
				}
				//按钮处理方法执行
				btnFn(i);
				//标题的处理
				titFn(i);
				i++;
			}
			// 自动滚动处理

		function Automatic() {
				if (Options.isAutomatic) {
					timer = setInterval(startDirection, Options.InterTime);
				}
			}
			///////// 新增处理鼠标放上去现实展示层的效果 ／／／定制方案
		var _imgboxli = ImgBox.children(Options.ImgBoxChild);

		    /////设置_imgboxli的Z-index 解决IE bug 问题    //遭到废弃
		    for(z=0;z<_imgboxli.length;z++){
				    	_imgboxli.eq(z).css("z-index",100-z)
				    	
		}


		


		//////////按键显示的方法  type=0 默认是左右形式
		function btnStart(num) {
				var i = num;
				//默认的左右处理
				if (Options.type == 0) {
					ImgBox.stop(true).animate({
							"left": -ImgBox.children(Options.ImgBoxChild).outerWidth(true) * Options.BnanerGeshu * i
						},
						Options.OverTime);
				}
				//处理type=1 默认为渐隐渐出的效果 前提是CSS 样式中li 必须是定位的效果
				else if (Options.type == 1) {
					if (ImgBox.children(Options.ImgBoxChild).filter(":visible").index() == i) {
						//为空不处理
					} else {
						ImgBox.children(Options.ImgBoxChild).hide();
						ImgBox.children(Options.ImgBoxChild).eq(i).fadeIn(Options.OverTime);
					}
				} else if (Options.type == 2) {
					if (ImgBox.children(Options.ImgBoxChild).filter(":visible").index() == i) {
						//为空不处理
					} else {
						ImgBox.children(Options.ImgBoxChild).hide();
						ImgBox.children(Options.ImgBoxChild).eq(i).show()
					}
				}

				btnFn(i);
				titFn(i);
			}
			//鼠标划过按钮的处理
		if (Options.Btnul) {
			var _Btnul = $(Options.Btnul);
			_Btnul.children("li").hover(function() {
					clearInterval(timer);
					btnStart($(this).index());
				},
				function() {
					Automatic();
				})
		}
		//改良版 单双均可以的滚动左右切换控制 而且能够无限循环
		function MultipleBtnfn() {
			var leftBtn = $(Options.leftbtn),
				rightBtn = $(Options.rightbtn);
			leftBtn.hover(function() {
					clearInterval(timer);
				},
				function() {
					Automatic();
				})
			rightBtn.hover(function() {
						clearInterval(timer);
					},
					function() {
						Automatic();
					})
				//右方向键
			var iscontrol = true
			rightBtn.click(function() {
					if (iscontrol == true) {
						iscontrol = false
						var thisi = Math.ceil(Math.abs(ImgBox.position().left / (ImgBox.children(Options.ImgBoxChild).outerWidth(true) * Options.BnanerGeshu)) + 1);

						var posnow = ImgBox.children(Options.ImgBoxChild).outerWidth(true) * ImgBox.children(Options.ImgBoxChild).length - Math.abs(ImgBox.position().left);

						if (thisi >= Math.ceil(ImgBox.children(Options.ImgBoxChild).length / Options.BnanerGeshu)) {
							thisi = 0;

						} else if (posnow <= Math.ceil(ImgBox.children(Options.ImgBoxChild).outerWidth(true) * Options.deomShownum)) {
							thisi = 0;
						}
						btnStart(thisi);
						setTimeout(function() {
							iscontrol = true
						}, Options.OverTime)
					}


				})
				//左方向键
			leftBtn.click(function() {
				if (ImgBox.children(Options.ImgBoxChild).length > Options.deomShownum) {
					var thisi = Math.ceil(Math.abs(ImgBox.position().left / (ImgBox.children(Options.ImgBoxChild).outerWidth(true) * Options.BnanerGeshu)) - 1);
					//显示部分的长度
					if (thisi < 0) {
						thisi = Math.ceil(ImgBox.children(Options.ImgBoxChild).length / Options.BnanerGeshu) - Options.deomShownum;
					}
					btnStart(thisi);
				}
			})
		}

		//判断执行：
		if (Options.leftbtn != null || Options.rightbtn != null) {
			MultipleBtnfn();
		}
		//自动执行
		Automatic();
	}
})(jQuery);