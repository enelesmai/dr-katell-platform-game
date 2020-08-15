/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import Phaser from 'phaser';
import config from '../Config/config';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    create() {
        this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: '32px', fill: '#fff' });
        this.madeByText = this.add.text(0, 0, 'Created By: Selene Flores', { fontSize: '26px', fill: '#fff' });
        this.arrobaText = this.add.text(0, 0, '@enelesmai', { fontSize: '26px', fill: '#fff' });
        this.zone = this.add.zone(config.width / 2, config.height / 2, config.width, config.height);

        Phaser.Display.Align.In.Center(
            this.creditsText,
            this.zone,
        );

        Phaser.Display.Align.In.Center(
            this.madeByText,
            this.zone,
        );

        Phaser.Display.Align.In.Center(
            this.arrobaText,
            this.zone,
        );

        this.madeByText.setY(600);
        this.arrobaText.setY(1200);

        this.creditsTween = this.tweens.add({
            targets: this.creditsText,
            y: -100,
            ease: 'Power1',
            duration: 3000,
            delay: 1000,
            onComplete() {
                this.destroy;
            },
        });

        this.madeByTween = this.tweens.add({
            targets: this.madeByText,
            y: -300,
            ease: 'Power1',
            duration: 8000,
            delay: 1000,
            onComplete: function() {
                this.madeByTween.destroy;
            }.bind(this),
        });

        this.arrobaTween = this.tweens.add({
            targets: this.arrobaText,
            y: -300,
            ease: 'Power1',
            duration: 8000,
            delay: 1000,
            onComplete: function() {
                this.arrobaTween.destroy;
                this.scene.start('Title');
            }.bind(this),
        });
    }
}