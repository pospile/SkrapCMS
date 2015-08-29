var config = require('../value/config.json');
var files = require('../value/files.json');
var theme_config = require("../" + config.theme_path + "/config.json");

exports.ReturnSalt = config.salt;
exports.ReturnVerification = config.require_verification_email;
exports.port = config.port;
exports.isDefault = config.unchanged_settings;
exports.templatePath = config.theme_path;
exports.theme_index = theme_config.theme_index;
exports.theme_404 = theme_config.theme_404;
exports.theme_article = theme_config.theme_article;
exports.theme_user = theme_config.theme_user;
exports.log = config.log_path;
exports.optimize = config.optimize_site;

exports.disallowed_files = files.no_access;
exports.disallowed_modules = files.no_modules;







