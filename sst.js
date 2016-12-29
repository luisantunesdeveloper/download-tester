const request = require('request');
const progress = require('request-progress');
const fs = require('fs');

function fillArrayWithNumbers(n) {
    var arr = Array.apply(null, Array(n));
    return arr.map(function(x, i) {
        return i;
    });
}

function endRequests(totalRequests, totalRequestsFinished, time) {
    if (totalRequestsFinished >= totalRequests) {
        const diff = process.hrtime(time);
        console.log(`Total requests finished: ${totalRequestsFinished} on ${diff} seconds!!!`);
    }
}

const execute = (link, numberOfRequests) => {
    const iterable = fillArrayWithNumbers(numberOfRequests);
    const time = process.hrtime();
    let totalRequestsFinished = 0;
    for (const i of iterable) {
        const filename = downloadOutputDirectory ? `${downloadOutputDirectory}/download_${i}.${outputFileExtension}` : `download_${i}.${outputFileExtension}`;
        progress(request(link))
            .on('progress', (state) => {
                console.log(`Request ${i}: ${state.percent * 100}%`);
            })
            .on('error', (err) => {
                console.log(`Request nr. ${i} did not finished: ${err}`);
                ++totalRequestsFinished;
                endRequests(numberOfRequests, totalRequestsFinished, time);
            })
            .on('end', () => {
                ++totalRequestsFinished;
                endRequests(numberOfRequests, totalRequestsFinished, time);
            })
            .pipe(fs.createWriteStream(filename));
    }

}

// process command line arguments
if (process.argv.length < 4) {
    console.log("Usage: " + __filename + " link numberOfRequests outputFileExtension optionaloutputDirectory");
    process.exit(-1);
}

const link = process.argv[2];
const numberOfRequests = parseInt(process.argv[3]);
const outputFileExtension = process.argv[4];
const outputDir = process.argv[5];
console.log(`${numberOfRequests} for ${link}...`);

const downloadOutputDirectory = outputDir ? `${__dirname}/${outputDir}` : './';
if (!fs.existsSync(downloadOutputDirectory)){
    fs.mkdirSync(downloadOutputDirectory);
}
console.log(`Ouput path: ${downloadOutputDirectory}`);

// make the requests
execute(link, numberOfRequests);

