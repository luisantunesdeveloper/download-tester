'use strict';

const test = require('tape').test;
const dt = require('../core').dt;

process.stdout.on('error', function( err ) {
    if (err.code == "EPIPE") {
        process.exit(0);
    }
});

const req1 = {
	options: {
		url: 'https://cdn.pixabay.com/photo/2014/03/27/21/10/waterfall-299685_1280.jpg'
	},
	numberOfRequests: 1,
	stream: 'fsStream'
};

const req2 = {
	options: {
		url: 'http://www.textfiles.com/fun/acronym.txt'
	},
	numberOfRequests: 1,
	stream: 'stdOutputStream'
};


test('it throws error if no requests are provided', (assert) => {
	const error = new Error('There is no requests to be made');
	assert.deepEqual(error, dt.execute());
	assert.end();
});




