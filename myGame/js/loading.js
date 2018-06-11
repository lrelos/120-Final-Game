
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
        game.load.image('menuPlay', 'titleScreenPlay.png');
        game.load.image('menuCredits', 'titleScreenCredits.png');
        game.load.image('menuControls', 'titleScreenControls.png');
        game.load.image('back', 'backToTitleScreen.png');
        game.load.image('controls', 'controls.png');
        game.load.image('credits', 'credits.png');
		game.load.spritesheet("level_arrows", "level_arrows.png", 48, 48);
	    game.load.atlas('ninja', 'ninja.png', 'ninja.json');

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
		game.load.image('icicles', '../level3/iceSpike.png');
		game.load.tilemap('Level3', '../level3/Level3.json', null, Phaser.Tilemap.TILED_JSON);
		
		// load level 4 assets
		game.load.image('metalTiles', '../level4/sheet.png');
		game.load.image('lvl4Background', '../level4/bulkhead-wallsx3.png');
		game.load.tilemap('Level4', '../level4/Level4.json', null, Phaser.Tilemap.TILED_JSON);
		
		// load level 5 assets
		game.load.image('purpleTiles', '../level5/sheet.png');
		game.load.image('lvl5Background', '../level5/Flat Night 2 BG.png');
		game.load.tilemap('Level5', '../level5/Level5.json', null, Phaser.Tilemap.TILED_JSON);

		// load level 6 assts
		game.load.image('metalTiles2', '../level6/sheet.png');
		game.load.image('lvl6Background', '../level6/ElectricBackground.png');
		game.load.spritesheet('hazards', '../level6/electric_hazard.png', 144, 22);
		game.load.spritesheet('hazards2', '../level6/electric_hazard_2.png', 35, 232);
		game.load.tilemap('Level6', '../level6/Level6.json', null, Phaser.Tilemap.TILED_JSON);

		//load level 7 assets
		game.load.image('rockTiles', '../level7/rockTileset.png');
		game.load.image('spikes', '../level7/SpikesAnim.png');
		game.load.tilemap('level7', '../level7/rockyRoad.json', null, Phaser.Tilemap.TILED_JSON);

		//load level 8 assets
		game.load.image('factoryTiles', '../level8/factoryTileset.png');
		game.load.image('lavaTiles', '../level8/lava.png');
		game.load.tilemap('level8', '../level8/level8.json', null, Phaser.Tilemap.TILED_JSON);


		// load all audio
		game.load.audio('bgMusic1', ['../audio/Ninja_Background.mp3'], ['../audio.Ninja_Background.ogg']);
		game.load.audio('bgMusic2', ['../audio/Ninja_Background_2.mp3'], ['../audio.Ninja_Background_2.ogg']);
		game.load.audio('bgMusic3', ['../audio/Ninja_Background_3.mp3'], ['../audio.Ninja_Background_3.ogg']);
		game.load.audio('dashSnd', ['../audio/Dash.mp3'], ['../audio.Dash.ogg']);
		game.load.audio('pickUpScroll', ['../audio/item_pickup.mp3'], ['../audio.item_pickup.ogg']);



	},
  	create: function(){
  		// going to level select state
		game.state.start('titleScreen');
	}
}   

