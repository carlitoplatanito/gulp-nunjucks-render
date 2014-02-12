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
	gulp.src('templates/list.html')
		.pipe(nunjucksRender())
		.pipe(gulp.dest('dist'));
});
```

## API

### nunjucks-render(context)

Same context as [`nunjucks.render()`](http://jlongster.github.io/nunjucks/api.html#precompile).

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

## License

MIT © [Carlos G. Limardo](http://limardo.org)
