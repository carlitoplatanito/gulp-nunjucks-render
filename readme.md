# [gulp](https://github.com/wearefractal/gulp)-nunjucks-render

> Render [Nunjucks](http://jlongster.github.io/nunjucks/) templates

*Issues with the output should be reported on the Nunjucks [issue tracker](https://github.com/jlongster/nunjucks/issues).*


## Install

Install with [npm](https://npmjs.org/package/gulp-nunjucks)

```
npm install --save-dev gulp-nunjucks-render
```


## Example

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');

gulp.task('default', function () {
	nunjucksRender.nunjucks.configure(['src/templates/'], {watch: false});
	return gulp.src('src/templates/*.html')
		.pipe(nunjucksRender())
		.pipe(gulp.dest('dist'));
});
```

*Note: To keep Nunjucks render from eating up all your ram, make sure to specify your watch path. ```nunjucksRender.nunjucks.configure(['src/path/to/templates/'], {watch: false});``` This will also allow you to define your paths relatively.*


## Example with gulp data

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');

function getDataForFile(file){
    return {
        example: 'data loaded for ' + file.relative
    };
}

gulp.task('default', function () {
	nunjucksRender.nunjucks.configure(['src/templates/']);
	return gulp.src('src/templates/*.html')
	    .pipe(data(getDataForFile))
		.pipe(nunjucksRender())
		.pipe(gulp.dest('dist'));
});
```


## API

### nunjucks-render(context)

Same context as [`nunjucks.render()`](http://jlongster.github.io/nunjucks/api.html#render).

For example
```
nunjucksRender({css_path: 'http://company.com/css/'});
```

For the following template
```
<link rel="stylesheet" href="{{ css_path }}test.css" />
```

Would render
```
<link rel="stylesheet" href="http://company.com/css/test.css" />
```

### Watch mode
To prevent watch mode during gulp task use `watch` parameter:

```
nunjucksRender.nunjucks.configure([ './source' ], { watch: false });
```

## License

MIT © [Carlos G. Limardo](http://limardo.org)

## Shout-outs

[Sindre Sorhus](http://sindresorhus.com/) who wrote the original [gulp-nunjucks](https://www.npmjs.org/package/gulp-nunjucks) for precompiling Nunjucks templates. I updated his to render instead of precompile.

[kristijanhusak](http://github.com/kristijanhusak) for bug fixes and help with maintenance.
