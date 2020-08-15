import Phaser from 'phaser';
import blueButton1 from '../assets/ui/blue_button02.png';
import blueButton2 from '../assets/ui/blue_button03.png';
import box from '../assets/ui/grey_box.png';
import checkedBox from '../assets/ui/blue_boxCheckmark.png';
import bgMusicGame from '../assets/Just_a_dream.mp3';
import bgMusic from '../assets/slow_theme.ogg';
import bgGameOverMusic from '../assets/deathsound.ogg';
import jumpSound from '../assets/jump.wav';
import downerSound from '../assets/falling.mp3';
import riserSound from '../assets/raiser.wav';
import platform from '../assets/ui/roof.png';
import player from '../assets/ui/doctercat.png';
import coin from '../assets/ui/bubble01.png';
import mountain from '../assets/ui/bldgs.png';
import fire from '../assets/ui/virus01.png';
import heart from '../assets/ui/heart.png';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // add logo image
        this.add.image(400, 200, 'logo');

        // display progress bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // update progress bar
        this.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        // update file progress text
        this.load.on('fileprogress', function(file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        // remove progress bar when complete
        this.load.on('complete', function() {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            this.ready();
        }.bind(this));

        this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

        // load assets needed in our game
        this.load.image('blueButton1', blueButton1);
        this.load.image('blueButton2', blueButton2);
        this.load.image('box', box);
        this.load.image('checkedBox', checkedBox);
        this.load.audio('bgMusic', [bgMusic]);
        this.load.audio('bgMusicGame', [bgMusicGame]);
        this.load.audio('bgGameOverMusic', [bgGameOverMusic]);
        this.load.audio('jumpSound', [jumpSound]);
        this.load.audio('downerSound', [downerSound]);
        this.load.audio('riserSound', [riserSound]);
        this.load.image('heart1', heart);
        this.load.image('heart2', heart);
        this.load.image('heart3', heart);


        //preloading game assets
        this.load.image("platform", platform);
        // player is a sprite sheet made by 24x48 pixels
        this.load.spritesheet("player", player, {
            frameWidth: 24,
            frameHeight: 48
        });
        // the coin is a sprite sheet made by 20x20 pixels
        this.load.spritesheet("coin", coin, {
            frameWidth: 40,
            frameHeight: 40
        });
        // mountains are a sprite sheet made by 512x512 pixels
        this.load.spritesheet("mountain", mountain, {
            frameWidth: 512,
            frameHeight: 512
        });
        // the firecamp is a sprite sheet made by 32x58 pixels
        this.load.spritesheet("fire", fire, {
            frameWidth: 55,
            frameHeight: 55
        });
    }

    create() {
        // setting player animation
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        // setting coin animation
        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 5
            }),
            frameRate: 15,
            yoyo: true,
            repeat: -1
        });

        // setting fire animation
        this.anims.create({
            key: "burn",
            frames: this.anims.generateFrameNumbers("fire", {
                start: 0,
                end: 4
            }),
            frameRate: 15,
            repeat: -1
        });
    }

    init() {
        this.readyCount = 0;
    }

    ready() {
        this.readyCount++;
        if (this.readyCount === 2) {
            this.scene.start('Title');
        }
    }

    create() {}
};