const gulp = require('gulp');

const sass         = require('gulp-sass')(require('sass')); // Предпроцессор sass и scss
const cleanCSS     = require('gulp-clean-css');             // Минификация css
const browserSync  = require('browser-sync').create();      // Веб-сервер
const babel        = require('gulp-babel');                 // Транскомпилятор js
const uglify       = require('gulp-uglify');                // Минификация js
const autoprefixer = require('gulp-autoprefixer');          // Расстановка префиксов
const concat       = require('gulp-concat');                // Конкатенация файлов в один
const rename       = require('gulp-rename');                // Переименование файлов
const sourcemaps   = require('gulp-sourcemaps');            // Карта файлов
const imagemin     = require('gulp-imagemin');              // Оптимизация изображений
const newer        = require('gulp-newer');                 // Оптимизация только новых изображений
const size         = require('gulp-size');                  // Отображение размера файлов
const del          = require('del');                        // Удаление старых файлов

// Пути
const srcFloder = 'src/';
const distFloder = 'dist/';
const paths = {
  html: {
    src: `${srcFloder}*.html`,
    dest: `${distFloder}`
  },
  styles: {
    src: [`${srcFloder}scss/**/*.scss`, `${srcFloder}scss/**/*.sass`],
    dest: `${distFloder}styles/`
  },
  scripts: {
    src: `${srcFloder}scripts/**/*.js`,
    dest: `${distFloder}scripts/`
  },
  images: {
    src: `${srcFloder}images/**`,
    dest: `${distFloder}images/`
  }
}

// Удаление файлов
function clean() {
  return del([`${distFloder}*`, `!${distFloder}images`])
}

// Сборка html
function html() {
  return gulp.src(paths.html.src)
    .pipe(size())
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}

// Сжатие изображение
function images() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(size())
    .pipe(gulp.dest(paths.images.dest))
}

// Сборка скриптов
function scripts() {
  return gulp.src(paths.scripts.src)
  // 'node_modules/jquery/dist/jquery.js', - пример подключения плагина, JQ зло
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

// Сборка стилей
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 version'],
      grid: true,
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename(function(path) {
      if(path.basename == 'main') {
        path.basename = 'style' + '.min';
      }
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(gulp.dest(`${srcFloder}styles/`))
    .pipe(browserSync.stream())
}

// Сборка папки resources
function resources() {
  return gulp.src(`${srcFloder}resources/**`)
    .pipe(size())
    .pipe(gulp.dest(`${distFloder}resources/`))
    .pipe(browserSync.stream())
}

// Настройка gulp watch
function watch() {
  browserSync.init({
    server: {
      baseDir: `${distFloder}`
    }
  });
  gulp.watch(paths.html.dest).on('change', browserSync.reload);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(`${distFloder}resources/`, scripts);
}

// Настройка gulp build
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, images, resources), watch);

exports.clean = clean;
exports.html = html;
exports.images = images;
exports.scripts = scripts;
exports.styles = styles;
exports.resources = resources;
exports.watch = watch;

exports.build = build;
exports.default = build;
