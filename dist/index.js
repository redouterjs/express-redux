"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function (storeCreatorFn) {
	const actions = [];

	return (() => {
		var _ref = (0, _asyncToGenerator3.default)(function* (req, res, next) {
			try {
				// a fresh store is created each time
				const store = yield storeCreatorFn(req, res);

				res.getStore = function () {
					return store;
				};
				res.dispatch = function (action) {
					actions.push(action);
					store.dispatch(action);
				};
				res.getActions = function () {
					return [].concat(actions);
				};

				next();
			} catch (err) {
				next(err);
			}
		});

		return function (_x, _x2, _x3) {
			return _ref.apply(this, arguments);
		};
	})();
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }