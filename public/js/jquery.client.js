//WEB_SOCKET_SWF_LOCATION = '/swf/WebSocketMain.swf';
WEB_SOCKET_SWF_LOCATION = '/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

(function ($) {
    var socket = new io.Socket(null, {
        'port': '#socketIoPort#'
        , 'rememberTransport': true
        , 'transports': ['websocket', 'flashsocket']//, 'htmlfile', 'xhr-multipart', 'xhr-polling']
    }); 
    socket.on('connect', function() {
        console.log('connect');
    });
    socket.on('message', function(msg) {
        console.log(msg);
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
    socket.connect();
})(jQuery);