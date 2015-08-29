var modules_init = require('../value/modules.json');


var returnModulesNames = function (callback) {
	callback(modules_init.modules);
};

var returnModules = function (callback) {
	callback(modules_init.modules.length);
};

var returnSpecificModule = function (index, callback) {
	var css_urls = modules_init.urls[index].css_urls;
	var js_urls = modules_init.urls[index].js_urls;
	//console.log(js_urls);
	callback(css_urls, js_urls);
};

exports.returnModules = function (callback) {
	returnModules(callback);
};

exports.returnSpecificModule = function(index, callback) {
	returnSpecificModule(index, callback);
};
exports.returnModulesNames = function (callback){
	returnModulesNames(callback);
};

exports.modules = modules_init.modules;

returnModules(function(lenght){
	console.log(lenght + "modules");
});