import InputManager from './InputManager.js'

export default class BaseEngine {
	//Engine Modules

	/** {@link InputManager} reference */
	public readonly input: InputManager

	//MainLoop Variables
	private lastUpdateTimeStamp!: number
	private lastRequestedFrameId!: number
	private _isStarted: boolean = false
	private _isPaused: boolean = false
	private _frameCount: number = 0
	private _deltaTime: number = 0
	private _timeElapsed: number = 0

	constructor() {
		//Initalize modules
		this.input = new InputManager(this)

		window.addEventListener('focus', () => this.resumeEngine())
		window.addEventListener('blur', () => this.pauseEngine())
		window.addEventListener('resize', () => this.onResize())
	}

	private mainLoop(timeStamp: number): void {
		const lastUpdate: number = this.lastUpdateTimeStamp || timeStamp

		const dt: number = timeStamp - lastUpdate
		this._frameCount += 1
		this._deltaTime = dt
		this._timeElapsed += dt
		this.update()
		this.draw()

		this.lastUpdateTimeStamp = timeStamp
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
	}

	/** Starts the engine */
	public _startEngine(): void {
		if (this._isStarted) throw Error('Cannot start already running engine!')

		this.onResize()
		this._timeElapsed = 0
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
	}

	/** Pauses the engine */
	public pauseEngine(): void {
		if (!this._isStarted) return

		this._isPaused = true
		window.cancelAnimationFrame(this.lastRequestedFrameId)
	}

	/** Resumes the engine */
	public resumeEngine(): void {
		if (!this._isStarted) return

		this._isPaused = false
		this.lastUpdateTimeStamp = performance.now()
		window.cancelAnimationFrame(this.lastRequestedFrameId)
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
	}

	/** Is engine currently paused? */
	public get isPaused(): boolean {
		return this._isPaused
	}

	/** Current Frame id */
	public get currentFrame(): number {
		return this._frameCount
	}

	/** Time (milliseconds) since enigne started */
	public get timeElapsed(): number {
		return this._timeElapsed
	}

	/** Time (milliseconds) since last update */
	public get deltaTime(): number {
		return this._deltaTime
	}

	/** Frames per second */
	public get fps(): number {
		return 1000 / this._deltaTime
	}

	protected update(): void {
		//UPDATE METHOD CODE
		throw Error('Update Method not impemented or overrided!')
	}

	protected draw(): void {
		//DRAW METHOD CODE
		throw Error('Draw Method not impemented or overrided!')
	}

	protected onResize(): void {
		//CODE EXECUTED WHEN WINDOW RESIZES
		throw Error('OnResize Method not impemented or overrided!')
	}
}
