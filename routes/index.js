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
    manager.loadMovie(function(reply) {
        var movie = reply['movie'];
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(movies));
    });
}

exports.updateIMDBInfo = function(req, res) {
    var hash = req.param('hash');
    var title = req.param('title');
    var force = req.param('force', 'false').toLowerCase();
    force = (force == 'true') ? true : false;
    var image_save_root = path.normalize(path.join(__dirname, '../public/poster'));
    manager.updateIMDBInfo(hash, title, image_save_root, force);
    res.setHeader("Content-Type", "application/json");
    res.end('{"reply": "triggered"}');
}

exports.updateContentInfo = function(req, res) {
    var hash = req.param('hash');
    var force = req.param('force', 'false').toLowerCase();
    force = (force == 'true') ? true : false;
    manager.updateContentInfo(hash, force);
    res.setHeader("Content-Type", "application/json");
    res.end('{"reply": "triggered"}');
}
