var dashBar = null;

Level2 = {
	create: function() {

		this.total = 0;
		this.timer;
   		this.timeText;
		this.bronzeTime = 120;
		this.silverTime = 90;
		this.goldTime = 60;
		this.stars = 0;

		// Plays Background Music
        this.music = this.add.audio('bgMusic');
        this.music.play();
        this.music.loop;

        //creates timer object
        timer = this.time.create(false);
        timer.loop(1000, this.updateTime, this);
        timer.start();

		game.physics.startSystem(Phaser.Physics.ARCADE);
	
	    this.background = game.add.tileSprite(0, 0, 2450, 1750, 'lvl2Background');
		//game.stage.backgroundColor = '#FFF000';

		lvl2Map = game.add.tilemap('Level2');

		lvl2Map.addTilesetImage('Level_2', 'sandTiles');


		game.cache.getTilemapData('Level2').data;


		lvl2Map.setCollisionByExclusion([0, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 48, 49 ], true);

		lvl2Layer = lvl2Map.createLayer('sandTerrain');

		lvl2Layer.resizeWorld();




		this.player = new Player(game, 100, 1000); 
        game.add.existing(this.player);
        //Phaser.Camera.FOLLOW_PLATFORMER = 1;
        game.camera.follow(this.player);

		this.dashBar = this.add.sprite(20, 60, 'dashBar');
		this.dashBar.scale.y = 0.5;
		this.dashBar.fixedToCamera = true;

	},

	update: function() {
		game.physics.arcade.collide(this.player, lvl2Layer);

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
		this.dashBar.scale.x = dash*(1/90);
	},

	updateTime: function(){
		this.total++;
	}

}