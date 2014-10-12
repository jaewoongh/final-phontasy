module.exports = function(mongoose) {
	var HeroSchema = new mongoose.Schema({
		number:				String,
		name:				String,
		class:				String,
		level:				Number,
		dateAppeared:		Date,
		history:		[{
			date:			Date,
			game:			String,
			result:			String
		}]
	});
	return mongoose.model('Hero', HeroSchema);
};