var dashBar = null;

Level2 = {
	create: function() {

		this.total = 0;
		this.timer;
   		this.timeText;
		this.bronzeTime = 70;
		this.silverTime = 45;
		this.goldTime = 30;
		this.stars = 0;

		// Plays Background Music
        this.music = this.add.audio('bgMusic2');
        this.music.loopFull();

        //creates timer object
        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;

		// adds the background image. Separate from tile
	    this.background = game.add.tileSprite(0, 0, 2450, 1750, 'lvl2Background');

	    // creates the tile map
		lvl2Map = game.add.tilemap('Level2');
		lvl2Map.addTilesetImage('Level_2', 'sandTiles');

		// sets collision by exclusion. Player will collide with everything except these numbers
		lvl2Map.setCollisionByExclusion([0, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 48, 49 ], true);

		// creates the layer and reiszes the world to match
		lvl2Layer = lvl2Map.createLayer('sandTerrain');
		lvl2Layer.resizeWorld();


		// adding scrolls to fill up dash meter
		// creates scroll objects from tiled
		this.dashScrolls = game.add.group();
		this.dashScrolls.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl2Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);

		// Creates flags to reach for win condition
		this.flags = game.add.group();
		this.flags.enableBody = true;
		lvl2Map.createFromObjects('Items', 'flag', 'flags', 2, true, false, this.flags);
		// sets attributes for  flags
		this.flags.forEach(function(flag){
        flag.body.immovable = true;
        flag.animations.add('flagWave', [0, 1], 2, true);
		flag.animations.play('flagWave');
    	});


		// creates new player for this level
		this.player = new Player(game, 100, 1000); 
        game.add.existing(this.player);
        //Phaser.Camera.FOLLOW_PLATFORMER = 1;
        game.camera.follow(this.player);

        // adds the dash bar
		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;

    	// Keeps friction constant
    	frictionDragX = 2500;
    	this.player.resetDash();

	},

	update: function() {

		// adds collision for player and tiled map
		game.physics.arcade.collide(this.player, lvl2Layer);
		// adds overlap for player and scroll
		game.physics.arcade.overlap(this.player, this.dashScrolls, collectScroll, null, this);
		// adds overlap for player and flag
		game.physics.arcade.overlap(this.player, this.flags, reachFlag, null, this);

		if (this.player.body.y > (game.world.height + this.player.body.height/2)) {
			this.player.kill();

			// creates new player if player dies or falls of world
			this.player = new Player(game, 100, 1000); 
        	game.add.existing(this.player);
        	//Phaser.Camera.FOLLOW_PLATFORMER = 1;
        	game.camera.follow(this.player);
        	lvl2Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
 		}

 		// function when player collects scroll
		function collectScroll(player, scroll) {
			// Plays scroll sound effect
        	this.scrollSound = this.add.audio('pickUpScroll');
        	this.scrollSound.play();			
			scroll.kill(); // kills scroll
			dash += 60; // adds to the dash meter
		}

		// function for when player reaches flag
		function reachFlag(player, flag) {
			//stops the timer
			timer.stop();
	
			this.music.stop();
			frictionDragX = 2500;
				
			// did we improved our stars in current level?
			if(game.global.starsArray[game.global.level-1] < this.stars){
				game.global.starsArray[game.global.level-1] = this.stars;
			}
			// if we completed a level and next level is locked - and exists - then unlock it
			if( this.stars > 0 && game.global.starsArray[game.global.level]==4 && game.global.level<game.global.starsArray.length){
				game.global.starsArray[game.global.level] = 0;
			}
			game.state.start('LevelSelect');
		}


		// amount of stars we recieve
		if(this.total < this.goldTime) {
			this.stars = 3;
		}
		else if(this.total < this.silverTime) {
			this.stars = 2;
		}
		else if(this.total < this.bronzeTime) {
			this.stars = 1;
		}
		else this.stars = 0;

		if (game.input.keyboard.isDown(Phaser.Keyboard.J)){
			timer.stop();
			this.music.stop();
			game.state.start('LevelSelect');
		}
	},

	render: function() {
		// show timer01 debug text
		game.debug.text('Time Elapsed: ' + this.total, 32, 32, "#ff3333", '40px');
		game.debug.text('Stars: ' + this.stars, 50, 50, "#FFFFFF", '72px');
		this.dashBar.scale.x = this.player.getDashScale();
	},

	// updates the time
	updateTime: function(){
		this.total++;
	}


}