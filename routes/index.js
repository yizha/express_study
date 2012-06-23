var manager = require("movie_manager");

// home page
exports.index = function(req, res) {
    manager.listAvailableMovies(function(reply) {
        var movies = reply['movies'];
        res.render('index.html', {
            'title': 'Movies',
            'movies': movies
        });
    });
};

exports.ajax_movies = function(req, res) {
    manager.listAvailableMovies(function(reply) {
        var movies = reply['movies'];
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(movies));
    });
}
