var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('gulp4-run-sequence');

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './app'
    },
  });
});

gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

gulp.task('watch', gulp.parallel('browserSync', 'sass', function () {
  gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('app/js/**/*.js', gulp.series('js'));
  gulp.watch('app/*.html', browserSync.reload);
  // Other watchers
}));

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'js', 'useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('default', function (callback) {
  runSequence([
      ['sass', 'js', 'useref', 'images', 'fonts'], 'sass', 'browserSync', 'watch'
    ],
    callback
  );
});

// gulp.task('default', gulp.series('sass', 'browserSync', 'watch'));