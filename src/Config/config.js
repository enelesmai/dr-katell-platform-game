import 'phaser';

export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x444444,
    // physics settings
    physics: {
        default: "arcade"
    }
};