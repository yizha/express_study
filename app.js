var manager = require('movie_manager');

var movie_dir = ['/tmp/dingyc'];

manager.connect(null, null, null);
manager.loadMovieFromDir(movie_dir);
manager.watch(movie_dir);

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
  app.use(app.router);
  app.use("/resources", express.static(__dirname + '/public'));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get('/', routes.index);
app.get('/json/movie_list', routes.movies);
app.get('/json/movie', routes.movie);

app.get('/admin', routes.admin);
app.get('/admin/setPoster', routes.setPoster);
app.get('/admin/removePoster', routes.removePoster);
app.get('/admin/setIMDB', routes.setIMDB);
app.get('/admin/removeIMDB', routes.removeIMDB);
app.get('/admin/loadFilesAndSize', routes.loadFilesAndSize);
//app.get('/admin/updateIMDB', routes.updateIMDBInfo);
//app.get('/admin/update_imdb_info', routes.updateIMDBInfo);
//app.get('/admin/update_content_info', routes.updateContentInfo);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
