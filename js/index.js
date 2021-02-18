(function($){
    'use strict';
    //Отдельном выносим языки, для более простой локализации
    var Lang = {
        ru: {
            //Месяца
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            //Месяца в родительcком падеже
            monthsRp: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
            //Месяца в предложном падеже
            monthsPp: ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'],
            maxPurchase: 'Больше всего заказов (_COUNT_) было _DATE_ _MONTH_ 2015 года.',
            stockInfoTitle: 'Более 100 000 продаж в ',
            stockInfoTime: 'Сроки проведения акции с _STARTDATE_ _STARTMONTH_ по _ENDDATE_ _ENDMONTH_'
        }
    };

    //Объявляем класс нашего лендинга
    var Landing = function () {

        this.nowDate = new Date();
        
        //Параметры загрузки лендинга
        this.params = {
            lang: 'ru', //локализация
            // maxPurchase: 2419, //Максимальное кол-во покупок
            // maxPurchaseDate: 2, //Количество дней назад 
            startStockDate: 29, //Дней назад началась акция
            endStockDate: 1, //Дней через которые акция закончится
            countDownDiff: Math.ceil((24*60*60)-(this.nowDate.getHours() * 60 * 60 + this.nowDate.getMinutes() * 60 + this.nowDate.getSeconds())), //Количество секунд до конца таймера
            selectors: {
                countDown: '.landing__countdown', //Таймер
                // maxPurcahesDate: '.landing__maxpurcashe', //Максимальное кол-во покупок
                stockInfo: '.landing__stockinfo',
                stockInfoTitle: '.landing__stockinfo_title'
            }
        };

        //Стартуем таймер
        this.initCountDown();
        //Заполняем обман
        //Максимальное количество покупок
        // this.initMaxPurcasheDate();
        //Даты проведения акции
        this.initStockInfo();

        this.initEvents();
    };
    //Список ивентов лендинга
    Landing.prototype.initEvents = function() {
        this.removeStyleTag();
        $('.scrollto').on('click', this.scrollToForm);
        $('.delivery li a').on('hover', this.showHeadInformation);
         /* this.initWarningModal();
      $("#ouibounce-modal .modal-footer, .close-over").on("click", this.closeWarningModal);*/
    };

    //Информация о дате проведения лендингов
    Landing.prototype.initStockInfo = function() {
        var lang = Lang[this.params.lang];
        var stockTitle = lang.stockInfoTitle + lang.monthsPp[this.nowDate.getUTCMonth()];


        var endStockDate = new Date(this.nowDate.getTime() + (this.params.endStockDate*24*60*60*1000));
        var startStockDate = new Date(this.nowDate.getTime() - (this.params.startStockDate*24*60*60*1000));

        var stockInfo = lang.stockInfoTime;
            stockInfo = stockInfo.replace('_STARTDATE_', startStockDate.getUTCDate());
            stockInfo = stockInfo.replace('_ENDDATE_', endStockDate.getUTCDate());
            stockInfo = stockInfo.replace('_STARTMONTH_', lang.monthsRp[startStockDate.getMonth()]);
            stockInfo = stockInfo.replace('_ENDMONTH_', lang.monthsRp[endStockDate.getMonth()]);
        
        $(this.params.selectors.stockInfoTitle).html(stockTitle);
        $(this.params.selectors.stockInfo).html(stockInfo);
    };
    
    //Максимальное количество покупок
    Landing.prototype.initMaxPurcasheDate = function() {
        var maxPurchaseDate = new Date(this.nowDate.getTime() - (this.params.maxPurchaseDate*24*60*60*1000));
        var htmlString = Lang[this.params.lang].maxPurchase;
            htmlString = htmlString.replace('_COUNT_', this.params.maxPurchase);
            htmlString = htmlString.replace('_DATE_', maxPurchaseDate.getUTCDate());
            htmlString = htmlString.replace('_MONTH_', Lang[this.params.lang].monthsRp[maxPurchaseDate.getUTCMonth()]);

        $(this.params.selectors.maxPurcahesDate).html(htmlString);
    };

    Landing.prototype.initCountDown = function() {
        var _this = this,
            endDate = new Date(this.nowDate.getTime() + this.params.countDownDiff * 1000);

        var countDownTimer = setInterval( function () {
            var diffDate = new Date(endDate.getTime() - Date.now()),
                h = (diffDate.getHours() > 9) ? diffDate.getHours() : '0'+diffDate.getHours(),
                m = (diffDate.getMinutes() > 9) ? diffDate.getMinutes() : '0'+diffDate.getMinutes(),
                s = (diffDate.getSeconds() > 9) ? diffDate.getSeconds() : '0'+diffDate.getSeconds();

            var htmlTime = '<span class="hours">'+ h +'</span>'+
                           '<span class="minutes">'+ m +'</span>'+
                           '<span class="seconds">'+ s +'</span>';

            $(_this.params.selectors.countDown).html(htmlTime);
        }, 1000);
    };

    Landing.prototype.removeStyleTag = function(event) {
        $(document.head).find('style').remove();
    };

    Landing.prototype.scrollToForm = function(event) {
        var $target = $(event.currentTarget);

        $("body,html").animate({
            scrollTop: $($target.attr("href")).offset().top
        }, 1e3);
        event.preventDefault();
    };

    

    $(function() {
        window.landing = new Landing();
    });
})(jQuery);
$(function () {
    function TemplateRefresh() {
        ModalRefresh();
    }

    $(window).resize(function () {
        TemplateRefresh();
    });
    TemplateRefresh();

    /* -----------------------------------------------------------------------------------------
     * Modal Refresh
     */
    function ModalRefresh() {
        if ($('.modal').is(':visible')) {
            var modalBlock = $('.modal:visible .modal-block'),
                width = parseInt(modalBlock.width()),
                height = parseInt(modalBlock.height());
            if ($(window).height() > height + 20) {
                modalBlock.addClass('modal-top').removeClass('margin-t-b').css('margin-top', -1 * (height / 2));
            }
            else {
                modalBlock.addClass('margin-t-b').removeClass('modal-top');
            }
            if ($(window).width() > width) {
                modalBlock.addClass('modal-left').removeClass('margin-l').css('margin-left', -1 * (width / 2));
            }
            else {
                modalBlock.addClass('margin-l').removeClass('modal-left');
            }
        }
    }


    /* -----------------------------------------------------------------------------------------
     * Modal Show
     */
    $(document).on('click', 'a[modal]', function(){
        var modalWindow = $('div#' + $(this).attr('modal'));
        if (modalWindow.length){
            modalWindow.fadeIn('fast');
            $('body').addClass('modal-show');
            ModalRefresh();
            return false;
        }
    });


    /* -----------------------------------------------------------------------------------------
     * Modal Hide
     */
    function ModalHide() {
        $('.modal:visible').fadeOut('fast', function(){
            $('body').removeClass('modal-show');
        });
    }

    $(document)
        .on('click', '.icon-close, .modal', function (event) {
            if (event.target != this)
                return false;
            else
                ModalHide();
        })
        .on('keydown', function (key) {
            if (key.keyCode == 27)
                ModalHide();
        })
        .on('click', '.modal > *', function (event) {
            event.stopPropagation();
            return true;
        })
        .on('submit', '#kmacb-form form', function () {
            var name = $('#kmacb-form form input[name=name]').val(),
                phone = $('#kmacb-form form input[name=phone]').val();
            $('form:first input[name=name]').val(name);
            $('form:first input[name=phone]').val(phone);
            $('form:first').submit();
            $('form:first input[name=name]').val('');
            $('form:first input[name=phone]').val('');
			return false;
        });


	try {
		//var kmainputs = kmacb();
		//$('#kmacb-form form').append(kmainputs);
		//$('body').append('<div id="kmacb"><a title="Перезвонить Вам" href="#" modal="kmacb-form"><div class="kmacb-circle"></div><div class="kmacb-circle-fill"></div><div class="kmacb-img-circle"></div></a></div>');

		setTimeout(
			function start_kmacb() {
                $('body').append('<div id="kmacb"><a title="Перезвонить Вам" href="#" modal="kmacb-form"><div class="kmacb-circle"></div><div class="kmacb-circle-fill"></div><div class="kmacb-img-circle"></div></a></div>');
			},
			40000
		);
	}
	catch (e) {}
});
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require,exports,module);
    } else {
        root.ouibounce = factory();
    }
}(this, function(require,exports,module) {

    return function ouibounce(el, config) {
        var config       = $.extend({},config),
            aggressive   = config.aggressive || false,
            sensitivity  = setDefault(config.sensitivity, 20),
            timer        = setDefault(config.timer, 1000),
            delay        = setDefault(config.delay, 0),
            oneEvent     = setDefault(config.oneEvent, true),
            callback     = config.callback || function() {},
            cookieExpire = setDefaultCookieExpire(config.cookieExpire) || '',
            cookieDomain = config.cookieDomain ? ';domain=' + config.cookieDomain : '',
            cookieName   = config.cookieName ? config.cookieName : 'viewedOuibounceModal',
            sitewide     = config.sitewide === true ? ';path=/' : '',
            _delayTimer  = null,
            _html        = document.documentElement;

        function setDefault(_property, _default) {
            return typeof _property === 'undefined' ? _default : _property;
        }

        function setDefaultCookieExpire(days) {
            // transform days to milliseconds
            var ms = days*24*60*60*1000;

            var date = new Date();
            date.setTime(date.getTime() + ms);

            return "; expires=" + date.toUTCString();
        }

        setTimeout(attachOuiBounce, timer);
        function attachOuiBounce() {
            _html.addEventListener('mouseleave', handleMouseleave);
            _html.addEventListener('mouseenter', handleMouseenter);
            _html.addEventListener('keydown', handleKeydown);
        }

        function handleMouseleave(e) {
            if (e.clientY > sensitivity || (checkCookieValue(cookieName, 'true') && !aggressive)) return;

            _delayTimer = setTimeout(_fireAndCallback, delay);
        }

        function handleMouseenter(e) {
            if (_delayTimer) {
                clearTimeout(_delayTimer);
                _delayTimer = null;
            }
        }

        var disableKeydown = false;
        function handleKeydown(e) {
            if (disableKeydown || checkCookieValue(cookieName, 'true') && !aggressive) return;
            else if(!e.metaKey || e.keyCode !== 76) return;

            disableKeydown = true;
            _delayTimer = setTimeout(_fireAndCallback, delay);
        }

        function checkCookieValue(cookieName, value) {
            return parseCookies()[cookieName] === value;
        }

        function parseCookies() {
            // cookies are separated by '; '
            var cookies = document.cookie.split('; ');

            var ret = {};
            for (var i = cookies.length - 1; i >= 0; i--) {
                var el = cookies[i].split('=');
                ret[el[0]] = el[1];
            }
            return ret;
        }

        function _fireAndCallback() {
            fire();
            callback();
        }

        function fire() {
            // You can use ouibounce without passing an element
            // https://github.com/carlsednaoui/ouibounce/issues/30
            if (el) el.style.display = 'block';
            disable();
        }

        function disable(options) {
            var options = options || {};

            // you can pass a specific cookie expiration when using the OuiBounce API
            // ex: _ouiBounce.disable({ cookieExpire: 5 });
            if (typeof options.cookieExpire !== 'undefined') {
                cookieExpire = setDefaultCookieExpire(options.cookieExpire);
            }

            // you can pass use sitewide cookies too
            // ex: _ouiBounce.disable({ cookieExpire: 5, sitewide: true });
            if (options.sitewide === true) {
                sitewide = ';path=/';
            }

            // you can pass a domain string when the cookie should be read subdomain-wise
            // ex: _ouiBounce.disable({ cookieDomain: '.example.com' });
            if (typeof options.cookieDomain !== 'undefined') {
                cookieDomain = ';domain=' + options.cookieDomain;
            }

            if (typeof options.cookieName !== 'undefined') {
                cookieName = options.cookieName;
            }

            document.cookie = cookieName + '=true' + cookieExpire + cookieDomain + sitewide;
            // remove listeners
            if( oneEvent ){
                _html.removeEventListener('mouseleave', handleMouseleave);
                _html.removeEventListener('mouseenter', handleMouseenter);
                _html.removeEventListener('keydown', handleKeydown);
            }
        }

        return {
            fire: fire,
            disable: disable
        };
    }
        ;

}));
let path = window.cdn_path;

