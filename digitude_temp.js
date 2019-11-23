var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var url = require('url');
var path = require('path');
var app = express();

var extend = require('util')._extend;
var data = [];
app.use(bodyParser.json());

var url = "mongodb://localhost:27017/new";
var db = mongoose.connect(url);

//----------------------------Schema Definitions---------------------------

var userSchema = new mongoose.Schema({
	_id : Number,
	name : String,
	email : String,
	age : Number
});

var contactSchema = new mongoose.Schema({
  	name : String,
  	email : String,
  	subject : String,
  	description : String
 });

var digitude_eventSchema = new mongoose.Schema({
	_eventID : Number,
	title : String,
	date : Date
});

var likeSchema = new mongoose.Schema({
	value : Boolean,
	like_creator : [{type : Number, ref : 'User'}],
	like_event : [{type : Number, ref : 'Digitude_event'}]
});

var commentSchema = new mongoose.Schema({
	value : String,
	comment_creator : [{type : Number, ref : 'User'}],
	comment_event : [{type : Number, ref : 'Digitude_event'}]
})

//-------------------------------Models------------------------------------------------

var User = mongoose.model('User', userSchema);
var Contact = mongoose.model('Contact', contactSchema);
var Digitude_event = mongoose.model('Digitude_event', digitude_eventSchema);
var Like = mongoose.model('Like', likeSchema);
var Comment = mongoose.model('Comment', commentSchema);

//----------------------------Request Responses---------------------------------------

//-------------------------------Contact US------------------------------------
app.post('/contactus', function(req, res){
	var contactnew = new Contact({
		name : req.body.name,
		email : req.body.email,
		subject : req.body.subject,
		description : req.body.description
	});

	contactnew.save(function(err){
		if(err)
		{
			console.log(err.stack);
		}
		res.send('saved');
	});
});

//------------------------------Update Likes-------------------------------------

app.post('/like', function(req, res){
	
	var query = Like.findOne({});
	query.and([{like_creator : req.body.userID}, {like_event : req.body.eventID}]).exec(function(err, like){
		if(err)
		{
			console.log(err.stack);
		}
		if(like)
		{
			like.value = req.body.value;
			like.save(function(err){
				if(err)
				{
					console.log(err.stack);
				}
			});
		}
		else
		{
			var likenew = new Like({
				value : req.body.value,
				like_creator : req.body.userID,
				like_event : req.body.eventID
			});
			likenew.save(function(err){
				if(err)
				{
					console.log(err.stack);
				}
			});
		}
	});
		res.send(req.body.value);
});

//------------------------------All Events---------------------------------------

app.get('/events', function(req, res){
	Digitude_event.find({}, function(err, digitude_events){
		if(err)
		{
			console.log(err.stack);
		}
		if(digitude_events)
		{
			digitude_events.forEach(function(digitude_event){
				data.push(digitude_event);
			});
		}
		res.send(data);
		data = [];
	});
});

//-----------------------------New Comment-----------------------------
app.post('/comment', function(req, res){
	var commentnew = new Comment({
		value : req.body.value,
		comment_creator : req.body.userID,
		comment_event : req.body.eventID
	});
	commentnew.save(function(err){
		if(err)
		{
			console.log(err)
		}
		res.send('Comment saved');
	});
});

//------------------------------update Comment------------------------------
app.put('/comment', function(req, res){
	var query = Comment.findOne({_id : req.body.commentID}, function(err, comment){
		if(err)
		{
			console.log(err.stack);
		}
		if(comment)
		{
			comment.value = req.body.value;
			comment.save(function(err){
				if(err)
				{
					console.log(err.stack);
				}
			});
		}
		res.send(req.body.value);
	});
});
//-----------------------------Delete Comment-------------------------------------
app.delete('/comment', function(req, res){
	Comment.remove({_id : req.body.commentID}, function(err){
		if(err)
		{
			console.log(err);
		}
	});
});

//-------------------------------Comments for particular event----------------------

app.post('/show_comments', function(req, res){
	Comment.find({comment_event : req.body.eventID }, function(err,comments){
		if(err)
		{
			console.log(err);
		}
		if(comments)
		{
			comments.forEach(function(comment){
				data.push(comment);
			});
			res.send(data)
			data  = [];
		}
	});
});

//-----------------------------Error 404--------------------------------------

app.all('*', function(req, res){
	res.status(404).send('Error 404: Page not found.');
})

//-----------------------------listening port-----------------------------------
app.listen(3000,function(err){
	if(err)
	{
		console.log(err.stack);
	}
	console.log('server running at localhost:3000');
})