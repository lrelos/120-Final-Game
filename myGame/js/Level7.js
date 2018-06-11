Level7 = {
	create: function() {
		this.total = 0;
		this.timer;
		this.timeText;
		this.bronzeTime = 60;
		this.silverTime = 45;
		this.goldTime = 32;
		this.stars = 0;

		this.music = this.add.audio('bgMusic1');
		this.music.loopFull();

		timer = this.time.create(false);
		timer.loop(1000, this.updateTime, this);
		timer.start();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;

		lvl1Map = game.add.tilemap('level7');
		lvl1Map.addTilesetImage('Dark Dirt', 'rockTiles');
		lvl1Map.addTilesetImage('Spikes', 'spikes');

		lvl1Layer2 = lvl1Map.createLayer('Sky Background');
		lvl1Layer3 = lvl1Map.createLayer('Sky Decor');
		lvl1Layer1 = lvl1Map.createLayer('Level Terrain');
		lvl1Layer4 = lvl1Map.createLayer('Terrain Decor');
		lvl1Layer5 = lvl1Map.createLayer('Hazzard Terrain');
		lvl1Layer1.resizeWorld();

		lvl1Map.setCollisionByExclusion([0], true, lvl1Layer1);
		lvl1Map.setCollisionByExclusion([0], true, lvl1Layer5);

		// adding scrolls to fill up dash meter
		// creates scroll objects from tiled
		this.dashScrolls = game.add.group();
		this.dashScrolls.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl1Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);

		this.flags = game.add.group();
		this.flags.enableBody = true;
		lvl1Map.createFromObjects('Items', 'flag', 'flags', 2, true, false, this.flags);
		// sets attributes for  flags
		this.flags.forEach(function(flag){
        flag.body.immovable = true;
        flag.animations.add('flagWave', [0, 1], 2, true);
		flag.animations.play('flagWave');
    	});

		// creates new player for this level
		this.player = new Player(game, 96, 443); 
        game.add.existing(this.player);
        //Phaser.Camera.FOLLOW_PLATFORMER = 1;
        game.camera.follow(this.player);

        // adds the dash bar
		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;

		// Keeps friction constant
    	frictionDragX = 2500;
	},

	update: function() {

		// adds collision for player and tiled map
		game.physics.arcade.collide(this.player, lvl1Layer1);
		game.physics.arcade.collide(this.player, lvl1Layer5, destroyPlayer2, null, this);
		// adds overlap for player and scroll
		game.physics.arcade.overlap(this.player, this.dashScrolls, collectScroll, null, this);
		game.physics.arcade.overlap(this.player, this.flags, reachFlag, null, this);

		if (this.player.body.y > (game.world.height + this.player.body.height/2)) {
			console.log('Death');
			this.player.kill();

			// creates new player if player dies or falls of world
			this.player = new Player(game, 96, 443); 
        	game.add.existing(this.player);
        	//Phaser.Camera.FOLLOW_PLATFORMER = 1;
        	game.camera.follow(this.player);
        	lvl1Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
        }

		function destroyPlayer2(player){
			if (!invincible){
				this.player.body.x = 2223;
				this.player.body.y = 335;
			}
		}


		function collectScroll(player, scroll) {
			this.scrollSound = this.add.audio('pickUpScroll');
        	this.scrollSound.play();
			scroll.kill(); // kills scroll
			dash += 60; // adds to the dash meter
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