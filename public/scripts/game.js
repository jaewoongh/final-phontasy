(function(scope) {
	function Game() {
		this.initialize();
	}
	var p = Game.prototype;
	var debug = true;
	this.debug = debug;

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
        this.allHeroesFought = [];
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

		// Attack indicator
		var option_bitmapBattleUIAttackIndicator = {
			x:		0.3,
			regX:	0,
			regY:	1
		};
		this.bitmapBattleUIAttackIndicator = new createjs.Bitmap(this.assets[BATTLE_UI_ATTACKINDICATOR]);
		this.bitmapBattleUIAttackIndicator.x = this.canvas.width * option_bitmapBattleUIAttackIndicator.x;
		this.bitmapBattleUIAttackIndicator.regX = this.bitmapBattleUIAttackIndicator.image.width * option_bitmapBattleUIAttackIndicator.regX;
		this.bitmapBattleUIAttackIndicator.regY = this.bitmapBattleUIAttackIndicator.image.height * option_bitmapBattleUIAttackIndicator.regY;
		this.bitmapBattleUIAttackIndicator.scaleX = this.bitmapBattleUIAttackIndicator.scaleY = this.scale;

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
				hit:		{ frames: [2],	speed: 0.1,		next: 'stand' },
				dead:		{ frames: [3] },
				attack:		{ frames: [4],	speed: 0.2,		next: 'stand' },
				defend:		{ frames: [5],	speed: 0.05,	next: 'stand' },
				provoke:	{ frames: [6],	speed: 0.01,	next: 'stand' }
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
				hit:		{ frames: [1],	speed: 0.1,	next: 'stand' },
				dead:		{ frames: [2] },
				attack:		{ frames: [3],	speed: 0.1,	next: 'stand' }
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
					hp_max:		800,
					sp_max:		10,
					att:		50,
					def:		0,
					spd:		0.004,
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

				this.gameover = false;

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

				// Add banner text
				this.textBattleBanner = new createjs.Text('CALL FOR HEROES! 206-203-5518 NOW!', (120 * this.scale) + 'px VT323', '#b90064');
				this.textBattleBanner.textAlign = 'center';
				this.textBattleBanner.x = this.canvas.width * 0.5;
				this.textBattleBanner.y = this.canvas.height * 0.9;
				this.stageBattle.addChild(this.textBattleBanner);

				// Add UI
				this.stageBattle.addChild(this.bitmapBattleUIMessageBar);
				this.stageBattle.addChild(this.bitmapBattleUIHeroBox);
				this.stageBattle.addChild(this.bitmapBattleUIBossBox);
				this.stageBattle.addChild(this.bitmapBattleUICommandBox);

				// Add attack indicator
				this.stageBattle.addChild(this.bitmapBattleUIAttackIndicator);

				// Texts/shapes for UI
				this.textBattleUIMessageBar = new createjs.Text('',  (80 * this.scale) + 'px VT323', '#fff');
				this.textBattleUIMessageBar.textAlign = 'left';
				this.textBattleUIMessageBar.x = this.bitmapBattleUIMessageBar.x - (this.bitmapBattleUIMessageBar.image.width * this.scale) * 0.48;
				this.textBattleUIMessageBar.y = this.bitmapBattleUIMessageBar.y + (this.bitmapBattleUIMessageBar.image.height * this.scale) * 0.15;
				this.stageBattle.addChild(this.textBattleUIMessageBar);

				this.textBattleUIHeroBoxHeader = new createjs.Text('',  (35 * this.scale) + 'px VT323', '#fff');
				this.textBattleUIHeroBoxHeader.textAlign = 'left';
				this.textBattleUIHeroBoxHeader.x = this.bitmapBattleUIHeroBox.x + (this.bitmapBattleUIHeroBox.image.width * this.scale) * 0.18;
				this.textBattleUIHeroBoxHeader.y = this.bitmapBattleUIHeroBox.y - (this.bitmapBattleUIHeroBox.image.height * this.scale) * 0.93;
				this.stageBattle.addChild(this.textBattleUIHeroBoxHeader);
				this.textBattleUIHeroBoxHeader.text = 'NAME    HP             SP   TP';

				this.textBattleUIHeroBoxName = new createjs.Text('',  (50 * this.scale) + 'px VT323', '#fff');
				this.textBattleUIHeroBoxName.textAlign = 'right';
				this.textBattleUIHeroBoxName.x = this.bitmapBattleUIHeroBox.x + (this.bitmapBattleUIHeroBox.image.width * this.scale) * 0.25;
				this.textBattleUIHeroBoxName.y = this.bitmapBattleUIHeroBox.y - (this.bitmapBattleUIHeroBox.image.height * this.scale) * 0.8;
				this.stageBattle.addChild(this.textBattleUIHeroBoxName);

				this.textBattleUIHeroBoxHP = new createjs.Text('',  (50 * this.scale) + 'px VT323', '#fff');
				this.textBattleUIHeroBoxHP.textAlign = 'right';
				this.textBattleUIHeroBoxHP.x = this.bitmapBattleUIHeroBox.x + (this.bitmapBattleUIHeroBox.image.width * this.scale) * 0.52;
				this.textBattleUIHeroBoxHP.y = this.bitmapBattleUIHeroBox.y - (this.bitmapBattleUIHeroBox.image.height * this.scale) * 0.8;
				this.stageBattle.addChild(this.textBattleUIHeroBoxHP);

				this.textBattleUIHeroBoxSP = new createjs.Text('',  (50 * this.scale) + 'px VT323', '#fff');
				this.textBattleUIHeroBoxSP.textAlign = 'right';
				this.textBattleUIHeroBoxSP.x = this.bitmapBattleUIHeroBox.x + (this.bitmapBattleUIHeroBox.image.width * this.scale) * 0.62;
				this.textBattleUIHeroBoxSP.y = this.bitmapBattleUIHeroBox.y - (this.bitmapBattleUIHeroBox.image.height * this.scale) * 0.8;
				this.stageBattle.addChild(this.textBattleUIHeroBoxSP);

				this.shapeBattleUIHeroBoxTP = [];
				this.shapeBattleUIHeroBoxTPBackground = [];
				this.TPX = this.bitmapBattleUIHeroBox.image.width * this.scale * 0.68;
				this.TPY = function(i) {
					return this.bitmapBattleUIHeroBox.y - this.bitmapBattleUIHeroBox.image.height * this.scale * (0.75 - 0.17 * i);
				};
				this.TPWidth = this.bitmapBattleUIHeroBox.image.width * this.scale * 0.28;
				this.TPHeight = this.bitmapBattleUIHeroBox.image.height * 0.04;
				for (var i = 0; i < MAX_HEROES_NUM; i++) {
					var shapeTPBackground = new createjs.Shape();
					shapeTPBackground.graphics.beginFill('#3094e0').drawRect(this.TPX, this.TPY(i), this.TPWidth, this.TPHeight);
					this.stageBattle.addChild(shapeTPBackground);
					this.shapeBattleUIHeroBoxTPBackground.push(shapeTPBackground);

					var shapeTP = new createjs.Shape();
					this.stageBattle.addChild(shapeTP);
					this.shapeBattleUIHeroBoxTP.push(shapeTP);
				}

				this.textBattleUIBossBoxName = new createjs.Text('', (70 * this.scale) + 'px VT323', '#fff');
				this.textBattleUIBossBoxName.textAlign = 'left';
				this.textBattleUIBossBoxName.x = this.bitmapBattleUIBossBox.x - (this.bitmapBattleUIBossBox.image.width * this.scale) * 0.93;
				this.textBattleUIBossBoxName.y = this.bitmapBattleUIBossBox.y - (this.bitmapBattleUIBossBox.image.height * this.scale) * 0.8;
				this.stageBattle.addChild(this.textBattleUIBossBoxName);

				this.TPXBoss = this.textBattleUIBossBoxName.x;
				this.TPYBoss = this.bitmapBattleUIBossBox.y - (this.bitmapBattleUIBossBox.image.height * this.scale) * 0.4;
				this.TPWidthBoss = this.bitmapBattleUIBossBox.image.width * this.scale * 0.85;
				this.shapeBattleUIBossBoxTPBackground = new createjs.Shape();
				this.shapeBattleUIBossBoxTPBackground.graphics.beginFill('#3094e0').drawRect(this.TPXBoss, this.TPYBoss, this.TPWidthBoss, this.TPHeight);
				this.stageBattle.addChild(this.shapeBattleUIBossBoxTPBackground);
				this.shapeBattleUIBossBoxTP = new createjs.Shape();
				this.stageBattle.addChild(this.shapeBattleUIBossBoxTP);

				this.textBattleUICommandBoxHeader = new createjs.Text('',  (35 * this.scale) + 'px VT323', '#fff');
				this.textBattleUICommandBoxHeader.textAlign = 'left';
				this.textBattleUICommandBoxHeader.x = this.bitmapBattleUICommandBox.x + (this.bitmapBattleUICommandBox.image.width * this.scale) * 0.08;
				this.textBattleUICommandBoxHeader.y = this.bitmapBattleUICommandBox.y - (this.bitmapBattleUICommandBox.image.height * this.scale) * 0.93;
				this.stageBattle.addChild(this.textBattleUICommandBoxHeader);

				this.textBattleUICommandBox = new createjs.Text('',  (50 * this.scale) + 'px VT323', '#fff');
				this.textBattleUICommandBox.textAlign = 'left';
				this.textBattleUICommandBox.x = this.bitmapBattleUICommandBox.x + (this.bitmapBattleUICommandBox.image.width * this.scale) * 0.05;
				this.textBattleUICommandBox.y = this.bitmapBattleUICommandBox.y - (this.bitmapBattleUICommandBox.image.height * this.scale) * 0.8;
				this.stageBattle.addChild(this.textBattleUICommandBox);

				// Change phase
				this.gamephase = 'pre-title';
				if (debug) console.log('[Phase] pre-title');
				break;

			case 'pre-title':
				// Set anything needed before going to title phase
				this.titleCountdownStart = createjs.Ticker.getTime();
				this.titleCountdownEnd = this.titleCountdownStart - 1000;
				for (var i = 0; i < this.heroes.length; i++) {
					this.stageTitle.removeChild(this.heroes[i].sprite);
					this.stageBattle.removeChild(this.heroes[i].sprite);
				}
				this.heroes = [];
				this.allHeroesFought = [];
				if (this.pickedBoss) {
					this.stageBattle.removeChild(this.pickedBoss.sprite);
					this.pickedBoss = undefined;
				}
				socket.emit('reset');

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

					hero.nametag.text = 'Lv.' + hero.level + '\n' + hero.name;
					hero.nametag.lineHeight = hero.nametag.getMeasuredLineHeight() * 2;
					hero.nametag.x = hero.sprite.x;
					hero.nametag.y = hero.sprite.y - hero.sprite.getBounds().height * this.scale - hero.nametag.lineHeight;
					hero.nametag.regY = 2 * hero.nametag.getMeasuredLineHeight();
				}

				// Update canvas
				this.stageTitle.update();
				break;

			case 'pre-battle':
				// Pick boss character
				var difficulty = 'easy';
				var pick = Math.floor(Math.random() * this.bossPool[difficulty].length);
				this.pickedBoss = new Boss(this, this.bossPool[difficulty][pick]);
				this.textBattleUIBossBoxName.text = this.pickedBoss.name;
				this.showMessage('Wild ' + this.pickedBoss.name.toUpperCase() + ' appeared!');
				if (debug) console.log('[Bosspick]', this.pickedBoss);


				// Settings needed before battle
				this.whosturn = null;
				this.pauseTP = false;
				this.allkilled = false;
				this.gameover = false;

				// Change phase
				this.gamephase = 'battle';
				if (debug) console.log('[Phase] battle');
				break;

			case 'battle':
				if (this.gameover) break;

				// Set/blink banner text
				this.textBattleBanner.text = (this.heroes >= MAX_HEROES_NUM) ? 'BECOME A HERO! CALL 206-203-5518' : 'CALL FOR HEORES! 206-203-5518 NOW!';
				this.textBattleBanner.visible = (createjs.Ticker.getTicks() % 150 < 5) ? false : true;

				// Update timing values for heroes
				if (!this.pauseTP) {
					for (var i = 0; i < this.heroes.length; i++) {
						if (this.heroes[i].isDead) continue;
						this.heroes[i].tp += this.heroes[i].spd;
						if (this.heroes[i].tp >= 1) {
							this.heroes[i].tp = 1;
							this.whosturn = i;
							this.pauseTP = true;
						}
					}
				}

				// Update timing value for the boss
				if (!this.pauseTP) {
					this.pickedBoss.tp += this.pickedBoss.spd;
					if (this.pickedBoss.tp >= 1) {
						this.pickedBoss.tp = 1;
						this.whosturn = 'boss';
						this.pauseTP = true;
					}
				}

				// Draw heroes
				for (var i = 0; i < this.heroes.length; i++) {
					var hero = this.heroes[i];
					if (!this.stageBattle.contains(hero.sprite)) {
						hero.sprite.gotoAndPlay('stand');
						this.stageBattle.addChild(hero.sprite);
						this.stageBattle.addChild(hero.nametag);
					}
					hero.sprite.x = 	(0.18)				* this.canvas.width		+ hero.offsetX;
					hero.sprite.y = 	(i * 0.14 + 0.25)	* this.canvas.height	+ hero.offsetY;
					hero.sprite.regX = 	(0.5)				* hero.sprite.getBounds().width;
					hero.sprite.regY = 	(1)					* hero.sprite.getBounds().height;
					hero.sprite.scaleX = hero.sprite.scaleY = this.scale;

					hero.offsetX += -hero.offsetX * 0.3;
					hero.offsetY += -hero.offsetY * 0.3;
					if (i == this.whosturn) {
						hero.offsetX = 150 * this.scale;
						if (hero.defending) {
							hero.defending = false;
							hero.status = '';
						}
					}

					hero.nametag.text = 'Lv.' + hero.level + '\n' + hero.name + (hero.status == '' ? '' : '\n' + hero.status);
					hero.nametag.textAlign = 'right';
					hero.nametag.lineHeight = hero.nametag.getMeasuredLineHeight() * 2;
					hero.nametag.x = hero.sprite.x - hero.sprite.getBounds().width * 0.6 * this.scale;
					hero.nametag.y = hero.sprite.y - hero.sprite.getBounds().height * 0.8 * this.scale;
					hero.nametag.regY = hero.nametag.getMeasuredLineHeight();
				}

				// Draw boss
				if (!this.stageBattle.contains(this.pickedBoss.sprite)) {
					this.pickedBoss.sprite.gotoAndPlay('stand');
					this.pickedBoss.sprite.regX = 	0.5		* this.pickedBoss.sprite.getBounds().width;
					this.pickedBoss.sprite.regY = 	1		* this.pickedBoss.sprite.getBounds().height;
					this.pickedBoss.sprite.scaleX = this.pickedBoss.sprite.scaleY = this.scale;
					this.stageBattle.addChild(this.pickedBoss.sprite);
				}
				this.pickedBoss.sprite.x = 		0.77	* this.canvas.width		+ this.pickedBoss.offsetX;
				this.pickedBoss.sprite.y =		0.6		* this.canvas.height	+ this.pickedBoss.offsetY;
				this.pickedBoss.offsetX += -this.pickedBoss.offsetX * 0.3;
				this.pickedBoss.offsetY += -this.pickedBoss.offsetY * 0.3;

				// Draw attack indicator
				if (this.heroes[this.pickedBoss.target] == undefined) this.pickedBoss.target = parseInt(Math.random() * this.heroes.length);
				if (this.heroes[this.pickedBoss.target] != undefined) {
					var n = 0;
					while (this.heroes[this.pickedBoss.target].isDead) {
						this.pickedBoss.target = parseInt(Math.random() * this.heroes.length);
						if (n++ > 20) {
							var allkilled = true;
							for (var i = 0; i < this.heroes.length; i++) {
								if (!this.heroes[i].isDead) allkilled = false;
							}
							if (allkilled) {
								if (debug) console.log('[Allkilled]');
								this.stageBattle.removeChild(this.bitmapBattleUIAttackIndicator);
								this.allkilled = true;
								this.pauseTP = true;
								this.lost();
								return;
							}
							break;
						}
					}
					if (!this.allkilled) {
						if (!this.stageBattle.contains(this.bitmapBattleUIAttackIndicator)) this.stageBattle.addChild(this.bitmapBattleUIAttackIndicator);
						this.bitmapBattleUIAttackIndicator.x = this.canvas.width * 0.3 + (Math.sin(createjs.Ticker.getTicks() / 3) * 10 * this.scale);
						this.bitmapBattleUIAttackIndicator.y = (this.pickedBoss.target * 0.14 + 0.25) * this.canvas.height;
					}
				}

				// Draw UI
				// Hero box
				this.textBattleUIHeroBoxName.text = '';
				this.textBattleUIHeroBoxHP.text = '';
				this.textBattleUIHeroBoxSP.text = '';
				for (var i = 0; i < MAX_HEROES_NUM; i++) {
					if (i < this.heroes.length) {
						var newline = (i < this.heroes.length - 1 ? '\n' : '');
						this.textBattleUIHeroBoxName.text += this.heroes[i].name + newline;
						this.textBattleUIHeroBoxHP.text += this.heroes[i].hp + ' / ' + this.heroes[i].hp_max + newline;
						this.textBattleUIHeroBoxSP.text += this.heroes[i].sp + newline;
						this.shapeBattleUIHeroBoxTPBackground[i].visible = true;
						this.shapeBattleUIHeroBoxTP[i].visible = true;
						this.shapeBattleUIHeroBoxTP[i].graphics.clear();
						this.shapeBattleUIHeroBoxTP[i].graphics.beginFill('#fff').drawRect(this.TPX, this.TPY(i), this.TPWidth * this.heroes[i].tp, this.TPHeight);
					} else {
						this.shapeBattleUIHeroBoxTPBackground[i].visible = false;
						this.shapeBattleUIHeroBoxTP[i].visible = false;
					}
				}
				this.textBattleUIHeroBoxName.lineHeight = this.textBattleUIHeroBoxName.getMeasuredLineHeight() * 2;
				this.textBattleUIHeroBoxHP.lineHeight = this.textBattleUIHeroBoxHP.getMeasuredLineHeight() * 2;
				this.textBattleUIHeroBoxSP.lineHeight = this.textBattleUIHeroBoxSP.getMeasuredLineHeight() * 2;

				// Command box
				if (typeof this.whosturn !== 'number') {
					this.bitmapBattleUICommandBox.visible = false;
					this.textBattleUICommandBoxHeader.visible = false;
					this.textBattleUICommandBox.visible = false;
					if (this.whosturn == 'boss') {
						this.pickedBoss.playTurn();
						this.pickedBoss.tp = 0;
						this.whosturn = null;
						this.pauseTP = false;
					}
				} else if (!this.bitmapBattleUICommandBox.visible) {
					this.bitmapBattleUICommandBox.visible = true;
					this.textBattleUICommandBoxHeader.visible = true;
					this.textBattleUICommandBox.visible = true;
					var heroOnTurn = this.heroes[this.whosturn];
					this.textBattleUICommandBoxHeader.text = 'COMMAND';
					this.textBattleUICommandBox.text = '';
					for (var i = 0; i < heroOnTurn.skills.length; i++) {
						this.textBattleUICommandBox.text += '[' + (i + 1) + '] ' + heroOnTurn.skills[i].name + (heroOnTurn.skills[i].cost > 0 ? ' (' + heroOnTurn.skills[i].cost + ')' : '') + (i < heroOnTurn.skills.length - 1 ? '\n' : '');
					}
					this.textBattleUICommandBox.lineHeight = this.textBattleUICommandBox.getMeasuredLineHeight() * 2;
				}

				// Boss box
				this.shapeBattleUIBossBoxTP.graphics.clear();
				this.shapeBattleUIBossBoxTP.graphics.beginFill('#fff').drawRect(this.TPXBoss, this.TPYBoss, this.TPWidthBoss * this.pickedBoss.tp, this.TPHeight);

				// Update canvas
				this.stageBattle.update();
				break;

			case 'won':
				// Show message
				this.showMessage('VICTORY :^)');

				window.setTimeout(function() {
					this.showMessage('GOING BACK TO TITLE SCREEN; PLEASE HANG UP');
				}.bind(this), 3000);
				window.setTimeout(function() {
					this.gamephase = 'pre-title';
				}.bind(this), 6000);
				this.gamephase = 'hang';
				break;

			case 'lost':
				// Show message
				this.showMessage('LOST THE GAME :-(');

				window.setTimeout(function() {
					this.showMessage('GOING BACK TO TITLE SCREEN; PLEASE HANG UP');
				}.bind(this), 3000);
				window.setTimeout(function() {
					this.gamephase = 'pre-title';
				}.bind(this), 6000);
				this.gamephase = 'hang';
				break;

			case 'hang':
				this.stageBattle.update();
				break;
		}
	};


	// Game control
	p.won = function() {
		this.gameover = true;
		if (debug) console.log('[Result] won the game :)');

		// Send result to server
		socket.emit('won', {
			heroList:	this.allHeroesFought,
			bossName:	this.pickedBoss.name
		});

		// Change phase
		if (debug) console.log('[Phase] won');
		this.gamephase = 'won';
	};

	p.lost = function() {
		this.gameover = true;
		if (debug) console.log('[Result] lost the game :(');

		// Send result to server
		socket.emit('lost', {
			heroList:	this.allHeroesFought,
			bossName:	this.pickedBoss.name
		});

		// Change phase
		if (debug) console.log('[Phase] lost');
		this.gamephase = 'lost';
	};


	// Top message bar for battle screen
	p.showMessage = function(message) {
		window.clearTimeout(this.timerMessageBar);
		this.timerMessageBar = window.setTimeout(this.hideMessage.bind(this), 3000);
		this.textBattleUIMessageBar.text = message;
		this.textBattleUIMessageBar.visible = true;
		this.bitmapBattleUIMessageBar.visible = true;
		if (debug) console.log('[Message] ', message);
	};

	p.hideMessage = function(message) {
		this.textBattleUIMessageBar.visible = false;
		this.bitmapBattleUIMessageBar.visible = false;
	};


	// Server/AGI events via socket
	// New number has been connected
	p.onNewcall = function(data) {

	};

	// Numkey has been pressed
	p.onKeypress = function(data) {
		if (this.gamephase != 'battle') return;
		if (this.whosturn == null) return;

		var who = this.whosturn;
		var heroOnTurn = this.heroes[who];
		if (data.caller != heroOnTurn.number) return;
		
		var pressedNum = data.value;
		if (parseInt(pressedNum) == NaN) return;
		if (pressedNum > heroOnTurn.skills.length) return;

		// Resolve turn
		heroOnTurn.tp = 0;
		this.whosturn = null;
		this.pauseTP = false;

		// Attack
		if (pressedNum == 1) {
			if (debug) console.log('[Action] ' + heroOnTurn.name + ' attacks');
			var dealtDamage = this.pickedBoss.hit(heroOnTurn.attack(), who);
			this.showMessage(heroOnTurn.name + ' dealt ' + dealtDamage + ' damage to ' + this.pickedBoss.name);
		}

		// Skills
		var cost = heroOnTurn.skills[pressedNum - 1].cost;
		if (heroOnTurn.sp < cost) {
			// Restore turn
			heroOnTurn.tp = 1;
			this.whosturn = who;
			this.pauseTP = true;
			if (debug) console.log('[Action] ' + heroOnTurn.name + ' failed to use skill due to lacking SP');
			return;
		}
		heroOnTurn.sp -= cost;
		switch (heroOnTurn.skills[pressedNum - 1].name.toLowerCase()) {
			case 'defend':
				heroOnTurn.defending = true;
				heroOnTurn.status = "defending";
				break;

			case 'provoke':
				heroOnTurn.sprite.gotoAndPlay('provoke');
				if (Math.random() < 0.9) {
					if (debug) console.log('[Action] ' + heroOnTurn.name + ' provoked the boss');
					this.pickedBoss.target = who;
					this.showMessage(this.pickedBoss.name + ' changed target!');
				} else {
					if (debug) console.log('[Action] ' + heroOnTurn.name + ' failed provoking');
					this.showMessage('Provoke failed..');
				}
				break;
		}
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
		var newHero = new Hero(this, hero, spriteByClasses[hero.class].clone(), this.textBattleHeroNametag.clone());
		this.heroes.push(newHero);
		this.allHeroesFought.push({
			number:			newHero.number,
			name:			newHero.name
		});

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
					case 1:	count = 20000;	break;
					case 2:	count = 15000;	break;
					case 3: count = 10000;	break;
					case 4: count = 5000;	break;
				}
				this.titleCountdownEnd = this.titleCountdownStart + count;
				break;

			case 'battle':
				if (this.heroes.length <= 0) {
					this.lost();
				}
				break;
		}
	};

	scope.Game = Game;
}(window));