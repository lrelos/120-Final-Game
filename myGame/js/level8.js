level8 = {
	create: function () {
		this.total = 0;
		this.timer;
		this.timeText;
		this.bronzeTime = 300;
		this.silverTime = 299;
		this.goldTime = 298;
		this.stars = 0;

		this.music = this.add.audio('bgMusic2');
		this.music.play();
		this.music.loop;

		timer = this.time.create(false);
		timer.loop(1000, this.updateTime, this);
		timer.start();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;

		lvl8Map = game.add.tilemap('level8');
		lvl8Map.addTilesetImage('Factory', 'factoryTiles');
		lvl8Map.addTilesetImage('Lava', 'lavaTiles');

		lvl8Layer1 = lvl8Map.createLayer('Background');
		lvl8Layer2 = lvl8Map.createLayer('Background 2');
		lvl8Layer3 = lvl8Map.createLayer('Level Terrain');
		lvl8Layer4 = lvl8Map.createLayer('Lava 1');
		lvl8Layer5 = lvl8Map.createLayer('Lava 2');
		lvl8Layer6 = lvl8Map.createLayer('Lava 3');
		lvl8Layer3.resizeWorld();

		lvl8Map.setCollisionByExclusion([0], true, lvl8Layer3);
		lvl8Map.setCollisionByExclusion([0], true, lvl8Layer4);
		lvl8Map.setCollisionByExclusion([0], true, lvl8Layer5);
		lvl8Map.setCollisionByExclusion([0], true, lvl8Layer6);

		// adding scrolls to fill up dash meter
		// creates scroll objects from tiled
		this.dashScrolls = game.add.group();
		this.dashScrolls.enableBody = true;
		// parameters(Object layer name, named of objects tile reference or gid #, image key name, frame #, exists, autocall, named of group to add objects to)
		lvl8Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);

		this.flags = game.add.group();
		this.flags.enableBody = true;
		lvl8Map.createFromObjects('Items', 'flag', 'flags', 2, true, false, this.flags);
		// sets attributes for  flags
		this.flags.forEach(function(flag){
        flag.body.immovable = true;
        flag.animations.add('flagWave', [0, 1], 2, true);
		flag.animations.play('flagWave');
    	});

		this.lavaWalls2 = game.add.group();
		this.lavaWalls2.enableBody = true;
		lvl8Map.createFromObjects('Hazard', 'lava2', 'lavaWalls', 0, true, false, this.lavaWalls2);

		this.lavaWalls3 = game.add.group();
		this.lavaWalls3.enableBody = true;
		lvl8Map.createFromObjects('Hazard', 'lava3', 'lavaWalls', 0, true, false, this.lavaWalls2);

		// creates new player for this level
		this.player = new Player(game, 127, 700); 
        game.add.existing(this.player);
        //Phaser.Camera.FOLLOW_PLATFORMER = 1;
        game.camera.follow(this.player);
        this.player.resetDash();

        // adds the dash bar
		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;
	},

	update: function() {
		game.physics.arcade.collide(this.player, lvl8Layer3);
		game.physics.arcade.collide(this.player, lvl8Layer4, destroyPlayer1, null, this);
		game.physics.arcade.collide(this.player, lvl8Layer5, destroyPlayer2, null, this);
		game.physics.arcade.collide(this.player, lvl8Layer6, destroyPlayer3, null, this);

		game.physics.arcade.overlap(this.player, this.dashScrolls, collectScroll, null, this);
		game.physics.arcade.overlap(this.player, this.flags, reachFlag, null, this);
		game.physics.arcade.overlap(this.player, this.lavaWalls2, destroyPlayer2, null, this);
		game.physics.arcade.overlap(this.player, this.lavaWalls3, destroyPlayer3, null, this);

		if (this.player.body.y > (game.world.height + this.player.body.height/2)) {
			this.player.body.x = 1040;
			this.player.body.y = 690
        	lvl8Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
        }

        function destroyPlayer1(player){
        	if (!invincible){
        		console.log('destroyPlayer1');
        		this.player.body.x = 128;
        		this.player.body.y = 720;
        		lvl8Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
        	}
        }

        function destroyPlayer2(player){
        	if (!invincible){
        		console.log('destroyPlayer2');
        		this.player.body.x = 2064;
        		this.player.body.y = 310;
        		lvl8Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
        	}
        }

        function destroyPlayer3(player){
        	if (!invincible){
        		console.log('destroyPlayer3');
        		this.player.body.x = 1230;
        		this.player.body.y = 310;
        		lvl8Map.createFromObjects('Items', 'scroll', 'scrolls', 0, true, false, this.dashScrolls);
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