var express = require('express');
var app = express();

app.put('/put', function(req, res){
	res.redirect('/get');
});

app.get('/get', function(req, res){
	res.send('got the request');
});

app.listen(8000);