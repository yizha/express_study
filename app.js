var manager = require('movie_manager');

manager.connect(null, null, null);
manager.loadMovieFromDir(['/tmp/dingyc1', '/tmp/dingyc2']);
manager.watch(['/tmp/dingyc1', '/tmp/dingyc2']);

/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    swig = require('swig');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.register('.html', swig);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  swig.init({
      root: __dirname + '/views',
      allowErrors: true
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
