var cluster = require('cluster');
var os = require('os');
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('Response sent by worker:'+cluster.worker.id);
});

app.listen(8000);