import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class HelpScene extends Phaser.Scene {
    constructor() {
        super('Help');
    }

    create() {
        this.text = this.add.text(config.width / 2 - 120, 40, 'How to play', { fontSize: 40, fill: '#fff' });
        this.text = this.add.text(config.width / 2 - 190, 120, 'Press enter key to jump!', { fontSize: 30, fill: '#fff' });

        this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');
    }
}