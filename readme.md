[![Build Status](https://travis-ci.org/carlosl/gulp-nunjucks-render.svg?branch=master)](https://travis-ci.org/carlosl/gulp-nunjucks-render)

# [gulp](https://github.com/wearefractal/gulp)-nunjucks-render

> Render [Nunjucks](http://jlongster.github.io/nunjucks/) templates

*Issues with the output should be reported on the Nunjucks [issue tracker](https://github.com/jlongster/nunjucks/issues).*


## Install

Install with [npm](https://www.npmjs.com/package/gulp-nunjucks-render)

```
npm install --save-dev gulp-nunjucks-render
```


## Example

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');

gulp.task('default', function () {
  return gulp.src('src/templates/*.html')
    .pipe(nunjucksRender({
      path: ['src/templates/'] // String or Array
    }))
    .pipe(gulp.dest('dist'));
});
```

## Example with gulp data

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');

function getDataForFile(file) {
  return {
    example: 'data loaded for ' + file.relative
  };
}

gulp.task('default', function () {
	return gulp.src('src/templates/*.html')
    .pipe(data(getDataForFile))
    .pipe(nunjucksRender({
      path: 'src/templates'
    }))
    .pipe(gulp.dest('dist'));
});
```


## API

## Options
Plugin accepts options object, which contain these by default:

```js
var defaults = {
  path: '.',
  ext: '.html',
  data: {},
  inheritExtension: false,
  envOptions: {
    watch: false
  },
  manageEnv: null,
  loaders: null
};
```

* `path` - Relative path to templates
* `ext` - Extension for compiled templates, pass null or empty string if yo don't want any extension
* `data` - Data passed to template
* `inheritExtension` - If true, uses same extension that is used for template
* `envOptions` - These are options provided for nunjucks Environment. More info [here](https://mozilla.github.io/nunjucks/api.html#configure).
* `manageEnv` - Hook for managing environment before compilation. Useful for adding custom filters, globals, etc. Example [below](#environment)
* `loaders` - If provided, uses that as first parameter to Environment constructor. Otherwise, uses provided `path`. More info [here](https://mozilla.github.io/nunjucks/api.html#environment)

For more info about nunjucks functionality, check [https://mozilla.github.io/nunjucks/api.html](https://mozilla.github.io/nunjucks/api.html) and also a source code of this plugin.


### Data
U can pass data as option, or you can use gulp-data like in example above.

```js
nunjucksRender({data: {
  css_path: 'http://company.com/css/'
}});
```

For the following template
```html
<link rel="stylesheet" href="{{ css_path }}test.css" />
```

Would render
```html
<link rel="stylesheet" href="http://company.com/css/test.css" />
```

### Environment

If you want to manage environment (add custom filters or globals), you can to that with `manageEnv` function hook:

```javascript
var manageEnvironment = function(environment) {
  environment.addFilter('slug', function(str) {
    return str && str.replace(/\s/g, '-', str).toLowerCase();
  });

  environment.addGlobal('globalTitle', 'My global title')
}

nunjucksRender({
  manageEnv: manageEnvironment
}):
```

After adding that, you can use them in template like this:

```html
<h1>{{ globalTitle }}</h1>
<h3>{{ 'My important post'|slug }}</h3>
```

And get this result:

```html
<h1>My global title</h1>
<h3>my-important-post</h3>
```

## License

MIT © [Carlos G. Limardo](http://limardo.org) and [Kristijan Husak](http://kristijanhusak.com)

## Shout-outs

[Sindre Sorhus](http://sindresorhus.com/) who wrote the original [gulp-nunjucks](https://www.npmjs.org/package/gulp-nunjucks) for precompiling Nunjucks templates. I updated his to render instead of precompile.

[kristijanhusak](http://github.com/kristijanhusak) for bug fixes and help with maintenance.
