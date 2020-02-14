let gamepad = function() {
    const _fps = 30;
    let _interval = null;
    let _active = {
        'released': {
            'src': '/img/gamepad/x360/released_buttons.png',
            'width': 190,
            'left': 18,
            'top': 18
        },
        'button': {
            'l2': {
                'src': '/img/gamepad/x360/pressed/l2.png',
                'width': 42,
                'height': 20,
                'left': 22,
                'top': 18,
                'button': 6
            },
            'l1': {
                'src': '/img/gamepad/x360/pressed/l1.png',
                'width': 34,
                'height': 14,
                'left': 62,
                'top': 28,
                'button': 4
            },
            'r2': {
                'src': '/img/gamepad/x360/pressed/r2.png',
                'width': 42,
                'height': 20,
                'left': 156,
                'top': 18,
                'button': 7
            },
            'r1': {
                'src': '/img/gamepad/x360/pressed/r1.png',
                'width': 34,
                'height': 14,
                'left': 122,
                'top': 28,
                'button': 5
            },
            'home': {
                'src': '/img/gamepad/x360/pressed/home.png',
                'width': 26,
                'height': 26,
                'left': 96,
                'top': 46,
                'button': 16
            },
            'select': {
                'src': '/img/gamepad/x360/pressed/select.png',
                'width': 24,
                'height': 14,
                'left': 74,
                'top': 70,
                'button': 8
            },
            'start': {
                'src': '/img/gamepad/x360/pressed/start.png',
                'width': 24,
                'height': 14,
                'left': 120,
                'top': 70,
                'button': 9
            },
            'x': {
                'src': '/img/gamepad/x360/pressed/x.png',
                'width': 26,
                'height': 26,
                'left': 146,
                'top': 66,
                'button': 2
            },
            'y': {
                'src': '/img/gamepad/x360/pressed/y.png',
                'width': 26,
                'height': 26,
                'left': 168,
                'top': 44,
                'button': 3
            },
            'a': {
                'src': '/img/gamepad/x360/pressed/a.png',
                'width': 26,
                'height': 26,
                'left': 160,
                'top': 92,
                'button': 0
            },
            'b': {
                'src': '/img/gamepad/x360/pressed/b.png',
                'width': 26,
                'height': 26,
                'left': 182,
                'top': 70,
                'button': 1
            },
            'up': {
                'src': '/img/gamepad/x360/pressed/up.png',
                'width': 14,
                'height': 14,
                'left': 82,
                'top': 102,
                'button': 12
            },
            'down': {
                'src': '/img/gamepad/x360/pressed/down.png',
                'width': 14,
                'height': 14,
                'left': 82,
                'top': 126,
                'button': 13
            },
            'left': {
                'src': '/img/gamepad/x360/pressed/left.png',
                'width': 14,
                'height': 14,
                'left': 70,
                'top': 114,
                'button': 14
            },
            'right': {
                'src': '/img/gamepad/x360/pressed/right.png',
                'width': 14,
                'height': 14,
                'left': 94,
                'top': 114,
                'button': 15
            }
        },
        'axis': {
            'lstick': {
                'src': '/img/gamepad/x360/stick.png',
                'width': 18,
                'height': 18,
                'left': 36,
                'top': 80,
                'hw': 25,
                'hh': 25,
                'hor': 0,
                'ver': 1
            },
            'rstick': {
                'src': '/img/gamepad/x360/stick.png',
                'width': 18,
                'height': 18,
                'left': 126,
                'top': 112,
                'hw': 17,
                'hh': 17,
                'hor': 2,
                'ver': 3
            }
        }
    };

    /**
     * Retrieve the current list of connected gamepads.
     *
     * From: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
     */
    function getGamepadList() {
        if (navigator.getGamepads)
           return navigator.getGamepads();
        else if (navigator.webkitGetGamepads)
           return navigator.webkitGetGamepads()
        return [];
    }

    /** Set a callback for updating the buttons */
    function enableGamepad(gamepadId) {
        if (_interval === null && getGamepadCount(getGamepadList()) > 0) {
            /* No 'onpress' event, gotta pool... */
            _interval = setInterval(pollGamepad, 1000 / _fps);
        }
    }

    /** Remove the callback for updating the buttons */
    function disableGamepad(force = false) {
        if (force || (getGamepadCount(getGamepadList()) <= 0 &&
                      _interval !== null)) {
            clearInterval(_interval);
            _interval = null;
        }
    }

    /**
     * Retrieve the actual number of connected gamepads, given a list retrieved
     * from 'getGamepadList()'.
     */
    function getGamepadCount(gpList) {
        let count = 0;

        for (let i in gpList) {
            if (gpList[i])
                count++;
        }

        return count;
    }

    /** Check whether 'b' is pressed */
    let buttonPressed = function(b) {
        if (typeof(b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    }

    /** Update the gamepad's objects */
    let pollGamepad = function() {
        if (!_active)
            return;
        let _gps = getGamepadList();
        /* Shouldn't happen... */
        if (!_gps || _gps.length <= 0)
            return;

        /** Check for the first gamepad with any button pressed */
_check_gp:
        if (_activeGpIdx == -1) {
            for (let i  = 0; i < _gps.length; i++) {
                if (!_gps[i])
                    continue;
                for (let bt in _gps[i].buttons) {
                    if (buttonPressed(_gps[i].buttons[bt])) {
                        _activeGpIdx = i;
                        break _check_gp;
                    }
                }
            }
        }
        if (_activeGpIdx == -1 || _activeGpIdx >= _gps.length ||
                !_gps[_activeGpIdx]) {
            /* Gamepad was just removed */
            _activeGpIdx = -1;
            return;
        }
        _gp = _gps[_activeGpIdx];

        for (let i in _active.button) {
            let _bt = _active.button[i];
            let idx = _bt.button;

            if (idx >= _gp.buttons.length)
                continue;

            let state = buttonPressed(_gp.buttons[idx]);
            gamepad.dispatchTimerEvent(i, state);
        }
        for (let i in _active.hat) {
            let _hat = _active.hat[i];

            let state = false;
            if ('approx' in _hat) {
                for (let j in _hat.approx) {
                    if (Math.abs(_hat.approx[j] - _gp.axes[_hat.idx]) < 0.01) {
                        state = true;
                        break;
                    }
                }
            }
            else {
                if (_hat.val > 0)
                    state = _gp.axes[_hat.idx] >= _hat.val;
                else
                    state = _gp.axes[_hat.idx] <= _hat.val;
            }

            gamepad.dispatchTimerEvent(i, state);
        }
    };

    /** Configure the event listener for gamepads. */
    document.addEventListener("DOMContentLoaded", function (event) {
        /* Delay it unti ~1s after the page has loaded */
        window.setTimeout(function() {
            window.addEventListener("gamepadconnected", function(e) {
                _activeGpIdx = -1;
                enableGamepad(e.gamepad.id);
            });
            window.addEventListener("gamepaddisconnected", function(e) {
                disableGamepad();
            })
        }, 1000);
    });

    return {
        /**
         * Set a skin as the default one. Otherwise, a skin will be selected
         * from the gamepad id.
         *
         * @param{skin} The name of the skin.
         */
        setDefaultSkin(skin) {
            _defaultSkin = skin;
        },
        /**
         * Configure the view and bind the buttons according to a gamepad skin.
         *
         * @param{parentContent} Attach point for the images.
         * @param{skin} Name of the skin to be used.
         */
        setup() {
        },
        /**
         * Try to dispatch a timer control event, based on a button press.
         *
         * @param{buttonName} Name of the button that changed states.
         * @param{state} State of the button (true = pressed, false = released).
         */
        dispatchTimerEvent: function(buttonName, state) {
            if (_eventBt != buttonName)
                return; /* Do nothing */
            else if (_lastState == state) {
                if (state)
                    document.dispatchEvent(new Event('timer-pressed'));
            }
            else if (state)
                document.dispatchEvent(new Event('timer-onpress'));
            else
                document.dispatchEvent(new Event('timer-onrelease'));
            _lastState = state;
        },
        /**
         * Configure a button to generate the following events:
         *   - 'timer-onpress'
         *   - 'timer-pressed'
         *   - 'timer-onrelease'
         *
         * @param{buttonName} Name of the button that shall trigger the events.
         */
        setTimerEventButton: function(buttonName) {
            _eventBt = buttonName;
            _lastState = false;
        },
        logKeys: function() {
            let _gps = getGamepadList();
            /* Shouldn't happen... */
            if (!_gps || _gps.length <= 0)
                return;
            let _gp = null;
            for (let i in _gps)
                if (_gps[i]) {
                    _gp = _gps[i];
                    break;
                }
            if (!_gp) {
                window.alert('No gamepad!');
                return;
            }
            let s = '';
            for (let i in _gp.buttons)
                s += 'b: ' + i + ' - ' + _gp.buttons[i].pressed + '</br>';
            for (let i in _gp.axes)
                s += 'x: ' + i + ' - ' + _gp.axes[i] + '</br>';
            let txt = document.getElementById('debug');
            if (!txt) {
                txt = document.createElement('p');
                txt.id = 'debug';
                txt.style.position = 'absolute';
                txt.style.zIndex = 1000;
                document.body.appendChild(txt);
            }
            txt.innerHTML = s;
        }
    };
}()
