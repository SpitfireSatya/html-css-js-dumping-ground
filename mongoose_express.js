var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var url = require('url');
var path = require('path');
var app = express();

var extend = require('util')._extend;

app.use(bodyParser.json());
data = [];

var url = "mongodb://localhost:27017/new";
var db = mongoose.connect(url);

var userSchema = new mongoose.Schema({
  	username : String,
  	password : String
 });

 var User = mongoose.model('User', userSchema);


app.post('/add', function(req, res){
	/*var uname = req.body.uname;
	var pword = req.body.pword;
	var usernew = new User({
		username : uname,
		password : pword

	});
	
	*/

	var usernew = new User(req.body);
	usernew.save(function(err, usernew) {
  		if (err) 
  		{
  			console.log(err);
  		}	 
  		res.send("Added Successfully \n"+usernew);
	});
});

app.get('/show', function(req, res){
	var q = req.query.uname;
	User.find({username : q}, function(err, users){
		if(err)
		{
			res.status(err);
		}
		users.forEach(function(user){
			data.push(user);
		});
		res.send(data);
		data = [];
	})

});

app.delete('/del', function(req, res){
	var q = req.query.uname;
	
	User.remove({username : q}, function(err){
		if(err)
		{
			res.status(err);
		}
		else
		{
			res.send("Document removed Successfully");
		}
	})
});

app.put('/change', function(req, res){
	var q = req.query.username;
	var usernew = new User(req.body);
	User.update({username : q}, usernew, {upsert : false}, function(err){
  		if (err) 
  		{
  			console.log(err);
  			res.status(err)
  		}
  		else
  		{	 
  			res.send("Updated Successfully \n"+usernew);
  		}
	});

});

app.all('*', function(req, res){
	res.status(404).send("Page not Found");
})

app.listen(3000, function(){
	console.log('Listening at port 3000');
});

