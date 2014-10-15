var game;

(function(scope) {
	function Game() {
		this.initialize();
	}
	var p = Game.prototype;
	var debug = true;
	var targetWidth = 1920;
	var targetHeight = 1280;
	var targetFPS = 30;

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
			x:		0.4,
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
				width:	1400,
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

		// Bosses
		var spritesheetBattleEnemyChicken = new createjs.SpriteSheet({
			images:		[this.assets[BATTLE_ENEMY_CHICKEN_SPR]],
			frames:		{
				width:	2520,
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

		// Start game
		this.startGame();
	};

	// Let the game start
	p.startGame = function() {
		if (debug) console.log('.. starting the game!')

		// Set game phase
		this.gamephase = 'init-title';

		// Set Ticker
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.setFPS(targetFPS);
		createjs.Ticker.addEventListener('tick', this.onTick.bind(this));
	};

	// Loop
	p.onTick = function() {
		switch (this.gamephase) {
			case 'init-title':
				if (debug) console.log('[Phase] init-title');

				// Add shape
				var shapeTitleBackbackground = new createjs.Shape();
				var shapeTitleBackground = new createjs.Shape();
				shapeTitleBackbackground.graphics.beginFill("#fff").drawRect(0, 0, this.canvas.width, this.canvas.height);
				shapeTitleBackground.graphics.beginFill("#000").drawRect(5, 5, this.canvas.width - 10, this.canvas.height - 10);
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

				// Change phase
				this.gamephase = 'title';
				break;

			case 'title':
				this.textTitleCallnow.visible = (createjs.Ticker.getTicks() % 60 < 5) ? false : true;
				this.stageTitle.update();
				break;

			case 'pre-battle':
				break;

			case 'battle':
				break;

			case 'after-battle':
				break;
		}
	};

	scope.Game = Game;
}(window));

window.onload = function() {
	game = new Game();
}