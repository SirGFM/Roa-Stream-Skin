let _whiteSpaceLen = 0;

/**
 * Setup the current document so getLabelLength may be later called.
 * It may be called more than once to calculate the length of a string for
 * different fonts.
 *
 * @param{classList} List of classes used by the font, as space-separated
 *                   strings (e.g. "class1 class2").
 */
function setupGetLabelLength(classList) {
    let label = document.getElementById("label-width-calculator");

    if (!label) {
        label = document.createElement("label");
        label.id = "label-width-calculator";

        // Set some inline elements to help calculate the length
        label.style.position = "absolute";
        label.style.visibility = "hidden";
        label.style.width = "auto";
        label.style.height = "auto";
        label.style.whiteSpace = "nowrap";

        document.body.insertAdjacentElement('beforeend', label);
    }
    // Overrides any previously set classes
    label.className = classList;

    // Forces a redraw (most likely useless, but still fun :D)
    void label.offsetWidth;

    // This is ugly, but gets rid of a corner case (not being able to retrieve
    // the label length on the first call)
    getLabelLength("fix coner case");

    // Store the length of a single whitespace
    _whiteSpaceLen = getLabelLength(" ");
}

/**
 * Compute the length of a given string.
 *
 * @param{txt} The string
 * @param{addTrailingSpace} Whether a single whitespace should be added at the end.
 */
function getLabelLength(txt, addTrailingSpace) {
    let width = 0;
    let label = document.getElementById("label-width-calculator");

    if (!label) {
        return 0;
    }

    label.innerText = txt;
    if (addTrailingSpace) {
        width = _whiteSpaceLen;
    }
    width += label.clientWidth;

    label.innerText = "";

    return width;
}

/**
 * Check if a given value is inside an array.
 *
 * @param{arr} The array
 * @param{val} The value
 */
function isInArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            return true;
        }
    }
    return false;
}

/**
 * Parse all query strings from a URL. Repeated names are
 * overwritten (instead of added to a list).
 *
 * @param{url} The url to be parsed.
 */
function parseURL(url) {
    let cmds = undefined;
    let ret = {};
    // Guaranteed to be the first hit (instead of inside some sub-string).
    let from = url.indexOf('?');

    if (from == -1) {
        return ret;
    }

    // Retrieve the argument list, removing any trailing '/'
    if (url[url.length-1] == '/') {
        cmds = url.substring(from+1, url.length-1);
    }
    else {
        cmds = url.substring(from+1, url.length);
    }

    // Parsing is quite simple: arguments are separated by '&' and name/value by '='.
    cmdList = cmds.split('&')
    for (var i = 0; i < cmdList.length; i++) {
        var name = undefined;
        var val = undefined;
        var cmd = cmdList[i];
        var split = cmd.indexOf('=');

        name = cmd.substring(0, split);
        val = cmd.substring(split+1);

        ret[name] = val;
    }

    return ret;
}
