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
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var glob = require('glob');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var eventStream = require('event-stream');


gulp.task('clean:build', function(done) {
  del(['build'], done);
});

gulp.task('clean:dist', function(done) {
  del(['dist'], done);
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

gulp.task('es6:build', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(changed('build'))
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});
gulp.task('es6:dist', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
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
  return gulp.src(['src/*.*', '!src/*.html'])
    .pipe(changed('build'))
    .pipe(gulp.dest('build'));
});
gulp.task('root:dist', function() {
  return gulp.src(['src/*.*', '!src/*.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('bower:dist', function() {
  return gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['es6']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/assets/**/*', ['assets']);
  gulp.watch(['src/*.*', '!src/*.html'], ['root']);

  gulp.watch('build/**/*.html').on('change', browserSync.reload);
  gulp.watch('build/**/*.js').on('change', browserSync.reload);
  gulp.watch('build/assets/**/*').on('change', browserSync.reload);
});

gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages({
      remoteUrl: 'git@github.com:mangakissa/mangakissa.github.io.git',
      branch: 'master'
    }));
});

gulp.task('vulcanize', function() {
  var mangaBrowser = gulp.src(
      'dist/elements/manga-browser/manga-browser.html',
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

  var mangaEntry = gulp.src(
      'dist/elements/manga-entry/manga-entry.html',
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

  var mangaReader = gulp.src(
      'dist/elements/manga-reader/manga-reader.html',
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

  return eventStream.concat(
    mangaBrowser, mangaEntry, mangaReader
  );
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
    ['sass:build', 'es6:build', 'html:build',
      'assets:build', 'root:build'],
    'watch',
    'serve:build'
  );
});

gulp.task('build', function() {
  return runSequence(
    'clean:dist',
    ['sass:dist', 'es6:dist', 'html:dist',
      'assets:dist', 'root:dist', 'bower:dist'],
    'vulcanize'
  );
});
