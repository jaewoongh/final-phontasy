(function(scope) {
	function Boss(data) {
		this.initialize(data);
	}
	var p = Boss.prototype

	p.initialize = function(data) {
		this.sprite = data.sprite;
		this.name = data.name;
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

	scope.Boss = Boss;
}(window));