FROM armdocker.rnd.ericsson.se/proj-ldc/common_base_os/sles:6.6.0-16

ENV TESTS_DIR=/dr-ui/tests
ENV PW_TEST_HTML_REPORT_OPEN=never
WORKDIR ${TESTS_DIR}

RUN zypper ar -C -G -f https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-ldc-repo-rpm-local/common_base_os/sles/6.6.0-16 LDC-CBO-SLES \
    && zypper ar -C -G -f https://arm.sero.gic.ericsson.se/artifactory/proj-suse-repos-rpm-local/SLE15/SLE-15-SP5-Module-Basesystem SLES-BASE \
    && zypper ref \
    && zypper -n install npm18 libgtk-3-0  mozilla-nss libasound2 dbus-1-glib

COPY tests ${TESTS_DIR}
RUN npm install \
    && npx playwright install \
    && zypper clean -a

COPY tsconfig.json /dr-ui/tsconfig.json
COPY tests/docker/e2e_tests.sh /e2e_tests.sh
RUN chmod +x /e2e_tests.sh

ENTRYPOINT ["/e2e_tests.sh"]
