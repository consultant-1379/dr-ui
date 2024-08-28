## Note setting up - requires recent node version - does NOT work with node v14.15.0
- Run 'npm install'     (install playwright )

## to run all playwright test cases
- Switch to higher node version (not 14.15). Tested with node v16.13, v20.10.0.
- check dr-ui is available/up at baseUrl defined in playwright.config.ts
- Run 'npm playwright'
- you can also run it from Playwright Test for VSCode extension, you have to just install extension Playwright Test for VSCode microsoft certified

## to run end-to-end test (tests marked with @e2e)
- Run npm run e2e-test

## to run test with open chromium browser
- Run npm run test-headed

## to run test with playwright inspector open  (to http://dr.docker.localhost/dr-ui)
- Run npm run codegen

## to run test against docker-compose server from the [dr-service](https://gerrit-gamma.gic.ericsson.se/#/admin/projects/ESOA/DR-Parent/com.ericsson.bos.dr/dr-service) repo
##
## See [Local Testing](https://eteamspace.internal.ericsson.com/display/SABSS/Local+Testing) page
(when pulling code for docker-compose you will to have run `docker login armdocker.rnd.ericsson.se`  with your LAN signum/password first to be able to pull from the artifactory)

## Runs test without login.
- Run docker-compose up -d
- update baseURL in playwright.config.ts to point to the docker dr-ui URL: baseURL: 'http://dr.docker.localhost/dr-ui/',
- Run npm run docker-tests

## to run specific test case file
- Run npx playwright test <file-path>
   * example - 'npx playwright test jobs.spec.ts'
- you can also run it from Playwright Test for VSCode extension

## Writing a test case
- In playwright test() is the first class citizen and mandatory api block
- test.describe could be use to group test cases together, it does not currently by default that test case will be executed in series.]
> test.describe.configure({ mode: 'serial' });
This should used to make sure that a spec file test run in series.
- Instead of using

## Parallelism and sharding
    https://playwright.dev/docs/test-parallel
- By default, test files are run in parallel. Tests in a single file are run in order, in the same worker process. (this is what we aim for)
- Do not use fully parallel mode in playwright.config
> const config: PlaywrightTestConfig = {
>   fullyParallel: true,
> };
- Run all tests in parallel: npx playwright --workers 1

This will run even the test in a particular file in parallel, leading to lot of breakage.

## Using a selector
- Selector should always be ID or CSS bases,
  - if There is a place where specific ID could have given but don't we should change the code to introduce the id.
- A selector use should have a absolute certainty to select a element Precisely every time
  - It should be unique on the page and should not get conflicted at any stage rendering.
- A selector should not be language dependent.
- Playwright provide a option to select two selectors to select a element under two conditions (like login) use it.

## Code and File structure to follow
- Spec file
  - The spec file will hold the test case and the assertions
- Page file
  - contains methods related to specific page