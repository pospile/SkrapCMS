var fs = require("fs");
var config = require("./config.js");
var modules = require("./modules.js");
var cheerio = require('cheerio');
var minify = require('html-minifier').minify;


var ReadStaticFile = function (path,callback) 
{
	fs.readFile(path, {"encoding": "utf-8"}, function (err, data) {
	  if (err)
	  {
		  //console.log(err);
		  fs.readFile(config.templatePath + "/" + config.theme_404, {"encoding": "utf-8"}, function (error, data){
			CheckForModules(err, config.templatePath + "/" + config.theme_404, data, callback);
		  });
	  }
	  else
	  {
		  CheckForModules(err, path, data, callback);
	  }
	});
};

var CheckForModules = function (err, path, data, callback) {
	var cancontinue = true;
	var last = path.substring(path.lastIndexOf("/") + 1, path.length).split(".")[0];

	config.disallowed_modules.forEach(function(token) {
		if (token == last)
		{
			console.log("ERR: " + token);
			cancontinue = false;
			callback(err, data);
			return;
		}
	});

	if (cancontinue)
	{
		InsertModules(err, data, callback);
	}
}

var InsertModules = function (err, data, callback) {

	$ = cheerio.load(data);
	modules.returnModules(function(number){
		for (i = 0; i < number; i++)
		{
			/*
			console.log(i);
			modules.returnSpecificModule(i, function(css, js){
				console.log("done");
			});
			*/

			modules.returnSpecificModule(i, function(css, js){
				css.forEach(function(token){
					//console.log(token);
					$('head').append('<link rel="stylesheet" href="' + token + '">');
				});
				js.forEach(function(token) {
					//console.log(token);
					$('body').append('<script src="'+ token +'"></script>');
				});
			});

		}
		var data = minify($.html(), {
			removeAttributeQuotes: true,
			removeComments: true,
			removeCommentsFromCDATA: true,
			removeCDATASectionsFromCDATA: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			removeOptionalTags: true
		});

		if (config.optimize_site)
		{
			callback(err, data);
		}
		else
		{
			callback(err, $.html());
		}

	});
}

exports.ReadStaticFile = function (path,callback) {
	ReadStaticFile(path, callback);
};