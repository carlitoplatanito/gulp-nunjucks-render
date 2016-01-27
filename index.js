'use strict';
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
nunjucks.configure({ watch: false });

module.exports = function (options, loaders, env ) {
    options = options || {};
    // ext = output file extension
    // Check if output file extension is mentioned or not
    if (options.ext === undefined) {
        // Apply default output extension
        options.ext = '.html';
    }

    var compile = nunjucks;
    if( loaders || env ){
        compile = new nunjucks.Environment( loaders, env );
    }

    /*
     * file = file
     * cb   = callback function
     */
    return through.obj(function (file, enc, cb) {

        var data = _.cloneDeep(options);

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.data) {
            data = _.merge(file.data, data);
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-nunjucks', 'Streaming not supported'));
            return cb();
        }

        var _this = this;

        var filePath = file.path;

        try {
            compile.renderString(file.contents.toString(), data, function (err, result) {
                if (err) {
                  _this.emit('error', new gutil.PluginError('gulp-nunjucks', err, {fileName: filePath}));
                  return cb();
                }
                file.contents = new Buffer(result);
                // Replace extension with mentioned/default extension
                // only if inherit extension flag is not provided(truthy)
                if (!options.inheritExtension) {
                  file.path = gutil.replaceExtension(filePath, options.ext);
                }
                _this.push(file);
                cb();
            });
        } catch (err) {
            _this.emit('error', new gutil.PluginError('gulp-nunjucks', err, {fileName: filePath}));
            cb();
        }
    });
};

module.exports.nunjucks = nunjucks;
