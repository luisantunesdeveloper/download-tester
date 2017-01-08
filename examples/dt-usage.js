'use strict';

const dt = require('../core').dt;
const chalk = require('chalk');

const req1 = {
	options: {
		url: 'https://cdn.pixabay.com/photo/2014/03/27/21/10/waterfall-299685_1280.jpg'
	},
	numberOfRequests: 5,
	stream: 'fsStream'
};

const req2 = {
	options: {
		url: 'http://www.textfiles.com/fun/acronym.txt'
	},
	numberOfRequests: 10,
	stream: 'stdOutputStream'
};

const emitters = dt.execute([req1, req2]);

for(let key in emitters) {
	//listen the events
	emitters[key].on('progress', (data) => {
	    console.log(chalk.yellow(`Request ${data.reqNumber} for ${data.args.options.url}: ${Number((data.progress.percent * 100).toFixed(1))}% complete`));
	});

	emitters[key].on('error', (error) => {
	    console.log(chalk.red(`Request ${error.reqNumber} for ${error.args.options.url}: finished on error ${error.error}`));
	});

	emitters[key].on('end', (end) => {
	    console.log(chalk.green(`Request ${end.reqNumber} for ${end.args.options.url}: finished with sucess`));
	});
}



