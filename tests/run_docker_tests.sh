#!/bin/bash
#
# /*******************************************************************************
#  * COPYRIGHT Ericsson 2023
#  *
#  *
#  *
#  * The copyright to the computer program(s) herein is the property of
#  *
#  * Ericsson Inc. The programs may be used and/or copied only with written
#  *
#  * permission from Ericsson Inc. or in accordance with the terms and
#  *
#  * conditions stipulated in the agreement/contract under which the
#  *
#  * program(s) have been supplied.
#  ******************************************************************************/
#

# Run e2e tests using docker test image towards a target D&R environment.
# Optionally builds the docker test image located in 'tests/docker/Dockerfile' if no existing image is specified.
# The test docker image contains the test source code and the playwright dependencies required for executing the tests.
#
# Run the following to build new test image and executes the tests: 'tests/run_docker_tests.sh "" "http://dr.docker.localhost"'
# Run the following to execute the tests using previously built image: 'tests/run_docker_tests.sh "dr-ui-e2e-tests" "http://dr.docker.localhost"'


BASEDIR=${PWD//\//\/\/} # workaround to update absolute path for running in git bash else volume mount will fail
REPORTS_DIR=${BASEDIR}//tests//playwright-report//
RESULTS_DIR=${BASEDIR}//tests//test-results//
DOCKER_IMAGE=$1
DR_BASE_URL=$2

if [ -z ${DOCKER_IMAGE} ]; then
  echo "No image specified, building docker image dr-ui-e2e-tests"
  DOCKER_IMAGE=$(docker build -q -t dr-ui-e2e-tests -f tests/docker/Dockerfile .)
  echo "Finished building docker image dr-ui-e2e-tests: ${BUILT_DOCKER_IMAGE}"
fi

docker run --rm -v "${REPORTS_DIR}:/dr-ui/tests/playwright-report/" -v "${RESULTS_DIR}:/dr-ui/tests/test-results/" ${DOCKER_IMAGE} ${DR_BASE_URL}
