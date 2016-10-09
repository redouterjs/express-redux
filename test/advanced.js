import test from 'ava';
import express from 'express';
import { createStore } from 'redux';
import expressRedux from '../src';
import request from 'supertest-as-promised';

test('renders JSON for XHR requests', async t => {
	const app = express();
	const storeCreator = () => createStore(state => state);
	app.use(expressRedux(storeCreator));
	app.get('/test', (req, res) => {
		res.dispatch({ type: 'ONE'});
		res.dispatch({ type: 'TWO'});
		res.reduxRender();
	});

	const res = await request(app)
		.get('/test')
		.set('X-Requested-With', 'XMLHttpRequest')
		.expect(200);

	t.truthy(Array.isArray(res.body));
	t.deepEqual(res.body[0], { type: 'ONE' });
	t.deepEqual(res.body[1], { type: 'TWO' });

	t.pass();
});

test('renders HTML', async t => {
	const app = express();
	const storeCreator = () => createStore((state = {}, action) => {
		switch (action.type) {
			case 'ONE': return { one: 1};
			case 'TWO': return { two: 2};
		}
		return state;
	});
	const renderer = store => {
		return `<div id="one">${store.getState().one}</div><div id="two">${store.getState().two}</div>`;
	}
	app.use(expressRedux(storeCreator, renderer));
	app.get('/test', (req, res) => {
		res.dispatch({ type: 'ONE'});
		res.dispatch({ type: 'TWO'});
		res.reduxRender();
	});

	const res = await request(app)
		.get('/test')
		.expect(200);

	t.truthy(res.text);
	t.is(res.text, '<div id="one">undefined</div><div id="two">2</div>');

	t.pass();

})