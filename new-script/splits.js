let splits = function() {
    const _labelClass = 'm5x7 split splitLabel outlined';

    /**
     * Each entry under the loaded split. Has two attributes:
     *   - label: The name of the split (as diplayed)
     *   - time: The accumulated time until that split
     */
    let _entries = [];

    return {
        /**
         * Check whether the current configuration has splits
         * configured.
         *
         * @param{config} A 'config' object. Look at docs/config.md for more info.
         * @return Whether the current configuration has splits configured.
         */
        hasSplits: function(config) {
            return 'timer' in config && 'splits' in config.timer
                   && ('server' in config.timer.splits || 'entries' in config.timer.splits);
        },

        /**
         * Load splits from a JSON string.
         *
         * @param{json} A JSON string with each split. See docs/config.md for more info.
         */
        fillEntriesJson: function(json) {
            try {
                let data = JSON.parse(json);

                if (!("entries" in data)) {
                    throw "Invalid response '" + data + "'";
                }

                splits.fillEntries(data.entries);
            } catch (e) {
                alert(e);
                /* Throw again so it may be captured by the console */
                throw e;
            }
        },

        /**
         * Load splits from an array.
         *
         * @param{arr} A list of objects with the split's label and time, in milliseconds.
         */
        fillEntries: function(arr) {
            _entries = arr;
        },

        /**
         * Look through every entry and calculate the width (in pixels) of the
         * longest name.
         *
         * Ideally, the splits view should be at least this long (whence why
         * it's the "minimum width").
         *
         * @return The minimum desired width for the splits view.
         */
        getMinWidth: function() {
            let _max = 0;

            utils.setupGetLabelLength(_labelClass);

            for (let i in _entries) {
                let _entry = _entries[i];
                let _w = utils.getLabelLength(_entry.label);

                if (_w > _max)
                    _max = _w;
            }

            return _max;
        }
    };
}();
