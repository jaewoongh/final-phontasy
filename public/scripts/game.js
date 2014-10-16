(function(scope) {
	function Game() {
		this.initialize();
	}
	var p = Game.prototype;
	var debug = true;
	var targetWidth = 1920;
	var targetHeight = 1280;
	var targetFPS = 30;
	var MAX_HEROES_NUM = 4;

	// Assets
	var TITLE_LOGO = 				['/assets/images/titlelogo.png'];
	var BATTLE_HERO_TESTER_SPR = 	['/assets/images/player.png'];
	var BATTLE_ENEMY_CHICKEN_SPR = 	['/assets/images/chicken.png'];
	var BATTLE_UI_MESSAGEBAR = 		['/assets/images/messagebar.png'];
	var BATTLE_UI_HEROBOX =			['/assets/images/playerbox.png'];
	var BATTLE_UI_COMMANDBOX =		['/assets/images/commandbox.png'];
	var BATTLE_UI_BOSSBOX =			['/assets/images/bossbox.png'];
	var BATTLE_UI_ATTACKINDICATOR =	['/assets/images/attack_indicator.png'];

	var assets = [].concat(
		TITLE_LOGO,
		BATTLE_HERO_TESTER_SPR,
		BATTLE_ENEMY_CHICKEN_SPR,
		BATTLE_UI_MESSAGEBAR,
		BATTLE_UI_HEROBOX,
		BATTLE_UI_COMMANDBOX,
		BATTLE_UI_BOSSBOX,
		BATTLE_UI_ATTACKINDICATOR
	);

	var spriteByClasses = [];

	// Initialize
	p.initialize = function() {
		if (debug) console.log('Initializing game..');

		// Set up a canvas
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'gameCanvas';
		this.canvas.height = window.innerHeight;
		this.scale = this.canvas.height / targetHeight;
		this.canvas.width = targetWidth * this.scale;
		// this.canvas.width = window.innerWidth;
		// this.scale = this.canvas.width / targetWidth;
		// this.canvas.height = targetHeight * this.scale;
		this.left = (window.innerWidth - this.canvas.width) * 0.5;
		this.canvas.setAttribute('style', 'position:absolute; left:' + this.left + 'px; z-index:1;');
		this.context = this.canvas.getContext('2d');
		this.context['imageSmoothingEnabled'] = false;
        this.context['mozImageSmoothingEnabled'] = false;
        this.context['oImageSmoothingEnabled'] = false;
        this.context['webkitImageSmoothingEnabled'] = false;
        this.context['msImageSmoothingEnabled'] = false;
        document.body.appendChild(this.canvas);

        // Create stages
        this.stageTitle = new createjs.Stage(this.canvas);
        this.stageBattle = new createjs.Stage(this.canvas);
        this.stageTitle.snapPixelEnabled = true;
        this.stageBattle.snapPixelEnabled = true;

        // Load assets
        this.assets = new AssetFactory();
        this.assets.onComplete = this.assetsLoaded.bind(this);
        this.assets.loadAssets(assets);

        // Initialize heroes array
        this.heroes = [];
	};

	// Assets loaded and now ready to go
	p.assetsLoaded = function() {
		if (debug) console.log('.. assets are loaded ..');

		// Title screen
		var option_bitmapTitleLogo = {
			x:		0.5,
			y:		0.3,
			regX:	0.5,
			regY:	0.5
		};
		this.bitmapTitleLogo = new createjs.Bitmap(this.assets[TITLE_LOGO]);
		this.bitmapTitleLogo.x = this.canvas.width * option_bitmapTitleLogo.x;
		this.bitmapTitleLogo.y = this.canvas.height * option_bitmapTitleLogo.y;
		this.bitmapTitleLogo.regX = this.bitmapTitleLogo.image.width * option_bitmapTitleLogo.regX;
		this.bitmapTitleLogo.regY = this.bitmapTitleLogo.image.height * option_bitmapTitleLogo.regY;
		this.bitmapTitleLogo.scaleX = this.bitmapTitleLogo.scaleY = this.scale;

		// Battle ui boxes
		var option_bitmapBattleUIMessageBar = {
			x:		0.5,
			y:		0.01,
			regX:	0.5,
			regY:	0
		};
		this.bitmapBattleUIMessageBar = new createjs.Bitmap(this.assets[BATTLE_UI_MESSAGEBAR]);
		this.bitmapBattleUIMessageBar.x = this.canvas.width * option_bitmapBattleUIMessageBar.x;
		this.bitmapBattleUIMessageBar.y = this.canvas.height * option_bitmapBattleUIMessageBar.y;
		this.bitmapBattleUIMessageBar.regX = this.bitmapBattleUIMessageBar.image.width * option_bitmapBattleUIMessageBar.regX;
		this.bitmapBattleUIMessageBar.regY = this.bitmapBattleUIMessageBar.image.height * option_bitmapBattleUIMessageBar.regY;
		this.bitmapBattleUIMessageBar.scaleX = this.bitmapBattleUIMessageBar.scaleY = this.scale;

		var option_bitmapBattleUIHeroBox = {
			x:		0.01,
			y:		0.89,
			regX:	0,
			regY:	1
		};
		this.bitmapBattleUIHeroBox = new createjs.Bitmap(this.assets[BATTLE_UI_HEROBOX]);
		this.bitmapBattleUIHeroBox.x = this.canvas.width * option_bitmapBattleUIHeroBox.x;
		this.bitmapBattleUIHeroBox.y = this.canvas.height * option_bitmapBattleUIHeroBox.y;
		this.bitmapBattleUIHeroBox.regX = this.bitmapBattleUIHeroBox.image.width * option_bitmapBattleUIHeroBox.regX;
		this.bitmapBattleUIHeroBox.regY = this.bitmapBattleUIHeroBox.image.height * option_bitmapBattleUIHeroBox.regY;
		this.bitmapBattleUIHeroBox.scaleX = this.bitmapBattleUIHeroBox.scaleY = this.scale;

		var option_bitmapBattleUICommandBox = {
			x:		0.435,
			y:		0.89,
			regX:	0,
			regY:	1
		};
		this.bitmapBattleUICommandBox = new createjs.Bitmap(this.assets[BATTLE_UI_COMMANDBOX]);
		this.bitmapBattleUICommandBox.x = this.canvas.width * option_bitmapBattleUICommandBox.x;
		this.bitmapBattleUICommandBox.y = this.canvas.height * option_bitmapBattleUICommandBox.y;
		this.bitmapBattleUICommandBox.regX = this.bitmapBattleUICommandBox.image.width * option_bitmapBattleUICommandBox.regX;
		this.bitmapBattleUICommandBox.regY = this.bitmapBattleUICommandBox.image.height * option_bitmapBattleUICommandBox.regY;
		this.bitmapBattleUICommandBox.scaleX = this.bitmapBattleUICommandBox.scaleY = this.scale;

		var option_bitmapBattleUIBossBox = {
			x:		0.99,
			y:		0.89,
			regX:	1,
			regY:	1
		};
		this.bitmapBattleUIBossBox = new createjs.Bitmap(this.assets[BATTLE_UI_BOSSBOX]);
		this.bitmapBattleUIBossBox.x = this.canvas.width * option_bitmapBattleUIBossBox.x;
		this.bitmapBattleUIBossBox.y = this.canvas.height * option_bitmapBattleUIBossBox.y;
		this.bitmapBattleUIBossBox.regX = this.bitmapBattleUIBossBox.image.width * option_bitmapBattleUIBossBox.regX;
		this.bitmapBattleUIBossBox.regY = this.bitmapBattleUIBossBox.image.height * option_bitmapBattleUIBossBox.regY;
		this.bitmapBattleUIBossBox.scaleX = this.bitmapBattleUIBossBox.scaleY = this.scale;

		// Heroes
		var spritesheetBattleHeroTester = new createjs.SpriteSheet({
			images:		[this.assets[BATTLE_HERO_TESTER_SPR]],
			frames:		{
				width:	200,
				height:	170,
				count:	7
			},
			animations:	{
				portrait:	{ frames: [0] },
				stand:		{ frames: [1] },
				hit:		{ frames: [2] },
				dead:		{ frames: [3] },
				attack:		{ frames: [4] },
				defend:		{ frames: [5] },
				provoke:	{ frames: [6] }
			}
		});
		this.spriteBattleHeroTester = new createjs.Sprite(spritesheetBattleHeroTester);
		spriteByClasses['tester'] = this.spriteBattleHeroTester;

		this.textBattleHeroNametag = new createjs.Text('nametag', (50 * this.scale) + 'px VT323', '#fff');
		this.textBattleHeroNametag.textAlign = 'center';

		// Bosses
		var spritesheetBattleEnemyChicken = new createjs.SpriteSheet({
			images:		[this.assets[BATTLE_ENEMY_CHICKEN_SPR]],
			frames:		{
				width:	630,
				height:	540,
				count:	4
			},
			animations: {
				stand:		{ frames: [0] },
				hit:		{ frames: [1] },
				dead:		{ frames: [2] },
				attack:		{ frames: [3] }
			}
		});
		this.spriteBattleEnemyChicken = new createjs.Sprite(spritesheetBattleEnemyChicken);

		// Set boss pool
		this.setBossPool();

		// Start game
		this.startGame();
	};

	// Set boss pool
	p.setBossPool = function() {
		this.bossPool = {
			easy:	[
				{	name: 		'Chicken',
					sprite:		this.spriteBattleEnemyChicken,
					hp_max:		500,
					sp_max:		10,
					att:		35,
					def:		0,
					skills:		[]
				}
			]
		};
	};

	// Let the game start
	p.startGame = function() {
		if (debug) console.log('.. starting the game!')

		// Set game phase
		this.gamephase = 'init';

		// Set Ticker
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.setFPS(targetFPS);
		createjs.Ticker.addEventListener('tick', this.onTick.bind(this));
	};

	// Loop
	p.onTick = function() {
		switch (this.gamephase) {
			case 'init':
				if (debug) console.log('[Phase] init');

				// Init things for title screen
				// Add shape
				var shapeTitleBackbackground = new createjs.Shape();
				var shapeTitleBackground = new createjs.Shape();
				shapeTitleBackbackground.graphics.beginFill('#fff').drawRect(0, 0, this.canvas.width, this.canvas.height);
				shapeTitleBackground.graphics.beginFill('#000').drawRect(5, 5, this.canvas.width - 10, this.canvas.height - 10);
				this.stageTitle.addChild(shapeTitleBackbackground);
				this.stageTitle.addChild(shapeTitleBackground);

				// Add image
				this.stageTitle.addChild(this.bitmapTitleLogo);

				// Add text
				this.textTitleCallnow = new createjs.Text('CALL 206-203-5518 TO BE A HERO', (90 * this.scale) + 'px VT323', '#fff');
				this.textTitleCallnow.textAlign = 'center';
				this.textTitleCallnow.x = this.canvas.width * 0.5;
				this.textTitleCallnow.y = this.canvas.height * 0.55;
				this.stageTitle.addChild(this.textTitleCallnow);

				this.textTitleCountdown = new createjs.Text('GAME STARTS IN X SECONDS', (60 * this.scale) + 'px VT323', '#fff');
				this.textTitleCountdown.textAlign = 'center';
				this.textTitleCountdown.x = this.canvas.width * 0.5;
				this.textTitleCountdown.y = this.canvas.height * 0.65;
				this.stageTitle.addChild(this.textTitleCountdown);


				// Init things for battle screen
				// Add shape
				this.shapeBattleBackground = new createjs.Shape();
				this.shapeBattleBackground.graphics.beginFill('#80d8ca').drawRect(0, 0, this.canvas.width, this.canvas.height);
				this.stageBattle.addChild(this.shapeBattleBackground);

				this.shapeBattleBanner = new createjs.Shape();
				this.shapeBattleBanner.graphics.beginFill('#ff82a5').drawRect(0, this.canvas.height * 0.9, this.canvas.width, this.canvas.height * 0.1);
				this.stageBattle.addChild(this.shapeBattleBanner);

				// Add text
				this.textBattleBanner = new createjs.Text('CALL FOR HEROES! 206-203-5518 NOW!', (120 * this.scale) + 'px VT323', '#b90064');
				this.textBattleBanner.textAlign = 'center';
				this.textBattleBanner.x = this.canvas.width * 0.5;
				this.textBattleBanner.y = this.canvas.height * 0.9;
				this.stageBattle.addChild(this.textBattleBanner);

				// Add images
				this.stageBattle.addChild(this.bitmapBattleUIMessageBar);
				this.stageBattle.addChild(this.bitmapBattleUIHeroBox);
				this.stageBattle.addChild(this.bitmapBattleUIBossBox);
				this.stageBattle.addChild(this.bitmapBattleUICommandBox);

				// Change phase
				this.gamephase = 'pre-title';
				if (debug) console.log('[Phase] pre-title');
				break;

			case 'pre-title':
				// Set anything needed before going to title phase
				this.titleCountdownStart = createjs.Ticker.getTime();
				this.titleCountdownEnd = this.titleCountdownStart - 1000;

				// Change phase
				this.gamephase = 'title';
				if (debug) console.log('[Phase] title');
				break;

			case 'title':
				// Blink "join" text
				this.textTitleCallnow.visible = (createjs.Ticker.getTicks() % 60 < 5 || this.heroes.length >= MAX_HEROES_NUM) ? false : true;

				// Show/hide "game starts in" text
				if (this.titleCountdownStart > this.titleCountdownEnd) {
					this.textTitleCountdown.visible = false;
				} else {
					this.textTitleCountdown.visible = true;
					var sec = (this.titleCountdownEnd - createjs.Ticker.getTime()) * 0.001;
					this.textTitleCountdown.text = 'GAME STARTS IN ' + Math.round(sec) + ' SECOND' + (Math.round(sec) > 1 ? 'S' : '');
					if (sec <= 0) {
						if (debug) console.log('[Phase] pre-battle');
						this.gamephase = 'pre-battle';
					}
				}

				// Show joined heroes
				for (var i = 0; i < this.heroes.length; i++) {
					var hero = this.heroes[i];
					if (!this.stageTitle.contains(hero.sprite)) {
						hero.sprite.gotoAndPlay('portrait');
						this.stageTitle.addChild(hero.sprite);
						this.stageTitle.addChild(hero.nametag);
					}
					hero.sprite.x = 	(0.2 + 0.2 * i)	* this.canvas.width;
					hero.sprite.y = 	(0.95)			* this.canvas.height;
					hero.sprite.regX = 	(0.5)			* hero.sprite.getBounds().width;
					hero.sprite.regY = 	(1)				* hero.sprite.getBounds().height;
					hero.sprite.scaleX = hero.sprite.scaleY = this.scale;

					hero.nametag.text = hero.name;
					hero.nametag.x = hero.sprite.x;
					hero.nametag.y = hero.sprite.y - hero.sprite.getBounds().height * this.scale;
					hero.nametag.regY = 2 * hero.nametag.getMeasuredLineHeight();
				}

				// Update canvas
				this.stageTitle.update();
				break;

			case 'pre-battle':
				// Pick boss character
				var difficulty = 'easy';
				var pick = Math.floor(Math.random() * this.bossPool[difficulty].length);
				this.pickedBoss = new Boss(this.bossPool[difficulty][pick]);
				if (debug) console.log('[Bosspick]', this.pickedBoss);

				// Change phase
				this.gamephase = 'battle';
				if (debug) console.log('[Phase] battle');
				break;

			case 'battle':
				// Set/blink banner text
				this.textBattleBanner.text = (this.heroes >= MAX_HEROES_NUM) ? 'BECOME A HERO! CALL 206-203-5518' : 'CALL FOR HEORES! 206-203-5518 NOW!';
				this.textBattleBanner.visible = (createjs.Ticker.getTicks() % 150 < 5) ? false : true;

				// Draw heroes
				for (var i = 0; i < this.heroes.length; i++) {
					var hero = this.heroes[i];
					if (!this.stageBattle.contains(hero.sprite)) {
						hero.sprite.gotoAndPlay('stand');
						this.stageBattle.addChild(hero.sprite);
						this.stageBattle.addChild(hero.nametag);
					}
					hero.sprite.x = 	(0.18)				* this.canvas.width;
					hero.sprite.y = 	(i * 0.14 + 0.25)	* this.canvas.height;
					hero.sprite.regX = 	(0.5)				* hero.sprite.getBounds().width;
					hero.sprite.regY = 	(1)					* hero.sprite.getBounds().height;
					hero.sprite.scaleX = hero.sprite.scaleY = this.scale;

					hero.nametag.text = hero.name;
					hero.nametag.textAlign = 'right';
					hero.nametag.x = hero.sprite.x - hero.sprite.getBounds().width * 0.6 * this.scale;
					hero.nametag.y = hero.sprite.y - hero.sprite.getBounds().height * 0.8 * this.scale;
					hero.nametag.regY = hero.nametag.getMeasuredLineHeight();
				}

				// Draw boss
				if (!this.stageBattle.contains(this.pickedBoss.sprite)) {
					this.pickedBoss.sprite.gotoAndPlay('stand');
					this.pickedBoss.sprite.x = 		0.77	* this.canvas.width;
					this.pickedBoss.sprite.y =		0.6		* this.canvas.height;
					this.pickedBoss.sprite.regX = 	0.5		* this.pickedBoss.sprite.getBounds().width;
					this.pickedBoss.sprite.regY = 	1		* this.pickedBoss.sprite.getBounds().height;
					this.pickedBoss.sprite.scaleX = this.pickedBoss.sprite.scaleY = this.scale;
					this.stageBattle.addChild(this.pickedBoss.sprite);
				}

				// Update canvas
				this.stageBattle.update();
				break;

			case 'defeated':
				if (debug) console.log('[Phase] title');
				this.gamephase = 'pre-title';
				break;
		}
	};

	// Server/AGI events via socket
	// New number has been connected
	p.onNewcall = function(data) {

	};

	// Numkey has been pressed
	p.onKeypress = function(data) {

	};

	// A number has been disconnected
	p.onHangup = function(data) {
		for (var i = this.heroes.length - 1; i >= 0; i--) {
			var hero = this.heroes[i];
			if (hero.number != data.caller) continue;
			this.kickHero(i, 'hangup');
		}
	};

	// New player joined
	p.onJoin = function(hero) {
		if (debug) console.log('[Join]', hero);
		if (this.heroes.length > MAX_HEROES_NUM) {
			if (debug) console.log('[WRONG!] It\'s already fullhouse, but new hero joined.');
			return;
		}

		// Create new hero
		var newHero = new Hero(hero, spriteByClasses[hero.class].clone(), this.textBattleHeroNametag.clone());
		this.heroes.push(newHero);

		// Update things need to be changed according to number of players
		this.heroNumberChanged();
	};

	// Kick a hero
	p.kickHero = function(index, reason) {
		var kickedHero = this.heroes.splice(index, 1)[0];
		if (debug) console.log('[Kick] ' + kickedHero.number + ' (' + reason + ')');
		socket.emit('outtaBattle', {
			number:		kickedHero.number,
			reason:		reason
		});
		this.stageTitle.removeChild(kickedHero.sprite);
		this.stageTitle.removeChild(kickedHero.nametag);
		this.stageBattle.removeChild(kickedHero.sprite);
		this.stageBattle.removeChild(kickedHero.nametag);

		// Update things need to be changed according to number of players
		this.heroNumberChanged();
	};

	// Update things need to be changed according to number of players
	p.heroNumberChanged = function() {
		switch (this.gamephase) {
			case 'title':
				this.titleCountdownStart = createjs.Ticker.getTime();
				var count;
				switch (this.heroes.length) {
					case 0:	count = -1000;	break;
					case 1:	count = 10000;	break;
					case 2:	count = 10000;	break;
					case 3: count = 5000;	break;
					case 4: count = 3000;	break;
				}
				this.titleCountdownEnd = this.titleCountdownStart + count;
				break;

			case 'battle':
				if (this.heroes.length <= 0) {
					if (debug) console.log('[Phase] defeated');
					this.gamephase = 'defeated';
				}
				break;
		}
	};

	scope.Game = Game;
}(window));