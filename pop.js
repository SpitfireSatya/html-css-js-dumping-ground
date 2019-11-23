var mongoose = require('mongoose');

url = 'mongodb://localhost:27017/pop';
var db = mongoose.connect(url);

var userSchema = new mongoose.Schema({
	_id : Number,
	name : String,
	age : Number,
	password : String
});

var likeSchema = new mongoose.Schema({
	_creator : [{type : Number, ref : 'User'}],
	value : Boolean
});

var User = mongoose.model('User', userSchema);
var Like = mongoose.model('Like', likeSchema);

var usernew = new User({
	_id : 1,
	name : 'Guest',
	age : 22,
	password : 'Pass'
});

/*
usernew.save(function(err){
	if(err)
	{
		console.log(err);
	}
});

var likenew = new Like({
	_creator : usernew._id,
	value : false
});

likenew.save(function(err){
	if(err)
	{
		console.log(err);
	}
});
*/

var query = User.findOne({});
query.where('age').gte(30).exec(function(err, user){
	if(err)
	{
		console.log(err)
	}
	if()
	console.log(user.name);
});
/*
query.and([{_creator : 1}]).populate('_creator').exec(function(err, like){
	if(err)
	{
		console.log(err)
	}
	console.log('The creator is: \n'+like._creator+'\nAnd value is: '+like.value);
});
*/
