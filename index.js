var gulp = require('gulp'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    uglify = require('gulp-uglify'),
    _ = require('underscore'),
    elixir = require('laravel-elixir');

elixir.extend('babel', function (src, options) {

    var config = this,
        babelOpts,
        defaultOptions = {
            debug:         ! config.production,
            srcDir:        config.assetsDir + 'js',
            output:        config.jsOutput,
            sourceMaps: false
        };

    options = _.extend(defaultOptions, options);
    babelOpts = _.omit(options, ['srcDir', 'output', 'sourceMaps', 'debug']);

    new elixir.task('babel', function () {
        var onError = function(e) {
            new elixer.Notification().error(e, 'Babel Compilation Failed!');
            this.emit('end');
        };
        return gulp.src(src)
            .pipe(gulpIf(options.sourceMaps, sourcemaps.init()))
            .pipe(babel(babelOpts)).on('error', onError)
            .pipe(gulpIf(! options.debug, uglify()))
            .pipe(gulpIf(options.sourceMaps, sourcemaps.write()))
            .pipe(gulp.dest(options.output))
            .pipe(new elixer.Notification().message('Babel Compilation Finished!'));
    });

    this.registerWatcher('babel', options.srcDir + '/**/*.js');

    return this.queueTask('babel');

});
