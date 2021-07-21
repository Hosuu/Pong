import { GAME_HEIGHT, GAME_WIDTH } from '../constants.js';
import BaseEngine from './Engine/BaseEngine.js';
import GameManager from './GameManager.js';
export default class PongEngine extends BaseEngine {
    gameManager;
    _gameScale;
    debugMode = false;
    constructor() {
        super();
        this.gameManager = new GameManager(this);
        this._startEngine();
    }
    update() {
        this.gameManager.update(this.deltaTime);
    }
    draw() {
        this.gameManager.draw();
    }
    onResize() {
        const { innerWidth: width, innerHeight: height } = window;
        const gameCanvas = document.querySelector('canvas');
        let WIDTH = GAME_WIDTH;
        let HEIGHT = GAME_HEIGHT;
        while (WIDTH + GAME_WIDTH < width && HEIGHT + GAME_HEIGHT < height) {
            WIDTH += GAME_WIDTH;
            HEIGHT += GAME_HEIGHT;
        }
        this._gameScale = HEIGHT / GAME_HEIGHT;
        gameCanvas.width = WIDTH;
        gameCanvas.height = HEIGHT;
    }
    get gameScale() {
        return this._gameScale;
    }
}
//# sourceMappingURL=PongEngine.js.map