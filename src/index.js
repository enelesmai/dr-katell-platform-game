import 'phaser';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import Model from './Model';
import HelpScene from './Scenes/HelpScene';
import GameOverScene from './Scenes/GameOverScene';
import ScoreScene from './Scenes/ScoreScene';
import InstructionsScene from './Scenes/InstructionsScene';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        const model = new Model();
        this.globals = { model, bgMusic: null, bgMusicGame: null };
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('Title', TitleScene);
        this.scene.add('Options', OptionsScene);
        this.scene.add('Credits', CreditsScene);
        this.scene.add('Help', HelpScene);
        this.scene.add('Score', ScoreScene);
        this.scene.add('GameOver', GameOverScene);
        this.scene.add('Instructions', InstructionsScene);
        this.scene.add('Game', GameScene);
        this.scene.start('Boot');
    }
}

window.game = new Game();