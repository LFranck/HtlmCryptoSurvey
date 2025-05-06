# Crypto Survey - Suivi des cours des cryptomonnaies en temps réel

## Description
**Crypto Survey** est une application simple en projet prototype qui permet de suivre en temps réel les cours des cryptomonnaies. Elle s'appuie sur l'API de **CryptoCompare** pour récupérer les données des cryptomonnaies ainsi que les historiques de prix (minute, heure, jour).

L'interface possède une visualisation via le graphe des variations des cours et des indicateurs tels que :
- Les cours "low" (cours le plus bas) et "high" (cours le plus haut),
- Les moyennes des cours.
- Un système de notification pour surveiller les opportunités d'achat et de vente.

## Fonctionnalités
### Frontend
1. **Interface simple de sélection**
    - Sélecteurs pour choisir :
        - La plateforme d'échange (*Exchange*) parmi des options comme Kraken, Bitfinex...
        - La cryptomonnaie (*Crypto*) à suivre, comme Bitcoin, Ethereum, Ripple...
        - La devise de conversion (*currency*) : EUR, USD, etc.
    - Paramètres configurables pour les calculs de tendances :
        - Moyennes calculées sur plusieurs jours.
        - Critères pour les opportunités d'achat/vente (% et paramètres spécifiques).

2. **Graphiques interactifs**
    - Utilise Google Charts pour afficher les courbes des tendances.
    - Annotations automatiques pour signaler les moments intéressants.

3. **Affichage en temps réel**
    - Informations mises à jour automatiquement toutes les 30 secondes :
        - Données des minutes.
        - Données des heures.
        - Données des jours.
    - Système de notification natif pour alerter des opportunités d'achat ou de vente.

---

### Backend (Scripts JavaScript)
1. **Appels API** via `XMLHttpRequest` (à moderniser avec `fetch` dans le futur).
2. **Calcul de moyennes et analyses**
    - Calcul des moyennes glissées pour les cours des jours précédents.
    - Détection des signaux d'achat/vente basés sur des critères configurables.
3. **Gestion des données JSON**
    - Lecture, parsing et manipulation des réponses JSON de l'API Cryptocompare.

---

## Installation et Déploiement
### Prérequis
1. Un navigateur moderne (Google Chrome, Firefox, etc.) qui supporte les **notifications natives**.
2. Une connexion Internet pour appeler l'API.
3. Télécharger le fichier **`htmlcryptosurvey.html`** et ses dépendances dans un répertoire local.

### Étapes d'installation
1. **Récupération des fichiers**
   Téléchargez tous les fichiers requis :
    - `htmlcryptosurvey.html` – Fichier principal contenant le code HTML et JavaScript.
    - `fonctions.js` – Fichier des fonctions utilitaires.
    - `loading.gif` – (optionnel) Image pour afficher un indicateur de chargement.

2. **Ouvrir dans un navigateur**
   Ouvrez le fichier `htmlcryptosurvey.html` dans un navigateur.

