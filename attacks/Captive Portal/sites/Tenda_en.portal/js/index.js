function MainLogic() {
	function changeIcon(lang) {
		$("#nav-footer-icon-cn, #nav-footer-icon-multi").addClass("none"),
			"cn" == lang
				? ($("#nav-footer-icon-cn").removeClass("none"),
				  $(".brand").attr("href", "http://tenda.com.cn"))
				: ($("#nav-footer-icon-multi").removeClass("none"),
				  $(".brand").attr("href", "http://tendacn.com"));
	}
	var that = this;
	(this.init = function () {
		$("body").addClass("index-body"),
			this.initHtml(),
			this.initEvent(),
			that.getValue(),
			this.initModuleHeight();
	}),
		(this.initHtml = function () {
			var str,
				supportLang = B.options.support,
				len = supportLang.length,
				i = 0;
			for (
				str = "<div class='dropdown'>",
					str += "<div class='addLang'>",
					str +=
						"<span class='lang'>" + B.langArr[B.lang] + "</span>",
					str += "<span class='caret'></span>",
					str += "</div>",
					str += "<ul class='dropdown-menu'>",
					i = 0;
				len > i;
				i++
			)
				(lang = supportLang[i]),
					(str +=
						"<li data-val='" +
						lang +
						"'><a>" +
						B.langArr[lang] +
						"</a></li>");
			(str += "</ul>"),
				(str += "</div>"),
				$("#selectLang").html(str),
				changeIcon(B.lang);
		}),
		(this.initEvent = function () {
			var clickTag = "click";
			$("#nav-menu").delegate("li", "click", function () {
				var targetMenu = this.children[0].id || "status";
				that.changeMenu(targetMenu);
			}),
				window.ontouchstart && (clickTag = "touch"),
				$(document).delegate("*", "click", function (e) {
					var clickSetLang,
						target = e.target || e.srcElement;
					($(target.parentNode).hasClass("addLang") ||
						"navbar-button" === $(target.parentNode).attr("id")) &&
						(target = target.parentNode),
						"navbar-button" != $(target).attr("id") &&
							"nav-menu" != $(target).attr("id") &&
							!$(".navbar-toggle").hasClass("none") &&
							$("#nav-menu").hasClass("nav-menu-push") &&
							$("#nav-menu").removeClass("nav-menu-push"),
						$(target).hasClass("addLang") && (clickSetLang = !0),
						clickSetLang || $("#selectLang .dropdown-menu").hide();
				}),
				$("#selectLang .addLang").on("click", function () {
					$.isHidden($("#selectLang .dropdown-menu")[0])
						? $("#selectLang .dropdown-menu").show()
						: $("#selectLang .dropdown-menu").hide();
				}),
				$("#selectLang .dropdown-menu li").on("click", function () {
					var lang = $(this).attr("data-val");
					$("#selectLang .dropdown-menu").hide(),
						B.setLang(lang),
						window.location.reload(!0),
						$("#selectLang .lang").html(B.langArr[lang]),
						changeIcon(lang);
				}),
				$(window).resize(this.initModuleHeight),
				$("#submit").on("click", function () {
					that.modules.validate.checkAll(), $("#submit")[0].blur();
				}),
				$("#navbar-button").on("click", function () {
					$("#nav-menu").hasClass("nav-menu-push")
						? $("#nav-menu").removeClass("nav-menu-push")
						: $("#nav-menu").addClass("nav-menu-push");
				}),
				$("#cancel").on("click", function () {
					that.modules.reCancel();
				}),
				$("#loginout").on("click", function () {
					$.post("goform/loginOut", "action=loginout", function () {
						window.location.href = "./login.html";
					});
				});
		}),
		(this.getValue = function () {
			var modules = "loginAuth,wifiRelay";
			$.getJSON(
				"goform/getHomePageInfo?" +
					getRandom() +
					"&modules=" +
					encodeURIComponent(modules),
				function (obj) {
					"true" == obj.loginAuth.hasLoginPwd
						? $("#loginout").show()
						: $("#loginout").hide();
					var wifiRelayObj = obj.wifiRelay,
						fistMenu = "status";
					"client+ap" == wifiRelayObj.wifiRelayType &&
						$("#netCtrNavWrap").remove(),
						"ap" == wifiRelayObj.wifiRelayType
							? ((fistMenu = "wireless"),
							  $(".routerMode").remove())
							: $("#userManageWrap").remove(),
						that.changeMenu(fistMenu);
				}
			);
		}),
		(this.changeMenu = function (id) {
			var nextUrl = id;
			$("#iframe").addClass("none"),
				$("#iframe").load(
					"./" + nextUrl + ".html?" + random,
					function () {
						return $("#iframe").find("meta").length > 0
							? void top.location.reload(!0)
							: ("status" == id
									? ($("#submit").addClass("none"),
									  $("#cancel").addClass("none"))
									: ($("#submit").removeClass("none"),
									  $("#cancel").removeClass("none")),
							  void seajs.use(
									"./js/" + nextUrl,
									function (modules) {
										B.translatePage(),
											$("#iframe").removeClass("none"),
											modules.init(),
											that.modules &&
												that.modules != modules &&
												("object" ==
													typeof that.modules
														.upgradeLoad &&
													$("[name='upgradeFile']")
														.parent()
														.remove(),
												(that.modules.pageRunning = !1),
												($.validate.utils.errorNum = 0)),
											(that.modules = modules),
											that.initModuleHeight();
									}
							  ));
					}
				),
				$("#nav-menu").removeClass("nav-menu-push"),
				$("li>.active").removeClass("active"),
				$("#" + id).addClass("active");
		}),
		(this.initModuleHeight = function () {
			var height,
				minHeight,
				viewHeight = $.viewportHeight(),
				menuHeight = $("#sub-menu").height(),
				mainHeight = $("#iframe").height();
			(minHeight = Math.max(menuHeight, mainHeight)),
				viewHeight - 110 > minHeight
					? ($("#nav-menu").css("min-height", minHeight + "px"),
					  $("#main-content").css("min-height", minHeight + "px"))
					: ($("#nav-menu").css("min-height", minHeight + 40 + "px"),
					  $("#main-content").css(
							"min-height",
							minHeight + 40 + "px"
					  )),
				(height = mainHeight),
				height >= viewHeight - 110
					? (height -= 110)
					: (height = viewHeight - 110),
				minHeight > height && (height = minHeight),
				$("#nav-menu").css("height", height + 40 + "px"),
				$("#main-content").css("height", height + 30 + "px");
		}),
		(this.showMsgTimer = null),
		(this.showModuleMsg = function (text, showTime) {
			var time,
				msgBox = $("#form-massage");
			msgBox.html(text).fadeIn(10),
				clearTimeout(that.showMsgTimer),
				0 != showTime &&
					((time = showTime || 2e3),
					(that.showMsgTimer = setTimeout(function () {
						msgBox.fadeOut(700);
					}, time)));
		});
}
function ProgressLogic() {
	var that = this,
		pc = 0;
	(this.type = null),
		(this.time = null),
		(this.upgradeTime = null),
		(this.rebootTime = null);
	var ip;
	(this.init = function (str, type, rebootTime, hostip) {
		(ip = hostip || ""),
			$("#progress-dialog").css("display", "block"),
			$("#progress-overlay").addClass("in"),
			$("#form-massage").fadeOut(0),
			(this.type = type),
			(this.time = rebootTime || 200);
		var rebootMsg = str || _("Rebooting...Please wait...");
		$("#rebootWrap").find("p").html(rebootMsg),
			"upgrade" != type
				? ($("#upgradeWrap").addClass("none"), this.reboot())
				: this.upgrade();
	}),
		(this.reboot = function () {
			return (
				(that.rebootTime = setTimeout(function () {
					that.reboot(), pc++;
				}, that.time)),
				pc > 100
					? (clearTimeout(that.upgradeTime),
					  clearTimeout(that.rebootTime),
					  void (ip
							? (window.location.href = "http://" + ip)
							: window.location.reload(!0)))
					: ($("#rebootWrap")
							.find(".progress-bar")
							.css("width", pc + "%"),
					  void $("#rebootWrap")
							.find("span")
							.html(pc + "%"))
			);
		}),
		(this.upgrade = function () {
			return (
				(that.upgradeTime = setTimeout(function () {
					that.upgrade(), pc++;
				}, 200)),
				pc > 100
					? (clearTimeout(that.upgradeTime),
					  (pc = 0),
					  void that.reboot())
					: ($("#upgradeWrap")
							.find(".progress-bar")
							.css("width", pc + "%"),
					  void $("#upgradeWrap")
							.find("span")
							.html(pc + "%"))
			);
		});
}
var random = Math.random();
seajs.config({ map: [[/(.*js\/[^\/\.]*\.(?:js))(?:.*)/, "$1?t=" + random]] }),
	$(function () {
		$("#main_content").show();
		var mainLogic = new MainLogic();
		(window.mainLogic = mainLogic), mainLogic.init();
		var progressLogic = new ProgressLogic();
		window.progressLogic = progressLogic;
	});
