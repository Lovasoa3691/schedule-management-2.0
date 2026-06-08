# Schedule Management System

Un système full stack de gestion d’emploi du temps permettant d’organiser efficacement les horaires des enseignants, étudiants et salles de cours, tout en évitant les conflits de planification.
Développé avec **React.js**, **React Native**, **ASP.NET Core (Entity Framework)** et **MySQL**, et intégrant une approche complète **DevOps (Docker, Kubernetes, CI/CD Jenkins)**.

## Architecture du projet
```
├── frontend-web (React.js)
├── mobile-app (React Native)
├── backend-api (ASP.Net Core)
├── database (MySQL)
├── docker
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── kubernetes
│   ├── frontend.yaml
│   ├── backend.yaml
│   ├── mysql-deployment.yaml
│   └── mysql-service.yaml
└── Jenkinsfile
```


## ⚙️ Technologies utilisées

### Backend & Frontend
- React.js
- React Native
- ASP.NET Core Web API
- Entity Framework Core
- MySQL

### DevOps & Infrastructure
- Docker
- Docker Compose
- Kubernetes
- Jenkins (CI/CD)
- Git & GitHub
- Nginx
- Linux base Ubuntu


## 🐳 Conteneurisation avec Docker

L’application est entièrement conteneurisée afin de garantir la portabilité et la cohérence des environnements.

### Services conteneurisés
- Frontend (React.js)
- Backend (ASP.NET Core)
- Base de données (MySQL)

### 🔨 Build && Lancement avec Docker Compose

```bash
docker compose up -d --build
```


## Pipeline CI/CD

Un pipeline Jenkins automatise :

1. Récupération du code depuis GitHub
2. Build de l'application
3. Création des images Docker
4. Publication des images Docker
5. Déploiement automatique sur Kubernetes

Flux :
```
GitHub
↓
Jenkins
↓
Docker Build
↓
Docker Registry
↓
Kubernetes
```

## Fonctionnalites principales de l'application
- Authentification et gestion des utilisateurs (responsable/enseignants)
- Gestion des matières, enseignants, salles et classes
- Création et mise a jour d'emplois du temps
- Visualisation de l'emploi du temps (par jour/semaine/mois/mention/niveau)
- Exportation en PDF de l'emploi du temps



## Installation et lancement
### Cloner le projet

 ```bash
 git clone https://github.com/Lovasoa3691/schedule-management.git`
 cd schedule-management
```

### Installer le runtime et dotnet SDK 8.0
### Configurer la base de données
```bash
# Configure la connection dans appsettings.json (backend):
"ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=db_edt_p;User=ton_username;Password=ton_mot_de_passe"
  }
```
  
### Applique les migrations EF:

```bash
cd backend/edt_api
dotnet ef database update
```


### Lancer le backend
```bash 
dotnet run
```
Par défaut, l'API sera disponible sur http://localhost:5142


### Lancer le frontend
```bash
cd schedule-management
npm install
npm start
```
L'application sera disponible sur http://localhost:3000
