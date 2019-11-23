var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var url = require('url');
var path = require('path');

app.use(bodyParser.json())


/*
app.use(function(err, req, res, next) {
  if(err)
  {
  		var statusCode = err.status;
  		var statusText = '';
  		switch(statusCode)
  		{
  			case 400:
  				statusText = 'Bad Request';
    			break;
    		case 401:
    		  statusText = 'Unauthorized';
    		  break;
   			case 403:
    		  statusText = 'Forbidden';
   			  break;
        case 404:
          statusText = 'page not found';
          break;
    		default:
      			statusCode = 500;
      			statusText = 'Internal Server Error';
     		 	break; 
  		}
	}
  res.status(statusCode).send({status: statusText});
})  
*/

app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.send(err.message || '** no unicorns here **');
});

app.post('/', function (req, res, next) {
	var name = req.body.username;
	res.json({"name" : name});
});

app.get('/:test1', function (req, res, next) {
	//var data = url.parse(req.url,true).query;
	  var data = req.query.test;
    var data1 = req.params.test1;
    res.send({"data" : data, "test1" : data1});
  //res.json({"test1" : data1});
});

app.put('/', function (req, res, next) {
  res.json('Put Request');
});

app.all('*', function(req, res, next){
 res.status(404).send("Page not Found");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});