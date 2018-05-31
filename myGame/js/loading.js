  loading = {
	init: function(){
		// going fullscreen
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.scale.setScreenSize(true);
	},
	preload: function(){
		// preloading various assets
		game.load.path = 'assets/img/';
        game.load.spritesheet("levels", "levelSelect.png", game.global.thumbWidth, game.global.thumbHeight);
		game.load.spritesheet("level_arrows", "level_arrows.png", 48, 48);
		game.load.atlas('atlas', 'PHSpritesheet.png', 'PHsprites.json');
		game.load.atlas('Mnt', 'tempMnt.png', 'tempMnt.json');
	    game.load.atlas('player', 'player.png', 'player.json');
		game.load.atlas('ground', 'ground.png', 'ground.json');
		game.load.audio('bgMusic', ['../audio/Ninja_Background.mp3'], ['../audio.Ninja_Background.ogg']);
	},
  	create: function(){
  		// going to level select state
		game.state.start('menu');
	}
}   
