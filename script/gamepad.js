let _interval = null;
let _gamepadObjects = null;
let _fps = 30;
let _callbacks = {};

/**
 * Makes all the required setup, considering the divs/images have the default
 * names.
 */
function setupDefaultGamepad() {
    let gamepad = {};
    gamepad.l2 = document.getElementById('gamepad_l2');
    gamepad.l1 = document.getElementById('gamepad_l1');
    gamepad.r2 = document.getElementById('gamepad_r2');
    gamepad.r1 = document.getElementById('gamepad_r1');
    gamepad.home = document.getElementById('gamepad_home');
    gamepad.select = document.getElementById('gamepad_select');
    gamepad.start = document.getElementById('gamepad_start');
    gamepad.x = document.getElementById('gamepad_x');
    gamepad.y = document.getElementById('gamepad_y');
    gamepad.a = document.getElementById('gamepad_a');
    gamepad.b = document.getElementById('gamepad_b');
    gamepad.up = document.getElementById('gamepad_up');
    gamepad.down = document.getElementById('gamepad_down');
    gamepad.left = document.getElementById('gamepad_left');
    gamepad.right = document.getElementById('gamepad_right');
    gamepad.lstick = {};
    gamepad.lstick.img = document.getElementById('gamepad_lstick');
    gamepad.lstick.hw = 25;
    gamepad.lstick.hh = 25;
    gamepad.lstick.cx = gamepad.lstick.img.offsetLeft + gamepad.lstick.img.width / 2;
    gamepad.lstick.cy = gamepad.lstick.img.offsetTop + gamepad.lstick.img.height / 2;
    gamepad.rstick = {};
    gamepad.rstick.img = document.getElementById('gamepad_rstick');
    gamepad.rstick.hw = 17;
    gamepad.rstick.hh = 17;
    gamepad.rstick.cx = gamepad.rstick.img.offsetLeft + gamepad.rstick.img.width / 2;
    gamepad.rstick.cy = gamepad.rstick.img.offsetTop + gamepad.rstick.img.height / 2;
    setupGamepad(gamepad);
}

/**
 * Stores the object with references for every gamepad button that may be
 * activated/moved.
 *
 * To simplify updating it, every button is normalized into an object that
 * has tha actual DOM and a bool stating whether it's visible or not.
 *
 * Also, another attribute 'button' is added to every button, mapping the
 * button to the index within the default mapping (see
 * https://w3c.github.io/gamepad/#remapping).
 *
 * The following attributes/sub-objects shall be accessed:
 *   - l2: The left trigger (farther shoulder button)
 *   - l1: The left shoulder button (closer shoulder button)
 *   - r2: The right trigger (farther shoulder button)
 *   - r1: The right shoulder button (closer shoulder button)
 *   - home: Home-menu button
 *   - select: Select button (the one to the left)
 *   - start: Pause button (the one to the right)
 *   - x: Left-most face button
 *   - y: Top face button
 *   - a: Bottom face button
 *   - b: Right-most face button
 *   - up: D-pad up
 *   - down: D-pad down
 *   - left: D-pad left
 *   - right: D-pad right
 *   - lstick
 *       - img: Image for the left analog stick
 *       - cx: Centered horizontal position
 *       - cy: Centered vertical position
 *       - hw: Half width of the stick area
 *       - hh: Half height of the stick area
 *   - rstick
 *       - img: Image for the right analog stick
 *       - cx: Centered horizontal position
 *       - cy: Centered vertical position
 *       - hw: Half width of the stick area
 *       - hh: Half height of the stick area
 */
function setupGamepad(objects) {
    _gamepadObjects = objects;

    for (var button in _gamepadObjects) {
        if (button == 'lstick' || button == 'rstick') {
            continue
        }

        val = _gamepadObjects[button]
        _gamepadObjects[button] = {}
        _gamepadObjects[button].img = val;
        _gamepadObjects[button].visible = false;
    }

    _gamepadObjects.b.button = 1;
    _gamepadObjects.a.button = 0;
    _gamepadObjects.x.button = 2;
    _gamepadObjects.y.button = 3;
    _gamepadObjects.l1.button = 4;
    _gamepadObjects.r1.button = 5;
    _gamepadObjects.l2.button = 6;
    _gamepadObjects.r2.button = 7;
    _gamepadObjects.select.button = 8;
    _gamepadObjects.start.button = 9;
    _gamepadObjects.up.button = 12;
    _gamepadObjects.down.button = 13;
    _gamepadObjects.left.button = 14;
    _gamepadObjects.right.button = 15;
    _gamepadObjects.home.button = 16;
}

