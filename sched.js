var schedule = require('node-schedule');
var restify = require('restify');
var server = restify.createServer();
server.listen(8000);

server.get('/',function(req, res){
	res.send('event executed');
});
	console.log('start');

//var j = schedule.scheduleJob('*/5 * * * * *', function(){
//	var date = new Date();
//	console.log('event executed at'+date);
//});
