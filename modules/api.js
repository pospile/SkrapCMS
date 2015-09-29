var api;


exports.prepare = function (api_server) {
	api = api_server;
	init(api);
}

var init = function (app) {
	console.log("  Secure api prepared");

}