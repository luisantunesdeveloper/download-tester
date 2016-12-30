# download-tester
## File downloader with repetitions  
I did this tool because the available tools like curl are slow when doing something this:  
```
curl -s "http://google.com?[1-1000]"
```  
The above took more than 40 seconds to complete, while with download-tester it took roughly 5 seconds.  
Download-tester downloads each request concurrently.  

### Install
```
git clone https://github.com/luisantunesdeveloper/download-tester.git
yarn install
```

### Usage

#### 1 As a dependency
```
const dt = require('download-tester');  
const listener = dt(link, numberOfRequests, outputFileExtension, downloadOutputDirectory);
```

The following events are available to be listened:  

```
listener.on('response', (response) => {
    emitter.emit('response', {number: i, response: response});
})
listener.on('progress', (state) => {
    emitter.emit('progress', {number: i, state: state});
})
listener.on('error', (err) => {
    emitter.emit('error', {number: i, err: err});
})
listener.on('end', () => {
    emitter.emit('end', {number: i});
})
```

#### 2 From npm scripts with parameters
```
npm run cli [link numberOfRequests outputFileExtension [outputDir]]
```
##### Parameters
link: STRING -> [URL](https://en.wikipedia.org/wiki/Uniform_Resource_Locator)  
numberOfRequests: INT -> number of repetitions  
outputFileExtension: STRING -> the extension of the files  
outputDir: STRING -> the destination directory of the downloaded files


##### Works with node > 4.x

##### TODO 
- Unit tests
- Multiple file downloads from different locations
- Auto extension from 'content-disposition'
- A real cli
- Stream composition
