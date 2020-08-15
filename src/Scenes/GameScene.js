import 'phaser';
import gameOptions from '../Config/gameOptions';
import config from '../Config/config';
import api from '../Services/api';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.lives = 3;
        this.score = 0;
        this.gameOver = false;
        this.keys = {};
        this.heart1 = {};
        this.heart2 = {};
        this.heart3 = {};
        this.model = {};
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY) {
        this.addedPlatforms++;
        let platform;
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio = platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        } else {
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        // is there a coin over the platform?
        if (this.addedPlatforms > 1) {
            if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
                if (this.coinPool.getLength()) {
                    let coin = this.coinPool.getFirst();
                    coin.x = posX;
                    coin.y = posY - 96;
                    coin.alpha = 1;
                    coin.active = true;
                    coin.visible = true;
                    this.coinPool.remove(coin);
                } else {
                    let coin = this.physics.add.sprite(posX, posY - 96, "coin");
                    coin.setImmovable(true);
                    coin.setVelocityX(platform.body.velocity.x);
                    coin.anims.play("rotate");
                    coin.setDepth(2);
                    this.coinGroup.add(coin);
                }
            }
        }

        // is there a fire over the platform?
        if (Phaser.Math.Between(1, 100) <= gameOptions.firePercent) {
            if (this.firePool.getLength()) {
                let fire = this.firePool.getFirst();
                fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                fire.y = posY - 46;
                fire.alpha = 1;
                fire.active = true;
                fire.visible = true;
                this.firePool.remove(fire);
            } else {
                let fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "fire");
                fire.setImmovable(true);
                fire.setVelocityX(platform.body.velocity.x);
                fire.setSize(8, 2, true)
                fire.anims.play("burn");
                fire.setDepth(2);
                this.fireGroup.add(fire);
            }
        }
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump() {
        if ((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))) {
            if (this.player.body.touching.down) {
                if (this.lives !== 0) {
                    this.jumpSound = this.sound.add('jumpSound', { volume: 0.8, loop: false });
                    this.jumpSound.play();
                }
                this.playerJumps = 0;
                this.scoreUp();
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps++;

            // stops animation
            this.player.anims.stop();
        }
    }

    // adding mountains
    addMountains() {
        let rightmostMountain = this.getRightmostMountain();
        if (rightmostMountain < config.width * 2) {
            let mountain = this.physics.add.sprite(rightmostMountain + Phaser.Math.Between(100, 350), config.height + Phaser.Math.Between(0, 100), "mountain");
            mountain.setOrigin(0.5, 1);
            mountain.body.setVelocityX(gameOptions.mountainSpeed * -1)
            this.mountainGroup.add(mountain);
            if (Phaser.Math.Between(0, 1)) {
                mountain.setDepth(1);
            }
            mountain.setFrame(Phaser.Math.Between(0, 3))
            this.addMountains()
        }
    }

    // getting rightmost mountain x position
    getRightmostMountain() {
        let rightmostMountain = -200;
        this.mountainGroup.getChildren().forEach(function(mountain) {
            rightmostMountain = Math.max(rightmostMountain, mountain.x);
        })
        return rightmostMountain;
    }

    addScoreDisplay() {
        switch (this.lives) {
            case (1):
                this.heart1 = this.add.image(40, 40, "heart1");
                break;
            case 2:
                this.heart1 = this.add.image(40, 40, "heart1");
                this.heart2 = this.add.image(80, 40, "heart2");
                break;
            case 3:
                this.heart1 = this.add.image(40, 40, "heart1");
                this.heart2 = this.add.image(80, 40, "heart2");
                this.heart3 = this.add.image(120, 40, "heart3");
                break;
            default:
                break;
        }
        this.scoreText = this.add.text(config.width - 200, 40, 'Score: ' + this.score, {
            fontSize: 20,
            fill: '#fff'
        });
    }

    scoreUp(value = 25) {
        this.score += value;
        this.updateScore();
    }

    updateScore() {
        this.scoreText.setText('Score: ' + this.score);
    }

    lifeOver() {
        this.lives--;
        this.downerSound = this.sound.add('downerSound', { volume: 0.5, loop: false });
        this.downerSound.play();
        switch (this.lives) {
            case (2):
                this.heart3.visible = false;
                break;
            case (1):
                this.heart2.visible = false;
            default:
                this.heart1.visible = false;
                break;
        }
    }

    saveScore(callback) {
        api.saveScore(this.model.playerName, this.score).then(() => {
            callback();
        });
    }

    preload() {
        this.addScoreDisplay();
        this.keys.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.model = this.sys.game.globals.model;
    }

    create() {

        // group with all active mountains.
        this.mountainGroup = this.add.group();

        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform) {
                platform.scene.platformPool.add(platform)
            }
        });

        // pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform) {
                platform.scene.platformGroup.add(platform)
            }
        });

        // group with all active coins.
        this.coinGroup = this.add.group({
            // once a coin is removed, it's added to the pool
            removeCallback: function(coin) {
                coin.scene.coinPool.add(coin)
            }
        });

        // coin pool
        this.coinPool = this.add.group({
            // once a coin is removed from the pool, it's added to the active coins group
            removeCallback: function(coin) {
                coin.scene.coinGroup.add(coin)
            }
        });

        // group with all active firecamps.
        this.fireGroup = this.add.group({

            // once a firecamp is removed, it's added to the pool
            removeCallback: function(fire) {
                fire.scene.firePool.add(fire)
            }
        });

        // fire pool
        this.firePool = this.add.group({

            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(fire) {
                fire.scene.fireGroup.add(fire)
            }
        });

        // adding a mountain
        this.addMountains()

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // number of consecutive jumps made by the player
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(config.width, config.width / 2, config.height * gameOptions.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, config.height * 0.7, "player");
        this.player.setGravityY(gameOptions.playerGravity);
        this.player.setDepth(2);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup, function() {
            // play "run" animation if the player is on a platform
            if (!this.player.anims.isPlaying) {
                this.player.anims.play("run");
            }
        }, null, this);

        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin) {
            this.riserSound = this.sound.add('riserSound', { volume: 0.5, loop: false });
            this.riserSound.play();
            this.scoreUp(50);
            this.tweens.add({
                targets: coin,
                y: coin.y - 100,
                alpha: 0,
                duration: 800,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function() {
                    this.coinGroup.killAndHide(coin);
                    this.coinGroup.remove(coin);
                }
            });
        }, null, this);

        // setting collisions between the player and the fire group
        this.physics.add.overlap(this.player, this.fireGroup, function(player, fire) {

            this.dying = true;
            this.player.anims.stop();
            this.player.setFrame(2);
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);

        }, null, this);

        this.model = this.sys.game.globals.model;
        if (this.model.musicOn === true && this.model.bgMusicPlaying === true) {
            this.sys.game.globals.bgMusic.stop();
            this.model.bgMusicPlaying = false;
            this.bgMusicGame = this.sound.add('bgMusicGame', { volume: 0.5, loop: true });
            this.bgMusicGame.play();
            this.sys.game.globals.bgMusicGame = this.bgMusicGame;
        }
    }

    update() {
        //jumping listener
        if (Phaser.Input.Keyboard.JustDown(this.keys.keyEnter)) {
            this.jump();
        }

        // game over
        if (this.player.y > config.height) {
            this.lifeOver();
            if (this.lives === 0) {
                this.scene.pause();
                game = this;
                game.sys.game.globals.bgMusicGame.stop();
                this.bgGameOverMusic = this.sound.add('bgGameOverMusic', { volume: 0.5, loop: false });
                this.bgGameOverMusic.play();
                this.timedEvent = this.time.delayedCall(2000, this.saveScore(function() {
                    game.model.score = game.score;
                    game.scene.start("GameOver");
                    game.sys.game.globals.bgMusic.play();
                    game.model.bgMusicPlaying = true;
                    game.lives = 3;
                    game.score = 0;
                }), [], this);
            } else {
                this.scene.start("Game");
            }
        }
        this.player.x = gameOptions.playerStartPosition;

        // recycling platforms
        let minDistance = config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform) {
            let platformDistance = config.width - platform.x - platform.displayWidth / 2;
            if (platformDistance < minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if (platform.x < -platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling coins
        this.coinGroup.getChildren().forEach(function(coin) {
            if (coin.x < -coin.displayWidth / 2) {
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }
        }, this);

        // recycling fire
        this.fireGroup.getChildren().forEach(function(fire) {
            if (fire.x < -fire.displayWidth / 2) {
                this.fireGroup.killAndHide(fire);
                this.fireGroup.remove(fire);
            }
        }, this);

        // recycling mountains
        this.mountainGroup.getChildren().forEach(function(mountain) {
            if (mountain.x < -mountain.displayWidth) {
                let rightmostMountain = this.getRightmostMountain();
                mountain.x = rightmostMountain + Phaser.Math.Between(100, 350);
                mountain.y = config.height + Phaser.Math.Between(0, 100);
                mountain.setFrame(Phaser.Math.Between(0, 3))
                if (Phaser.Math.Between(0, 1)) {
                    mountain.setDepth(1);
                }
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }
};

function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

window.onload = () => {
    window.focus();
    resize();
    window.addEventListener('resize', resize, false);
};