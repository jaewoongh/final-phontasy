var config = require('./config.json');
var AGI_HOST = config.agi_host || '127.0.0.1';
var AGI_PORT = config.agi_port || 12001;
var version = "Under Development";
console.log(' __, _ _, _  _, _,    __, _,_  _, _, _ ___  _,  _, , _');
console.log(' |_  | |\\ | /_\\ |     |_) |_| / \\ |\\ |  |  /_\\ (_  \\ |');
console.log(' |   | | \\| | | | ,   |   | | \\ / | \\|  |  | | , )  \\|');
console.log(' ~   ~ ~  ~ ~ ~ ~~~   ~   ~ ~  ~  ~  ~  ~  ~ ~  ~    )');
console.log('                                                    ~\'');
console.log('Version ' + version + '\n');

// Set up server via express
var express = require('express');
var app = express();
var server = require('http').Server(app);

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
	console.log('\n')
	io.emit('agi', { caller: caller.callerNumber, message: message });
});
agi.start(AGI_HOST, AGI_PORT);

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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) { res.render('cover', { version: version }); });
app.get('/test', function(req, res) { res.render('test', { layout: 'game' }); });
// app.get('/game/:gamename/play', game.play);
// app.get('/game/:gamename/halloffame', game.halloffame);

// Listen!
var port = process.env.PORT || 4444;
server.listen(port, function() {
	console.log('Server listening for HTTP connection on port %d', port);
	console.log('\n');
});