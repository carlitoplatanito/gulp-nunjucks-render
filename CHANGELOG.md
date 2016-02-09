# 2.0.0
* *BC* - provide path to templates as `path` option instead of `nunjucks.configure` ([https://github.com/carlosl/gulp-nunjucks-render#example](https://github.com/carlosl/gulp-nunjucks-render#example))
* *BC* - Data for the template now needs to be provided through options as `data` key ([https://github.com/carlosl/gulp-nunjucks-render#data](https://github.com/carlosl/gulp-nunjucks-render#data))
* Add option to manipulate Environment with `manageEnv` hook ([https://github.com/carlosl/gulp-nunjucks-render#environment](https://github.com/carlosl/gulp-nunjucks-render#environment))

# 1.1.10
* Check if `ext` option is undefined to allow passing no extension (#29)
* Add `inheritExtension` option to allow using same extension after compilation(#33)

# 1.1.0
* Update nunjucks to 2.0 and allow mocha to run on Windows (#31)

# 1.0
* Update nunjucks lib to allows for latest version 1.2.0+ (#23)
* Prevent gulp watch from crashing when error occurs (#17)
* Fixed Variables bleed between templates (#15)
* Fix gulp never terminating on node 0.12 & nunjucks 1.2.0+ (#20)
* Added Gulp data support (#14)
* Added inline comments and updated readme (#26, #22)
