var express = require('express')
	,	app = express()
	,	http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var jsonFile = require('jsonfile');
var request = require('request');

var appToken = "f0mhue12nbn8uw7728hxcautftuqis1";

connections = [];
campaignName = 'alfons-mucha';

http.listen(3000, function(){
	console.log('listening on *: 3000');
});

app.use(express.static('public'));
app.use('/js', express.static(__dirname));
app.use('/media', express.static(path.join(__dirname, '../../public/media')));
app.use('/css', express.static(path.join(__dirname, '../../public/css')));

app.get('/', function(req, res){
	if (req.query.campaign === campaignName) { 
		res.sendFile('index.html', {root: path.join(__dirname, '../../public')});
	} else {
		res.send('You are not subscribed to this campaign.');
	}
});

//request,response => local server to API server
//req, res => local server to client

//FETCH CAMPAIGN HEADER
app.get('/api/campaign', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	//request setHeader
	var options = {
		url: 'https://api-staging.fundrazr.com/v1/campaigns/alfons-mucha',
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
		url: 'https://api-staging.fundrazr.com/v1/campaigns/alfons-mucha/contributions',
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
		owner: {
			name: "Eddie Doe",
			image_url: "http://bobfamiliar.azurewebsites.net/wp-content/uploads/2013/05/microsoft-favicon-100x100.png"
		},
		amount: 500,
		created: new Date().getTime()/1000
	});
});	

io.on('connection', function(socket){
	socket.join(campaignName);
}); 


