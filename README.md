# Systeme de Gestion d'Emploi du Temps

Un projet full stack permettant de gérer un emploi du temps pour les enseignants, etudiants et salles de cous.
Développé avec React.js, React Native, ASP.Net Core (Entity Framework), et MySQL.

## Fonctionnalites principales
- Authentification et gestion des utilisateurs (responsable/enseignants)
- Gestion des matières, enseignants, salles et classes
- Création et mise a jour d'emplois du temps
- Visualisation de l'emploi du temps (par jour/semaine/mois/mention/niveau)
- Exportation en PDF de l'emploi du temps

## Installation et lancement
### Cloner le projet

#### `git clone https://github.com/Lovasoa3691/schedule-management.git`
#### `cd schedule-management`

### Installer le runtime et dotnet SDK 8.0
### Configurer la base de données

#### `Configure la connection dans appsettings.json (backend):`
"ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=db_edt_p;User=ton_username;Password=ton_mot_de_passe"
  }

### Applique les migrations EF:

#### `cd backend/edt_api`
#### `dotnet ef database update`

### Lancer le backend

#### `dotnet run`

Par défaut, l'API sera disponible sut http://localhost:5142

### Lancer le frontend

#### `cd schedule-management`
#### `npm install`
#### `npm start`

L'application sera disponible sur http://localhost:3000
