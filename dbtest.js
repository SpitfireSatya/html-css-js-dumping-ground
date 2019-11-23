var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/test1';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.
   var collection = db.collection('usercollection');
   /*
   collection.insert({"username": "name", "password" : "pass"}, function(err, data){
   	if(err)
   	{
   		console.log('Error:'+err.stack);
   	}
   	else
   	{
   		console.log('1 record added');
   	}
   })
*/
    collection.find({"username" : "Satya"}).toArray(function(err, docs){
    	if(err) console.log("Error : " + err);
    	if(docs){
    		docs.forEach(function(doc){
    			console.log("_ID : " + doc._id);
    			console.log("username : " + doc.username);
    			console.log("password : " + doc.password);
    		});
    	}
    	db.close();
    });
    //Close connection
    
  }
});