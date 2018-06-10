
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
        game.load.spritesheet('flags', 'flag.png', 70, 70);
        game.load.image('menuBackground', 'MenuBackground.png')
        game.load.image('titleScreen', 'titleScreen.png');
		game.load.spritesheet("level_arrows", "level_arrows.png", 48, 48);
		game.load.atlas('atlas', 'PHSpritesheet.png', 'PHsprites.json');
		game.load.image('Mnt', 'Mnt.png');
	    game.load.atlas('ninja', 'ninja.png', 'ninja.json');
		game.load.atlas('ground', 'ground.png', 'ground.json');

    // load level 1 assets
		game.load.image('tutorial', '../level1/NatureSheet.png');
		game.load.image('lvl1Background', '../level1/Flat Nature Art.png');
		game.load.tilemap('Level1', '../level1/Level1.json', null, Phaser.Tilemap.TILED_JSON);

		// load level 2 assets
		game.load.image('sandTiles', '../level2/sheet.png');
		game.load.image('lvl2Background', '../level2/DesertBackground.png');
		game.load.tilemap('Level2', '../level2/Level2.json', null, Phaser.Tilemap.TILED_JSON);

		// load level 3 assets
		game.load.image('iceTiles', '../level3/sheet.png');
		game.load.image('lvl3Background', '../level3/TundraBackground.png');
		game.load.image('rideblocks', '../level3/metalMid.png');
		game.load.tilemap('Level3', '../level3/Level3.json', null, Phaser.Tilemap.TILED_JSON);

		// load level 6 assts
		game.load.image('metalTiles', '../level6/sheet.png');
		//game.load.image('lvl2Background', '../level2/DesertBackground.png');
		game.load.spritesheet('hazards', '../level6/electric_hazard.png', 144, 22);
		game.load.spritesheet('hazards2', '../level6/electric_hazard_2.png', 35, 232);
		game.load.tilemap('Level6', '../level6/Level6.json', null, Phaser.Tilemap.TILED_JSON);


		// load all audio
		game.load.audio('bgMusic1', ['../audio/Ninja_Background.mp3'], ['../audio.Ninja_Background.ogg']);
		game.load.audio('bgMusic2', ['../audio/Ninja_Background_2.mp3'], ['../audio.Ninja_Background_2.ogg']);
		game.load.audio('bgMusic3', ['../audio/Ninja_Background_3.mp3'], ['../audio.Ninja_Background_3.ogg']);
		game.load.audio('bgMusic4', ['../audio/Ninja_Background_4.mp3'], ['../audio.Ninja_Background_4.ogg']);
		game.load.audio('dashSnd', ['../audio/Dash.mp3'], ['../audio.Dash.ogg']);
		game.load.audio('pickUpScroll', ['../audio/item_pickup.mp3'], ['../audio.item_pickup.ogg']);



	},
  	create: function(){
  		// going to level select state
		game.state.start('titleScreen');
	}
}   

