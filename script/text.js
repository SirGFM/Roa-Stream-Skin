const _textPrefix = '__auto__';
const _textSuffix = '__text__';
const _animSuffix = '__anim__';
const _charSpeed = 0.75;

let _baseKeyFrames = null;

let _textCache = {};

let _getTextId = function(content) {
    return _textPrefix + content.id + _textSuffix;
}

function addLine(id, txt, classList, maxBorderWidth=1024, isBoxed=true) {
    let _id = _getTextId(id);
    let _text = _textCache[_id];
    let _isNew = (!_text);
    if (_isNew) {
        _text = document.createElement('label');
        _textCache[_id] = _text;
        _text.id = id;
        _text.className = classList;
    }

    setupGetLabelLength(classList);
    let _w = getLabelLength(txt);

    /* Calculate the actual width, bound to the maximum value (and possibly box) */
    let _contentWf = function(_w) { return _w; };
    if (isBoxed)
        _contentWf = function(_w) { return getBoxDimension(_w, padContent=true); };
    let _doScroll = (_contentWf(_w) > maxBorderWidth);
    while (_contentWf(_w) > maxBorderWidth) {
        _w *= 0.95;
    }

    let _h = getLabelHeight(txt);
    _text.innerText = txt;

    if (isBoxed) {
        createBox(_text, _w, _h, anchor=true, darkBG=false, hasShadow=true, padContent=true);
        let _pos = getBoxContentPosition(_text);
        _text.style.top = _pos + 'px';
        _text.style.left = _pos + 'px';
    }
    else if (_isNew)
        document.body.insertAdjacentElement('beforeend', _text);

    if (_doScroll) {
        if (!_baseKeyFrames) {
            for (let i in document.styleSheets[0].rules) {
                if (document.styleSheets[0].rules[i].name == 'baseKeyFrame') {
                    _baseKeyFrames = document.styleSheets[0].rules[i];
                    break;
                }
            }
        }
        document.styleSheets[0].addRule();
        // TODO Properly populate the new rule
        let _newRule = document.styleSheets[0].rules[document.styleSheets[0].rules.length - 1];
        for (let attr in _baseKeyFrames) {
            _newRule[attr] = _baseKeyFrames[attr];
        }
        _newRule.cssRules[1].style.textIndent = '-' + _w + 'px';
        let _animName = _textPrefix + id + _textSuffix + _animSuffix;
        _newRule.name = _animName;

        let _cW = getLabelLength('O');
        let _t = _w / (_cW * _charSpeed);
        _text.style.animationDuration = _t+'s';
        _text.style.animationName = _animName;
        _text.style.animationIterationCount = 'infinite';
        _text.style.animationTimingFunction = 'linear';

        _text.innerText = txt+' '+txt;
        _text.style.width = _w+'px';
        _text.style.textOverflow = 'clip';
        _text.style.whiteSpace = 'nowrap';
    }
}
