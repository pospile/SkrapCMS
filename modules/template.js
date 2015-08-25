var file = require("./file.js");


exports.ReturnIndex = function (){

}
exports.ReturnPage = function (page, callback) {
	file.ReadStaticFile(page, callback);
}