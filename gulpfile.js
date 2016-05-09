// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var uglifyCSS = require('gulp-uglifycss');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var combineMq = require('gulp-combine-mq');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

// Serve
gulp.task('serve', function() {
  gulp.watch(["app/**/*.html", "app/css/**/*.css", "app/js/**/*.js"]).on('change', browserSync.reload);
  gulp.watch('app/scss/**/*.scss', ['sass']);

  browserSync.init({
    server: {
        baseDir: "./app/"
    }
  });
});

// Generate Production Assets
gulp.task('dist', function() {
  // Delete old files
  del.sync(['./dist/**']);

  // Copy over HTML files
  gulp.src('./**/*.html')
    .pipe(gulp.dest('./dist'));

  // Copy over image files
  gulp.src('./img/**')
    .pipe(gulp.dest('./dist/img'));

  // Copy font files
  gulp.src('./fonts/**')
    .pipe(gulp.dest('./dist/fonts'));

  // Prepare CSS for Production
  gulp.src('app/css/**/*.css')
    .pipe(combineMq({
      beautify: false
    }))
    .pipe(uglifyCSS({
      "max-line-len": 80
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'));
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src('app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Sass and Autoprefix Styles
gulp.task('sass', function() {
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };

  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('app/js/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('app/js/*.js', ['lint', 'scripts']);
  gulp.watch('app/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);