var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
var weekly = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>75周刊</title></head><body>';
var listIndex;
var pageData;
var article;
var x;
var showArticle;


for(listIndex in data) {
	weekly += '<div class="pageData">';
	weekly += '<h2>' + data[listIndex]['title'] + '</h2>';
	// 没页数据
	weekly += '<ul>';
	while(pageData = data[listIndex]['pageData'].shift()) {
		// console.log('----------------------');
		// console.log(pageData[article]);
		// console.log('----------------------');
		weekly += '<li style="margin-top: 20px;"><h3>' + pageData['title'] + '</h3></li>';
		for(x = 0; x < pageData['article'].length; x++){
			showArticle = pageData['article'][x];
			console.log('----------------------');
			console.log(showArticle);
			console.log('----------------------');
			weekly += '<li style="background:#E0DCDC;margin-bottom: 10px;"><a href="' + showArticle['url'] + '" target="_blank">' + showArticle['title'] + '</a><p>' + showArticle['desc'] + '</p></li>';
		
		}	

		// for(article in pageData){
			
			
		// }
	}
	weekly += '</ul>';
	weekly += '</div>';
}
weekly += '</body></html>';
fs.writeFileSync('./list.html', weekly);
console.log(weekly);



