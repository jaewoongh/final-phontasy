console.log(' __, _ _, _  _, _,    __, _,_  _, _, _ ___  _,  _, , _');
console.log(' |_  | |\\ | /_\\ |     |_) |_| / \\ |\\ |  |  /_\\ (_  \\ |');
console.log(' |   | | \\| | | | ,   |   | | \\ / | \\|  |  | | , )  \\|');
console.log(' ~   ~ ~  ~ ~ ~ ~~~   ~   ~ ~  ~  ~  ~  ~  ~ ~  ~    )');
console.log('                                                    ~\'');

// Set up server via express
var express = require('express');
var app = express();
var server = require('http').Server(app);

// Load configurations
var config = require('./config.json');
var AGI_HOST = config.agi_host || '127.0.0.1';
var AGI_PORT = config.agi_port || 12001;
app.set('version', config.version);
app.set('gamename', config.gamename);
console.log('Version ' + app.get('version') + '\n' + 'Gamename ' + app.get('gamename') + '\n');

// Set up database (mongodb) and load models
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '- MongoDB connection error: '));
db.once('open', function() { console.log('MongoDB successfully connected'); });
var Hero = require('./models/hero')(mongoose);

// Set up socket.io
var io = require('socket.io')(server);
io.on('connection', function(socket) {
	socket.emit('greetings', { version: version });
});

// Set up AGI connection
var agi_net = require('./tinyphone/tinyphone_server/connectors/tinyphone_agi');
var agi = new agi_net.TinyphoneAGI();
agi.on('agi_event', function(message, caller) {
	console.log('- AGI event from ' + caller.callerNumber);
	console.dir(message);
	io.emit('agi', { caller: caller.callerNumber, message: message });
});
agi.start(AGI_HOST, AGI_PORT);

// Set up game
var game = require('./libs/game')(app.get('gamename'));

// Set render engine
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
	defaultLayout:	'site',
	extname:		'.html'
});
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// Routes
var path = require('path');
var routes = require('./routes/routes');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', routes.cover);
app.get('/test', routes.test);

// Query interfaces for Asterisk to get needed information easily
app.get('/hero/:num/isnoob', function(req, res) {
	Hero.findOne({ number: req.params.num }, function(err, hero) {
		res.send(hero == null);
	});
});
app.get('/hero/:num/register', function(req, res) {
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
});
app.get('/game/isfull', function(req, res) {
	res.send(game.isFull());
});

// Listen!
var port = process.env.PORT || 4444;
server.listen(port, function() {
	console.log('Server listening for HTTP connection on port %d', port);
});