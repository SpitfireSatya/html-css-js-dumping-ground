var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var os = require('os');

var samples = []
var prevCpus = os.cpus()

setInterval(sample, 100)
setInterval(print, 1000)

function print() {
  var result = { last10: null, last50: null, last100: null }
  var percent = 0
  var i = samples.length
  var j = 0
  while (i--) {
    j++
    if (samples[i].total > 0)
      percent += (100 - Math.round(100 * samples[i].idle / samples[i].total))
    if (j == 10) result.last10 = percent / j
    else if (j == 50) result.last50 = percent / j
    else if (j == 100) result.last100 = percent / j
  }
  //console.log(result);
  io.emit('someEvent', result);
}

function sample() {
  currCpus = os.cpus()
  for (var i = 0, len = currCpus.length; i < len; i++) {
    var prevCpu = prevCpus[i]
    var currCpu = currCpus[i]
    var deltas = { total: 0 }
    for (var t in prevCpu.times)
      deltas.total += currCpu.times[t] - prevCpu.times[t]
    for (var t in prevCpu.times)
      deltas[t] = currCpu.times[t] - prevCpu.times[t]
  }
  prevCpus = currCpus
  samples.push(deltas)
  if (samples.length > 100) samples.shift()
}

app.use('/JS', express.static(path.join(__dirname + 'JS')));
app.use('/', express.static(__dirname));

app.get('*', function(req, res) {
  res.sendStatus(404);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});