exports.evaluatePoint = function() {
	return (Math.random() < 0.5);
}

exports.evaluateMatch = function(success, matchData) {
	
	/*
	var matchData = {
		user  : data.user,
		level:  data.level,
		point1: 0,	// system
		point2: 0,	// user
		winner: ''
	}*/

	var inAdvMode = (matchData.point1>=3 && matchData.point2>=3);
	if (success) {
		if (!inAdvMode) {
			matchData.point2 = matchData.point2 + 1;
		}
		else {
			if (matchData.point2 >= matchData.point1)
				matchData.point2 = matchData.point2 + 1;
			else
				matchData.point1 = matchData.point1 - (matchData.point1 % 3);
		}
	}
	else {
		if (!inAdvMode) {
			matchData.point1 = matchData.point1 + 1;
		}
		else {
			if (matchData.point1 >= matchData.point2)
				matchData.point1 = matchData.point1 + 1;
			else
				matchData.point2 = matchData.point2 - (matchData.point2 % 3);
		}
	}

	var isWinningPoint = false;
	if (inAdvMode) {
		if (matchData.point1 == 5) {
			isWinningPoint   = true;
			matchData.winner = matchData.user;
		}
		else if (matchData.point2 == 5) {
			isWinningPoint   = true;
			matchData.winner = 'server';
		}
	}
	else {
		if (matchData.point1 == 4) {
			isWinningPoint   = true;
			matchData.winner = matchData.user;
		}
		else if (matchData.point2 == 4) {
			isWinningPoint   = true;
			matchData.winner = 'server';
		}
	}	

	return matchData;

}