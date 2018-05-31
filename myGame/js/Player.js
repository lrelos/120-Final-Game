
var gameOptions = {
    playerGravity: 900, 
    playerSpeed: 200,
    playerJump: 400,
    playerWallJump: 400,
    playerForce: 225
}

var jumpButtonDown = false;
var wallJumpRight = false;
var wallJumpLeft = false;
var inAir = false;
var jumpTime; // var timer so  player can have a bit more time to wall jump

function Player(game, x, y, frame) {
	// call to Phaser.sprite // new sprite (game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, 'player', 'rightIdle');

    this.animations.add('rightRun', Phaser.Animation.generateFrameNames('rightRun', 1, 8), 10, true);
    this.animations.add('leftRun', Phaser.Animation.generateFrameNames('leftRun', 1, 8), 10, true);

	// add properties
    game.physics.arcade.enable(this);

	this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.3);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = gameOptions.playerGravity;

    this.playerIdleLeft = false;
    this.playerIdleRight = false;

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;





Player.prototype.update = function() {

    //stops player velocity after jumping
        if (this.body.touching.down) {
            inAir = false;
            this.body.velocity.x = 0;
            if (this.scale.x < 0) {
                this.scale.x *= -1;
            }
        }else{
            inAir = true;
        }

        //running animsation for left and right movement
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !inAir){
            //this.scale.x = -1;
            this.body.velocity.x = -gameOptions.playerSpeed;
            this.animations.play('leftRun');
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && !inAir){
            //this.scale.x *= 1;
            this.body.velocity.x = gameOptions.playerSpeed;
            this.animations.play('rightRun');
        } 



        //stops velocity and animation when releasing button  for the right
        if (game.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)){
            if(inAir == false) {
                this.animations.stop();
                this.frameName = 'rightIdle';
                this.body.velocity.x = 0;
            } // stops it for the left
        } else if (game.input.keyboard.justReleased(Phaser.Keyboard.LEFT)){
            if(inAir == false) {
                this.animations.stop();
                this.frameName = 'leftIdle';
                this.body.velocity.x = 0;
            }
        } 

        if(inAir){
            if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                if (this.scale.x < 0) {
                    this.scale.x *= -1;
                }
                this.animations.stop();
                this.frameName = 'leftJump';
            }else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                if (this.scale.x < 0) {
                    this.scale.x *= -1;
                }       
                this.animations.stop();
                this.frameName = 'rightJump';
            }
        }





        // Can only jump once while  on top of a platform
        if (this.body.touching.down && !inAir) {
            if(!jumpButtonDown && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
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
        // and if player is touching wall
        if (inAir && this.body.touching.right) {
            jumpTime = game.time.time + 500;
            wallJumpRight = true;

        } else if(inAir && this.body.touching.left) {
            jumpTime = game.time.time + 500;
            wallJumpLeft = true;
        }

        //Wall jump Right
        if (wallJumpRight && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && game.time.time < jumpTime) {
            this.scale.x *= -1;
            this.body.velocity.y = -gameOptions.playerWallJump;
            this.body.velocity.x = -gameOptions.playerForce;
            wallJumpRight = false;
        }

    

        //Wall jump Left
         if (wallJumpLeft && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && game.time.time < jumpTime) {
            this.scale.x *= -1;
            this.body.velocity.y = -gameOptions.playerWallJump;
            this.body.velocity.x =  gameOptions.playerForce;
            wallJumpLeft = false;
        }


}
