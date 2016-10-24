# express-redux

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

Adds a middleware that augments an existing express application with the ability to

* create a store
* dispatch and retrieve state from the store (via decorating the `res` object)
* get the set of actions that have been dispatched so far (also via the `res` object)

The middleware takes two arguments
* `storeCreator` - a function that should return a newly minted store. The function will receive `req, res` as arguments
* `renderFn` - (optional) a function that takes three arguments `store, req, res`, and should return an HTML output string.

All functions are resolved as Promises, and therefore can be either synchronous or async.

Although this module is designed to work with redux and express, it really only requires some interfaces to work. Hence, it doesn't have any hard dependencies.

## reduxRender

`express-redux` also decorates the `res` object with an additional capability, `reduxRender`.

* If `req.xhr` is true, then `reduxRender` renders a JSON representation of the dispatch queue.
* Otherwise, it runs the optional `renderFn` parameter and renders the output

Note that `req.xhr` is only set if the header
```
X-Requested-With: XMLHttpRequest
```
is present.

## Usage

```js
  import expressRedux from 'express-redux';
  import { createStore } from 'redux';

  const app = express();
  const rootReducer = state => state; // for illustrative purposes

  const storeCreator = (req, res) => {
  	// do something with req, res if you need to
  	return createStore(rootReducer, ...middlewares);
  }

  app.use(expressRedux(storeCreator));

  app.get('/index', (req, res) => {
  	res.dispatch({ type: 'SOMETHING', ...});
  	const lastAction = res.getActions().shift();
  	assert(lastAction.type === 'SOMETHING');
  	assert(res.getActions().length, 2); // getActions() returns a shallow copy
  	res.render('something', res.getStore().getState());
  });
```

[npm-image]: https://badge.fury.io/js/express-redux.svg
[npm-url]: https://npmjs.org/package/express-redux
[travis-image]: https://travis-ci.org/redouterjs/express-redux.svg?branch=master
[travis-url]: https://travis-ci.org/redouterjs/express-redux
[daviddm-image]: https://david-dm.org/redouterjs/express-redux.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/redouterjs/express-redux
