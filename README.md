# download-tester
## Remote file downloader/tester with repetitions and file download auto-extensions
I did this tool because the available tools like curl are slow when doing something this:  
```
curl -s "http://google.com?[1-1000]"
```  
The above took more than 40 seconds to complete, while with download-tester it took roughly 13 seconds.  
Download-tester downloads each request concurrently. The extension for the downloaded files is automatically appended.

### Install
```
git clone https://github.com/luisantunesdeveloper/download-tester.git
yarn install
```

### Usage

#### 1 - With dependency of dt (download-tester)
```
const req1 = {
    options: {
        url: 'https://cdn.pixabay.com/photo/2014/03/27/21/10/waterfall-299685_1280.jpg'
    },
    numberOfRequests: 10,
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
```

From the emitters above the following events are available to be listened:  

```
for(let key in emitters) {
    emitters[key].on('response', (response) => {
        emitter.emit('response', {reqNumber: reqNumber, args: args, response: response, stream: stream});
    })
    emitters[key].on('progress', (progress) => {
        emitter.emit('progress', {reqNumber: reqNumber, args: args, progress: progress});
    })
    emitters[key].on('end', () => {
        emitter.emit('end', {reqNumber: reqNumber, args: args});
    })
    emitters[key].on('error', (error) => {
        emitter.emit('error', {reqNumber: reqNumber, args: args, error: error});
    });
}
```
##### Arguments
Since this module uses request-multi-streams module, which in turn wraps request and request-progress, it supports the same options for http get requests.
```
const req2 = {
    options: {
        url: {String}
    },
    progressOptions: {
        throttle: {Number}
        delay: {Number}
    },
    numberOfRequests: {Number},
    stream: {fsStream | stdOutputStream},
    outputDir: {String},
    outputFilename: {String}
};
```
fsStream when outputDir or outputFilename is used and stdOutputStream is not specified.

##### Response
```
{
    reqNumber: {Number},
    args: {Object}, -> The args sent to the request
    progress: {Number}, -> The progress of the requests
    response: {Object}, -> The same as the request.js module
    stream: {Object}, -> Pipeable
    error: {Object}
}
```

#### 2 - With the cli

Usage: cli :  npm run cli dt <url> [numberOfRequests] [options]

  Commands:

    dt [options] <url> [numberOfRequests]

  Tests and downloads the resources pointed by the url.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -d, --dir      set output to the file system with a given directory
    -f, --file     set output to the file system with a given filename
    -s, --std      set output to the standard output stream
```


##### Works with node > 4.x

##### TODO 
- Bulk test/download through the usage of a ".csv" file
- More unit tests
