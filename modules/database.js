var main = require("./database/main.js");
var users = require("./database/users.js");
var config = require("./config.js");



exports.VerifyUser = function (username, password, callback) {
	users.VerifyUser(username, password, config.ReturnSalt, callback);
}


exports.CreateUser = function (username, password, callback) {
	if (config.ReturnVerification)
	{
		console.log("Creating user with verification");
		users.CreateUser(username, password, config.ReturnSalt, 0, callback);
	}
	else
	{
		console.log("Creating user without verification");
		users.CreateUser(username, password, config.ReturnSalt, 1, callback);
	}
}
exports.CreateRedactor = function (username, password, callback) 
{
	users.CreateRedactor(username, password, config.ReturnSalt, 1, callback);
}
exports.CreateAdmin = function (username, password, callback) 
{
	users.CreateAdmin(username, password, config.ReturnSalt, 1, callback);
}

exports.BlogName = function (callback) {
	main.BlogName(function (name) {
		callback(name);
	});
}
exports.SetBlogName = function (name) {
	main.SetBlogName(name);
}