'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');

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

			nunjucks.configure(file.cwd, { watch: false });
			file.contents = new Buffer(nunjucks.renderString(file.contents.toString(), options));
			file.path = gutil.replaceExtension(file.path, '.html');

		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-nunjucks', err));
		}

		this.push(file);
		cb();
	});
};

module.exports.nunjucks = nunjucks;
