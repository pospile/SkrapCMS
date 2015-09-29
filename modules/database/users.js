var sqlite3 = require('sqlite3').verbose();
var security = require('../security.js');
var db = new sqlite3.Database('./database/users.db');

db.run("CREATE TABLE if not exists `user_info` (`id`INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,`name`TEXT UNIQUE,`hash`TEXT,`rights`INTEGER,`verified`INTEGER)");



exports.CreateUser = function (username, password, verification, callback) {
	security.Encrypt(password, function(data){
		db.run("INSERT INTO `user_info` (id, name, hash, rights, verified) VALUES (?,?,?,?,?)", [null,username,data,0,verification], function (err) {
			callback(err);
		});
	});
};

exports.CreateRedactor = function (username, password, verification, callback) {
	console.log("Creating user: " + username);
	db.run("INSERT INTO `user_info` (id, name, hash, rights, verified) VALUES (?,?,?,?,?)", [null,username,password,1,verification], function (err) {
		callback(err);
	});
};

exports.CreateAdmin = function (username, password, verification, callback) {
	console.log("Creating user: " + username);
	db.run("INSERT INTO `user_info` (id, name, hash, rights, verified) VALUES (?,?,?,?,?)", [null,username,password,2,verification], function (err) {
		callback(err);
	});
};


exports.VerifyUser = function (username, password,  callback) {
	console.log("Decrypting user secret:" + password);
	security.Encrypt(password, function(data){
		db.get("SELECT * from user_info WHERE name='" + username + "' AND hash='" + data + "' LIMIT 1", function (err, row) {
			callback(row);
		});
	});
};


exports.LoginUser = function (username, password) {
	security.Decrypt(password, function(data){
		db.get("SELECT * from user_info WHERE name='" + username + "' AND hash='" + data + "' LIMIT 1", function (err, row) {
			var result = {"verified": true, "name": row.name};
			callback(result);
		});
	});
}

exports.GetUserById = function (id, callback){
	db.get("SELECT * from user_info WHERE id='" + id + "'", function (err, row) {
		var build = {"id": row.id, "name": row.name, "rights": row.rights};
		callback(build);
	});
};
exports.GetUserID = function (name, callback){
	db.get("SELECT * from user_info WHERE name='" + name + "'", function (err, row) {
		var build = {"id": row.id, "name": row.name};
		callback(build);
	});
};
