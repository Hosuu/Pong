import Engine from './BaseEngine.js'

export default class InputManager {
	private readonly engine: Engine
	private readonly states: Map<Key | Button, InputState>
	private _cursorPosition: ScreenPoint
	private _mouseWheel: MouseWheel
	private _lastPressedKey: Key | null
	private _lastPressedMouseButton: Button | null

	constructor(engineRef: Engine) {
		this.engine = engineRef
		this.states = new Map()
		this._cursorPosition = { x: 0, y: 0 }
		this._mouseWheel = { x: 0, y: 0, z: 0, frame: 0 }
		this._lastPressedKey = null
		this._lastPressedMouseButton = null

		//Register eventHandlers
		window.addEventListener('keydown', this.keyboardEvent.bind(this))
		window.addEventListener('keyup', this.keyboardEvent.bind(this))
		window.addEventListener('mousedown', this.mouseEvent.bind(this))
		window.addEventListener('mouseup', this.mouseEvent.bind(this))
		window.addEventListener('mousemove', this.onMouseMove.bind(this))
		window.addEventListener('wheel', this.onMouseWheel.bind(this))
		window.addEventListener('blur', this.onFocusLost.bind(this))
	}

	private getState(code: Key | Button): InputState {
		if (this.states.has(code)) {
			return this.states.get(code)!
		} else
			return {
				state: false,
				frame: 0,
			}
	}

	//Event Handlers
	private keyboardEvent(event: KeyboardEvent): void {
		const { code, type, repeat } = event

		if (repeat) return //Ignore input while holding key

		const state = type === 'keydown'
		const frame = this.engine.currentFrame
		this.states.set(code as Key, { frame, state })
		if (state) this._lastPressedKey = code as Key
	}

	private mouseEvent(event: MouseEvent): void {
		const { button, type } = event

		const state = type === 'mousedown'
		const frame = this.engine.currentFrame
		this.states.set(button as Button, { frame, state })
		if (state) this._lastPressedMouseButton = button as Button
	}

	private onMouseMove(event: MouseEvent): void {
		const { clientX: x, clientY: y } = event
		this._cursorPosition = { x, y }
	}

	private onMouseWheel(event: WheelEvent): void {
		const { deltaX: x, deltaY: y, deltaZ: z } = event
		const frame = this.engine.currentFrame
		this._mouseWheel = { x, y, z, frame }
	}

	private onFocusLost(event: FocusEvent): void {
		//unPress all inputs
		const frame = this.engine.currentFrame
		const state = false
		for (const [key, value] of this.states) {
			this.states.set(key, { state, frame })
		}
	}

	//Public Methods
	/** Returns true while the user holds down the {@link Key} / {@link Button}. */
	public get(code: Key | Button): boolean {
		return this.getState(code).state
	}

	/** Returns true during the frame the user releases the {@link Key} / {@link Button}. */
	public getUp(code: Key | Button): boolean {
		const { state, frame } = this.getState(code)
		return frame === this.engine.currentFrame - 1 && state === false
	}

	/** Returns true during the frame the user starts pressing down the {@link Key} / {@link Button}. */
	public getDown(code: Key | Button): boolean {
		const { state, frame } = this.getState(code)
		return frame === this.engine.currentFrame - 1 && state === true
	}

	/** Is any {@link Key} (Keyboard) currently held down? */
	public get anyKey(): boolean {
		for (const [key, value] of this.states) {
			if (typeof key === 'number') continue
			if (value.state) return true
		}
		return false
	}

	/** Was any {@link Key} (Keyboard) pressed since last frame? */
	public get anyKeyDown(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'number') continue
			if (frame == this.engine.currentFrame - 1 && state === true) return true
		}
		return false
	}

	/** Was any {@link Key} (Keyboard) released since last frame? */
	public get anyKeyUp(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'number') continue
			if (frame == this.engine.currentFrame - 1 && state === false) return true
		}
		return false
	}

	/** Is any {@link Button} (Mouse) currently held down? */
	public get anyMouseButton(): boolean {
		for (const [key, value] of this.states) {
			if (typeof key === 'string') continue
			if (value.state) return true
		}
		return false
	}

	/** Was any {@link Button} (Mouse) pressed since last frame? */
	public get anyMouseButtonDown(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'string') continue
			if (frame == this.engine.currentFrame - 1 && state === true) return true
		}
		return false
	}

	/** Was any {@link Button} (Mouse) released since last frame? */
	public get anyMouseButtonUp(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'string') continue
			if (frame == this.engine.currentFrame - 1 && state === false) return true
		}
		return false
	}

	/** What was the least recently pressed {@link Key} (Keyboard)? */
	public get lastPressedKey(): Key | null {
		return this._lastPressedKey
	}

	/** What was the least recently pressed {@link Button} (Mouse)? */
	public get lastPressedMouseButton(): Button | null {
		return this._lastPressedMouseButton
	}

	/** Array of currently pressed {@link Key}s */
	public get currentlyPressedKeys(): Key[] {
		const keys = []
		for (const [key, value] of this.states) {
			if (typeof key === 'number') continue
			if (value.state) keys.push(key)
		}
		return keys
	}

	/** Array of currently pressed {@link Button}s */
	public get currentlyPressedButtons(): Button[] {
		const buttons = []
		for (const [key, value] of this.states) {
			if (typeof key === 'string') continue
			if (value.state) buttons.push(key)
		}
		return buttons
	}

	/** Current cursor position relative to page */
	public get cursorPosition() {
		return this._cursorPosition
	}

	/** User scroll values during this frame */
	public get scroll() {
		return this._mouseWheel
	}
}

