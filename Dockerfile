#
# COPYRIGHT Ericsson 2023
#
#
#
# The copyright to the computer program(s) herein is the property of
#
# Ericsson Inc. The programs may be used and/or copied only with written
#
# permission from Ericsson Inc. or in accordance with the terms and
#
# conditions stipulated in the agreement/contract under which the
#
# program(s) have been supplied.
#

ARG OS_REPO_VERSION=REPLACED_COMMON_BASE_OS_VERSION
FROM armdocker.rnd.ericsson.se/proj-ldc/common_base_os/sles:${OS_REPO_VERSION}

ARG NAME=sles15-nginx-dr-ui
ARG VERSION=1.0.0.0
ARG BUILD_DATE="today"
ARG SHORT_COMMIT_ID
ARG version
ARG imagedate
ARG rstate
ARG uid=262979
ARG gid=262979

LABEL com.ericsson.product-number="CRX 901 000"
LABEL com.ericsson.product-name="DNR"
LABEL com.ericsson.product-revision=$rstate
LABEL com.ericsson.product-3pp-name="dr-ui"
LABEL com.ericsson.product-3pp-version=$version
LABEL org.opencontainers.image.title="dr-ui"
LABEL org.opencontainers.image.created=$imagedate
LABEL org.opencontainers.image.revision=""
LABEL org.opencontainers.image.vendor="Ericsson"
LABEL org.opencontainers.image.version=$version
LABEL org.label-schema.name=$NAME \
      org.label-schema.version=$VERSION \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$SHORT_COMMIT_ID \
      org.label-schema.vendor='Ericsson' \
      org.label-schema.schema-version='1.0.0.0-rc1'



#Installing useradd command and creating nginx user
    ARG OS_REPO_VERSION=REPLACED_COMMON_BASE_OS_VERSION
    ARG CBO_URL="https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-ldc-repo-rpm-local/common_base_os/sles"
    RUN zypper ar --gpgcheck-strict --refresh ${CBO_URL}/${OS_REPO_VERSION} COMMON_BASE_OS_SLES_REPO \
    && zypper --gpg-auto-import-keys refresh -f -r COMMON_BASE_OS_SLES_REPO \
    && zypper install -l -y shadow \
    && groupadd --system --gid ${gid} nginx \
    && useradd -u ${uid} -r -g ${gid} -m -d /etc/nginx -s /sbin/nologin -c "Nginx user" nginx \
    && chmod 775 /etc/nginx \
    && usermod --shell /sbin/nologin root

#To download and install the latest stable version for SLES 15, run:
RUN zypper -n in nginx=1.21.5-150400.3.3.1
RUN mkdir -p /etc/certs/nginx
COPY docker-helper/libonig4-6.7.0-lp150.1.3.x86_64.rpm /opt/
RUN  mkdir -p /etc/scripts
COPY docker-helper/init_nginx.sh /etc/scripts

#Cleaning CRLF windows characters to run .sh files on linux
RUN cat -v /etc/scripts/init_nginx.sh | sed 's/\^M//g' > temp && mv temp init_nginx.sh \
    && chmod +x init_nginx.sh

#Attributing  permissions need to nginx user
RUN touch /tmp/nginx.pid \
    && chown -R nginx:nginx /var/lib/nginx /tmp/nginx.pid /etc/scripts /etc/nginx/nginx.conf \
    && sed -i -e '/listen/!b' -e '/80;/!b' -e 's/80;/8080;/' /etc/nginx/nginx.conf
RUN zypper -n --no-gpg-checks install ca-certificates-mozilla \
    && zypper addrepo -C -G -f https://download.opensuse.org/repositories/utilities/15.5/utilities.repo
RUN cd /opt/ && rpm -ivh libonig4-6.7.0-lp150.1.3.x86_64.rpm \
     && rm -rf libonig4-6.7.0-lp150.1.3.x86_64.rpm
RUN zypper -n install jq \
    && zypper rr COMMON_BASE_OS_SLES_REPO \
    && zypper addrepo -C -G -f https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-ldc-repo-rpm-local/common_base_os/sles/${OS_REPO_VERSION}?ssl_verify=no COMMON_BASE_OS_SLES_REPO \
    && zypper clean --all \
    && zypper -n --no-gpg-checks install gettext* \
    && zypper rr COMMON_BASE_OS_SLES_REPO \
    && zypper addrepo -C -G -f https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-ldc-repo-rpm-local/common_base_os/sles/${OS_REPO_VERSION}?ssl_verify=no COMMON_BASE_OS_SLES_REPO \
    && zypper clean --all
RUN  zypper rr utilities
RUN  chown -R nginx:nginx /etc/scripts /etc/nginx /var/log/nginx

# Install curl
RUN zypper -n install curl

# Copy certificate for ssh
RUN mkdir /etc/nginx/cert/
#COPY config-dev/global.pass /etc/nginx/cert/global.pass.pem
#COPY config-dev/localhost.crt.pem /etc/nginx/cert/srvcert.pem
#COPY config-dev/localhost.decrypted.key.pem /etc/nginx/cert/srvprivkey.pem


RUN chmod 777 /tmp/nginx.pid


# Entry Folder
RUN  mkdir -p /var/www/html/dr-ui

COPY dist/dr-ui /var/www/html/dr-ui
RUN  mv /var/www/html/dr-ui/config /dr-ui-config

COPY config/default.conf /etc/nginx/conf.d/default.conf
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/http-server.conf /etc/nginx/http-server.conf
COPY config/https-server.conf /etc/nginx/https-server.conf.template


# Copy the watcher script, for reloading certificates
COPY /certificate_watcher.sh /usr/sbin/certificate_watcher.sh
RUN chmod +x /usr/sbin/certificate_watcher.sh


COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN  chmod +x /docker-entrypoint.sh

RUN chmod 777 /var/www/html/dr-ui
RUN chmod 777 /etc/nginx/conf.d/default.conf
RUN chmod 777 /etc/nginx/http-server.conf
RUN chmod 777 /etc/nginx/https-server.conf.template

RUN ln -s /dev/stdout /tmp/nginx_access.log \
    && ln -s /dev/stderr /tmp/nginx_error.log

USER nginx:nginx

ENTRYPOINT [ "sh", "/docker-entrypoint.sh"]
# Run container as non-root
CMD ["nginx", "-g", "daemon off;", "-e", "/tmp/nginx_error.log"]
EXPOSE 8080
