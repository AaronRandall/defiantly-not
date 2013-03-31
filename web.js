var express = require('express');
var sys = require('sys');
var twitter = require('twitter');
var logging = require('node-logging');
var script_url = 'http://defiantly-not-daemon.herokuapp.com';

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
  
  if(!process.env.PORT) {
    script_url = 'http://localhost:3001';
  }
  
  console.log("calling render with: " + script_url);

  res.render(__dirname + '/public/index.html', { locals:{
    script_url: script_url
  }});
  
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

app.get('/hv.eot', function (req, res) {
  res.sendfile(__dirname + '/public/fonts/helveticaneue-webfont.eot');
});
app.get('/hv.svg', function (req, res) {
  res.sendfile(__dirname + '/public/fonts/helveticaneue-webfont.svg');
});
app.get('/hv.ttf', function (req, res) {
  res.sendfile(__dirname + '/public/fonts/helveticaneue-webfont.ttf');
});
app.get('/hv.woff', function (req, res) {
  res.sendfile(__dirname + '/public/fonts/helveticaneue-webfont.woff');
});
