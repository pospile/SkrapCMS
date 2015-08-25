var config = require('../config.json');


exports.ReturnSalt = config.salt;
exports.ReturnVerification = config.require_verification_email;
exports.port = config.port;
exports.isDefault = config.unchanged_settings;
exports.templatePath = config.theme_path;