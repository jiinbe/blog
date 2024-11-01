/**
 * Spa.js 1.0.0
 * A very simple single-page-application Framework
 * 
 * author: Hejx
 * https://github.com/Alex-fun/simple-single-page-application-demo
 * 
 * Licensed under MIT
 */


(function(window, undefined){
    window.Spa = function(){
        var app = this,
            option = {
                ctl: 'page page-from-center-to-left',
                rtc: 'page page-from-right-to-center',
                ctr: 'page page-from-center-to-right',
                ltc: 'page page-from-left-to-center'
            };
        
        // version
        app.version = '1.0.0';
        
        // router cache
        app.cache = [], app.callBack = [];
        
        // router 
        app.router = {
            go: function(viewName, query){
                var _view = app.getElm('.page'),
                    _len = _view.length,
                    _targetView,
                    _cache = app.cache,
                    _hasThisPage = false,
                    _prevElm, 
                    _currentElm, 
                    _page, 
                    _that = this;
                    
                // 拿到该元素
                if (_len === 0) {
                    throw '找不到任何页面';
                }
                if (_cache.length === 0) _cache.push(_view[0]);
                if (_cache.length > 0) {
                    for (var p = 0, l = _cache.length; p < l; p++) {
                        if(_cache[p].attributes['data-page'].value === viewName) _hasThisPage = true;
                    }
                }
                if (_hasThisPage) return console.log('该页面已存在');
                
                for (var i = 0; i < _len; i++) {
                    if (_view[i].attributes['data-page'].value === viewName) {
                        _targetView = _view[i];
                        _cache.push(_targetView);
                    }
                }
                
                // 开始
                _prevElm = _cache[_cache.length - 2];
                _currentElm = _cache[_cache.length - 1];
                _page = {
                    'from': _prevElm.attributes['data-page'].value,
                    'current': _currentElm.attributes['data-page'].value,
                    'query': query || null
                };
                _that.callBackFn('before', viewName, _page);
                
                // 处理动画
                _prevElm.className = option.ctl;
                _currentElm.className = option.rtc;
                _prevElm.style.zIndex = _cache.length - 2;
                _currentElm.style.zIndex = _cache.length - 1;
                
                // 回调
                _currentElm.addEventListener('animationend',  animationEnd, false);
                function animationEnd(e){
                    if (e.animationName === 'pageFromRightToCenter') {
                        _that.callBackFn('after', viewName, _page);
                        _currentElm.removeEventListener('animationend', animationEnd, false);
                    }
                }
            },
            back: function(){
                if (app.cache.lenght === 0) return;
                var _centerView = app.cache.pop();
                    _centerView.className = option.ctr;
                app.cache[app.cache.length - 1].className = option.ltc;
                console.log(app.cache);
            },
            before: function(query, callback){
                app.callBack.push({
                    type: 'before',
                    query: query,
                    callback: callback || null
                });
            },
            after: function(query, callback){
                app.callBack.push({
                    type: 'after',
                    query: query,
                    callback: callback || null
                });
            },
            callBackFn: function(type, query, data){
                for (var i = -1, len = app.callBack.length - 1; len > i; len--) {
                    if (app.callBack[len].type === type && app.callBack[len].query === query) {
                        app.callBack[len].callback(data);
                        break;
                    }
                };
            }
        };
        app.getElm = function(selector){
            var _elm = null, 
                _string = selector.substr(1);
            if (selector.indexOf('#') > -1) {
                _elm = document.getElementById(_string);
            } else {
                _elm = document.getElementsByClassName(_string);
            }
            return _elm;
        }
    };
    
    document.addEventListener('click', function(e){
        if (e.target.tagName === 'A') {
            e.preventDefault();
            var _target = e.target,
                _href = _target.attributes['href'].value;
            if (_href.indexOf('#') === -1 || _href.length === 1) return;    
            app.router.go(_href.split('?')[0].substr(1), getUrlRequest(_href.split('?')[1]));
        }
    });
    
    function getUrlRequest(url){
            var query = {}, 
                strs;
            if (url.indexOf("&") != -1) {
                strs = url.split("&");
                for (var i = 0; i < strs.length; i++) {
                    query[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
            } else {
                var key = url.substring(0, url.indexOf("="));
                var value = url.substr(url.indexOf("=")+1);
                query[key] = decodeURI(value);
            }
            return query;
    }

})(window);
