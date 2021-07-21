export default class InputManager {
    engine;
    states;
    _cursorPosition;
    _mouseWheel;
    _lastPressedKey;
    _lastPressedMouseButton;
    constructor(engineRef) {
        this.engine = engineRef;
        this.states = new Map();
        this._cursorPosition = { x: 0, y: 0 };
        this._mouseWheel = { x: 0, y: 0, z: 0, frame: 0 };
        this._lastPressedKey = null;
        this._lastPressedMouseButton = null;
        //Register eventHandlers
        window.addEventListener('keydown', this.keyboardEvent.bind(this));
        window.addEventListener('keyup', this.keyboardEvent.bind(this));
        window.addEventListener('mousedown', this.mouseEvent.bind(this));
        window.addEventListener('mouseup', this.mouseEvent.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('wheel', this.onMouseWheel.bind(this));
        window.addEventListener('blur', this.onFocusLost.bind(this));
    }
    getState(code) {
        if (this.states.has(code)) {
            return this.states.get(code);
        }
        else
            return {
                state: false,
                frame: 0,
            };
    }
    //Event Handlers
    keyboardEvent(event) {
        const { code, type, repeat } = event;
        if (repeat)
            return; //Ignore input while holding key
        const state = type === 'keydown';
        const frame = this.engine.currentFrame;
        this.states.set(code, { frame, state });
        if (state)
            this._lastPressedKey = code;
    }
    mouseEvent(event) {
        const { button, type } = event;
        const state = type === 'mousedown';
        const frame = this.engine.currentFrame;
        this.states.set(button, { frame, state });
        if (state)
            this._lastPressedMouseButton = button;
    }
    onMouseMove(event) {
        const { clientX: x, clientY: y } = event;
        this._cursorPosition = { x, y };
    }
    onMouseWheel(event) {
        const { deltaX: x, deltaY: y, deltaZ: z } = event;
        const frame = this.engine.currentFrame;
        this._mouseWheel = { x, y, z, frame };
    }
    onFocusLost(event) {
        //unPress all inputs
        const frame = this.engine.currentFrame;
        const state = false;
        for (const [key, value] of this.states) {
            this.states.set(key, { state, frame });
        }
    }
    //Public Methods
    /** Returns true while the user holds down the {@link Key} / {@link Button}. */
    get(code) {
        return this.getState(code).state;
    }
    /** Returns true during the frame the user releases the {@link Key} / {@link Button}. */
    getUp(code) {
        const { state, frame } = this.getState(code);
        return frame === this.engine.currentFrame - 1 && state === false;
    }
    /** Returns true during the frame the user starts pressing down the {@link Key} / {@link Button}. */
    getDown(code) {
        const { state, frame } = this.getState(code);
        return frame === this.engine.currentFrame - 1 && state === true;
    }
    /** Is any {@link Key} (Keyboard) currently held down? */
    get anyKey() {
        for (const [key, value] of this.states) {
            if (typeof key === 'number')
                continue;
            if (value.state)
                return true;
        }
        return false;
    }
    /** Was any {@link Key} (Keyboard) pressed since last frame? */
    get anyKeyDown() {
        for (const [key, { frame, state }] of this.states) {
            if (typeof key === 'number')
                continue;
            if (frame == this.engine.currentFrame - 1 && state === true)
                return true;
        }
        return false;
    }
    /** Was any {@link Key} (Keyboard) released since last frame? */
    get anyKeyUp() {
        for (const [key, { frame, state }] of this.states) {
            if (typeof key === 'number')
                continue;
            if (frame == this.engine.currentFrame - 1 && state === false)
                return true;
        }
        return false;
    }
    /** Is any {@link Button} (Mouse) currently held down? */
    get anyMouseButton() {
        for (const [key, value] of this.states) {
            if (typeof key === 'string')
                continue;
            if (value.state)
                return true;
        }
        return false;
    }
    /** Was any {@link Button} (Mouse) pressed since last frame? */
    get anyMouseButtonDown() {
        for (const [key, { frame, state }] of this.states) {
            if (typeof key === 'string')
                continue;
            if (frame == this.engine.currentFrame - 1 && state === true)
                return true;
        }
        return false;
    }
    /** Was any {@link Button} (Mouse) released since last frame? */
    get anyMouseButtonUp() {
        for (const [key, { frame, state }] of this.states) {
            if (typeof key === 'string')
                continue;
            if (frame == this.engine.currentFrame - 1 && state === false)
                return true;
        }
        return false;
    }
    /** What was the least recently pressed {@link Key} (Keyboard)? */
    get lastPressedKey() {
        return this._lastPressedKey;
    }
    /** What was the least recently pressed {@link Button} (Mouse)? */
    get lastPressedMouseButton() {
        return this._lastPressedMouseButton;
    }
    /** Array of currently pressed {@link Key}s */
    get currentlyPressedKeys() {
        const keys = [];
        for (const [key, value] of this.states) {
            if (typeof key === 'number')
                continue;
            if (value.state)
                keys.push(key);
        }
        return keys;
    }
    /** Array of currently pressed {@link Button}s */
    get currentlyPressedButtons() {
        const buttons = [];
        for (const [key, value] of this.states) {
            if (typeof key === 'string')
                continue;
            if (value.state)
                buttons.push(key);
        }
        return buttons;
    }
    /** Current cursor position relative to page */
    get cursorPosition() {
        return this._cursorPosition;
    }
    /** User scroll values during this frame */
    get scroll() {
        return this._mouseWheel;
    }
}
export var Key;
(function (Key) {
    //Arrows
    Key["ArrowUp"] = "ArrowUp";
    Key["ArrowLeft"] = "ArrowLeft";
    Key["ArrowDown"] = "ArrowDown";
    Key["ArrowRight"] = "ArrowRight";
    //Functional
    Key["F1"] = "F1";
    Key["F2"] = "F2";
    Key["F3"] = "F3";
    Key["F4"] = "F4";
    Key["F5"] = "F5";
    Key["F6"] = "F6";
    Key["F7"] = "F7";
    Key["F8"] = "F8";
    Key["F9"] = "F9";
    Key["F10"] = "F10";
    Key["F11"] = "F11";
    Key["F12"] = "F12";
    //Operational
    Key["End"] = "End";
    Key["Home"] = "Home";
    Key["Pause"] = "Pause";
    Key["Insert"] = "Insert";
    Key["PageUp"] = "PageUp";
    Key["Delete"] = "Delete";
    Key["PageDown"] = "PageDown";
    Key["ScrollLock"] = "ScrollLock";
    Key["PrintScreen"] = "PrintScreen";
    //Special
    Key["Tab"] = "Tab";
    Key["Slash"] = "Slash";
    Key["Quote"] = "Quote";
    Key["Comma"] = "Comma";
    Key["Space"] = "Space";
    Key["Enter"] = "Enter";
    Key["Escape"] = "Escape";
    Key["Period"] = "Period";
    Key["AltLeft"] = "AltLeft";
    Key["CapsLock"] = "CapsLock";
    Key["AltRight"] = "AltRight";
    Key["Backspace"] = "Backspace";
    Key["Semicolon"] = "Semicolon";
    Key["ShiftLeft"] = "ShiftLeft";
    Key["Backslash"] = "Backslash";
    Key["Backquote"] = "Backquote";
    Key["ShiftRight"] = "ShiftRight";
    Key["BracketLeft"] = "BracketLeft";
    Key["ControlLeft"] = "ControlLeft";
    Key["BracketRight"] = "BracketRight";
    Key["ControlRight"] = "ControlRight";
    //Letters
    Key["A"] = "KeyA";
    Key["B"] = "KeyB";
    Key["C"] = "KeyC";
    Key["D"] = "KeyD";
    Key["E"] = "KeyE";
    Key["F"] = "KeyF";
    Key["G"] = "KeyG";
    Key["H"] = "KeyH";
    Key["I"] = "KeyI";
    Key["J"] = "KeyJ";
    Key["K"] = "KeyK";
    Key["L"] = "KeyL";
    Key["M"] = "KeyM";
    Key["N"] = "KeyN";
    Key["O"] = "KeyO";
    Key["P"] = "KeyP";
    Key["Q"] = "KeyQ";
    Key["R"] = "KeyR";
    Key["S"] = "KeyS";
    Key["T"] = "KeyT";
    Key["U"] = "KeyU";
    Key["V"] = "KeyV";
    Key["W"] = "KeyW";
    Key["X"] = "KeyX";
    Key["Y"] = "KeyY";
    Key["Z"] = "KeyZ";
    //Numerals
    Key["Minus"] = "Minus";
    Key["Equal"] = "Equal";
    Key["Digit1"] = "Digit1";
    Key["Digit2"] = "Digit2";
    Key["Digit3"] = "Digit3";
    Key["Digit4"] = "Digit4";
    Key["Digit5"] = "Digit5";
    Key["Digit6"] = "Digit6";
    Key["Digit7"] = "Digit7";
    Key["Digit8"] = "Digit8";
    Key["Digit9"] = "Digit9";
    Key["Digit0"] = "Digit0";
    //Numpad
    Key["NumLock"] = "NumLock";
    Key["Numpad0"] = "Numpad0";
    Key["Numpad1"] = "Numpad1";
    Key["Numpad2"] = "Numpad2";
    Key["Numpad3"] = "Numpad3";
    Key["Numpad4"] = "Numpad4";
    Key["Numpad5"] = "Numpad5";
    Key["Numpad6"] = "Numpad6";
    Key["Numpad7"] = "Numpad7";
    Key["Numpad8"] = "Numpad8";
    Key["Numpad9"] = "Numpad9";
    Key["NumpadAdd"] = "NumpadAdd";
    Key["NumpadEnter"] = "NumpadEnter";
    Key["NumpadDivide"] = "NumpadDivide";
    Key["NumpadDecimal"] = "NumpadDecimal";
    Key["NumpadSubtract"] = "NumpadSubtract";
    Key["NumpadMultiply"] = "NumpadMultiply";
})(Key || (Key = {}));
export var Button;
(function (Button) {
    Button[Button["Left"] = 0] = "Left";
    Button[Button["Middle"] = 1] = "Middle";
    Button[Button["Right"] = 2] = "Right";
    Button[Button["Back"] = 3] = "Back";
    Button[Button["Forward"] = 4] = "Forward";
})(Button || (Button = {}));
//# sourceMappingURL=InputManager.js.map