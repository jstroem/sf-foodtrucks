#!/usr/bin/env node
var http = require('http');
var url = require('url');
var path = require('path');

var datafile = process.argv[2];
var staticfolder = process.argv[3];
var port = process.argv[4];

var SearchHandler = require('./handlers/Search')(datafile);
var StaticContentHandler = require('./handlers/StaticContent')(path.join(process.cwd(),staticfolder));

function requestHandler(req,res) {
  req.url = url.parse(req.url, true);
  switch(req.url.pathname) {
      case '/search':
        return SearchHandler(req,res);

      default:
        return StaticContentHandler(req,res);
  }
}


var server = http.createServer(requestHandler);
server.listen(port, function(){
  console.log("server now listening on https://localhost:%d", port)
})
