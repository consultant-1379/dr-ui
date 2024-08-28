// This file copies the application dependencies from package.json to
// application distribution, so it can be determined which version of
// 2pp and 3pps are used to build application
// i.e. see nmp run copyAppDepDescription from package.json
// (an alternative is to use npm ls --depth=5, or read the Fossa-report.json)

const fs = require('fs');
const npmFileObj = require('./package.json');

// setting in default file copy location
const defaultFileCopyFullLocation = './dist/dr-ui/assets/app-dep.json';

const appArgs = process && process.argv ? process.argv.slice(2) : [];
let copyFullPathLocation = '';

if(appArgs.length === 1) {
    copyFullPathLocation = appArgs[0];
}

const depdendenciesObj = npmFileObj.dependencies;

if(!copyFullPathLocation) {
    copyFullPathLocation = defaultFileCopyFullLocation;
}

// not handling error, because last statement, and critical operation
// if it is broken let error stack show up.
fs.writeFileSync(copyFullPathLocation, JSON.stringify(depdendenciesObj, null, 4), 'utf8');
