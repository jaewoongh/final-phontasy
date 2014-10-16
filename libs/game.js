module.exports = function(name, io, agi, mongoose) {
	var gamename = name;
	var max_players = 4;
	var phase = 'waiting';
	var players = [];

	var io = io;
	var agi = agi;
	var Hero = require('../models/hero')(mongoose);
	var classes = require('./classes');


	// Meta functions
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


	// Routes
	var isFull = function(req, res) {
		res.send(!(players.length < max_players));
	};

	var isNoob = function(req, res) {
		Hero.findOne({ number: req.params.num }, function(err, hero) {
			if (err) return console.error(err);
			res.send(hero == null);
		});
	};

	var register = function(req, res) {
		var noob = new Hero({
			number:			req.params.num,
			name:			req.params.num.slice(-4),
			class:			'tester',
			level:			1,
			dateAppeared:	new Date,
			history:		[]
		});
		noob.save(function(err, hero) {
			if (err) return console.error(err);
			res.json(hero);
		});
	};

	var intoBattle = function(req, res) {
		Hero.findOne({ number: req.params.num }, function(err, hero) {
			if (err) return console.error(err);
			if (players.length >= max_players) res.send(false);
			players.push(hero);
			console.log('New hero joined the battle (' + hero.number + ') => NUM_PLAYERS ' + players.length);
			io.emit('join', getHeroData(hero));
			res.send(true);
		});
	};


	// Event from client
	var outtaBattle = function(data) {
		for (var i = players.length - 1; i >= 0; i--) {
			if (players[i].number != data.number) continue;
			players.splice(i, 1);
			console.log('A hero ' + data.number + ' kicked out of the battle (' + data.reason + ') => NUM_PLAYERS ' + players.length);
		}
	};


	// Actual hero stats for individual
	var getHeroData = function(hero) {
		var classData = classes[hero.class];

		return {
			number:			hero.number,
			name:			hero.name,
			class:			hero.class,
			level:			hero.level,
			hp_max:			eval(classData['hp_max'].replace(/lv/g, hero.level)),
			sp_max:			eval(classData['sp_max'].replace(/lv/g, hero.level)),
			skills:			classData.skills
		}
	};


	// AGI event
	agi.on('agi_event', function(message, caller) {
		switch (message.event) {
			case 'new_call':
				console.log('- AGI new_call from ' + caller.callerNumber);
				io.emit('new_call', { caller: caller.callerNumber });
				break;
			case 'keypress':
				console.log('- AGI keypress(' + message.value + ') from ' + caller.callerNumber);
				io.emit('keypress', { caller: caller.callerNumber, value: message.value });
				break;
			case 'hangup':
				console.log('- AGI hangup from ' + caller.callerNumber);
				io.emit('hangup', { caller: caller.callerNumber });
				break;
		}
	});


	return {
		config:			config,
		info:			info,

		isFull:			isFull,
		isNoob:			isNoob,
		register:		register,
		intoBattle:		intoBattle,
		outtaBattle:	outtaBattle
	}
};