var names = {}
var xhr = new XMLHttpRequest();
xhr.open('GET', '//179523.selcdn.ru/public/delivery-banner/lang.json', false);
xhr.send();
if (xhr.status != 200) {
  alert( xhr.status + ': ' + xhr.statusText ); 
} else {
  names = xhr.responseText;
}
let json = JSON.parse(names);

let mainDocLang = 'ro'; // язык

$('.main-banner p').css('display', 'none');
$('body').addClass('body-banner');
if(window.language) {
    addBanner(window.language);
} else {
    addBanner(mainDocLang);
}

function addBanner(wLang) {
    var ban = document.createElement('div'),
        body = document.querySelector('body');
    ban.classList.add('main-banner');
    let bannerList = '', langLength = json.languages.length, count = 0;

    for (let i=0;i<langLength;i++) {
            if(wLang == json.languages[i].lang) {
            bannerList+="<p class='"+json.languages[i].lang+"'><b>"+json.languages[i].lang_text_b+" <span class='delete_mob'>"+json.languages[i].lang_text_del+"</span></b><span class='ban-small'>"+json.languages[i].lang_text+"</span></p>";
            count++;
        }
    }

    if (count == 0) {
        bannerList+="<p class='"+json.languages[4].lang+"'><b>"+json.languages[4].lang_text_b+" <span class='delete_mob'>"+json.languages[4].lang_text_del+"</span></b><span class='ban-small'>"+json.languages[4].lang_text+"</span></p>";
    }

    ban.innerHTML = '<div class="fixed-el" style="width: 1px; height: 1px; opacity: 0; position: fixed; top: 0; left: 0;"></div><img src="//179523.selcdn.ru/public/delivery-banner/banner-icon-1.png" alt="icon">'+bannerList+'';
    body.appendChild(ban);
}


