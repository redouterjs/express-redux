// "app" should be an express app
export default function (storeCreatorFn, renderFn = () => '') {
	const actions = [];

	return async (req, res, next) => {
		try {
			// a fresh store is created each time
			const store = await storeCreatorFn(req, res);

			res.getStore = () => store;
			res.dispatch = action => {
				actions.push(action);
				store.dispatch(action);
			}
			res.getActions = () => [...actions];
			res.reduxRender = async () => {
				if (req.xhr) {
					// if it is an XMLHttpRequest then we
					// return a JSON containing all the actions
					res.json(actions);
				} else {
					const html = await renderFn(store, req, res);
					res.status(200).send(html);
				}
			}

			return next();
		} catch (err) {
			return next(err);
		}
	};
}