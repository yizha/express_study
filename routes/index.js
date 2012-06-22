
/*
 * GET home page.
 */

exports.index = function(req, res){
//    console.log(require('fs').readFileSync(__dirname + '/../views/files.html', 'utf8'));
    res.render('index.html', { 
        title: 'Express', 
        files: require('fs').readFileSync(__dirname + '/../views/files.html', 'utf8')
    });
};
