var express = require('express');
//var babylonjs = require('babylonjs');
var app = express();

app.use(express.static(__dirname + '/static'));
app.use('/js', express.static(__dirname + '/node_modules/babylonjs/dist/preview\ release/')); // redirect bootstrap JS

app.get('/', function (req, res) {
  res.sendFile('static/index.html');
});

app.get('/dbn', function (req, res) {
  res.sendfile('static/dbn.html');
});

app.get('/timeseries', function (req, res) {
  res.sendfile('static/timeseries.html');
});

app.get('/brownsea', function (req, res) {
  res.sendfile('static/brownsea.html');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./static/mapdata.json', 'utf8'));
