var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var vulcanize = require('gulp-vulcanize');
var minifyInline = require('gulp-minify-inline');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var glob = require('glob');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var eventStream = require('event-stream');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');


function logError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('clean:build', function(done) {
  del(['build/**/*'], done);
});

gulp.task('clean:dist', function(done) {
  del(['dist/**/*'], done);
});

gulp.task('sass:build', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(changed('build/styles'))
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});
gulp.task('sass:dist', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(changed('dist/styles'))
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('assets:build', function() {
  return gulp.src('src/assets/**/*')
    .pipe(changed('build/assets'))
    .pipe(gulp.dest('build/assets'));
});
gulp.task('assets:dist', function() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('ts:build', function () {
  return tsProject.src()
    .pipe(ts(tsProject)).js
    .pipe(gulp.dest('build'));
});
gulp.task('ts:dist', function () {
  return tsProject.src()
    .pipe(ts(tsProject)).js
    .pipe(gulp.dest('dist'));
});

gulp.task('html:build', function() {
  return gulp.src('src/**/*.html')
    .pipe(changed('build'))
    .pipe(gulp.dest('build'));
});
gulp.task('html:dist', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('root:build', function() {
  return gulp.src(['src/*.*', '!src/*{.html,.ts}'])
    .pipe(changed('build'))
    .pipe(gulp.dest('build'));
});
gulp.task('root:dist', function() {
  return gulp.src(['src/*.*', '!src/*{.html,.ts}'])
    .pipe(gulp.dest('dist'));
});

gulp.task('bower:dist', function() {
  return gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.scss', ['sass:build']);
  gulp.watch('src/**/*.js', ['ts:build']);
  gulp.watch('src/**/*.html', ['html:build']);
  gulp.watch('src/assets/**/*', ['assets:build']);
  gulp.watch(['src/*.*', '!src/*.html'], ['root:build']);

  gulp.watch('build/**/*.html').on('change', browserSync.reload);
  gulp.watch('build/**/*.js').on('change', browserSync.reload);
  gulp.watch('build/assets/**/*').on('change', browserSync.reload);
});

gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

gulp.task('vulcanize', function() {
  /*
  return gulp.src(
      '',
      {base: './'})
    .pipe(vulcanize({
      stripExcludes: false,
      stripComments: true,
      inlineCss: true,
      inlineScripts: true,
      excludes: ['dist/bower_components/polymer/polymer.html']
    }))
    .pipe(minifyInline())
    .pipe(gulp.dest('.'));
  */
});

gulp.task('serve:build', function () {
  browserSync.init({
    port: 9000,
    server: {
      baseDir: 'build',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });
});
gulp.task('serve:dist', function () {
  browserSync.init({
    port: 9001,
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('default', function() {
  return runSequence(
    'clean:build',
    ['sass:build', 'ts:build', 'html:build',
      'assets:build', 'root:build'],
    'watch',
    'serve:build'
  );
});

gulp.task('build', function() {
  return runSequence(
    'clean:dist',
    ['sass:dist', 'ts:dist', 'html:dist',
      'assets:dist', 'root:dist', 'bower:dist'],
    'vulcanize'
  );
});
