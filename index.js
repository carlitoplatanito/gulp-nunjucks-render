'use strict';
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');

module.exports = function (options) {
    options = options || {};

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
            file.path = gutil.replaceExtension(file.path, '.html');
            _this.push(file);
            cb();
        });
    });
};

module.exports.nunjucks = nunjucks;
