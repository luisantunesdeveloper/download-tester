'use strict';

const requestMultiStreams = require('request-multi-streams');
const chalk = require('chalk');
const fs = require('fs');
const crypto = require('crypto');
const mimeTypes = require('mime-types');

const defaultOutputDir = `output`;
const defaultOutputFilename = 'file';

const fsStream = fs.createWriteStream;
const stdOutputStream = process.stdout;

const outputStreams = {
    fsStream: fsStream,
    stdOutputStream: stdOutputStream
};

function getHash() {
    const current_date = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

function getExtensionFromContentType(contentType) {
    return mimeTypes.extension(contentType.split(',')[0]);
}

function buildOutput(response) {
    return function (dir) {
        return function (filename) {
            const extension = getExtensionFromContentType(response.response.headers['content-type'])
            return outputPath(response.reqNumber, dir, filename, extension);
        }
    }
}

function outputDir(args) {
    // create dir if does not exist
    let outputDir = args.outputDir || defaultOutputDir;
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    return outputDir;
}

function outputFilename(args) {
    return args.outputFilename || defaultOutputFilename;
} 

function outputPath(i, outputDir, outputFilename, outputFileExtension) {
    const hash = getHash();
    return `${outputDir}/${outputFilename}_${i}_${hash}.${outputFileExtension}`;
} 

function execute(requests) {
    if (!requests) {
        return new Error('There is no requests to be made');
    }
    const emitters = requestMultiStreams.streams(requests);
    for(let key in emitters) {
        emitters[key].on('response', (data) => {
            if (data.args.stream === 'fsStream' || data.args.outputDir || data.args.outputFilename) {
                let path = buildOutput(data)(outputDir(data.args))(outputFilename(data.args));
                data.stream.pipe(outputStreams['fsStream'](path));
            } else {
                data.stream.pipe(outputStreams['stdOutputStream']);
            }
        });
    }
    return emitters;
}

module.exports = {
    execute: execute
}