module.exports = {
	'tester':	{
		'hp_max':		'120 + Math.floor(Math.pow((lv - 1) * 100, 0.7))',
		'sp_max':		'5 + ((lv > 8) ? 7 : lv - 1)',
		'att':			'30 + Math.floor(Math.pow((lv - 1) * 20, 0.7))',
		'def':			'10 + Math.floor(Math.pow((lv - 1) * 5, 0.7))',
		'spd':			'0.007',
		'skills':		[
			{ 'name':	'Attack', 	'cost':	0 },
			{ 'name':	'Defend', 	'cost':	1 },
			{ 'name':	'Provoke',	'cost':	0 }
		]
	}
};