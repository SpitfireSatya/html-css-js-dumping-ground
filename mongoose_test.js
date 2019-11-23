var mongoose = require('mongoose');

var url = "mongodb://localhost:27017/new";
var db = mongoose.connect(url);

var userSchema = new mongoose.Schema({
  	username : String,
  	password : String
 });

 var User = mongoose.model('User', userSchema);

 var query = User.find({});

query.and([{'password' : 'Pass'}, {'username' : 'satya'}]);
query.exec(function (err, docs) {
  // called when the `query.complete` or `query.error` are called
  console.log('fetching...');
  if(err)
  {
  	console.log(err);
  }
  if(docs)
  {
  	docs.forEach(function(doc){
  		console.log("_id: "  +doc._id);
  		console.log("username: "  +doc.username);
  		console.log("password: "  +doc.password);
  	});
  }
  console.log('done');
  // internally
});