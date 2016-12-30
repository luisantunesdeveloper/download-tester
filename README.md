# download-tester
## File downloader with repetitions

### Install
```
git clone https://github.com/luisantunesdeveloper/download-tester.git
yarn install
```

### Usage
#### 1 Through the command line
```
npm run cli [link numberOfRequests outputFileExtension [outputDir]]
```
##### Parameters
link: STRING -> [URL](https://en.wikipedia.org/wiki/Uniform_Resource_Locator)  
numberOfRequests: NUMBER -> number of repetitions  
outputFileExtension: STRING -> the extension of the files  
outputDir: STRING -> the destination directory of the downloaded files

#### 2 As a dependency
See the cli.js file

##### Works with node > 4.x

TODO: Unit tests