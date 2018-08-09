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
let _handle = false;

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
 * Resets the timer on multipresses and (un)pause it on single presses.
 */
function handleTimerCallback() {
    switch (_multiPressCount) {
    case _resetTimerCount:
        // Reset the time and pauses it
        toggleTimer(true);
        _accumulatedTime = 0;
        _prevAccumulatedTime = 0;
        setTimerText();
        break;
    default:
        toggleTimer();
        break;
    }
}

/**
 * Pauses/Unpauses the timer
 *
 * @param{forceHalt} Forces the timer to pause
 */
function toggleTimer(forceHalt) {
    if (forceHalt || _timerRunner != null) {
        window.clearInterval(_timerRunner);
        _timerRunner = null;
        // Fix drift from when the button was first pressed
        _accumulatedTime -= Date.now() - _pressTime;
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
}

/**
 * Updates the timer label with the currently accumulated timer.
 */
function setTimerText() {
    let ms = "" + (_accumulatedTime % 1000);
    let s = "" + Math.floor((_accumulatedTime / 1000) % 60);
    let min = "" + Math.floor((_accumulatedTime / 60000) % 60);
    let hour = "" + Math.floor((_accumulatedTime / 3600000) % 24);

    if (_timerLabel) {
        let txt = "";

        txt += hour.padStart(2, "0") + ":";
        txt += min.padStart(2, "0") + ":";
        txt += s.padStart(2, "0") + ".";
        txt += ms.padStart(3, "0");

        _timerLabel.innerText = txt;
    }
}