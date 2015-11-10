var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.js');
var template = require("./template.js");
var database = require("./database.js");
var log = require("./log.js");
var colors = require('colors');
var modules = require("./modules.js");
var security = require('./security.js');
var token = require('./database/token.js');
var user = require('./database/users.js');
var article = require('./database/articles.js');
var dateFormat = require('dateformat');
var multer  = require('multer');
var upload = multer({ dest: '././uploads/' });
var fs = require('fs');
var push = require('./push.js');
var Jimp = require("jimp");
var likes = require('./database/likes.js');
var mime = require('mime');

exports.initialize = function (param) {
	Start(param);
};


function Start (param)
{
	var app = express();
	


	app.use(bodyParser.urlencoded({ extended: false }));



	app.use('/api/file', express.static('././uploads/converted'));

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

		var now = new Date();
		console.log('  DONE: Skrap is running at http://localhost:'.magenta + colors.green(port) + "   " + colors.green(dateFormat(now, "dd.mm.yyyy - HH:MM:ss")));


		if (param == "test" || param == "files" || param == "pages")
		{
			console.log("  Access to these files is limited: " + colors.red(config.disallowed_files));
			console.log("  These modules are installed: " + colors.gray("skrap_core/" + modules.modules));
			console.log("  Modules will not be used on these pages: " + colors.yellow(config.disallowed_modules));
		}

	});

	/*
	app.use(function (req, res, next) {
		console.log('Time:', Date.now());
		console.log(req.originalUrl);
		next();
	});
	*/


	/*
		DEFAULT SYSTEM ROUTES
	 */

	/*
	app.get('/', function (req, res) {
		template.ReturnPage(config.templatePath + "/" + config.theme_index, {"type": "index", "id": "index"}, function (err, data) {
			console.log("Requested index directly");
			res.send(data);
		});
	});
	app.get(config.article_url + '/:number', function (req, res) {
		template.ReturnPage(config.templatePath + "/" + config.theme_article, {"type": "article", "id": req.params.number}, function (err, data) {
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
					console.log("Requested: " + req.params.path);
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
	*/



	/*
			API ROUTES -
			(SECURE API GATEWAY BELOW)
	 */


	if (config.ExposeAPI)
	{
		if (param == "test")
		{
			console.log("  Preparing secure API for this server");
		}


		app.get('/api/version', function(req, res) {
			res.json({"version": 6});
		});

		app.get('/api/update.apk', function(req, res) {
			res.setHeader("Content-Type", mime.lookup("/system.apk"));
			res.sendFile('/home/pi/projects/porngram/system.apk');
		});

		app.get('/api/status', function (req, res) {
			res.json({"api": "ok"});
		});

		app.get('/api/disconnect', function (req, res) {
			res.json({"device": "no"});
		});

		/*

			USER ACC APIS

		*/
		app.post('/api/user/create',function(req,res){
			var username	=	req.body.name;
			var password	=	req.body.pass;

			database.CreateUser(username, password, function(data){
				if (data)
				{
					console.log(data);
					res.json({"done": false, "details": data});
				}
				else
				{
					res.json({"done": true});
				}
			});
		});

		app.post('/api/user/refresh',function(req,res){
			var username	=	req.body.name;
			var token_remote	=	req.body.token;

			security.token_verify(token_remote, username, "my_unique", function(data){
				res.json(data);
			});
		});

		app.post('/api/user/token',function(req,res){
			var username	=	req.body.name;
			var password	=	req.body.pass;

			security.SignToken(username, password, "my_unique", function(data){
				console.log("Unique token generated:" + data);
				res.json({"token": data});
			});
		});

		app.post('/api/user/login',function(req,res){
			var username	=	req.body.name;
			var password	=	req.body.pass;

			security.SignToken(username, password, "my_unique", function(data){
				console.log("Unique token generated:" + data);
				user.GetUserID(username, function(user){
					token.AddToken(user.id, data, function(err){
						if (err)
						{
							console.log(err);
							res.json({"login": false});
						}
						else
						{
							res.json({"login": true, "token": data});
						}
					});
				});
			});
		});

		app.post('/api/user/list', function (request, response) {
			var token	=	request.body.token;
		});


		/*
				CONTENT DELIVERY APIs
		 */

		app.post('/api/articles', function (req, res) {
			var max	=	req.body.limit;
			var offset = req.body.offset;

			article.GetIndexArticles(100, 0, function(data){
				res.json(data)
			});
		});
		app.get('/api/articles', function (req, res) {
			var max	=	req.body.limit;
			var offset = req.body.offset;

			article.GetIndexArticles(100, 0, function(data){
				res.json(data);
			});
		});

		app.get('/api/articles/count', function (req, res) {
			article.GetCount(function(count) {
				res.send(count);
			});
		});

		/*
				CONTENT RECEIVING APIs
		 */

		app.post('/api/create', upload.single('photos'), function (req, res) {

			var data = 	req.body.data;
			var name = req.body.name;
			var image = req.file;

			console.log(image);

			var now = new Date();


			fs.rename(image.path, image.destination + "/converted/" + image.originalname, function (err) {
				if (!err){
					push.sendPush("New post was created at PornGram!", "Post: " + name + " was created." );
					console.log(image.originalname);
					var resulted = new Jimp(image.destination + "/converted/" + image.originalname, function (err, result) {
						console.log(result.bitmap.width + " " + result.bitmap.height);
						if (result.bitmap.width > 4000){
							result.resize( 2048, Jimp.AUTO ).write(image.destination + "/converted/" + image.originalname);
						}
						else if (result.bitmap.height > 4000)
						{
							result.resize( Jimp.AUTO, 2048 ).write(image.destination + "/converted/" + image.originalname);
						}
					});
				}
				else
				{
					res.send(err);
				}
			});



			article.CreateArticle(name, 2, dateFormat(now, "dd.mm.yyyy"),data,"skrap.xyz/api/file/" + image.originalname, function (data) {
				console.log(data);
			});

			res.send(now);

		});


		app.post('/api/likes', function (req, res) {
			var id = req.body.id;
			var token = req.body.token;

			if (token != undefined)
			{
				likes.IncreaseLikes(id, function(data){
					res.json({"done": data});
				});
			}
			else
			{
				res.json({"status": "invalid"});
			}
		});

		app.get('/api/likes/:id', function (req, res) {
			var id	=	req.params.id;

			likes.GetLikesForArticle(id, function(data){
				if (data.id == 'null')
				{
					res.json(data);
				}
				else
				{
					res.json(data);
				}
			});
		});




	}







	/*
			IF REQUEST IS NOT API OR FILE, DENY IT WITH 404
	 */
	app.use(function(req, res, next) {
		template.ReturnStaticPage(config.templatePath + "/404.html", function (err, data) {
			res.status(404).send(data);
		});
	});

}
