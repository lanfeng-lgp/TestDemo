//html5 web woker
var timer = null;
onmessage = function(evt) {
	var evt;
	result = evt.data;
	if (result.type && result.type == 'taskRemind') {
		if (!timer) {
			taskRemind();
		}
	} else {
		clearInterval(timer);
		timer = null;
		this.close();
	}
}
//订单提醒
function taskRemind() {
	var count = 0,
		timer = null;
	timer = setInterval(function() {
		count = count + 1;
		postMessage(count);
	}, 1000)
}