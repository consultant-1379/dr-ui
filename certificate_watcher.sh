#!/bin/bash

DR_UI_SERVER_TLS_CRT="$1..data/tls.crt"
GUI_AGGREGATOR_CA_CRT="$2..data/ca.crt"
COMMON_CA_CRT="$3..data/ca.crt"
SIP_ROOT_CA_CRT="$4..data/ca.crt"
BUNDLE_CA_CRT="$5ca-bundle.crt"

mkdir -p "$5"

echo "$DR_UI_SERVER_TLS_CRT"
echo "$GUI_AGGREGATOR_CA_CRT"
echo "$COMMON_CA_CRT"
echo "$SIP_ROOT_CA_CRT"
echo "$BUNDLE_CA_CRT"

watcher() {

  function calculate_checksum() {
    local checksum=""
    filenames=("$DR_UI_SERVER_TLS_CRT" "$COMMON_CA_CRT" "$SIP_ROOT_CA_CRT" "$GUI_AGGREGATOR_CA_CRT")
    for filename in "${filenames[@]}"; do
      if [ -e "$filename" ]; then
        checksum+=$(md5sum "$filename" | awk '{print $1}')
      fi
    done
    echo "$checksum"
  }

  tmp_checksum=$(calculate_checksum)

  echo "Listen to certificate changes!"
  while true; do
    sleep 5
    latest_checksum=$(calculate_checksum)
    if [ "$tmp_checksum" != "$latest_checksum" ]; then
      echo "Certificate changes are detected!"
      create_ca_bundle
      nginx -s reload
      echo "nginx reloaded!"
      tmp_checksum=$latest_checksum
    fi
  done
}

create_ca_bundle() {
  rm -rf "$BUNDLE_CA_CRT"
  filenames=("$GUI_AGGREGATOR_CA_CRT" "$COMMON_CA_CRT" "$SIP_ROOT_CA_CRT")
  for filename in "${filenames[@]}"; do
    if [ -e "$filename" ]; then
      (cat "$filename"; echo) >> "$BUNDLE_CA_CRT"
    else
      echo "$filename does not exist"
    fi
  done
  echo "Bundle certificate created!"
  cat "$BUNDLE_CA_CRT"
}

create_ca_bundle
watcher &
