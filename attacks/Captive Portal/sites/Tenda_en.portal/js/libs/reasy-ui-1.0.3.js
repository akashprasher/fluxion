if ("undefined" == typeof jQuery && "undefined" == typeof REasy)
	throw new Error("REasy-UI requires jQuery or REasy");
!(function (win, doc) {
	"use strict";
	var rnative = /^[^{]+\{\s*\[native code/,
		_ = window._;
	($.reasyui = {}),
		($.reasyui.mod = "core "),
		($.reasyui.b28n = {}),
		_ ||
			(window._ = _ =
				function (str, replacements) {
					var index,
						ret = $.reasyui.b28n[str] || str,
						len = replacements && replacements.length,
						count = 0;
					if (len > 0)
						for (; -1 !== (index = ret.indexOf("%s")); )
							(ret =
								ret.substring(0, index) +
								replacements[count] +
								ret.substring(index + 2, ret.length)),
								(count = count + 1 === len ? count : count + 1);
					return ret;
				}),
		$.include ||
			($.include = function (obj) {
				$.extend($.fn, obj);
			}),
		$.extend({
			keyCode: {
				ALT: 18,
				BACKSPACE: 8,
				CAPS_LOCK: 20,
				COMMA: 188,
				COMMAND: 91,
				COMMAND_LEFT: 91,
				COMMAND_RIGHT: 93,
				CONTROL: 17,
				DELETE: 46,
				DOWN: 40,
				END: 35,
				ENTER: 13,
				ESCAPE: 27,
				HOME: 36,
				INSERT: 45,
				LEFT: 37,
				MENU: 93,
				NUMPAD_ADD: 107,
				NUMPAD_DECIMAL: 110,
				NUMPAD_DIVIDE: 111,
				NUMPAD_ENTER: 108,
				NUMPAD_MULTIPLY: 106,
				NUMPAD_SUBTRACT: 109,
				PAGE_DOWN: 34,
				PAGE_UP: 33,
				PERIOD: 190,
				RIGHT: 39,
				SHIFT: 16,
				SPACE: 32,
				TAB: 9,
				UP: 38,
				WINDOWS: 91,
			},
			viewportWidth: function () {
				var de = doc.documentElement;
				return (
					(de && de.clientWidth) ||
					doc.body.clientWidth ||
					win.innerWidth
				);
			},
			viewportHeight: function () {
				var de = doc.documentElement;
				return (
					(de && de.clientHeight) ||
					doc.body.clientHeight ||
					win.innerHeight
				);
			},
			getCursorPos: function (ctrl) {
				var Sel,
					CaretPos = 0;
				return (
					doc.selection
						? (ctrl.focus(),
						  (Sel = doc.selection.createRange()),
						  Sel.moveStart("character", -ctrl.value.length),
						  (CaretPos = Sel.text.length))
						: (ctrl.selectionStart ||
								0 === parseInt(ctrl.selectionStart, 10)) &&
						  (CaretPos = ctrl.selectionStart),
					CaretPos
				);
			},
			setCursorPos: function (ctrl, pos) {
				var range;
				return (
					ctrl.setSelectionRange
						? (ctrl.focus(), ctrl.setSelectionRange(pos, pos))
						: ctrl.createTextRange &&
						  ((range = ctrl.createTextRange()),
						  range.collapse(!0),
						  range.moveEnd("character", pos),
						  range.moveStart("character", pos),
						  range.select()),
					ctrl
				);
			},
			getUtf8Length: function (str) {
				var charCode,
					i,
					totalLength = 0,
					len = str.length;
				for (i = 0; len > i; i++)
					(charCode = str.charCodeAt(i)),
						127 > charCode
							? totalLength++
							: (totalLength +=
									charCode >= 128 && 2047 >= charCode
										? 2
										: charCode >= 2048 && 65535 >= charCode
										? 3
										: 4);
				return totalLength;
			},
			isNative: function (fn) {
				return rnative.test(String(fn));
			},
			isHidden: function (elem) {
				return elem
					? "none" === $.css(elem, "display") ||
							"hidden" === $.css(elem, "visibility") ||
							(0 == elem.offsetHeight && 0 == elem.offsetWidth)
					: void 0;
			},
			isDisabled: function (elem) {
				return elem ? elem.getAttribute("disabled") : void 0;
			},
			getValue: function (elem) {
				return "undefined" != typeof elem.value
					? elem.value
					: $.isFunction(elem.val)
					? elem.val()
					: void 0;
			},
		}),
		($.cookie = {
			get: function (name) {
				var cookieName = encodeURIComponent(name) + "=",
					cookieStart = doc.cookie.indexOf(cookieName),
					cookieEnd = doc.cookie.indexOf(";", cookieStart),
					cookieValue = null;
				return (
					cookieStart > -1 &&
						(-1 === cookieEnd && (cookieEnd = doc.cookie.length),
						(cookieValue = decodeURIComponent(
							doc.cookie.substring(
								cookieStart + cookieName.length,
								cookieEnd
							)
						))),
					cookieValue
				);
			},
			set: function (name, value, path, domain, expires, secure) {
				var cookieText =
					encodeURIComponent(name) + "=" + encodeURIComponent(value);
				expires instanceof Date &&
					(cookieText += "; expires =" + expires.toGMTString()),
					path && (cookieText += "; path =" + path),
					domain && (cookieText += "; domain =" + domain),
					secure && (cookieText += "; secure =" + secure),
					(doc.cookie = cookieText);
			},
			unset: function (name, path, domain, secure) {
				this.set(name, "", path, domain, new Date(0), secure);
			},
		});
})(window, document),
	(function (doc) {
		"use strict";
		$.dialog = (function () {
			function createDialogHtml(options) {
				var ret,
					nopromptClass,
					model = options.model;
				return (
					"dialog" === model
						? ((nopromptClass = options.showNoprompt
								? "dialog-nocheck"
								: "dialog-nocheck none"),
						  (ret =
								'<h2 class="dialog-title"><span id="dialog-title">' +
								options.title +
								'</span><button type="button" class="close btn" id="dialog-close">&times;</button></h2><div class="dialog-content">' +
								options.content +
								'</div><div class="' +
								nopromptClass +
								'"><label class="checkbox" for="nocheck"><input type="checkbox" id="dialog-noprompt" />ä¸å†æç¤º</label></div><div class="dialog-btn-group"><button type="button" class="btn" id="dialog-apply">ç¡®å®š</button><button type="button" class="btn" id="dialog-cancel">å–æ¶ˆ</button></div>'))
						: "message" === model &&
						  (ret =
								'<h2 class="dialog-title"><span id="dialog-title">' +
								options.title +
								'</span></h2><div class="dialog-content dialog-content-massage">' +
								options.content +
								"</div>"),
					ret
				);
			}
			function Dialog(options) {
				(this.element = null),
					(this.id = "r-dialog"),
					(this.overlay = null),
					(this.noprompt = "false"),
					(this.options =
						"object" === $.type(options)
							? $.extend(defaults, options)
							: $.extend(defaults, { content: options }));
			}
			var defaults = {
				show: !0,
				showNoprompt: !1,
				model: "dialog",
				title: "æ¥è‡ªç½‘é¡µçš„æ¶ˆæ¯",
				content: "",
			};
			return (
				(Dialog.prototype = {
					init: function () {
						var dialogLeft,
							modelHtml,
							$overlay = $("#overlay"),
							overlayElem = $overlay[0],
							$dialog = $("#r-dialog"),
							dialogElem = $dialog[0],
							bodyElem = $("body")[0],
							thisDialog = this;
						(modelHtml = createDialogHtml(this.options)),
							overlayElem ||
								((overlayElem = doc.createElement("div")),
								(overlayElem.id = "overlay"),
								(overlayElem.className = "overlay"),
								bodyElem.appendChild(overlayElem)),
							dialogElem ||
								((dialogElem = doc.createElement("div")),
								(dialogElem.id = "r-dialog"),
								(dialogElem.className = "dialog"),
								bodyElem.appendChild(dialogElem),
								($dialog = $("#r-dialog")),
								(dialogElem = $dialog[0]),
								$dialog.html(modelHtml)),
							(dialogLeft =
								(($.viewportWidth() - dialogElem.offsetWidth) /
									(2 * $.viewportWidth())) *
								100),
							(dialogLeft = dialogLeft > 0 ? dialogLeft : 0),
							$dialog.css("left", dialogLeft + "%"),
							(this.element = dialogElem),
							(this.overlay = overlayElem),
							$dialog.on("click", function (e) {
								var curElem = e.target || e.srcElement,
									curId = curElem.id,
									funName = curId.split("-")[1];
								(thisDialog.noprompt =
									$("#dialog-noprompt")[0] &&
									$("#dialog-noprompt")[0].checked
										? "true"
										: "flase"),
									funName &&
										thisDialog[funName] &&
										thisDialog[funName]();
							}),
							this.options.show && this.open();
					},
					close: function () {
						$(this.element).hide(), $(this.overlay).hide();
					},
					open: function () {
						var nopromptElem = $("#dialog-noprompt")[0];
						$(this.element).show(),
							$(this.overlay).show(),
							nopromptElem && (nopromptElem.checked = !1);
					},
					apply: function () {
						"function" === $.type(this.options.apply) &&
							this.options.apply.apply(this, arguments),
							this.close();
					},
					cancel: function () {
						"function" === $.type(this.options.cancel) &&
							this.options.cancel.apply(this, arguments),
							this.close();
					},
				}),
				function (options) {
					var dialog = new Dialog(options);
					return dialog.init(), dialog;
				}
			);
		})();
	})(document),
	(function () {
		"use strict";
		var Textboxs = {
			create: function (elem, type, defVal) {
				if (elem.toTextboxsed) return elem;
				var classStr,
					i,
					$elem = $(elem),
					len = 4,
					maxlength = 3,
					divide = ".",
					replaceRE = /[^0-9]/g,
					textboxs = [],
					htmlArr = [];
				if (
					((defVal = defVal || ""),
					(type = type || "ip"),
					(classStr =
						"ip-mini" === type
							? "form-control input-mini"
							: "form-control"),
					(elem.textboxsType = type),
					(elem.defVal = defVal),
					"mac" === type &&
						((len = 6),
						(maxlength = 2),
						(divide = ":"),
						(replaceRE = /[^0-9a-fA-F]/g),
						(classStr = "form-control input-minic")),
					"" === $.trim(elem.innerHTML))
				) {
					for (i = 0; len > i; i++)
						htmlArr[i] =
							0 !== i
								? '<input type="text" class="' +
								  classStr +
								  '" maxlength="' +
								  maxlength +
								  '">'
								: '<input type="text" class="' +
								  classStr +
								  ' first" maxlength="' +
								  maxlength +
								  '">';
					elem.innerHTML = htmlArr.join(divide);
				}
				for (
					textboxs = elem.getElementsByTagName("input"),
						len = textboxs.length,
						i = 0;
					len > i;
					i++
				)
					textboxs[i].index = i;
				return (
					$(textboxs)
						.on("focus", function () {
							var val = Textboxs.getValue(this.parentNode);
							"" === val
								? Textboxs.setValue(elem, defVal, !0)
								: "back" === this.back &&
								  ($.setCursorPos(this, this.value.length),
								  (this.back = ""));
						})
						.on("blur", function () {
							this.value > 255 && (this.value = "255");
						}),
					$elem
						.on("keydown", function (e) {
							var elem = e.target || e.srcElement;
							(elem.pos1 = +$.getCursorPos(elem)),
								(this.curIndex = elem.index),
								(elem.emptyInput =
									elem.value.length <= 0 ? !0 : !1);
						})
						.on("keyup", function (e) {
							var elem = e.target || e.srcElement,
								myKeyCode = e.keyCode || e.which,
								skipNext = !1,
								skipPrev = !1,
								pos = +$.getCursorPos(elem),
								val = elem.value,
								replacedVal = val.replace(replaceRE, ""),
								ipReplacedVal = parseInt(
									replacedVal,
									10
								).toString(),
								isIp = -1 !== type.indexOf("ip");
							if (this.curIndex !== elem.index) return !1;
							switch (myKeyCode) {
								case $.keyCode.LEFT:
									return (
										(skipPrev = pos - elem.pos1 === 0),
										skipPrev &&
											0 === pos &&
											elem.index > 0 &&
											textboxs[elem.index - 1].focus(),
										!0
									);
								case $.keyCode.RIGHT:
									return (
										pos === val.length &&
											elem.index < len - 1 &&
											(textboxs[elem.index + 1].focus(),
											$.setCursorPos(
												textboxs[elem.index + 1],
												0
											)),
										!0
									);
								case $.keyCode.BACKSPACE:
									return (
										elem.emptyInput &&
											"" === elem.value &&
											elem.index > 0 &&
											(textboxs[elem.index - 1].focus(),
											(textboxs[elem.index - 1].back =
												"back")),
										!0
									);
							}
							val !== replacedVal && (elem.value = replacedVal),
								isIp &&
									!isNaN(ipReplacedVal) &&
									ipReplacedVal !== val &&
									(elem.value = ipReplacedVal),
								elem.index !== len - 1 &&
									elem.value.length > 0 &&
									(elem.value.length === maxlength &&
									pos === maxlength
										? (skipNext = !0)
										: !isIp ||
										  (myKeyCode !==
												$.keyCode.NUMPAD_DECIMAL &&
												myKeyCode !==
													$.keyCode.PERIOD) ||
										  (skipNext = !0)),
								skipNext &&
									(textboxs[elem.index + 1].focus(),
									textboxs[elem.index + 1].select());
						}),
					(elem.toTextboxsed = !0),
					elem
				);
			},
			setValue: function (elem, val, setDefault) {
				var textboxsValues,
					i,
					textboxs = elem.getElementsByTagName("input"),
					len = textboxs.length;
				for (
					"" !== val && "undefined" !== $.type(val)
						? ((textboxsValues = val.split(".")),
						  "mac" === elem.textboxsType &&
								(textboxsValues = val.split(":")))
						: (textboxsValues = ["", "", "", "", "", ""]),
						i = 0;
					len > i;
					i++
				)
					textboxs[i].value = textboxsValues[i];
				try {
					elem.defVal &&
						setDefault &&
						(textboxs[i - 1].focus(),
						$.setCursorPos(
							textboxs[i - 1],
							textboxs[i - 1].value.length
						));
				} catch (e) {}
				return elem;
			},
			getValues: function (elem) {
				var textboxs,
					len,
					i,
					valArr = [];
				for (
					textboxs = elem.getElementsByTagName("input"),
						len = textboxs.length,
						i = 0;
					len > i;
					i++
				)
					valArr[i] = textboxs[i].value;
				return valArr;
			},
			getValue: function (elem) {
				var ret,
					valArr = Textboxs.getValues(elem),
					divide = ".",
					emptyReg = /^[.:]{0,}$/;
				return (
					"mac" === elem.textboxsType && (divide = ":"),
					(ret = valArr.join(divide).toUpperCase()),
					emptyReg.test(ret) ? "" : ret
				);
			},
			disable: function (elem, disabled) {
				var i,
					textboxs = $("input.text", elem),
					len = textboxs.length;
				for (i = 0; len > i; i++) textboxs[i].disabled = disabled;
				return elem;
			},
		};
		$.fn.toTextboxs = function (type, delVal) {
			return this.each(function () {
				Textboxs.create(this, type, delVal),
					$(this).addClass("textboxs"),
					(this.val = function (val) {
						return "undefined" === $.type(val)
							? Textboxs.getValue(this)
							: "string" != typeof val
							? !1
							: void Textboxs.setValue(this, val);
					}),
					(this.disable = function (disabled) {
						Textboxs.disable(this, disabled);
					}),
					(this.toFocus = function () {
						this.getElementsByTagName("input")[0].focus();
					});
			});
		};
	})(),
	(function (win, doc) {
		"use strict";
		var Inputs = {
			addCapTip: function (newField, pasElem) {
				function hasCapital(value, pos) {
					var pattern = /[A-Z]/g,
						myPos = pos || value.length;
					return pattern.test(value.charAt(myPos - 1));
				}
				var $newField = $(newField);
				$newField.on("keyup", function (e) {
					var $message,
						massageElm,
						repeat,
						pos,
						msgId = this.id + "-caps",
						myKeyCode = e.keyCode || e.which;
					return 65 > myKeyCode || myKeyCode > 90
						? !0
						: (this.capDetected ||
								((massageElm = doc.createElement("span")),
								(massageElm.className =
									"help-inline text-info"),
								(massageElm.id = msgId),
								(massageElm.innerHTML = _(
									"Capital characters are entered!"
								)),
								pasElem
									? this.parentNode.insertBefore(
											massageElm,
											pasElem.nextSibling
									  )
									: this.parentNode.insertBefore(
											massageElm,
											newField.nextSibling
									  ),
								(this.capDetected = !0)),
						  ($message = $("#" + msgId)),
						  (pos = $.getCursorPos(this)),
						  void (hasCapital(this.value, pos)
								? ($message.show(),
								  (repeat = "$('#" + msgId + "').hide()"),
								  win.setTimeout(repeat, 1e3))
								: $message.hide()));
				});
			},
			supChangeType: "no",
			isSupChangeType: function (passwordElem) {
				try {
					if (
						(passwordElem.setAttribute("type", "text"),
						"text" === passwordElem.type)
					)
						return (
							passwordElem.setAttribute("type", "password"), !0
						);
				} catch (d) {
					return !1;
				}
			},
			createTextInput: function (elem) {
				var $newField,
					$elem = $(elem),
					newField = doc.createElement("input");
				return (
					newField.setAttribute("type", "text"),
					newField.setAttribute(
						"maxLength",
						elem.getAttribute("maxLength")
					),
					newField.setAttribute("id", elem.id + "_"),
					(newField.className = elem.className),
					newField.setAttribute(
						"placeholder",
						elem.getAttribute("placeholder") || ""
					),
					elem.getAttribute("data-options") &&
						newField.setAttribute(
							"data-options",
							elem.getAttribute("data-options")
						),
					elem.getAttribute("required") &&
						newField.setAttribute(
							"required",
							elem.getAttribute("required")
						),
					elem.parentNode.insertBefore(newField, elem),
					($newField = $(newField)),
					$elem.on("focus", function () {
						var thisVal = elem.value;
						"" !== thisVal && (newField.value = thisVal),
							$(this).hide(),
							$newField.show()[0].focus(),
							$.setCursorPos(newField, thisVal.length);
					}),
					$newField
						.on("blur", function () {
							var $this = $(this);
							"" !== this.value
								? ((elem.value = this.value),
								  $this.parent().hasClass("has-error") ||
										($(this).hide(), $elem.show()))
								: (elem.value = "");
						})
						.on("keyup", function () {
							elem.value =
								"" !== newField.value ? newField.value : "";
						}),
					"" !== elem.value
						? ($newField.hide(), (newField.value = elem.value))
						: ($elem.hide(), $newField.show()),
					newField
				);
			},
			toTextType: function (elem) {
				var newField,
					$elem = $(elem);
				return (
					"no" === Inputs.supChangeType &&
						(Inputs.supChangeType = Inputs.isSupChangeType(elem)),
					Inputs.supChangeType
						? ((newField = elem),
						  $elem
								.on("focus", function () {
									this.type = "text";
								})
								.on("blur", function () {
									this.type = "password";
								}),
						  "" === $elem.value && ($elem.type = "text"))
						: (newField = Inputs.createTextInput(elem)),
					($elem.textChanged = !0),
					newField
				);
			},
			addPlaceholder: function (elem, placeholderText) {
				function isPlaceholderVal(elem) {
					return elem.value === elem.getAttribute("placeholder");
				}
				function supportPlaceholder() {
					var i = doc.createElement("input");
					return "placeholder" in i;
				}
				function createPlaceholderElem(elem) {
					var ret = doc.createElement("span");
					return (
						(ret.className = "placeholder-content"),
						(ret.innerHTML =
							'<span class="placeholder-text" style="width:' +
							(elem.offsetWidth || 200) +
							"px;line-height:" +
							(elem.offsetHeight || 28) +
							'px">' +
							(placeholderText || "") +
							"</span>"),
						elem.parentNode.insertBefore(ret, elem),
						$(ret).on("click", function () {
							elem.focus();
						}),
						ret
					);
				}
				function showPlaceholder(node) {
					"" === node.value
						? ("ok" !== node.placeholdered &&
								((placehodereElem =
									createPlaceholderElem(elem)),
								(node.placeholdered = "ok")),
						  $(placehodereElem).show())
						: $(placehodereElem).hide();
				}
				var placehodereElem,
					text = elem.getAttribute("placeholder"),
					$text = $(elem);
				text !== placeholderText &&
					elem.setAttribute("placeholder", placeholderText),
					supportPlaceholder()
						? ($text
								.on("blur", function () {
									isPlaceholderVal(this) && (this.value = ""),
										"" === this.value &&
											$(this).addClass(
												"placeholder-text"
											);
								})
								.on("keyup", function () {
									"" !== this.value &&
										$(this).removeClass("placeholder-text");
								}),
						  "" === elem.value &&
								$text.addClass("placeholder-text"))
						: ($text
								.on("click", function () {
									showPlaceholder(this);
								})
								.on("keyup", function () {
									showPlaceholder(this);
								})
								.on("focus", function () {
									showPlaceholder(this);
								}),
						  showPlaceholder(elem));
			},
			initInput: function (elem, placeholderText, capTip) {
				var $text, textElem;
				return null === elem
					? 0
					: ((textElem = elem),
					  "password" !== elem.type || elem.textChanged
							? "text" === elem.type &&
							  capTip &&
							  Inputs.addCapTip(textElem)
							: ((textElem = Inputs.toTextType(elem, capTip)),
							  capTip && Inputs.addCapTip(textElem, elem)),
					  ($text = $(textElem)),
					  placeholderText
							? Inputs.addPlaceholder(textElem, placeholderText)
							: elem.getAttribute("placeholder") &&
							  ((placeholderText =
									elem.getAttribute("placeholder")),
							  Inputs.addPlaceholder(textElem, placeholderText)),
					  textElem);
			},
			initPassword: function (elem, placeholderText, capTip, hide) {
				var inputVal = elem.value,
					$elem = $(elem);
				"" === inputVal
					? Inputs.initInput(elem, placeholderText, capTip)
					: hide
					? $elem.on("keyup", function () {
							"" === this.value &&
								Inputs.initInput(elem, placeholderText, capTip);
					  })
					: Inputs.initInput(elem, placeholderText, capTip);
			},
		};
		$.include({
			addPlaceholder: function (text) {
				return this.each(function () {
					Inputs.addPlaceholder(this, text);
				});
			},
			initPassword: function (text, capTip, hide) {
				return this.each(function () {
					Inputs.initPassword(this, text, capTip, hide);
				});
			},
			initInput: function (text, capTip) {
				return this.each(function () {
					Inputs.initInput(this, text, capTip);
				});
			},
			addCapTip: function (newField, pasElem) {
				return this.each(function () {
					Inputs.addCapTip(newField, pasElem);
				});
			},
			toTextType: function () {
				return this.each(function () {
					Inputs.toTextType(this);
				});
			},
		});
	})(window, document),
	(function () {
		"use strict";
		$.ajaxMassage = (function () {
			function AjaxMsg() {
				this.$elem = null;
			}
			return (
				(AjaxMsg.prototype = {
					constructor: AjaxMsg,
					init: function (msg) {
						var msgElem = document.getElementById("ajax-massage");
						msgElem
							? (msgElem.style.display = "block")
							: ((msgElem = document.createElement("div")),
							  (msgElem.id = "ajax-massage"),
							  $("body").append(msgElem)),
							(msgElem.className += " massage-ajax"),
							(msgElem.innerHTML = msg),
							(this.$elem = $(msgElem));
					},
					show: function () {
						this.$elem.show();
					},
					hide: function () {
						this.$elem.hide();
					},
					remove: function () {
						this.$elem.remove();
					},
					text: function (msg) {
						this.$elem.html(msg);
					},
				}),
				function (msg) {
					var ajaxMsg = new AjaxMsg();
					return ajaxMsg.init(msg), ajaxMsg;
				}
			);
		})();
	})(document),
	(function (document) {
		"use strict";
		var Inputselect = {
			initSelected: !1,
			count: 0,
			defaults: {
				toggleEable: !0,
				editable: !0,
				size: "",
				seeAsTrans: !1,
				options: [{ nothingthere: "nothingthere" }],
			},
			create: function (elem, obj) {
				var inputBoxStr,
					dropBtnStr,
					ulStr,
					inputSelStr,
					aVal,
					liVal,
					id,
					i,
					len,
					options,
					root,
					inputBox,
					firstOpt,
					liContent = "",
					inputAble = "",
					toggleAble = "";
				for (
					obj = $.extend(Inputselect.defaults, obj),
						len = obj.options.length,
						i = 0;
					len > i;
					i++
				)
					if (Inputselect.count === i && obj.options[i]) {
						len > 1 &&
							(Inputselect.count < len - 1
								? Inputselect.count++
								: (Inputselect.count = 0)),
							(options = obj.options[i]);
						for (id in options)
							options.hasOwnProperty(id) &&
								(".divider" === options[id] && ".divider" === id
									? (liContent += '<li class="divider"></li>')
									: (firstOpt || (firstOpt = id),
									  (liContent +=
											'<li data-val="' +
											id +
											'"><a>' +
											(options[id] || id) +
											"</a></li>")));
					}
				obj.initVal || "" === obj.initVal || (obj.initVal = firstOpt),
					"string" == typeof obj.initVal &&
						(obj.initVal = [obj.initVal, obj.initVal]),
					(inputAble = 0 == obj.editable ? "disabled" : ""),
					(toggleAble = 0 == obj.toggleEable ? "disabled" : ""),
					(inputBoxStr =
						'<input class="form-control input-box" type="text" ' +
						inputAble +
						' value="' +
						obj.initVal[0] +
						'"><input type="hidden" value="' +
						obj.initVal[1] +
						'">'),
					(dropBtnStr =
						'<div class="btn-group"><button type="button"' +
						toggleAble +
						' class="dropdown-toggle toggle btn btn-sm"><span class="icon-caret"></span></button></div>'),
					(ulStr =
						'<div class="dropdown"><ul class="dropdown-menu">' +
						liContent +
						"</ul></div>"),
					(inputSelStr = inputBoxStr + dropBtnStr + ulStr),
					(elem.innerHTML = inputSelStr),
					$(elem).addClass("input-append");
				var root = elem.getElementsByTagName("ul")[0],
					inputBox = elem.getElementsByTagName("input")[0],
					inputBoxHide = elem.getElementsByTagName("input")[1];
				return (
					$(root)
						.on("mouseover", function (e) {
							var target = e.target || e.srcElement;
							"a" === target.tagName.toLowerCase() &&
								((liVal =
									target.parentElement.getAttribute(
										"data-val"
									)),
								(aVal =
									target.innerText || target.textContent));
						})
						.on("click", function (e) {
							var target = e.target || e.srcElement;
							if ("a" === target.tagName.toLowerCase()) {
								if (".hand-set" == liVal)
									return void inputBox.select();
								0 == obj.seeAsTrans
									? ((inputBox.value = liVal),
									  (inputBoxHide.value = liVal))
									: ((inputBox.value = aVal),
									  (inputBoxHide.value = liVal)),
									inputBox.focus();
							}
						}),
					$(inputBox)
						.on("click", function () {
							inputBox.select();
						})
						.on("blur", function () {})
						.on("keyup", function () {
							inputBoxHide.value = inputBox.value;
						}),
					Inputselect.initSelected ||
						((Inputselect.initSelected = !0),
						$(document).on("click", function (e) {
							var hasToggle,
								ulList,
								targetDis,
								target = e.target || e.srcElement;
							$(target.parentNode).hasClass("toggle") &&
								(target = target.parentNode),
								(hasToggle = $(target).hasClass("toggle")),
								hasToggle &&
									((ulList =
										target.parentNode.parentNode.getElementsByTagName(
											"ul"
										)[0]),
									(targetDis = ulList.style.display)),
								$(".toggle").each(function () {
									this.parentNode.parentNode.getElementsByTagName(
										"ul"
									)[0].style.display = "none";
								}),
								hasToggle &&
									(ulList.style.display =
										"none" === targetDis || "" === targetDis
											? "block"
											: "none");
						})),
					elem
				);
			},
			setValue: function (elem, val) {
				var inputBox = elem.getElementsByTagName("input")[0],
					inputBoxHide = elem.getElementsByTagName("input")[1];
				return (
					"string" == typeof val
						? ((inputBox.value = val), (inputBoxHide.value = val))
						: "object" == typeof val &&
						  ((inputBoxHide.value = val[0]),
						  (inputBox.value = val[1])),
					elem
				);
			},
			getValue: function (elem) {
				var inputBoxHide = elem.getElementsByTagName("input")[1];
				return inputBoxHide.value;
			},
			append: function (elem, options) {
				var id,
					ulList = elem.getElementsByTagName("ul")[0],
					ulHtml = ulList.innerHTML,
					liContent = "";
				for (id in options)
					options.hasOwnProperty(id) &&
						(liContent +=
							".divider" === options[id]
								? '<li class="divider"></li>'
								: '<li data-val="' +
								  id +
								  '"><a>' +
								  (options[id] || id) +
								  "</a></li>");
				(ulHtml += liContent), (ulList.innerHTML = ulHtml);
			},
			remove: function (elem, idx) {
				var rmOpt,
					opts = elem.getElementsByTagName("li");
				return idx < opts.length
					? ((rmOpt = opts[idx]),
					  void rmOpt.parentNode.removeChild(rmOpt))
					: "out of range!";
			},
		};
		$.fn.toSelect = function (obj) {
			return (
				(Inputselect.count = 0),
				this.each(function () {
					Inputselect.create(this, obj),
						(this.val = function (val) {
							return "undefined" === $.type(val)
								? Inputselect.getValue(this)
								: "string" != typeof val ||
								  "object" != typeof val
								? !1
								: (Inputselect.setValue(this, val), this);
						}),
						(this.appendLi = function (options) {
							return (
								"object" === $.type(options) &&
									Inputselect.append(this, options),
								this
							);
						}),
						(this.removeLi = function (idx) {
							return (
								(idx = parseInt(idx, 10)),
								"number" === $.type(idx) &&
									Inputselect.remove(this, idx),
								this
							);
						});
				})
			);
		};
	})(document),
	(function (window, document) {
		"use strict";
		var valid,
			utils = {
				errorNum: 0,
				getOptions: function (elem) {
					var options = elem.getAttribute("data-options");
					return $.parseJSON(options);
				},
				getVal: function (elem) {
					var ret = elem.value;
					return (
						!ret && $.isFunction(elem.val) && (ret = elem.val()),
						ret || ""
					);
				},
				isEmpty: function () {
					var val = utils.getVal(this);
					return (
						"" === val || val === this.getAttribute("placeholder")
					);
				},
				check: function (eventType) {
					var isEmpty,
						args,
						validType,
						$this = $(this),
						thisVal = utils.getVal(this),
						data = utils.getOptions(this) || null,
						valid = $.validate.valid,
						str = "";
					return (
						(args = [thisVal]),
						(isEmpty =
							"" === thisVal ||
							thisVal === this.getAttribute("placeholder")),
						("required" === this.getAttribute("required") ||
							this.required) &&
						isEmpty
							? "keyup" !== eventType &&
							  "focus" !== eventType &&
							  (str = _("This field is required."))
							: thisVal &&
							  null !== data &&
							  ((args = args.concat(data.args || [])),
							  (validType = valid[data.type]),
							  "function" == typeof validType
									? (str = validType.apply(valid, args))
									: "keyup" === eventType ||
									  "focus" === eventType
									? validType &&
									  "function" == typeof validType.specific &&
									  (str = validType.specific.apply(
											validType,
											args
									  ))
									: validType &&
									  "function" == typeof validType.all &&
									  (str = validType.all.apply(
											validType,
											args
									  ))),
						this["data-check-error"] || utils.errorNum++,
						$this.removeValidateTip(!0),
						!str || $.isHidden(this) || $.isDisabled(this)
							? ($this
									.parent()
									.removeClass("has-feedback has-error"),
							  utils.errorNum--,
							  (this["data-check-error"] = !1))
							: ($this.addValidateTip(str, !0).showValidateTip(),
							  $this.parent().addClass("has-feedback has-error"),
							  (this["data-check-error"] = !0)),
						isEmpty
					);
				},
				show: function () {
					$(this).showValidateTip();
				},
				hide: function () {
					$(this).hideValidateTip();
				},
			};
		($.validate = (function () {
			function Validate() {
				(this.ok = !1),
					(this.$elem = {}),
					(this.options = {
						custom: null,
						success: function () {},
						error: function () {},
					});
			}
			var handler = {
				focus: function (e) {
					var eventType = e ? e.type : null;
					(this.bluring = !1), utils.check.call(this, eventType);
				},
				blur: function (e) {
					var that = this,
						eventType = e ? e.type : null,
						data = utils.getOptions(this) || null;
					(this.bluring = !0),
						that.bluring &&
							(utils.check.call(that, eventType),
							utils.show.call(that),
							data &&
								"undefined" != typeof data.type &&
								"num" === data.type &&
								"" != this.value &&
								!$(this).parent().hasClass("has-error") &&
								!isNaN(this.value) &&
								data.args &&
								data.args.length > 0 &&
								(this.value = Number(this.value)));
				},
			};
			return (
				(Validate.prototype = {
					constructor: Validate,
					init: function (options) {
						var $elems = $(".validatebox");
						(this.options = $.extend(this.options, options)),
							(this.$elems = $elems),
							$elems.each(function () {
								var $this = $(this);
								$this
									.on("focus", handler.focus)
									.on("blur", handler.blur)
									.on("keyup", function () {
										utils.check.call(this, "keyup");
									});
							}),
							$(".textboxs").each(function () {
								var textBox = this;
								$(this).hasClass("validatebox") &&
									$(this)
										.find("input")
										.on("focus", function (e) {
											handler.focus.call(textBox, e);
										})
										.on("blur", function (e) {
											handler.blur.call(textBox, e);
										});
							});
					},
					addElems: function (elems) {
						$(elems)
							.on("focus", handler.focus)
							.on("blur", handler.blur)
							.on("keyup", function () {
								utils.check.call(this, "keyup");
							});
					},
					check: function (elems) {
						$(elems).each(utils.check);
					},
					checkAll: function (id) {
						var customResult = "",
							selector = id
								? "#" + id + " .validatebox"
								: ".validatebox";
						return (
							$(selector).each(function () {
								utils.check.apply(this, []);
							}),
							0 !== utils.errorNum ||
							("function" == typeof this.options.custom &&
								(customResult = this.options.custom()),
							customResult)
								? void this._error(customResult)
								: (this._success(), !0)
						);
					},
					message: function () {},
					_success: function () {
						(this.ok = !0),
							"function" == typeof this.options.success &&
								this.options.success();
					},
					_error: function (customResult) {
						(this.ok = !1),
							"function" == typeof this.options.error &&
								this.options.error(customResult);
					},
				}),
				function (options) {
					var validataInstance = new Validate();
					return validataInstance.init(options), validataInstance;
				}
			);
		})()),
			(valid = {
				len: function (str, min, max) {
					var len = str.length;
					return min > len || len > max
						? _(" %s - %s characters are required.", [min, max])
						: void 0;
				},
				num: function (str, min, max) {
					return /^[0-9]{1,}$/.test(str)
						? min &&
						  max &&
						  (parseInt(str, 10) < min || parseInt(str, 10) > max)
							? _("Input range is: %s - %s", [min, max])
							: void 0
						: _("Must be integer");
				},
				mac: {
					all: function (str) {
						var ret = this.specific(str);
						return ret
							? ret
							: /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(
									str
							  ) ||
							  /^([0-9a-fA-F]{2}-){5}[0-9a-fA-F]{2}$/.test(str)
							? void 0
							: _("Please input a valid MAC address.");
					},
					specific: function (str) {
						var subMac1 = str.split(":")[0];
						return subMac1.charAt(1) &&
							parseInt(subMac1.charAt(1), 16) % 2 !== 0
							? _("The second character must be even number.")
							: "00:00:00:00:00:00" === str
							? _("MAC can not be 00:00:00:00:00:00.")
							: void 0;
					},
				},
				ip: {
					all: function (str) {
						var ret = this.specific(str);
						return ret
							? ret
							: /^([1-9]|[1-9]\d|1\d\d|2[0-1]\d|22[0-3])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(
									str
							  )
							? void 0
							: _("Please input a valid IP address.");
					},
					specific: function (str) {
						var ipArr = str.split("."),
							ipHead = ipArr[0];
						return "127" === ipArr[0]
							? _(
									"The IP address starting with 127 is a loopback address, please try another."
							  )
							: ipArr[0] > 223
							? _(
									"The value %s is invalid, please enter value between 1-223.",
									[ipHead]
							  )
							: void 0;
					},
				},
				dns: function () {},
				mask: function (str) {
					var rel =
						/^(254|252|248|240|224|192)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(252|248|240|224|192|128|0))$/;
					return rel.test(str)
						? void 0
						: _("Please input a valid subnet mask.");
				},
				email: function (str) {
					var rel = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					return rel.test(str)
						? void 0
						: _("Please input a valid E-mail address");
				},
				time: function (str) {
					return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)
						? void 0
						: _("Please input a valid time.");
				},
				hex: function (str) {
					return /^[0-9a-fA-F]{1,}$/.test(str)
						? void 0
						: _("Must be HEX.");
				},
				ascii: function (str, min, max) {
					return /^[ -~]+$/g.test(str)
						? min || max
							? valid.len(str, min, max)
							: void 0
						: _("Must be ASCII.");
				},
				pwd: function (str, minLen, maxLen) {
					var ret;
					return /^[0-9a-zA-Z]+$/.test(str)
						? minLen &&
						  maxLen &&
						  (ret = $.validate.valid.len(str, minLen, maxLen))
							? ret
							: void 0
						: _("Must be numbers and letters");
				},
				username: function (str) {
					return /^\w{1,}$/.test(str)
						? void 0
						: _("Please input a valid user name.");
				},
				ssid: function (str) {
					var length = str.replace(/[^\x00-\xff]/g, "aaa").length;
					return length > 32
						? _(
								"The length should not be greater than 32 characters."
						  )
						: void 0;
				},
				ssidPasword: function (str, minLen, maxLen) {
					var ret;
					return (
						(ret = $.validate.valid.ascii(str)),
						!ret &&
						minLen &&
						maxLen &&
						(ret = valid.len(str, minLen, maxLen))
							? ret
							: ret
					);
				},
				remarkTxt: function (str, banStr) {
					var curChar,
						i,
						len = banStr.length;
					for (i = 0; len > i; i++)
						if (
							((curChar = banStr.charAt(i)),
							-1 !== str.indexOf(curChar))
						)
							return _("Can't input: '%s'", [curChar]);
				},
				pppoe: {
					all: function (str) {
						var ret = this.specific(str);
						return ret
							? ret
							: /^[ -~]+$/g.test(str)
							? void 0
							: _("Must be ASCII.");
					},
					specific: function (str) {
						return /[\\'"]/g.test(str)
							? _("Can't input: \\ ' \"")
							: void 0;
					},
				},
				domain: function (str) {
					return /^[\d\.]+$/.test(str)
						? _("Please input a valid domain name.")
						: /^[0-9a-z]([0-9a-z-]+\.){1,}([0-9a-z])+$/i.test(
								str
						  ) || "localhost" == str
						? void 0
						: _("Please input a valid domain name.");
				},
				ping: function (str) {
					var ip = $.validate.valid.ip.all(str),
						domain = $.validate.valid.domain(str);
					return ip && domain
						? _("Please input a valid IP address OR domain name.")
						: void 0;
				},
			}),
			($.validate.utils = utils),
			($.validate.valid = valid),
			($.validate.valid = valid),
			($.validateTipId = 0),
			$.include({
				addValidateTip: function (str) {
					function createTipElem(id, str, elem) {
						var tipElem = document.createElement("small"),
							tipId = "reasy-validate-tip-" + id;
						return (
							(tipElem.className = "help-block text-left"),
							tipElem.setAttribute("id", tipId),
							(tipElem.innerHTML = str),
							(elem.validateTipId = tipId),
							tipElem
						);
					}
					var $this = this;
					return this.each(function () {
						var tipElem;
						(tipElem = createTipElem($.validateTipId++, str, this)),
							$this.parent().append(tipElem);
					});
				},
				showValidateTip: function () {
					return this.each(function () {
						$("#" + this.validateTipId).css(
							"visibility",
							"visible"
						);
					});
				},
				hideValidateTip: function () {
					return this.each(function () {
						$("#" + this.validateTipId).css("visibility", "hidden");
					});
				},
				removeValidateTip: function () {
					return this.each(function () {
						var $tipElem = $("#" + this.validateTipId);
						$tipElem &&
							($("#" + this.validateTipId).remove(),
							(this.validateTipId = ""));
					});
				},
			});
	})(window, document),
	(function () {
		"use strict";
		var Dropdown = {
			create: function (elem) {
				var id = elem.id,
					str = "";
				(str =
					'<label for="' +
					id +
					'" class="select-btn"><div class="select-caret"></div></label>'),
					$("#" + id)
						.parent()
						.append(str);
			},
		};
		$.fn.reSelect = function (disabled) {
			return this.each(function () {
				Dropdown.create(this, disabled);
			});
		};
	})(document);
