// look up phaser keyboard stuff
var Inputs = {};
var gameOptions = {
	playerGravity: 900, 
	playerSpeed: 200,
	playerJump: 400,
	playerForce: 200
}
var counter = 0;  // variable for jump
var inAir = false;  // variable to detect if in the air
var timer;
var tim;
var timeText;

Inputs.menu = function() {};
Inputs.menu.prototype = {
	preload: function(){
	    // load some stuff
	    this.load.path = 'assets/img/';
	    this.load.atlas('atlas', 'PHSpritesheet.png', 'PHsprites.json');
	    this.load.atlas('player', 'player.png', 'player.json');
		this.load.atlas('ground', 'ground.png', 'ground.json');
		this.load.audio('bgMusic', ['../audio/Ninja_Background.mp3']);
	},
	create: function(){
		// do some stuff
		this.add.text(225, 240, 'Press Spacebar to begin');
		this.add.text(250, 280, 'Collect the Diamond');
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
	this.player;
	this.dashBar = null;
	this.cursors = null;
	this.bg = null;
	this.bg2 = null;
	this.plt;
	this.plt2;
	this.wall;
	this.dmnd;
	this.dgravity = 200;
	this.total = 0;
};
Inputs.play.prototype = {
	preload: function(){
		// place your assets
	},
	create: function(){
		//  Enable physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //game.camera.follow(this.player);

        //	Research how to delay the game so that the music can start up right away.
        this.music = this.add.audio('bgMusic');
        this.music.play();
        this.music.loop;

        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();

        //	Sprites
        this.bg = this.add.sprite(0, 0, 'atlas', 'clouds');
        this.bg = this.add.sprite(0, 250, 'atlas', 'clouds');
        this.player = this.add.sprite(50, 300, 'player', 'rightIdle');
        this.player.scale.setTo(0.3);
        this.plt = this.add.sprite(0, 490, 'ground', 'platform');      //its called platform on leshy
        this.plt2 = this.add.sprite(400, 490, 'ground', 'platform');
        this.plt3 = this.add.sprite(500, 400, 'ground', 'platform');
        this.plt4 = this.add.sprite(350, 250, 'ground', 'platform');
        this.plt3.anchor.setTo(0.5, 0.5);
        this.plt4.anchor.setTo(0.5, 0.5);
        this.plt3.scale.setTo(0.1, 20);
        this.plt4.scale.setTo(0.1, 10);
        this.player.anchor.setTo(0.5);
        this.dmnd = this.add.sprite(700, 200, 'atlas', 'diamond');

		this.playerIdleLeft = false;
		this.playerIdleRight = false;

		//  Add the animation for walking
        //  15 = right hand out, 16 = left hand out. 10 and 11 are the idle right
        this.physics.arcade.enable([this.player, this.plt, this.plt2, this.plt3, this.plt4, this.dmnd]);
        this.player.animations.add('rightRun', Phaser.Animation.generateFrameNames('rightRun', 1, 8), 10, true);
        this.player.animations.add('leftRun', Phaser.Animation.generateFrameNames('leftRun', 1, 8), 10, true);
		this.plt.body.immovable = true;
		this.plt2.body.immovable = true;
		this.plt3.body.immovable = true;
		this.plt4.body.immovable = true;
		this.player.body.collideWorldBounds = true;


		// sets sprite properties
		this.player.body.gravity.y = gameOptions.playerGravity;
		this.dmnd.body.gravity.y = this.dgravity;
		this.dmnd.body.bounce.y = 0.2;

		//this.plt3.angle = 90;
	},


	update: function(){
		// run game loop
		var hitPlatform = this.physics.arcade.collide(this.player, this.plt);
		var hitPlatform2 = this.physics.arcade.collide(this.player, this.plt2);
		var hitPlatform3 = this.physics.arcade.collide(this.player, this.plt3);
		var hitPlatform4 = this.physics.arcade.collide(this.player, this.plt4);
		var hitPlt2 = this.physics.arcade.collide(this.plt2, this.dmnd);
		this.physics.arcade.overlap(this.player, this.dmnd, this.endGame, null, this);

		//stops player velocity after jumping
		if (this.player.body.touching.down) {
			inAir = false;
			this.player.body.velocity.x = 0;
		}else{
			inAir = true;
		}

		//running animsation for left and right movement
		if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !inAir){
		    //this.player.scale.x = -1;
			this.player.body.velocity.x = -gameOptions.playerSpeed;
			this.player.animations.play('leftRun');
		} else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && !inAir){
			//this.player.scale.x = 1;
			this.player.body.velocity.x = gameOptions.playerSpeed;
			this.player.animations.play('rightRun');
		} 

		//else if (this.input.keyboard.isDown(Phaser.Keyboard.R)){
			//this.player.body.velocity.x = 1000;
			//this.player.animations.play('walkD');
			//this.player.arcade.disable(this.player);
		//}


		//stops velocity and animation when releasing button  for the right
		if (this.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)){
			if(inAir == false) {
				this.player.animations.stop();
				this.player.frameName = 'rightIdle';
				this.player.body.velocity.x = 0;
			} // stops it for the left
		} else if (this.input.keyboard.justReleased(Phaser.Keyboard.LEFT)){
			if(inAir == false) {
				this.player.animations.stop();
				this.player.frameName = 'leftIdle';
				this.player.body.velocity.x = 0;
			}
		} 

		// resets the jump counter
		if (this.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
				counter = 0;
		}

		// uses spacebar to jump, Must release spacebar to jump again instead of holding down
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.body.touching.down && counter < 1) {
			this.player.body.velocity.y = -gameOptions.playerJump;
			counter ++;
		}

		if(inAir){
			if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
				this.player.animations.stop();
				this.player.frameName = 'leftJump';
			}else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
				this.player.animations.stop();
				this.player.frameName = 'rightJump';
			}
		}

		//Wall Jump Right
		//Checks if player is in Air, holding right against all to the right,
		// and if player is touching wall
		if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && inAir == true && this.player.body.touching.right ) {
			//this.player.scale.x *= -1;
			this.player.body.velocity.y = -gameOptions.playerJump;
			this.player.body.velocity.x = -gameOptions.playerForce;
		}

		//Wall jump Left
		//Same as above but for the left wall and holding left
		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && inAir == true && this.player.body.touching.left ) {
			//this.player.scale.x *= -1;
			this.player.body.velocity.y = -gameOptions.playerJump;
			this.player.body.velocity.x = gameOptions.playerForce;
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
	},
	render: function() {
		// show timer01 debug text
		game.debug.text('Time Elapsed: ' + this.total, 32, 32, "#ff3333", '40px');
	},
	endGame: function(){
		this.state.start('gameover', true, false);
		this.music.stop();
	},
	updateTime: function(){
		this.total++;
	}
}	

Inputs.gameover = function(){};
Inputs.gameover.prototype = {
	preload: function(){
		// do something maybe
	},
	create: function(){
		cursors = game.input.keyboard.createCursorKeys();
		this.add.text(250, 275, 'Congratulations!');
		this.add.text(90, 325, 'You have completed the really early Alpha build.',);
		this.stage.backgroundColor = '#b3d1ff';
	},
	update: function(){
		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('menu');
		}
	}
}


var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add('menu', Inputs.menu);
game.state.add('play', Inputs.play);
game.state.add('gameover', Inputs.gameover);
game.state.start('menu');
