#!/bin/bash

npm config set @eds:registry https://arm.rnd.ki.sw.ericsson.se/artifactory/api/npm/proj-eds-npm-local/;
npm config set @erad:registry https://arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/;
npm config set @eui:registry=https://arm.seli.gic.ericsson.se/artifactory/api/npm/proj-e-uisdk-npm-local/;
npm config set //arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:_password=QVA2dXZDZnJBa1lMNm9CdkZ0dWh3RDlIUHhOaVpFV1NManBockg=
npm config set //arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:username=esoadm100
npm config set //arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:email=youremail@email.com
npm config set //arm.seli.gic.ericsson.se/artifactory/api/npm/proj-erad-npm-local/:always-auth=true
npm config set proxy=null
npm config set https-proxy=null

