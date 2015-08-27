var fs = require("fs");
var config = require("./config.js");


exports.write = function(data)
{
	var now = new Date();
	var date = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	fs.appendFile(config.log, "\n" + date + ": " + data, function (err) {
		if (err)
		{
			console.log(err);
		}
	});
};