#!/bin/bash

#################################################################################################
# Description:
# Monitor for NGINX-CLIENT certificates to reload it when they are exchanged
#
# Version       Date            Author
# PA1           2019-10-11      efelcor
#
# Notice:  1. Uses inotifywait tool to watch for keystore/truststore changes
#		   2. If change is detected, it reloads nginx server
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
nginx_certs="/etc/certs/"

reload_nginx() {
	echo "[NGINX-CLIENT] Reloading Application"	
	nginx -s reload
}

start_monitor() {
	while line=$(inotifywait -qr -e attrib ${nginx_certs}); do
		reload_nginx
	done;
}

echo "[NGINX-CLIENT] Start monitoring certificates"
start_monitor