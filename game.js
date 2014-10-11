
// Game page (:gamename)
exports.play = function(req, res) {
	var gamename = req.params.gamename;
	res.send('This is a ' + gamename + ' game page!');
};

// Hall of Fame for one specific game (:gamename)
exports.halloffame = function(req, res) {
	var gamename = req.params.gamename;
	res.send('This is a ' + gamename + ' Hall of Fame page!')
};