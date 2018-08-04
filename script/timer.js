// Maximum time allowed between multi-presses
//const _multiPress = 150;
// Set a tighter time so l2 doesn't trigger this... D:
const _multiPress = 100;
// Amount of presses required for a multi-press
const _multiPressRequired = 2;
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
 */
function timerCallback() {
    let _now = Date.now()

    // Detect whether it's a multipress or not
    if (_now - _lastCallback > _multiPress) {
        _multiPressCount = 1;
    }
    else {
        _multiPressCount++;
    }

    // Set a callback so multi-presses may be detected
    if (!_pressHandle) {
        _pressHandle = window.setTimeout(handleTimerCallback, _multiPress*(_multiPressRequired-1));
    }
    _lastCallback = _now;
}

/**
 * Resets the timer on multipresses and (un)pause it on single presses.
 */
function handleTimerCallback() {
    if (_multiPressCount >= _multiPressRequired) {
        // Reset the time and pauses it
        toggleTimer(true);
        _accumulatedTime = 0;
        _prevAccumulatedTime = 0;
        setTimerText();
    }
    else {
        // (Un)Pauses the timer
        toggleTimer();
    }

    _pressHandle = null;
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
    }
    else if (_timerRunner == null) {
        _timerRunner = window.setInterval(updateTimer, _updateDelay);
        _prevAccumulatedTime = _accumulatedTime;
        _lastStartTime = Date.now();
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
