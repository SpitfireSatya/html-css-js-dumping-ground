var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var User = require('./user.js');

module.exports = function(){

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
})),

  login_auth : function(username, password, done) {
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
}
}