def bob = "bob/bob -r \${WORKSPACE}/ruleset2.0.yaml"
pipeline {
    agent {
        node {
            label env.AGENT_LABEL
        }
    }
    environment {
        FOSSA_API_KEY = credentials('FOSSA_API_KEY')
        XRAY_APIKEY = credentials('XRAY_APIKEY')
        MALWARE_API_KEY = credentials('MALWARE_SCAN')
    }

    tools {nodejs "14.15.0"}

    stages {
        stage('Prepare') {
            steps {
                script {
                    // Set build name
                    authorName = sh(returnStdout: true, script: 'git show -s --pretty=%an')
                    currentBuild.displayName = currentBuild.displayName + ' / ' + authorName
                }
                sh "rm -rf bob"
                sh 'git submodule update --init --recursive'
                // bob repo is cloned because if we use the bob docker image, then shell commands will not be run on the slave, they will be run inside the bob docker image.
                sh 'git clone ssh://gerrit-gamma.gic.ericsson.se:29418/adp-cicd/bob'
                sh "${bob} -v"
            }
        }

        stage('Clean') {
            steps {
                sh "${bob} -r legacy-ruleset2.0.yaml clean"
            }
        }

        stage('Init') {
            steps {
                script {
                    if (env.RELEASE == 'false') {
                        sh "${bob} -r legacy-ruleset2.0.yaml init-review"
                    } else {
                        sh "${bob} -r legacy-ruleset2.0.yaml init-release"
                        archiveArtifacts 'artifact.properties'
                    }
                }
            }
        }

        stage('Chart dependency update') {
          steps {
              sh "${bob} -r legacy-ruleset2.0.yaml chart-dependency-update"
          }
        }

        stage('Lint-helm') {
            steps {
                sh "${bob} -r legacy-ruleset2.0.yaml lint-helm"
            }
        }

        stage('prepare test env') {
            steps {
              script{
                echo "Setting up npm repositories for EDS, ERAD, EUI";
                sh 'npm run authenticate-erad'
                sh 'cat ~/.npmrc'
                sh 'npm run setup'
              }
            }
        }

        stage("Build project") {
            steps {
              sh 'npm run build'
            }
        }

        stage('run unit Test') {
            steps {
                // coverage run here too for sonarqube coverage
                sh 'npm run test-headless'
            }
        }

         stage('build docker image') {
            steps {
                sh "chmod +x ./automatic-cbo-update.sh"
                sh "./automatic-cbo-update.sh"
                sh "${bob} -r legacy-ruleset2.0.yaml image"
            }
        }

        stage('push docker image') {
            steps {
                sh "${bob} -r legacy-ruleset2.0.yaml publish:docker-push"
            }
        }

        stage('Package') {
             when {
                 beforeAgent true
                 expression { (params.RELEASE=="true") }
             }
            steps {
                sh "${bob} -r legacy-ruleset2.0.yaml package"
            }
        }

        stage('Publish') {
            when {
                beforeAgent true
                expression { (params.RELEASE=="true") }
            }
            steps {
                sh "${bob} -r legacy-ruleset2.0.yaml publish"
            }
        }

        stage ('Vulnerability Analysis') {
             when {
                 beforeAgent true
                 expression { (params.RELEASE=="true") }
             }
            steps {
                parallel(
                    "Hadolint": {
                        script {
                            sh "${bob} -r legacy-ruleset2.0.yaml hadolint-scan"
                            echo "Evaluating Hadolint Scan Resultcodes..."
                            sh "${bob} -r legacy-ruleset2.0.yaml evaluate-design-rule-check-resultcodes"
                            archiveArtifacts "build/va-reports/hadolint-scan/**.*"
                        }
                    },
                    "Trivy": {
                        script {
                            sh "${bob} -r legacy-ruleset2.0.yaml trivy-inline-scan"
                            archiveArtifacts "build/va-reports/trivy-reports/**.*"
                            archiveArtifacts "trivy_metadata.properties"
                        }
                    },
                    "Anchore-Grype": {
                         script {
                             sh "${bob} -r legacy-ruleset2.0.yaml anchore-grype-scan"
                             archiveArtifacts "build/va-reports/anchore-reports/**.*"
                         }
                    },
                    "Malware-scan": {
                        script {
                            sh "${bob} -r legacy-ruleset2.0.yaml malware-scan-release"
                            archiveArtifacts "build/va-reports/malware-scan/malware-scan.json"
                        }
                    },
                    "X-Ray": {
                        script {
                            sleep(120)
                            sh "${bob} -r legacy-ruleset2.0.yaml fetch-xray-report"
                            archiveArtifacts "build/va-reports/xray-reports/xray_report.json"
                            archiveArtifacts "build/va-reports/xray-reports/raw_xray_report.json"
                        }
                    }
                )
            }
        }

        stage('Generate Vulnerability report V2.0') {
            when {
                beforeAgent true
                expression { (params.RELEASE=="true") }
            }
            steps {
                sh "${bob} -r so-ci/rulesets/ruleset2.0.yaml generate-VA-report-V2:no-upload"
                archiveArtifacts allowEmptyArchive: true, artifacts: 'build/va-reports/Vulnerability_Report_2.0.md'
            }
        }

        stage('FOSSA Analyze') {
            when {
                beforeAgent true
                expression { (params.RELEASE=="true") }
            }
            steps {
                sh "${bob} -r so-ci/rulesets/ruleset2.0.yaml fossa-analyze"
            }
       }

       stage('FOSSA Fetch Report') {
            when {
                beforeAgent true
                expression { (params.RELEASE=="true") }
            }
            steps {
                sh "${bob} -r so-ci/rulesets/ruleset2.0.yaml fossa-scan-status-check"
                sh "${bob} -r so-ci/rulesets/ruleset2.0.yaml fetch-fossa-report-attribution"
                archiveArtifacts "*fossa-report.json"
            }
       }

       stage ('FOSSA Dependency Update') {
            when {
                beforeAgent true
                expression { (params.RELEASE=="true") }
            }
            steps {
                sh "${bob} -r so-ci/rulesets/ruleset2.0.yaml dependency-update"
                archiveArtifacts "*dependency.yaml"
            }
       }

        stage('SonarQube Analysis') {
            steps {
                script {
                    try {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            docker run --rm \
                                --user \$(id -u):\$(id -g) \
                                -v ${env.WORKSPACE}:${env.WORKSPACE} \
                                -w ${env.WORKSPACE} \
                                --env SONAR_AUTH_TOKEN='squ_3198d92a3d8f5cdbfb7fb0518076079e9b9dd881' \
                                --env SONAR_HOST_URL='https://codeanalyzer2.internal.ericsson.com' \
                                --env SONARQUBE_SCANNER_PARAMS='{"sonar.host.url":"https://codeanalyzer2.internal.ericsson.com", "sonar.login":"squ_3198d92a3d8f5cdbfb7fb0518076079e9b9dd881"}' \
                                --name sonar-scanner sonarsource/sonar-scanner-cli:4.3 -X
                        """
                    }
                    } catch (e){
                        echo("TODO Not breaking build but Error with SONAR to look into: ${e}")
                    }
                }
            }
        }

    }
    post {
        always {
            archiveArtifacts '.bob/design-rule-check-report.html'
        }
    }
}
