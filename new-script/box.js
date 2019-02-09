let box = function(){
    const _boxPrefix = '__auto__';
    const _boxSuffix = '__box__';
    const _contentPadding = 4;
    const _borderSize = 6;
    const _lineSize = 2;
    const _shadowSize = 2;
    const _lightOutline = '#ffffff';
    const _darkOutline  = '#cbdbfc';
    const _innerShadow  = '#3f3f74';
    const _border       = '#5b6ee1';
    const _background   = '#3f3f74';
    const _outterShadow = '#222034';

    return {
        getOutterSize: function(size, padContent) {
            let _ret = size + 2 *_borderSize + 4 * _lineSize;
            if (padContent)
                return _ret + 2 * _contentPadding;
            return _ret;
        }
    };
}();
