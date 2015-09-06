var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/article.db');
var user = require("./users.js");

db.run("CREATE TABLE if not exists `article` (`id`INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,`name`TEXT UNIQUE,`data`TEXT,`index_page` TEXT, `date`TEXT, `author`INTEGER, `author_name`TEXT)");

exports.GetArticle = function (id, callback) {
	db.get('SELECT * FROM article WHERE id="'+ id +'"', function (err, row) {
		if (row == undefined)
		{
			console.log(err);
			var article = {"article": {"id": 'null', "name": 'null', "date": 'null', "author": 'null', "author_id": 'null', "content": 'null'}};
			callback("404", article);
		}
		else
		{
			user.GetUserById(row.author, function(name){
				var article = {"article": {"id": row.id, "name": row.name, "date": row.date, "author": name.name, "author_id": row.author, "content": row.data}};
				console.log(row.name);
				callback(err, article);
			});
		}
	});
};

exports.GetIndexArticles = function (limit, callback){
	db.all('SELECT * FROM article LIMIT ' + limit, function (err, rows) {
		callback(rows);
	});
};