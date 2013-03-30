var express = require('express');
var sys = require('sys');
var twitter = require('twitter');
var logging = require('node-logging');

logging.setLevel('error');

var app = express.createServer();
app.register('.html', require('jade'));
app.set("view options", { layout: false });
app.listen(process.env.PORT || 3000);

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

app.get('/', function (req, res) {
  
  script_url = 'http://localhost';
  if(process.env.PORT) {
    script_url = 'http://defiantly-not-daemon.herokuapp.com';
  }
  
  res.render(__dirname + '/public/index.html', {
    script_url: script_url,
    query: 'defiantly'
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
