#!/usr/bin/env node

'use strict';

const program = require('commander');
const pkg = require('../package.json');
const dtCmd = require('./dtCmd');

const receivePipedData = () => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
        process.stdout.write(data);
    });
};

program
    .version(pkg.version)
    .usage(':  npm run cli dt <url> [numberOfRequests] [options]')
    .description('Tests and downloads the resources pointed by the url.')
    .command('dt <url> [numberOfRequests]')
    .option('-d, --dir <outputDir>', 'set output to the file system with a given directory')
    .option('-f, --file <outputFilename>', 'set output to the file system with a given filename')
    .option('-s, --std', 'set output to the standard output stream')
    .action(dtCmd.action);

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) {
    return program.help();
}