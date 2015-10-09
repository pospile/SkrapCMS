var config = require("./config.js");
var jwt = require('jsonwebtoken');
var verificator = require('./database/users.js');
var token = require('./database/token.js');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = config.ReturnSalt;

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


function sign_token(user, password, user_unique, callback){
  console.log("Preparing to sign token");
  verificator.VerifyUser(user, password, function(data){
    if (data == undefined)
    {
      console.log("ERROR during signing token: " + data);
      callback("error");
      return;
    }
    if (data.name == user)
    {
      console.log("User verified, signing in progress");
      var token = jwt.sign({ sign_to: user }, config.ReturnTokenKey + user + user_unique);
      callback(token);
    }
  });
}

function decode_token(token, user, user_unique, callback) {
    jwt.verify(token, config.ReturnTokenKey + user + user_unique, function(err, decoded) {
      if (err)
      {
        callback(err);
        return
      }
      callback(decoded);
    });
}

function token_verify(token_remote, user,user_unique, callback){
  console.log("Retrieving user id");
  verificator.GetUserID(user, function(data){
    console.log("User id retrieved as: " + data.id);
    var is_one_valid = false;
    var valid_token;
    token.GetToken(data.id, function(token){
      for(var i = 0; i < token.length; i++)
      {
        if (token[i].token == token_remote)
        {
          is_one_valid = true;
          valid_token = token[i].token;
        }
      }
      if (is_one_valid)
      {
        console.log("Valid token found: " + valid_token);
      }
      else
      {
        callback({"error": "token_not_found", "solution": "call_log_in_api"});
        return;
      }

      decode_token(valid_token, user, "my_unique", function(data){
        callback(data);
      });

    });
  });

}

exports.token_verify = function (token_remote, user, user_unique, callback) {
    token_verify(token_remote, user, user_unique, callback);
}
exports.Encrypt = function (data, callback) {
    var encrypted = encrypt(data);
    callback(encrypted);
}

exports.Decrypt = function (data, callback) {
    callback(decrypt(data));
}
exports.SignToken = function (user,password,user_unique, callback) {
  sign_token(user,password,user_unique,callback);
}
exports.DecodeToken = function (token, user, user_unique, callback) {
  decode_token(token,user,user_unique,callback);
}