'use strict';

const request = require('request');
const progress = require('request-progress');
const fs = require('fs');
const eventEmitter = require('events').EventEmitter;

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

/**
 * Execute the download for a location a given number of times
 * @param {String} link The url to be used on the requests
 * @param {String} numberOfRequests Numbers of requests to be made
 * @param {String} outputFileExtension The extension to be appended at the end of the file
 * @param {String} downloadOutputDirectory The output directory of the downloaded files
 */
function executor(link, numberOfRequests, outputFileExtension, downloadOutputDirectory) {
    const iterable = createIterable(numberOfRequests);
    const emitter = new eventEmitter();
    for (const i of iterable) {
        const filename = downloadOutputDirectory ? `${downloadOutputDirectory}/download_${i}.${outputFileExtension}` : `download_${i}.${outputFileExtension}`;
        progress(request(link))
            .on('progress', (state) => {
                emitter.emit('progress', {number: i, state: state});
            })
            .on('error', (err) => {
                emitter.emit('error', {number: i, err: err});
            })
            .on('end', () => {
                emitter.emit('end', {number: i});
            })
            .pipe(fs.createWriteStream(filename));
    }
    return emitter;
}

module.exports = executor;

