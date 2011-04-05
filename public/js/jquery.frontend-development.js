(function ($) {
    
    var currentPath = location.href.replace(new RegExp('https?://' + window.location.host, ''), ''); // how about location.pathname?
    console.log('currentPath', currentPath);
    var doReload = true;
    var isShowOverlay = $.cookie('do') === 'true';
    var $toolbar = $('<div id="frontend-development"></div>').appendTo('body');
    
    function doMoveAjax(url) {
        if (url) {
            $.ajax({
                'url': '/reload-content/'
                , 'data': {
                    'path': url
                }
                , 'type': 'post'
                , 'cache': false
                , 'success': function (text) {
                    $('.sync').fadeTo(200, 0.2).fadeTo(200, 1).fadeTo(200, 0.2).fadeTo(200, 1);
                }
            });
        }
    }
    
    (function reload($) {
        $.ajax({
            'url': '/reload-content/'
            , 'cache': false
            , 'success': function (text) {
                if (text === 'css') {
                    $('link').each(function (index) {
                        $(this).attr('href', $(this).attr('href').replace(/[0-9]+/, new Date().getTime()));
                    });
                } else if (text === 'content') {
                    setTimeout(function () {
                        location.reload(true);
                    }, 200);
                } else {
                    if (text && currentPath !== text) {
                        doReload = false;
                        location = text;
                    }
                }
            }
            , 'complete': function () {
                setTimeout(function () {
                    if (doReload) {
                        reload($);
                    }
                }, 1000);
            }
        });
    })($);
    
    // sync button
    $('<div title="Sync all browsers to this page" class="sync">S</div>').click(function () {
        doMoveAjax(currentPath);
    }).appendTo($toolbar);

    /*
    var $validationResults = $('<div title="Validate html" class="validate">V</div>').appendTo($toolbar);
    $validationResults.click(function () {
        var originSrc = $(this).html();
        $validationResults.html('<div class="loading"></div>');
        var pulseInterval;
        $.ajax({
            'cache': false
            , 'success': function (html) {
                $.ajax({
                    'url': '/validate-content/'
                    , 'type': 'post'
                    , 'cache': false
                    , 'dataType': 'text'
                    , 'data': {
                        'source': html
                    }
                    , 'success': function (html) {
                        $validationResults.unbind('click');
                        
                        if (html === 'ok') {
                            $validationResults.html(originSrc).addClass('ok');
                        } else {
                            $validationResults.html(originSrc).addClass('bad');
                            var $errorContainer = $('<ul id="frontend-development-validation-errors"/>').appendTo('html').hide();
                            var count;
                            $(html).find('li.error').each(function(index) {
                                $errorContainer.append('<li>'+$(this).html()+'</li>');
                                count = index+1;
                            });
                            if (count === undefined) {
                                return;
                            }
                            $validationResults.append('<div class="validation-errors">'+(count || '')+'</div>');
                            $validationResults.stop().animate({'opacity': 0.3}, 500).animate({'opacity': 1}, 500);
                            pulseInterval = setInterval(function() {
                                $validationResults.stop().animate({'opacity': 0.3}, 500).animate({'opacity': 1}, 500);
                            }, 1000);
                            
                            $validationResults.bind('click', function() {
                                $('.validation-errors').remove();
                                clearInterval(pulseInterval);
                                $errorContainer.show();
                                $validationResults.unbind('click');
                                $validationResults.bind('click', function() {
                                    $errorContainer.remove();
                                });
                            });
                        }
                    }
                });
            }
        });
    }).click();
    */

    $('<div title="Toggle overlay" class="toggle-overlay">O</div>').click(function () {
        $.cookie('do', isShowOverlay ? 'false' : 'true', {'path': '/'});
        location.reload(true);
    }).appendTo($toolbar).addClass(isShowOverlay ? 'bad' : 'ok');

    var $overlay = $('#dummy-overlay');
    if (!isShowOverlay) {
        if ($overlay.length) {
            if ($overlay.attr('style').match(/-center/)) {
                $overlay.addClass('center');
            }
            $('html').live('click', function() {
                if (toggleAnimation) {
                    clearInterval(toggleAnimation);
                }
                $overlay.toggle();
            });
            var toggleAnimation = setInterval(function() {
                $overlay.toggle();
            }, 200);
        }
    } else {
        $overlay.remove();
    }
})(jQuery);