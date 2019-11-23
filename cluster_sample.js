var cluster = require('cluster');
var os = require('os');

//------------------------------ Routes -----------------------------------------
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
var router = express.Router();


var url = "mongodb://localhost:27017/new";
var db = mongoose.connect(url);
var data = [];

//------------------------------- Models ---------------------------------------

var User = require('./models/User_model.js');
var Contact = require('./models/contact_model.js');
var Digitude_event = require('./models/digitude_event_model.js');
var Like = require('./models/like_model.js');
var Comment = require('./models/comment_model.js');


app.use(bodyParser.json());
app.use(expressSession({
	secret: 'mySecretKeyForCreatingHash',
	saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport.js')(passport);

var event_route = require('./routes/event_route.js');
var like_route = require('./routes/like_route.js');
var comment_route = require('./routes/comment_route.js');
var contact_route = require('./routes/contact_route.js');

//-----------------------------  Login / Register -----------------------------

//------------------------- User Registration -----------------------------------

app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash : true 
 }));

//-------------------------- User Login ----------------------------------------

app.post('/login', passport.authenticate('login', {
	successRedirect: '/events/list',
    failureRedirect: '/login',
    failureFlash : true 
}));

app.get('/login', function(req, res){
	res.send('User not logged in.');
});


//---------------------------- Logout -----------------------------------------
app.get('/logout', function(req, res) {
        req.logout();
        res.send('Successfully logged out');
    });

//----------------------------- Request Responses -----------------------------

//---------------------------- Events route -----------------------------------
app.use('/events', event_route);

//---------------------------- Likes route ------------------------------------
app.use('/events', like_route);

//---------------------------- Comment route ----------------------------------
app.use('/events', comment_route);

//--------------------------- Contact route -----------------------------------
app.use('/contactus', contact_route);

//-----------------------------Error 404---------------------------------------

app.all('*', function(req, res){
	res.status(404).send('Error 404: Page not found.');
})

//-----------------------------listening port-----------------------------------

app.listen(4000,function(err){
	if(err)
	{
		console.log(err.stack);
	}
	console.log('server running at localhost:4000');
});
