//WEB_SOCKET_SWF_LOCATION = '/swf/WebSocketMain.swf';
WEB_SOCKET_SWF_LOCATION = '/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';

if (!window.console) {
    console = {
        'log': function(){}
        , 'dir': function(){}
        , 'time': function(){}
        , 'timeEnd': function(){}
        , 'profile': function(){}
        , 'profileEnd': function(){}
    };
}

(function ($) {
    $('body').removeClass('nojs');
    var server = new io.Socket(null, {
        'port': '#socketIoPort#'
        , 'rememberTransport': true
        , 'transports': ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
    }); 
    server.on('connect', function() {
        console.log('connect');
    });
    server.on('message', function(msg) {
        console.log(msg);
    });
    server.on('disconnect', function() {
        console.log('disconnect');
    });
    server.connect();
})(jQuery);