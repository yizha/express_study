var manager = require('movie_manager');

var movie_dir = ['/home/media/movies'];

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

function userAuth(user, pass) {
    return user == 'media' && pass == 'wearethebest';
}

function adminAuth(user, pass) {
    return user == 'yizha' && pass == 'firstnodejsapp';
}

// Routes
app.get('/keepalive', routes.keepalive);

//app.get('/', express.basicAuth(userAuth));
app.get('/admin*', express.basicAuth(adminAuth));

app.get('/', routes.index);
app.get('/user_movies', routes.userMovies);

app.get('/json/movie_list', routes.movies);
app.get('/json/movie', routes.movie);
app.get('/json/mark_movie', routes.markUserMovie);
app.get('/json/user_movies', routes.loadUserMovies);

app.get('/admin', routes.admin);
app.get('/admin/all_users', routes.allUsers);
app.get('/admin/all_user_movies', routes.allUserMovies);
app.get('/admin/marked_movies', routes.markedMovies);
app.get('/admin/movie_users', routes.movieUsers);
app.get('/admin/setPoster', routes.setPoster);
app.get('/admin/removePoster', routes.removePoster);
app.get('/admin/setIMDB', routes.setIMDB);
app.get('/admin/removeIMDB', routes.removeIMDB);
app.get('/admin/loadFilesAndSize', routes.loadFilesAndSize);
app.get('/admin/recommend', routes.recommendMovie);

app.listen(80, function(){
    console.log(process.cwd());
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
