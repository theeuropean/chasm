var gulp = require('gulp');
var mocha = require('gulp-mocha');
var traceur = require('gulp-traceur');
var paths = {
  src: 'src/*.js',
  unitTest: 'test/unit/*_test.js',
  systemTest: 'test/system/*_test.js',
  dist: 'dist'
};

gulp.task('compile', function () {
  return gulp
    .src(paths.src)
    .pipe(traceur())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('ut', ['compile'], function () {
  return gulp
    .src(paths.unitTest, { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('st', ['compile'], function () {
  return gulp
    .src(paths.systemTest, { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('default', function () {
  gulp
    .watch(paths.src, ['ut']);
  gulp
    .watch(paths.unitTest, ['ut']);
});