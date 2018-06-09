  loading = {
	init: function(){
		// going fullscreen
		//game.scale.pageAlignHorizontally = true;
		//game.scale.pageAlignVertically = true;
		//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.scale.setScreenSize(true);
	},
	preload: function(){
		// preloading various assets
		game.load.path = 'assets/img/';
        game.load.spritesheet("levels", "levelSelect.png", game.global.thumbWidth, game.global.thumbHeight);
        game.load.image('dashBar', 'dashBar.png');
        game.load.image('scrolls', 'scroll.png');
		game.load.spritesheet("level_arrows", "level_arrows.png", 48, 48);
		game.load.atlas('atlas', 'PHSpritesheet.png', 'PHsprites.json');
		game.load.atlas('Mnt', 'tempMnt.png', 'tempMnt.json');
	    game.load.atlas('ninja', 'ninja.png', 'ninja.json');
		game.load.atlas('ground', 'ground.png', 'ground.json');


		// load level 2 assets
		game.load.image('sandTiles', '../level2/sheet.png');
		game.load.image('lvl2Background', '../level2/DesertBackground.png');
		game.load.tilemap('Level2', '../level2/Level2.json', null, Phaser.Tilemap.TILED_JSON);

		// load level 3 assets
		game.load.image('iceTiles', '../level3/sheet.png');
		game.load.image('lvl3Background', '../level3/TundraBackground.png');
		game.load.image('rideblocks', '../level3/metalMid.png');
		game.load.tilemap('Level3', '../level3/Level3.json', null, Phaser.Tilemap.TILED_JSON);


		// load all audio
		game.load.audio('bgMusic1', ['../audio/Ninja_Background.mp3'], ['../audio.Ninja_Background.ogg']);
		game.load.audio('bgMusic2', ['../audio/Ninja_Background_2.mp3'], ['../audio.Ninja_Background_2.ogg']);
		game.load.audio('bgMusic3', ['../audio/Ninja_Background_3.mp3'], ['../audio.Ninja_Background_3.ogg']);
		game.load.audio('bgMusic4', ['../audio/Ninja_Background_4.mp3'], ['../audio.Ninja_Background_4.ogg']);
		game.load.audio('dashSnd', ['../audio/Dash.mp3'], ['../audio.Dash.ogg']);



	},
  	create: function(){
  		// going to level select state
		game.state.start('menu');
	}
}   
