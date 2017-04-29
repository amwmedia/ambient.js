var gulp = require('gulp');
var task = require('gulp-load-plugins')();

gulp.task('default', ['min'], () => {
	gulp.watch(['src/**/*.js','!src/**/*.min.js'], ['min']);
});

gulp.task('min', () => {
	gulp.src(['src/**/*.js','!src/**/*.min.js'])
		.pipe(task.uglify({outSourceMap: false}))
		.pipe(task.rename(path => {
			path.extname = '.min.js';
		}))
		.pipe(gulp.dest('src'));
});