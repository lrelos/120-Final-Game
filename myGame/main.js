// look up phaser keyboard stuff
var Inputs = {};

Inputs.menu = function() {};
Inputs.menu.prototype = {
	preload: function(){
	    // load some stuff
	    this.load.path = 'assets/img/';
	    this.load.atlas('atlas', 'PHSpritesheet.png', 'PHsprites.json');
	    this.load.atlas('player', 'player.png', 'player.json');
		this.load.atlas('ground', 'ground.png', 'ground.json');
	},
	create: function(){
		// do some stuff
		this.stage.backgroundColor = '#facade';
	},
	update: function(){
		// go on to next state
        if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.state.start('play', true, false);
		}
	}
}

Inputs.play = function(game){
	this.player = null;
	this.dashBar = null;
	this.cursors = null;
	this.bg = null;
	this.bg2 = null;
	this.gravity = 10;
	this.plt;
	this.plt2;
};
Inputs.play.prototype = {
	preload: function(){
		// place your assets
	},
	create: function(){
		//  Enable physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //	Sprites
        this.bg = this.add.sprite(0, 0, 'atlas', 'clouds');
        this.bg = this.add.sprite(0, 250, 'atlas', 'clouds');
        this.player = this.add.sprite(50, 450, 'player', 'rightIdle');
        this.plt = this.add.sprite(0, 490, 'ground', 'platform'); //its called platform on leshy
        this.plt2 = this.add.sprite(400, 490, 'ground', 'platform');

		this.playerIdleLeft = false;
		this.playerIdleRight = false;

		//  Add the animation for walking
        //  15 = right hand out, 16 = left hand out. 10 and 11 are the idle right
        this.physics.arcade.enable([this.player, this.plt, this.plt2]);
        this.player.animations.add('rightRun', Phaser.Animation.generateFrameNames('rightRun', 1, 8), 10, true);
        this.player.animations.add('leftRun', Phaser.Animation.generateFrameNames('leftRun', 1, 8), 10, true);
        this.player.animations.add('rightIdle', Phaser.Animation.generateFrameNames('rightIdle'), 1, true);
        this.player.animations.add('leftIdle', Phaser.Animation.generateFrameNames('leftIdle'), 1, true);
        this.player.animations.add('rightJump', Phaser.Animation.generateFrameNames('rightJump'), 1, true);
        this.player.animations.add('leftJump', Phaser.Animation.generateFrameNames('leftJump'), 1, true);
		this.player.collideWorldBounds = true;
		this.plt.body.immovable = true;
		this.plt2.body.immovable = true;
		this.player.body.gravity.y = 100;

	},
	update: function(){
		// run game loop
		var hitPlatform = this.physics.arcade.collide(this.player, this.plt);
		var hitPlatform2 = this.physics.arcade.collide(this.player, this.plt2);
		// player does not have actual image/sprite attached to it yet
		this.player.body.velocity.x = 0;
	
		if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			this.player.body.velocity.x = -100;
			this.player.animations.play('leftRun');
		} else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			this.player.body.velocity.x = 100;
			this.player.animations.play('rightRun');
		} else if (this.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)){
			this.player.animations.play('rightIdle');
		} else if (this.input.keyboard.justReleased(Phaser.Keyboard.LEFT)){
			this.player.animations.play('leftIdle');
		}


		if(this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && this.player.body.touching.down){
			this.player.body.velocity.y -= 100;
		}
		/* 
		//	Basic code, not tested yet so it will stay commented out
		if(cursors.spacebar.isDown && dashBar != 0 && playerIdleRight = true){
			player.body.velocity.x += 10;
			dashBar -= 3;
		} else if (cursors.spacebar.isDown && dashBar != 0 && playerIdleLeft = true){
			player.body.velocity.x -= 10;
			dashBar -= 3;
		} else if (cursors.spacebar.isDown && dashBar != 0 && cursor.up.isDown){
			player.body.velocity.y -= 10;
			dashBar -= 3;
		} else if (cursors.spacebar.isDown && dashBar != 0 && cursor.right.isDown){
			player.body.velocity.x += 10;
			dashBar -= 3;
		} else if (cursors.spacebar.isDown && dashBar != 0 && cursor.left.isDown){
			player.body.velocity.x -= 10;
			dashBar -= 3;
		}

		if(player.touching.wall == true && cursors.up.justPressed(cursors.up)){
			player.body.velocity.y -= 5;
		} else {
			// after 2 seconds
			// player.touching.wall = false;
		}

		if (dashBar = 0){
			// player cannot dash
		}*/
	}
}	

Inputs.gameover = function(){};
Inputs.gameover.prototype = {
	preload: function(){
		// do something maybe
	},
	create: function(){
		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function(){
		if(cursors.spacebar.isDown){
			game.state.start('menu');
		}
	}
}


var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add('menu', Inputs.menu);
game.state.add('play', Inputs.play);
game.state.add('gameover', Inputs.gameover);
game.state.start('menu');