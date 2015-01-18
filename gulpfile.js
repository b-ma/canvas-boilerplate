var gulp = require('gulp')
  , browserify = require('browserify')
  , es6ify = require('es6ify')
  , fs = require('fs')
  , portscanner = require('portscanner')
  , http = require('http')
  , serveStatic = require('serve-static')
;

var ip = '127.0.0.1';
var root = './app';
var paths = {
  scripts: 'app/**/*.js'
}

gulp.task('es6ify', function() {
  browserify({ debug: true })
    .add(es6ify.runtime)
    .transform(es6ify)
    .require(require.resolve('./app/main.js'), { entry: true })
    .bundle()
    .on('error', function(err) {
      console.error(err.message);
      this.end();
    })
    .pipe(fs.createWriteStream('./build.js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['es6ify']);
});

// default task
gulp.task('default', ['watch', 'es6ify'], function() {
  // launch some static server
  portscanner.findAPortNotInUse(3000, 3020, ip, function(error, port) {
    // serve up public/ftp folder
    var serve = serveStatic('./', {'index': ['index.html']})

    var server = http.createServer(function(req, res){
      var done = function(req, res) {};
      serve(req, res, done);
    });

    server.listen(port);
    console.log('>  server started at: http://' + ip + ':' + port);
  });
});
