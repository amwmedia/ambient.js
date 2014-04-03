var gulp = require('gulp');
var task = require('gulp-load-tasks')();

gulp.task('default', function(){
	gulp.watch('src/*.js', ['min']);
});

gulp.task('min', function(){
	gulp.src('src/**/*.js')
		.pipe(task.uglify({outSourceMap: false}))
		.pipe(gulp.dest('min'));
});