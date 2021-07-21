import { GAME_HEIGHT, GAME_WIDTH } from '../constants.js'
import BaseEngine from './Engine/BaseEngine.js'
import GameManager from './GameManager.js'

export default class PongEngine extends BaseEngine {
	public readonly gameManager: GameManager

	private _gameScale!: number

	public debugMode: boolean = false

	constructor() {
		super()
		this.gameManager = new GameManager(this)

		this._startEngine()
	}

	protected override update() {
		this.gameManager.update(this.deltaTime)
	}

	protected override draw() {
		this.gameManager.draw()
	}

	protected override onResize(): void {
		const { innerWidth: width, innerHeight: height } = window

		const gameCanvas = document.querySelector('canvas')!

		let WIDTH = GAME_WIDTH
		let HEIGHT = GAME_HEIGHT

		while (WIDTH + GAME_WIDTH < width && HEIGHT + GAME_HEIGHT < height) {
			WIDTH += GAME_WIDTH
			HEIGHT += GAME_HEIGHT
		}

		this._gameScale = HEIGHT / GAME_HEIGHT

		gameCanvas.width = WIDTH
		gameCanvas.height = HEIGHT
	}

	public get gameScale() {
		return this._gameScale
	}
}
