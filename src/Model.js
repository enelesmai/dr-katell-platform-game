export default class Model {
    constructor() {
        this._soundOn = true;
        this._musicOn = true;
        this._bgMusicPlaying = false;
        this._score = 0;
        this._playerName = 'Anonymus';
    }

    set musicOn(value) {
        this._musicOn = value;
    }

    get musicOn() {
        return this._musicOn;
    }

    set soundOn(value) {
        this._soundOn = value;
    }

    get soundOn() {
        return this._soundOn;
    }

    set bgMusicPlaying(value) {
        this._bgMusicPlaying = value;
    }

    get bgMusicPlaying() {
        return this._bgMusicPlaying;
    }

    set score(value) {
        this._score = value;
    }

    get score() {
        return this._score;
    }

    set playerName(value) {
        this._playerName = value;
    }

    get playerName() {
        return this._playerName;
    }
}