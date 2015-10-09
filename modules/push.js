var pushbots = require('pushbots');

var Pushbots = new pushbots.api({
	id:'561007cb177959410a8b456b',
	secret:'ad7eed84144a4ab897433650365e329a'
});


exports.sendPush = function(msg, title){
	Pushbots.setMessage(msg ,1);
	Pushbots.sendByTags(["yes"]);
	Pushbots.customNotificationTitle(title);
	Pushbots.push(function(response){
		console.log(response);
	});
}

