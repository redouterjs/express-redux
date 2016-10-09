# express-redux

Adds a middleware that augments an existing express application with the ability to

* create a store
* dispatch and retrieve state from the store
* get the set of actions that have been dispatched so far

Although this module is designed to work with redux and express, it really only requires some interfaces to work. Hence, it doesn't have any hard dependencies.

## Usage

```
  import expressRedux from 'expressRedux';
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