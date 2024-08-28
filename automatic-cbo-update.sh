####################################################################################
# Script to automatically change CBOS to new version in UI  (UI using common base OS/SUSE version)
# latest report should be here:
# https://fem1s11-eiffel281.eiffel.gic.ericsson.se:8443/jenkins/job/Application_Run_CBOS_Age_Tool
# from :
# https://spinnaker.rnd.gic.ericsson.se/#/applications/esoa-dr-e2e-cicd/executions?pipeline=esoa-dr-cbos-age-tool-E2E-Flow
#
####################################################################################
#!/bin/bash

# Fallback version (changed 11-06-2024) - used only if retrieval fails
fallback_version="6.17.0-11"

echo "Querying for the latest CBOS version..."
 latest_cbo_version=$(curl -u amadm100:AKCp5bBhBeBH1StEyF5jb1ZCrhWWJ97jkUCGFpcZvbnAqVSVAzH5RkzKCJi7dVdYJxjNDoCq9 \
    -X POST https://arm.epk.ericsson.se/artifactory/api/search/aql \
    -H "content-type: text/plain" \
    -d 'items.find({ "repo": {"$eq":"proj-ldc-docker-global"}, "path": {"$match" : "proj-ldc/common_base_os_release/*"}, "name" : {"$eq":"manifest.json"}}).sort({"$desc": ["created"]}).limit(1)' \
    2>/dev/null | grep path | sed -e 's_.*\/\(.*\)".*_\1_')

# Check if the latest version is empty
if [ -z "$latest_cbo_version" ]; then
    echo "Failed to retrieve the latest version. Using fallback version: $fallback_version"
    latest_cbo_version="$fallback_version"
fi

echo "Latest CBO version : $latest_cbo_version"
echo "Update the Dockerfile with new CBO(SUSE)-$latest_cbo_version"
sed -i 's/REPLACED_COMMON_BASE_OS_VERSION/'"$latest_cbo_version"'/' Dockerfile
echo "END of shell"
exit
