var fs = require("fs");


var ReadStaticFile = function (path,callback) 
{
	fs.readFile(path, {"encoding": "utf-8"}, function (err, data) {
	  if (err) console.log(err);
	  callback(data);
	});
}

var BuildTemplate = function (document) 
{
	
}

var GatherData = function (about) 
{
	
}

exports.ReadStaticFile = function (path,callback) {
	ReadStaticFile(path, callback);
}