#!/bin/bash

#################################################################################################
# Description:
# NGINX initialization script wrapper
#
# Version       Date            Author
# PA1           2019-10-11      efelcor
#
# Notice:  1. This script runs via CMD command in the nginx-based docker images
#
# COPYRIGHT Ericsson Communications Inc., Canada 2007
# All rights reserved.
#
# The Copyright to the computer program(s) herein is the property of
# Ericsson Communications Inc., Canada.
# The program(s) may be used and/or copied with the written permission
# from Ericsson Communications Inc. or in accordance with the terms
# and conditions stipulated in the agreement/contract under which the
# program(s) have been supplied.
#
#################################################################################################
echo "Starting SSL/TLS Certificates Monitor..."
/etc/scripts/monitor_cert_client_nginx.sh &> /dev/null &

sudo mkdir -p /var/log/nginx/${HOSTNAME}
sudo chown -R nginx:nginx /etc/scripts /etc/nginx /var/log/nginx

echo "Starting NGINX..."
/bin/bash -c "/usr/sbin/nginx -g 'daemon off;'"
