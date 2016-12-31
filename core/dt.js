'use strict';

const request = require('request');
const progress = require('request-progress');
const fs = require('fs');
const mimeTypes = require('mime-types');
const observe = require('observe');
const eventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

// defaults
const defaultNumberOfRequests = 1;
const defaultOutputDir = `${__dirname}/output`;
const defaultOutputFilename = 'file';

function getHash() {
    const current_date = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

/**
 * Creates an iterable Array that is going to assist the async requests
 * @param {Int} n Number of iterations (Array size)
 * @return {Array} Iterable array filled with integers
 */
function createIterable(n) {
    var arr = Array.apply(null, Array(n));
    return arr.map((x, i) => {
        return i;
    });
}

function getExtensionFromContentType(contentType) {
    return mimeTypes.extension(contentType.split(',')[0]);
}

function requestBuilder(args) {
    if (!args) {
        return new Error('Arguments should be provided')
    }

    this.args = args;
    this.location = location.bind(this);
    this.numberOfRequests = numberOfRequests.bind(this);
    this.outputDir = outputDir.bind(this);
    this.outputFilename = outputFilename.bind(this);
    this.outputPath = outputPath.bind(this);

    return this.location()
        .numberOfRequests()
        .outputDir()
        .outputFilename();
}

function location() {
    if (!this.args.location) {
        throw new Error('Location is not defined');
    }
    this.location = this.args.location;
    return this;
} 

function numberOfRequests() {
    this.numberOfRequests = this.args.numberOfRequests || defaultNumberOfRequests;
    return this;
} 

function outputDir() {
    // create dir if does not exist
    this.outputDir = this.args.outputDir || defaultOutputDir;
    if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir);
    }
    return this;
}

function outputFilename() {
    this.outputFilename = this.args.outputFilename || defaultOutputFilename;
    return this;
} 

function outputPath(i, extension) {
    const hash = getHash();
    return `${this.outputDir}/${this.outputFilename}_${i}_${hash}.${extension}`;
}   

function delayPipeUntilPath(reqProgress, stream, pathObservable) {
    const observer = observe(pathObservable);
    observer.on('change', (change) => {
        reqProgress.pipe(stream(pathObservable.path));
    });
    return observer;
}

/**
 *
 * Execute the download for a location a given number of times
 * @param {Object} req the request has the following parameters:
 * location The url to be used on the requests
 * numberOfRequests Numbers of requests to be made
 * outputFilename The output filename of the downloaded files
 *
 * @return {Object} EventEmitter
 */
function execute(args) {
    const req = new requestBuilder(args);
    const iterable = createIterable(req.numberOfRequests);
    const emitter = new eventEmitter();
    for (const i of iterable) {
        let pathObservable = {path: ''};
        let pathObserver;
        const reqProgress = progress(request(req.location))
            .on('response', (response) => {
                if (!pathObservable.path) {
                    let thisPath = req.outputPath(i, getExtensionFromContentType(response.headers['content-type']));
                    pathObserver.set('path', thisPath);
                }
                emitter.emit('response', {number: i, args: req.args, response: response});
            })
            .on('progress', (state) => {
                emitter.emit('progress', {number: i, args: req.args, state: state});
            })
            .on('error', (err) => {
                emitter.emit('error', {number: i, args: req.args, err: err});
            })
            .on('end', () => {
                emitter.emit('end', {number: i, args: req.args});
            });
        pathObserver = delayPipeUntilPath(reqProgress, fs.createWriteStream, pathObservable);
    }
    return emitter;
}

module.exports = {
    execute: execute,
    defaultNumberOfRequests: defaultNumberOfRequests,
    defaultOutputDir: defaultOutputDir,
    defaultOutputFilename: defaultOutputFilename
};

