var express = require('express')
	,	app = express()
	,	http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var jsonFile = require('jsonfile');

connections = [];

http.listen(3000, function(){
	console.log('listening on *: 3000');
});

app.use(express.static('public'));
app.use('/js', express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/media', express.static(path.join(__dirname, '../media')));

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname, '../')});
});

app.get('/api/contributions', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	res.sendFile('contributions.json', {root: __dirname});
});

io.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
});

