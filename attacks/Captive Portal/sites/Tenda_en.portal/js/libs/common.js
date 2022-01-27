function getRandom() {
	return "?random=" + Math.random();
}
function updateInternetConnectStatus(obj, elemID) {
	function showWanInternetStatus(statusCode, elemID) {
		var connectStatus,
			connectMsg,
			str = "";
		return statusCode
			? ((connectStatus = statusCode.slice(1, 2)),
			  (connectMsg = statusCode.slice(3, 7)),
			  (str =
					"3" == connectStatus
						? "text-success"
						: "2" == connectStatus
						? "text-primary"
						: "text-danger"),
			  $("#" + elemID)
					.html(statusMsg[connectMsg])
					.attr("class", str),
			  !0)
			: !1;
	}
	lanWanIPConflict ||
		("true" == obj.lanWanIPConflict
			? ((lanWanIPConflict = !0),
			  alert(
					_(
						"IP conflict! The login IP address will be changed into %s automatically.Please log in again using %s.",
						[obj.newLanIP, obj.newLanIP]
					)
			  ),
			  progressLogic.init("", "reboot", 180, obj.newLanIP))
			: showWanInternetStatus(obj.wanConnectStatus, elemID));
}
function checkIpInSameSegment(ip_lan, mask_lan, ip_wan, mask_wan) {
	if ("" === ip_lan || "" === ip_wan) return !1;
	var i,
		ip1Arr = ip_lan.split("."),
		ip2Arr = ip_wan.split("."),
		maskArr1 = mask_lan.split("."),
		maskArr2 = mask_wan.split("."),
		maskArr = maskArr1;
	for (i = 0; 4 > i; i++)
		if (maskArr1[i] != maskArr2[i]) {
			maskArr =
				(maskArr1[i] & maskArr2[i]) == maskArr1[i]
					? maskArr1
					: maskArr2;
			break;
		}
	for (i = 0; 4 > i; i++)
		if ((ip1Arr[i] & maskArr[i]) != (ip2Arr[i] & maskArr[i])) return !1;
	return !0;
}
function checkIsVoildIpMask(ip, mask, str) {
	var ipArry,
		maskArry,
		len,
		maskArry2 = [],
		netIndex = 0,
		netIndex1 = 0,
		broadIndex = 0,
		i = 0;
	for (
		str = str || _("IP Address"),
			ipArry = ip.split("."),
			maskArry = mask.split("."),
			len = ipArry.length,
			i = 0;
		len > i;
		i++
	)
		maskArry2[i] = 255 - Number(maskArry[i]);
	for (var k = 0; 4 > k; k++)
		netIndex1 += 0 == (ipArry[k] & maskArry[k]) ? 0 : 1;
	for (var k = 0; 4 > k; k++)
		netIndex += 0 == (ipArry[k] & maskArry2[k]) ? 0 : 1;
	if (0 == netIndex || 0 == netIndex1)
		return _("%s can't be the network segment.", [str]);
	for (var j = 0; 4 > j; j++)
		broadIndex += 255 == (ipArry[j] | maskArry[j]) ? 0 : 1;
	return 0 == broadIndex
		? _("%s can't be the broadcast address.", [str])
		: void 0;
}
function objToString(obj) {
	var prop,
		str = "";
	for (prop in obj) str += prop + "=" + encodeURIComponent(obj[prop]) + "&";
	return (str = str.replace(/[&]$/, ""));
}
function inputValue(obj, callback) {
	var prop, tagName;
	for (prop in obj)
		if (prop && $("#" + prop).length > 0)
			switch (
				(tagName = document.getElementById(prop).tagName.toLowerCase())
			) {
				case "input":
				case "select":
					"checkbox" == document.getElementById(prop).type
						? (document.getElementById(prop).checked =
								"true" == obj[prop] ? !0 : !1)
						: $("#" + prop).val(obj[prop]);
					break;
				default:
					$("#" + prop).hasClass("textboxs") ||
					$("#" + prop).hasClass("input-append")
						? $("#" + prop)[0].val(obj[prop])
						: $("#" + prop).text(obj[prop]);
			}
		else
			prop &&
				$("[name='" + prop + "']").length > 1 &&
				((tagName = document
					.getElementsByName(prop)[0]
					.tagName.toLowerCase()),
				"input" === tagName &&
					$("[name='" + prop + "'][value='" + obj[prop] + "']")
						.length > 0 &&
					($(
						"[name='" + prop + "'][value='" + obj[prop] + "']"
					)[0].checked = !0));
	"function" == typeof callback && callback.apply();
}
function formatSeconds(value) {
	var theTime = parseInt(value),
		theTime1 = 0,
		theTime2 = 0,
		theTime3 = 0;
	theTime > 60 &&
		((theTime1 = parseInt(theTime / 60)),
		(theTime = parseInt(theTime % 60)),
		theTime1 > 60 &&
			((theTime2 = parseInt(theTime1 / 60)),
			(theTime1 = parseInt(theTime1 % 60)),
			theTime2 > 24 &&
				((theTime3 = parseInt(theTime2 / 24)),
				(theTime2 = parseInt(theTime2 % 24)))));
	var result = "" + parseInt(theTime) + _("s");
	return (
		theTime1 > 0 &&
			(result = "" + parseInt(theTime1) + _("m") + " " + result),
		theTime2 > 0 &&
			(result = "" + parseInt(theTime2) + _("h") + " " + result),
		theTime3 > 0 &&
			(result = "" + parseInt(theTime3) + _("d") + " " + result),
		result
	);
}
function Encode() {
	function utf16to8(str) {
		var out, i, len, c;
		for (out = "", len = str.length, i = 0; len > i; i++)
			(c = str.charCodeAt(i)),
				c >= 1 && 127 >= c
					? (out += str.charAt(i))
					: c > 2047
					? ((out += String.fromCharCode(224 | ((c >> 12) & 15))),
					  (out += String.fromCharCode(128 | ((c >> 6) & 63))),
					  (out += String.fromCharCode(128 | ((c >> 0) & 63))))
					: ((out += String.fromCharCode(192 | ((c >> 6) & 31))),
					  (out += String.fromCharCode(128 | ((c >> 0) & 63))));
		return out;
	}
	function base64encode(str) {
		var out, i, len, c1, c2, c3;
		for (len = str.length, i = 0, out = ""; len > i; ) {
			if (((c1 = 255 & str.charCodeAt(i++)), i == len)) {
				(out += base64EncodeChars.charAt(c1 >> 2)),
					(out += base64EncodeChars.charAt((3 & c1) << 4)),
					(out += "==");
				break;
			}
			if (((c2 = str.charCodeAt(i++)), i == len)) {
				(out += base64EncodeChars.charAt(c1 >> 2)),
					(out += base64EncodeChars.charAt(
						((3 & c1) << 4) | ((240 & c2) >> 4)
					)),
					(out += base64EncodeChars.charAt((15 & c2) << 2)),
					(out += "=");
				break;
			}
			(c3 = str.charCodeAt(i++)),
				(out += base64EncodeChars.charAt(c1 >> 2)),
				(out += base64EncodeChars.charAt(
					((3 & c1) << 4) | ((240 & c2) >> 4)
				)),
				(out += base64EncodeChars.charAt(
					((15 & c2) << 2) | ((192 & c3) >> 6)
				)),
				(out += base64EncodeChars.charAt(63 & c3));
		}
		return out;
	}
	var base64EncodeChars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	return function (s) {
		return base64encode(utf16to8(s));
	};
}
function checkIsTimeOut(str) {
	return -1 != str.indexOf("<!DOCTYPE") ? !0 : !1;
}
function addOverLay(time) {
	time = time || 0;
	var str = "<div class='save-overlay'></div>";
	$("body").append(str),
		setTimeout(function () {
			$(".save-overlay").remove();
		}, time);
}
function isEmptyObject(obj) {
	var name;
	for (name in obj) return !1;
	return !0;
}
function PageLogic(urlObj) {
	var moduleArry,
		_this = this;
	(this.init = function () {
		(moduleArry = this.modules), (this.pageRunning = !0), this.initEvent();
		for (var i = 0; i < moduleArry.length; i++)
			"function" == typeof moduleArry[i].init && moduleArry[i].init();
		this.addValidate(), this.getValue(urlObj.getUrl, urlObj.modules);
	}),
		(this.initEvent = function () {}),
		(this.reCancel = function () {
			_this.initValue(_this.data);
		}),
		(this.updateTimer = null),
		(this.update = function (modules, time, callback) {
			return (
				(time = time || 0),
				_this.pageRunning && 0 != time
					? (clearTimeout(this.updateTimer),
					  0 != time &&
							(this.updateTimer = setTimeout(function () {
								_this.update(modules, time, callback);
							}, time)),
					  void (
							"string" == typeof urlObj.getUrl &&
							$.get(
								urlObj.getUrl +
									"?" +
									Math.random() +
									"&modules=" +
									encodeURIComponent(modules),
								function (obj) {
									checkIsTimeOut(obj) &&
										top.location.reload(!0);
									try {
										obj = $.parseJSON(obj);
									} catch (e) {
										obj = {};
									}
									isEmptyObject(obj) &&
										top.location.reload(!0),
										_this.pageRunning &&
											"function" == typeof callback &&
											callback.apply(this, [obj]);
								}
							)
					  ))
					: void clearTimeout(this.updateTimer)
			);
		}),
		(this.getValue = function (getUrl, modules) {
			if (this.pageRunning && "string" == typeof getUrl) {
				var data = "";
				(data = modules
					? $.encodeFormData({
							random: Math.random(),
							modules: modules,
					  })
					: Math.random()),
					$.get(getUrl + "?" + data, _this.initValue);
			}
		}),
		(this.initValue = function (obj) {
			var moduleName, i;
			if ("string" == typeof obj) {
				checkIsTimeOut(obj) && top.location.reload(!0);
				try {
					obj = $.parseJSON(obj);
				} catch (e) {
					obj = {};
				}
			}
			if (
				(isEmptyObject(obj) && top.location.reload(!0),
				(_this.data = obj),
				_this.pageRunning)
			) {
				for (i = 0; i < moduleArry.length; i++)
					(moduleName = moduleArry[i].moduleName),
						"function" == typeof moduleArry[i].initValue &&
							moduleArry[i].initValue(_this.data[moduleName]);
				mainLogic &&
					"object" == typeof mainLogic &&
					mainLogic.initModuleHeight();
			}
		}),
		(this.getSubmitData = function () {
			for (var data = "", i = 0; i < moduleArry.length; i++)
				"function" == typeof moduleArry[i].getSubmitData &&
					(data += moduleArry[i].getSubmitData() + "&");
			return (data = data.replace(/[&]$/, ""));
		}),
		(this.addValidate = function () {
			this.validate = $.validate({
				custom: function () {
					for (var msg, i = 0; i < moduleArry.length; i++)
						if (
							("function" == typeof moduleArry[i].checkData &&
								(msg = moduleArry[i].checkData.apply()),
							msg)
						)
							return msg;
				},
				success: function () {
					_this.preSubmit();
				},
				error: function (msg) {
					msg && _this.showPageMsg(msg);
				},
			});
		}),
		(this.preSubmit = function () {
			if (
				"function" != typeof _this.beforeSubmit ||
				_this.beforeSubmit()
			) {
				var data = _this.getSubmitData();
				addOverLay(1e3),
					mainLogic.showModuleMsg(_("Saving...")),
					$.ajax({
						url: urlObj.setUrl,
						type: "POST",
						data: data,
						success: _this.successCallback,
						error: _this.ajaxErrMsg,
					});
			}
		}),
		(this.successCallback = function (msg) {
			if (checkIsTimeOut(msg)) return void top.location.reload(!0);
			var num = $.parseJSON(msg).errCode || "-1",
				ip = _this.rebootIP || "";
			0 == +num
				? (mainLogic.showModuleMsg(_("Saved successfully!")),
				  _this.getValue(urlObj.getUrl, urlObj.modules))
				: "2" == num
				? mainLogic.showModuleMsg(
						_(
							"Fail to change password! Old Password is not correct."
						)
				  )
				: "100" == num
				? progressLogic.init("", "reboot", 200, ip)
				: "101" == num && (window.location = "./login.html"),
				$("#submit").removeAttr("disabled");
		}),
		(this.ajaxErrMsg = function () {
			_this.showPageMsg(_("Upload data error!"));
		}),
		(this.showPageMsg = function (msg) {
			mainLogic.showModuleMsg(msg);
		});
}
function isAllNumber(arry) {
	var i = 0,
		len = arry.length || 0;
	for (i = 0; len > i; i++) if (isNaN(Number(arry[i]))) return !1;
	return !0;
}
function isAllIp(arry) {
	var i = 0,
		len = arry.length || 0;
	for (i = 0; len > i; i++)
		if (
			!/^([1-9]|[1-9]\d|1\d\d|2[0-1]\d|22[0-3])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(
				arry[i]
			)
		)
			return !1;
	return !0;
}
function isAllMac(arry) {
	var i = 0,
		len = arry.length || 0;
	for (i = 0; len > i; i++)
		if (!/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(arry[i])) return !1;
	return !0;
}
function reCreateObj(obj, prop, sortTag) {
	function sortNumber(a, b) {
		var c = parseInt(a.replace(/[.:]/g, ""), 16),
			d = parseInt(b.replace(/[.:]/g, ""), 16);
		return c - d;
	}
	for (
		var newObj = [],
			len = obj.length || 0,
			i = 0,
			j = 0,
			newArry = [],
			arry_prop = [],
			temporaryObj = [],
			numberFlag = !1,
			ipFlag = !1,
			macFlag = !1,
			k = 0;
		len > k;
		k++
	)
		temporaryObj[k] = obj[k];
	for (i = 0; len > i; i++) arry_prop[i] = temporaryObj[i][prop];
	for (
		numberFlag = isAllNumber(arry_prop),
			ipFlag = isAllIp(arry_prop),
			macFlag = isAllMac(arry_prop),
			newArry =
				numberFlag || ipFlag || macFlag
					? arry_prop.sort(sortNumber)
					: arry_prop.sort(),
			i = 0;
		len > i;
		i++
	)
		for (j = 0; j < temporaryObj.length; j++)
			if (newArry[i] == temporaryObj[j][prop]) {
				newObj.push(temporaryObj[j]), temporaryObj.splice(j, 1);
				break;
			}
	return "up" == sortTag ? newObj : newObj.reverse();
}
function showDialog(Id) {
	$("#progress-overlay").hasClass("in") ||
		$("#progress-overlay").addClass("in"),
		$("#" + Id).removeClass("none"),
		$(".main-dialog").css("top", "20%");
}
function closeIframe(dialogId) {
	$("#" + dialogId).addClass("none"),
		$("#progress-overlay").removeClass("in");
}
function getStrByteNum(str) {
	for (var charCode, totalLength = 0, i = str.length - 1; i >= 0; i--)
		(charCode = str.charCodeAt(i)),
			127 >= charCode
				? totalLength++
				: (totalLength +=
						charCode >= 128 && 2047 >= charCode
							? 2
							: charCode >= 2048 && 65535 >= charCode
							? 3
							: 4);
	return totalLength;
}
var statusMsg = {
		"0101": _("WAN port unplugged! Please plug the Internet cable into it"),
		"0102": _("Disconnected"),
		"0103": _("Connecting...Detecting the Internet..."),
		"0104": _("Connected...Accessing the Internet..."),
		"0105": _("Can not surf the Internet. Please contact your ISP!"),
		"0106": _("You can surf the Internet"),
		"0201": _("WAN port unplugged! Please plug the Internet cable into it"),
		"0202": _("Disconnected"),
		"0203": _("Connecting...Detecting the Internet..."),
		"0204": _("Connected...Accessing the Internet..."),
		"0205":
			_(
				"The router has obtained a valid IP address but cannot access the Internet. Please try the solutions below one by one."
			) +
			"<br/>1. <a id='cloneMac' style='text-decoration:underline;' class='text-success' href='javascript:void(0)'>" +
			_("Clone MAC address") +
			"</a>" +
			_("(MAC Clone will take effect in 30 seconds.)") +
			"<br/>" +
			_("2. Try another computer and reconfigure the router") +
			"<br/>" +
			_(
				"3. Please make sure you have applied a valid Internet service. If not, consult your ISP for help"
			),
		"0206": _("You can surf the Internet"),
		"0207": _("IP conflict! Please modify LAN IP"),
		"0208": _(
			"ERROR: No response from the remote server. Please contact your ISP for help"
		),
		"0301": _("WAN port unplugged! Please plug the Internet cable into it"),
		"0302": _("Disconnected"),
		"0303": _(
			"Checking the user name and password... Please wait. It will take 1~5 minutes"
		),
		"0304": _("Dial-up Successfully...Accessing the Internet..."),
		"0305": _(
			"Dial-up Successfully,but can not surf the Internet. Please contact your ISP!"
		),
		"0306": _("You can surf the Internet"),
		"0307": _(
			"Failed! Please confirm your user name and password and try again"
		),
		"0308": _(
			"ERROR: No response from the remote server. Please contact your ISP for help"
		),
		1102: _("No bridge yet in WISP mode."),
		1103: _("Bridging in WISP mode..."),
		1104: _(
			"Bridged successfully in WISP mode. Trying accessing the Internet..."
		),
		1105: _("Can not surf the Internet. Please contact your ISP!"),
		1106: _("Connected! You can surf the Internet."),
		1107: _("The WiFi password of the base station is incorrect."),
		1202: _("No bridge yet in WISP mode."),
		1203: _("Bridging in WISP mode..."),
		1204: _(
			"Bridged successfully in WISP mode. Trying accessing the Internet..."
		),
		1205: _(
			"Get an IP Successfully,but can not surf the Internet. Please contact your ISP!"
		),
		1206: _("Connected! You can surf the Internet."),
		1207: _("IP conflict! Please modify LAN IP"),
		1208: _(
			"ERROR: No response from the remote server. Please contact your ISP for help"
		),
		1209: _("The WiFi password of the base station is incorrect."),
		1302: _("No bridge yet in WISP mode."),
		1303: _(
			"Checking the user name and password... Please wait. It will take 1~5 minutes"
		),
		1304: _("Dial-up Successfully...Accessing the Internet..."),
		1305: _(
			"Dial-up Successfully,but can not surf the Internet. Please contact your ISP!"
		),
		1306: _("You can surf the Internet"),
		1307: _(
			"Failed! Please confirm your user name and password and try again"
		),
		1308: _(
			"ERROR: No response from the remote server. Please contact your ISP for help"
		),
		1309: _("The WiFi password of the base station is incorrect."),
		2102: _("No bridge yet in Universal Repeater mode."),
		2103: _("Bridging in Universal Repeater mode..."),
		2104: _("Bridged successfully in Universal Repeater mode."),
		2202: _("No bridge yet in Universal Repeater mode."),
		2203: _("Bridging in Universal Repeater mode..."),
		2204: _("Bridged successfully in Universal Repeater mode."),
		2302: _("No bridge yet in Universal Repeater mode."),
		2303: _("Bridging in Universal Repeater mode..."),
		2304: _("Bridged successfully in Universal Repeater mode."),
		2107: _("The WiFi password of the base station is incorrect."),
		2209: _("The WiFi password of the base station is incorrect."),
		2309: _("The WiFi password of the base station is incorrect."),
	},
	lanWanIPConflict = !1;
window.JSON && ($.parseJSON = JSON.parse),
	$.include({
		removeValidateTipError: function () {
			return this.each(function () {
				var $tipElem = $("#" + this.validateTipId);
				$tipElem &&
					($("#" + this.validateTipId)
						.parent()
						.removeClass("has-error")
						.removeClass("has-feedback"),
					$("#" + this.validateTipId).remove(),
					(this.validateTipId = ""));
			});
		},
	});
