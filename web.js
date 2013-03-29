var cluster = require('cluster')

if ( cluster.isMaster ) {
  for ( var i=0; i<2; ++i )
      cluster.fork();
      } else {

var express = require('express');
var sys = require('sys');
var twitter = require('twitter');
var logging = require('node-logging');

logging.setLevel('error');

var app = express.createServer();
app.register('.html', require('jade'));
app.set("view options", { layout: false });
app.listen(process.env.PORT || 3000);

var io = require('socket.io').listen(app);
io.set('transports', ['xhr-polling']); io.set('polling duration', 10);

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

app.get('/', function (req, res) {
  
  script_url = 'http://localhost';
  if(process.env.PORT) {
    script_url = 'http://defiantly-not.herokuapp.com';
  }
  
  res.render(__dirname + '/public/index.html', {
    script_url: script_url,
    query: query
  });
  
  var query = "defiantly";
  
  io.sockets.on('connection', function (socket) { 
    twit.stream('user', {track: query}, function(stream) {
      stream.on('data', function (data) {
        if(data.text) {
          if(!data.text.startsWith("RT")) {
            data.split = data.text.split(" ")
            socket.volatile.emit('tweet', data);
          }
        }
      });
    });
  });
  
});

app.get('/style.css', function (req, res) {
  res.sendfile(__dirname + '/public/style.css');
});

app.get('/tweets.js', function (req, res) {
  res.sendfile(__dirname + '/public/tweets.js');
});

app.get('/timeago.js', function (req, res) {
  res.sendfile(__dirname + '/public/timeago.js');
});

var fs = require('fs');
eval(fs.readFileSync('credentials.js')+'');

}
