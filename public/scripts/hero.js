(function(scope) {
	function Hero(data, spr, nametag) {
		this.initialize(data, spr, nametag);
	}
	var p = Hero.prototype

	p.initialize = function(data, spr, nametag) {
		this.sprite = spr;
		this.nametag = nametag;
		this.number = data.number;
		this.name = data.name;
		this.class = data.class;
		this.level = data.level;
		this.hp_max = data.hp_max;
		this.hp = this.hp_max;
		this.sp_max = data.sp_max;
		this.sp = this.sp_max;
		this.att = data.att;
		this.def = data.def;
		this.skills = data.skills;

		this.offsetX = 0;
		this.offsetY = 0;
	};

	scope.Hero = Hero;
}(window));