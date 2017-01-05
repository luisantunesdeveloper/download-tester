#!/usr/bin/env node

'use strict';

const program = require('commander');
const pkg = require('../package.json');
const chalk = require("chalk");
const dt = require('../core').dt;

const action = (url, numberOfRequests, options) => {
	
	const isFsStream = (options) => {
		if (options.std) {
			console.log(chalk.gray('Output: stdOutputStream'));
			return 'stdOutputStream';
		} else if (options.dir || options.file) {
			console.log(chalk.gray('Output: fsStream'));
			return 'fsStream';
		}
	};

	const req = {
		options: {
			url: url
		},
		numberOfRequests: parseInt(numberOfRequests),
		outputDir: options.dir,
		outputFilename: options.file,
		stream: isFsStream(options)
	};

	const emitters = dt.execute([req]);
	const time = process.hrtime()
	let nrRequestsFinished = 0;

	//listen the events
	emitters[url].on('progress', (data) => {
        console.log(chalk.yellow(`Request ${data.reqNumber} for ${data.args.options.url}: ${Number((data.progress.percent * 100).toFixed(1))}% complete`));
	});

	emitters[url].on('error', (error) => {
        console.log(chalk.red(`Request ${error.reqNumber} for ${error.args.options.url}: finished on error ${error.error}`));
	});

	emitters[url].on('end', (end) => {
		console.log(nrRequestsFinished);
		++nrRequestsFinished;
		if (nrRequestsFinished >= numberOfRequests) {
			const diff = process.hrtime(time);
			console.log(chalk.green(`${nrRequestsFinished} requests finished with sucess in ${diff} seconds`));
			process.exit();
		}
        console.log(chalk.green(`Request ${end.reqNumber} for ${end.args.options.url}: finished with sucess`));
	});
};

program
    .version(pkg.version)
    .description('Tests and downloads the resources pointed by the url.')
    .command('dt <url> [numberOfRequests]')
    .option('-d, --dir <outputDir>', 'set output to the file system with a given directory')
    .option('-f, --file <outputFilename>', 'set output to the file system with a given filename')
    .option('-s, --std', 'set output to the standard output stream')
    .action(action);

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) {
	return program.help();
}

