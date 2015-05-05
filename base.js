$(function(){
    var __mw = $('.periphery .frame tbody').width();
    var __mh = $('.periphery .frame tbody').height();
    var __ow = $('.periphery .frame div').outerWidth(true);
    var __oh = $('.periphery .frame div').outerHeight(true);

    var __mCnt = 0; //移動中の○
    var __moveFlg = 0;

    var __clr_hst = new Array();
    var __clrLen = 6;
    
    var __sLen = $('.periphery .frame tr:first td').length;
    var __lLen = $('.periphery .frame tr').length;
    var __aLen = $('.periphery .frame div').length;

    var __comboCnt = 0;

    $('.periphery').css({
        "width": $('.periphery .frame').outerWidth(true),
        "height": $('.periphery .frame').outerHeight(true)
    });

    setTimeout(function(){
        $('.periphery .frame div').each(function(k){
            var color;
            while (color === undefined || (k - __sLen) >= 0 && (k - (__sLen * 2)) >= 0 && __clr_hst[k - __sLen] === color && __clr_hst[k - (__sLen * 2)] === color || (k % __sLen) > 1 && __clr_hst[k - 1] === color && __clr_hst[k - 2] === color ) {
                color = getColor();
            }
            var _p = $(this);
            _p.addClass('pd' + k);
            setTimeout(function(){makeBubble(k, color, _p)},20 * ( __aLen - k ));
            __clr_hst.push(color);
        });
    },500);

    function setDraggable (_d) {
        _d.draggable({
            "drag":function(){
                var _t = this;
                var _tp = $(_t).position();
                if (__mw < _tp.left + __ow) {
                    _left = __mw - __ow;
                } else if ( _tp.left < 0) {
                    _left = 0;
                } else {
                    _left = _tp.left;
                }
                if ( __mh < _tp.top + __oh ) {
                    _top = __mh - __oh;
                } else if (_tp.top < 0) {
                    _top = 0;
                } else {
                    _top = _tp.top;
                }
                var num = (Math.ceil((_top + $(_t).outerHeight(true) / 2) / $(_t).outerHeight(true) - 1) * __sLen ) + Math.ceil((_left + ($(_t).outerWidth(true) / 2)) / $(_t).outerWidth(true) - 1);
                var mc;
                mc = $(_t).attr('class').match(/cd[0-9]+/)[0];
                if (mc != 'cd' + num) {
                    $(_t).removeClass(mc);
                    $('.cd' + num).removeClass('cd' + num).addClass(mc).each(function(k){
                        movingDiv(this);
                    });
                    $(_t).addClass('cd' + num);
                }
            },
            "start":function(){
                __moveFlg = 1;
                $(this).addClass('draggable');
                progressBarSet(this);
            },
            "stop":function(){
                endMove(this);
            }
        });
    }

    /* 移動終了 */
    function endMove (_t) {
        $(_t).find('.progressBar').stop();
        $('.periphery .bubble').draggable('destroy');
        __moveFlg = 0;
        movingDiv(_t);
        progressBarDrop(_t);
        $(_t).removeClass('draggable');
    }

    /* タイマー */
    function progressBarSet (_t) {
        var _pbw = $('<div></div>').addClass('progressBarWrap');
        var _pb = $('<div></div>').addClass('progressBar');
        _pbw.append(_pb);
        $(_t).append(_pbw).find('.progressBar').animate({
            'background-color': '#f55',
            'width': '10px'
        }, 4000, 'linear', function(){
            endMove($(this).closest('.bubble'));
        });
    }
    function progressBarDrop (_t) {
        $(_t).children('.progressBarWrap').remove();
    }

    function movingDiv (_t) {
        __mCnt++;
        var pd = $(".pd" + String($(_t).attr('class').match(/cd[0-9]+/)).match(/[0-9]+/));
        if (pd.length) {
            $(_t).animate({
                'top': pd.position().top,
                'left': pd.position().left
            },function(){
                __mCnt--;
                if (__mCnt === 0 && __moveFlg === 0) {
                    dissolution();
                }
            });
        }
    }

    function dissolution () {
        __clr_hst = new Array();
        for (var i = 0; i < __aLen; i++) {
            var color = String($('.cd' + i).attr('class').match(/clr[0-9]+/));
            var _bt = $('.cd' + i);
            if ((i - __sLen) >= 0 && (i - (__sLen * 2)) >= 0 && __clr_hst[i - __sLen] === color && __clr_hst[i - (__sLen * 2)] === color ) {
                if (!($('.cd' + (i - __sLen)).hasClass('burst'))) {
                    _bt = _bt.add('.cd' + (i - __sLen)).add('.cd' + (i - __sLen * 2));
                    setCombo(color);
                }
                _bt.addClass('burst');
            }
            if ((i % __sLen) > 1 && __clr_hst[i - 1] === color && __clr_hst[i - 2] === color ) {
                if ( !($('.cd' + (i - 1)).hasClass('burst')) ) {
                    _bt = _bt.add('.cd' + (i - 1)).add('.cd' + (i - 2));
                    setCombo(color);
                }
                _bt.addClass('burst');
            }
            __clr_hst.push(color);
        }
        burstBubbles();
    }

    function setCombo (_c) {
        if (!__comboCnt) {
            $('.comboBoard td').html(0);
        }
        __comboCnt++;
        $('.comboBoard .now .num').html(__comboCnt);
        if (parseInt($('.comboBoard .max .num').html()) < __comboCnt) {
            $('.comboBoard .max .num').html(__comboCnt);
        }
        $('.comboBoard td.' + _c).html( parseInt($('.comboBoard td.' + _c).html()) + 1 );
    }

    function resetCombo () {
        __comboCnt = 0;
    }

    function burstBubbles () {
        var _bbCnt = 0;
        if ($('.bubble.burst').length === 0) {
            setDraggable($('.periphery .bubble'));
            resetCombo();
        }
        $('.bubble.burst').each(function(k){
            _bbCnt++;
            $(this).fadeOut(100 + 100 * k, function(){
                _bbCnt--;
                $(this).remove();
                if (_bbCnt === 0) {
                    supplementation();
                }
            });
        });
    }

    function supplementation () {
        var _tmpNum = 0;
        for (var i = __aLen - 1; i > -1; i--) {
            if ( $('.cd' + i).length === 0 ) {
                var ii = 1;
                while ( (_tmpNum = i - __sLen * ii) >= 0) {
                    if ($('.cd' + _tmpNum).length) {
                        $('.cd' + _tmpNum).removeClass('cd' + _tmpNum).addClass('cd' + i).each(function(k){
                            movingDiv(this);
                        });
                        ii = 0;
                        break;
                    }
                    ii++;
                }
                if (ii) {
                    var _p = $('.pd' + i);
                    var _d = makeBubble(i, getColor(), _p);
                }
            }
        }
    }

    function makeBubble (_n, _c, _p) {
        var _d = $('<div></div>');
        _d.append($('<div></div>').addClass('circle'));
        _d.addClass('cd' + _n + ' bubble clr' + _c);
        _d.css({
            'top': _p.position().top - __mh,
            'left': _p.position().left
        });
        $('.periphery .bubbles').append(_d);
        setDraggable(_d);
        movingDiv(_d);
        return _d;
    }

    function getColor () {
        return Math.floor( Math.random() * __clrLen);
    }

});
