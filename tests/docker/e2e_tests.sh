#!/bin/bash
DR_URL=$1

echo -n "Target URL for test is: ${DR_URL}"
sed -i "s;http://dr.docker.localhost;${DR_URL};"  ${TESTS_DIR}/playwright.config.ts
npx playwright test -g e2e
