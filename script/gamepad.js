let gamepad = function() {
    const _fps = 30;
    const xbox_id = 'Xbox 360 Controller';
    const ps1_id = 'Twin USB Joystick';

    let _eventBt = null;
    let _lastState = false;
    let _images = [];
    let _active = null;
    let _interval = null;

    let _xboxSkin = {
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
                'button': 1
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
        'axes': {
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

    /** Reset every image, so a new skin may be loaded. */
    let resetGamepad = function() {
        for (let i in _images) {
            _images[i].style.visibility = 'hidden';
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
            // TODO if def_id == null, detect from gamepad.id
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


    /**
     * Add a new <img> to the gamepad. 'obj' must have the following fields:
     *   - src
     *   - width
     *   - left
     *   - top
     * Optionally, 'obj' may have a 'height' attribute.
     *
     * @param{obj} The object to be added.
     * @return The newly created <img>.
     */
    let addObject = function(obj, parentContent) {
        let _new = null;
        for (let i in _images) {
            if (_images[i].style.visibility == 'hidden') {
                _new = _images[i];
                break;
            }
        }
        if (!_new) {
            _new = document.createElement('img');
            _new.style.visibility = 'hidden';
            _new.style.position = 'absolute';
            /* Add it to the document. */
            parentContent.appendChild(_new);
            /* Cache it for later use. */
            _images.push(_new);
        }
        _new.src = obj.src;
        _new.style.width = obj.width + 'px';
        if ('height' in obj)
            _new.style.height = obj.height + 'px';
        _new.style.left = obj.left + 'px';
        _new.style.top = obj.top + 'px';
        return _new;
    };

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
        if (_gps.length <= 0)
            return;
        let _gp = _gps[0];

        for (let i in _active.button) {
            let _bt = _active.button[i];
            let i = _bt.button;

            if (i >= _gp.buttons.length)
                continue;

            let state = buttonPressed(_gp.buttons[i]);
            if (state != _bt.visible) {
                _bt.visible = state;
                if (state) {
                    _bt.img.style.visibility = 'visible';
                }
                else {
                    _bt.img.style.visibility = 'hidden';
                }
            }

            gamepad.dispatchTimerEvent(i, state);
        }
        for (let i in _active.axes) {
            let _axis = _active.axes[i];
            let x = _gp.axes[_axis.hor];
            let y = _gp.axes[_axis.ver];

            x *= _axis.hw;
            x += _axis.cx - _axis.img.width / 2;
            y *= _axis.hh;
            y += _axis.cy - _axis.img.height / 2;

            _axe.img.style.left = x + 'px';
            _axe.img.style.top = y + 'px';
        }
    };

    /** Configure the event listener for gamepads. */
    window.addEventListener("gamepadconnected", function(e) {
        enableGamepad(e.gamepad.id);
    });
    window.addEventListener("gamepaddisconnected", function(e) {
        disableGamepad();
    });

    return {
        setup(parentContent, skin='') {
            let _obj = null;
            switch (skin) {
            case 'xbox':
                _obj = _xboxSkin;
                break;
            case 'ps1':
                _obj = _ps1Skin;
                break;
            case 'ps1-analog':
                _obj = _ps1AnalogSkin;
                break;
            }

            resetGamepad();
            addObject(_obj.released, parentContent).style.visibility = 'visible';
            for (let i in _obj.button)
                _obj.button[i].img = addObject(_obj.button[i], parentContent);
            for (let i in _obj.axes) {
                _obj.axes[i].img = addObject(_obj.axes[i], parentContent);
                _obj.axes[i].cx = _obj.axes[i].img.offsetLeft;
                _obj.axes[i].cx += _obj.axes[i].img.width / 2;
                _obj.axes[i].cy = _obj.axes[i].img.offsetTop;
                _obj.axes[i].cy += _obj.axes[i].img.height / 2;
            }

            _active = _obj;
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
        }
    };
}()
