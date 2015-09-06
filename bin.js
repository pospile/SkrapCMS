var colors = require("colors");
var database = require("./modules/database.js");
var config = require("./modules/config.js");
var router = require("./modules/router.js");
var util = require("./modules/util.js");



util.clear();

var param = process.argv[2];
var runWithTest = process.argv[3];

if (param == "repair")
{
	/*
	TODO: DO REPAIRING HERE (DELETED DATABASEs ETC...)
	*/
	if (process.argv[3] != null)
	{
		database.SetBlogName(process.argv[3]);
	}
}


if (param == "help" || param == "-h" || param == "h")
{
	console.log("List of parameters \n");
	console.log("                  :"+ colors.red("test") +"  --> test enviroment");
	console.log("                  :"+ colors.red("using") +" --> show static routes");
	console.log("                  :"+ colors.red("files") +" --> show files");
	return;
}

if (param == "test")
{
	console.log("\n")
	console.log("  Testing enviroment... ".yellow);
	console.log("  Is this default settings: " + colors.green(config.isDefault));
	console.log("  Salt: " + colors.green(config.ReturnSalt));
	console.log("  Require mail verification: " + colors.green(config.ReturnVerification));
	console.log("  Running on port: " + colors.green(config.port));
	console.log("  Using template at: " + colors.green(config.templatePath));

	console.log("  Returning optimalized site: " + colors.green(config.optimize_site)+ "\n\n");
	console.log("  Returning optimalized images: " + colors.green(config.optimize_image)+ "\n\n");

	/*

		TODO: Add way more test to ensure that system is ok and ready to boot. Try to found any error in this section automatically!

	*/


	if (runWithTest != "true")
	{
		console.log("\n If you want to run server with this command, add parameter true on the end next time \n")
		console.log(" ---> [node bin test " + colors.green("true") + "] ---> run server with initial test");
		return;
	}
}


if (config.isDefault)
{
	console.log("\n \n  WARNING, USING DEFAULT SETTINGS...".red + "\n \n  Please change that in your config.json".yellow);
}
else
{
	router.initialize(process.argv[2]);
}



