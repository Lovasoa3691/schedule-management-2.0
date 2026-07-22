# SchedConnect - Schedule Management System

Un système full stack de gestion d’emploi du temps permettant d’organiser efficacement les horaires des enseignants, étudiants et salles de cours, tout en évitant les conflits de planification.

Le projet illustre une architecture DevOps complète avec :

- conteneurisation Docker
- orchestration Kubernetes
- CI/CD Jenkins
- API REST ASP.NET Core
- frontend React.js / React Native
- base de données MySQL

## Architecture globale
```
                        ┌──────────────┐
                        │  Frontend    │
                        │ React / RN   │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   Nginx      │
                        │  Gateway     │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Backend     │
                        │ ASP.NET Core │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   MySQL      │
                        │ (Dockerized) │
                        └──────────────┘
```


## ⚙️ Stack technique

### Backend & Frontend
- React.js
- React Native
- ASP.NET Core Web API
- Entity Framework Core
- MySQL

### DevOps & Infrastructure
- Docker & Docker Compose
- Kubernetes (Deployments, Services, Ingress)
- Jenkins CI/CD
- Nginx Reverse Proxy
- Git / GitHub


## 🐳 Conteneurisation avec Docker

L’application est 100% conteneurisée, aucune dépendance locale requise.

### Services :
- frontend (React)
- backend (ASP.NET Core)
- mysql (database)
- nginx (gateway)

## Lancement rapide
### Prérequis
- Docker
- Docker Compose
``` bash
git clone https://github.com/Lovasoa3691/schedule-management-2.0.git
cd schedule-management-2.0
docker compose up --build
```
L'application sera disponible sur http://localhost



## Compte de démonstration

Lors du premier démarrage, la base de données est initialisée automatiquement avec un compte administrateur de test.
```
Email : admin@gmail.com
Mot de passe : Admin@134
```

Vous pouvez utiliser ce compte pour explorer immédiatement l'application.



## Pipeline CI/CD

Un pipeline Jenkins automatise :

1. Récupération du code depuis GitHub
2. Build de l'application
3. Création des images Docker
4. Publication des images Docker
5. Déploiement automatique sur Kubernetes

Flux :
```
GitHub Push
   ↓
Jenkins Build
   ↓
Docker Build Images
   ↓
Push Registry
   ↓
Deploy Kubernetes
```

## Déploiement Kubernetes
Le projet inclut :

- Deployments (frontend, backend)
- StatefulSet (MySQL)
- Services internes
- Ingress Controller (Nginx)
- ConfigMaps & Secrets


## Fonctionnalites principales de l'application
- Authentification et gestion des utilisateurs (responsable/enseignants)
- Gestion des matières, enseignants, salles et classes
- Création et mise a jour d'emplois du temps
- Visualisation de l'emploi du temps (par jour/semaine/mois/mention/niveau)
- Exportation en PDF de l'emploi du temps


## Structure du projet
```
├── frontend-web (React)
├── mobile-app (React Native)
├── backend-api (ASP.NET Core)
├── docker-compose.yaml
├── k8s/
├── nginx/
├── Jenkinsfile
```

## Objectif
Ce projet démontre une maîtrise de :

- architecture microservices simple
- containerisation complète
- orchestration Kubernetes
- pipeline CI/CD automatisé
- déploiement cloud-ready


## Améliorations futures
- monitoring (Prometheus / Grafana)
- logs centralisés (ELK stack)
- Helm charts Kubernetes
- déploiement cloud (AWS / GCP)
