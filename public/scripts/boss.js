(function(scope) {
	function Boss(game, data) {
		this.initialize(game, data);
	}
	var p = Boss.prototype

	p.initialize = function(game, data) {
		this.game = game;

		this.sprite = data.sprite;
		this.name = data.name;
		this.hp_max = data.hp_max;
		this.hp = this.hp_max;
		this.sp_max = data.sp_max;
		this.sp = this.sp_max;
		this.att = data.att;
		this.def = data.def;
		this.spd = data.spd;
		this.skills = data.skills;
		this.tp = 0;

		this.offsetX = 0;
		this.offsetY = 0;
		this.status = '';

		this.target = parseInt(Math.random() * game.heroes.length);
	};

	p.playTurn = function() {
		if (!game.allkilled) {
			var targetHero = game.heroes[this.target];
			var isHeDefending = targetHero.defending;
			var dealtDamage = targetHero.hit(this.attack());
			if (isHeDefending) {
				if (dealtDamage > 0) {
					game.showMessage(targetHero.name + ' defended attack taking damage of ' + dealtDamage);
				} else {
					game.showMessage(targetHero.name + ' defended attack completely');
				}
			} else {
				game.showMessage(this.name + ' attacked ' + targetHero.name + ', dealing ' + dealtDamage + ' damage');
			}
			if (game.debug) console.log('[Boss] Attack on ' + targetHero.name);
			this.sprite.gotoAndPlay('attack');
			this.offsetX -= 120 * game.scale;
		}
	};

	p.attack = function() {
		return parseInt((Math.random() * 0.2 + 0.8) * this.att);
	};

	p.hit = function(damage, who) {
		var defense = parseInt((Math.random() * 0.2 + 0.8) * this.def);
		var deal = damage - defense;
		if (deal < 0) deal = 0;
		this.hp -= deal;
		if (this.hp <= 0) {
			this.hp = 0;
			this.status = 'dead';
			this.sprite.gotoAndPlay('dead');
			this.offsetY += 100 * game.scale;
			game.showMessage(this.name.toUpperCase() + ' HAS BEEN DEFEATED!');
			game.won();
			return -1;
		} else {
			this.sprite.gotoAndPlay('hit');
			this.offsetX += 120 * game.scale;
			if (Math.random() < 0.1 && this.target != who) {
				this.target = who;
				game.showMessage(this.name + ' changed target!');
			}
		}
		return deal;
	};

	scope.Boss = Boss;
}(window));