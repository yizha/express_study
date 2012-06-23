var manager = require("movie_manager");

// home page
exports.index = function(req, res) {
    var type = req.param('type', 'available');
    res.render('movie_list.html', {
        'type': type,
        'title': 'Movies',
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
