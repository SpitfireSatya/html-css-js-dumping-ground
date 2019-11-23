var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var extend = require('util')._extend;
var app = express();
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var url = "mongodb://localhost:27017/new";
var db = mongoose.connect(url);
var data = [];

app.use(bodyParser.json());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

//---------------------------- Schema Definitions ---------------------------

var userSchema = new mongoose.Schema({
	username : String,
	password : String
});

var contactSchema = new mongoose.Schema({
  	name : String,
  	email : String,
  	subject : String,
  	description : String
 });

var digitude_eventSchema = new mongoose.Schema({
	title : String,
	date : Date,
	like_count: [{type : Number, default : 0}],
	comment_count : [{type : Number, default : 0}]
});

var likeSchema = new mongoose.Schema({
	value : Boolean,
	like_creator : [{type : Schema.ObjectId, ref : 'User'}],
	liked_event : [{type : Schema.ObjectId, ref : 'Digitude_event'}]
});

var commentSchema = new mongoose.Schema({
	value : String,
	date : Date,
	comment_creator : [{type : Schema.ObjectId, ref : 'User'}],
	comment_event : [{type : Schema.ObjectId, ref : 'Digitude_event'}]
})

//------------------------------- Models ------------------------------------------------

var User = mongoose.model('User', userSchema);
var Contact = mongoose.model('Contact', contactSchema);
var Digitude_event = mongoose.model('Digitude_event', digitude_eventSchema);
var Like = mongoose.model('Like', likeSchema);
var Comment = mongoose.model('Comment', commentSchema);


//--------------------------- serialize/deserialize -------------------------------------

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//---------------------------- UserLogin -------------------------------------

passport.use('login', new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    User.findOne({
      'username': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (!bcrypt.compareSync(password, user.password)){
        return done(null, false);
      }
      return done(null, user);
    });
  });
}));

//------------------------------ User Registration -------------------------------------

passport.use('signup', new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    User.findOne({
      'username': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, false);
      }
      else {
      	var hash = bcrypt.hashSync(password, salt);
      	var usernew = new User({
      		username : username,
      		password : hash,
      		//email : email,
      		//age : age
      	});
      	usernew.save(function(err){
      		if(err){
      			console.log(err);
      		}
      	});
      }
      return done(null, false, user);
    });
  });
}));

//-----------------------------  Login / Register -----------------------------

//-------------------------- User Login ----------------------------------------

app.post('/login', passport.authenticate('login', {
	successRedirect: '/events/list',
    failureRedirect: '/login',
    failureFlash : true 
}));

//------------------------- User Registration -----------------------------------

app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash : true 
 }));

//----------------------------- Authentication -------------------------------

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

//----------------------------- Request Responses -----------------------------

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

//--------------------------- Event likes and comments -------------------------

//------------------------------Update Likes-------------------------------------

app.post('/events/like', isAuthenticated, function(req, res){
	Digitude_event.findById(req.body.eventID, function(err, digitude_event){
		if(err)
		{
			console.log(err.stack);
		}
		var query = Like.findOne({});
		query.and([{like_creator : req.user._id}, {liked_event : req.body.eventID}]).exec(function(err, like){
			if(err)
			{
				console.log(err.stack);
			}
			if(like)
			{
				if(like.value != req.body.value)
				{
					if(req.body.value == "true")
					{
						digitude_event.like_count++; 
					}
					else
					{
						digitude_event.like_count--;
					}
					like.value = req.body.value;
					like.save(function(err){
						if(err)
						{
							console.log(err.stack);
						}
					});

					digitude_event.save(function(err){
						if(err)
						{
							console.log(err)
						}
					});
				}
			}
			else
			{
				var likenew = new Like({
					value : req.body.value,
					like_creator : req.user._id,
					liked_event : req.body.eventID
				});
				likenew.save(function(err){
					if(err)
					{
						console.log(err.stack);
					}
				});
				if(req.body.value == "true")
				{
					digitude_event.like_count++;
					digitude_event.save(function(err){
						if(err)
						{
							console.log(err)
						}
					});
				}
			}
		});
		res.send(req.user._id);
	});

});

//-------------------get all comments and likes for event------------------

app.get('/events/show?', function(req, res){
	Digitude_event.findById(req.query.eventID, function(err,digitude_event){
		if(err)
		{
			console.log(err);
		}
		if(digitude_event)
		{
			data.push(digitude_event);
		}

		var query = Like.find({});
		query.and([{liked_event : req.query.eventID}, {value : "true"}]).exec(function(err,likes){
			if(err)
			{
				console.log(err);
			}
			if(likes)
			{
				likes.forEach(function(like){
					data.push(like);
				});
			}
		

			Comment.find({comment_event : req.query.eventID}, function(err,comments){
				if(err)
				{
					console.log(err);
				}
				if(comments)
				{
					comments.forEach(function(comment){
						data.push(comment);
					});
					res.send(data);
				}
				data  = [];
			});
		});
	});
});


//-----------------------------New Comment-----------------------------
app.post('/events/comment', isAuthenticated, function(req, res){
	Digitude_event.findById(req.body.eventID, function(err, digitude_event){
		if(err)
		{
			console.log(err.stack);
		}
		if(digitude_event)
		{
			var commentnew = new Comment({
				value : req.body.value,
				date : new Date(),
				comment_creator : req.user._id,
				comment_event : req.body.eventID
			});
			commentnew.save(function(err){
				if(err)
				{
					console.log(err)
				}
			});
			digitude_event.comment_count++;
			digitude_event.save(function(err){
				if(err)
				{
					console.log(err)
				}
				res.send('Comment saved');
			});
		}

	});
});

//------------------------------update Comment------------------------------
app.put('/events/comment', isAuthenticated, function(req, res){
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
					res.send(req.body.value);
				});
			}
		});
	})

//-----------------------------Delete Comment-------------------------------------
app.delete('/events/comment', isAuthenticated, function(req, res){
	Digitude_event.findById(req.body.eventID, function(err, digitude_event){
		if(err)
		{
			console.log(err.stack);
		}
		if(digitude_event)
		{
			Comment.remove({_id : req.body.commentID}, function(err){
			if(err)
			{
				console.log(err);
			}
			});

			digitude_event.comment_count--;
			digitude_event.save(function(err){
				if(err)
				{
					console.log(err)
				}
				res.send('Comment deleted');
			});
		}
	});
});

//------------------------------All Events---------------------------------------

app.get('/events/list', function(req, res){
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
			res.send(data);
		}
		data = [];
	});
});

//---------------------------- Logout ---------------------------------------
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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