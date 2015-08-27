var fs = require("fs");
var config = require("./config.js");


var ReadStaticFile = function (path,callback) 
{
	fs.readFile(path, {"encoding": "utf-8"}, function (err, data) {
	  if (err)
	  {
		  console.log(err);
		  fs.readFile(config.templatePath + "/" + config.theme_404, {"encoding": "utf-8"}, function (err, data){
			callback(err, data);
		  });
	  }
	  else
	  {
		  callback(err, data);
	  }
	});
};

exports.ReadStaticFile = function (path,callback) {
	ReadStaticFile(path, callback);
};