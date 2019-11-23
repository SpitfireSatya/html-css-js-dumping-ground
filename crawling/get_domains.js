var fs = require('fs');
//var mongodb = require('mongodb');
//var uri = "mongodb://localhost:27017/crawl";
//var MongoClient = mongodb.MongoClient;



var file = 'tlds-alpha-by-domain.txt';
var obj = fs.readFileSync(file, "UTF-8");

//var str = obj.replace('\n', '\t');
//console.log(str);
var ss = obj.split('\n');
//console.dir()
/*ss.forEach(function(s){
	console.log(s);
});
*/

//cities = [];
//cities.push(ss[1]);

for(var i=0; i<10; i++)
{
    console.log(ss[i]);
}
/*var body = {};
id=0;*/

/*MongoClient.connect(uri, function(error, db){
    if(error)
    {
        console.log("Cannot connect to mongodb server");
    }
    var collection = db.collection('cities');

    cities.forEach(function(city){

   		body._id = id;
   		body.name = city;
        collection.insert(body, function(err){
            if(err)
            {
                console.log('Error:'+err.stack);
            }
            else
            {
                console.log('1 record added');
            }
        });
        console.log(city);
        id++;
    });

});*/