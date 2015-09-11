var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
/*
{
	1:{CSS:[],JS:[]},
	1:{CSS:[],JS:[]}
}
*/
var weeklyNum = 124;
var weekly = {};


var reqUrl = 'http://www.75team.com/weekly/issue';

(function(index){
	var callee = arguments.callee;
	//callee(++index);
	//console.log('send: ' + reqUrl + index + '.html');
	request(reqUrl + index + '.html', function(err, response, body){
		var $,
			singlePageData;
		if(err || response.statusCode != '200'){
			console.log('request error: ' + reqUrl, err);
			return;
		}
		$ = cheerio.load(body, {decodeEntities: false});
		singlePageData = parseStructor($);
		fs.writeFile('./data.json', JSON.stringify(singlePageData), {encoding:'utf8'});
		//console.log('done: ' + reqUrl + index + '.html');
		if(++index > 1){
			return;
		}else{
			callee(index);
		}
	});

})(1);

function parseStructor($){
	var structor = {
		title: $('title').text()
	};
	// 获取页面分类
	structor['pageData'] = getClasses($)
	return structor;
}
/*
	获取分类
	[
		{
			title:'classes'
			article: [
				{title: 'title', des:'des', url:url},
				{title: 'title', des:'des', url:url}
			]
		}
	]
*/
function getClasses($){
	var classes = [];			// structor
	var fPushArtical = false;	// 是否要添加文件标题和连接
	$('#content ul li').each(function(index, elem){
		var itemClasses = {article:[]};	// structor
		// 是一个分类标题接下来就需要添加文章列表
		$(elem).hasClass('article') === true ? fPushArtical = true : fPushArtical = false;
		if(fPushArtical){
			var article = {};
			article['title'] = trim($(elem).find('h3 a').text());
			article['desc'] = $(elem).find('.desc').html();
			article['url'] = $(elem).find('h3 a').attr('href');
			itemClasses.article.push(article);
			// 文章
		}else{
			// 分类标题
			itemClasses['title'] = trim($(elem).text());
		}
		classes.push(itemClasses);
	});
	return classes;
}

function trim(str){
	str = str.replace(/[\n\s]+/g, '');
	return str;
}


