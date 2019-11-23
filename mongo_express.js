var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var url = require('url');
var path = require('path');
var app = express();

var extend = require('util')._extend;

var MongoClient = mongodb.MongoClient;

var url = "mongodb://localhost:27017/test1";

var data = [];

app.use(bodyParser.json());

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
    		default:
      			statusCode = 500;
      			statusText = 'Internal Server Error';
     		 	break; 
  		}
	}
  res.status(statusCode).send({status: statusText});
}) 

MongoClient.connect(url, function(error, db){
	if(error)
	{
		console.log("Cannot connect to mongodb server");
	}
	else
	{
		console.log("Connection established to: ", url);
		var collection = db.collection('usercollection');
		
//--------------------------------GET--------------------------------------------------------

		app.get("/", function(req, res){
			var name = req.query.username;
			//"username" : name

			collection.find({"username" : name}).toArray(function(error, docs){
				if(error)
				{
					console.log('Error: '+error.stack);
				}
				if(docs)
				{
					var host = {"hostname" : req.hostname};
					var ip = {"ip" : req.ip};
					data.push(host);
					data.push(ip);
					docs.forEach(function(doc){
    					data.push({"_ID" : doc._id, "username" : doc.username, "password" : doc.password });
					});

					res.send(data);
    			}
    			data = [];
			});
		});
//--------------------------------------POST-------------------------------------------------

		app.post("/user", function(req, res){
			var username = req.body.username;
			var password = req.body.password;
			collection.insert({"username": username, "password" : password}, function(err){
   				if(err)
   				{
   					res.send('Error:'+err.stack);
   				}
   				else
   				{
   					res.send('1 record added');
   				}
   			})
		});
//---------------------------------------REMOVE-------------------------------------------------

		app.delete("/remove", function(req, res){
			var username = req.body.username;
			collection.remove({"username" : username}, function(err, result){
				if(err)
				{
					res.send({"Error: " : err});
				}
				if(result)
				{
					res.send(result);
				}
			})
		});
//-------------------------------------------UPDATE----------------------------------------------

		app.put("/change", function(req, res){
			var username = req.query.username;
			var data = req.body;
			collection.update({"username" : username}, data, function(err, count){
				if(err)
				{
					res.send(err);
				}
				if(count)
				{
					res.send("Documents updated"+count);
				}

			});

		})
	
	}
});

app.listen(3000, function(){
	console.log('Server listening at: localhost:3000');
});