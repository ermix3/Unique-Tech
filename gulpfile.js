// list dependences
const gulp = require('gulp');
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');


// html task
function compilePug() {
    return src('src/*.pug')
        .pipe(pug())
        .pipe(dest('dist'))
        .pipe(notify('html done'))
        .pipe(livereload());
}

// css task
function compileCSS() {
    return src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(prefix('last 2 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css'))
        .pipe(notify('css done'))
        .pipe(livereload());
}

// js task
function compileJs() {
    return src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/js'))
        .pipe(notify('js done'))
        .pipe(livereload());
}

// image
function imageMin() {
    return src('src/images/*.{jpg,png}')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality: 80, progressive: true }),
            imagemin.optipng({ optimizationLevel: 2 })
        ]))
        .pipe(dest('dist/images'));
}

// webp images
function imageWebp() {
    return src('dist/images/*.{jpg,png}')
        .pipe(imagewebp())
        .pipe(dest('dist/images'));
}

// create watch task
function watchTask() {
    require('./server.js');
    livereload.listen();
    watch('src/*.pug', compilePug);
    watch('src/scss/*.scss', compileCSS);
    watch('src/js/*.js', compileJs);
    watch('src/images/*.{jpg,png}', imageMin);
    watch('dist/images/*.{jpg,png}', imageWebp);
}

// create default gulp task
exports.default = series(compilePug, compileCSS, compileJs, imageMin, imageWebp, watchTask);