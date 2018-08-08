/**
 * Handles the '/speedrun' display.
 */

const windowWidth = 1280;
const windowHeight = 720;

const _defViewTop = 8;
/** Left view width (timer, gamepad etc) */
const _leftViewWidth = 240;
/** Right view width (game area) */
const _rightViewWidth = 1040;
/** Max border width, considering a 16:9 resolution (max multi == 64) */
const _maxWidth = 1024;
/** Max border height, considering a 16:9 resolution (max multi == 64) */
const _maxHeight = 576;
/* By how much the game should increase in either direction. Starts as 10% */
let _gameViewInc = 1.1;

/* Display loaded from the config file */
let _display;

/**
 * Retrieves a console's dimensions from its name.
 *
 * @param{name} A string with the console's name (or initials).
 * @return{Array} The dimensions for the consoles, as [width, height].
 */
let getConsoleDimension = function(name) {
    switch (name.toLowerCase()) {
    case "nes":
        return [598, 470];
    case "gb":
    case "gbc":
        return [480, 432];
    case "megadrive":
    case "md":
        return [640, 480];
    case "gba":
        return [720, 480];
    case "snes":
        return [768, 672];
    default:
        throw "Invalid display mode. Check the docs!";
    }
}

/**
 * Convert the value into a valid dimension.
 *
 * @param{value} The tentative dimension.
 * @return{Int} The calculated dimension.
 */
function getValidDimension(value) {
    return makeValueEven(Math.floor(value));
}

/**
 * Check whether a given dimension is greater than the maximum allowed.
 *
 * @param{value} The tentative dimension.
 * @param{max} The maximum value for that dimension.
 * @return{Boolean} Whether the dimension is within the valid limits.
 */
let checkDimension = function(value, max) {
    return getValidDimension(value * _gameViewInc) <= max;
}

/**
 * Crop the given dimension so it fits within the limits.
 *
 * @param{value} The tentative dimension.
 * @param{max} The maximum value for that dimension.
 * @return{Int} The calculated dimension.
 */
let cropDimension = function(value, max) {
    if (!checkDimension(value, max)) {
        return getValidDimension(max / _gameViewInc);
    }

    return getValidDimension(value);
}

/**
 * Retrieves the dimensions of the display as an object with attributes:
 *   - border
 *       - width
 *       - height
 *       - x
 *       - y
 *   - game
 *       - width
 *       - height
 *       - x
 *       - y
 *
 * @param{display} A 'display' object. Look at docs/config.md for more info.
 * @return An object as described above
 */
let getDimensions = function(display) {
    let w = 0, h = 0;

    /* Reset the increase */
    _gameViewInc = 1.1;

    /* 0 - Sanitize display size */
    if (display.type == "console") {
        let arr = getConsoleDimension(display.mode);
        w = arr[0];
        h = arr[1];
    }
    else if (display.type == "custom") {
        w = display.width;
        h = display.height;
    }
    else {
        throw "Invalid display object. Check the docs!";
    }

    /* Game border is usually 10% bigger than the game (from
     * _gameViewInc). If the view is too big, the border shrinks
     * into half its increase. */
    if (!checkDimension(w, _maxWidth) || !checkDimension(h, _maxHeight)) {
        _gameViewInc = 1.0 + (_gameViewInc - 1.0) * 0.5;
    }

    /* Correct the game view (if needed) */
    if (("strict" in display) && display.strict) {
        w = cropDimension(w, _maxWidth);
        h = cropDimension(h, _maxHeight);
    }
    else {
        w = getValidDimension(w);
        h = getValidDimension(h);
    }

    ret = {border: {}, game: {}};

    /* Center within the window, unless it would overlap the left area */
    ret.border.width = getValidDimension(w * _gameViewInc);
    ret.border.height = getValidDimension(h * _gameViewInc);
    ret.border.x = (windowWidth - ret.border.width) * 0.5;
    ret.border.y = _defViewTop;

    if (ret.border.height >= _maxHeight) {
        ret.border.y = (windowHeight - ret.border.height) * 0.5;
    }
    if (ret.border.x <= _leftViewWidth) {
        ret.border.x = _leftViewWidth + (_rightViewWidth - ret.border.width) * 0.5;
    }
    ret.border.y = getValidDimension(ret.border.y);
    ret.border.x = getValidDimension(ret.border.x);

    /* Center (globally) the game within the view */
    ret.game.width = w;
    ret.game.height = h;
    ret.game.x = ret.border.x + (ret.border.width - ret.game.width) * 0.5;
    ret.game.x = getValidDimension(ret.game.x);
    ret.game.y = ret.border.y + (ret.border.height - ret.game.height) * 0.5;
    ret.game.y = getValidDimension(ret.game.y);

    return ret;
}

/**
 * Configures 'gameView', the border, and 'gameColorKey', the actual game area,
 * based on a display object.
 *
 * @param{display} A 'display' object. Look at docs/config.md for more info.
 * @return An object as described above
 */
function configureDisplay(argsDisplay) {
    let view = document.getElementById("gameView");
    let game = document.getElementById("gameColorkey");

    _display = getDimensions(argsDisplay);

    view.style.width = _display.border.width + "px";
    view.style.height = _display.border.height + "px";
    view.style.left = _display.border.x + "px";
    view.style.top = _display.border.y + "px";

    /* Calculate and set the border's outline */
    let val = (_display.border.width - _display.game.width) * 0.5;
    val = Math.floor(val * _outlineWidth);
    view.style._outlineWidth = val + "px";

    game.style.width = _display.game.width + "px";
    game.style.height = _display.game.height + "px";
    game.style.left = _display.game.x + "px";
    game.style.top = _display.game.y + "px";

    /* Write the game info into the screen */
    let str = "&nbsp game position: {";
    str += " x: "+gameColorkey.offsetLeft;
    str += ", y: "+gameColorkey.offsetTop;
    str += ", w: "+gameColorkey.offsetWidth;
    str += ", h: "+gameColorkey.offsetHeight;
    str += " } &nbsp";
    document.getElementById("gameInfo").innerHTML = str;
}

/**
 * Calculate how many pixels are left under the border (e.g., for the title).
 */
function getUnderView() {
    let val = windowHeight - _display.border.y - _display.border.height;
    return getValidDimension(val);
}

/**
 * Calculate the actual width of the left side of the screen.
 */
function getLeftView() {
    if (_display.border.x * 0.9 > _leftViewWidth) {
        return _display.border.x * 0.9;
    }
    return _leftViewWidth;
}
