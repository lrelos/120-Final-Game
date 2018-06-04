
var gameOptions = {
    playerGravity: 925, 
    playerSpeed: 200,
    playerJump: 400,
    playerWallJump: 475,
    playerForce: 250
}

var jumpButtonDown = false;
var wallJumpRight = false;
var wallJumpLeft = false;
var inAir = false;
var jumpTime; // var timer so  player can have a bit more time to wall jump

function Player(game, x, y, frame) {
	// call to Phaser.sprite // new sprite (game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, 'ninja', 'idle');
	this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.3);

    this.animations.add('run', Phaser.Animation.generateFrameNames('run', 1, 8), 10, true);

	// add properties
    game.physics.arcade.enable(this);

    this.body.collideWorldBounds = false;
    this.body.gravity.y = gameOptions.playerGravity;
    this.frameName = 'jump';
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;





Player.prototype.update = function() {

		if(this.body.velocity.x > 0){
			this.scale.x = 0.3;
		}else if (this.body.velocity.x < 0){
			this.scale.x = -0.3;
		}

    //stops player velocity after jumping
        if (this.body.blocked.down || this.body.touching.down) {
            inAir = false;
            wallJumpLeft = false;
            wallJumpRight = false;
            this.body.velocity.x = 0;
            if (!game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            	this.frameName = 'idle';
            }
        }else{
            inAir = true;
        }

        //running animsation for left and right movement
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !inAir){
        	this.scale.x = -0.3
            this.body.velocity.x = -gameOptions.playerSpeed;
            this.animations.play('run');
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && !inAir){
        	this.scale.x = 0.3
            this.body.velocity.x = gameOptions.playerSpeed;
            this.animations.play('run');
        } 



        //stops velocity and animation when releasing button  for the right
        if (game.input.keyboard.justReleased(Phaser.Keyboard.RIGHT) || game.input.keyboard.justReleased(Phaser.Keyboard.LEFT)){
            if(inAir == false) {
                this.animations.stop();
                this.frameName = 'idle';
                this.body.velocity.x = 0;
            } // stops it for the left
        }

        // Can only jump once while  on top of a platform
        if ((this.body.blocked.down || this.body.touching.down) && !inAir) {
            if(!jumpButtonDown && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            	this.animations.stop();
            	this.frameName = 'jump';
                this.body.velocity.y = -gameOptions.playerJump;
                jumpButtonDown = true;
            }

            if(jumpButtonDown && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                jumpButtonDown = false;
            }
        }
        

        // Wall jump solution 1
        // Wall Jump Right
        // Checks if player is in Air, holding right against all to the right,
        // and if player is blocked wall
        if(inAir){
        if (this.body.blocked.right || this.body.touching.right) {
        	this.animations.stop();
            wallJumpRight = true;
            this.frameName = 'wallCling'
        } else if(this.body.blocked.left || this.body.touching.left) {
        	this.animations.stop();
            wallJumpLeft = true;
            this.frameName = 'wallCling'
        }
}

        //Wall jump Right
        if (wallJumpRight && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.frameName = 'jump';
            this.body.velocity.y = -gameOptions.playerWallJump;
            this.body.velocity.x = -gameOptions.playerForce;
            wallJumpRight = false;
        }

    

        //Wall jump Left
         if (wallJumpLeft && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.frameName = 'jump';
            this.body.velocity.y = -gameOptions.playerWallJump;
            this.body.velocity.x =  gameOptions.playerForce;
            wallJumpLeft = false;
        }


}
