node-wrt-lazy
=============

A lazy library that helps you do node.js with less effort. It povides asynchronous control flow 
wrappers designed to read naturally, using Caolan McMahon excellent [async](https://github.com/caolan/async) 
library under the bonnet.

Install
-------

From npm (https://npmjs.org/package/lazy-functions)

'''bash
npm install lazy-functions
'''

Concepts
--------

There are two common node.js conventions followed. Firstly an asynchronous function has the 
following signature:

```js
async_func([ags]*, callback);
```

If you execute the function with the correct number of arguments the result of it's 
execution are returned using the callback. A callback function has the following signature:

```js
callback(err, data)
```

Where:
* `err` contains a value only if an error has occured. Otherwise it is `null`.
* `data` contains any results and may be `null` or `undefined`.

Most asyncrhonous node.js code follows these conventions but not all. You wil need to watch
out for those that don't follow the convention, for example:

* [async.auto](https://github.com/caolan/async#auto) calls asynchronous functions with func(callback, results).
* [fs.exists](http://nodejs.org/api/fs.html#fs_fs_exists_path_callback) calls it's callback callback(exisits) with no err argument. 

Both have good reasons for being like this but it means 
