# download-tester
## Multiple file downloader with repetitions and file auto-extensions
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

#### 1 With dependency of dt
```
const args = {
	location,
	numberOfRequests,
	outputFilename,
	outputDir
};

const dt = require('download-tester');  
const listener = dt(args);
```

The following events are available to be listened:  

```
.on('response', (response) => {
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
```
#### 2 With dependency of mdt  
See examples

#### 3 From npm scripts with parameters
```
npm run cli [location numberOfRequests [outputFilename outputDir]]
```
##### Parameters
location: STRING -> [URL](https://en.wikipedia.org/wiki/Uniform_Resource_Locator)  
numberOfRequests: INT -> number of repetitions  
outputFilename: STRING -> the file name used in the downloads 
outputDir: STRING -> the destination directory of the downloaded files


##### Works with node > 4.x

##### TODO 
- Unit tests
- A real cli with support for input file pipping 
