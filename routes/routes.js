// Cover page
exports.cover = function(req, res) {
	res.render('cover', { version: req.app.get('version') });
};

// Test page
exports.test = function(req, res) {
	res.render('test', { layout: false });
};

// Game page
exports.game = function(req, res) {
	res.render('game', { layout: false });
};