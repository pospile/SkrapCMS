var sqlite3 = require('sqlite3').verbose();
var security = require('../security.js');
var db = new sqlite3.Database('./database/tokens.db');

db.run("CREATE TABLE if not exists `tokens` (`id`INTEGER,`token`TEXT UNIQUE)");


exports.AddToken = function (id, token, callback) {
	console.log("Saving token for: " + id + " value: " + token);
	db.run("INSERT INTO `tokens` (id, token) VALUES (?,?)", [id,token], function (err, row) {
		console.log(err + row);
		callback(err);
	});
}
exports.GetToken = function (id, callback) {
	db.all("SELECT token from tokens WHERE id='" + id + "'", function (err, row) {
		//console.log(row);
		callback(row);
	});
}