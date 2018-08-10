/**
 * Handle setting up the splits view, as well as configuring the times etc.
 */

/**
 * Group of elements inside 'splitsDiv', used to display the split. Each group
 * is represented by the object:
 *   - div: The div that contains every label
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

        obj.div = document.createElement("div");
        obj.label = document.createElement("label");
        obj.label.setAttribute("class", "m5x7 split splitLabel outlined");
        obj.diff = document.createElement("label");
        obj.diff.setAttribute("class", "m5x7 split splitDiff outlined");
        obj.time = document.createElement("label");
        obj.time.setAttribute("class", "m5x7 split splitTime outlined");
        obj.tgtTime = 0;

        _els.push(obj);
        obj.div.append(obj.label);
        obj.div.append(obj.diff);
        obj.div.append(obj.time);
        div.append(obj.div);
    }

    for (let i = 0; i < splits.entries.length; i++) {
        let obj = _els[i];

        obj.div.style.visibility = "visible";
    }
    for (let i = splits.entries.length; i < _els.length; i++) {
        let obj = _els[i];

        obj.div.style.visibility = "hidden";
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

    /* Highlight the first split */
    _els[0].div.setAttribute("class", "highlightedBg");
}

let setDiff = function(idx, time, force=false) {
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

let updateSplit = function(idx, time, hideSplit=false) {
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

    _els[_cur].div.removeAttribute("class", "highlightedBg");
    _cur++;
    if (_cur < _els.length) {
        _els[_cur].div.setAttribute("class", "highlightedBg");
    }

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
