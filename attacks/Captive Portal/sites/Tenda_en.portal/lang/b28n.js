!(function (window, document) {
	function assertElement(elem) {
		return "object" == typeof HTMLElement && elem instanceof HTMLElement
			? !0
			: "object" != typeof elem ||
			  (1 !== elem.nodeType && 9 !== elem.nodeType) ||
			  "string" != typeof elem.nodeName
			? !1
			: !0;
	}
	function transTitle() {
		doc.title = Butterlate.gettext(_trim(doc.title));
	}
	function replaceTextNodeValue(element) {
		if (element) {
			var curValue,
				isInputButton,
				firstChild = element.firstChild,
				nextSibling = element.nextSibling,
				nodeType = element.nodeType,
				btnStr = "";
			1 === nodeType
				? ((curValue = element.getAttribute("alt")),
				  curValue &&
						/\S/.test(curValue) &&
						((curValue = _trim(curValue)),
						element.setAttribute(
							"alt",
							Butterlate.gettext(curValue)
						)),
				  (curValue = element.getAttribute("placeholder")),
				  curValue &&
						/\S/.test(curValue) &&
						((curValue = _trim(curValue)),
						element.setAttribute(
							"placeholder",
							Butterlate.gettext(curValue)
						)),
				  (curValue = element.getAttribute("title")),
				  curValue &&
						/\S/.test(curValue) &&
						((curValue = _trim(curValue)),
						element.setAttribute(
							"title",
							Butterlate.gettext(curValue)
						)),
				  (isInputButton =
						"input" == element.nodeName.toLowerCase() &&
						-1 !== btnStr.indexOf(element.getAttribute("type"))),
				  (curValue = isInputButton
						? element.getAttribute("data-lang") || element.value
						: element.getAttribute("data-lang")),
				  curValue &&
						/\S/.test(curValue) &&
						((curValue = _trim(curValue)),
						curValue &&
							(isInputButton
								? element.setAttribute(
										"value",
										Butterlate.gettext(curValue)
								  )
								: innerText(
										element,
										Butterlate.gettext(curValue)
								  ))))
				: 3 === nodeType &&
				  /\S/.test(element.nodeValue) &&
				  ((curValue = _trim(element.nodeValue)),
				  (element.nodeValue = Butterlate.gettext(curValue))),
				nextSibling && replaceTextNodeValue(nextSibling),
				firstChild &&
					!element.getAttribute("data-lang") &&
					replaceTextNodeValue(firstChild);
		}
	}
	function Butterlation() {
		(this.curDomain = 0),
			(this.domainArr = []),
			(this.options = {
				defaultLang: b28Cfg.defaultLang,
				support: b28Cfg.supportLang,
				fileType: b28Cfg.fileType,
			}),
			(this.isSupport = function (lang) {
				var i,
					support = this.options.support,
					len = support.length;
				for (i = 0; len > i; i++)
					if (lang === support[i]) return support[i];
			}),
			(this.setLang = function (lang) {
				return (
					void 0 !== lang &&
						(this.isSupport(lang) ||
							(lang = this.options.defaultLang),
						(doc.cookie = "bLanguage=" + ";")),
					lang
				);
			}),
			(this.getLang = function () {
				var local,
					ret,
					start,
					end,
					special = {
						zh: "cn",
						"zh-chs": "cn",
						"zh-cn": "cn",
						"zh-cht": "cn",
						"zh-hk": "zh",
						"zh-mo": "zh",
						"zh-tw": "zh",
						"zh-sg": "zh",
					},
					defLang = this.options.defaultLang;
				return (
					-1 === doc.cookie.indexOf("bLanguage=")
						? ((local = (
								win.navigator.language ||
								win.navigator.userLanguage ||
								win.navigator.browserLanguage ||
								win.navigator.systemLanguage ||
								defLang
						  ).toLowerCase()),
						  (ret =
								special[local] ||
								local.split("-")[0].toString()))
						: (0 === doc.cookie.indexOf("bLanguage=")
								? (start = 10)
								: -1 !== doc.cookie.indexOf("; bLanguage=") &&
								  (start =
										doc.cookie.indexOf("; bLanguage=") +
										12),
						  void 0 !== start &&
								((end =
									-1 !== doc.cookie.indexOf(";", start)
										? doc.cookie.indexOf(";", start)
										: doc.cookie.length),
								(ret = doc.cookie.substring(start, end)))),
					this.isSupport(ret) || this.options.defaultLang
				);
			}),
			(this.getURL = function (domain) {
				return (
					langPath +
					this.lang +
					"/" +
					domain +
					"." +
					this.options.fileType
				);
			}),
			(this.setTextDomain = function (domain, lang, callBack) {
				var i,
					domainLen,
					htmlElem = doc.documentElement;
				if (
					((this.lang = lang || this.getLang()),
					this.setLang(lang),
					(this.curDomain = 0),
					"function" == typeof callBack && (this.success = callBack),
					(htmlElem.style.display = "none"),
					(htmlElem.className =
						htmlElem.className + " lang-" + this.lang),
					"[object Array]" === Object.prototype.toString.call(domain))
				)
					for (
						domainLen = domain.length,
							this.domainArr = domain,
							i = 0;
						domainLen > i;
						i += 1
					)
						(this.po = this.getURL(domain[i])),
							this.loadDomain(this.po, i);
				else
					"string" == typeof domain &&
						(this.domainArr.push(domain),
						(this.po = this.getURL(domain)),
						this.loadDomain(this.po, 0));
			}),
			(this.loadDomain = function (url) {
				b28Cfg.idDefaultLang && this.lang === b28Cfg.defaultLang
					? ((b28Loaded = !0),
					  b28Cfg.initSelect && domReady(Butterlate.initSelectElem),
					  (doc.documentElement.style.display = ""),
					  "function" == typeof Butterlate.success &&
							Butterlate.success())
					: "json" === this.options.fileType
					? loadJSON(url, this.loadedDict)
					: "xml" === this.options.fileType &&
					  loadXML(url, this.loadedDict);
			}),
			(this.loadedDict = function () {
				var len = Butterlate.domainArr.length;
				Butterlate.curDomain + 1 === len
					? ((b28Loaded = !0), domReady(Butterlate.translatePage))
					: (Butterlate.curDomain += 1);
			}),
			(this.isLoaded = function () {
				return b28Loaded;
			}),
			(this.gettext = function (key) {
				return void 0 !== MSG[key] ? MSG[key] : key;
			}),
			(this.getFormatText = function (key, replacements) {
				var index,
					nkey = this.gettext(key),
					count = 0;
				if (!replacements) return nkey;
				if (replacements instanceof Array && 0 !== replacements.length)
					for (; -1 !== (index = nkey.indexOf("%s")); )
						(nkey =
							nkey.slice(0, index) +
							replacements[count] +
							nkey.slice(index + 2)),
							(count =
								count + 1 === replacements.length
									? count
									: count + 1);
				else
					"string" == typeof replacements &&
						((index = nkey.indexOf("%s")),
						(nkey =
							nkey.slice(0, index) +
							replacements +
							nkey.slice(index + 2)));
				return nkey;
			}),
			(this.initSelectElem = function () {
				var newOption,
					lang,
					i,
					selectElem = doc.getElementById("select-lang"),
					len = b28Cfg.supportLang.length;
				if (
					selectElem &&
					"select" == selectElem.nodeName.toLowerCase()
				) {
					for (i = 0; len > i; i++)
						(lang = b28Cfg.supportLang[i]),
							(newOption = new Option(
								Butterlate.langArr[lang],
								lang
							)),
							selectElem.add(newOption, void 0);
					(selectElem.value = Butterlate.lang),
						doc.addEventListener
							? selectElem.addEventListener(
									"change",
									function () {
										Butterlate.setLang(
											doc.getElementById("select-lang")
												.value
										),
											setTimeout(function () {
												window.location.reload();
											}, 24);
									},
									!1
							  )
							: doc.attachEvent &&
							  selectElem.attachEvent("onchange", function () {
									Butterlate.setLang(
										doc.getElementById("select-lang").value
									),
										setTimeout(function () {
											window.location.reload();
										}, 24);
							  });
				}
			}),
			(this.translate = function (translateTarget) {
				var translateElem;
				assertElement(translateTarget)
					? (translateElem = translateTarget)
					: translateTarget &&
					  "string" == typeof translateTarget &&
					  (translateElem = doc.getElementById(translateTarget)),
					(translateElem = translateElem || doc.documentElement),
					(doc.documentElement.style.display = "none"),
					replaceTextNodeValue(translateElem),
					(doc.documentElement.style.display = ""),
					"function" == typeof Butterlate.success &&
						Butterlate.success();
			}),
			(this.translatePage = function () {
				var bodyElem = doc.body || doc.documentElement;
				transTitle(),
					b28Cfg.initSelect && Butterlate.initSelectElem(),
					Butterlate.translate(bodyElem);
			});
	}
	var MSG = {},
		b28Cfg = {};
	(MSG.extend = function (obj) {
		var name;
		for (name in obj) obj.hasOwnProperty(name) && (MSG[name] = obj[name]);
	}),
		(b28Cfg.supportLang = [
			"en",
			"zh",
			"ko",
			"de",
			"es",
			"fr",
			"hu",
			"it",
			"pl",
			"pt",
			"ro",
			"tr",
		]),
		(b28Cfg.defaultLang = "en"),
		(b28Cfg.fileType = "json"),
		(b28Cfg.idDefaultLang = !0),
		(b28Cfg.trimText = !0),
		(b28Cfg.insertHTML = !0),
		(b28Cfg.initSelect = !0),
		b28Cfg.idDefaultLang &&
			-1 ===
				("," + b28Cfg.supportLang.join(",") + ",").indexOf(
					b28Cfg.defaultLang
				) &&
			b28Cfg.supportLang.push(b28Cfg.defaultLang);
	var domReady,
		loadScript,
		loadJSON,
		loadXML,
		innerText,
		trim,
		_trim,
		parseJSON,
		createXHR,
		Butterlate,
		win = window,
		doc = document,
		core_version = "3.0.0",
		core_trim = core_version.trim,
		js = document.scripts,
		langPath = js[js.length - 1].src.substring(
			0,
			js[js.length - 1].src.lastIndexOf("/") + 1
		),
		rvalidchars = /^[\],:{}\s]*$/,
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
		rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
		rvalidtokens =
			/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
		b28Loaded = !1;
	(trim =
		core_trim && !core_trim.call("ï»¿Â ")
			? function (text) {
					return null == text ? "" : core_trim.call(text);
			  }
			: function (text) {
					if (null == text) return "";
					text += "";
					for (
						var str = text.replace(/^\s+/, ""),
							end = str.length - 1,
							ws = /\s/;
						ws.test(str.charAt(end));

					)
						end--;
					return str.slice(0, end + 1);
			  }),
		(_trim = function (str) {
			return b28Cfg.trimText ? trim(str) : str;
		}),
		(parseJSON = function (data) {
			return window.JSON && window.JSON.parse
				? window.JSON.parse(data)
				: null === data
				? data
				: "string" == typeof data &&
				  ((data = trim(data)),
				  data &&
						rvalidchars.test(
							data
								.replace(rvalidescape, "@")
								.replace(rvalidtokens, "]")
								.replace(rvalidbraces, "")
						))
				? new Function("return " + data)()
				: void 0;
		}),
		(createXHR = (function () {
			try {
				return function () {
					return new XMLHttpRequest();
				};
			} catch (e1) {
				try {
					return function () {
						return new ActiveXObject("Msxml2.XMLHTTP");
					};
				} catch (e2) {
					try {
						return function () {
							return new ActiveXObject("Microsoft.XMLHTTP");
						};
					} catch (e3) {
						return;
					}
				}
			}
		})()),
		(innerText = (function () {
			if (b28Cfg.insertHTML)
				return function (elem, str) {
					return str ? ((elem.innerHTML = str), elem) : void 0;
				};
			var element = doc.createElement("p");
			return (
				(element.innerHTML = core_version),
				element.textContent
					? function (elem, str) {
							return str
								? ((elem.textContent = str), elem)
								: elem.textContent;
					  }
					: function (elem, str) {
							return str
								? ((elem.innerText = str), elem)
								: elem.innerText;
					  }
			);
		})()),
		(domReady = (function () {
			function handler(e) {
				if (
					((e = e || win.event),
					!already &&
						("readystatechange" !== e.type ||
							"complete" === doc.readyState))
				) {
					for (i = 0, len = funcs.length; len > i; i++)
						funcs[i].call(doc);
					(already = !0), (funcs = null);
				}
			}
			var len,
				i,
				funcs = [],
				already = !1;
			return (
				doc.addEventListener
					? (doc.addEventListener("DOMContentLoaded", handler, !1),
					  doc.addEventListener("onreadystatechange", handler, !1),
					  win.addEventListener("load", handler, !1))
					: doc.attachEvent &&
					  (doc.attachEvent("onreadystatechange", handler),
					  win.attachEvent("onload", handler)),
				function (f) {
					already ? f.call(doc) : funcs.push(f);
				}
			);
		})()),
		(loadScript = (function () {
			var scripts = doc.createElement("script"),
				hasReadyState = scripts.readyState;
			return hasReadyState
				? function (url, callBack) {
						var scripts = doc.createElement("script");
						(scripts.onreadystatechange = function () {
							("loaded" === scripts.readyState ||
								"complete" === scripts.readyState) &&
								((scripts.onreadystatechange = null),
								"function" == typeof callBack &&
									(callBack(), (callBack = null)));
						}),
							(scripts.src = url),
							doc
								.getElementsByTagName("head")[0]
								.appendChild(scripts);
				  }
				: function (url, callBack) {
						var scripts = doc.createElement("script");
						(scripts.onload = function () {
							"function" == typeof callBack &&
								(callBack(), (callBack = null));
						}),
							(scripts.src = url),
							doc
								.getElementsByTagName("head")[0]
								.appendChild(scripts);
				  };
		})()),
		(loadJSON = function (url, callBack) {
			var request = createXHR();
			if (
				(request.open("GET", url + "?" + Math.random(), !1),
				request.send(null),
				(request.status >= 200 && request.status < 300) ||
					304 === request.status)
			) {
				MSG.extend(parseJSON(request.responseText));
				var str = "";
				for (var prop in MSG)
					"string" == typeof prop &&
						(str += prop + "=" + MSG[prop] + "\n");
				"function" == typeof callBack &&
					(callBack(), (callBack = null));
			}
		}),
		(loadXML = function (url, callBack) {
			var request, i, pos, posLen;
			if (
				((request = createXHR()),
				request.open("GET", url + "?" + Math.random(), !1),
				request.send(null),
				(request.status >= 200 && request.status < 300) ||
					304 === request.status)
			) {
				for (
					pos =
						request.responseXML.documentElement.getElementsByTagName(
							"message"
						),
						posLen = pos.length,
						i = 0;
					posLen > i;
					i++
				)
					MSG[pos[i].getAttribute("msgid")] =
						pos[i].getAttribute("msgstr");
				"function" == typeof callBack &&
					(callBack(), (callBack = null));
			}
		}),
		(Butterlate = new Butterlation()),
		(Butterlate.langArr = {
			cn: "中国",
			zh: "繁體中文",
			de: "Deutsch",
			en: "English",
			es: "Español",
			fr: "Français",
			hu: "Magyar",
			it: "Italiano",
			pl: "Polski",
			ro: "Română",
			ar: "",
			tr: "Türkçe",
			ru: "",
			pt: "Português",
			ko: "한국­",
		}),
		(Butterlate.getMsg = function () {
			return MSG;
		}),
		(win.Butterlate = Butterlate),
		(win.B = win.B || win.Butterlate),
		(win._ = function (key, replacements) {
			return Butterlate.getFormatText(key, replacements);
		}),
		(win.Butterlate.loadScript = loadScript),
		B.setTextDomain("translate");
})(window, document);
