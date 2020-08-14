import Phaser from 'phaser';
import Button from '../Objects/Button';

const validateKeys = (e) => {
    if (
        e.key !== 'Backspace' &&
        e.key !== 'Enter' &&
        e.key !== 'Shift' &&
        e.key !== 'Alt' &&
        e.key !== 'Tab' &&
        e.key !== 'Delete'
    ) {
        return true;
    }
    return false;
};

const isEnterKey = (e) => {
    if (
        e.key === 'Enter'
    ) {
        return true;
    }
    return false;
}


export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super('Instructions');
        this.playerName = '';
    }

    create() {
        this.model = this.sys.game.globals.model;
        this.levelLabel = this.add.text(50, 50, 'INSTRUCTIONS', this.model.fontStyleTitle);
        this.levelLabel = this.add.text(
            30, 120,
            '* Use the Enter key to avoid getting caught by viruses \n by jumping above them.',
            this.model.fontStyleLabel
        );
        this.levelLabel = this.add.text(
            30, 200,
            '* You\'ll lose one life out of 3 for each virus that catch you.',
            this.model.fontStyleLabel
        );

        this.nameLabel = this.add.text(300, 300, 'Enter your name:', this.model.fontStyleTitle);
        this.nameText = this.add.text(300, 330, ' ... ', this.model.fontStyleTitle);

        this.input.keyboard.on('keydown', (e) => {
            if (validateKeys(e)) {
                this.playerName += e.key;
                this.nameText.setText(this.playerName);
            } else if (e.key === 'Backspace' && this.playerName.length > 0) {
                this.playerName = this.playerName.slice(0, -1);
                this.nameText.setText(this.playerName);
            } else if (isEnterKey(e)) {
                this.saveName(this.playerName);
                this.scene.start('Game');
            }
        });
    }

    saveName(name) {
        this.model = this.sys.game.globals.model;
        if (name === '') {
            this.model.playerName = 'Anonymous';
        } else {
            this.model.playerName = name;
        }
    }
}