var gulp = require('gulp');
var babel = require('babelify');
var connect = require('gulp-connect');
var babel = require("gulp-babel");

var paths = {
  babel: './src/**/*.js',
  dest: 'public/js'
}

//basic babel task
gulp.task('babel', function() {
  return gulp.src(paths.babel)
  .pipe(babel())
  .pipe(gulp.dest(paths.dest))
});

gulp.task('watch', function() {
  gulp.watch(paths.babel, ['babel']); 
})

gulp.task('default', ['bundle']);

gulp.task('connect', function() {connect.server();});

gulp.task('web', ['watch', 'connect']);
