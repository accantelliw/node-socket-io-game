$(function() {
	var socket = io.connect('http://localhost');

	var $initBox = $('#init-box');
	var $mainBox = $('#main-box');
	var $initForm = $('#init-form');
	var $hitForm = $('#hit-form');
	var $matchLog = $('#match');

	var $users = $('#users');
	var $matchResult = $('#match-result');
	
	$initForm.submit(function(e){
		e.preventDefault();
		var data = {
			user : $('#username').val(), 
			level: $('#level').val()
		}
		socket.emit('new-match', data, function(data){
			if (data) {
				$initBox.hide();
				$mainBox.show();
				displayMsg(data);
			}
		});
		$initForm[0].reset();
	});

	$hitForm.submit(function(e){
		e.preventDefault();
		var hitdata = {
			hit1: $('#hit1').val(), 
			hit2: $('#hit2').val(),
			hit3: $('#hit3').val()
		}

		var currentHitMsg = 'Hitting a ' + $('#hit1').val() + ' ' + $('#hit2').val() + ' ' + $('#hit3').val() + '...';
		displayMsg({
			user: 'you',
			msg: currentHitMsg
		});

		socket.emit('hit', hitdata, function(data){
			$chat.append("<span class='error'>" + data + "</span><br />");
		});
		$hitForm[0].reset();
	});

	// update current users list
	socket.on('users', function (data) {
		console.log(data);
		var html = "";
		for (var i=0; i<data.length; i++) {
			html += data[i] + "<br>";
		}
		$users.html(html);
	});

	// update current users list
	socket.on('match-result', function (data) {
		console.log(data);
		var html = getFancyPointValue(data.point1) + "-" + getFancyPointValue(data.point2) + "[Level:" + data.level + "]";
		$matchResult.html(html);
	});

	socket.on('server-response', function (data) {
		displayMsg(data);
	});

	socket.on('server-message', function (data) {
		displayMsg(data, 'message from server');
	});

	socket.on('match-finish', function (data) {
		console.log(data);
		var html = data.winner + " win!";
		$matchResult.html(html);
	});

	// Utilities
	function displayMsg(data, type) {
		var clazz = 'msg';
		if (type) {
			clazz = 'system';
		}
		$matchLog.append("<span class='"+clazz+"'><b>" + data.user + "</b>:" + data.msg + "</span><br />");
	}

	function getFancyPointValue(val) {
		if (val == 0) return "00";
		else if (val == 1) return "15";
		else if (val == 2) return "30";
		else if (val == 3) return "40";
		else if (val == 4) return "AD";
		else return "??"
	}

});
