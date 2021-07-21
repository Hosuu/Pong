import InputManager from './InputManager.js';
export default class BaseEngine {
    //Engine Modules
    /** {@link InputManager} reference */
    input;
    //MainLoop Variables
    lastUpdateTimeStamp;
    lastRequestedFrameId;
    _isStarted = false;
    _isPaused = false;
    _frameCount = 0;
    _deltaTime = 0;
    _timeElapsed = 0;
    constructor() {
        //Initalize modules
        this.input = new InputManager(this);
        window.addEventListener('focus', () => this.resumeEngine());
        window.addEventListener('blur', () => this.pauseEngine());
        window.addEventListener('resize', () => this.onResize());
    }
    mainLoop(timeStamp) {
        const lastUpdate = this.lastUpdateTimeStamp || timeStamp;
        const dt = timeStamp - lastUpdate;
        this._frameCount += 1;
        this._deltaTime = dt;
        this._timeElapsed += dt;
        this.update();
        this.draw();
        this.lastUpdateTimeStamp = timeStamp;
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
    }
    /** Starts the engine */
    _startEngine() {
        if (this._isStarted)
            throw Error('Cannot start already running engine!');
        this.onResize();
        this._timeElapsed = 0;
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
    }
    /** Pauses the engine */
    pauseEngine() {
        if (!this._isStarted)
            return;
        this._isPaused = true;
        window.cancelAnimationFrame(this.lastRequestedFrameId);
    }
    /** Resumes the engine */
    resumeEngine() {
        if (!this._isStarted)
            return;
        this._isPaused = false;
        this.lastUpdateTimeStamp = performance.now();
        window.cancelAnimationFrame(this.lastRequestedFrameId);
        this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this));
    }
    /** Is engine currently paused? */
    get isPaused() {
        return this._isPaused;
    }
    /** Current Frame id */
    get currentFrame() {
        return this._frameCount;
    }
    /** Time (milliseconds) since enigne started */
    get timeElapsed() {
        return this._timeElapsed;
    }
    /** Time (milliseconds) since last update */
    get deltaTime() {
        return this._deltaTime;
    }
    /** Frames per second */
    get fps() {
        return 1000 / this._deltaTime;
    }
    update() {
        //UPDATE METHOD CODE
        throw Error('Update Method not impemented or overrided!');
    }
    draw() {
        //DRAW METHOD CODE
        throw Error('Draw Method not impemented or overrided!');
    }
    onResize() {
        //CODE EXECUTED WHEN WINDOW RESIZES
        throw Error('OnResize Method not impemented or overrided!');
    }
}
//# sourceMappingURL=BaseEngine.js.map