var dir_to_list = "/tmp";
var file_to_write = "./views/files.html";

var fs = require('fs');

var func = function() {
    files = fs.readdirSync(dir_to_list);
    var content = ""; 
    if (files && files.length) {
        content += "<table>";
        for (var i = 0; i < files.length; i++) {
            content += "<tr><td>" + files[i] + "</td></tr>";
        }   
        content += "</table>";
    } else {
        content = "<p>no files?</p>";
    }   
    target = file_to_write + ".tmp";
    fs.writeFileSync(target, content, "utf8");
    fs.renameSync(target, file_to_write);
    setTimeout(func, 5000);
}

setTimeout(func, 5000);



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
      allowErrors: true,
      autoescape: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
