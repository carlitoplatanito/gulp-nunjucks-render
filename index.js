'use strict';
var gutil = require('gulp-util');
var lodash = require('lodash');
var through = require('through2');
var nunjucks = require('nunjucks');
var data = require('gulp-data');

module.exports = function (options) {
	options = options || {};
    var data = options.data || options;

	return through.obj(function (file, enc, cb) {

		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.data) {
  			//options = file.data;
  			//custom objext.index for prototype
  			options = file.data.results[0];
  			//custom gulp log messages
  			var fileName = file.path.toString();
  			gutil.log('views | loaded gulp data for ' + fileName.split('/').pop());
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-nunjucks', 'Streaming not supported'));
			return cb();
		}

        if (file.data) {
            data = _.extend(file.data, data);
        }

		try {
			options.name = typeof options.name === 'function' && options.name(file) || file.relative;

			file.contents = new Buffer(nunjucks.renderString(file.contents.toString(), data));
			file.path = gutil.replaceExtension(file.path, '.html');

		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
		}

		this.push(file);
		cb();
	});
};

module.exports.nunjucks = nunjucks;
