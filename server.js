var express = require('express'),
	path = require('path'),
	nowjs = require('now'),
	browserify = require('browserify'),
	fs = require('fs'),
	FileHasher = require('./FileHasher'),
	flacEncoder = require('./FlacEncoder'),
	EncodeRequest = require('./EncodeRequest'),
	server;

server = express.createServer();

server.configure(function configureAppAndMiddleware() {
	server.set('view engine', 'jade');
	server.set('view', path.join(__dirname, 'views'));
	
	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.static(path.join(__dirname, 'public')));
	server.use(browserify({
		require: path.join(__dirname, 'client/index')
	}));
});


server.get('/', function showHomePage(req, res) {
	res.render('index.jade');
});

server.post('/encode', function (req, res) {
	EncodeRequest.respond(req);
	res.redirect('back');
});

server.listen(8080);

var everyone = nowjs.initialize(server);


console.log('Running on 8080');
