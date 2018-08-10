/**
 * Handle setting up the splits view, as well as configuring the times etc.
 */

/**
 * Group of elements inside 'splitsDiv', used to display the split. Each group
 * is represented by the object:
 *   - label: The split's label/title/name
 *   - diff: Difference between the best and this run
 *   - time: Target/Achieved time on the split
 *   - tgtTime: The actual (integer) target/achieved time on the split, in ms
 */
let _els = [];
/** The current split being played */
let _cur = 0;

function setupSplits(splits) {
    let div = document.getElementById("splitsDiv");

    if (!("entries" in splits)) {
        div.style.visibility = "hidden";
        _cur = -1;
        return;
    }

    div.style.visibility = "visible";
    _cur = 0;

    /* Make sure every only objects that will be used are visible */
    while (_els.length < splits.entries.length) {
        let obj = {};

        obj.label = document.createElement("label");
        obj.label.setAttribute("class", "m5x7 split splitLabel");
        obj.diff = document.createElement("label");
        obj.diff.setAttribute("class", "m5x7 split splitDiff");
        obj.time = document.createElement("label");
        obj.time.setAttribute("class", "m5x7 split splitTime");
        obj.tgtTime = 0;

        _els.push(obj);
        div.append(obj.label);
        div.append(obj.diff);
        div.append(obj.time);
    }

    for (let i = 0; i < splits.entries.length; i++) {
        let obj = _els[i];

        obj.label.style.visibility = "visible";
        obj.diff.style.visibility = "visible";
        obj.time.style.visibility = "visible";
    }
    for (let i = splits.entries.length; i < _els.length; i++) {
        let obj = _els[i];

        obj.label.style.visibility = "hidden";
        obj.diff.style.visibility = "hidden";
        obj.time.style.visibility = "hidden";
    }

    resetSplits(splits);
}

function resetSplits(splits) {
    let hideSplit = true;
    _cur = 0;

    /* Load the supplied entries into the div */
    for (let i in splits.entries) {
        let entry = splits.entries[i];
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

function setDiff(idx, time, force=false) {
    let obj = _els[idx];
    let ms = false, autoHide = true;
    let signal = "";
    let tmpTime = 0;

    if (time - obj.tgtTime >= 0) {
        tmpTime = time - obj.tgtTime;
        signal = "+";
    }
    else if (force || time - obj.tgtTime > -10000) {
        tmpTime = Math.abs(time - obj.tgtTime);
        signal = "-";
    }
    else {
        /* Split isn't too good nor has gone too bad*/
        return;
    }
    ms = (tmpTime < 60000);

    obj.diff.innerText = signal + timeToText(tmpTime, ms, autoHide);
}

function updateSplit(idx, time, hideSplit=false) {
    let obj = _els[idx];

    if (isNaN(time)) {
        obj.diff.innerText = "";
        obj.time.innerHTML = "NaN</br>";
    }
    else {
        let autoHide = true, force = true;
        let ms = (time < 60000);

        if (hideSplit) {
            obj.diff.innerText = "";
        }
        else {
            setDiff(idx, time, force);
        }
        obj.time.innerHTML = timeToText(time, ms, autoHide) + "</br>";
    }
}

function updateCurrentDiff(time) {
    if (!hasMoreSplits()) {
        return;
    }
    setDiff(_cur, time);
}

function setCurrentSplit(time) {
    if (!hasMoreSplits()) {
        return;
    }
    updateSplit(_cur, time);
    _cur++;

    let tgt = undefined;
    if (_cur + 1 < _els.length) {
        tgt = _els[_cur + 1]
    }
    else if (_cur < _els.length) {
        tgt = _els[_cur]
    }

    if (tgt) {
        try {
            tgt.label.scrollIntoViewIfNeeded();
        } catch (e) {
            tgt.label.scrollIntoView();
        }
    }
}

function hasMoreSplits() {
    return _cur >= 0 && _cur < _els.length;
}
