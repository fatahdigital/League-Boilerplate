var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var concat = require('gulp-concat');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// gulp.task('concatScripts', function () {
//     gulp.src(['js/jquery-2.2.4.min.js', 
//               'js/plugins.js', 
//               'js/functions.js'
//               'revolution/js/jquery.themepunch.tools.min.js?rev=5.0',
//               'revolution/js/jquery.themepunch.revolution.min.js?rev=5.0',
//               'revolution/js/extensions/revolution.extension.video.min.js',
//               'revolution/js/extensions/revolution.extension.slideanims.min.js',
//               'revolution/js/extensions/revolution.extension.actions.min.js',
//               'revolution/js/extensions/revolution.extension.layeranimation.min.js',
//               'revolution/js/extensions/revolution.extension.kenburn.min.js',
//               'revolution/js/extensions/revolution.extension.navigation.min.js',
//               'revolution/js/extensions/revolution.extension.migration.min.js',
//               'revolution/js/extensions/revolution.extension.parallax.min.js'
//               ])
//     .pipe(concat("app.js"))
//     .pipe(gulp.dest("js"))
// });

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch(['*.index.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
