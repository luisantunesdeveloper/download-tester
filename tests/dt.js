'use strict';

const test = require('tape').test;
const dt = require('../core').dt;
const proxyquire = require('proxyquire');
const eventEmitter = require('events').EventEmitter;

const req = {
	options: {
		url: 'http://www.textfiles.com/fun/acronym.txt'
	},
	numberOfRequests: 1
};

const reqs = [req];

const execute = (reqs) => {
	let emitters = {};
	const emitter = new eventEmitter()
	emitters[req.options.url] = emitter;
	setTimeout(() => {
		emitter.emit('response', {reqNumber: 1, args: req1, response: null, stream: null});
	}, 0);
	return emitters;
}

const dtStub = (reqs) => {
	return {
		execute: execute
	}
};

function moduleMock() {
	return proxyquire('../core', {'dt': dtStub});
}

test('it throws error if no requests are provided', (assert) => {
	const error = new Error('There is no requests to be made');
	assert.deepEqual(error, dt.execute());
	assert.end();
});

test('it returns two emitters for the same number of requests', (assert) => {
	const emitters = dt.execute(reqs);
	assert.equal(1, Object.keys(emitters).length);
	assert.end();
});



