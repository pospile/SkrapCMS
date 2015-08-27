var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/article.db');
var user = require("./users.js");

db.run("CREATE TABLE if not exists `article` (`id`INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,`name`TEXT UNIQUE,`data`TEXT,`date`TEXT, `author`INTEGER)");

exports.GetArticle = function (id, callback) {
	db.get('SELECT * FROM article WHERE id="0"', function (err, row) {
		user.GetUserById(row.id, function(name){
			var article = {"article": {"id": row.id, "name": row.name, "date": row.date, "author": name, "author_id": row.author, "content": row.data}};
			callback(err, article);
		});
	});
};