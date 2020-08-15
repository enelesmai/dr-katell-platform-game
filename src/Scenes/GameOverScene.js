import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {

        this.model = this.sys.game.globals.model;
        this.text = this.add.text(275, 30, 'GAME OVER', { fontSize: 40, fill: '#fff' });
        this.text = this.add.text(260, 90, 'Total Score: ' + this.model.score, { fontSize: 40, fill: '#fff' });

        // Game
        this.gameButton = new Button(this, config.width / 2, config.height / 2 - 100, 'blueButton1', 'blueButton2', 'Play Again', 'Game');

        // Scores
        this.scoresButton = new Button(this, config.width / 2, config.height / 2, 'blueButton1', 'blueButton2', 'Top Ten', 'Score');

        // Menu
        this.menuButton = new Button(this, config.width / 2, config.height / 2 + 100, 'blueButton1', 'blueButton2', 'Menu', 'Title');

        //gameover music (?)
    }
}