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

        // stage('Login Docker Hub') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDS}", 
        //                                           usernameVariable: 'DOCKER_USERNAME', 
        //                                           passwordVariable: 'DOCKER_PASSWORD')]) {
        //             sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
        //         }
        //     }
        // }

        stage('Build & Push Backend') {
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
            steps {
                // sh '''
                // kubectl apply -f k8s/backend.yaml
                // kubectl rollout status deployment/backend-api
                // '''
                withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                    sh 'kubectl apply -f k8s/backend.yaml'
                    sh 'kubectl rollout status deployment/backend-api'
                }
            }
        }

        stage('Deploy Frontend to Minikube') {
            steps {
                withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                    sh 'kubectl apply -f k8s/frontend.yaml'
                    sh 'kubectl rollout status deployment/frontend-react'
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
