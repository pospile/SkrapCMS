var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/likes.db');

db.run("CREATE TABLE if not exists `likes` (`id`INTEGER UNIQUE, `from` INTEGER, `count`INTEGER)");

exports.GetLikesForArticle = function (id, callback) {
	//console.log(id);
	var sql = "SELECT * FROM likes WHERE id=" + id;
	db.get(sql, function (err, row) {
		//console.log(row);
		if (row == undefined)
		{
			//console.log(err);
			var likes = {"id": id, "count": 0};
			callback(likes);
		}
		else
		{
			var likes = {"id": row.id, "count": row.count};
			callback(likes);
		}
	});
};

exports.IncreaseLikes = function (id, callback) {
	db.get('SELECT * FROM likes WHERE id="'+ id +'"', function (err, row) {
		if (row)
		{
			db.get('UPDATE likes SET count = count + 1 WHERE id ="'+ id +'"', function (err, row) {
				console.log("Error: " + err);
				if (err)
				{
					callback(false);
				}
				else
				{
					callback(true);
				}
			});
		}
		else
		{
			db.run("INSERT INTO `likes`(`id`,`from`,`count`) VALUES (?,?,?);", [id,"anonymous",1], function (err) {
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
	});
}
