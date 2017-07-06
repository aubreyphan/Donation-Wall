var express = require('express')
	,	app = express()
	,	http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var jsonFile = require('jsonfile');
var request = require('request');
var appToken = "f0mhue12nbn8uw7728hxcautftuqis1";

connections = [];
var campaignName = 'NatureConservancy';

http.listen(3000, function(){
	console.log('listening on *: 3000');
});

app.use(express.static('public'));
app.use('/js', express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/media', express.static(path.join(__dirname, '../media')));

app.get('/', function(req, res){
	if (req.query.campaign === campaignName) { 
		res.sendFile('index.html', {root: path.join(__dirname, '../')});
	} else {
		res.send('No notification');
	}
});

//request,response => local server to API server
//req, res => local server to client

//FETCH CAMPAIGN HEADER
app.get('/api/campaign', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	//request setHeader
	var options = {
		url: 'https://api-staging.fundrazr.com/v1/campaigns/NatureConservancy',
		headers: {
			'Authorization' : 'Bearer ' + appToken
		}
	};

	function callback(error, response, body){
		if(!error && response.statusCode == 200){
			res.send(body);
		}
	}

	request(options, callback);
});

//FETCH CONTRIBUTIONS
app.get('/api/contributions', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	//request setHeader
	var options = {
		url: 'https://api-staging.fundrazr.com/v1/campaigns/NatureConservancy/contributions',
		headers: {
			'Authorization' : 'Bearer ' + appToken
		}
	};

	function callback(error, response, body){
		if(!error && response.statusCode == 200){
			res.send(body);
		}
	}

	request(options, callback);

});

//PUSH LATEST NOTIFICATION
app.get('/push', function(req, res) {
	res.send('ok');

	io.to(campaignName).emit('new contribution', {
		avatar: "http://bobfamiliar.azurewebsites.net/wp-content/uploads/2013/05/microsoft-favicon-100x100.png",
		name: "Eddie Doe",
		amount: 700
	});
});	 

io.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
});

