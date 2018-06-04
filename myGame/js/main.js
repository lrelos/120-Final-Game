var game = new Phaser.Game(800, 600, Phaser.AUTO);

// look up phaser keyboard stuff
var Inputs = {};

var timer;
var timeText;
var bronzeTime = 90;
var silverTime = 60;
var goldTime = 35;
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
		this.world.setBounds(0, 0, 2560, 1600);

		//  Enable physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //	Research how to delay the game so that the music can start up right away.
        this.music = this.add.audio('bgMusic');
        this.music.play();
        this.music.loop;

        this.total = 0;
        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();

        //	Sprites
        this.bg = this.add.sprite(0, 0, 'Mnt', 'mountain');
        //this.bg = this.add.sprite(0, 250, 'atlas', 'clouds');

        //creates a player using the Player prefab
        this.player = new Player(game, 100, 300); //100, 300
        this.add.existing(this.player);
        Phaser.Camera.FOLLOW_PLATFORMER = 1;
        this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 0.75, 0.75);

        // this.ground = new Ground(game, 800, 490, 'ground', 'platform');
        // this.add.existing(this.ground);

        // Spawn Platform
        this.plt = this.add.sprite(0, 490, 'ground', 'platform');      //its called platform on leshy
        this.plt.scale.x = 2;

        // Bottom floor 
        this.plt0 = this.add.sprite(0, 1575, 'ground', 'platform');
        this.plt0.scale.x = 15;
        
        // Barrier on top right of game 
        this.plt2 = this.add.sprite(925, 490, 'ground', 'platform');
        this.plt2.scale.x = 4.5;
        
        // Tall wall on right
        this.plt3 = this.add.sprite(500, 330, 'ground', 'platform');
        this.plt3.anchor.setTo(0.5, 0.5);
        this.plt3.scale.setTo(0.1, 11);

    	// Tall wall on left
        this.plt4 = this.add.sprite(335, 250, 'ground', 'platform');
        this.plt4.anchor.setTo(0.5, 0.5);
        this.plt4.scale.setTo(0.1, 10);

        // Tall wall blocking path
        this.plt5 = this.add.sprite(935, 202, 'ground', 'platform');
        this.plt5.anchor.setTo(0.5, 0.5);
        this.plt5.scale.setTo(0.1, 20);

        // Small wall leading down
        this.plt6 = this.add.sprite(780, 575, 'ground', 'platform');
        this.plt6.anchor.setTo(0.5, 0.5);
        this.plt6.scale.setTo(0.1, 5);

        // wall next to it ^^
        this.plt61 = this.add.sprite(935, 575, 'ground', 'platform');
        this.plt61.anchor.setTo(0.5, 0.5);
        this.plt61.scale.setTo(0.1, 5);

        // Falling down floor
        this.plt7 = this.add.sprite(725, 850, 'ground', 'platform');
        this.plt7.scale.x = 0.75;
        this.plt7.scale.y = 1.1;

        // meh platforms for diamond
        this.plt8 = this.add.sprite(2500, 1500, 'ground', 'platform');
        this.plt9 = this.add.sprite(2300, 1450, 'ground', 'platform');
        this.plt9.scale.x = 0.25;
        this.plt10 = this.add.sprite(2500, 1370, 'ground', 'platform');
        this.plt11 = this.add.sprite(2300, 1300, 'ground', 'platform');
        this.plt11.scale.x = 0.25;
        this.plt12 = this.add.sprite(2500, 1230, 'ground', 'platform');
        this.plt13 = this.add.sprite(2300, 1160, 'ground', 'platform');
        this.plt13.scale.x = 0.25;
        this.plt14 = this.add.sprite(2500, 1090, 'ground', 'platform');
        this.plt15 = this.add.sprite(2300, 1020, 'ground', 'platform');
        this.plt15.scale.x = 0.25;
        this.plt16 = this.add.sprite(2500, 950, 'ground', 'platform');
        this.plt16.scale.x = 0.20;

        // long platform that leads down connected to where fall down
        this.plt17 = this.add.sprite(725, 1122, 'ground', 'platform');
        this.plt17.anchor.setTo(0.5, 0.5);
        this.plt17.scale.setTo(0.08, 17);

        this.plt18 = this.add.sprite(600, 623, 'ground', 'platform');
        this.plt18.scale.x = 0.5;

        // long platform that leads down connected to where fall down, next to that.
        this.plt19 = this.add.sprite(590, 943, 'ground', 'platform');
        this.plt19.anchor.setTo(0.5, 0.5);
        this.plt19.scale.setTo(0.08, 20);

        this.plt20 = this.add.sprite(140, 1362, 'ground', 'platform');
        this.plt20.scale.x = 1.5;

        this.plt21 = this.add.sprite(140, 1250, 'ground', 'platform');
        this.plt21.scale.x = 1.165;

        this.plt22 = this.add.sprite(160, 1325, 'ground', 'platform');
        this.plt22.anchor.setTo(0.5, 0.5);
        this.plt22.scale.setTo(0.1, 3);

        // diamond to end our test game
        this.dmnd = this.add.sprite(2500, 900, 'atlas', 'diamond');

		//  Add the animation for walking
        //  15 = right hand out, 16 = left hand out. 10 and 11 are the idle right
        this.physics.arcade.enable([this.plt, this.plt0, this.plt2, this.plt3, this.plt4, this.plt5, this.plt6, 
        	this.plt61, this.plt7, this.plt8, this.plt9, this.plt10, this.plt11, this.plt12, this.plt13, 
        	this.plt14, this.plt15, this.plt16, this.plt17, this.plt18, this.plt19, this.plt20, this.plt21,
        	this.plt22, this.dmnd]);
        //this.player.animations.add('rightRun', Phaser.Animation.generateFrameNames('rightRun', 1, 8), 10, true);
        //this.player.animations.add('leftRun', Phaser.Animation.generateFrameNames('leftRun', 1, 8), 10, true);
		this.plt.body.immovable = true;
		this.plt0.body.immovable = true;
		this.plt2.body.immovable = true;
		this.plt3.body.immovable = true;
		this.plt4.body.immovable = true;
		this.plt5.body.immovable = true;
		this.plt6.body.immovable = true;
		this.plt61.body.immovable = true;
		this.plt7.body.immovable = true;
		this.plt8.body.immovable = true;
		this.plt9.body.immovable = true;
		this.plt10.body.immovable = true;
		this.plt11.body.immovable = true;
		this.plt12.body.immovable = true;
		this.plt13.body.immovable = true;
		this.plt14.body.immovable = true;
		this.plt15.body.immovable = true;
		this.plt16.body.immovable = true;
		this.plt17.body.immovable = true;
		this.plt18.body.immovable = true;
		this.plt19.body.immovable = true;
		this.plt20.body.immovable = true;
		this.plt21.body.immovable = true;
		this.plt22.body.immovable = true;

		// sets sprite properties
		//this.player.body.gravity.y = gameOptions.playerGravity;
		this.dmnd.body.gravity.y = this.dgravity;
		this.dmnd.body.bounce.y = 0.2;

		this.txt01 = this.add.text(725, 850, "<-- Pick a side to go -->");
		this.txt02 = this.add.text(140, 1250, "Nothing Here!");
		this.txt03 = this.add.text(140, 1362, "Go back.");
		this.txt04 = this.add.text(2000, 1570, "This is da wae, now start jumping to win!");

		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;
	},


	update: function(){
		// run game loop
		var hitPlatform = this.physics.arcade.collide(this.player, this.plt);
		var hitPlatform0 = this.physics.arcade.collide(this.player, this.plt0);
    	var hitPlatform2 = this.physics.arcade.collide(this.player, this.plt2);
    	var hitPlatform3 = this.physics.arcade.collide(this.player, this.plt3);
    	var hitPlatform4 = this.physics.arcade.collide(this.player, this.plt4);
    	var hitPlatform5 = this.physics.arcade.collide(this.player, this.plt5);
    	var hitPlatform6 = this.physics.arcade.collide(this.player, this.plt6);
    	var hitPlatform61 = this.physics.arcade.collide(this.player, this.plt61);
    	var hitPlatform7 = this.physics.arcade.collide(this.player, this.plt7);
    	var hitPlatform8 = this.physics.arcade.collide(this.player, this.plt8);
    	var hitPlatform9 = this.physics.arcade.collide(this.player, this.plt9);
    	var hitPlatform10 = this.physics.arcade.collide(this.player, this.plt10);
    	var hitPlatform11 = this.physics.arcade.collide(this.player, this.plt11);
    	var hitPlatform12 = this.physics.arcade.collide(this.player, this.plt12);
    	var hitPlatform13 = this.physics.arcade.collide(this.player, this.plt13);
    	var hitPlatform14 = this.physics.arcade.collide(this.player, this.plt14);
    	var hitPlatform15 = this.physics.arcade.collide(this.player, this.plt15);
    	var hitPlatform16 = this.physics.arcade.collide(this.player, this.plt16);
    	var hitPlatform17 = this.physics.arcade.collide(this.player, this.plt17);
    	var hitPlatform18 = this.physics.arcade.collide(this.player, this.plt18);
    	var hitPlatform19 = this.physics.arcade.collide(this.player, this.plt19);
    	var hitPlatform20 = this.physics.arcade.collide(this.player, this.plt20);
    	var hitPlatform21 = this.physics.arcade.collide(this.player, this.plt21);
    	var hitPlatform22 = this.physics.arcade.collide(this.player, this.plt22);

		var hitPlt16 = this.physics.arcade.collide(this.plt16, this.dmnd);
		var hitPlt00 = this.physics.arcade.collide(this.plt0, this.dmnd);
		game.physics.arcade.overlap(this.player, this.dmnd, this.endGame, null, this);

		// this.plt7.body.velocity.x = 200;
		// if(this.plt7.body.x >= game.width){
		// 	this.plt7.body.x = -100;
		// }else if (this.plt7.body.x <= -100) {
		// 	this.plt7body.x = game.width;
		// }

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
		game.debug.text('Dash: ' + this.player.inAir, 50, 50, "#000000", '72px');
        this.dashBar.scale.x = 1;
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
		this.add.text(90, 325, 'You have completed the updated Alpha build.',);
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
