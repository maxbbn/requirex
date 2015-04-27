R
========

require module with any version

- auto install and require package like foo@1.2.2
- auto resolve and update by npm tag, eg foo@latest


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