'use strict';
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
nunjucks.configure({ watch: false });

module.exports = function (options) {
    options = options || {};
    // ext = output file extension
    // Check if output file extension is mentioned or not
    if (!options.ext) {
        // Apply default output extension
        options.ext = '.html';
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
        nunjucks.renderString(file.contents.toString(), data, function (err, result) {
            if (err) {
                _this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
            }
            file.contents = new Buffer(result);
            // output file with the mentioned/default extension
            file.path = gutil.replaceExtension(file.path, options.ext);
            _this.push(file);
            cb();
        });
    });
};

module.exports.nunjucks = nunjucks;
