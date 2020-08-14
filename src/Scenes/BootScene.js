import 'phaser';
import splashScreen from '../assets/zenva_logo.png';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.add.image(400, 300, 'logo');
        this.load.image('logo', splashScreen);
    }

    create() {
        this.scene.start('Preloader');
    }
};