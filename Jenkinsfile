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
            when {
                changeset "backend/**"
            }
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

                        docker build -t $DOCKER_USERNAME/backend-api:$VERSION .
                        docker tag $DOCKER_USERNAME/backend-api:$VERSION $DOCKER_USERNAME/backend-api:latest

                        docker push $DOCKER_USERNAME/backend-api:$VERSION
                        docker push $DOCKER_USERNAME/backend-api:latest
                        '''
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            when {
                changeset "frontend/**"
            }
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

                        docker build -t $DOCKER_USERNAME/frontend-react:$VERSION .
                        docker tag $DOCKER_USERNAME/frontend-react:$VERSION $DOCKER_USERNAME/frontend-react:latest

                        docker push $DOCKER_USERNAME/frontend-react:$VERSION
                        docker push $DOCKER_USERNAME/frontend-react:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy Backend to Minikube') {
            when {
                changeset "backend/**"
            }
            steps {
                withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                    sh '''
                    kubectl apply -f k8s/backend.yaml
                    kubectl rollout restart deployment/backend-api
                    kubectl rollout status deployment/backend-api
                    '''
                }
            }
        }

        stage('Deploy Frontend to Minikube') {
            when {
                changeset "frontend/**"
            }
            steps {
                withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                    sh '''
                    kubectl apply -f k8s/frontend.yaml
                    kubectl rollout restart deployment/frontend-react
                    kubectl rollout status deployment/frontend-react
                    '''
                }
            }
        }
    }
}