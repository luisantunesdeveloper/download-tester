'use strict';

const fs = require('fs');
const dt = require('../dt');
const chalk = require('chalk');

// process command line arguments
if (process.argv.length < 5) {
	console.log(chalk.red("SYNOPSIS"));
    console.log(chalk.red(  __filename + " [link numberOfRequests outputFileExtension [outputDir]]"));
    process.exit();
}

// arguments & defaults
const link = process.argv[2];
const numberOfRequests = parseInt(process.argv[3]);
const outputFileExtension = process.argv[4];
const outputDir = process.argv[5];
const defaultOutputDir = './downloads';
const downloadOutputDirectory = outputDir ? `${__dirname}/${outputDir}` : `./downloads`;
let nrRequestsFinished = 0;

// create dir if does not exist
if (!fs.existsSync(downloadOutputDirectory)){
    fs.mkdirSync(downloadOutputDirectory);
}

// make the requests
console.log(chalk.green(`${numberOfRequests} requests for ${link}...`));
console.log(chalk.green(`Output directory: ${downloadOutputDirectory}`));
const listener = dt(link, numberOfRequests, outputFileExtension, downloadOutputDirectory);
const time = process.hrtime();

//listen the events
listener.on('progress', (request) => {
	console.log(chalk.green(`Request ${request.number}: ${request.state.percent * 100}%`));
});

listener.on('error', (request) => {
	console.log(chalk.red(`Request nr. ${request.number} did not finished: ${request.err}`));
});

listener.on('end', (request) => {
	nrRequestsFinished++;
	if (++nrRequestsFinished >= numberOfRequests) {
		const diff = process.hrtime(time);
		console.log(chalk.green(`${nrRequestsFinished} requests finished with sucess in ${diff} seconds`));
		process.exit();
	}
	console.log(chalk.green(`Request ${request.number} has finished with sucess`));
});

