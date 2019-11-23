var async = require("async"); 
var request = require('request');
var req = request.defaults({'proxy':'http://929584:march!16@proxy.tcs.com:8080'});
/*var url = "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=44db6a862fba0b067b1930da0d769e98"*/
var fs = require('fs');
var mongodb = require('mongodb');
var uri = "mongodb://localhost:27017/crawl";
var MongoClient = mongodb.MongoClient;
var queryString = require('query-string');
var schedule = require('node-schedule');
//var link = {"q" : "London", "appid" : "44db6a862fba0b067b1930da0d769e98"};
var link = {};
var cities = [];
var max;
var Q = require('q');
link.appid = "b1b15e88fa797225412429c1c50c122a"


function fetch_list(){
    var deferred = Q.defer();
    MongoClient.connect(uri, function(error, db){
        if(error)
        {
            console.log("Cannot connect to mongodb server");
            deferred.reject(error)
        }
        var collection = db.collection('cities');

        collection.find({}).toArray(function(error, docs){
            if(error)
            {
                console.log('Error: '+error.stack);
                deferred.reject(error)
            }
            if(docs)
            {
                docs.forEach(function(doc){
                    cities.push(doc.name);
                });
                deferred.resolve(db);
            }
        });
    });
    return deferred.promise;
}


function createConnection(){
    MongoClient.connect(uri, function(error, db){
        if(error)
        {
            console.log("Cannot connect to mongodb server");
        }else if(db){
            return db;
        }
        else{
            //process.exit(0);
        }
    });
}


var addtodb = function (city, callback){

    
    var collection1;

    MongoClient.connect(uri, function(error, db){
        if(error)
        {
            console.log("Cannot connect to mongodb server");
        }

        if(db) collection1 = db.collection('weather');
        else collection1 = createConnection().collection('weather');


        link.q = city
        //console.log(JSON.stringify(link));
        //console.log(queryString.stringify(link));
        var url = "http://api.openweathermap.org/data/2.5/weather?"+queryString.stringify(link);
        console.log(url);
        req.get(url ,function(err, response, body) {
            console.log(response.statusCode) // 200 
            //fs.writeFileSync('data.json',JSON.stringify(body,2));
            //console.log(url);
            if(response.statusCode == 200)
            {   
                //console.log(body);
                collection1.insert(JSON.parse(body), function(err){
                    if(err)
                    {
                        console.log('Error:'+err.stack);
                    }
                    console.log('1 record addded.');
                    db.close();
                });
            }
            if(response.statusCode == 429)
            {
                console.log('retrying . . .');
                db.close();
                addtodb(city, function(){
                    return;
                });
            }
            process.nextTick(callback = callback || function() { return true; });
            //fs.writeFileSync('data.json',JSON.stringify(body,2));
        });
    });
}


// initial page 


return fetch_list()
.then(function(db){
    console.log('count:'+cities.length);

    async.forEachLimit(cities, 1, addtodb, function(callback){
        console.log('Done');
    });

});
    //var j = schedule.scheduleJob('*/1 * * * * *', function(){
    //while(cnt_g<2000)
    //{
        //console.log('req sent')
        //cnt_g++;
    //}
        
//    });