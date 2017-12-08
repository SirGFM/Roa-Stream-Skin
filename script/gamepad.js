let _interval = null;
let _gamepadObjects = null;
let _fps = 30;

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

            stick.img.style.left = (stick.cx - stick.hw) + 'px';
            stick.img.style.top = (stick.cy - stick.hh) + 'px';
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
    if (_interval === null ) {
        _interval = setInterval(pollGamepad, 1000 / _fps);
    }
}

/** Remove the callback for updating the buttons */
function disableGamepad() {
    clearInterval(_interval);
    _interval = null;
}

/** Enables the gamepad if at least one is active */
window.addEventListener("gamepadconnected", function(e) {
    if (getGamepadList().length > 0) {
        /* No 'onpress' event, gotta pool... */
        enableGamepad();
    }
});

/** Disables the gamepad if none is active */
window.addEventListener("gamepaddisconnected", function(e) {
    if (getGamepadList().length <= 0) {
        disableGamepad();
    }
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
        }
        else {
            let button = _gamepadObjects[buttonName];
            let i = button.button;

            if (i < _gp.buttons.length &&
                    buttonPressed(_gp.buttons[i]) != button.visible) {
                button.visible = buttonPressed(_gp.buttons[i]);
                if (button.visible) {
                    button.img.style.visibility = 'visible';
                }
                else {
                    button.img.style.visibility = 'hidden';
                }
            }
        }
    }
}
