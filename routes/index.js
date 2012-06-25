var manager = require("movie_manager");
var path = require('path');

// home page
exports.index = function(req, res) {
    var type = req.param('type', 'available');
    res.render('movie_list.html', {
        'type': type,
        'title': 'Movies',
        'movies': []
    });
}

// admin page
exports.admin = function(req, res) {
    var type = req.param('type', 'available');
    res.render('admin.html', {
        'type': type,
        'title': 'Admin',
        'movies': []
    });
}

exports.admin2 = function(req, res) {
    var type = req.param('type', 'available');
    res.render('admin2.html', {
        'type': type,
        'movies': []
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
