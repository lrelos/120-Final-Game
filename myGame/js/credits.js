credits = {
	create: function(){
		game.stage.backgroundColod = '#000000';
		this.add.sprite(0, 0, 'menuBackground');
		this.add.sprite(0, 0, 'credits');

		var back = game.add.button(game.width/2, game.height - 130, "back", this.backClicked, this);
		back.anchor.setTo(0.5);
		back.scale.x = 0.8;
		back.scale.y = 0.8;
	},
	backClicked: function(button){
		game.state.start("titleScreen");
	}
}