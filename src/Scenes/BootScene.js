import 'phaser';
import splashScreen from '../assets/zenva_logo.png';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('logo', splashScreen);
    }

    create() {
        this.scene.start('Preloader');
    }
};