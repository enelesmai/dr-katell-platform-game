import 'phaser';
import Button from '../Objects/Button';
import api from '../Services/api';

export default class ScoreScene extends Phaser.Scene {
    constructor() {
        super('Score');
    }

    create() {
        this.menuButton = new Button(this, 400, 550, 'blueButton1', 'blueButton2', 'Menu', 'Title');
        this.text = this.add.text(290, 20, 'Top Scorers', { fontSize: 40, fill: '#fff' });
        let position = 100;
        api.getScore().then((scores) => {
            let i = 1;
            scores.forEach((element) => {
                this.text = this.add.text(260, position, i + '. ' + element.user, { fontSize: 25, fill: '#fff' });
                this.text = this.add.text(480, position, element.score + ' pts', { fontSize: 25, fill: '#fff' });
                position += 40;
                i += 1;
                setTimeout('', 1000);
            });
        });
    }
}