(function(scope) {
	function Hero(game, data, spr, nametag) {
		this.initialize(game, data, spr, nametag);
	}
	var p = Hero.prototype

	p.initialize = function(game, data, spr, nametag) {
		this.game = game;

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
		this.spd = data.spd;
		this.skills = data.skills;
		this.tp = Math.random() * 0.6;

		this.offsetX = 0;
		this.offsetY = 0;
		this.status = '';
		this.defending = false;
		this.isDead = false;
	};

	p.attack = function() {
		this.sprite.gotoAndPlay('attack');
		this.offsetX += 100 * game.scale;
		return parseInt((Math.random() * 0.2 + 0.8) * this.att);
	};

	p.hit = function(damage) {
		var defense = parseInt((Math.random() * 0.2 + 0.8) * this.def);
		if (this.defending) {
			defense *= 5;
		}
		var deal = damage - defense;
		if (deal < 0) deal = 0;
		this.hp -= deal;
		if (this.hp <= 0) {
			this.hp = 0;
			this.isDead = true;
			this.status = 'DEAD';
			this.sprite.gotoAndPlay('dead');
			this.offsetY += 60 * game.scale;
			game.showMessage(this.name + ' down!');
		} else {
			this.sprite.gotoAndPlay(this.defending ? 'defend' : 'hit');
			this.offsetX -= 80 * game.scale;
		}
		if (this.defending) {
			this.defending = false;
			this.status = '';
		}
		return deal;
	};

	scope.Hero = Hero;
}(window));