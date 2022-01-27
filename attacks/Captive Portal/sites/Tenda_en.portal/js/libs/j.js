!(function () {
	"use strict";
	function isNative(fn) {
		return rnative.test(String(fn));
	}
	var rnative = /^[^{]+\{\s*\[native code/;
	(Function.prototype.method = function (name, func) {
		return this.prototype[name] || isNative(this[name])
			? void 0
			: ((this.prototype[name] = func), this);
	}),
		String.method("trim", function () {
			for (
				var str = this.replace(/^\s+/, ""),
					end = str.length - 1,
					ws = /\s/;
				ws.test(str.charAt(end));

			)
				end--;
			return str.slice(0, end + 1);
		});
})(),
	(function (window) {
		"use strict";
		function getAll(context, tag) {
			var elems,
				elem,
				i = 0,
				found =
					typeof context.getElementsByTagName !== core_strundefined
						? context.getElementsByTagName(tag || "*")
						: typeof context.querySelectorAll !== core_strundefined
						? context.querySelectorAll(tag || "*")
						: void 0;
			if (!found)
				for (
					found = [], elems = context.childNodes || context;
					null != (elem = elems[i]);
					i++
				)
					!tag || REasy.nodeName(elem, tag)
						? found.push(elem)
						: REasy.merge(found, getAll(elem, tag));
			return void 0 === tag || (tag && REasy.nodeName(context, tag))
				? REasy.merge([context], found)
				: found;
		}
		function createObject(o) {
			function F() {}
			return (F.prototype = o), new F();
		}
		function isArraylike(obj) {
			var len = obj.length,
				type = REasy.type(obj);
			return REasy.isWindow(obj)
				? !1
				: 1 === obj.nodeType && len
				? !0
				: "array" === type ||
				  ("function" !== type &&
						(0 === len ||
							("number" == typeof len &&
								len > 0 &&
								len - 1 in obj)));
		}
		function sibling(cur, dir) {
			do cur = cur[dir];
			while (cur && 1 !== cur.nodeType);
			return cur;
		}
		function getWindow(elem) {
			return REasy.isWindow(elem)
				? elem
				: 9 === elem.nodeType
				? elem.defaultView || elem.parentWindow
				: !1;
		}
		function winnow(elements, qualifier, keep) {
			if (((qualifier = qualifier || 0), REasy.isFunction(qualifier)))
				return REasy.grep(elements, function (elem, i) {
					var retVal = !!qualifier.call(elem, i, elem);
					return retVal === keep;
				});
			if (qualifier.nodeType)
				return REasy.grep(elements, function (elem) {
					return (elem === qualifier) === keep;
				});
			if ("string" == typeof qualifier) {
				var filtered = REasy.grep(elements, function (elem) {
					return 1 === elem.nodeType;
				});
				if (isSimple.test(qualifier))
					return REasy.filter(qualifier, filtered, !keep);
				qualifier = REasy.filter(qualifier, filtered);
			}
			return REasy.grep(elements, function (elem) {
				return REasy.inArray(elem, qualifier) >= 0 === keep;
			});
		}
		function createSafeFragment(document) {
			var list = nodeNames.split("|"),
				safeFrag = document.createDocumentFragment();
			if (safeFrag.createElement)
				for (; list.length; ) safeFrag.createElement(list.pop());
			return safeFrag;
		}
		function findOrAppend(elem, tag) {
			return (
				elem.getElementsByTagName(tag)[0] ||
				elem.appendChild(elem.ownerDocument.createElement(tag))
			);
		}
		function createRequest() {
			var req = null;
			try {
				(req = new XMLHttpRequest()),
					req.overrideMimeType && req.overrideMimeType("text/xml");
			} catch (trymicrosoft) {
				try {
					req = new ActiveXObject("MSXML2.XMLHTTP");
				} catch (othermicrosoft) {
					try {
						req = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (failed) {
						req = !1;
					}
				}
			}
			if (!req) throw new Error("No XHR object available.");
			return req;
		}
		var rootREasy,
			klass,
			r_version = "1.0.0",
			document = (window.location, window.document),
			_REasy = window.REasy,
			_$ = window.$,
			rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
			core_push = (Array.prototype.concat, Array.prototype.push),
			core_slice = Array.prototype.slice,
			core_indexOf = Array.prototype.indexOf,
			core_toString = Object.prototype.toString,
			core_trim =
				(Object.prototype.hasOwnProperty, String.prototype.trim),
			core_strundefined = "undefined",
			REasy = function (selector, context) {
				return REasy.inst(selector, context);
			},
			isREasy = function (obj) {
				return obj.constructor === REasy;
			},
			rvalidchars = /^[\],:{}\s]*$/,
			rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
			rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
			rvalidtokens =
				/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
			class2type = {},
			nodeNames =
				"abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
			rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
			rnoInnerhtml = /<(?:script|style|link)/i,
			rboolean =
				/(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
			rhtml = /<|&#?\w+;/,
			rtagName = /<([\w:]+)/,
			rtbody = /<tbody/i,
			rleadingWhitespace = /^\s+/,
			rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
			rxhtmlTag =
				/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
			safeFragment = createSafeFragment(document),
			fragmentDiv = safeFragment.appendChild(
				document.createElement("div")
			);
		(REasy.extend = function () {
			var copy,
				name,
				options,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length;
			for (
				"object" == typeof target ||
					REasy.isFunction(target) ||
					(target = {}),
					length === i && ((target = this), --i),
					i;
				length > i;
				i++
			)
				if (null != (options = arguments[i]))
					for (name in options)
						(copy = options[name]),
							target !== copy &&
								void 0 !== copy &&
								(target[name] = copy);
			return target;
		}),
			(klass = {
				init: function () {},
				prototype: { init: function () {} },
				create: function () {
					createObject(this);
					return (
						(object.constructor = this),
						object.init.apply(object, arguments),
						object
					);
				},
				inst: function () {
					var instance = createObject(this.prototype);
					return (
						(instance.constructor = this),
						(instance = instance.init.apply(instance, arguments))
					);
				},
				proxy: function (func) {
					var thisObject = this;
					return function () {
						return func.apply(thisObject, arguments);
					};
				},
				include: function (obj) {
					var i,
						included = obj.included || obj.setup;
					for (i in obj) this.fn[i] = obj[i];
					included && included(this);
				},
			}),
			(klass.fn = klass.prototype),
			REasy.extend(klass),
			REasy.include({
				REasy: r_version,
				init: function (selector, context) {
					var match, elem;
					if (!selector) return this;
					if ("string" == typeof selector) {
						if (
							((match =
								"<" === selector.charAt(0) &&
								">" === selector.charAt(selector.length - 1) &&
								selector.length >= 3
									? [null, selector, null]
									: rquickExpr.exec(selector)),
							!match || (!match[1] && context))
						)
							return !context || isREasy(context)
								? (context || rootREasy).find(selector)
								: this.constructor(context).find(selector);
						if (match[1]) {
							if (
								((context =
									context instanceof REasy
										? context[0]
										: context),
								REasy.merge(
									this,
									REasy.parseHTML(
										match[1],
										context && context.nodeType
											? context.ownerDocument || context
											: document,
										!0
									)
								),
								rsingleTag.test(match[1]))
							)
								for (match in context)
									REasy.isFunction(this[match])
										? this[match](context[match])
										: this.attr(match, context[match]);
							return this;
						}
						if (
							((elem = document.getElementById(match[2])),
							elem && elem.parentNode)
						) {
							if (elem.id !== match[2])
								return rootREasy.find(selector);
							(this.length = 1), (this[0] = elem);
						}
						return (
							(this.context = document),
							(this.selector = selector),
							this
						);
					}
					return selector.nodeType
						? ((this.context = this[0] = selector),
						  (this.length = 1),
						  this)
						: REasy.isFunction(selector)
						? REasy.ready(selector)
						: (void 0 !== selector.selector &&
								((this.selector = selector.selector),
								(this.context = selector.context)),
						  REasy.makeArray(selector, this));
				},
				selector: "",
				length: 0,
				modules: ["core"],
				toArray: function () {
					return core_slice.call(this);
				},
				pushStack: function (elems) {
					var ret = REasy.merge(this.constructor(), elems);
					return (
						(ret.prevObject = this),
						(ret.context = this.context),
						ret
					);
				},
				slice: function () {
					return this.pushStack(core_slice.apply(this, arguments));
				},
				first: function () {
					return this.eq(0);
				},
				last: function () {
					return this.eq(-1);
				},
				get: function (i) {
					return this[i];
				},
				eq: function (i) {
					var len = this.length,
						j = +i + (0 > i ? len : 0);
					return this.pushStack(j >= 0 && len > j ? [this[j]] : []);
				},
				map: function (callback) {
					return REasy.map(this, function (elem, i) {
						callback.call(elem, i);
					});
				},
				each: function (callback) {
					return this.map(callback), this;
				},
				end: function () {
					return this.prevObject || this.constructor(null);
				},
			});
		var div = document.createElement("div");
		div.setAttribute("className", "t"),
			(div.innerHTML =
				"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
			REasy.extend({
				modules: ["base"],
				noConflict: function (deep) {
					return (
						window.$ === REasy && (window.$ = _$),
						deep &&
							window.REasy === REasy &&
							(window.REasy = _REasy),
						REasy
					);
				},
				support: {
					leadingWhitespace: 3 === div.firstChild.nodeType,
					tbody: !div.getElementsByTagName("tbody").length,
					htmlSerialize: !!div.getElementsByTagName("link").length,
					html5Clone:
						"<:nav></:nav>" !==
						document.createElement("nav").cloneNode(!0).outerHTML,
					deleteExpando: !0,
					noCloneEvent: !0,
					inlineBlockNeedsLayout: !1,
					shrinkWrapBlocks: !1,
					reliableMarginRight: !0,
					boxSizingReliable: !0,
					pixelPosition: !1,
				},
				isReady: !1,
				ready: (function () {
					function handler(e) {
						if (
							!REasy.isReady &&
							("readystatechange" !== e.type ||
								"complete" === document.readyState)
						)
							try {
								for (i = 0, len = funcs.length; len > i; i++)
									funcs[i].call(document);
							} finally {
								(REasy.isReady = !0), (funcs = null);
							}
					}
					var len,
						i,
						funcs = [];
					return (
						document.addEventListener
							? (document.addEventListener(
									"DOMContentLoaded",
									handler,
									!1
							  ),
							  window.addEventListener("load", handler, !1))
							: (document.attachEvent(
									"onreadystatechange",
									handler
							  ),
							  window.attachEvent("onload", handler)),
						function (f) {
							REasy.isReady ? f.call(document) : funcs.push(f);
						}
					);
				})(),
				isFunction: function (obj) {
					return "function" === REasy.type(obj);
				},
				buildFragment: function (elems, context, scripts, selection) {
					for (
						var j,
							elem,
							contains,
							tmp,
							tag,
							tbody,
							wrap,
							l = elems.length,
							safe = createSafeFragment(context),
							nodes = [],
							i = 0,
							wrapMap = {
								option: [
									1,
									"<select multiple='multiple'>",
									"</select>",
								],
								legend: [1, "<fieldset>", "</fieldset>"],
								area: [1, "<map>", "</map>"],
								param: [1, "<object>", "</object>"],
								thead: [1, "<table>", "</table>"],
								tr: [2, "<table><tbody>", "</tbody></table>"],
								col: [
									2,
									"<table><tbody></tbody><colgroup>",
									"</colgroup></table>",
								],
								td: [
									3,
									"<table><tbody><tr>",
									"</tr></tbody></table>",
								],
								_default: REasy.support.htmlSerialize
									? [0, "", ""]
									: [1, "X<div>", "</div>"],
							};
						l > i;
						i++
					)
						if (((elem = elems[i]), elem || 0 === elem))
							if ("object" === REasy.type(elem))
								REasy.merge(
									nodes,
									elem.nodeType ? [elem] : elem
								);
							else if (rhtml.test(elem)) {
								for (
									tmp =
										tmp ||
										safe.appendChild(
											context.createElement("div")
										),
										tag = (rtagName.exec(elem) || [
											"",
											"",
										])[1].toLowerCase(),
										wrap = wrapMap[tag] || wrapMap._default,
										tmp.innerHTML =
											wrap[1] +
											elem.replace(
												rxhtmlTag,
												"<$1></$2>"
											) +
											wrap[2],
										j = wrap[0];
									j--;

								)
									tmp = tmp.lastChild;
								if (
									(!REasy.support.leadingWhitespace &&
										rleadingWhitespace.test(elem) &&
										nodes.push(
											context.createTextNode(
												rleadingWhitespace.exec(elem)[0]
											)
										),
									!REasy.support.tbody)
								)
									for (
										elem =
											"table" !== tag || rtbody.test(elem)
												? "<table>" !== wrap[1] ||
												  rtbody.test(elem)
													? 0
													: tmp
												: tmp.firstChild,
											j = elem && elem.childNodes.length;
										j--;

									)
										REasy.nodeName(
											(tbody = elem.childNodes[j]),
											"tbody"
										) &&
											!tbody.childNodes.length &&
											elem.removeChild(tbody);
								for (
									REasy.merge(nodes, tmp.childNodes),
										tmp.textContent = "";
									tmp.firstChild;

								)
									tmp.removeChild(tmp.firstChild);
								tmp = safe.lastChild;
							} else nodes.push(context.createTextNode(elem));
					for (
						tmp && safe.removeChild(tmp), i = 0;
						(elem = nodes[i++]);

					)
						(selection && -1 !== REasy.inArray(elem, selection)) ||
							(selection &&
								-1 !== jQuery.inArray(elem, selection)) ||
							((contains = jQuery.contains(
								elem.ownerDocument,
								elem
							)),
							(tmp = getAll(safe.appendChild(elem), "script")));
					return (tmp = null), safe;
				},
				isArray:
					Array.isArray ||
					function (obj) {
						return "array" === REasy.type(obj);
					},
				likeArray: function (arr) {
					var type = REasy.type(arr);
					return (
						("number" != typeof arr.length &&
							"string" !== type &&
							"function" !== type &&
							"regexp" !== type) ||
						!REasy.isWindow(arr)
					);
				},
				isWindow: function (obj) {
					return null != obj && obj == obj.window;
				},
				isNumeric: function (obj) {
					return !isNaN(parseFloat(obj)) && isFinite(obj);
				},
				type: function (obj) {
					return null == obj
						? String(obj)
						: class2type[core_toString.call(obj)] || "object";
				},
				error: function (msg) {
					throw new Error(msg);
				},
				parseHTML: function (data, context, keepScripts) {
					if (!data || "string" != typeof data) return null;
					"boolean" == typeof context &&
						((keepScripts = context), (context = !1)),
						(context = context || document);
					var parsed = rsingleTag.exec(data),
						scripts = !keepScripts && [];
					return parsed
						? [context.createElement(parsed[1])]
						: ((parsed = REasy.buildFragment(
								[data],
								context,
								scripts
						  )),
						  scripts && REasy(scripts).remove(),
						  REasy.merge([], parsed.childNodes));
				},
				parseJSON: function (data) {
					return window.JSON && window.JSON.parse
						? window.JSON.parse(data)
						: null === data
						? data
						: "string" == typeof data &&
						  ((data = REasy.trim(data)),
						  data &&
								rvalidchars.test(
									data
										.replace(rvalidescape, "@")
										.replace(rvalidtokens, "]")
										.replace(rvalidbraces, "")
								))
						? new Function("return " + data)()
						: void REasy.error("Invalid JSON: " + data);
				},
				parseXML: function (data) {
					var xml, tmp;
					if (!data || "string" != typeof data) return null;
					try {
						window.DOMParser
							? ((tmp = new DOMParser()),
							  (xml = tmp.parseFromString(data, "text/xml")))
							: ((xml = new ActiveXObject("Microsoft.XMLDOM")),
							  (xml.async = "false"),
							  xml.loadXML(data));
					} catch (e) {
						xml = void 0;
					}
					return (
						(xml &&
							xml.documentElement &&
							!xml.getElementsByTagName("parsererror").length) ||
							REasy.error("Invalid XML: " + data),
						xml
					);
				},
				isElement: function (o) {
					var toString;
					return o
						? ((toString = core_toString.call(o)),
						  -1 !== toString.indexOf("HTML") ||
								("[object Object]" === toString &&
									1 === o.nodeType &&
									!(o instanceof Object)))
						: !1;
				},
				nodeName: function (elem, name) {
					return (
						elem.nodeName &&
						elem.nodeName.toLowerCase() === name.toLowerCase()
					);
				},
				isXML: function (elem) {
					var documentElement =
						elem && (elem.ownerDocument || elem).documentElement;
					return documentElement
						? "HTML" !== documentElement.nodeName
						: !1;
				},
				clone: function (elem) {
					{
						var destElements, node, clone, srcElements;
						REasy.contains(elem.ownerDocument, elem);
					}
					return (
						REasy.support.html5Clone ||
						REasy.isXML(elem) ||
						!rnoshimcache.test("<" + elem.nodeName + ">")
							? (clone = elem.cloneNode(!0))
							: ((fragmentDiv.innerHTML = elem.outerHTML),
							  fragmentDiv.removeChild(
									(clone = fragmentDiv.firstChild)
							  )),
						jQuery.support.noCloneEvent ||
							(1 !== elem.nodeType && 11 !== elem.nodeType) ||
							((destElements = getAll(clone)),
							(srcElements = getAll(elem))),
						(destElements = srcElements = node = null),
						clone
					);
				},
				each: function (obj, callback, args) {
					var key,
						val,
						i,
						len = obj.length,
						isArray = isArraylike(obj);
					if (args) {
						if (isArray)
							for (
								i = 0;
								len > i &&
								((val = callback.apply(obj[i], args)),
								val !== !1);
								i++
							);
						else
							for (key in obj)
								if (
									((val = callback.apply(obj[key], args)),
									val === !1)
								)
									break;
					} else if (isArray)
						for (
							i = 0;
							len > i &&
							((val = callback.call(obj[i], i, obj[i])),
							val !== !1);
							i++
						);
					else
						for (key in obj)
							if (
								((val = callback.call(obj[key], key, obj[key])),
								val === !1)
							)
								break;
					return obj;
				},
				trim: function (text) {
					return null == text ? "" : core_trim.call(text);
				},
				makeArray: function (arr, results) {
					var ret = results || [];
					return (
						null != arr &&
							(isArraylike(Object(arr))
								? REasy.merge(
										ret,
										"string" == typeof arr ? [arr] : arr
								  )
								: core_push.call(ret, arr)),
						ret
					);
				},
				inArray: function (elem, arr, i) {
					var len;
					if (arr) {
						if (core_indexOf)
							return core_indexOf.call(arr, elem, i);
						for (
							len = arr.length,
								i = i ? (0 > i ? Math.max(0, len + i) : i) : 0;
							len > i;
							i++
						)
							if (i in arr && arr[i] === elem) return i;
					}
					return -1;
				},
				merge: function (first, second) {
					var l,
						i = first.length,
						j = 0;
					if ((second && (l = second.length), "number" == typeof l))
						for (j; l > j; j++) first[i++] = second[j];
					else
						for (; second && void 0 !== second[j]; )
							first[i++] = second[j++];
					return (first.length = i), first;
				},
				grep: function (elems, callback, inv) {
					var retVal,
						ret = [],
						length = elems.length,
						i = 0;
					for (inv = !!inv, i = 0; length > i; i++)
						(retVal = !!callback(elems[i], i)),
							inv !== retVal && ret.push(elems[i]);
					return ret;
				},
				map: function (elems, callback) {
					var val,
						i,
						key,
						values = [],
						len = elems.length;
					if (REasy.likeArray(elems))
						for (i = 0; len > i; i++)
							(val = callback(elems[i], i)),
								null != val && values.push(val);
					else
						for (key in elems)
							(val = callback(elems[key], key)),
								null != val && values.push(val);
					return values.concat.apply([], values);
				},
			}),
			REasy.each(
				"Boolean Number String Function Array Date RegExp Object".split(
					" "
				),
				function (i, name) {
					class2type["[object " + name + "]"] = name.toLowerCase();
				}
			),
			REasy.include({
				included: function (_this) {
					_this.modules.push("event");
				},
				on: function (type, callback) {
					return this.each(function () {
						var elem = this;
						return elem
							? void (document.attachEvent
									? elem.attachEvent(
											"on" + type,
											function () {
												REasy.isFunction(callback) &&
													callback.apply(
														elem,
														arguments
													);
											}
									  )
									: document.addEventListener
									? elem.addEventListener(
											type,
											function () {
												REasy.isFunction(callback) &&
													callback.apply(
														elem,
														arguments
													);
											},
											!1
									  )
									: REasy.isFunction(callback) &&
									  (elem["on" + type] = callback))
							: !1;
					});
				},
				delegate: function (target, type, callback) {
					return this.each(function () {
						var targetElem,
							elem = this,
							events = [];
						return (
							(type = type.replace(/(.*)\.(.*$)/g, "$1")),
							elem
								? void (REasy(elem).find(target).length
										? REasy(elem)
												.find(target)
												.on(type, callback)
										: document.attachEvent
										? "focus" === type
											? REasy.isFunction(callback) &&
											  (elem.onfocusin = function (e) {
													(e = e || window.event),
														$(target).each(
															function () {
																(targetElem =
																	e.target ||
																	e.srcElement),
																	this ==
																		targetElem &&
																		callback.apply(
																			targetElem,
																			arguments
																		);
															}
														);
											  })
											: "blur" === type
											? REasy.isFunction(callback) &&
											  ("function" ==
													typeof elem.onfocusout &&
													events.push(
														elem.onfocusout
													),
											  (elem.onfocusout = function (e) {
													e = e || window.event;
													for (
														var i = 0;
														i < events.length;
														i++
													)
														events[i].apply(
															arguments
														);
													$(target).each(function () {
														(targetElem =
															e.target ||
															e.srcElement),
															this ==
																targetElem &&
																callback.apply(
																	targetElem,
																	arguments
																);
													});
											  }))
											: elem.attachEvent(
													"on" + type,
													function (e) {
														$(target).each(
															function () {
																(targetElem =
																	e.target ||
																	e.srcElement),
																	this ==
																		targetElem &&
																		REasy.isFunction(
																			callback
																		) &&
																		callback.apply(
																			targetElem,
																			arguments
																		);
															}
														);
													}
											  )
										: document.addEventListener
										? elem.addEventListener(
												type,
												function (e) {
													$(target).each(function () {
														(targetElem =
															e.target ||
															e.srcElement),
															this ==
																targetElem &&
																REasy.isFunction(
																	callback
																) &&
																callback.apply(
																	targetElem,
																	arguments
																);
													});
												},
												!0
										  )
										: REasy.isFunction(callback) &&
										  (elem["on" + type] = callback))
								: !1
						);
					});
				},
				off: function (type, callback) {
					return this.each(function () {
						var elem = this;
						return elem
							? void (document.attachEvent
									? elem.detachEvent("on" + type, callback)
									: document.addEventListener
									? elem.removeEventListener(
											type,
											callback,
											!1
									  )
									: (elem["on" + type] = null))
							: !1;
					});
				},
			});
		var getStyles,
			curCSS,
			isSimple = /^.[^:#\[\.,]*$/,
			rnative = /^[^{]+\{\s*\[native code/,
			cssNormalTransform =
				(document.documentElement,
				{ letterSpacing: 0, fontWeight: 400 }),
			Rquery = null;
		(rootREasy = REasy(document)),
			REasy.extend({
				cssHooks: {
					opacity: {
						get: function (elem, computed) {
							if (computed) {
								var ret = curCSS(elem, "opacity");
								return "" === ret ? "1" : ret;
							}
						},
					},
				},
				cssNumber: {
					columnCount: !0,
					fillOpacity: !0,
					fontWeight: !0,
					lineHeight: !0,
					opacity: !0,
					orphans: !0,
					widows: !0,
					zIndex: !0,
					zoom: !0,
				},
				cssProps: {},
				style: function (elem, name, value, extra) {
					if (
						elem &&
						3 !== elem.nodeType &&
						8 !== elem.nodeType &&
						elem.style
					) {
						var ret,
							type,
							hooks,
							style = elem.style;
						if (
							((name = REasy.cssProps[name] || name),
							(hooks = REasy.cssHooks[name]),
							void 0 === value)
						)
							return hooks &&
								"get" in hooks &&
								void 0 !== (ret = hooks.get(elem, !1, extra))
								? ret
								: style[name];
						if (
							((type = typeof value),
							!(
								hooks &&
								"set" in hooks &&
								void 0 ===
									(value = hooks.set(elem, value, extra))
							))
						)
							try {
								style[name] = value;
							} catch (e) {}
					}
				},
				css: function (elem, name, extra, styles) {
					var num, val, hooks;
					return (
						(name = REasy.cssProps[name] || name),
						(hooks = REasy.cssHooks[name]),
						hooks &&
							"get" in hooks &&
							(val = hooks.get(elem, !0, extra)),
						void 0 === val && (val = curCSS(elem, name, styles)),
						"normal" === val &&
							name in cssNormalTransform &&
							(val = cssNormalTransform[name]),
						"" === extra || extra
							? ((num = parseFloat(val)),
							  extra === !0 || REasy.isNumeric(num)
									? num || 0
									: val)
							: val
					);
				},
			}),
			window.getComputedStyle
				? ((getStyles = function (elem) {
						return window.getComputedStyle(elem, null);
				  }),
				  (curCSS = function (elem, name, _computed) {
						{
							var computed = _computed || getStyles(elem),
								ret = computed
									? computed.getPropertyValue(name) ||
									  computed[name]
									: void 0;
							elem.style;
						}
						return (
							computed &&
								("" !== ret ||
									REasy.contains(elem.ownerDocument, elem) ||
									(ret = REasy.style(elem, name))),
							ret
						);
				  }))
				: document.documentElement.currentStyle &&
				  ((getStyles = function (elem) {
						return elem.currentStyle;
				  }),
				  (curCSS = function (elem, name, _computed) {
						var computed = _computed || getStyles(elem),
							ret = computed ? computed[name] : void 0,
							style = elem.style;
						return (
							null == ret &&
								style &&
								style[name] &&
								(ret = style[name]),
							"" === ret ? "auto" : ret
						);
				  })),
			(Rquery = (function (window, document) {
				function isNative(fn) {
					return rnative.test(String(fn));
				}
				function getByClass(selector, context) {
					var classStr,
						elems = [],
						all = (context || document).getElementsByTagName("*"),
						len = all.length,
						i = 0;
					for (i; len > i; i++)
						(classStr = " " + all[i].className + " "),
							-1 !== classStr.indexOf(" " + selector + " ") &&
								elems.push(all[i]);
					return elems;
				}
				function querySelectorAll(selector, context) {
					context = context || document;
					var Expri = {
							TAG: /^((?:\\.|[\w*-]|[^\x00-\xa0])+)/,
							CLASS: /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
							ATTR: /^\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^\x00-\xa0])+)[\x20\t\r\n\f]*(?:([*^$|~]?=)[\x20\t\r\n\f]*(?:(['"])((?:\\.|[^\\])*?)\3|((?:\\.|[\w#-]|[^\x00-\xa0])+)|)|)[\x20\t\r\n\f]*\]/,
							ID: /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
						},
						relativeReg =
							/^[\x20\t\r\n\f]*([\x20\t\r\n\f>+~])[\x20\t\r\n\f]*/,
						rtrim =
							/^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g,
						relative = {
							">": { dir: "parentNode", first: !0 },
							" ": { dir: "parentNode" },
							"+": { dir: "previousSibling", first: !0 },
							"~": { dir: "previousSibling" },
						},
						Hook = {
							tabindex: "tabIndex",
							readonly: "readOnly",
							for: "htmlFor",
							class: "className",
							maxlength: "maxLength",
							cellspacing: "cellSpacing",
							cellpadding: "cellPadding",
							rowspan: "rowSpan",
							colspan: "colSpan",
							usemap: "useMap",
							frameborder: "frameBorder",
							contenteditable: "contentEditable",
						},
						getDomArray = {
							ID: function (value) {
								var ret = [],
									result = context.getElementById(value);
								return null == result ||
									(result && result.id != value)
									? !1
									: ((ret[0] = result), ret);
							},
							TAG: function (value) {
								var ret = context.getElementsByTagName(value);
								return 0 === ret.length ? !1 : ret;
							},
							CLASS: function (value) {
								var ret = support.byClass
									? context.getElementsByClassName(value)
									: getByClass(value, context);
								return 0 === ret.length ? !1 : ret;
							},
							ATTR: function (value) {
								var ret = [],
									attr = value[0],
									attflag =
										void 0 === value[1] ? "" : value[1],
									attrvalue = value[2],
									elements =
										context.getElementsByTagName("*"),
									len = elements.length,
									i = 0,
									name = "";
								for (i; len > i; i++)
									switch (
										((name = attrHooks[attr]
											? attrHooks[attr](elements[i])
											: elements[i].getAttribute(attr) ||
											  elements[i][Hook[attr]]),
										(name =
											"string" == typeof name
												? name.replace(/^\s+|\s+$/g, "")
												: ""),
										attflag)
									) {
										case "":
											"" != name && ret.push(elements[i]);
											break;
										case "=":
											name == attrvalue &&
												ret.push(elements[i]);
											break;
										case "~=":
											if (
												((name = " " + name + " "),
												-1 != attrvalue.indexOf(" "))
											)
												break;
											var attrvalue1 =
												" " + attrvalue + " ";
											-1 != name.indexOf(attrvalue1) &&
												ret.push(elements[i]);
											break;
										case "^=":
											(name = name.slice(
												0,
												attrvalue.length
											)),
												name == attrvalue &&
													ret.push(elements[i]);
											break;
										case "$=":
											(name = name.slice(
												-attrvalue.length
											)),
												name == attrvalue &&
													ret.push(elements[i]);
											break;
										case "*=":
											-1 != name.indexOf(attrvalue) &&
												ret.push(elements[i]);
											break;
										case "|=":
											(name = name.split("-")[0]),
												name == attrvalue &&
													ret.push(elements[i]);
									}
								return ret;
							},
						},
						Filter = {
							TAG: function (mached, target) {
								return 1 == target.nodeType
									? target.getAttribute("tagName")
									: null;
							},
							CLASS: function (mached, target) {
								return 1 == target.nodeType
									? target.getAttribute("className")
									: null;
							},
							ID: function (mached, target) {
								return 1 == target.nodeType
									? target.getAttribute("id")
									: null;
							},
							ATTR: function (matched, target) {
								var result;
								return 1 == target.nodeType
									? ((result = attrHooks[matched[0]]
											? attrHooks[matched[0]](target)
											: target.getAttribute(matched[0]) ||
											  target[Hook[matched[0]]]),
									  "string" == typeof result ? result : "")
									: null;
							},
						},
						runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
						funescape = function (_, escaped) {
							var high = "0x" + escaped - 65536;
							return high !== high
								? escaped
								: 0 > high
								? String.fromCharCode(high + 65536)
								: String.fromCharCode(
										(high >> 10) | 55296,
										(1023 & high) | 56320
								  );
						},
						select = function (tokens) {
							for (
								var i,
									types = "",
									value = "",
									len = 0,
									dir = "",
									result = [],
									ret = [],
									first = !1,
									token = {},
									relativation = [],
									relativations = [],
									textNode = [];
								(token = tokens.pop());

							) {
								if (
									((types = token.type),
									(value =
										"ATTR" == types
											? token.matches
											: token.matches
											? token.matches[0]
											: token.value),
									token && relative[types])
								) {
									for (
										dir = relative[types].dir,
											first = relative[types].first,
											len = ret.length,
											token = tokens.pop(),
											types = token.type,
											value =
												"ATTR" == types
													? token.matches[2]
													: token.matches
													? token.matches[0]
													: token.value,
											textNode = [],
											tmp = "",
											i = 0;
										len > i;
										i++
									)
										if (
											((textNode = []),
											"parentNode" == dir && first)
										) {
											var relatiArr = [];
											relativation[i] &&
											relativation[i][0]
												? (textNode = relativation[i])
												: (textNode[0] = ret[i]);
											for (
												var node = [];
												(node[0] = textNode.pop());

											)
												(tmp = Filter[types](
													token.matches,
													node[0][dir]
												)),
													(tmp = tmp
														? tmp
																.toLowerCase()
																.replace(
																	/^\s+|\s+$/g,
																	""
																)
														: tmp),
													tmp &&
														(("ATTR" == types &&
															getAttr(
																tmp,
																token.matches
															)) ||
															tmp == value ||
															0 ===
																(
																	" " +
																	tmp +
																	" "
																).indexOf(
																	value
																)) &&
														(relatiArr.push(
															node[0][dir]
														),
														result.length - 1 !=
															ret[i] &&
															result.push(
																ret[i]
															));
											0 !== relatiArr.length &&
												relativations.push(relatiArr);
										} else if ("parentNode" != dir || first)
											if (
												"previousSibling" != dir ||
												first
											) {
												if (
													"previousSibling" == dir &&
													first
												) {
													var relatiArr = [];
													relativation[i] &&
													relativation[i][0]
														? (textNode =
																relativation[i])
														: (textNode[0] =
																ret[i]);
													for (
														var node = [];
														(node[0] =
															textNode.pop());

													)
														for (; node[0][dir]; ) {
															if (
																((tmp = Filter[
																	types
																](
																	token.matches,
																	node[0][dir]
																)),
																(tmp = tmp
																	? tmp
																			.toLowerCase()
																			.replace(
																				/^\s+|\s+$/g,
																				""
																			)
																	: tmp),
																3 !=
																	node[0][dir]
																		.nodeType ||
																	/\S+/.test(
																		node[0][
																			dir
																		]
																			.nodeValue
																	))
															) {
																if (
																	tmp &&
																	(("ATTR" ==
																		types &&
																		getAttr(
																			tmp,
																			token.matches
																		)) ||
																		tmp ==
																			value ||
																		0 ===
																			(
																				" " +
																				tmp +
																				" "
																			).indexOf(
																				value
																			))
																) {
																	relatiArr.push(
																		node[0][
																			dir
																		]
																	),
																		result[
																			result.length -
																				1
																		] !=
																			ret[
																				i
																			] &&
																			result.push(
																				ret[
																					i
																				]
																			);
																	break;
																}
																break;
															}
															node[0] =
																node[0][dir];
														}
													0 !== relatiArr.length &&
														relativations.push(
															relatiArr
														);
												}
											} else {
												var relatiArr = [];
												relativation[i] &&
												relativation[i][0]
													? (textNode =
															relativation[i])
													: (textNode[0] = ret[i]);
												for (
													var node = [];
													(node[0] = textNode.pop());

												)
													for (; node[0][dir]; )
														(tmp = Filter[types](
															token.matches,
															node[0][dir]
														)),
															(tmp = tmp
																? tmp
																		.toLowerCase()
																		.replace(
																			/^\s+|\s+$/g,
																			""
																		)
																: tmp),
															tmp &&
																(("ATTR" ==
																	types &&
																	getAttr(
																		tmp,
																		token.matches
																	)) ||
																	tmp ==
																		value ||
																	0 ===
																		(
																			" " +
																			tmp +
																			" "
																		).indexOf(
																			value
																		)) &&
																(relatiArr.push(
																	node[0][dir]
																),
																result[
																	result.length -
																		1
																] != ret[i] &&
																	result.push(
																		ret[i]
																	)),
															(node[0] =
																node[0][dir]);
												0 !== relatiArr.length &&
													relativations.push(
														relatiArr
													);
											}
										else {
											var relatiArr = [];
											relativation[i] &&
											relativation[i][0]
												? (textNode = relativation[i])
												: (textNode[0] = ret[i]);
											for (
												var node = [];
												(node[0] = textNode.pop());

											)
												for (; node[0][dir]; )
													(tmp = Filter[types](
														token.matches,
														node[0][dir]
													)),
														(tmp = tmp
															? tmp
																	.toLowerCase()
																	.replace(
																		/^\s+|\s+$/g,
																		""
																	)
															: tmp),
														tmp &&
															(("ATTR" == types &&
																getAttr(
																	tmp,
																	token.matches
																)) ||
																tmp == value ||
																0 ==
																	(
																		" " +
																		tmp +
																		" "
																	).indexOf(
																		value
																	)) &&
															(relatiArr.push(
																node[0][dir]
															),
															result[
																result.length -
																	1
															] != ret[i] &&
																result.push(
																	ret[i]
																)),
														(node[0] =
															node[0][dir]);
											0 != relatiArr.length &&
												relativations.push(relatiArr);
										}
									(ret = result),
										(relativation = relativations),
										(relativations = []),
										(result = []);
								} else if (0 === ret.length)
									ret = getDomArray[types](value);
								else {
									len = ret.length;
									var tmp = "";
									for (i = 0; len > i; i++)
										(tmp = Filter[types](
											token.matches,
											ret[i]
										)),
											(tmp = tmp
												? tmp
														.toLowerCase()
														.replace(
															/^\s+|\s+$/g,
															""
														)
												: tmp),
											tmp &&
												(("ATTR" == types &&
													getAttr(
														tmp,
														token.matches
													)) ||
													tmp == value ||
													0 ===
														(
															" " +
															tmp +
															" "
														).indexOf(value)) &&
												result.push(ret[i]);
									(ret = result), (result = []);
								}
								if (0 === ret.length) break;
							}
							return ret;
						},
						getAttr = function (name, matches) {
							var value = matches[2],
								relative = matches[1],
								flag = -1;
							switch (
								((name =
									"string" == typeof name
										? name.replace(/^\s+|\s+$/g, "")
										: ""),
								relative)
							) {
								case "":
									"" !== name && (flag = 0);
									break;
								case "=":
									name == value && (flag = 0);
									break;
								case "~=":
									if (
										((name = " " + name + " "),
										-1 != value.index(" "))
									)
										break;
									var value1 = " " + value + " ";
									-1 != name.indexOf(value1) && (flag = 0);
									break;
								case "^=":
									(name = name.slice(0, value.length)),
										name == value && (flag = 0);
									break;
								case "$=":
									(name = name.slice(-value.length)),
										name == value && (flag = 0);
									break;
								case "*=":
									-1 != name.indexOf(value) && (flag = 0);
									break;
								case "|=":
									(name = name.split("-")[0]),
										name == value && (flag = 0);
							}
							return 0 === flag ? !0 : !1;
						},
						attrHooks = {};
					REasy.each(
						["href", "src", "width", "height"],
						function (i, name) {
							attrHooks[name] = function (elem) {
								var ret = elem.getAttribute(name, 2);
								return null == ret ? void 0 : ret;
							};
						}
					),
						(attrHooks.style = function (elem) {
							var ret = elem.style.cssText.toLowerCase();
							return null == ret ? void 0 : ret;
						});
					for (
						var type,
							soFar = selector,
							match = [],
							tokens = [],
							matched = !1;
						"" != soFar;

					) {
						(match = relativeReg.exec(soFar)) &&
							((matched = match.shift()),
							tokens.push({
								value: matched,
								type: match[0].replace(rtrim, " "),
							}),
							(soFar = soFar.slice(matched.length)));
						for (type in Expri)
							if (
								Expri.hasOwnProperty(type) &&
								((match = Expri[type].exec(soFar)),
								null != match)
							) {
								"ATTR" == type &&
									((match[1] = match[1].replace(
										runescape,
										funescape
									)),
									(match[3] = (
										match[4] ||
										match[5] ||
										""
									).replace(runescape, funescape)),
									(match = match.slice(0, 4))),
									(matched = match.shift()),
									tokens.push({
										matches: match,
										type: type,
										value: matched,
									}),
									(soFar = soFar.slice(matched.length));
								break;
							}
						if (!matched) break;
					}
					return select(tokens);
				}
				var docElem,
					contains,
					support = {};
				return (
					(docElem = document.documentElement),
					(support.qs = isNative(document.querySelectorAll)),
					(support.qsa = isNative(document.querySelectorAll)),
					(support.byClass = isNative(
						document.getElementsByClassName
					)),
					support.byClass ||
						(document.getElementsByClassName = getByClass),
					support.qsa ||
						(document.querySelectorAll = querySelectorAll),
					support.qs ||
						(document.querySelector = function (selector) {
							return querySelectorAll(selector)[0];
						}),
					(contains =
						isNative(docElem.contains) ||
						docElem.compareDocumentPosition
							? function (a, b) {
									var adown =
											9 === a.nodeType
												? a.documentElement
												: a,
										bup = b && b.parentNode;
									return (
										a === bup ||
										!(
											!bup ||
											1 !== bup.nodeType ||
											!(adown.contains
												? adown.contains(bup)
												: a.compareDocumentPosition &&
												  16 &
														a.compareDocumentPosition(
															bup
														))
										)
									);
							  }
							: function (a, b) {
									if (b)
										for (; (b = b.parentNode); )
											if (b === a) return !0;
									return !1;
							  }),
					{
						selectAll: isNative(document.querySelectorAll)
							? function (selector, context) {
									try {
										return (
											context || document
										).querySelectorAll(selector);
									} catch (e) {
										if (rboolean.test(selector))
											for (
												var selectorArry =
														selector.split(":"),
													arry = (
														context || document
													).querySelectorAll(
														selectorArry[0]
													),
													i = 0,
													l = arry.length;
												l > i;
												i++
											)
												if (arry[i][selectorArry[1]])
													return {
														0: arry[i],
														length: 1,
														context: document,
													};
									}
							  }
							: function (selector, context) {
									return querySelectorAll(
										selector,
										context || document
									);
							  },
						contains: contains,
					}
				);
			})(window, document)),
			REasy.extend({
				find: function (expr, elems, ret) {
					var nodeType,
						i,
						len = elems.length;
					if (((ret = ret || []), !expr || "string" != typeof expr))
						return ret;
					if (
						((nodeType =
							elems.nodeType ||
							(elems[0] ? elems[0].nodeType : -1)),
						1 !== nodeType && 9 !== nodeType)
					)
						return ret;
					if (len)
						for (i = 0; len > i; i++)
							REasy.merge(ret, Rquery.selectAll(expr, elems[i]));
					else REasy.merge(ret, Rquery.selectAll(expr, elems));
					return ret;
				},
				contains: Rquery.contains,
				getPosition: function (e) {
					var position,
						offsetY = e.offsetTop,
						offsetX = e.offsetLeft;
					return (
						null != e.offsetParent &&
							((position = REasy.getPosition(e.offsetParent)),
							(offsetY +=
								position.top +
								REasy.css(e, "borderTopWidth", !0)),
							(offsetX +=
								position.left +
								REasy.css(e, "borderLeftWidth", !0))),
						{ top: offsetY, left: offsetX }
					);
				},
				getValue: function (elem) {
					return "undefined" != typeof elem.value
						? elem.value
						: REasy.isFunction(elem.val)
						? elem.val()
						: void 0;
				},
				setValue: function (elem, val) {
					return "undefined" != typeof val
						? !1
						: void ("undefined" != typeof elem.value
								? (elem.value = val)
								: REasy.isFunction(elem.val) && elem.val(val));
				},
			}),
			REasy.include({
				included: function (_this) {
					_this.modules.push("dom");
				},
				find: function (selector) {
					var ret,
						i,
						self,
						len = this.length;
					return "string" != typeof selector
						? ((self = this),
						  this.pushStack(
								REasy(selector).filter(function () {
									for (i = 0; len > i; i++)
										if (REasy.contains(self[i], this))
											return !0;
								})
						  ))
						: ((ret = []),
						  REasy.find(selector, this, ret),
						  (ret = this.pushStack(ret)),
						  (ret.selector =
								(this.selector ? this.selector + " " : "") +
								selector),
						  ret);
				},
				not: function (selector) {
					return this.pushStack(winnow(this, selector, !1));
				},
				filter: function (selector) {
					return this.pushStack(winnow(this, selector, !0));
				},
				html: function (value) {
					var elem = this[0] || {},
						i = 0,
						l = this.length,
						wrapMap = {
							option: [
								1,
								"<select multiple='multiple'>",
								"</select>",
							],
							legend: [1, "<fieldset>", "</fieldset>"],
							area: [1, "<map>", "</map>"],
							param: [1, "<object>", "</object>"],
							thead: [1, "<table>", "</table>"],
							tr: [2, "<table><tbody>", "</tbody></table>"],
							col: [
								2,
								"<table><tbody></tbody><colgroup>",
								"</colgroup></table>",
							],
							td: [
								3,
								"<table><tbody><tr>",
								"</tr></tbody></table>",
							],
							_default: REasy.support.htmlSerialize
								? [0, "", ""]
								: [1, "X<div>", "</div>"],
						};
					if (void 0 === value)
						return 1 === elem.nodeType ? elem.innerHTML : void 0;
					if (
						!(
							"string" != typeof value ||
							rnoInnerhtml.test(value) ||
							(!jQuery.support.htmlSerialize &&
								rnoshimcache.test(value)) ||
							(!jQuery.support.leadingWhitespace &&
								rleadingWhitespace.test(value)) ||
							wrapMap[
								(rtagName.exec(value) || [
									"",
									"",
								])[1].toLowerCase()
							]
						)
					) {
						value = value.replace(rxhtmlTag, "<$1></$2>");
						try {
							for (; l > i; i++)
								(elem = this[i] || {}),
									1 === elem.nodeType &&
										(elem.innerHTML = value);
							elem = 0;
						} catch (e) {}
					}
					return elem && this.empty().append(value), this;
				},
				text: function (text) {
					return "undefined" == typeof text
						? "undefined" != typeof this[0].innerText
							? this[0].innerText
							: this[0].textContent
						: this.each(function () {
								"undefined" != typeof this.innerText
									? (this.innerText = text)
									: (this.textContent = text);
						  });
				},
				attr: function (name, str) {
					return "undefined" == typeof str
						? this[0].getAttribute(name)
						: this.each(function () {
								this.setAttribute(name, str);
						  });
				},
				removeAttr: function (name) {
					return this.each(function () {
						this.removeAttribute(name);
					});
				},
				focus: function () {
					return "undefined" == typeof this[0]
						? this
						: (REasy.isHidden(this[0]) || this[0].focus(), this);
				},
				height: function (height) {
					return height
						? this.each(function () {
								this.css("height", height + "px");
						  })
						: this[0].offsetHeight;
				},
				domManip: function (args, table, callback) {
					{
						var first,
							node,
							fragment,
							i = 0,
							l = this.length,
							iNoClone = l - 1,
							value = args[0];
						REasy.isFunction(value);
					}
					if (
						l &&
						((fragment = REasy.buildFragment(
							args,
							this[0].ownerDocument,
							!1,
							this
						)),
						(first = fragment.firstChild),
						1 === fragment.childNodes.length && (fragment = first),
						first)
					)
						for (
							table = table && REasy.nodeName(first, "tr");
							l > i;
							i++
						)
							(node = fragment),
								i !== iNoClone &&
									(node = REasy.clone(node, !0, !0)),
								callback.call(
									table && REasy.nodeName(this[i], "table")
										? findOrAppend(this[i], "tbody")
										: this[i],
									node,
									i
								);
					return this;
				},
				append: function () {
					return this.domManip(arguments, !0, function (node) {
						(1 === this.nodeType ||
							11 === this.nodeType ||
							9 === this.nodeType) &&
							this.appendChild(node);
					});
				},
				empty: function () {
					for (var elem, i = 0; null != (elem = this[i]); i++) {
						for (; elem.firstChild; )
							elem.removeChild(elem.firstChild);
						elem.options &&
							REasy.nodeName(elem, "select") &&
							(elem.options.length = 0);
					}
					return this;
				},
				appendTo: function (node) {
					REasy(node).append(this[0]);
				},
				prepend: function (node) {
					return $.isElement(node)
						? this.each(function () {
								(1 === this.nodeType ||
									11 === this.nodeType ||
									9 === this.nodeType) &&
									this.insertBefore(elem, this.firstChild);
						  })
						: this;
				},
				before: function (node) {
					return $.isElement(node)
						? this.each(function () {
								this.parentNode.insertBefore(node, this);
						  })
						: this;
				},
				after: function (node) {
					return $.isElement(node)
						? this.each(function () {
								var parent = this.parentNode;
								parent.lastChild == this
									? parent.appendChild(node)
									: parent.insertBefore(
											node,
											this.nextSibling
									  );
						  })
						: this;
				},
				remove: function () {
					return this.each(function () {
						var parentElem = this && this.parentNode;
						$.isElement(parentElem) && parentElem.removeChild(this);
					});
				},
				css: function (name, value) {
					return "string" === REasy.type(name) && void 0 === value
						? this[0].style[name]
						: (this.each(function () {
								if (void 0 !== value)
									try {
										this.style[name] = value;
									} catch (ex) {}
						  }),
						  this);
				},
				val: function (val) {
					return "undefined" == typeof this[0]
						? void 0
						: "undefined" == typeof val
						? this[0].value
						: this.each(function () {
								"undefined" !== this.value
									? (this.value = val)
									: REasy.isFunction(this.val) &&
									  this.val(val);
						  });
				},
				offset: function () {
					if (arguments.length)
						return void 0 === options
							? this
							: this.each(function (i) {
									REasy.offset.setOffset(this, options, i);
							  });
					var docElem,
						win,
						box = { top: 0, left: 0 },
						elem = this[0],
						doc = elem && elem.ownerDocument;
					if (doc)
						return (
							(docElem = doc.documentElement),
							REasy.contains(docElem, elem)
								? (void 0 !==
										typeof elem.getBoundingClientRect &&
										(box = elem.getBoundingClientRect()),
								  (win = getWindow(doc)),
								  {
										top:
											box.top +
											(win.pageYOffset ||
												docElem.scrollTop) -
											(docElem.clientTop || 0),
										left:
											box.left +
											(win.pageXOffset ||
												docElem.scrollLeft) -
											(docElem.clientLeft || 0),
								  })
								: box
						);
				},
				show: function () {
					return this.each(function () {
						REasy(this).css("display", "block");
					});
				},
				hide: function () {
					return this.each(function () {
						REasy(this).css("display", "none");
					});
				},
				fadeIn: function (time, callback) {
					return this.each(function () {
						var elem = this;
						setTimeout(function () {
							REasy(elem).show(),
								"function" == typeof callback &&
									callback.apply();
						}, time);
					});
				},
				fadeOut: function (time, callback) {
					return this.each(function () {
						var elem = this;
						setTimeout(function () {
							REasy(elem).hide(),
								"function" == typeof callback &&
									callback.apply();
						}, time);
					});
				},
				hasClass: function (classStr) {
					var str,
						elem = this[0];
					return "undefined" == typeof elem
						? !1
						: ((classStr = classStr || ""),
						  (str = " " + elem.className + " "),
						  -1 !== str.indexOf(" " + classStr.trim() + " "));
				},
				addClass: function (classStr) {
					return "string" === REasy.type(classStr)
						? this.each(function () {
								$(this).hasClass(classStr) ||
									(this.className +=
										"" === this.className
											? classStr
											: " " + classStr);
						  })
						: this;
				},
				removeClass: function (classStr) {
					return "string" === REasy.type(classStr)
						? this.each(function () {
								var newName, str;
								return $(this).hasClass(classStr)
									? ((str = " " + this.className + " "),
									  (newName = str
											.replace(" " + classStr + " ", " ")
											.trim()),
									  (this.className = newName),
									  this)
									: void 0;
						  })
						: void 0;
				},
				load: function (url, callback) {
					function ajaxCallback(responseText) {
						"function" == typeof callback &&
							(REasy(elem).html(responseText), callback.apply());
					}
					var elem = this;
					return "string" != typeof url
						? !1
						: void REasy.ajax({
								url: url,
								type: "get",
								dataType: "html",
								success: ajaxCallback,
						  });
				},
				resize: function (callback) {
					"function" == typeof callback &&
						(window.onresize = function () {
							callback.apply();
						});
				},
			}),
			REasy.extend({
				filter: function (expr, elems) {
					return 1 === elems.length
						? REasy.find(expr, elems[0])
							? elems[0]
							: []
						: REasy.find(expr, elems);
				},
				dir: function (elem, dir, until) {
					for (
						var matched = [], cur = elem[dir];
						cur &&
						9 !== cur.nodeType &&
						(void 0 === until ||
							1 !== cur.nodeType ||
							cur !== until);

					)
						1 === cur.nodeType && matched.push(cur),
							(cur = cur[dir]);
					return matched;
				},
				sibling: function (n, elem) {
					for (var r = []; n; n = n.nextSibling)
						1 === n.nodeType && n !== elem && r.push(n);
					return r;
				},
				isHidden: function (elem) {
					return (
						"none" === REasy.css(elem, "display") ||
						"hidden" === REasy.css(elem, "visibility") ||
						(0 == elem.offsetHeight && 0 == elem.offsetWidth)
					);
				},
			}),
			REasy.each(
				{
					parent: function (elem) {
						var parent = elem.parentNode;
						return parent && 11 !== parent.nodeType ? parent : null;
					},
					parents: function (elem) {
						return REasy.dir(elem, "parentNode");
					},
					next: function (elem) {
						return sibling(elem, "nextSibling");
					},
					prev: function (elem) {
						return sibling(elem, "previousSibling");
					},
					nextAll: function (elem) {
						return REasy.dir(elem, "nextSibling");
					},
					prevAll: function (elem) {
						return REasy.dir(elem, "previousSibling");
					},
					siblings: function (elem) {
						return REasy.sibling(
							(elem.parentNode || {}).firstChild,
							elem
						);
					},
					children: function (elem) {
						return REasy.sibling(elem.firstChild);
					},
					contents: function (elem) {
						return REasy.nodeName(elem, "iframe")
							? elem.contentDocument ||
									elem.contentWindow.document
							: REasy.merge([], elem.childNodes);
					},
				},
				function (name, fn) {
					REasy.fn[name] = function () {
						var ret = REasy.map(this, fn);
						return this.pushStack(ret);
					};
				}
			);
		var ajaxLocation,
			rnoContent = /^(?:GET|HEAD)$/;
		try {
			ajaxLocation = window.location.href;
		} catch (e) {
			(ajaxLocation = document.createElement("a")),
				(ajaxLocation.href = ""),
				(ajaxLocation = ajaxLocation.href);
		}
		REasy.extend({
			encodeFormData: function (data) {
				var name,
					val,
					pairs = [];
				if (!data) return "";
				for (name in data)
					data.hasOwnProperty(name) &&
						!REasy.isFunction(data[name]) &&
						((val = data[name].toString()),
						(name = encodeURIComponent(name.replace("%20", "+"))),
						(val = encodeURIComponent(val.replace("%20", "+"))),
						pairs.push(name + "=" + val));
				return pairs.join("&");
			},
			queryToObj: function (str) {
				for (
					var strI,
						strArr = str.split("&"),
						i = 0,
						len = strArr.length;
					len > i;
					i++
				)
					strI = strArr[i];
			},
			serializeByClass: function (name, obj) {
				var ret = [],
					retObj = {};
				return (
					REasy("." + name).each(function () {
						var nameVal = this.getAttribute("name");
						nameVal &&
							(ret.push(
								encodeURIComponent(nameVal) +
									"=" +
									encodeURIComponent($.getValue(this))
							),
							(retObj[nameVal] = $.getValue(this)));
					}),
					obj ? retObj : ret.join("&")
				);
			},
			serialize: function (form, byClass) {
				var i,
					len,
					j,
					optLen,
					option,
					optValue,
					parts = [],
					field = null;
				for (i = 0, len = form.elements.length; len > i; i++)
					switch (((field = form.elements[i]), field.type)) {
						case "select-one":
						case "select-multiple":
							if (field.name.length)
								for (
									j = 0, optLen = field.options.length;
									optLen > j;
									j++
								)
									(optValue = ""),
										(optValue = option.hasAttribute
											? option.hasAttribute("value")
												? option.value
												: option.text
											: option.attributes.value.specified
											? option.value
											: option.text),
										parts.push(
											encodeURIComponent(field.name) +
												"=" +
												encodeURIComponent(optValue)
										);
							break;
						case void 0:
						case "file":
						case "submit":
						case "reset":
						case "button":
							break;
						case "radio":
						case "checkbox":
							if (!field.checked) break;
						default:
							field.name.length &&
								parts.push(
									encodeURIComponent(field.name) +
										"=" +
										encodeURIComponent(field.value)
								);
					}
				return byClass
					? parts.join("&") + "&" + REasy.serializeByClass(byClass)
					: parts.join("&");
			},
			ajaxSettings: {
				url: ajaxLocation,
				type: "GET",
				global: !0,
				processData: !0,
				async: !0,
				contentType: "application/x-www-form-urlencoded;",
			},
			ajaxError: !1,
			ajax: function (options) {
				var s = REasy.extend({}, REasy.ajaxSettings, options),
					req = createRequest();
				return (
					(s.hasContent = !rnoContent.test(s.type)),
					(s.type = s.type.toUpperCase()),
					req.open(s.type, s.url, s.async),
					((s.data && s.hasContent && s.contentType !== !1) ||
						options.contentType) &&
						req.setRequestHeader("Content-Type", s.contentType),
					(req.onreadystatechange = function () {
						4 === req.readyState && 200 === req.status && s.success
							? s.successed ||
							  "function" !== REasy.type(s.success)
								? (REasy.ajaxError = !0)
								: (s.success.call(req, req.responseText),
								  (s.successed = !0),
								  (REasy.ajaxError = !1))
							: (REasy.ajaxError = !0);
					}),
					"object" === REasy.type(s.data) &&
						(s.data = $.encodeFormData(s.data)),
					req.send(s.data),
					(s.successed = !1),
					req
				);
			},
			getJSON: function (url, callback) {
				REasy.get(url, function (req) {
					var dataStr = req,
						jsonObj = {};
					dataStr = dataStr.replace(/[\x00-\x1F\x7F]/g, " ");
					try {
						jsonObj = $.parseJSON(dataStr);
					} catch (e) {
						REasy.ajaxError = !0;
					} finally {
						"function" == typeof callback &&
							callback.call(req, jsonObj);
					}
				});
			},
		}),
			REasy.each(["get", "post"], function (i, method) {
				REasy[method] = function (url, data, callback, type) {
					return (
						REasy.isFunction(data) &&
							((type = type || callback),
							(callback = data),
							(data = void 0)),
						REasy.ajax({
							url: url,
							type: method,
							dataType: type,
							data: data,
							success: callback,
						})
					);
				};
			}),
			(window.REasy = window.R = window.$ = window.jQuery = REasy);
	})(window);
