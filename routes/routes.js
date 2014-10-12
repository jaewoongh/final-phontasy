// Cover page
exports.cover = function(req, res) {
	res.render('cover', { version: req.app.get('version') });
};

// Test page
exports.test = function(req, res) {
	res.render('test', { layout: 'game' });
};