var express = require('express')
	,	app = express()
	,	http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static('public'));
app.use('/js', express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/media', express.static(path.join(__dirname, '../media')));

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname, '../')});
});

io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(3000, function(){
	console.log('listening on *: 3000');
});