/** Reset the gamepad back to neutral (fully released) position */
function resetGamepad() {
    for (let button in _gamepadObjects) {
        if (button == 'lstick' || button == 'rstick') {
            stick = _gamepadObjects[button].img

            stick.img.style.left = (stick.cx - axis.img.width / 2) + 'px';
            stick.img.style.top = (stick.cy - axis.img.height / 2) + 'px';
        }
        else {
            _gamepadObjects[button].visible = false;
            _gamepadObjects[button].img.style.visibility = 'hidden';
        }
    }
}

/**
 * Retrieve the current list of connected gamepads.
 *
 * From: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 */
function getGamepadList() {
    return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
}

/** Set a callback for updating the buttons */
function enableGamepad() {
    if (_interval === null && getGamepadCount(getGamepadList()) > 0) {
        _interval = setInterval(pollGamepad, 1000 / _fps);
    }
}

/** Remove the callback for updating the buttons */
function disableGamepad(force = false) {
    if (force || getGamepadCount(getGamepadList()) <= 0 && _interval !== null) {
        clearInterval(_interval);
        _interval = null;
    }
}

/**
 * Retrieve the actual number of connected gamepads, given a list retrieved from
 * 'getGamepadList()'.
 */
function getGamepadCount(gpList) {
    let i = 0;
    let count = 0;

    while (i < gpList.length) {
        if (gpList[i] != null) {
            count++;
        }
        i++;
    }

    return count;
}

/** Enables the gamepad if at least one is active */
window.addEventListener("gamepadconnected", function(e) {
    /* No 'onpress' event, gotta pool... */
    enableGamepad();
});

/** Disables the gamepad if none is active */
window.addEventListener("gamepaddisconnected", function(e) {
    disableGamepad();
});

/** Check whether 'b' is pressed */
function buttonPressed(b) {
    if (typeof(b) == "object") {
        return b.pressed;
    }
    return b == 1.0;
}

/** Update the gamepad's objects */
function pollGamepad() {
    let _gps = getGamepadList();

    /* Shouldn't happen... */
    if (_gps.length <= 0) {
        return;
    }
    let _gp = _gps[0];

    /* Iterate through every button and update it */
    for (let buttonName in _gamepadObjects) {
        if (buttonName == 'lstick' || buttonName == 'rstick') {
            let axis = _gamepadObjects[buttonName];
            let x = 0;
            let y = 0;

            if (buttonName == 'lstick' && _gp.axes.length >= 2) {
                x = _gp.axes[0];
                y = _gp.axes[1];
            } else if (buttonName == 'rstick' && _gp.axes.length >= 4) {
                x = _gp.axes[2];
                y = _gp.axes[3];
            }

            axis.img.style.left = (axis.cx - axis.img.width / 2 + axis.hw * x) + 'px';
            axis.img.style.top = (axis.cy - axis.img.height / 2 + axis.hh * y) + 'px';
        }
        else {
            let button = _gamepadObjects[buttonName];
            let i = button.button;

            if (i >= _gp.buttons.length) {
                continue;
            }

            let state = buttonPressed(_gp.buttons[i]);
            if (state != button.visible) {
                button.visible = state;
                if (state) {
                    button.img.style.visibility = 'visible';
                }
                else {
                    button.img.style.visibility = 'hidden';
                }
            }

            let cb = _callbacks[buttonName];
            if (cb) {
                cb[0](state, cb[1])
            }
        }
    }
}

/**
 * Configure a callback when a give button just got pressed. The callback must
 * receive the button state and may optionally receive a user defined argument.
 *
 * NOTE: Each button can only have a single callback. Calling this more than
 * once for the same button overwrites the previous callback.
 *
 * @param{buttonName} Name of the button that shall trigger the callback
 * @param{func} Function to be called for the callback
 * @param{args} Arguments to be passed to the function
 */
function setGamepadCallback(buttonName, func, args) {
    _callbacks[buttonName] = [func, args]
}
