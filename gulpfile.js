/**
 * @description: gulp配置文件
 * @author: guang.shi <https://blog.csdn.net/guang_s> 
 * @date: 2019-05-07 16:42:38 
 */
'use strict';

var gulp = require('gulp');
var csso = require('gulp-csso');            // css压缩
var less = require('gulp-less');	        // less编译
var autoprefixer = require('gulp-autoprefixer');	// 自动添加CSS前缀
var concat = require('gulp-concat');        // 合并文件
var clean = require('gulp-clean');          // 清空文件夹
var browserSync = require('browser-sync').create();	    // 用来打开一个浏览器

gulp.task('style', function(){
    return gulp.src('src/index.less')
        .pipe(less())                   // 编译less
        .on('error', function(err) {    // 解决编译出错，监听被阻断的问题
            console.log('Less Error!', err.message);
            this.end();
        })
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false      // 是否美化
        }))
        .pipe(concat('common.css'))
        .pipe(gulp.dest('dist/'))
        .pipe(csso())
        .pipe(concat('common.min.css'))
        .pipe(gulp.dest('dist/'));
});

// 清空dist文件夹
gulp.task('clean', function(){
	return gulp.src(['dist/*'])
		.pipe(clean());
});

// 启本地服务，并打开浏览器
gulp.task('browser', function(){
	browserSync.init({
        server: './'    // 访问目录，自动指向该目录下的 index.html 文件
    });
});

// 监听文件变化
gulp.task('watch', function () {
    gulp.watch('index.html').on('change', browserSync.reload);
    gulp.watch('src/*.less', ['style']).on('change', browserSync.reload);
});

// 开发环境
gulp.task('dev', ['clean'], function() {
    gulp.start(['style', 'browser', 'watch']);
});

// 生产环境
gulp.task('build', ['clean'], function() {
    gulp.start(['style']);
});
