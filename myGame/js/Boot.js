
Boot = {
	preload: function() {

	},
	create: function() {
		loadingText = game.add.text(game.width / 2, game.height / 2, "LOADING...", { fontSize: '64px', fill: '#FFFFFF' });
		loadingText.anchor.setTo(0.5);
    	loadingText.align = 'center';
		game.state.start('Loading', false, true);
	}
}