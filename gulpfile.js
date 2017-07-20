/**
 * Created by Administrator on 2017/6/23.
 */
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var revCollector = require('gulp-rev-collector');                 //路径替换
var plugins = require('gulp-load-plugins')();
var autoprefixer = require('gulp-autoprefixer');                  //添加前缀
var paths = {
    src: ['static/source/'],
    dest:['min/']
};

gulp.task('minify-js',function () {
    gulp.src([paths.src + 'js/*.js','static/source/js/!*.min.js'])
        .pipe(plugins.uglify())
      /*  .pipe(plugins.rename({suffix: '.min'}))*/
        .pipe(gulp.dest(paths.dest + '/js'));
   /* gulp.src(['min/min_js/main.js','min/min_js/!*.min.js'])
        .pipe(plugins.rename('main.min.js'))
        .pipe(gulp.dest('min/min_js'))*/
});
gulp.task('minify-css',function () {
    gulp.src(paths.src + 'csspre/*.css')
        .pipe(plugins.minifyCss())
       /* .pipe(plugins.rename({suffix: '.min'}))*/
        .pipe(gulp.dest(paths.dest + 'css'));
});
gulp.task('minify-html',function () {
    gulp.src('*.html')
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest(paths.dest + 'html'));
});
gulp.task('minify-img',function () {
    gulp.src(paths.src + 'img/*')
        .pipe(imagemin({
            progressive:true,
            use:[pngquant()]

            }))
        .pipe(gulp.dest(paths.dest + 'img'));
});

/*自动添加浏览器前缀*/

gulp.task('auto-prefix', function () {
    gulp.src('static/source/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: true
        }))
        .pipe(gulp.dest('static/source/csspre'));
});
/*gulp.task('auto-prefix', function () {
   /!* gulp.src(paths.src + 'css/!*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest(paths.dest + 'css-prefix'));*!/
    gulp.src('static/source/css/index1css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //输出到dist文件夹
        .pipe(gulp.dest('dist'));
});*/
gulp.task('concat', function () {
    gulp.src('js/*.js')  //要合并的文件
        .pipe(plugins.concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest('concat/js'));
});

//文件路径替换
gulp.task('rev', function() {
    gulp.src(['./rev/*.json', './application/**/header.php'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
});

/*gulp.watch('static/source/js/*.js', 'minify-js');
gulp.watch('static/source/css/*.css', 'minify-css');
gulp.watch('static/source/img/*', 'minify-img');
gulp.watch('*.html', 'minify-html');*/
/*监听函数*/
gulp.task('default',['minify-js','minify-css','minify-img','minify-html']);
gulp.task('watch',function () {
    gulp.watch(paths.src + 'js/*.js', function(){
        gulp.run('minify-js');
    });
    gulp.watch(paths.src + 'css/*.css', function(){
        gulp.run('minify-css');
    });
    gulp.watch(paths.src + 'img/*', function(){
        gulp.run('minify-img');
    });
    gulp.watch('*.html', function(){
        gulp.run('minify-html');
    });
});

/*
gulp.task('watch1', function() {
    gulp.watch('*.html', ['minify-html']);
});*/
