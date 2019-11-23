var request = require('request');
var req = request.defaults({'proxy':'http://929584:March!16@proxy.tcs.com:8080'});
var q = require('q');
var fs = require('fs');
var file = 'tlds-alpha-by-domain.txt'; 
var winston = require('winston');
var async = require("async"); 
var mongodb = require('mongodb');
var uri = "mongodb://localhost:27017/generali";
var MongoClient = mongodb.MongoClient;
var q = require('q');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'generali.log' })
    ]
  });

function fetch_list(){
    var deferred = q.defer();
    var obj = fs.readFileSync(file, "UTF-8");
    var ss = obj.split('\n');
    deferred.resolve(ss);
    return deferred.promise;
}

/*function createConnection(){
    MongoClient.connect(uri, function(error, db){
        if(error)
        {
            console.log("Cannot connect to mongodb server");
        }else if(db){
            return db;
        }
    });
}
*/

var addtodb = function (ext, callback){
    var collection;

    /*MongoClient.connect(uri, function(error, db){
        if(error)
        {
            console.log("Cannot connect to mongodb server");
        }

        if(db) collection = db.collection('generali_sites');
        else collection = createConnection().collection('generali_sites');
*/
        var url = "http://www.generali."+ext;

        req.get(url ,function(err, response, body) {
            if(response)
            {
                if(response.statusCode == 200)
                {
                    logger.log('info', 'URL:%s statusCode: %d',url, response.statusCode);
                }
                process.nextTick(callback = callback || function() { return true; });
                /*//console.log(response.statusCode);
                if(response.statusCode == 200)
                {   
                    collection.insert({"url" : url}, function(err){
                        if(err)
                        {
                            console.log('Error:'+err.stack);
                        }
                        //console.log(url+' addded.');
                        db.close();
                        process.nextTick(callback = callback || function() { return true; });
                    });
                }
                else
                {
                    db.close();
                    process.nextTick(callback = callback || function() { return true; });
                }*/
            }
            else
            {
                //db.close();
                process.nextTick(callback = callback || function() { return true; });
            }
            
        });
/*    });*/
}



return fetch_list()
.then(function(ss){
    console.log('count:'+ss.length);
    async.forEachLimit(ss, 5, addtodb, function(callback){
        console.log('Done');
    });
});




