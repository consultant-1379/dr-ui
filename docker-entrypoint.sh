#!/bin/sh
dnr_protocol="$(cut -d':' -f1 <<<"$hostName")"
dnr_host=$dnr_protocol:"$(cut -d':' -f2 <<<"$hostName")"
dnr_port="$(cut -d':' -f3 <<<"$hostName")"
# Extract hostname for nginx
# Update server_name in nginx
if [[ $SECURITY_TLS_ENABLED == "true" ]]; then
    envsubst '${DR_UI_SERVER_CERT_DIR} ${BUNDLE_CERT_DIR}' < /etc/nginx/https-server.conf.template > /tmp/nginx_server.conf
  else
    cat /etc/nginx/http-server.conf > /tmp/nginx_server.conf
fi

# Update host variable and run time properties for UI
cp -rp /dr-ui-config/* /var/www/html/dr-ui/config
jq ".runtimeProperties.version = \"${releaseVersion}\" |
      .runtimeProperties.groupClaim = \"${groupsClaim}\"" /dr-ui-config/config.prod.json > /var/www/html/dr-ui/config/config.prod.json

if [[ $SECURITY_TLS_ENABLED == "true" ]]; then
    echo -e "Triggering certificate watcher script..."
    /usr/sbin/certificate_watcher.sh $DR_UI_SERVER_CERT_DIR $GUI_AGGREGATOR_CERT_DIR $ESOA_COMMON_CERT_DIR $SIP_ROOT_CERT_DIR $BUNDLE_CERT_DIR
    echo -e "Watcher script has been triggered."
fi

# Executing the process to keep alive the docker container
exec "$@";
