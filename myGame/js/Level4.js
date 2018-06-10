var dashBar = null;

Level4 = {
	create: function() {

		this.total = 0;
		this.timer;
   		this.timeText;
		this.bronzeTime = 120;
		this.silverTime = 90;
		this.goldTime = 60;
		this.stars = 0;

		// Plays Background Music
        this.music = this.add.audio('bgMusic1');
        this.music.play();
        this.music.loop;

        //creates timer object
        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;

		// adds the background image. Separate from tile
	    this.background = game.add.tileSprite(0, 2200, 4250, 2700, 'lvl4Background');

	    // creates the tile map
		lvl4Map = game.add.tilemap('Level4');
		lvl4Map.addTilesetImage('sheet', 'metalTiles');

		// sets collision by exclusion. Player will collide with everything except these numbers
		lvl4Map.setCollisionByExclusion([0], true);

		// creates the layer and reiszes the world to match
		lvl4Layer = lvl4Map.createLayer('metalTerrain');
		lvl4Layer.resizeWorld();


		// adding scrolls to fill up dash meter
		// creates scroll objects from tiled
		this.dashScrolls = game.add.group();
		this.dashScrolls.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl4Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);


		// creates new player for this level
		this.player = new Player(game, 150, 4500); //(game, x, y )
        game.add.existing(this.player);
        //Phaser.Camera.FOLLOW_PLATFORMER = 1;
        game.camera.follow(this.player);

        // adds the dash bar
		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;

		this.flags = game.add.group();
		this.flags.enableBody = true;
		lvl4Map.createFromObjects('Items', 'flag', 'flags', 2, true, false, this.flags);
		// sets attributes for  flags
		this.flags.forEach(function(flag){
        	flag.body.immovable = true;
        	flag.animations.add('flagWave', [0, 1], 2, true);
			flag.animations.play('flagWave');
		});

		// hazard group 1
		this.hazards = game.add.group();
		this.hazards.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl4Map.createFromObjects('Items', 'hazard', 'hazards', 1, true, false, this.hazards);
		// sets attributes for  hazards
		this.hazards.forEach(function(hazard){
        	hazard.body.immovable = true;
        	hazard.body.velocity.y = 100;
        	hazard.animations.add('electricity', [0, 1, 2, 3], 4, true);
			hazard.animations.play('electricity');
    	});

    	 // hazard group 2
    	this.hazards2 = game.add.group();
		this.hazards2.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl4Map.createFromObjects('Items', 'hazard2', 'hazards2', 1, true, false, this.hazards2);
		// sets attributes for  hazards
		this.hazards2.forEach(function(hazard2){
        	hazard2.body.immovable = true;
        	hazard2.body.velocity.x = -200;
        	hazard2.animations.add('electricity2', [0, 1, 2, 3], 4, true);
			hazard2.animations.play('electricity2');
    	});
        
        //hazard group 3
    	this.hazards3 = game.add.group();
		this.hazards3.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl4Map.createFromObjects('Items', 'hazard3', 'hazards2', 1, true, false, this.hazards3);
		// sets attributes for  hazards
		this.hazards3.forEach(function(hazard3){
        	hazard3.body.immovable = true;
        	hazard3.body.velocity.x = 175;
        	hazard3.animations.add('electricity3', [0, 1, 2, 3], 4, true);
			hazard3.animations.play('electricity3');
    	});
        
        // hazard group 4
    	this.hazards4 = game.add.group();
		this.hazards4.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl4Map.createFromObjects('Items', 'hazard4', 'hazards2', 1, true, false, this.hazards4);
		// sets attributes for  hazards
		this.hazards4.forEach(function(hazard4){
       		hazard4.body.immovable = true;
        	hazard4.animations.add('electricity4', [0, 1, 2, 3], 4, true);
			hazard4.animations.play('electricity4');
    	});

	},

	update: function() {

		// adds collision for player and tiled map
		game.physics.arcade.collide(this.player, lvl4Layer);
		// adds overlap for player and scroll
		game.physics.arcade.overlap(this.player, this.dashScrolls, collectScroll, null, this);
		// adds overlap for player and flag
		game.physics.arcade.overlap(this.player, this.flags, reachFlag, null, this);

		if (this.player.body.y > (game.world.height + this.player.body.height/4)) {
			this.player.kill();

			// creates new player if player dies or falls of world
			this.player = new Player(game, 150, 4500); 
        	game.add.existing(this.player);
        	//Phaser.Camera.FOLLOW_PLATFORMER = 1;
        	game.camera.follow(this.player);
 		}

		function collectScroll(player, scroll) {
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