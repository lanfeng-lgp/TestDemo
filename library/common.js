//公共方法
window.commonFn = (function() {
	//  日期格式化 yyyy/MM/dd hh:mm:ss
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
	//四舍五入 toFixed提升
	Number.prototype.toSuperFixed = function(d) {
		var s = this + "";
		if (!d) d = 0;
		if (s.indexOf(".") == -1) s += ".";
		s += new Array(d + 1).join("0");
		if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
			var s = "0" + RegExp.$2,
				pm = RegExp.$1,
				a = RegExp.$3.length,
				b = true;
			if (a == d + 2) {
				a = s.match(/\d/g);
				if (parseInt(a[a.length - 1]) > 4) {
					for (var i = a.length - 2; i >= 0; i--) {
						a[i] = parseInt(a[i]) + 1;
						if (a[i] == 10) {
							a[i] = 0;
							b = i != 1;
						} else break;
					}
				}
				s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

			}
			if (b) s = s.substr(1);
			return (pm + s).replace(/\.$/, "");
		}
		return this + "";
	};
	//string清除左右空格
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		};
	}
	//具体公共方法
	var commonObject = {
		//		获取URL参数
		getParam: function(name) {
			//先获取#后面的参数
			var getValue = function(name, str) {
				//获取参数name的值
				var reg = new RegExp("(^|!|&|\\?)" + name + "=([^&]*)(&|$)");
				//再获取?后面的参数
				var r = str.match(reg);
				if (r != null) {
					try {
						return decodeURIComponent(r[2]);
					} catch (e) {
						console.log(e + "r[2]:" + r[2]);
						return null;
					}
				}
				return null;
			};
			var str = document.location.hash.substr(2);
			var value = getValue(name, str);
			if (value == null) {
				str = document.location.search.substr(1);
				value = getValue(name, str);
			}
			return value;
		},
		//		设置URL参数
		setParam: function(name, value) {
			var setValue = function(name, value, str) {
				if ((typeof name) === "object") {
					str = value;
					value = name;
					for (var key in value) {
						str = setValue(key, value[key], str);
					}
					return str;
				} else {
					var prefix = str ? "&" : "";
					var reg = new RegExp("(^|!|&|\\?)" + name + "=([^&]*)(&|$)");
					r = str.match(reg);
					// value = encodeURIComponent(value);
					if (r) {
						if (r[2]) {
							var newValue = r[0].replace(r[2], value);
							str = str.replace(r[0], newValue);
						} else {
							var newValue = prefix + name + "=" + value + "&";
							str = str.replace(r[0], newValue);
						}
					} else {
						var newValue = prefix + name + "=" + value;
						str += newValue;
					}

					return str;
				}
			}
			var search = document.location.search.substr(1);
			search = setValue(name, value, search);
			if (history.replaceState) {
				history.replaceState({}, null, "?" + search);
			} else {
				console.error("history.replaceState:" + history.replaceState);
			}
		},
		//		删除URL参数
		removeParam: function(name) {
			var search = document.location.search.substr(1);
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			r = search.match(reg);
			if (r) {
				if (r[1] && r[3]) {
					search = search.replace(r[0], '&');
				} else {
					search = search.replace(r[0], '');
				}
			}
			if (history.replaceState) {
				history.replaceState({}, null, "?" + search);
			} else {
				console.error("history.replaceState:" + history.replaceState);
			}
		},
		//		设置本地缓存
		setLocalData: function(key, val) {
			localStorage.setItem(key, JSON.stringify(val))
		},
		//		获取本地缓存
		getLocalData: function(key) {
			var value = localStorage.getItem(key);
			if (typeof value != 'string') {
				return undefined
			}
			try {
				return JSON.parse(value)
			} catch (e) {
				return value || undefined
			}
		},
		//		删除本地缓存
		removeLocalData: function(key) {
			localStorage.removeItem(key);
		},
		//		清空本地缓存
		clearLocalData: function() {
			localStorage.clear();
		},
		//		设置本地缓存
		setSessionData: function(key, val) {
			sessionStorage.setItem(key, JSON.stringify(val))
		},
		//		获取本地缓存
		getSessionData: function(key) {
			var value = sessionStorage.getItem(key);
			if (typeof value != 'string') {
				return undefined
			}
			try {
				return JSON.parse(value)
			} catch (e) {
				return value || undefined
			}
		},
		//		删除本地缓存
		removeSessionData: function(key) {
			sessionStorage.removeItem(key);
		},
		//		验证正则
		checkCarNumber: function(value) {
			var reg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{7}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;
			return reg.test(value);
		},
		checkPhoneNumber: function(value) {
			var reg = /^\d{11}$/;
			return reg.test(value);
		},
		checkPersonNumber: function(idCard) {
			//15位和18位身份证号码的正则表达式
			var regIdCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
			return regIdCard.test(idCard);
		},
		checkChinese: function(value) {
			//验证汉字
			var reg = /(^[\u4E00-\u9FA5]+)$/;
			return reg.test(value);
		},
		checkData: function(value) {
			var reg = /^([A-Z0-9a-z]+)$/;
			return reg.test(value);
		},
		//验证车架号
		checkVinNo: function(value) {
			var reg = /^([A-Z0-9a-z]{17})$/;
			return reg.test(value);
		},
		//验证油卡(中石化：以100011开头的19位卡号、中石油：以90开头的16位卡号）
		checkOilNumber: function(value) {
			var reg = /(^((100011)[0-9]{13})$)|(^((90)[0-9]{14})$)/;
			return reg.test(value);
		},
		//微信环境
		checkWXAgent: function() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				return true;
			} else {
				return false;
			}
		},
		//支付宝环境
		checkAliAgent: function() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/AlipayClient/i) == "alipayclient") {
				return true;
			} else {
				return false;
			}
		},
		//招商银行APP
		checkCMB: function() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MPBank/i) == "mpbank") {
				return true;
			} else {
				return false;
			}
		},
		//苹果手机
		checkIOS: function() {
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			return isiOS;
		},
		//获取form参数
		getFormData: function(selector) {
			var data = {};
			var inputALL = document.querySelector(selector).elements;
			for (var i = 0; i < inputALL.length; i++) {
				var item = inputALL[i];
				var key = item.name || item.id;
				if (key) {
					var type = item.type;
					if (type == "checkbox") {
						if (item.checked) {
							if (data[key]) {
								data[key] += "," + (item.value);
							} else {
								data[key] = item.value
							}
						}
					} else if (type == 'radio') {
						if (item.checked) {
							data[key] = item.value;
						}
					} else if (type != 'submit' && type != 'button') {
						data[key] = item.value;
					}
				}
			}

			return data;
		},
		//关闭 webview 页面
		closeWebView: function() {
			try {
				AlipayJSBridge.call('closeWebview'); //支付宝 关闭窗口;
			} catch (e) {
				try {
					WeixinJSBridge.call('closeWindow'); //微信
				} catch (e) {
					window.history.back();
				}
			}
		},
		//浮点数相乘
		floatMul: function(arg1, arg2) {
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length;
			} catch (e) {}
			try {
				m += s2.split(".")[1].length;
			} catch (e) {}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		},
		//浮点数相除	
		floatDiv: function(arg1, arg2) {
			var t1 = 0,
				t2 = 0,
				r1, r2;
			try {
				t1 = arg1.toString().split(".")[1].length
			} catch (e) {}
			try {
				t2 = arg2.toString().split(".")[1].length
			} catch (e) {}
			with(Math) {
				r1 = Number(arg1.toString().replace(".", ""))
				r2 = Number(arg2.toString().replace(".", ""));
				var value = this.floatMul((r1 / r2), Math.pow(10, t2 - t1));
				return value;
			}
		},
		//整数转汉字
		numberConvertChinese: function(number) {
			var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
			var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
			var chnUnitChar = ["", "十", "百", "千"];

			var SectionToChinese = function(section) {
				var strIns = '',
					chnStr = '';
				var unitPos = 0;
				var zero = true;
				while (section > 0) {
					var v = section % 10;
					if (v === 0) {
						if (!zero) {
							zero = true;
							chnStr = chnNumChar[v] + chnStr;
						}
					} else {
						zero = false;
						strIns = chnNumChar[v];
						strIns += chnUnitChar[unitPos];
						chnStr = strIns + chnStr;
					}
					unitPos++;
					section = Math.floor(section / 10);
				}
				return chnStr;
			}
			var num2Cn = function(num) {
				var unitPos = 0;
				var strIns = '',
					chnStr = '';
				var needZero = false;
				if (num === 0) {
					return chnNumChar[0];
				}
				while (num > 0) {
					var section = num % 10000;
					if (needZero) {
						chnStr = chnNumChar[0] + chnStr;
					}
					strIns = SectionToChinese(section);
					strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
					chnStr = strIns + chnStr;
					needZero = (section < 1000) && (section > 0);
					num = Math.floor(num / 10000);
					unitPos++;
				}
				return chnStr;
			}
			return num2Cn(number)
		},
		//本地图片处理
		getObjectURL: function(file) {
			var url = null;
			if (window.createObjectURL != undefined) { // basic
				url = window.createObjectURL(file);
			} else if (window.URL != undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL != undefined) { // web_kit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		},
		convertImgToBase64type: function(url, callback, outputFormat) {
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var img = new Image;
			img.crossOrigin = 'Anonymous';
			img.onload = function() {
				var width = img.width;
				var height = img.height;
				// 按比例压缩4倍
				var bili = Math.round(width / 450);
				bili = bili ? bili : 1;
				var rate = 1 / bili;
				canvas.width = width * rate;
				canvas.height = height * rate;
				ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
				var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
				callback.call(this, dataURL);
				canvas = null;
			}
			img.src = url;
		},
		//定位地址
		getLocation: function(callback) {
			var BMapLoaction = function() {
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(pos) {
					var location = {},
						addr = pos.address;
					if (pos) {
						location = {
							city: addr.city,
							address: (addr.district + addr.street + addr.street_number),
							latitude: pos.latitude,
							longitude: pos.longitude,
						}
						if (!location.address) {
							var myGeo = new BMap.Geocoder();
							myGeo.getLocation(pos.point, function(results) {
								var addr = results.addressComponents;
								location.address = (addr.district + addr.street + addr.streetNumber);
								callback && callback(location);
							});
						} else {
							callback && callback(location);
						}
					}

				});
			};
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(data) {
					var lng = data.coords.longitude;
					var lat = data.coords.latitude;
					var convertor = new BMap.Convertor();
					var points = [new BMap.Point(lng, lat)];
					var source = 1;
					if (that.checkAliAgent()) {
						source = 3;
					}
					convertor.translate(points, source, 5, function(result) {
						if (result.status == 0) {
							var myGeo = new BMap.Geocoder();
							myGeo.getLocation(result.points[0], function(results) {
								var addr = results.addressComponents;
								var location = {
									city: addr.city,
									address: (addr.district + addr.street + addr.streetNumber),
									latitude: results.point.lat,
									longitude: results.point.lng,
								}
								callback && callback(location);
							});
						} else {
							BMapLoaction();
						}
					});
				}, function(e) {
					BMapLoaction();
				});
			} else {
				BMapLoaction();
			}
		},
		//弹出框 添加common.css
		showLoading: function(content) {
			var dom = ' <div class="layer-wrap">\n';
			dom += ' 	<div class="layer-content">\n';
			dom += ' 		<div class="layer-loading">\n';
			dom += ' 			<div class="layer-icon">\n';
			dom += ' 				<div class="layer-leaf layer-leaf-0"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-1"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-2"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-3"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-4"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-5"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-6"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-7"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-8"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-9"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-10"></div>\n';
			dom += ' 				<div class="layer-leaf layer-leaf-11"></div>\n';
			dom += ' 			</div>\n';
			dom += ' 			<div class="layer-load-msg">' + (content ? content : '加载中') + '</div>\n';
			dom += ' 		</div>\n';
			dom += ' 	</div>\n';
			dom += ' </div>\n';
			var layer = document.createElement("div");
			layer.className = "layer layer-toast";
			layer.innerHTML = dom;
			document.querySelector("body").appendChild(layer);
			setTimeout(function() {
				layer.className = "layer layer-toast layer-show";
			}, 20);
		},
		hideLoading: function() {
			var layer = document.querySelector(".layer-toast");
			if (layer) {
				layer.parentNode.removeChild(layer);
			}
		},
		showTip: function(content) {
			var dom = ' <div class="layer-shadow" style="background:rgba(0,0,0,0);"></div>\n';
			dom += ' <div class="layer-wrap">\n';
			dom += ' 	<div class="layer-content">\n';
			dom += ' 		<div class="layer-tip">' + content + '</div>\n';
			dom += ' 	</div>\n';
			dom += ' </div>\n';
			var layer = document.createElement("div");
			layer.className = "layer";
			layer.innerHTML = dom;
			document.querySelector("body").appendChild(layer);
			layer.querySelector(".layer-wrap").addEventListener("click", function() {
				layer.parentNode.removeChild(layer);
			});
			setTimeout(function() {
				layer.className = "layer layer-show";
			}, 20);
			setTimeout(function() {
				if (layer.parentNode) {
					layer.parentNode.removeChild(layer);
				}
			}, 2000)
		},
		showAlert: function(content, title, success, btn) {
			if (typeof title == "function") {
				btn = success;
				success = title;
				title = '提示';
			}
			var dom = ' <div class="layer-shadow"></div>\n';
			dom += ' <div class="layer-wrap">\n';
			dom += ' 	<div class="layer-content">\n';
			dom += ' 		<div class="layer-inner">\n';
			if (title) {
				dom += ' 			<h3 class="layer-title">' + (title ? title : '') + '</h3>\n';
			} else {
				dom += ' 			<h3 class="layer-title" style="height:30px;"></h3>\n';
			}
			dom += ' 			<div class="layer-message">' + content + '</div>\n';
			dom += ' 			<div class="layer-btn">\n';
			dom += ' 				<button class="layer-success" style="width:100%;">' + (btn ? btn : '确定') + '</button>\n';
			dom += ' 			</div>\n';
			dom += ' 		</div>\n';
			dom += ' 	</div>\n';
			dom += ' </div>\n';
			var layer = document.createElement("div");
			layer.className = "layer";
			layer.innerHTML = dom;
			document.querySelector("body").appendChild(layer);
			layer.querySelector(".layer-success").addEventListener("click", function() {
				layer.parentNode.removeChild(layer);
				success && success();
			});
			setTimeout(function() {
				layer.className = "layer layer-show";
			}, 20)
		},
		showConfirm: function(content, title, success, cancel, btn) {
			if (typeof title == "function") {
				btn = cancel;
				cancel = success;
				success = title;
				title = "提示";
			}
			if (typeof cancel != "function") {
				btn = cancel;
				cancel = null;
			}
			if (!btn) {
				btn = ["", ""];
			}

			var dom = ' <div class="layer-shadow"></div>\n';
			dom += ' <div class="layer-wrap">\n';
			dom += ' 	<div class="layer-content">\n';
			dom += ' 		<div class="layer-inner">\n';
			dom += ' 			<h3 class="layer-title">' + title + '</h3>\n';
			dom += ' 			<div class="layer-message">' + content + '</div>\n';
			dom += ' 			<div class="layer-btn">\n';
			dom += ' 				<button class="layer-cancel">' + (btn[0] ? btn[0] : '取消') + '</button><button class="layer-success">' + (btn[1] ? btn[1] : '确定') + '</button>\n';
			dom += ' 			</div>\n';
			dom += ' 		</div>\n';
			dom += ' 	</div>\n';
			dom += ' </div>\n';
			var layer = document.createElement("div");
			layer.className = "layer";
			layer.innerHTML = dom;
			document.querySelector("body").appendChild(layer);
			layer.querySelector(".layer-success").addEventListener("click", function() {
				layer.parentNode.removeChild(layer);
				success && success();
			});
			layer.querySelector(".layer-cancel").addEventListener("click", function() {
				layer.parentNode.removeChild(layer);
				cancel && cancel();
			});
			setTimeout(function() {
				layer.className = "layer layer-show";
			}, 20)
		},
		//base64加密 可用于汉字分享
		base64Encode: function(input) {
			var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			// private method for UTF-8 encoding
			if (!input) {
				return '';
			}
			var _utf8_encode = function(string) {
				string = string.replace(/\r\n/g, "\n");
				var utftext = "";
				for (var n = 0; n < string.length; n++) {
					var c = string.charCodeAt(n);
					if (c < 128) {
						utftext += String.fromCharCode(c);
					} else if ((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					} else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}

				}
				return utftext;
			}
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = _utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		},
		//base64解密
		base64Decode: function(input) {
			var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			// private method for UTF-8 decoding
			var _utf8_decode = function(utftext) {
				var string = "";
				var i = 0;
				var c = c1 = c2 = 0;
				while (i < utftext.length) {
					c = utftext.charCodeAt(i);
					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					} else if ((c > 191) && (c < 224)) {
						c2 = utftext.charCodeAt(i + 1);
						string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
						i += 2;
					} else {
						c2 = utftext.charCodeAt(i + 1);
						c3 = utftext.charCodeAt(i + 2);
						string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						i += 3;
					}
				}
				return string;
			}
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		},
	}
	return commonObject;
})();