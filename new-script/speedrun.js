let speedrun = function() {
    /**
     * Bootstrap executed after the page finishes loading
     */
    let bootstrap = function() {
        /* Setup the hook so pressing the button will load a file */
        let _button = utils.getUniqueElement('loadConfigButton', 'button');
        if (_button.__is_new__) {
            _button.className = 'fixedRoot img configButton';
            _button.type = 'button';
            _button.style.top = '608px';
            _button.style.left = '0px';
            _button.addEventListener('click', setupLoadFile);

            document.body.insertAdjacentElement('beforeend', _button);
        }

        let _input = utils.getUniqueElement('configInput', 'input');
        if (_input.__is_new__) {
            _input.type = 'file';
            _input.name = 'name';
            _input.style.display = 'none';
            _input.addEventListener('change', loadJsonFile);

            document.body.insertAdjacentElement('beforeend', _input);
        }
    }

    /**
     * Called from 'loadConfigButton', simply clicks on 'configInput' to
     * get a file selector UI.
     */
    let setupLoadFile = function() {
        document.getElementById('configInput').click();
    }

    /**
     * Loads a JSON file as the page's configuration. Called as
     * 'configInput's handler.
     */
    let loadJsonFile = function() {
        if (this.files.length <= 0) {
            alert('No file selected!');
            return;
        }

        /* NOTE: OBS on Windows does not report JSON files with the
         * proper MIME type. */
        let _file = this.files[0];
        if (_file.type != '' && _file.type != 'application/json') {
            alert('Invalid file type! Expected a JSON file.');
            return;
        }

        let _reader = new FileReader();
        _reader.onload = function (e) {
            let _config = JSON.parse(e.target.result);
            _normalizeConfig(_config);

            /* Delay setting up everything until the splits (if any) are loaded */
            if ('server' in _config.timer.splits) {
                conn.getData(_config.timer.splits.server, function (e) {
                    splits.fillEntriesJson(e);
                    setup(_config);
                });
            }
            else if ('entries' in _config.timer.splits) {
                splits.fillEntries(_config.timer.splits.entries);
                setup(_config);
            }
            else
                setup(_config);
        };
        _reader.readAsText(_file);
    }

    /**
     * Normalizes the configuration.
     */
    let _normalizeConfig = function(config) {
        /* Initialize every value (to avoid errors) */
        if (!('timer' in config)) {
            config.timer = {};
        }
        if (!('splits' in config.timer)) {
            config.timer.splits = {};
        }
        if (!('input' in config)) {
            config.input = {};
        }
    }

    /**
     * Configures the display based on an input file
     *
     * @param{config} A 'config' object. Look at docs/config.md for more info.
     */
    let setup = function(config) {
        let _layout = {};

        _layout.game = display.getBorderDimensions(config);

        /* TODO: Continue here */
    }

    /* Setup the bootstrap */
    document.addEventListener('DOMContentLoaded', function (event) {
        window.setTimeout(bootstrap, 100)
    })
}();
