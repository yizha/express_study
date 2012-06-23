var manager = require("movie_manager");

// home page
exports.index = function(req, res) {
    manager.listAvailableMovies(function(err, movies) {
        if (err) {
            movies = [];
        }
        movies.sort(function(a, b) {
            return a.filename.localeCompare(b.filename);
        });
        res.render('index.html', {
            'title': 'Movies',
            'movies': movies
        });
    });
};
