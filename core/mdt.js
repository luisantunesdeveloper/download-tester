'use strict';

const dt = require('./dt');

/**
 * 
 * @param {Object} locations Object composed of the following keys
 * location numberOfRequests outputFilename outputDir
 * @return {Object} the event emitters for the multiple request locations
 */
function execute(requests) {
	let emitters = {};
	for(const request of requests) {
		emitters[request.location] = dt.execute(request);
	}
	return emitters;
}

module.exports = {
    execute: execute
}