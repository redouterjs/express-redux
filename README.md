# express-redux

Adds a middleware that augments an existing express application with the ability to

* create a store
* dispatch and retrieve state from the store (via decorating the `res` object)
* get the set of actions that have been dispatched so far (also via the `res` object)

The middleware takes two arguments
* `storeCreator` - a function that should return a newly minted store. The function will receive `req, res` as arguments
* `renderFn` - (optional) a function that takes three arguments `store, req, res`, and should return a HTML output.

All functions are resolved as Promise-based.

Although this module is designed to work with redux and express, it really only requires some interfaces to work. Hence, it doesn't have any hard dependencies.

`express-redux` also decorates the `res` object with an additional capability, `reduxRender`.

* If `req.xhr` is true, then `reduxRender` renders a JSON representation of the dispatch queue.
* Otherwise, it runs the optional `renderFn` parameter and renders the output

## Usage

```
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
