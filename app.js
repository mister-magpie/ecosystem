var express = require('express');
//var babylonjs = require('babylonjs');
var app = express();

app.use(express.static(__dirname + '/static'));
app.use('/js', express.static(__dirname + '/node_modules/babylonjs/dist/preview\ release/')); // redirect bootstrap JS

app.get('/', function (req, res) {
  res.sendFile('static/index.html');
});

app.get('/boids', function (req, res) {
  res.sendfile('static/boids.html');
});

app.get('/pixi', function (req, res) {
  res.sendfile('static/pixi.html');
  console.log(obj.mapdata[1])
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./static/mapdata.json', 'utf8'));
