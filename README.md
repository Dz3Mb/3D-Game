# 🚀 Tank Game - Développement avec BabylonJS

## 📌 Présentation du projet
Ce projet est un jeu développé avec **BabylonJS** en **TypeScript**, où un tank peut se déplacer sur un terrain, éviter des obstacles et ramasser des bonus.  

L'objectif était d'explorer **les bases de BabylonJS** tout en créant un gameplay fluide et interactif.  

## 🛠️ **Démarche & Évolution du projet**
### **1️⃣ Création du projet & mise en place de BabylonJS**
- Initialisation du projet avec **Vite** pour un développement rapide en TypeScript.
- Ajout de **BabylonJS** pour gérer la scène, la caméra et les objets 3D.
- Création d'un fichier **`Game.ts`** pour gérer la scène principale.

### **2️⃣ Création du tank & gestion des mouvements**
- Construction du tank avec des **primitives de BabylonJS** (`Box`, `Cylinder`).
- Séparation du tank en plusieurs parties : **corps, tourelle, canon et chenilles**.
- Ajout d'un **système de déplacement réaliste** :
  - **Accélération progressive**
  - **Freinage progressif**
  - **Rotation fluide** (différente en marche avant et arrière)
- Gestion des entrées clavier pour le **déplacement du tank**.

### **3️⃣ Caméra dynamique & suivi du tank**
- Mise en place d'une **FollowCamera** pour suivre le tank.
- Ajout d'une **caméra libre** (activable avec la souris) permettant de regarder autour (ON PROGRESS).
- Amélioration de la gestion de caméra pour **un effet plus naturel**, proche des jeux de conduite.

### **4️⃣ Terrain & environnement**
- Création d’un **Sol** avec une texture d’herbe (`grass.jpg`).
- Ajout d'une **Skybox** pour donner un effet d'environnement ouvert.
- Test de plusieurs textures de sol (route pavée, terrain rocheux).

### **5️⃣ Implémentation des bonus et obstacles**
- Création de la classe **`GameObject.ts`** pour gérer **les objets interactifs** (bonus/malus).
- Ajout de **sphères vertes (bonus)** et **cubes rouges (obstacles)** qui :
  - **Bougent légèrement** pour rendre le jeu plus dynamique.
  - **Disparaissent lorsqu'ils sont touchés par le tank**.
  - **Modifient le score** (+10 pour un bonus, -10 pour un obstacle).
- Gestion d’un **spawn espacé** entre les objets pour éviter qu'ils apparaissent collés les uns aux autres.

### **6️⃣ Corrections & améliorations**
- Ajustement du **système de collisions** pour éviter que le tank traverse les objets.
- Amélioration du **système de rotation** du tank pour être plus naturel.
- Correction des **touches inversées en marche arrière**.
- Ajout d’un **système de gestion du score** avec affichage console.

## 🎮 **Fonctionnalités actuelles**
✔ **Déplacement du tank avec une physique améliorée**  
✔ **Caméra qui suit le tank + mode libre activable**  
✔ **Terrain herbeux + Skybox réaliste**  
✔ **Bonus et obstacles qui bougent et disparaissent au contact**  
✔ **Système de score dynamique**  

## 🚀 **Idées d’amélioration**
💡 Ajouter **un modèle 3D** de tank à la place des formes de base.  
💡 Intégrer **un système de tirs** avec des projectiles.  
💡 Ajouter des **ennemis** ou des tanks adverses.  
💡 Implémenter une **mini-carte** pour mieux voir les obstacles.  

## 🛠️ **Installation & Exécution**
### **Prérequis**
- **Node.js** et **Vite** installés.

### **Installation**
```sh
git clone https://github.com/ton-repo/tank-game-babylonjs.git
cd tank-game-babylonjs
npm install
npm run dev
