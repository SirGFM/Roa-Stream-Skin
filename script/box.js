const _boxPrefix = '__auto__';
const _boxSuffix = '__box__';
const _contentPadding = 2;
const _borderSize = 3;
const _lightOutline = '#ffffff';
const _darkOutline  = '#cbdbfc';
const _innerShadow  = '#3f3f74';
const _border       = '#5b6ee1';
const _background   = '#3f3f74';
const _outterShadow = '#222034';

let _boxCache = {};

let _getBoxName = function(content) {
    return _boxPrefix + content.id + _boxSuffix;
}

let _updateShadow = function(_box) {
}

function setBoxDimensions(content, innerWidth, innerHeight, padContent=true) {
}

function createBox(content, innerWidth, innerHeight, darkBG=true, hasShadow=true, padContent=true) {
    let _id = _getBoxName(content);
    let _box = _boxCache[_id];
    let _isNew = (!_box);
    if (_isNew) {
        _box = document.createElement('div');
        _boxCache[_id] = _box;

        let _addChild = function(childId) {
            let _child = document.createElement('div');
            _child.id = _id + childId;
            _child.style.position = 'absolute';
            _box.appendChild(_child);
            return _child;
        }

        let _bgColor = _background;
        if (darkBG)
            _bgColor = '#000000';

        _box.id = _id;
        _box.style.position = 'fixed';
        _addChild('leftOutterShadow').style.backgroundColor = _outterShadow;
        _addChild('bottomOutterShadow').style.backgroundColor = _outterShadow;
        _addChild('background').style.backgroundColor = _bgColor;
        // XXX: Cotent should go here
        _addChild('leftBorder').style.backgroundColor = _border;
        _addChild('rightBorder').style.backgroundColor = _border;
        _addChild('topBorder').style.backgroundColor = _border;
        _addChild('bottomBorder').style.backgroundColor = _border;
        _addChild('leftInnerShadow').style.backgroundColor = _innerShadow;
        _addChild('rightInnerShadow').style.backgroundColor = _innerShadow;
        _addChild('topInnerShadow').style.backgroundColor = _innerShadow;
        _addChild('bottomInnerShadow').style.backgroundColor = _innerShadow;
        _addChild('leftOutterOutline').style.backgroundColor = _darkOutline;
        _addChild('rightOutterOutline').style.backgroundColor = _lightOutline;
        _addChild('topOutterOutline').style.backgroundColor = _lightOutline;
        _addChild('bottomOutterOutline').style.backgroundColor = _darkOutline;
        _addChild('leftInnerOutline').style.backgroundColor = _darkOutline;
        _addChild('rightInnerOutline').style.backgroundColor = _lightOutline;
        _addChild('topInnerOutline').style.backgroundColor = _lightOutline;
        _addChild('bottomInnerOutline').style.backgroundColor = _darkOutline;
    }

    setBoxDimensions(content, innerWidth, innerHeight, padContent);

    if (_isNew)
        document.body.insertAdjacentElement('beforeend', _box)

    if (!hasShadow) {
        document.getElementById(_id + 'leftOutterShadow').style.visibility = 'hidden';
        document.getElementById(_id + 'bottomOutterShadow').style.visibility = 'hidden';
    }
}

function getContentPosition(content) {
}