function addBannerStyle() {
    var cont = document.createElement('style'),
        head = document.querySelector('head');
    cont.innerHTML = '.main-banner img{max-width:61px;max-height:49px;margin:0!important}.main-banner{box-sizing:border-box;position:fixed;top:0;left:0;width:100vw;display:flex;justify-content:center;align-items:center;padding:0;background-color:#e30c0c;background-image:url(//179523.selcdn.ru/public/delivery-banner/banner-bg.png);background-repeat:no-repeat;background-size:cover;background-position:center;z-index:97;padding:10px}.main-banner.banner-bottom{top:auto;bottom:0}.main-banner p{margin-top:0!important;margin-bottom:0!important;font-family:Roboto,sans-serif;color:#fff!important;margin-left:20px;text-align:center}.main-banner p b{color:#fff;display:block;font-size:19px;font-weight:700;margin-bottom:5px}.main-banner p .ban-small{color:#fff;display:block;font-size:17px;line-height:1.2;font-weight:400}@media screen and (max-width:1219px){.main-banner img{max-width:50px;max-height:40px}.main-banner p{max-width:920px}}@media screen and (max-width:1023px){.main-banner .delete_mob{display:none}.main-banner p{max-width:500px}.main-banner p b{font-size:16px}.main-banner p .ban-small{font-size:15px}}@media screen and (max-width:767px){.main-banner p{max-width:420px}.main-banner p b{font-size:15px}.main-banner p .ban-small{font-size:14px}}@media screen and (max-width:639px){.main-banner img{max-width:35px;max-height:30px}.main-banner p{margin-left:10px}}@media screen and (max-width:479px){.main-banner img{max-width:50px;max-height:100%}.main-banner p{max-width:250px;line-height:1.1}.main-banner p b{line-height:18px;font-size:13px;margin-bottom:2px}.main-banner p .ban-small{line-height:17px;font-size:12px}}@media screen and (max-width:370px){.main-banner img{max-width:35px}}.main-banner p span{color:#fff!important}.main-banner *{box-sizing:border-box}';
    head.appendChild(cont);
}
$(document).ready(addBannerStyle);

let counter = 0;

$(document).on('scroll', function () {

    if (($('.fixed-el').offset().top > 100) && counter===0) {
        $('.main-banner').addClass('banner-bottom');
        counter = 1;
    } else if ($('.fixed-el').offset().top <= 100){
        $('.main-banner').removeClass('banner-bottom');
        counter = 0; 
    }  
    
});

function resizeHeight() {
    let mainHeight = $('.main-banner').css('height'),
    mTop = mainHeight + '!important',
    mBottom = mainHeight + '!important';

    $('body.body-banner').attr('style', 'margin-top: ' + mTop + '; margin-bottom: ' + mBottom);
}

$(document).ready(resizeHeight);
window.addEventListener('resize', resizeHeight);
