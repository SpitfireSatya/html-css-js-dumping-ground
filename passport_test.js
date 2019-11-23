var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var expressSession = require('express-session');
var extend = require('util')._extend;
var app = express();

var url = "mongodb://localhost:27017/passport";
var db = mongoose.connect(url);

app.use(bodyParser.json());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var userSchema = new mongoose.Schema({
	username : String,
	password : String,
});

var User = mongoose.model('User', userSchema);

var usernew = new User({
	username : admin,
	password : admin
});

Usernew.save(function(err){
	if(err)
	{
		console.log(err);
	}
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


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

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));

app.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true 
 }));

app.get('/home', function(req, res){
	res.send('Login Successful!');
})


app.get('/signout', function(req, res) {
  req.logout();
  res.send('Logged out Successfully');
});

app.listen(3000, function(err){
	if(err)
	{
		console.log(err)
	}
	console.log('Server running at port 3000');
});