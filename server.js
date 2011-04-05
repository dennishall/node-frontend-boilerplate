
// if using google analytics, set this value to the actual value.
var googleAnalyticsSiteId = 'UA-XXXXX-X';


process.title = 'node-dummy';
process.addListener('uncaughtException', function (err, stack) {
    console.log('Caught exception: ' + err);
    console.log(err.stack.split('\n'));
});



// run setup for non-system libs, then resolve dependencies
require(__dirname + "/lib/setup")
   .ext(__dirname + "/lib")
   .ext(__dirname + "/lib/express/support");

var connect = require('connect'),
    express = require('express'),
    sys = require('sys'),
    fs = require('fs'),
    //io = require('Socket.IO-node'), //replaced with SocketServer
    SocketServer = require('./lib/socket-server'),
    port = process.env.PORT || 8081,
    assetManager = require('connect-assetmanager'),
    assetHandler = require('connect-assetmanager-handlers'),
    DummyHelper = require('./lib/dummy-helper'),
    assets = assetManager({
        'js': {
            'route': /\/static\/js\/[0-9]+\/.*\.js/
            , 'path': './public/js/'
            , 'dataType': 'js'
            , 'files': [
                'http://cdn.socket.io/stable/socket.io.js'
                , 'http://code.jquery.com/jquery-latest.js'
                , '*'
                , 'jquery.client.js'
                , 'jquery.frontend-development.js'
            ]
            , 'preManipulate': {
                '^': [
                    function (file, path, index, isLast, callback) {
                        if (path.match(/jquery.client/)) {
                            callback(file.replace(/'#socketIoPort#'/, port));
                        } else {
                            callback(file);
                        }
                    }
                ]
            }
            , 'postManipulate': {
                '^': [
                    assetHandler.uglifyJsOptimize
                    , function (file, path, index, isLast, callback) {
                        callback(file);
                        dummyTimestamps.content = Date.now();
                    }
                ]
            }
        }
        , 'css': {
            'route': /\/static\/css\/[0-9]+\/.*\.css/
            , 'path': './public/css/'
            , 'dataType': 'css'
            , 'files': [
                'reset.css'
                , '*' // oh, AND **EVERYTHING**?
                , 'frontend-development.css' // oh, AND ANOTHER ONE?
            ]
            , 'preManipulate': {
                'msie [6-7]': [
                     assetHandler.fixVendorPrefixes
                    , assetHandler.fixGradients
                    , assetHandler.stripDataUrlsPrefix
                ]
                , '^': [
                     assetHandler.fixVendorPrefixes
                    , assetHandler.fixGradients
                    , assetHandler.replaceImageRefToBase64(__dirname + '/public')
                ]
            }
            , 'postManipulate': {
                '^': [
                    assetHandler.yuiCssOptimize
                    , function (file, path, index, isLast, callback) {
                        callback(file);
                        dummyTimestamps.css = Date.now();
                    }
                ]
            }
        }
    });

// end var block


// instantiate and set up the server. (which is the preferred name, "app" or "server"?)

var app = module.exports = express.createServer();

app.configure(function() {
    
    // view engine can be overridden by supplying an extension to a filename, otherwise ".ejs" will be assumed
    // todo: test whether it's faster to set a default view engine or always supply file extensions (or both).
    app.set('view engine', 'ejs');
    
    // Optional since express defaults to CWD/views
    app.set('views', __dirname + '/views');
    
    app.use(connect.conditionalGet());
    app.use(connect.bodyDecoder());
    app.use(connect.logger({ format: ':req[x-real-ip]\t:status\t:method\t:url\t' }));
    app.use(assets);
    app.use(connect.staticProvider(__dirname + '/public'));

});

app.dynamicHelpers({
    cacheTimeStamps: function(req, res) {
        return assets.cacheTimestamps;
    }
});

// Examples
app.get('/your-page/', function(req, res) {
    res.header('X-UA-Compatible','IE=edge,chrome=1');
    res.render('index', {locals:{
        key: 'value'
    }});
});

app.post(/some-path/, function(req, res) {
    console.log(req.body);
    res.render('index', {locals:{
        key: 'value'
    }});
});

// Keep this just above .listen()
var dummyTimestamps = new DummyHelper(app);

app.listen(port, null);
new SocketServer(app);