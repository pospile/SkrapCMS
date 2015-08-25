var config = require("./config.js");

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = config.ReturnSalt;

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


exports.Encrypt = function (data, callback) {
  callback(encrypt(data));
}

exports.Decrypt = function (data, callback) {
  callback(decrypt(data));
}