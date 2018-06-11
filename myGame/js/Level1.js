var dashBar = null;

Level1 = {
	create: function() {

		this.total = 0;
		this.timer;
   		this.timeText;
		this.bronzeTime = 90;
		this.silverTime = 60;
		this.goldTime = 40;
		this.stars = 0;

		// Plays Background Music
        this.music = this.add.audio('bgMusic1');
        this.music.loopFull();

        //creates timer object
        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;  // prevents tunneling through floor when falling

		// adds the background image. Separate from tile
	    this.background = game.add.tileSprite(0, 0, 5500, 3093, 'lvl1Background');

	    // creates the tile map
		lvl1Map = game.add.tilemap('Level1');
		lvl1Map.addTilesetImage('NatureSheet', 'tutorial');

		// sets collision by exclusion. Player will collide with everything except these numbers
		lvl1Map.setCollisionByExclusion([0], true);

		// creates the layer and reiszes the world to match
		lvl1Layer = lvl1Map.createLayer('Ground');
		lvl1Layer.resizeWorld();


		// adding scrolls to fill up dash meter
		// creates scroll objects from tiled
		this.dashScrolls = game.add.group();
		this.dashScrolls.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl1Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);


		// creates new player for this level
		this.player = new Player(game, 150, 2425); //(game, x, y )
        game.add.existing(this.player);
        //Phaser.Camera.FOLLOW_PLATFORMER = 1;
        game.camera.follow(this.player);

        // adds the dash bar
		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;

		this.flags = game.add.group();
		this.flags.enableBody = true;
		lvl1Map.createFromObjects('Items', 'flag', 'flags', 2, true, false, this.flags);
		// sets attributes for  flags
		this.flags.forEach(function(flag){
        	flag.body.immovable = true;
        	flag.animations.add('flagWave', [0, 1], 2, true);
			flag.animations.play('flagWave');
		});

		// Keeps friction constant
    	frictionDragX = 2500;
    	this.player.resetDash();

	},

	update: function() {

		// adds collision for player and tiled map
		game.physics.arcade.collide(this.player, lvl1Layer);
		// adds overlap for player and scroll
		game.physics.arcade.overlap(this.player, this.dashScrolls, collectScroll, null, this);
		// adds overlap for player and flag
		game.physics.arcade.overlap(this.player, this.flags, reachFlag, null, this);

		if (this.player.body.y > (game.world.height + this.player.body.height/4)) {
			this.player.kill();

			// creates new player if player dies or falls of world
			this.player = new Player(game, 150, 2425); 
        	game.add.existing(this.player);
        	//Phaser.Camera.FOLLOW_PLATFORMER = 1;
        	game.camera.follow(this.player);
        	lvl1Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
 		}

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
