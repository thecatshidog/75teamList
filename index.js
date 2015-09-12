var request = require('request');
var cheerio = require('cheerio');
var j = request.jar();
var fs = require('fs');
/*
{
	1:{CSS:[],JS:[]},
	1:{CSS:[],JS:[]}
}
*/
var weeklyNum = 125;
var weekly = {};

var reqUrl = 'http://www.75team.com/weekly/issue';

(function(index){
	var callee = arguments.callee;
	//callee(++index);
	//console.log('send: ' + reqUrl + index + '.html');
	console.log('调用请求前：' + reqUrl + index + '.html');
	var option = {
		url: reqUrl + index + '.html',
		
		headers: {
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"Accept-Language": "zh-cn,zh;q=0.5",
			"Accept-Encoding": "utf-8;q=0.7,*;q=0.7",
			"Referer": "http://www.baidu.com/",
			"Cache-Control": "max-age=0",
			'Cookie': '_gat=1; _ga=GA1.2.1291159534.1441994155',
			'Connection': 'keep-alive',
			'RA-Sid': '72DD9350-20150606-071542-d81a15-564661',
			'RA-Ver': '3.0.7',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
		}
		//jar: j
	};
	option.headers = null;
	request(option, function(err, response, body){
		var $,
			singlePageData;
		if(err || response.statusCode != '200'){
			console.log('request error: ' + reqUrl, err);
			return;
		}
		console.log('调用请求后：' + index);
		$ = cheerio.load(body, {decodeEntities: false});
		singlePageData = parseStructor($);
		/*
		fs.appendFileSync('./data.json', JSON.stringify(singlePageData), {encoding:'utf8'}, function(err){
			if(err){
				console.log('appendFile: ' + err);
			}
		});
		*/
		singlePageData = null;

		//console.log('done: ' + reqUrl + index + '.html');
		setTimeout(function(){
			if(++index > weeklyNum){
				return;
			}else{
				callee(index);
			}
		}, 100);
		
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
	var itemClasses = {article:[]};	// structor
	var fPushArtical = false;	// 是否要添加文件标题和连接
	$('#content ul li').each(function(index, elem){
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
			itemClasses = {article:[]};
			itemClasses['title'] = trim($(elem).text());
			classes.push(itemClasses);

		}
		
	});
	return classes;
}

function trim(str){
	str = str.replace(/[\n\s]+/g, '');
	return str;
}


