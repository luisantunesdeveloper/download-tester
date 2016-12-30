'use strict';

const dt = require('../core').dt;
const chalk = require('chalk');

const args = {
	location: 'http://www.google.com',
	numberOfRequests: 10,
	outputFileExtension: 'html'
};

const listener = dt.execute(args);
const time = process.hrtime()
let nrRequestsFinished = 0;


//listen the events
listener.on('progress', (request) => {
	console.log(chalk.green(`Request ${request.number}: ${request.state.percent * 100}%`));
});

listener.on('error', (request) => {
	console.log(chalk.red(`Request nr. ${request.number} did not finished: ${request.err}`));
});

listener.on('end', (request) => {
	++nrRequestsFinished;
	if (nrRequestsFinished >= args.numberOfRequests) {
		const diff = process.hrtime(time);
		console.log(chalk.green(`${nrRequestsFinished} requests finished with sucess in ${diff} seconds`));
		process.exit();
	}
	console.log(chalk.green(`Request ${request.number} has finished with sucess`));
});