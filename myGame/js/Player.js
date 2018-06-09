
var gameOptions = {
    playerGravity: 925, 
    playerSpeed: 200,
    playerJump: 400,
    playerWallJump: 400,
    playerForce: 250,

    playerGravity: 900, 
    playerSpeed: 250,
    playerJump: 400,
    playerWallJump: 450,
    playerForce: 225,
    playerDash: 400

}

var jumpButtonDown = false;
var wallJumpRight = false;
var wallJumpLeft = false;
var inAir = false;
var dash = 0;
var defaultDash = 0;
var jumpTime = 0;
var timeAfterJump = 0;
var invincible = false;


function Player(game, x, y, frame) {
	// call to Phaser.sprite // new sprite (game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, 'ninja', 'wallCling');
	this.anchor.setTo(0.5, 0);
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
            if (!game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && !game.input.keyboard.isDown(Phaser.Keyboard.D)){
            	this.frameName = 'idle';
            }
        }else{
            inAir = true;
        }

        //running animsation for left and right movement
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        	if(!inAir || (inAir && game.time.time > jumpTime)){
            	this.body.velocity.x = -gameOptions.playerSpeed;
            	if (!inAir) this.animations.play('run');
            }
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        	if(!inAir || (inAir && game.time.time > jumpTime)){
            	this.body.velocity.x = gameOptions.playerSpeed;
            	if (!inAir) this.animations.play('run');
            }
        } 



        //stops velocity and animation when releasing button  for the right
        if ((game.input.keyboard.justReleased(Phaser.Keyboard.RIGHT) || game.input.keyboard.justReleased(Phaser.Keyboard.LEFT)) && !game.input.keyboard.isDown(Phaser.Keyboard.D)){
            if(inAir == false) {
                this.animations.stop();
                this.frameName = 'idle';
                this.body.velocity.x = 0;
            } // stops it for the left
        }

        // Can only jump once while  on top of a platform
        if ((this.body.blocked.down || this.body.touching.down) && !inAir) {
            if(!jumpButtonDown && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            	inAir = true;
            	this.animations.stop();
            	this.frameName = 'jump';
                this.body.velocity.y = -gameOptions.playerJump;
                jumpButtonDown = true;
                timeAfterJump = game.time.time + 250;
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
            if ((this.body.blocked.right || this.body.touching.right) && game.time.time > timeAfterJump) {
        	    this.animations.stop();
                wallJumpRight = true;
                this.frameName = 'wallCling'
            } else if((this.body.blocked.left || this.body.touching.left) && game.time.time > timeAfterJump) {
        	   this.animations.stop();
                wallJumpLeft = true;
                this.frameName = 'wallCling'
            }else{
            	wallJumpRight = wallJumpLeft = false;
            	this.animations.stop();
            	this.frameName = 'jump';	
            }
        }
        if((wallJumpRight && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) || wallJumpLeft && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ){
            this.frameName = 'jump';
            wallJumpRight = false;
            wallJumpLeft = false;
        }

        //Wall jump Right
        if (wallJumpRight && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.frameName = 'jump';
            this.body.velocity.y = -gameOptions.playerWallJump;
            this.body.velocity.x = -gameOptions.playerForce;
            wallJumpRight = false;
            jumpTime = game.time.time + 425;
        }

        //Wall jump Left
         if (wallJumpLeft && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.frameName = 'jump';
            this.body.velocity.y = -gameOptions.playerWallJump;
            this.body.velocity.x =  gameOptions.playerForce;
            wallJumpLeft = false;
            jumpTime = game.time.time + 425;
        }

 		// *********************
        // Dash Code
        // *********************

        // Dashes left or right depending on input or where the player is facing if there is no input.
        if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && dash >0){
            wallJumpRight = wallJumpLeft = false;
            this.body.velocity.x = -gameOptions.playerDash;
            this.body.velocity.y = 0;
            if(inAir){
            	this.animations.stop();
            	this.body.gravity.y = 0;
            	this.frameName = 'run2';
            }
            invincible = true;
            dash -= 1;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.body.velocity.y = 0;
            this.body.velocity.x = gameOptions.playerDash;
            if(inAir){
            	this.body.gravity.y = 0;
            	this.animations.stop();
            	this.frameName = 'run2';
            }
            invincible = true;
            dash -= 1;
        }else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && this.scale.x < 0 && dash >0){
            wallJumpRight = wallJumpLeft = false;
            this.body.velocity.x = -gameOptions.playerDash;
            this.body.velocity.y = 0;
            if(inAir){
            	this.animations.stop();
            	this.body.gravity.y = 0;
            	this.frameName = 'run2';
            } else{
            	this.animations.play('run');
            }
            invincible = true;
            dash -= 1;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && this.scale.x > 0 && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.body.velocity.y = 0;
            this.body.velocity.x = gameOptions.playerDash;
            if(inAir){
            	this.body.gravity.y = 0;
            	this.animations.stop();
            	this.frameName = 'run2';
            }else{
            	this.animations.play('run');
            }
            invincible = true;
            dash -= 1;
        }

        //Dashes up if up key is down
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && game.input.keyboard.isDown(Phaser.Keyboard.D) && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.body.gravity.y = 0;
            this.body.velocity.y = -gameOptions.playerDash; 
            this.body.velocity.x = 0;
            this.frameName = 'dashUp';
            invincible = true;
            dash -= 2;
        }

        //Dashes down in midair if down key is down
        if (inAir && game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && game.input.keyboard.isDown(Phaser.Keyboard.D) && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.body.gravity.y = 0;
            this.body.velocity.y = gameOptions.playerDash;
            this.body.velocity.x = 0; 
            this.frameName = 'dashDown';
            invincible = true;
            dash -= 1;
        }
        // Dashes down and to the right if both down and right keys are down
        if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && inAir && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.frameName = 'dashDown';
        	this.body.gravity.y = 0;
             this.body.velocity.x = Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             this.body.velocity.y = Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             invincible = true;
             dash -= 1;
        }

        //Dashes down and to the left if both down and left keys are down
        if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && inAir && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.frameName = 'dashDown';
        	this.body.gravity.y = 0;
             this.body.velocity.x = -Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             this.body.velocity.y = Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             invincible = true;
             dash -=1;
        }

        //Dashes up and to the right if both up and right keys are down
        if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.UP) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.frameName = 'dashUp';
        	this.body.gravity.y = 0;
             this.body.velocity.x = Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             this.body.velocity.y = -Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             invincible = true;
             dash -=2;
        }

        //Dashes up and to the left if both up and left keys are down
        if(game.input.keyboard.isDown(Phaser.Keyboard.D) && game.input.keyboard.isDown(Phaser.Keyboard.UP) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && dash >0){
            wallJumpRight = wallJumpLeft = false;
        	this.frameName = 'dashUp';
        	this.body.gravity.y = 0;
             this.body.velocity.x = -Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             this.body.velocity.y = -Math.sqrt(Math.pow(gameOptions.playerDash, 2)/2);
             invincible = true;
             dash -= 2;
        }

        // Stops the running animation after the dash button is released or dash resource runs out
        if(game.input.keyboard.justReleased(Phaser.Keyboard.D) || (game.input.keyboard.isDown(Phaser.Keyboard.D) && dash <= 0)){
        	invincible = false;
        	this.body.gravity.y = gameOptions.playerGravity;
        	if(inAir){
        		if(wallJumpRight || wallJumpLeft){
        			this.frameName = 'wallCling';
        		}else{
        			this.frameName = 'jump';
        		}
        	}else if(this.body.velocity.x == 0){
        		this.frameName = 'idle';
        	}
        }

        //Binds dash between 0 and 180
        if(dash <= 0) dash=0;
        if(dash >=180) dash=180;

        //Debug function to increase dash at will
        if(game.input.keyboard.isDown(Phaser.Keyboard.P)) dash += 2;

}

//Makes dash value visible by other files for purpose of dash bar in UI
Player.prototype.getDashScale = function() {
    return dash/180;
}

Player.prototype.reset = function(){
    dash = defaultDash;
}