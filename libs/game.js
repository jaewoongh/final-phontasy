module.exports = function(name) {
	var gamename = name;
	var max_players = 4;
	var phase = 'waiting';
	var players = [];

	var config = function(conf) {
		conf = conf || {};
		gamename = conf.gamename || gamename;
		max_players = conf.max_players || max_players;
		phase = conf.phase || phase;
	};

	var info = function() {
		return {
			gamename:		gamename,
			max_players:	max_players,
			phase:			phase,
			players:		players
		}
	};

	var isFull = function() { return !(players.length < max_players); };
	var getPlayers = function() { return players; };

	var addPlayer = function(player) {
		if (players.length >= max_players) return false;
		players.push(player);
		return true;
	};

	var removePlayer = function(player) {

	};

	var getPhase = function() { return phase; };
	var setPhase = function(newPhase) { phase = newPhase; };


	return {
		config:			config,
		info:			info,

		getPlayers:		getPlayers,
		isFull:			isFull,
		addPlayer:		addPlayer,
		removePlayer:	removePlayer,

		getPhase:		getPhase,
		setPhase:		setPhase
	}
};