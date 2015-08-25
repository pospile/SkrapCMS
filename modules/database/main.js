var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/main.db');

db.run("CREATE TABLE if not exists `blog` (`blog_name`TEXT UNIQUE, `name`TEXT)");

exports.SetBlogName = function (name) {
	db.run("INSERT OR IGNORE INTO `blog` (blog_name, name) VALUES (?,?)", ["blog",name], function (err) {
		if (err)
		{
			console.log("Jméno blogu nastaveno");
		}
		db.run("UPDATE blog SET blog_name = 'blog', name = ? WHERE blog_name='blog'", [name], function (err) {
			console.log("Jméno blogu nastaveno");
		})
	});
}

exports.BlogName = function (callback) {
	db.get("SELECT * from blog WHERE blog_name='blog'", function (err, data) {
		if (err)
			console.log(err);
		else
			callback(data.name);
	})
}