let _interval = null;
let _gamepadObjects = null;

/**
 * Stores the object with references for every gamepad button that may be
 * activated/moved.
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
function setupUI(objects) {
    _gamepadObjects = objects;
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
        _interval = setInterval(pollGamepad, 250);
    }
}

/** Remove the callback for updating the buttons */
function disableGamepad() {
    clearInterval(_interval);
    _interval = null;
}

window.addEventListener("gamepadconnected", function(e) {
    if (getGamepadList().length() > 0) {
        // No 'onpress' event, gotta pool...
        enableGamepad();
    }
});

window.addEventListener("gamepaddisconnected", function(e) {
    if (getGamepadList().length() <= 0) {
        disableGamepad();
    }
});

function pollGamepad() {
}
