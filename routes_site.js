
// Cover page
exports.cover = function(req, res) {
	res.sendFile(__dirname + '/views/cover.html');
	res.render('cover', { version: version });
};