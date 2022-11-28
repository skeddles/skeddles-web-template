var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

//██████████ GULP PLUGINS ███████████████

var gutil = require('gulp-util');
var uglifyjs = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyjs, console);
var sourcemaps = require('gulp-sourcemaps');
var include = require('gulp-include');
var sass = require('gulp-sass')(require('sass'));
var handlebars = require('gulp-hb');
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var through = require('through2');


//████████████████████████████████████████████████████████████████████████████████
//██████████████████████████████ ENVIRONMENT █████████████████████████████████████
//████████████████████████████████████████████████████████████████████████████████

const LIVE = process.env.LIVE;
console.log('ENV:',LIVE?'live':'dev');
const environments = require('gulp-environments');
const liveOnly = environments.make('live');
environments.current(LIVE?'live':'dev');
const cssStyle = 'compressed';

//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ TASKS █████████████████████████████████████████
//████████████████████████████████████████████████████████████████████████████████

//html task - copies html files
gulp.task("files", function () {
	return gulp.src('files/**/*.*')
		.pipe(gulp.dest("./build"));
});
 
//js task - combines and minimizes js files in /scripts directory
gulp.task("js", function() {
	return gulp.src(['js/*.js','!js/_*.js'])

		.pipe(include({includePaths: ['js']})).on('error', console.log)
		//.pipe(sourcemaps.init())
		.pipe(liveOnly(uglify({compress: {drop_console: true }}))).on('error', console.log)
		//.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest("./build"));
});

//css task - processes sass and minimizes scss files in /sass directory
gulp.task("css", function() {
	return gulp.src(['css/*.scss','!css/_*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: cssStyle}).on('error', sass.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest("./build"));
});

//img project task - minimizes gif,png,jpg,svg files for projects - in /img
gulp.task("image", function() {
	return gulp.src('images/**/*.*')
		//minify
		.pipe(imagemin())
		//out
		.pipe(gulp.dest('build/images'));
});


//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ WATCHER / MASTER ██████████████████████████████
//████████████████████████████████████████████████████████████████████████████████


//the one task to rule them all
gulp.task('default',
	gulp.series(
		'files',
		'css',
		'image',
		'js'
	)
);

//start watchers
gulp.task('watch', function(){

	console.log('\n███ STARTING WATCH ██████████████████████\n\n');

    //watch scripts folder for changes in any files
    gulp.watch(['files/**/*.*'], gulp.series('files'));

    //watch scripts folder for changes in any files
    gulp.watch(['js/**/*.js*'], gulp.series('js'));

    //watch sass folder for changes in any files 
    gulp.watch(['css/**/*.scss'], gulp.series('css'));

    //watch image folder for changes in any files 
    gulp.watch(['images/**/*.*'], gulp.series('image'));


});

/*global done*/