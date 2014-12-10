var gulp = require('gulp')
  , browserify = require('browserify')
  , es6ify = require('es6ify')
  , fs = require('fs')
;

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
    .pipe(fs.createWriteStream('./app/build.js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['es6ify']);
});

// default task
gulp.task('default', ['watch', 'es6ify']);
