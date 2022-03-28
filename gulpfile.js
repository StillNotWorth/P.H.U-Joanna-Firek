const { src, dest, series, parallel, watch } = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const kit = require('gulp-kit');
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
  dist: './dist',
	saasDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
}

function buildStyles() {
	return gulp
		.src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.saasDest))
	done()
}

function javaScript(done) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.jsDest))
	done()
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	})

	done()
}

function convertImage(done) {
	src(paths.img).pipe(imagemin()).pipe(gulp.dest(paths.imgDest))
	done()
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload)
	watch([paths.html, paths.sass, paths.js], parallel(handleKits, buildStyles, javaScript)).on('change', reload)
	watch(paths.img, convertImage).on('change', reload)
	done()
}

function cleanStuff(done) {
	src(paths.dist, {read: false})
  .pipe(clean());  
  done()
  //używać opcjonalnie w celu usunięcia jakichś plików z dist: src(usuwamy coś) => dist - również się usunie ale dopiero po wpisaniu gulp cleanStuff
}


function handleKits(done) {
	src(paths.html)
  .pipe(kit())
  .pipe(gulp.dest('./'))
	done()
}



const mainFunctions = parallel(handleKits, buildStyles, javaScript, convertImage)
exports.cleanStuff = cleanStuff
exports.default = series(mainFunctions, startBrowserSync, watchForChanges)
