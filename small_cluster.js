var cluster = require('cluster');
var os = require('os');
var express = require('express');
var app = express();

if (cluster.isMaster)
{
    for (var i = 0; i < os.cpus().length; i++)
    {
    	cluster.fork();
    }

    cluster.on('fork', function(worker) {
        console.log('worker:' + worker.id + " is forked");
    });
    cluster.on('online', function(worker) {
        console.log('worker:' + worker.id + " is online");
    });
    cluster.on('listening', function(worker) {
        console.log('worker:' + worker.id + " is listening");
    });
    cluster.on('disconnect', function(worker) {
        console.log('worker:' + worker.id + " is disconnected");
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}
else
{
  app.get('/', function (req, res) {
    console.log('Running on worker ' + cluster.worker.id)});

   app.listen(3000);
}

