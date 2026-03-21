pipeline {
    agent any

    triggers {
        githubPush()
    }
    environment {
        DB_HOST     = credentials('AIVEN_DB_HOST')
        DB_PORT     = credentials('AIVEN_DB_PORT')
        DB_NAME     = credentials('AIVEN_DB_NAME')
        DB_USER     = credentials('AIVEN_DB_USER')
        DB_PASSWORD = credentials('AIVEN_DB_PASSWORD')
        DOCKER_HUB_CREDS = 'docker-hub-creds' 
        DOCKER_USERNAME = '' 
        DOCKER_PASSWORD = '' 
    }
    stages {
        stage('Check Docker & Kubernetes') {
            steps {
                sh 'docker version'
                sh 'kubectl version --client'
                sh 'minikube status || echo "Minikube not running"'
            }
        }
        stage('Build & Push Backend') {
            // when {
            //     changeset "backend/**"
            // }
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", 
                                                    usernameVariable: 'DOCKER_USERNAME', 
                                                    passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''#!/bin/bash
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker build -t $DOCKER_USERNAME/backend-api:latest .
                        docker push $DOCKER_USERNAME/backend-api:latest
                        '''
                    }
                }

            }
        }
        stage('Build & Push Frontend') {
            //  when {
            //     changeset "frontend/**"
            // }
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", 
                                                    usernameVariable: 'DOCKER_USERNAME', 
                                                    passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''#!/bin/bash
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker build -t $DOCKER_USERNAME/frontend-react:latest .
                        docker push $DOCKER_USERNAME/frontend-react:latest
                        '''
                    }
                }
            }
        }
        stage('Deploy Backend to Minikube') {
            //  when {
            //     changeset "backend/**"
            // }
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
            //  when {
            //     changeset "frontend/**"
            // }
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
    post {
        success {
            echo 'CI/CD OK → Backend & Frontend déployés sur Minikube'
        }
        failure {
            echo 'CI/CD échoué → Aucun déploiement Minikube'
        }
    }
}
