/**
 * Handles the '/speedrun' display.
 */

let display = function() {
    const windowWidth = 1280;
    const windowHeight = 720;

    const _defViewTop = 8;
    /** Left view width (timer, gamepad etc) */
    const _leftViewWidth = 240;
    /** Right view width (game area) */
    const _rightViewWidth = 1040;
    /** Max border, considering a 16:9 resolution (max multi == 64) */
    const _16x9MaxWidth = 1024;
    const _16x9MaxHeight = 576;
    /** Max border, considering a 4:3 resolution (max multi == 240) */
    const _4x3MaxWidth = 960;
    const _4x3MaxHeight = 720;
    /** Max border, considering an unrestricted resolution */
    const _maxWidth = 1024;
    const _maxHeight = 720;
    /* Width of the label's border */
    const _outlineWidth = 0.2;

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

    return {
        /**
         * Retrieves the dimensions of the display as an object with attributes:
         *   - w
         *   - h
         *   - x
         *   - y
         *
         * @param{config} A 'config' object. Look at docs/config.md for more info.
         * @return An object as described above
         */
        getBorderDimensions: function(config) {
            let display = config.display;
            let padContent = true;

            /* 0 - Sanitize display size */
            let w, h;
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

            let maxW, maxH;
            if (Math.floor(w / 16) == Math.floor(h / 9)) {
                maxW = _16x9MaxWidth;
                maxH = _16x9MaxHeight;
            }
            else if (Math.floor(w / 4) == Math.floor(h / 3)) {
                maxW = _4x3MaxWidth;
                maxH = _4x3MaxHeight;
            }
            else {
                maxW = _maxWidth;
                maxH = _maxHeight;
            }

            /* Check whether the dimensions fit within the border */
            let borderW, borderH;
            do {
                borderW = box.getOutterSize(w, padContent);
                borderH = box.getOutterSize(h, padContent);
                if (borderW > maxW || borderH > maxH) {
                    w = w * 0.9;
                    h = h * 0.9;
                    continue;
                }
            } while (false);

            /* Correct the game view (if needed) */
            w = utils.getValidDimension(w);
            h = utils.getValidDimension(h);

            let borderX, borderY;
            if (splits.hasSplits(config)) {
                /* Try to give as much space to the splits as possible */
                let _splitW = splits.getMinWidth();

                if (windowWidth - borderW > _splitW * 1.5) {
                    /* There's plenty room for the splits */
                    _splitW = utils.getValidDimension(_splitW * 1.5);
                }
                else if (windowWidth - borderW > _splitW) {
                    /* Try to expand the splits as much as possible */
                    _splitW *= 1.6;

                    do {
                        _splitW = utils.getValidDimension(_splitW * 0.9);
                    } while (windowWidth - borderW < _splitW);
                }
                else if (windowWidth - borderW < _splitW) {
                    /* Shrink split so it doesn't overlap the display */
                    _splitW = (windowWidth - borderW) * 0.85;
                    _splitW = utils.getValidDimension(_splitW);
                }

                borderX = (windowWidth - borderW - _splitW) / 3;
                borderX = utils.getValidDimension(borderX);

                borderX = 2 * borderX + _splitW;
            }
            else {
                /* Center within the window */
                borderX = (windowWidth - borderW) * 0.5;
                borderX = utils.getValidDimension(borderX);
            }

            borderY = _defViewTop;
            if (borderH >= maxH) {
                borderY = (windowHeight - borderH) * 0.5;
                borderY = utils.getValidDimension(borderY);
            }

            /* Check whether the view would overlap the left area and fix that */
            if (borderX <= _leftViewWidth) {
                borderX = _leftViewWidth + (_rightViewWidth - borderW) * 0.5;
            }
            borderY = utils.getValidDimension(borderY);
            borderX = utils.getValidDimension(borderX);

            return {
                x: borderX,
                y: borderY,
                width: borderW,
                height: borderH
            };
        }
    };
}();
