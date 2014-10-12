var config = require('./config.json');
var AGI_HOST = config.agi_host || '127.0.0.1';
var AGI_PORT = config.agi_port || 12001;
var version = "Under Development";
console.log(' (                       (                                    ');
console.log(' )\\ )               (    )\\ )   )              )              ');
console.log('(()/( (           ) )\\  (()/(( /(           ( /(   )    (     ');
console.log(' /(_)))\\  (    ( /(((_)  /(_))\\()) (   (    )\\()| /( (  )\\ )  ');
console.log('(_))_((_) )\\ ) )(_))_   (_))((_)\\  )\\  )\\ )(_))/)(_)))\\(()/(  ');
console.log('| |_  (_)_(_/(((_)_| |  | _ \\ |(_)((_)_(_/(| |_((_)_((_))(_)) ');
console.log('| __| | | \' \\)) _` | |  |  _/ \' \\/ _ \\ \' \\))  _/ _` (_-< || | ');
console.log('|_|   |_|_||_|\\__,_|_|  |_| |_||_\\___/_||_| \\__\\__,_/__/\\_, | ');
console.log('                                                        |__/  ');
console.log('Version ' + version + '\n');

// Set up express
var express = require('express');
var app = express();

// Set up AGI connection
var agi_net = require('./tinyphone/tinyphone_server/connectors/tinyphone_agi');
var agi = new agi_net.TinyphoneAGI();
agi.on('agi_event', function(message, caller) {
	console.log('- AGI event from ' + caller.callerNumber);
	console.dir(message);
	console.log('\n')
});
agi.start(AGI_HOST, AGI_PORT);

// Routes
var site = require('./routes_site');
var game = require('./routes_game');

app.get('/', site.cover);

app.get('/game/:gamename/play', game.play);
app.get('/game/:gamename/halloffame', game.halloffame);

// Listen!
app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'), function() {
	console.log('Server listening for HTTP connection on port %d', app.get('port'));
	console.log('\n');
});