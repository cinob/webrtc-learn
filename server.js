'use strict'
var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var serveIndex = require('serve-index');

var app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));

// http server
// var http_server = http.createServer(app).listen(80, '0.0.0.0');

var options = {
  key : fs.readFileSync('./cert/2566658_webrtc.cinob.cn.key'),
  cert : fs.readFileSync('./cert/2566658_webrtc.cinob.cn.pem')
}

// https server
var https_server = https.createServer(options, app).listen(443, '0.0.0.0');
