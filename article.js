var article = require('./modules/database/articles');
var data = require('./value/article.json');



if (data.name != undefined && data.date != undefined && data.data != undefined && data.author != undefined)
{
	console.log("Preparing to create article");
	article.CreateArticle(data.name, data.author, data.date, data.data, function(done){
		if (done) console.log("Article created successfully");
		else console.log("Something went wrong");
	});
}