3. **Sélectionner les paramètres**
   Configurez les options (plateforme d'échange, cryptomonnaie, devise, etc.) à l'aide des menus déroulants dans l'interface.

---

## API Utilisée
Ce projet utilise **CryptoCompare API** :
- [Documentation officielle de Cryptocompare](https://min-api.cryptocompare.com)
- Points de terminaison utilisés :
    - `/data/blockchain/list` : Récupération de la liste des blockchains disponibles.
    - `/data/v2/histominute` : Historique des cours à la minute.
    - `/data/v2/histohour` : Historique des cours à l'heure.
    - `/data/v2/histoday` : Historique quotidien.

👉 **Remarque** : Les appels à l'API doivent respecter les limites d'utilisation définies par CryptoCompare.

---

## Structure du Projet

Voici les principaux fichiers présents dans le projet :

### Fichiers HTML

1. **htmlcryptosurvey.html** :
    - Fichier principal pour afficher les cours de cryptomonnaies en temps réel.
    - Contient une interface utilisateur permettant de :
        - Sélectionner une plateforme d'échange (*Exchange*).
        - Choisir parmi les cryptomonnaies disponibles (Bitcoin, Ethereum, etc.).
        - Configurer la devise de conversion (EUR, USD, etc.).
        - Personnaliser les critères pour les alertes d'achat/vente.
    - Utilise Google Charts pour les graphiques interactifs.
    - Notifications natives pour signaler des opportunités basées sur les critères.

2. **htmlcryptoactions.html** :
    - Affiche un résumé des actions par cryptomonnaie sur plusieurs plateformes.
    - Divise les informations par blocs pour chaque cryptomonnaie et plateforme.
    - Ajoute des indicateurs visuels pour les variations (hausse, baisse, stable) des cours.
    - Permet de visualiser rapidement les signaux d'achat ou de vente à l'aide d'annotations.

3. **htmlReadExchange.html** :
    - Lit et affiche une liste complète des cryptomonnaies récupérées via l'API CryptoCompare.
    - Permet de répertorier toutes les cryptocurrencies supportées et de faciliter leur intégration dans le projet.
    - Appel d'API clé : `https://min-api.cryptocompare.com/data/all/coinlist?summary=1`.

4. **htmlcryptostats.html** :
    - Utilisé pour simuler et déterminer les meilleurs paramètres d'achat et de vente.
    - Fonctionnalités :
        - Calculs automatisés des moyennes mobiles sur plusieurs jours.
        - Génération de tableaux comparatifs :
            - Teste différentes combinaisons des paramètres comme le pourcentage minimum de variation et le nombre de critères vérifiés.
            - Affiche les gains potentiels sous forme de multiplicateurs.
    - Permet d'optimiser les stratégies d'investissement en sélectionnant les configurations les plus efficaces.
    - Interface intuitive avec des options de crypto, exchange, devise, et point de départ d'analyse.

---

### Fichier JavaScript
1. **fonctions.js** :
    - Bibliothèque de fonctions utilitaires utilisées par les fichiers HTML. Voici les fonctionnalités principales :
        - `constructUrl` : Génère les URLs pour interroger l'API de CryptoCompare avec les bons paramètres.
        - `formatDate`, `timeConverter`, `hourConverter` : Fonctions de manipulation et formatage de dates (convertit un timestamp UNIX en date lisible).
        - `numAverage` : Calcule la moyenne des valeurs d'un tableau.
        - `formatMontant`, `formatCoin` : Formate les montants financiers et ajoute l'unité correspondante.
        - `getJson` : Effectue des appels HTTP vers des API et traite la réponse JSON en fonction du retour.
        - `notifyMe` : Gère les notifications natives pour informer l'utilisateur des opportunités.
        - `popup` : Affiche un contenu dans une fenêtre popup.

---

Cette structure fournit une base cohérente pour un prototype de suivi en temps réel des cryptomonnaies. Chaque fichier a un rôle précis :
- Les fichiers HTML composent l'interface utilisateur.
- Le fichier `fonctions.js` regroupe la logique fonctionnelle et réutilisable.

---

## Prochaines Améliorations
1. **Modernisation**
    - Remplacer les appels `XMLHttpRequest` par `fetch` pour plus de lisibilité et de performance.
    - Ajouter des gestionnaires d'erreurs plus robustes pour les appels API.

2. **Amélioration de l'interface**
    - Utiliser des frameworks CSS comme Bootstrap pour une meilleure mise en page.
    - Ajouter des options pour gérer les fuseaux horaires.

3. **Optimisation JS**
    - Modulariser les fonctions en plusieurs fichiers (e.g., `ApiUtils`, `DateUtils`).
    - Remplacer le code impératif par un modèle plus fonctionnel.

4. **Amélioration des tests**
    - Ajouter des tests unitaires pour les fonctions critiques comme le calcul des moyennes.
    - Ajouter un validateur pour les paramètres utilisateur.

---

## Auteur
Projet conçu par **LFRANCK, 2020**.  
API utilisée : Cryptocompare.

Pour toute suggestion ou contribution, merci de me contacter.