var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/article.db');
var user = require("./users.js");

db.run("CREATE TABLE if not exists `article` (`id`INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,`name`TEXT UNIQUE,`image_url`TEXT UNIQUE, `data`TEXT,`index_page` TEXT, `date`TEXT, `author`INTEGER, `author_name`TEXT, `url`TEXT)");

exports.GetArticle = function (id, callback) {
	db.get('SELECT * FROM article WHERE url="'+ id +'"', function (err, row) {
		if (row == undefined)
		{
			console.log(err);
			var article = {"article": {"id": 'null', "name": 'null', "date": 'null', "author": 'null', "author_id": 'null', "content": 'null'}};
			callback("404", article);
		}
		else
		{
			user.GetUserById(row.author, function(name){
				var article = {"article": {"id": row.id, "name": row.name, "date": row.date, "author": name.name, "author_id": row.author, "content": row.data, "image_url": row.image_url}};
				console.log(row.name);
				callback(err, article);
			});
		}
	});
};

exports.GetIndexArticles = function (limit, offset, callback){
	db.all('SELECT * FROM article ORDER BY id DESC LIMIT ' + limit, function (err, rows) {
		if (err)
		{
			rows = "error";
			console.log("ERROR in database query!!!");
			return;
		}
		callback(rows);
	});
};


exports.CreateArticle = function (name, author_id, date, data, image, callback) {
	if (name != undefined && author_id != undefined && author_id != undefined, data != undefined)
	{
		var index_data = data.substring(0, 250);
		var author_name = user.GetUserById(author_id, function(user){
			if (user.name != undefined && user.rights > 0)
			{
				console.log(user.name);
				console.log("Creating article: " + name);
				db.run("INSERT INTO `article`(`name`,`data`,`index_page`,`date`,`author`,`author_name`, `image_url`) VALUES (?,?,?,?,?,?,?);", [name,data,index_data,date, author_id, user.name, image], function (err) {
					if (err){
						console.log(err);
						callback(false);
					}
					else{
						console.log("SUCCESS");
						callback(true);
					}
				});
			}
			else
			{
				callback(false);
				console.log("Probl�m s u�ivatelem: " + user.name + " with rights: " + user.rights);
			}
		});
	}
	else
	{
		callback(false);
		console.log("Probl�m s vypln�n�mi daty.");
	}
}