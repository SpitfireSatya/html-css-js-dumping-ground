var request = require('request');
var req = request.defaults({'proxy':'http://929584:march!16@proxy.tcs.com:8080'});
var winston = require('winston');
var fs = require('fs');
var cheerio = require('cheerio');

var url = "http://www.generali.com/who-we-are/global-positioning/asia.html";

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'generali_asia.log' })
    ]
});

req.get(url ,function(err, response, body) {
	if(response)
	{
		console.log(response.statusCode)
		if(response.statusCode == 200)
		{
			var $ = cheerio.load(body);
			links = $('a'); //jquery get all hyperlinks
			$(links).each(function(i, link){
				logger.log("info", "%s",$(link).attr('href'));
  			});
		}
			
	}
	console.log("done");
});