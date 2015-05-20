R
========

require module with any version

- install npm module by version or tag
- required installed module
- keep modules up to date
- list install module and version
- module can access when when is updating

Install
-------

```sh
npm install requirex --save
````


How to use
-------

```js
var requirex = require('requirex');

requirex('xtemplate@3.3.3', function(err, xtemplate){
    console.log(xtemplate.version);
});
```

```
requirex.install('xtemplate@3.3.3', function(err, xtemplate){
    console.log(xtemplate.version);
});
```

```
requirex.update('xtemplate@3.3.3', function(err, xtemplate){
    console.log(xtemplate.version);
});
```

API
---


### requirex(module, [options, ]callback);
require a module

### requirex.config(options);
config requirex defaults;

### options

- `root` string, path to install npm module to
- `npm` string,  npm client to use
- `registry`, npm registry to resolve modules