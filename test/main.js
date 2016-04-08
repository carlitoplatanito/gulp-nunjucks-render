'use strict';

var should = require('should');
var gutil = require('gulp-util');
var nunjucksRender = require('../');
var fs = require('fs');
var path = require('path');

require('mocha');

function getFile(filepath){
  return new gutil.File({
    base: 'test/fixtures',
    cwd: 'test',
    path: filepath,
    contents: fs.readFileSync('test/' + filepath)
  });
}

function getExpected(filepath){
  return fs.readFileSync('test/expected/' + filepath, 'utf8');
}


describe('gulp-nunjucks-render', function(){

  it('should render a html file', function(done){
    var stream = nunjucksRender();
    var expected = getExpected('hello-world.html');
    var file = getFile('fixtures/hello-world.nunj');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      path.extname(output.path).should.equal('.html');
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('should remove extension', function(done){
    var stream = nunjucksRender({
      ext: null
    });
    var file = getFile('fixtures/hello-world.nunj');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      path.extname(output.path).should.equal('');
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('accept global env as second argument', function(done){
    var stream = nunjucksRender({
      data: {
        html: '<strong>Hello World!</strong>',
      },
      envOptions: {
        autoescape: true
      }
    });
    var expected = getExpected('global.html');
    var file = getFile('fixtures/global.nunj');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      path.extname(output.path).should.equal('.html');
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });


  it('should use nunjucks environment to resolve paths', function(done){
    var stream = nunjucksRender({
      path: ['test/fixtures']
    });
    var expected = getExpected('child.html');
    var file = getFile('fixtures/child.nunj');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('should pass context data', function(done){
    var stream = nunjucksRender({data: {
      title: 'Overridden title'
    }});
    var expected = getExpected('overridden-title.html');
    var file = getFile('fixtures/hello-world.nunj');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('should use gulp-data', function(done){
    var stream = nunjucksRender();
    var expected = getExpected('overridden-title.html');
    var file = getFile('fixtures/hello-world.nunj');
    file.data = { title: 'Overridden title' };

    stream.once('data', function(output){
      should.exist(output);
      should.exist(output.contents);
      output.data.title.should.equal('Overridden title');
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('should merge gulp-data with context', function(done){
    var stream = nunjucksRender({data: {
      title: 'Title from context'
    }});
    var expected = getExpected('merge-data.html');
    var file = getFile('fixtures/merge-data.nunj');
    file.data = { title: 'Title from data', text: 'Some text' };

    stream.once('data', function(output){
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('should create a new data context for each template', function(done){
    var stream = nunjucksRender({
      path: 'test/fixtures'
    });
    var expected1 = getExpected('set.html');
    var expected2 = getExpected('hello-world.html');
    var file = getFile('fixtures/set.nunj');
    var file2 = getFile('fixtures/hello-world.nunj');

    stream.once('data', function(output){
      // First file
      should.exist(output);
      should.exist(output.contents);
      output.path.should.equal(path.normalize('fixtures/set.html'));
      output.contents.toString().should.equal(expected1);

      stream.once('data', function(output){
        // Second file
        should.exist(output);
        should.exist(output.contents);
        output.path.should.equal(path.normalize('fixtures/hello-world.html'));
        output.contents.toString().should.equal(expected2);
      });

      stream.write(file2);
      stream.end();
    });
    stream.on('finish', function(){
      done();
    });
    stream.write(file);

  });


  it('should throw an error', function(done) {
    var stream = nunjucksRender();
    var file = getFile('fixtures/import-error.nunj');

    var onerror = function(err) {
      should.exist(err);
      this.removeListener('finish', onfinish);
      done();
    };

    var onfinish = function() {
      done(new Error("Template has a syntax error which wasn't thrown."));
    };

    stream.on('error', onerror);
    stream.on('finish', onfinish);

    stream.write(file);
    stream.end();
  });

  it('error should contain file path', function(done) {
    var stream = nunjucksRender();
    var file = getFile('fixtures/import-error.nunj');

    var onerror = function(err) {
      should.exist(err);
      err.should.have.property('fileName');
      this.removeListener('finish', onfinish);
      done();
    };

    var onfinish = function() {
      done(new Error("Template has a syntax error which wasn't thrown."));
    };

    stream.on('error', onerror);
    stream.on('finish', onfinish);

    stream.write(file);
    stream.end();
  });

  it('should inherit extension if inheritExtension option is provided', function(done) {
    var stream = nunjucksRender({inheritExtension: true});
    var expected = getExpected('base.tpl');
    var file = getFile('fixtures/base.tpl');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      path.extname(output.path).should.equal('.tpl');
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('Can manipulate environment with hook', function(done) {
    var hook = function(environment) {
      environment.addFilter('defaultName', function(str, defName) {
        if (!str) {
          return (defName || 'John Doe').toUpperCase();
        }

        return str.toUpperCase();
      });

      environment.addGlobal('globalTitle', 'Test nunjucks project');
    };

    var stream = nunjucksRender({
      manageEnv: hook
    });

    var expected = getExpected('custom-filter.html');
    var file = getFile('fixtures/custom-filter.nunj');

    stream.once('data', function(output) {
      should.exist(output);
      should.exist(output.contents);
      output.contents.toString().should.equal(expected);
      done();
    });
    stream.write(file);
    stream.end();
  });

  it('should use custom default config', function(done){
    var customNunjucksRender = require('../');

    customNunjucksRender.setDefaults({
      envOptions: {
        autoescape: true
      }
    });

    var streamAutoescape = customNunjucksRender({
      data: {
        html: '<strong>Hello World!</strong>'
      }
    });

    var fileAutoescape = getFile('fixtures/global.nunj');
    var fileNotAutoescape = getFile('fixtures/global.nunj');
    var expectedAutoescape = getExpected('global.html');
    var expectedNotAutoescape = getExpected('global-not-excaped.html');

    streamAutoescape.once('data', function(output) {
      output.contents.toString().should.equal(expectedAutoescape);

      customNunjucksRender.setDefaults({
        envOptions: {
          autoescape: false
        }
      });

      var streamNotAutoescape = customNunjucksRender({
        data: {
          html: '<strong>Hello World!</strong>'
        }
      });

      streamNotAutoescape.once('data', function(output) {
        output.contents.toString().should.equal(expectedNotAutoescape);
        done();
      });
      streamNotAutoescape.write(fileNotAutoescape);
      streamNotAutoescape.end();
    });
    streamAutoescape.write(fileAutoescape);
    streamAutoescape.end();
  });
});
