'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var gutil = require('gulp-util');
var through = require('through2');
var nunjucks = require('nunjucks');
var fm = require('front-matter');
var md = require('marked');

var defaults = {
    path: '.',
    ext: '.html',
    data: {},
    block: 'content',
    marked: null,
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
    var data = {};
    if (_.isObject(options.data)) {
        data = _.cloneDeep(options.data);
    } else if (_.isString(options.data)) {
        data = JSON.parse(fs.readFileSync(path.join(__dirname, options.data)));
    }

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

    var frontmatter = fm(file.contents.toString());
    if(!_.isEmpty(frontmatter.attributes)) {
        var ext = path.extname(file.path);

        if(ext === '.md' || ext === '.markdown' || ext === '.mdown') {
            md.setOptions(options.marked);
            frontmatter.body = md(frontmatter.body);
        }

        _.merge(data, { page: frontmatter.attributes } );
        if(data.page.layout){
          file.contents = new Buffer('\{% extends \"' + data.page.layout + '.njk\" %\}\n\{% block ' +  options.block + ' %\}' + frontmatter.body + '\n\{% endblock %\}');
        } else {
          this.emit('error', new gutil.PluginError('gulp-nunjucks', 'Layout not declared in front-matter'));
        }
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
