'use strict';

const mdt = require('../core').mdt;
const chalk = require('chalk');

const req1 = {
	location: 'http://www.muitochique.com/wp-content/uploads/2012/11/ano-novo-500x307.jpg',
	numberOfRequests: 10
};

const req2 = {
	location: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg',
	numberOfRequests: 10
};

const reqs = [req1, req2];

function getNumberOfRequests(reqs) {
	let totalReqNumber = 0;
	reqs.forEach((req) => {
		totalReqNumber += req.numberOfRequests;
	});
	return totalReqNumber;
}

const emitters = mdt.execute(reqs);

const time = process.hrtime()
let nrRequestsFinished = 0;

if (emitters) {

	for(var name in emitters) {
		//listen the events
		emitters[name].on('progress', (request) => {
			console.log(chalk.green(`Request ${request.number}: ${Number((request.state.percent * 100).toFixed(1))}%`));
		});

		emitters[name].on('error', (request) => {
			console.log(chalk.red(`Request nr. ${request.number} did not finished: ${request.err}`));
		});

		emitters[name].on('end', (request) => {
			++nrRequestsFinished;
			if (nrRequestsFinished >= getNumberOfRequests(reqs)) {
				const diff = process.hrtime(time);
				console.log(chalk.green(`${nrRequestsFinished} requests finished with sucess in ${diff} seconds`));
				process.exit();
			}
			console.log(chalk.green(`Request ${request.number} has finished with sucess`));
		});
	}
}

