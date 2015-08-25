var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/users.db');

db.run("CREATE TABLE if not exists `user_info` (`id`INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,`name`TEXT UNIQUE,`hash`TEXT,`rights`INTEGER,`verified`INTEGER)");



exports.CreateUser = function (username, password, salt, verification, callback) {
	db.run("INSERT INTO `user_info` (id, name, hash, rights, verified) VALUES (?,?,?,?,?)", [null,username,password,0,verification], function (err) {
		callback(err);
	});
}

exports.CreateRedactor = function (username, password, salt, verification, callback) {
	console.log("Creating user: " + username);
	db.run("INSERT INTO `user_info` (id, name, hash, rights, verified) VALUES (?,?,?,?,?)", [null,username,password,1,verification], function (err) {
		callback(err);
	});
}

exports.CreateAdmin = function (username, password, salt, verification, callback) {
	console.log("Creating user: " + username);
	db.run("INSERT INTO `user_info` (id, name, hash, rights, verified) VALUES (?,?,?,?,?)", [null,username,password,2,verification], function (err) {
		callback(err);
	});
}


exports.VerifyUser = function (username, password, salt, callback) {
	db.get("SELECT * from user_info WHERE name='" + username + "' AND hash='" + password + "' LIMIT 1", function (err, row) {
		callback(row);
	});
}

