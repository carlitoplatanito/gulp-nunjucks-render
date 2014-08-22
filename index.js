'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');

/*
 * turn off built-in file watcher
 * more info: https://github.com/carlosl/gulp-nunjucks-render/pull/2
 */
nunjucks.configure({ autoescape: true, watch: false });

module.exports = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-nunjucks', 'Streaming not supported'));
			return cb();
		}

		try {
			options.name = typeof options.name === 'function' && options.name(file) || file.relative;

			file.contents = new Buffer(nunjucks.renderString(file.contents.toString(), options));
			file.path = gutil.replaceExtension(file.path, '.html');

		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
		}

		this.push(file);
		cb();
	});
};
