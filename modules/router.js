var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.js');
var template = require("./template.js");
var database = require("./database.js");


exports.initialize = function () {
	Start();
	
}


function Start (app)
{
	var app = express();
	


	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.static(config.templatePath));
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	var port = config.port;

	var server = app.listen(port, function () {
		console.log('DONE: SCMS is running at http://localhost:%s'.green, port);
		database.BlogName(function (name) {
			console.log("Blog name: " + name);
		});
	});

	app.get('/', function (req, res) {
		template.ReturnPage(config.templatePath + "/index.html", function (data) {
			res.send(data);
		});
	});
	app.get('/:path', function (req, res) {
		template.ReturnPage("template/default" + req.path, function (data) {
			res.send(data);
		});
	});

}
