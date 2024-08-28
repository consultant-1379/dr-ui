# DnR UI

## Node.js version

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.0.

As this is an older angular version, [previous nodejs](https://nodejs.org/en/about/previous-releases) is required:

Node version: 14.15.0

For example, install node version manager ([nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)) and run the following commands first in your git bash where you will be running commands:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

`nvm use 14.15.0`


# NPM Configuration
This project uses both [E-UI SDK framework](https://euisdk.seli.wh.rnd.internal.ericsson.com/euisdk/#getting-started) and [ERAD](http://avm.cpm.bss.seli.gic.ericsson.se/artifacts/builds/erad/main/latest/index.html) frameworks.

To get started, it will be required that your user HOME **.npmrc** file has content similar to the following  (will show how this is created below):

`@eui:registry=https://arm.seli.gic.ericsson.se/artifactory/api/npm/proj-e-uisdk-npm-local/
@uisdk:registry=https://arm.seli.gic.ericsson.se/artifactory/api/npm/proj-uisdk-npm-local/
https-proxy=null
proxy=null
@erad:registry=https://arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/
//arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:_password=[BASE_64_TOKEN]
//arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:username=[YOUR_SIGNUM]
//arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:email=[YOU]@ericsson.com
//arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:always-auth=true`

1. Follow the 'Getting started' instructions for setting your NPM configuration in the [E-UI SDK framework](https://euisdk.seli.wh.rnd.internal.ericsson.com/euisdk/#getting-started) documentation to run the required npm config commands.

2. Follow the "Set Me Up" **Installation** instructions on the [ERAD](http://avm.cpm.bss.seli.gic.ericsson.se/artifacts/builds/erad/main/latest/index.html) documentation page (there will be no need to run npm install at this stage)

3. Your user home **.npmrc** file should now contain similar the content above (with your own signum etc.)

## Build UI

In the same folder as the package.json, with node version as specified above (you can use "npm run" on any of the scripts listed in the package.json). Follow these steps for first time build:

1. `npm install`

(this will create node_modules folder)

2. `npm run build`

(builds a production configuration, build artifacts will be stored in the `dist/` directory)


3. Note, if versions are being updated in the package.json, it is recommended to run `npm run nuke` to remove the current node_modules folder before running `npm install` again

## Development server

1. Run `npm run mock` for a dev server.
2. Run `npm start` on another terminal for running source code.
3. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Note with current (sept 2023) BAM proxy auth token being in cookie which we don't set via out own API call, if the cookie is not in place on first launch, will need to refresh browser to get full access rights  (an alternative to use an interceptor for all server calls in production code, i.e. to add cookie for Dev Mode, is not considered necessary to date)


## Docker build
1. Run `npm run build`   (use node version above)
2. Run `./automatic-cbo-update.sh` (ONLY RUN IN BASH - script to update CBOS version)
(2a. Ensure shell scripts are not changed if running in windows, i.e are still unix:
 Run `dos2unix docker-entrypoint.sh` and `dos2unix certificate_watcher.sh`  if needed)
3. Run `docker build -t my_name .`
4. Run `docker tag my_name:latest armdocker.rnd.ericsson.se/proj-eric-bos-esoa-dev eric-esoa-dr-ui:1.0.0-456-black1`
5. Run ` docker push armdocker.rnd.ericsson.se/proj-eric-bos-esoa-dev/eric-esoa-dr-ui:1.0.0-456-black1`
6. DO NOT CHECK IN (revert) changes that were made to files for CBOS update

See docker tests in 'dr-ui/tests' folder, i.e. could also test black chart with playwright tests if were to use this image directly in the docker compose file - rather than using DR_UI_VERSION in .env file.


## Running unit tests

Run `ng test`, or `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `npm run test:coverage` to produce coverage report - `index.html` in the `coverage/` directory.

## Running playwright end to end tests

Follow the steps outlined in the 'dr-ui/tests' folder

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
