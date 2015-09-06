var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.js');
var template = require("./template.js");
var database = require("./database.js");
var log = require("./log.js");
var colors = require('colors');
var modules = require("./modules.js");

exports.initialize = function (param) {
	Start(param);
};


function Start (param)
{
	var app = express();
	


	app.use(bodyParser.urlencoded({ extended: false }));




	var theme_settings = require("../" + config.templatePath + "/config.json");
	theme_settings = theme_settings.static_files;

	theme_settings.forEach(function(path){
		if (param == "test" || param == "using")
		{
			console.log("  Using: " + colors.yellow(config.templatePath + path) + " as static service.");
		}
		app.use(express.static(config.templatePath + path));
	});

	console.log("\n");

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		/*console.log(req);*/
		next();
	});

	var port = config.port;


	var server = app.listen(port, function () {
		console.log('  DONE: Skrap is running at http://localhost:'.magenta + colors.green(port));


		if (param == "test" || param == "files" || param == "pages")
		{
			console.log("  Access to these files is limited: " + colors.red(config.disallowed_files));
			console.log("  These modules are installed: " + colors.gray("skrap_core/" + modules.modules));
			console.log("  Modules will not be used on these pages: " + colors.yellow(config.disallowed_modules));
		}
	});



	app.get('/', function (req, res) {
		template.ReturnPage(config.templatePath + "/" + config.theme_index, {"type": "index", "id": "index"}, function (err, data) {
			console.log("Requeted index directly");
			res.send(data);
		});
	});
	app.get('/article/:number', function (req, res) {
		template.ReturnPage(config.templatePath + "/" + config.theme_article, {"type": "article", "id": req.params.number}, function (err, data) {
			console.log("Requested article: " + req.params.number);
			res.send(data);
		});
	});
	app.get('/user/:number', function (req, res) {
		template.ReturnPage(config.templatePath + "/" + config.theme_user, {"type": "user", "id": req.params.number}, function (err, data) {
			console.log("Requested user account: " + req.params.number);
			res.send(data);
		});
	});
	app.get('/:path', function (req, res) {
		var can_continue = true;
		config.disallowed_files.forEach(function(token){
			if(token == req.params.path)
			{
				can_continue = false;
			}
		});
		if (can_continue)
		{
			template.ReturnStaticPage(config.templatePath + "/" + req.params.path + ".html", function (err, data) {
				if(err)
				{
					console.log("404: " + err.code);
					res.status(404).send(data);
				}
				else
				{
					res.send(data);
				}
			});
		}
		else
		{
			template.ReturnStaticPage(config.templatePath + "/404.html", function (err, data) {
				console.log("404");
				res.status(404).send(data);
			});
		}
	});
	app.use(function(req, res, next) {
		template.ReturnStaticPage(config.templatePath + "/404.html", function (err, data) {
			console.log("404");
			res.status(404).send(data);
		});
	});

}
