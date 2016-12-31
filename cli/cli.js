'use strict';

const dt = require('../core').dt;
const chalk = require('chalk');

// process command line arguments
if (process.argv.length < 4) {
	console.log(chalk.red("SYNOPSIS"));
    console.log(chalk.red(  __filename + " [location numberOfRequests [outputFilename outputDir]]"));
    process.exit();
}

// arguments & defaults
const location = process.argv[2];
const numberOfRequests = parseInt(process.argv[3]);
const outputFilename = process.argv[4];
const outputDir = process.argv[5];

const args = {
	location: location,
	numberOfRequests: numberOfRequests,
	outputFilename: outputFilename,
	outputDir: outputDir
};

const listener = dt.execute(args);
const time = process.hrtime()
let nrRequestsFinished = 0;

//listen the events
listener.on('progress', (request) => {
	console.log(chalk.green(`Request ${request.number}: ${Number((request.state.percent * 100).toFixed(1))}%`));
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