var gulp = require('gulp');
var mocha = require('gulp-mocha');
var traceur = require('gulp-traceur');
var paths = {
  src: 'src/*.js',
  test: 'test/*.js',
  dist: 'dist'
};

gulp.task('compile', function () {
  return gulp
    .src(paths.src)
    .pipe(traceur())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test-src', ['compile'], function () {
  return gulp
    .src(paths.test, { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('default', function () {
  gulp
    .watch(paths.src, ['test-src']);
  gulp
    .watch(paths.test, ['test-src']);
});