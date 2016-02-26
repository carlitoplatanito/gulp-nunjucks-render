'use strict';
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');

var defaults = {
    path: '.',
    ext: '.html',
    data: {},
    inheritExtension: false,
    envOptions: {
      watch: false
    },
    manageEnv: null
};

module.exports = function (options) {
  options = _.defaultsDeep(options || {}, defaults);
  nunjucks.configure(options.envOptions);

  if (!options.loaders) {
    options.loaders = new nunjucks.FileSystemLoader(options.path);
  }

  var compile = new nunjucks.Environment(options.loaders, options.envOptions);

  if (_.isFunction(options.manageEnv)) {
    options.manageEnv.call(null, compile);
  }

  /*
   * file = file
   * cb   = callback function
   */
  return through.obj(function(file, enc, cb) {
    var data = _.cloneDeep(options.data);

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

module.exports.setDefaults = function (options) {
  defaults = _.defaultsDeep(options || {}, defaults);
};

module.exports.nunjucks = nunjucks;
