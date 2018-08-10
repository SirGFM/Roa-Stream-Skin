/**
 * Handle setting up the splits view, as well as configuring the times etc.
 */

/**
 * Group of elements inside 'splitsDiv', used to display the split. Each group
 * is represented by the object:
 *   - label: The split's label/title/name
 *   - diff: Difference between the best and this run
 *   - time: Target/Achieved time on the split
 *   - tgtTime: The actual (integer) target/achieved time on the split
 */
let _els = [];
/** The current split being played */
let _cur = 0;

function setupSplit(split) {
    let div = document.getElementById("splitsDiv");

    /* Make sure every only objects that will be used are visible */
    while (split.entries.length < _els.length) {
        let obj = {};

        /* TODO Set style */
        obj.label = document.createElement("label");
        obj.diff = document.createElement("label");
        obj.time = document.createElement("label");
        obj.tgtTime = 0;

        _els.push(obj);
        div.append(obj.label);
        div.append(obj.diff);
        div.append(obj.time);
    }

    for (let i = 0; i < split.entries.length; i++) {
        let obj = _els[i];

        obj.label.style.visibility = "visible";
        obj.diff.style.visibility = "visible";
        obj.time.style.visibility = "visible";
    }
    for (let i = split.entries.length; i < _els.length; i++) {
        let obj = _els[i];

        obj.label.style.visibility = "hidden";
        obj.diff.style.visibility = "hidden";
        obj.time.style.visibility = "hidden";
    }

    resetSplit(split);
}

function resetSplit(split) {
    let hideSplit = true;
    _cur = 0;

    /* Load the supplied entries into the div */
    for (let i in split.entries) {
        let entry = split.entries[i];
        let obj = _els[i];

        obj.label.innerText = entry.label;
        if ("best" in entry) {
            obj.tgtTime = entry.best
        }
        else {
            obj.tgtTime = NaN;
        }

        updateSplit(i, obj.tgtTime, hideSplit);
    }
}

function setDiff(idx, time) {
    let obj = _els[id];
    let ms = false, autoHide = true;
    let signal = "";
    let tmpTime = 0;

    if (time - obj.tgtTime >= 0) {
        tmpTime = time;
        txt = "+";
    }
    else if (time - obj.tgtTime > -10) {
        tmpTime = Math.abs(time);
        txt = "-";
    }
    ms = (tmpTime < 60);

    obj.diff.innerText = signal + timeToText(time - tmpTime, ms, autoHide);
}

function updateSplit(idx, time, hideSplit=false) {
    let obj = _els[id];

    if (isNaN(time)) {
        obj.diff.innerText = "";
        obj.time.innerHTML = "NaN</br>";
    }
    else {
        let autoHide = true;
        let ms = (time < 60);

        if (hideSplit) {
            obj.diff.innerText = "";
        }
        else {
            setDiff(idx, time);
        }
        obj.time.innerHTML = timeToText(time, ms, autoHide) + "</br>";
    }
}
