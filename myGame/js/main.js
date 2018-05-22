var game = new Phaser.Game(800, 600, Phaser.AUTO);

// look up phaser keyboard stuff
var Inputs = {};

var inAir = false;  // variable to detect if in the air
var jumpButtonDown = false;
var wallJump = false;
var timer;
var timeText;
var bronzeTime = 30;
var silverTime = 25;
var goldTime = 15;
var stars = 0;

//global vars for level select menu
game.global = {
	thumbRows : 5,
	// number of thumbnail cololumns
	thumbCols : 4,
	// width of a thumbnail, in pixels
	thumbWidth : 64,
	// height of a thumbnail, in pixels
	thumbHeight : 64,
	// space among thumbnails, in pixels
	thumbSpacing : 8,
	// array with finished levels and stars collected.
	// 0 = playable yet unfinished level
	// 1, 2, 3 = level finished with 1, 2, 3 stars
	// 4 = locked
	starsArray : [0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
	// level currently playing
	level : 0
}

Inputs.menu = function() {};
Inputs.menu.prototype = {
	preload: function(){
	    // load some stuff

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
			this.state.start('LevelSelect', true, false);
		}
	}
}

Inputs.play = function(game){
	this.dashBar = null;
	this.cursors = null;
	this.bg = null;
	this.bg2 = null;
	this.plt;
	this.plt2;
	this.wall;
	this.dmnd;
	this.dgravity = 200;
	this.total;
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

        this.total = 0;
        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();


        //	Sprites
        this.bg = this.add.sprite(0, 0, 'atlas', 'clouds');
        this.bg = this.add.sprite(0, 250, 'atlas', 'clouds');


        //creates a player using the Player prefab
        this.player = new Player(game, 50, 300);
        this.add.existing(this.player);

        this.plt = this.add.sprite(0, 490, 'ground', 'platform');      //its called platform on leshy
        this.plt2 = this.add.sprite(400, 490, 'ground', 'platform');
        this.plt3 = this.add.sprite(500, 400, 'ground', 'platform');
        this.plt4 = this.add.sprite(335, 250, 'ground', 'platform');
        this.plt3.anchor.setTo(0.5, 0.5);
        this.plt4.anchor.setTo(0.5, 0.5);
        this.plt3.scale.setTo(0.1, 20);
        this.plt4.scale.setTo(0.1, 10);

        this.dmnd = this.add.sprite(700, 200, 'atlas', 'diamond');



		//  Add the animation for walking
        //  15 = right hand out, 16 = left hand out. 10 and 11 are the idle right
        this.physics.arcade.enable([this.plt, this.plt2, this.plt3, this.plt4, this.dmnd]);
        //this.player.animations.add('rightRun', Phaser.Animation.generateFrameNames('rightRun', 1, 8), 10, true);
        //this.player.animations.add('leftRun', Phaser.Animation.generateFrameNames('leftRun', 1, 8), 10, true);
		this.plt.body.immovable = true;
		this.plt2.body.immovable = true;
		this.plt3.body.immovable = true;
		this.plt4.body.immovable = true;


		// sets sprite properties
		//this.player.body.gravity.y = gameOptions.playerGravity;
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
		game.physics.arcade.overlap(this.player, this.dmnd, this.endGame, null, this);

		// amount of stars we recieve
		if(this.total < goldTime) {
			stars = 3;
		}
		else if(this.total < silverTime) {
			stars = 2;
		}
		else if(this.total < bronzeTime) {
			stars = 1;
		}
		else stars = 0;


		
	},
	render: function() {
		// show timer01 debug text
		game.debug.text('Time Elapsed: ' + this.total, 32, 32, "#ff3333", '40px');
		game.debug.text('Stars: ' + stars, 50, 50, "#000000", '72px');
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
		// did we improved our stars in current level?
		if(game.global.starsArray[game.global.level-1] < stars){
			game.global.starsArray[game.global.level-1] = stars;
		}
		// if we completed a level and next level is locked - and exists - then unlock it
		if( stars > 0 && game.global.starsArray[game.global.level]==4 && game.global.level<game.global.starsArray.length){
			game.global.starsArray[game.global.level] = 0;	
		}

		if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('LevelSelect');

		}
	}
}


game.state.add("Loading", loading);
game.state.add("menu", Inputs.menu);
game.state.add("LevelSelect", levelSelect);
game.state.add("play", Inputs.play);
game.state.add("gameover", Inputs.gameover);
game.state.start("Loading");
