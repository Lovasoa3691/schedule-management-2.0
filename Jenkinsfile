pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_CREDS = 'docker-hub-creds'
    }

    stages {

        stage('Check Docker & Kubernetes') {
            steps {
                sh 'docker version'
                sh 'kubectl version --client'
            }
        }

        stage('Build & Push Backend') {
            // when {
            //     changeset "backend/**"
            // }
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_HUB_CREDS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {

                        sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

                        VERSION=${BUILD_NUMBER}

                        docker build -t $DOCKER_USERNAME/schedconnect-api:$VERSION .
                        docker tag $DOCKER_USERNAME/schedconnect-api:$VERSION $DOCKER_USERNAME/schedconnect-api:latest

                        docker push $DOCKER_USERNAME/schedconnect-api:$VERSION
                        docker push $DOCKER_USERNAME/schedconnect-api:latest
                        '''
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            // when {
            //     changeset "frontend/**"
            // }
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_HUB_CREDS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {

                        sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

                        VERSION=${BUILD_NUMBER}

                        docker build -t $DOCKER_USERNAME/schedconnect-front:$VERSION .
                        docker tag $DOCKER_USERNAME/schedconnect-front:$VERSION $DOCKER_USERNAME/schedconnect-front:latest

                        docker push $DOCKER_USERNAME/schedconnect-front:$VERSION
                        docker push $DOCKER_USERNAME/schedconnect-front:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy Backend to Minikube') {
            // when {
            //     changeset "backend/**"
            // }
            steps {
                withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                    sh '''
                    kubectl apply -f k8s/backend.yaml
                    kubectl rollout restart deployment/schedconnect-api
                    kubectl rollout status deployment/schedconnect-api
                    '''
                }
            }
        }

        stage('Deploy Frontend to Minikube') {
            // when {
            //     changeset "frontend/**"
            // }
            steps {
                withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                    sh '''
                    kubectl apply -f k8s/frontend.yaml
                    kubectl rollout restart deployment/schedconnect-front
                    kubectl rollout status deployment/schedconnect-front
                    '''
                }
            }
        }
    }
}