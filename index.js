'use strict';
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
nunjucks.configure({ watch: false });

module.exports = function (options) {
    options = options || {};
    if (!options.ext) {
        options.ext = '.html';
    }

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
        try {
          nunjucks.renderString(file.contents.toString(), data, function (err, result) {
            if (err) {
              _this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
              return cb();
            }
            file.contents = new Buffer(result);
            file.path = gutil.replaceExtension(file.path, options.ext);
            _this.push(file);
            cb();
          });
        } catch (err) {
          _this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
          cb();
        }
    });
};

module.exports.nunjucks = nunjucks;
