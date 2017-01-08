'use strict';

const dt = require('../core').dt;
const chalk = require("chalk");

function action(url, numberOfRequests, options) {

    const isFsStream = (options) => {
        if (options.std || options.dir || options.file) {
            console.log(chalk.gray('Output: fsStream'));
            return 'fsStream';
        } else {
            console.log(chalk.gray('Output: stdOutputStream'));
            return 'stdOutputStream';
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
        ++nrRequestsFinished;
        if (nrRequestsFinished >= numberOfRequests) {
            const diff = process.hrtime(time);
            console.log(chalk.green(`${nrRequestsFinished} requests finished with sucess in ${diff} seconds`));
            process.exit();
        }
        console.log(chalk.green(`Request ${end.reqNumber} for ${end.args.options.url}: finished with sucess`));
    });
};

module.exports.action = action;