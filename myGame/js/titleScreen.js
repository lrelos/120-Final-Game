titleScreen = {
	create: function(){
		game.stage.backgroundColor = '#000000';
  		this.add.sprite(0, 0, 'menuBackground');
  		this.add.sprite(0, 0, 'titleScreen');

  		var play = game.add.button(320, 280, "menuPlay", this.playClicked, this);
  		play.anchor.setTo(0.5);
  		var credits = game.add.button(320, 400, "menuCredits", this.creditsClicked, this);
  		credits.anchor.setTo(0.5);
  		var controls = game.add.button(320, 340, "menuControls", this.controlsClicked, this);
  		controls.anchor.setTo(0.5);
	},
	
	playClicked: function(button){
		game.state.start("LevelSelect", true, false);
	},

	creditsClicked: function(button){
		game.state.start('credits', true, false);
	},

	controlsClicked: function(button){
		game.state.start("controls", true, false);
	}
}