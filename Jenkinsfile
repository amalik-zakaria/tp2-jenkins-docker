pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
    }

    environment {
        IMAGE_REPO = 'amalikzakaria/tp2-my-app'
    }

    stages {
        stage('Build Image') {
            steps {
                script {
                    docker.build(
                        "${env.IMAGE_REPO}:build-${env.BUILD_NUMBER}"
                    )
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        'dockerhub-tp2'
                    ) {
                        def image = docker.image(
                            "${env.IMAGE_REPO}:build-${env.BUILD_NUMBER}"
                        )
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    if docker container inspect tp2-app-cicd >/dev/null 2>&1; then
                        docker rm -f tp2-app-cicd
                    fi

                    docker run -d \
                      --name tp2-app-cicd \
                      --restart unless-stopped \
                      -p 127.0.0.1:3001:3000 \
                      "${IMAGE_REPO}:build-${BUILD_NUMBER}"
                '''
            }
        }

        stage('Verify') {
            steps {
                retry(5) {
                    sleep time: 2, unit: 'SECONDS'
                    sh '''
                        docker exec tp2-app-cicd node -e '
                            const http = require("node:http");
                            const req = http.get(
                                "http://127.0.0.1:3000",
                                res => {
                                    if (res.statusCode !== 200) {
                                        process.exit(1);
                                    }
                                    res.pipe(process.stdout);
                                }
                            );
                            req.on("error", () => process.exit(1));
                            req.setTimeout(5000, () => process.exit(1));
                        '
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Application disponible sur http://127.0.0.1:3001'
        }
        failure {
            echo 'Échec du pipeline : consulter la console.'
        }
    }
}
