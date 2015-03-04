var express = require("express");
var http = require("http");

var app = express();
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);
server.listen(7777, function() {
	console.log("server started on port 7777");
});