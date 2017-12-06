var interval = null;

/**
 * Retrieve the current list of connected gamepads.
 *
 * From: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 */
function getGamepadList() {
    return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
}

function enableGamepad() {
    interval = setInterval(pollGamepad, 250);
}

function disableGamepad() {
    clearInterval(interval);
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
