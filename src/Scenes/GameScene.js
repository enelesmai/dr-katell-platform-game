import 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {}

    create() {
        this.add.image(400, 300, 'logo');
        this.scene.start('Boot');
    }
};