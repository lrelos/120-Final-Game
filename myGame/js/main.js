var game = new Phaser.Game(800, 600, Phaser.AUTO);

var Inputs = {};

var timer;
var timeText;
var bronzeTime = 90;
var silverTime = 60;
var goldTime = 35;
var stars = 0;
var numOfLevels = 2;
var dashSound;
var frictionDragX = 2500;
var frictionDragY = 950;

//global vars for level select menu
game.global = {
	thumbRows : 3,
	// number of thumbnail cololumns
	thumbCols : 3,
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
	starsArray : [0,0,0,0,0,0,0,0,0],
	// level currently playing
	level : 0
}

Inputs.play = function(game){

};
Inputs.play.prototype = {
	preload: function(){
		// place your assets
	},
	create: function(){
		
	},
	update: function(){
		
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


game.state.add("Boot", Boot);
game.state.add("Loading", loading);
game.state.add("titleScreen", titleScreen);
game.state.add('controls', controls);
game.state.add('credits', credits);
game.state.add("LevelSelect", levelSelect);
game.state.add("lvl1", Level1);	//"lvl1", Inputs.play
game.state.add("gameover", Inputs.gameover);
game.state.add("lvl2", Level2);
game.state.add("lvl3", Level3);
game.state.add("lvl4", Level4);
game.state.add("lvl5", Level5);
game.state.add("lvl6", Level6);
game.state.add("lvl7", Level7);
game.state.add('lvl8', level8);
game.state.start("Boot");
