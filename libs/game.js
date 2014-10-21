module.exports = function(name, io, agi, mongoose) {
	var gamename = name;
	var max_players = 4;
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
	};

	var info = function() {
		return {
			gamename:		gamename,
			max_players:	max_players,
			players:		players
		}
	};

	var reset = function() {
		console.log('Resetting game');
		players = [];
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

	var won = function(data) {
		console.log('Game won against ' + data.bossName);
		console.dir(data.heroList);
		for (var i = 0; i < data.heroList.length; i++) {
			var n = i;
			Hero.findOne({ number: data.heroList[n].number }, function(err, hero) {
				if (err) return console.error(err);
				hero.level++;
				hero.history.push({
					date:			new Date,
					foughtAgainst:	data.bossName,
					result:			'won'
				});
				hero.save(function(err, hero) {
					if (err) return console.error(err);
					console.log('Added history for ' + hero.number + ': game won');
				});
			});
		}
	};

	var lost = function(data) {
		console.log('Game lost against ' + data.bossName);
		console.dir(data.heroList);
		for (var i = 0; i < data.heroList.length; i++) {
			var n = i;
			Hero.findOne({ number: data.heroList[n].number }, function(err, hero) {
				if (err) return console.error(err);
				hero.history.push({
					date:			new Date,
					foughtAgainst:	data.bossName,
					result:			'lost'
				});
				hero.save(function(err, hero) {
					if (err) return console.error(err);
					console.log('Added history for ' + hero.number + ': game lost');
				});
			});
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
			att:			eval(classData['att'].replace(/lv/g, hero.level)),
			def:			eval(classData['def'].replace(/lv/g, hero.level)),
			spd:			eval(classData['spd'].replace(/lv/g, hero.level)),
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
		reset:			reset,

		isFull:			isFull,
		isNoob:			isNoob,
		register:		register,
		intoBattle:		intoBattle,
		outtaBattle:	outtaBattle,
		won:			won,
		lost:			lost
	}
};