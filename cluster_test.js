var cluster = require('cluster');
var os = require('os');
var express = require('express');
var app = express();

cluster.schedulingPolicy = cluster.SCHED_RR;

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
    app.get('/', function(req, res){
    res.send('Response sent by worker:'+cluster.worker.id);
});

app.listen(8000);
    console.log('Response sent by worker:'+cluster.worker.id);
}