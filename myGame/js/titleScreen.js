titleScreen = {
	create: function(){
		game.stage.backgroundColor = '#000000';
  		this.add.sprite(0, 0, 'menuBackground');
  		this.add.sprite(0, 0, 'titleScreen');
	},
	update: function(){
		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.state.start('LevelSelect', true, false);
		}
	}
}