type ScreenPoint = { x: number; y: number }
type MouseWheel = { x: number; y: number; z: number; frame: number }

interface InputState {
	state: boolean
	frame: number
}

export enum Key {
	//Arrows
	ArrowUp = 'ArrowUp',
	ArrowLeft = 'ArrowLeft',
	ArrowDown = 'ArrowDown',
	ArrowRight = 'ArrowRight',

	//Functional
	F1 = 'F1',
	F2 = 'F2',
	F3 = 'F3',
	F4 = 'F4',
	F5 = 'F5',
	F6 = 'F6',
	F7 = 'F7',
	F8 = 'F8',
	F9 = 'F9',
	F10 = 'F10',
	F11 = 'F11',
	F12 = 'F12',

	//Operational
	End = 'End',
	Home = 'Home',
	Pause = 'Pause',
	Insert = 'Insert',
	PageUp = 'PageUp',
	Delete = 'Delete',
	PageDown = 'PageDown',
	ScrollLock = 'ScrollLock',
	PrintScreen = 'PrintScreen',

	//Special
	Tab = 'Tab',
	Slash = 'Slash',
	Quote = 'Quote',
	Comma = 'Comma',
	Space = 'Space',
	Enter = 'Enter',
	Escape = 'Escape',
	Period = 'Period',
	AltLeft = 'AltLeft',
	CapsLock = 'CapsLock',
	AltRight = 'AltRight',
	Backspace = 'Backspace',
	Semicolon = 'Semicolon',
	ShiftLeft = 'ShiftLeft',
	Backslash = 'Backslash',
	Backquote = 'Backquote',
	ShiftRight = 'ShiftRight',
	BracketLeft = 'BracketLeft',
	ControlLeft = 'ControlLeft',
	BracketRight = 'BracketRight',
	ControlRight = 'ControlRight',

	//Letters
	A = 'KeyA',
	B = 'KeyB',
	C = 'KeyC',
	D = 'KeyD',
	E = 'KeyE',
	F = 'KeyF',
	G = 'KeyG',
	H = 'KeyH',
	I = 'KeyI',
	J = 'KeyJ',
	K = 'KeyK',
	L = 'KeyL',
	M = 'KeyM',
	N = 'KeyN',
	O = 'KeyO',
	P = 'KeyP',
	Q = 'KeyQ',
	R = 'KeyR',
	S = 'KeyS',
	T = 'KeyT',
	U = 'KeyU',
	V = 'KeyV',
	W = 'KeyW',
	X = 'KeyX',
	Y = 'KeyY',
	Z = 'KeyZ',

	//Numerals
	Minus = 'Minus',
	Equal = 'Equal',
	Digit1 = 'Digit1',
	Digit2 = 'Digit2',
	Digit3 = 'Digit3',
	Digit4 = 'Digit4',
	Digit5 = 'Digit5',
	Digit6 = 'Digit6',
	Digit7 = 'Digit7',
	Digit8 = 'Digit8',
	Digit9 = 'Digit9',
	Digit0 = 'Digit0',

	//Numpad
	NumLock = 'NumLock',
	Numpad0 = 'Numpad0',
	Numpad1 = 'Numpad1',
	Numpad2 = 'Numpad2',
	Numpad3 = 'Numpad3',
	Numpad4 = 'Numpad4',
	Numpad5 = 'Numpad5',
	Numpad6 = 'Numpad6',
	Numpad7 = 'Numpad7',
	Numpad8 = 'Numpad8',
	Numpad9 = 'Numpad9',
	NumpadAdd = 'NumpadAdd',
	NumpadEnter = 'NumpadEnter',
	NumpadDivide = 'NumpadDivide',
	NumpadDecimal = 'NumpadDecimal',
	NumpadSubtract = 'NumpadSubtract',
	NumpadMultiply = 'NumpadMultiply',
}

export enum Button {
	Left = 0,
	Middle = 1,
	Right = 2,
	Back = 3,
	Forward = 4,
}
