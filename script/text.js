const _textPrefix = '__auto__';
const _textSuffix = '__text__';
const _animSuffix = '__anim__';
const _charSpeed = 3;

let _baseKeyFrames = null;

let _textCache = {};
let _cssCache = {};

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
        _w = Math.floor(_w * 0.95);
        _w = _w + (_w % 2);
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
        let _animName = _textPrefix + id + _textSuffix + _animSuffix;
        let _realW = getLabelLength(txt, true);
        if (!_cssCache[_animName]) {
            let _index = document.styleSheets[0].rules.length;
            document.styleSheets[0].insertRule('@keyframes ' + _animName + ' { from { text-indent: 0px; } to { text-indent: -' + _realW + 'px; } }', _index)
            _cssCache[_animName] = document.styleSheets[0].rules[_index];
        }

        let _cW = getLabelLength('O');
        let _t = _realW / (_cW * _charSpeed);
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
