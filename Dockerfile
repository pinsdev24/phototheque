# Utiliser une image officielle Node.js comme image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]