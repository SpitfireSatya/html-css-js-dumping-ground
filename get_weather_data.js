var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var url = require('url');
var path = require('path');
var app = express();
var BSON = require('BSON');

var MongoClient = mongodb.MongoClient;
var uri = "mongodb://localhost:27017/crawl";
app.use(bodyParser.json());

MongoClient.connect(uri, function(error, db){
	if(error)
	{
		console.log("Cannot connect to mongodb server");
	}
	else
	{
		console.log("Connection established to: ", uri);
		var collection = db.collection('weather');
		
//--------------------------------GET--------------------------------------------------------

		app.get("/all", function(req, res){
			//"username" : name
			res.header("Access-Control-Allow-Origin", "*");
    		res.header("Access-Control-Allow-Headers", "X-Requested-With");
			var data = [];
			collection.find({}).toArray(function(error, docs){
				if(error)
				{
					console.log('Error: '+error.stack);
				}
				if(docs)
				{
					docs.forEach(function(doc){
						data.push(doc);
					})
    			}
    			if(data.length > (((parseInt(req.query.page)-1)*20)+20))
    				res.send(data.slice(((parseInt(req.query.page)-1)*20), ((parseInt(req.query.page)-1)*20)+20));
    			else
    				res.send(data.slice(((parseInt(req.query.page)-1)*20)), data.length);
			});
		});

		app.get("/", function(req, res){
			//"username" : name
			res.header("Access-Control-Allow-Origin", "*");
    		res.header("Access-Control-Allow-Headers", "X-Requested-With");
			var obj_id = BSON.ObjectID.createFromHexString(req.query.id);
			collection.findOne({_id : obj_id }, function(error, doc){
				if(error)
				{
					console.log('Error: '+error.stack);
				}
				if(doc)
				{
					res.send(doc);
    			}
			});
		});
	}
});

app.listen(8888, function(){
	console.log('server listening at: 9000')
})

