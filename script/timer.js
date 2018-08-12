// Maximum time allowed between multi-presses
const _multiPress = 300;
// Amount of presses required for a multi-press
const _resetTimerCount = 3;
// How long a button must be held to be considered a press
const _pressDetectionMs = 500;
// Last time when the button wasn't pressed (for measuring pressed time)
let _lastReleased = 0;
// To detect when the button was last pressed
let _lastState = false;
// When the button was actually pressed
let _pressTime = 0;
// Whether the press has been handled
let _handled = false;

// Time when the last callback was called
let _lastCallback = 0;
// Amount of presses since the last single press
let _multiPressCount = 0;
// Delayed handle call (if any)
let _pressHandle = null;

// Delay between timer updates
const _updateDelay = 1000 / 30;
// Timer that displays the current time
let _timerLabel = null;
// Accumulated time in ms
let _accumulatedTime = 0;
// Accumulated time when the timer was last started
let _prevAccumulatedTime = 0;
// Last time at which the timer was started
let _lastStartTime = 0;
// Worker that updates the timer, if any
let _timerRunner = null;

/**
 * Setup the label that shall display the current timer
 */
function setupTimer(element) {
    _timerLabel = element;
}

/**
 * Callback used to trigger reseting, pausing and unpausing the timer.
 *
 * To solve issues caused by miss-pressing the button, it ignores presses
 * shorter _pressDetectionMs.
 */
function timerCallback(state) {
    let _now = Date.now()

    if (state) {
        if (!_lastState) {
            // Detect whether it's a multipress or not
            if (_now - _lastCallback > _multiPress) {
                _multiPressCount = 1;
                _pressTime = Date.now();
            }
            else {
                _multiPressCount++;
            }

            _lastCallback = _now;
        }

        // Check whether the button has been held for long enough
        if (!_handled && Date.now() - _lastReleased >= _pressDetectionMs) {
            // Do actually take an action based on the button press.
            handleTimerCallback();
            _handled = true;
        }
    }
    else {
        _lastReleased = Date.now();
        _handled = false;
    }
    _lastState = state;
}

/**
 * Return time with fixed drift from when the button was first pressed.
 */
let getFixedAcc = function() {
    return _accumulatedTime - (Date.now() - _pressTime);
}

/**
 * Resets the timer on multipresses and (un)pause it on single presses.
 */
function handleTimerCallback() {
    switch (_multiPressCount) {
    case _resetTimerCount:
        // Reset the time and pauses it
        toggleTimer(0, true);
        _prevAccumulatedTime = 0;
        setTimerText();
        reloadSplits();
        break;
    default:
        let latest = getFixedAcc();
        if (_timerRunner != null && hasMoreSplits()) {
            setCurrentSplit(latest);
        }
        /* Stop if the previous split was the last */
        if (_timerRunner == null || !hasMoreSplits()) {
            toggleTimer(latest);
        }
        break;
    }
}

/**
 * Pauses/Unpauses the timer
 *
 * @param{time} Currently accumulated time
 * @param{forceHalt} Forces the timer to pause
 */
function toggleTimer(time, forceHalt=false) {
    if (forceHalt || _timerRunner != null) {
        window.clearInterval(_timerRunner);
        _timerRunner = null;
        _accumulatedTime = time;
        setTimerText();
    }
    else if (_timerRunner == null) {
        _timerRunner = window.setInterval(updateTimer, _updateDelay);
        _prevAccumulatedTime = _accumulatedTime;
        _lastStartTime = _pressTime;
    }
}

/**
 * Update the running timer
 */
function updateTimer() {
    let now = Date.now();

    _accumulatedTime = _prevAccumulatedTime + (now - _lastStartTime);
    setTimerText();
    /* Update the split, if set */
    updateCurrentDiff(_accumulatedTime);
}

/**
 * Updates the timer label with the currently accumulated timer.
 */
function setTimerText() {
    if (_timerLabel) {
        _timerLabel.innerText = timeToText(_accumulatedTime);
    }
}

/**
 * Converts a given time to text.
 *
 * @param{time} The integer time to be converted to string.
 * @param{showMs} Whether the text should contain milliseconds.
 * @param{autoHideHour} Whether units should be hidden, unless greater than 0.
 */
function timeToText(time, showMs=true, autoHide=false) {
    let ms = time % 1000;
    let s = Math.floor((time / 1000) % 60);
    let min = Math.floor((time / 60000) % 60);
    let hour = Math.floor((time / 3600000) % 24);

    let txt = "";

    if (!autoHide || hour > 0) {
        txt += ("" + hour).padStart(2, "0") + ":";
    }
    if (!autoHide || hour > 0 || min > 0) {
        txt += ("" + min).padStart(2, "0") + ":";
    }
    txt += ("" + s).padStart(2, "0");
    if (showMs) {
        txt += "." + ("" + ms).padStart(3, "0");
    }

    return txt;
}
