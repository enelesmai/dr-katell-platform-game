/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable import/no-named-as-default */
import Phaser from 'phaser';
import gameOptions from '../Config/gameOptions';
import config from '../Config/config';
import api from '../Services/api';
import GameLogic from '../Services/gamelogic';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.keys = {};
        this.heart1 = {};
        this.heart2 = {};
        this.heart3 = {};
        this.model = {};
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY) {
        this.addedPlatforms += 1;
        let platform;
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        } else {
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform');
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(
                Phaser.Math.Between(
                    gameOptions.platformSpeedRange[0],
                    gameOptions.platformSpeedRange[1],
                ) * -1,
            );
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(
            gameOptions.spawnRange[0],
            gameOptions.spawnRange[1],
        );

        // is there a bubble over the platform?
        if (this.addedPlatforms > 1) {
            if (Phaser.Math.Between(1, 100) <= gameOptions.bubblePercent) {
                if (this.bubblePool.getLength()) {
                    const bubble = this.bubblePool.getFirst();
                    bubble.x = posX;
                    bubble.y = posY - 96;
                    bubble.alpha = 1;
                    bubble.active = true;
                    bubble.visible = true;
                    this.bubblePool.remove(bubble);
                } else {
                    const bubble = this.physics.add.sprite(posX, posY - 96, 'bubble');
                    bubble.setImmovable(true);
                    bubble.setVelocityX(platform.body.velocity.x);
                    bubble.anims.play('rotate');
                    bubble.setDepth(2);
                    this.bubbleGroup.add(bubble);
                }
            }
        }

        // is there a virus over the platform?
        if (Phaser.Math.Between(1, 100) <= gameOptions.virusPercent) {
            if (this.virusPool.getLength()) {
                const virus = this.virusPool.getFirst();
                virus.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                virus.y = posY - 46;
                virus.alpha = 1;
                virus.active = true;
                virus.visible = true;
                this.virusPool.remove(virus);
            } else {
                const virus = this.physics.add.sprite(
                    posX - platformWidth / 2 +
                    Phaser.Math.Between(1, platformWidth), posY - 46, 'virus',
                );
                virus.setImmovable(true);
                virus.setVelocityX(platform.body.velocity.x);
                virus.setSize(8, 2, true);
                virus.anims.play('burn');
                virus.setDepth(2);
                this.virusGroup.add(virus);
            }
        }
    }

    // the player jumps when on the ground, or once in the air as long as there are
    // jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump() {
        if ((!this.dying) &&
            (
                this.player.body.touching.down ||
                (this.playerJumps > 0 &&
                    this.playerJumps < gameOptions.jumps))) {
            if (this.player.body.touching.down) {
                if (GameLogic.currentLives() !== 0) {
                    this.jumpSound = this.sound.add('jumpSound', { volume: 0.8, loop: false });
                    this.jumpSound.play();
                }
                this.playerJumps = 0;
                this.scoreUp();
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps += 1;

            // stops animation
            this.player.anims.stop();
        }
    }

    // adding buildings
    addbuildings() {
        const rightmostbuilding = this.getRightmostbuilding();
        if (rightmostbuilding < config.width * 2) {
            const building = this.physics.add.sprite(rightmostbuilding + Phaser.Math.Between(100, 350), config.height + Phaser.Math.Between(0, 100), 'building');
            building.setOrigin(0.5, 1);
            building.body.setVelocityX(gameOptions.buildingSpeed * -1);
            this.buildingGroup.add(building);
            if (Phaser.Math.Between(0, 1)) {
                building.setDepth(1);
            }
            building.setFrame(Phaser.Math.Between(0, 3));
            this.addbuildings();
        }
    }

    // getting rightmost building x position
    getRightmostbuilding() {
        let rightmostbuilding = -200;
        this.buildingGroup.getChildren().forEach((building) => {
            rightmostbuilding = Math.max(rightmostbuilding, building.x);
        });
        return rightmostbuilding;
    }

    addScoreDisplay() {
        switch (GameLogic.currentLives()) {
            case (1):
                this.heart1 = this.add.image(40, 40, 'heart1');
                break;
            case 2:
                this.heart1 = this.add.image(40, 40, 'heart1');
                this.heart2 = this.add.image(80, 40, 'heart2');
                break;
            case 3:
                this.heart1 = this.add.image(40, 40, 'heart1');
                this.heart2 = this.add.image(80, 40, 'heart2');
                this.heart3 = this.add.image(120, 40, 'heart3');
                break;
            default:
                break;
        }
        this.scoreText = this.add.text(config.width - 200, 40, `Score: ${GameLogic.currentScore()}`, {
            fontSize: 20,
            fill: '#fff',
        });
    }

    scoreUp(points) {
        GameLogic.scoreUp(points);
        this.updateScore();
    }

    updateScore() {
        this.scoreText.setText(`Score: ${GameLogic.currentScore()}`);
    }

    lifeOver() {
        GameLogic.liveDown();
        this.downerSound = this.sound.add('downerSound', { volume: 0.5, loop: false });
        this.downerSound.play();
        switch (GameLogic.currentLives()) {
            case (2):
                this.heart3.visible = false;
                break;
            case (1):
                this.heart2.visible = false;
                break;
            default:
                this.heart1.visible = false;
                break;
        }
    }

    saveScore(callback) {
        api.saveScore(this.model.playerName === '' ? 'Anonymous' : this.model.playerName, GameLogic.currentScore()).then(() => {
            callback();
        });
    }

    preload() {
        this.addScoreDisplay();
        this.keys.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.model = this.sys.game.globals.model;
    }

    create() {
        // group with all active buildings.
        this.buildingGroup = this.add.group();

        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback(platform) {
                platform.scene.platformPool.add(platform);
            },
        });

        // pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback(platform) {
                platform.scene.platformGroup.add(platform);
            },
        });

        // group with all active bubbles.
        this.bubbleGroup = this.add.group({
            // once a bubble is removed, it's added to the pool
            removeCallback(bubble) {
                bubble.scene.bubblePool.add(bubble);
            },
        });

        // bubble pool
        this.bubblePool = this.add.group({
            // once a bubble is removed from the pool, it's added to the active bubbles group
            removeCallback(bubble) {
                bubble.scene.bubbleGroup.add(bubble);
            },
        });

        // group with all active viruscamps.
        this.virusGroup = this.add.group({

            // once a viruscamp is removed, it's added to the pool
            removeCallback(virus) {
                virus.scene.virusPool.add(virus);
            },
        });

        // virus pool
        this.virusPool = this.add.group({

            // once a virus is removed from the pool, it's added to the active virus group
            removeCallback(virus) {
                virus.scene.virusGroup.add(virus);
            },
        });

        // adding a building
        this.addbuildings();

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // number of consecutive jumps made by the player
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(
            config.width, config.width / 2,
            config.height * gameOptions.platformVerticalLimit[1],
        );

        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, config.height * 0.7, 'player');
        this.player.setGravityY(gameOptions.playerGravity);
        this.player.setDepth(2);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup, function() {
            // play "run" animation if the player is on a platform
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('run');
            }
        }, null, this);

        // setting collisions between the player and the bubble group
        this.physics.add.overlap(this.player, this.bubbleGroup, function(player, bubble) {
            this.riserSound = this.sound.add('riserSound', { volume: 0.5, loop: false });
            this.riserSound.play();
            this.scoreUp(50);
            this.tweens.add({
                targets: bubble,
                y: bubble.y - 100,
                alpha: 0,
                duration: 800,
                ease: 'Cubic.easeOut',
                callbackScope: this,
                onComplete() {
                    this.bubbleGroup.killAndHide(bubble);
                    this.bubbleGroup.remove(bubble);
                },
            });
        }, null, this);

        // setting collisions between the player and the virus group
        this.physics.add.overlap(this.player, this.virusGroup, function() {
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

        // allow click for mobile users
        this.input.on('pointerdown', this.jump, this);
    }

    update() {
        // jumping listener
        if (Phaser.Input.Keyboard.JustDown(this.keys.keyEnter)) {
            this.jump();
        }

        // game over
        if (this.player.y > config.height) {
            this.lifeOver();
            if (GameLogic.currentLives() === 0) {
                this.scene.pause();
                game = this;
                game.sys.game.globals.bgMusicGame.stop();
                this.bgGameOverMusic = this.sound.add('bgGameOverMusic', { volume: 0.5, loop: false });
                this.bgGameOverMusic.play();
                this.timedEvent = this.time.delayedCall(2000, this.saveScore(() => {
                    game.model.score = GameLogic.currentScore();
                    game.scene.start('GameOver');
                    game.sys.game.globals.bgMusic.play();
                    game.model.bgMusicPlaying = true;
                    GameLogic.newGame();
                }), [], this);
            } else {
                this.scene.start('Game');
            }
        }
        this.player.x = gameOptions.playerStartPosition;

        // recycling platforms
        let minDistance = config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform) {
            const platformDistance = config.width - platform.x - platform.displayWidth / 2;
            if (platformDistance < minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if (platform.x < -platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling bubbles
        this.bubbleGroup.getChildren().forEach(function(bubble) {
            if (bubble.x < -bubble.displayWidth / 2) {
                this.bubbleGroup.killAndHide(bubble);
                this.bubbleGroup.remove(bubble);
            }
        }, this);

        // recycling virus
        this.virusGroup.getChildren().forEach(function(virus) {
            if (virus.x < -virus.displayWidth / 2) {
                this.virusGroup.killAndHide(virus);
                this.virusGroup.remove(virus);
            }
        }, this);

        // recycling buildings
        this.buildingGroup.getChildren().forEach(function(building) {
            if (building.x < -building.displayWidth) {
                const rightmostbuilding = this.getRightmostbuilding();
                building.x = rightmostbuilding + Phaser.Math.Between(100, 350);
                building.y = config.height + Phaser.Math.Between(0, 100);
                building.setFrame(Phaser.Math.Between(0, 3));
                if (Phaser.Math.Between(0, 1)) {
                    building.setDepth(1);
                }
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            const nextPlatformWidth = Phaser.Math.Between(
                gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1],
            );
            const platformRandomHeight = gameOptions.platformHeighScale *
                Phaser.Math.Between(
                    gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1],
                );
            const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            const minPlatformHeight = config.height * gameOptions.platformVerticalLimit[0];
            const maxPlatformHeight = config.height * gameOptions.platformVerticalLimit[1];
            const nextPlatformHeight = Phaser.Math.Clamp(
                nextPlatformGap, minPlatformHeight, maxPlatformHeight,
            );
            this.addPlatform(nextPlatformWidth, config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }
}

function resize() {
    const canvas = document.querySelector('canvas');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = `${windowWidth}px`;
        canvas.style.height = `${windowWidth / gameRatio}px`;
    } else {
        canvas.style.width = `${windowHeight * gameRatio}px`;
        canvas.style.height = `${windowHeight}px`;
    }
}

window.onload = () => {
    window.focus();
    resize();
    window.addEventListener('resize', resize, false);
};