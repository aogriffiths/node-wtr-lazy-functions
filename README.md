```
                                 .("""")                                      (j)
                               (_(_ __(_ )                                 (n o d e)
 _ _ _       _                   / / /                       (n)              (s)
 ))`)`) ___  )L __ __           / / /           n            \|/              \|/
((,(,' ((_( (( (('(|             n             \|/            |                |
```

Lazy
====

Preamble
--------

[Node water](https://github.com/aogriffiths/node-wtr) to grow your node.js project 
with less effort. 

This library is for Victor Tugelbend (and lazy people like him) for whom "Having to haul 
arround extra poundage \[is\] far too much effort, so he saw to it that he never put it 
on and he kept himself in trim becuase doing things with decent muscles was far less 
effort than trying to achive things with bags of flab". [Pratchett, T](#pratchett2009moving)

So What Does it Do?!
--------------------

Povides asynchronous control flow wrappers designed to read naturally, using 
Caolan McMahon excellent [async](https://github.com/caolan/async)  library under 
the bonnet.

Install
-------

```bash
npm install lazy-functions
```
See also [lazy-functions](https://npmjs.org/package/lazy-functions) on npmjs.org.

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

Credits
=======
 
* John Resig - http://ejohn.org/blog/partial-functions-in-javascript/
* Caolan McMahon - https://github.com/caolan/async

References
==========

<a id="pratchett2009moving" name="pratchett2009moving"></a>Moving Pictures

```latex
@book{pratchett2009moving,
  title={Moving Pictures: (Discworld Novel 10)},
  author={Pratchett, T.},
  isbn={9781407034737},
  series={Discworld Novels},
  url={http://books.google.co.uk/books?id=gDnb8AlIMAUC},
  year={2009},
  publisher={Transworld}
}
```