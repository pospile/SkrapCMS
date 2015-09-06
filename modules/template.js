var file = require("./file.js");
var article = require("./database/articles.js");
var Handlebars = require("handlebars");
var log = require("./log.js");
var config = require("./config.js");


var ReturnStaticPage = function(page, callback) {
	file.ReadStaticFile(page, function (err, data) {
		callback(err, data);
	});
};
var ReturnPage = function(page, options, callback) {
	file.ReadStaticFile(page, function (err, data) {
		//log.write("Page readen: " + data);
		var template = Handlebars.compile(data);
		BuildFromData(template, options, callback);
	});
};


var BuildFromData = function (page, options, callback) {
	console.log(options);
	if (options.type == "article")
	{

		article.GetArticle(options.id, function(err, data){
			if (err == "404")
			{
				console.log(err);
				ReturnStaticPage(config.templatePath + "/" + config.theme_404, function(err, data){
					callback("404", data);
				});
			}
			else
			{
				log.write("Database return: " + data);
				var result = page(data);
				//log.write("Page created: " + result);
				callback(null, result);
			}
		});
	}
	else if (options.type == "index")
	{
		article.GetIndexArticles(config.index_article_limit, function(rows){
			var result = page({article: rows});
			callback(null, result);
		});
	}
	else if (options.type == "user")
	{

	}
};

exports.ReturnPage = function (page, options, callback) {
	console.log("Article id: " + options.id);
	if (options.id == undefined)
	{
		ReturnStaticPage(config.templatePath + "/" + config.theme_404, callback);
	}
	ReturnPage(page, options, callback);
};
exports.ReturnStaticPage = function (page, callback) {
	ReturnStaticPage(page, callback);
};
