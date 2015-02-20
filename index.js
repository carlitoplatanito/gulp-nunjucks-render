'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
var data = require('gulp-data');

module.exports = function (options) {
	options = options || {};

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

		
		options.name = typeof options.name === 'function' && options.name(file) || file.relative;
		var _this = this;
		nunjucks.renderString(file.contents.toString(), options, function (err, result) {
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
