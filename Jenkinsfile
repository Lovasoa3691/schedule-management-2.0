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
    }

    stages {

        stage('Check Docker & Kubernetes') {
            steps {
                sh '''
                docker version
                kubectl version --client
                minikube status || minikube start --driver=docker
                '''
            }
        }

        stage('Use Minikube Docker') {
            steps {
                sh 'eval $(minikube docker-env)'
            }
        }

        stage('Build backend image') {
            steps {
                dir('backend') {
                    sh 'docker build -f Dockerfile.dev -t backend-api:latest .'
                }
            }
        }

        stage('Tests backend') {
            steps {
                sh '''
                docker run --rm \
                  -e ConnectionStrings__DefaultConnection="Server=$DB_HOST;Port=$DB_PORT;Database=$DB_NAME;User=$DB_USER;Password=$DB_PASSWORD;SslMode=Required;" \
                  backend-api:latest \
                  dotnet test
                '''
            }
        }

        stage('Build frontend image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t frontend-react:latest .'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                export KUBECONFIG=/home/julianot/.kube/config
                kubectl apply -f k8s/backend.yaml
                kubectl apply -f k8s/frontend.yaml
                kubectl apply -f k8s/ingress.yaml
                '''
            }
        }


    }

    post {
        success {
            echo 'CI OK → Application déployée sur Kubernetes (Minikube)'
        }
        failure {
            echo 'CI échoué → Déploiement annulé'
        }
    }
}
