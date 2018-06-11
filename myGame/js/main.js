var game = new Phaser.Game(800, 600, Phaser.AUTO);

var numOfLevels = 8;
var frictionDragX = 2500;
var frictionDragY = 950;

//global vars for level select menu
game.global = {
	thumbRows : 2,
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
	starsArray : [0,4,4,4,4,4,4,4],
	// level currently playing
	level : 0
}

game.state.add("Boot", Boot);
game.state.add("Loading", loading);
game.state.add("titleScreen", titleScreen);
game.state.add('controls', controls);
game.state.add('credits', credits);
game.state.add("LevelSelect", levelSelect);
game.state.add("lvl1", Level7);
game.state.add("lvl2", Level2);
game.state.add("lvl3", Level1);
game.state.add("lvl4", Level5);
game.state.add("lvl5", Level4);
game.state.add("lvl6", Level6);
game.state.add("lvl7", Level3);
game.state.add('lvl8', level8);
game.state.start("Boot");
