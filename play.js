var express  = require('express');
var app 	 = express();
var server 	 = require('http').createServer(app);
var io 		 = require('socket.io').listen(server);

var gameLogic = require('./app/game-logic');

var users   = [];	/* Stores users sockets
					 * this is also useful to 
					 * keep track of all current
					 * users.
					 */

server.listen(80);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/play.html');
});

io.sockets.on('connection', function (socket) {

	socket.on('new-match', function (data, callback) {
		console.log('event::new-match');
		console.log('data:'+JSON.stringify(data));

		var matchData = {
			user  : data.user,
			level:  data.level,
			point1: 0,
			point2: 0,
			winner: ''
		}
		socket.match = matchData;
		users[socket.match.user] = socket;
		updateMatch(matchData);
		updateUsers();

		callback({
			user: "server",
			msg:  "Welcome, good luck! You start."
		});

	});

	socket.on('hit', function (data, callback) {
		console.log('event::hit');
		console.log('data:'+JSON.stringify(data));
		
		// 1. get data
		var hitData      = data;
		var matchData = socket.match;
		
		// 2. send friendly message
		users[matchData.user].emit('server-message', { user:'server', msg: 'Nice hit!' });
					
		// 3. apply logic
		// success == true, if server wins this turn
		var success = gameLogic.evaluatePoint(matchData);
		
		// send message
		users[matchData.user].emit('server-message', { user:'server', msg: 'success='+success });
		
		// return message
		matchData = gameLogic.evaluateMatch(success, matchData);

		// update result
		socket.match = matchData;
		users[socket.match.user] = socket;
		updateMatch(matchData);

		if (matchData.winner != '') {
			// match-finish
			users[matchData.user].emit('match-finish', matchData);
		}

	});

	socket.on('disconnect', function (data) {
		console.log("event:disconnect");
		if (!socket.nickname) return;
		delete users[socket.nickname];
		updateUsers();
	});


	// Utilities
	function updateUsers() {
		// emit event to update global list of users
		io.sockets.emit("users", Object.keys(users));
	}

	function updateMatch(matchData) {
		// emit event to update current match result
		users[matchData.user].emit("match-result", matchData);
	}

}); 