import test from 'ava';
import express from 'express';
import { createStore } from 'redux';
import expressRedux from '../src';
import request from 'supertest-as-promised';

async function orchestrateTest(storeCreator, assertions, t) {
	const app = express();
	app.use(expressRedux(storeCreator));
	app.get('/test', (req, res) => {
		try {
			assertions(t, req, res);
			t.pass();
			res.end();
		} catch (err) {
			console.error(err);
			t.fail();
			res.end();
		}
	});

	await request(app).get('/test');
}

test('API', async t => {
	
	const storeCreator = () => createStore(state => state);

	await orchestrateTest(storeCreator, (t, req, res) => {
		t.is(typeof res.getStore, 'function');
		t.is(typeof res.dispatch, 'function');
		t.is(typeof res.getActions, 'function');
	}, t);
});

test('store creator has access to req, res', async t => {

	const storeCreator = req => createStore(state => state, { url: req.originalUrl });
	await orchestrateTest(storeCreator, (t, req, res) => {
		const state = res.getStore().getState();
		t.is(state.url, req.originalUrl);
	}, t);

});

test('dispatch queue is present', async t => {

	const storeCreator = () => createStore(state => state);

	await orchestrateTest(storeCreator, (t, req, res) => {
		res.dispatch({ type: 'HELLO' });
		res.dispatch({ type: 'WORLD' });
		const actions = res.getActions();
		t.is(actions.length, 2);
		t.is(actions[0].type, 'HELLO');
		t.is(actions[1].type, 'WORLD');
	}, t);

});

test('actions are correctly dispatched', async t => {

	const storeCreator = () => createStore((state = {}, action) => {
		switch (action.type) {
			case 'ONE': return { one: 1};
			case 'TWO': return { two: 2};
		}
		return state;
	});

	await orchestrateTest(storeCreator, (t, req, res) => {
		const store = res.getStore();
		res.dispatch({ type: 'ONE' });
		t.is(store.getState().one, 1);
		res.dispatch({ type: 'TWO' });
		t.is(store.getState().two, 2);
	}, t);

});
