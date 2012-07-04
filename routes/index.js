var manager = require("movie_manager");
var path = require('path');

// keepalive
exports.keepalive = function(req, res) {
    res.render('keepalive.html', {});
}

// home page
exports.index = function(req, res) {
    var type = req.param('type', 'available');
    res.render('movie_list.html', {
        'type': type,
        'title': '【麦爸Movie吧】',
        'movies': []
    });
}

// all users page
exports.allUsers = function(req, res) {
    manager.allUsers(function(reply) {
        res.render('all_users.html', {
            'users': reply.users
        });
    });
}

exports.allUserMovies = function(req, res) {
    manager.loadAllUserMovies(function(reply) {
        res.render('all_user_movies.html', {
            'allUserMovies': reply.all_user_movies
        });
    });
}

// user movies page
exports.userMovies = function(req, res) {
    var user = req.param('user');
    manager.loadUserMovies(user, function(reply) {
        manager.loadMovieFilenames(reply.hashes, function(reply2) {
            res.render('user_movies.html', {
                'user': user,
                'filenames': reply2.filenames
            });
        });
    });
}

// movie users page
exports.movieUsers = function(req, res) {
    var hash = req.param('hash');
    manager.loadMovieUsers(hash, function(reply) {
            res.render('movie_users.html', {
                'movieFilename': reply.filename,
                'users': reply.users
            });
    });
}

// all marked movies page
exports.markedMovies = function(req, res) {
    manager.loadMarkedMovies(function(reply) {
        res.render('marked_movies.html', {
            'movies': reply.movies
        });
    });
}

// admin page
exports.admin = function(req, res) {
    var type = req.param('type', 'available');
    res.render('admin.html', {
        'type': type,
        'movies': []
    });
}

exports.recommendMovie = function(req, res) {
    var hash = req.param('hash');
    var action = req.param('action', '');
    var value = null;
    if (action.toLowerCase() == 'set') {
        value = '1';
    } else {
        value = '0';
    }
    manager.setField(hash, 'recommend', value, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.movies = function(req, res) {
    var type = req.param('type', 'available');
    var funcName = null;
    if (type == 'all') {
        funcName = 'listAllMovies';
    } else if (type == 'removed') {
        funcName = 'listRemovedMovies';
    } else { 
        funcName = 'listAvailableMovies';
    }
    manager[funcName](function(reply) {
        var movies = reply['movies'];
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(movies));
    });
}

exports.movie = function(req, res) {
    var hash = req.param('hash');
    manager.loadMovie(hash, function(data) {
        var m = data['movie'];
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(m));
    });
}

exports.markUserMovie = function(req, res) {
    var hash = req.param('hash');
    var user = req.param('user');
    var mark = req.param('mark');
    manager.markUserMovie(user, hash, mark, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.loadUserMovies = function(req, res) {
    var user = req.param('user');
    manager.loadUserMovies(user, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.loadMovieUsers = function(req, res) {
    var hash = req.param('hash');
    manager.loadMovieUsers(hash, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.setPoster = function(req, res) {
    var hash = req.param('hash');
    var imageUrl = req.param('image_url');
    var image_save_root = path.normalize(path.join(__dirname, '../public/poster'));
    var savepath = path.join(image_save_root, hash + path.extname(imageUrl));
    manager.downloadPoster(hash, imageUrl, savepath, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.removePoster = function(req, res) {
    var hash = req.param('hash');
    manager.removeField(hash, 'poster_image', function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}
/*
exports.setIMDB = function(req, res) {
    var hash = req.param('hash');
    var imdb = req.param('imdb');
    res.setHeader("Content-Type", "application/json");
    manager.setField(hash, 'imdb', imdb, function(reply) {
        if (reply && reply.success == 'true') {
            var poster_url = imdb.Poster;
            var image_save_root = path.normalize(path.join(__dirname, '../public/poster'));
            var savepath = path.join(image_save_root, hash + path.extname(poster_url));
            manager.downloadPoster(hash, poster_url, savepath, function(r) {
                res.end(JSON.stringify(reply));
            });
        } else {
            res.end(JSON.stringify(reply));
        }
    });
}
*/
exports.removeIMDB = function(req, res) {
    var hash = req.param('hash');
    manager.removeField(hash, 'imdb', function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.setIMDB = function(req, res) {
    var hash = req.param('hash');
    var id = req.param('i');
    var title = req.param('t');
    var year = req.param('y');
    var image_save_root = path.normalize(path.join(__dirname, '../public/poster'));
    manager.setIMDB(hash, {'i': id, 't': title, 'y': year}, image_save_root, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}

exports.loadFilesAndSize = function(req, res) {
    var hash = req.param('hash');
    manager.loadFilesAndSize(hash, function(reply) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(reply));
    });
}
