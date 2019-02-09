let utils = function() {
    /** Length of a single ' ', as calculated on setupGetLabelLength. */
    let _whiteSpaceLen = 0;

    /**
     * Calculate the dimension of a given text. Should be called for either
     * 'clientWidth' or 'clientHeight'.
     * 
     * @param{txt} The text to have its dimensions calculated.
     * @param{addTrailingSpace} Whether a single whitespace should be added at the end.
     * @param{dimension} The dimension to be calculated (either 'clientWidth' or 'clientHeight').
     * @return The calculated dimension in pixels.
     */
    let _getLabelDimension = function(txt, addTrailingSpace, dimension) {
        let val = 0;
        let label = document.getElementById('label-width-calculator');

        if (!label) {
            return 0;
        }

        label.innerText = txt;
        if (addTrailingSpace) {
            val = _whiteSpaceLen;
        }
        val += label[dimension];

        label.innerText = '';

        return val;
    }

    return {
        /**
         * If necessary, increases the value by 1 so it becomes even.
         *
         * @param{val} Value to be modified.
         */
        makeValueEven: function(val) {
            return val + (val % 2);
        },

        /**
         * Convert the value into a valid dimension.
         *
         * @param{value} The tentative dimension.
         * @return{Int} The calculated dimension.
         */
        getValidDimension: function(value) {
            return utils.makeValueEven(Math.floor(value));
        },

        /**
         * Retrieve a unique element, creating it if required.
         *
         * If the element was just create, as new attribute '__is_new__'
         * is set to 'true'. Otherwise, it's set to false.
         *
         * @param{id} The element's ID.
         * @param{type} The type of the element to be created.
         * @return The requested unique element.
         */
        getUniqueElement: function(id, type) {
            let el = document.getElementById(id);

            if (!el) {
                el = document.createElement(type);
                el.id = id;
                el.__is_new__ = true;
            }
            else
                el.__is_new__ = false;
            return el;
        },

        /**
         * Setup the current document so getLabelLength may be later called.
         * It may be called more than once to calculate the length of a string for
         * different fonts.
         *
         * @param{classList} List of classes used by the font, as space-separated
         *                   strings (e.g. "class1 class2").
         */
        setupGetLabelLength: function(classList) {
            let label = utils.getUniqueElement('label-width-calculator', 'label');

            if (label.__is_new__) {
                // Set some inline elements to help calculate the length
                label.style.position = 'absolute';
                label.style.visibility = 'hidden';
                label.style.width = 'auto';
                label.style.height = 'auto';
                label.style.whiteSpace = 'nowrap';

                document.body.insertAdjacentElement('beforeend', label);
            }
            // Overrides any previously set classes
            label.className = classList;

            // Forces a redraw (most likely useless, but still fun :D)
            void label.offsetWidth;

            // This is ugly, but gets rid of a corner case (not being able to retrieve
            // the label length on the first call)
            utils.getLabelLength('fix coner case');

            // Store the length of a single whitespace
            _whiteSpaceLen = utils.getLabelLength('A A') - 2 * utils.getLabelLength('A');
        },

        /**
         * Compute the length of a given string.
         *
         * @param{txt} The string
         * @param{addTrailingSpace} Whether a single whitespace should be added at the end.
         */
        getLabelLength: function(txt, addTrailingSpace) {
            return _getLabelDimension(txt, addTrailingSpace, 'clientWidth');
        },

        /**
         * Compute the height of a given string.
         *
         * @param{txt} The string
         */
        getLabelHeight: function(txt) {
            return _getLabelDimension(txt, false, 'clientHeight');
        }
    };
}();
