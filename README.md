# 🗡️ Tablette Sheikah - Traducteur de Runes & Export SVG
> **The Legend of Zelda (Breath of the Wild / Tears of the Kingdom)**  
> Application web interactive pour traduire du texte en écriture Sheikah en temps réel et l'exporter en SVG vectoriel ou PNG haute résolution.

---

## 🚀 Déploiement sur Render (Rendre le site public)

Ce projet est prêt pour un déploiement instantané sur [Render.com](https://render.com).

Vous pouvez choisir **l'une des méthodes ci-dessous** (la **Méthode 1** est la plus recommandée car elle est 100% gratuite et sans mise en veille).

---

### 🌟 Méthode 1 : Déploiement en "Static Site" (Recommandé & 100% Gratuit)

Les sites statiques sur Render sont **totalement gratuits, ultra-rapides et ne se mettent jamais en veille** (aucun temps de démarrage à froid).

#### Étape 1 : Publier le code sur GitHub
Si ce n'est pas déjà fait, créez un dépôt sur [GitHub](https://github.com) et poussez vos fichiers :
```bash
git init
git add .
git commit -m "Initial commit - Sheikah Translator"
git branch -M main
git remote add origin https://github.com/VOTRE_PSEUDO/sheikah-translator.git
git push -u origin main
```

#### Étape 2 : Configurer sur Render
1. Rendez-vous sur [Render.com](https://render.com) et connectez-vous (avec votre compte GitHub).
2. Cliquez sur le bouton bleu **"New +"** en haut à droite, puis sélectionnez **"Static Site"**.
3. Choisissez votre dépôt GitHub **`sheikah-translator`** et cliquez sur **"Connect"**.
4. Remplissez les champs comme suit :
   - **Name** : `sheikah-translator` (ou le nom de votre choix)
   - **Branch** : `main`
   - **Build Command** : *(laissez vide)*
   - **Publish Directory** : `./` *(ou simplement un point `.`)*
5. Cliquez sur **"Create Static Site"**.

🎉 **Votre site est déployé en moins de 15 secondes !** Render vous fournira une URL publique sécurisée en HTTPS :  
`https://sheikah-translator.onrender.com`

---

### ⚙️ Méthode 2 : Déploiement en 1 Clic via le Blueprint (`render.yaml`)

Le fichier [`render.yaml`](./render.yaml) est déjà présent à la racine du projet :
1. Sur Render, cliquez sur **"New +"** $\to$ **"Blueprint"**.
2. Connectez votre dépôt GitHub.
3. Render lira automatiquement la configuration du fichier `render.yaml` (règles de réécriture, mise en cache des assets, sécurité).
4. Cliquez sur **"Apply"**.

---

### 🖥️ Méthode 3 : Déploiement en "Web Service" (Node.js)

Si vous préférez exécuter l'application via un serveur Node.js dédié :
1. Sur Render, cliquez sur **"New +"** $\to$ **"Web Service"**.
2. Connectez votre dépôt GitHub.
3. Remplissez les champs :
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
4. Cliquez sur **"Create Web Service"**.
Le fichier [`server.js`](./server.js) prendra automatiquement en charge l'écoute sur le port dynamique `process.env.PORT` et l'adresse `0.0.0.0`.

---

## 💻 Test en Local

### Avec Node.js :
```bash
npm start
# Le serveur démarre sur http://localhost:3000
```

### Avec Python :
```bash
python -m http.server 8080
# Ouvrez http://localhost:8080
```

---

## 🎨 Fonctionnalités de l'Application

- **Interface Tablette Sheikah** : Biseaux métalliques, rivets, scanlines holographiques et animation de l'Œil de la Vérité.
- **Traduction Temps Réel** : Prise en charge de tout l'alphabet A-Z, des chiffres 0-9, des ponctuations (`!`, `?`, `.`) et de l'espace Sheikah avec normalisation automatique des accents (`é` $\to$ `e`, etc.).
- **Personnalisation Complète** :
  - Taille des runes, espacement horizontal et interligne.
  - Palettes de couleurs énergétiques (Cyan Sheikah, Orange Gardien, Vert Soneau, Or Déesse, Monochrome) + Sélecteur hexadécimal.
  - Choix d'arrière-plan (Ardoise Sheikah sombre, Transparent, Nuit, Blanc).
  - Mode espace (glyphe `SPACE.svg` ou espace blanc traditionnel).
  - Sous-titres latins optionnels sous chaque rune.
  - Effet de halo néon commutable.
- **Export Vectoriel SVG** :
  - Génère un fichier SVG 100% autonome, propre et conforme aux standards du W3C.
  - Bouton **Télécharger SVG** (.svg).
  - Bouton **Copier le code SVG** dans le presse-papier.
  - Bouton **Télécharger PNG** (rendu haute résolution).
- **Codex des 40 Glyphes** : Grille interactive permettant d'insérer les caractères d'un clic.
- **Effets Sonores Synthétisés** : Bips cristallins anciens utilisant l'API Web Audio (aucun fichier audio lourd, commutateur muet disponible).

---

## 📁 Architecture du Projet

```text
sheika translate/
├── index.html          # Interface HTML5 de la Tablette Sheikah
├── render.yaml         # Configuration de déploiement automatique Render
├── package.json        # Déclaration du projet et scripts Node.js
├── server.js           # Serveur HTTP Node.js natif haute performance
├── .gitignore          # Fichiers exclus du contrôle de version
├── css/
│   ├── style.css       # Structure, sliders et composants
│   └── sheikah-theme.css # Thème graphique Sheikah (biseaux, néons, scanlines)
├── js/
│   ├── sheikah-data.js # Dictionnaire vectoriel des 40 glyphes Sheikah
│   ├── translator.js   # Moteur de traduction et rendu DOM dynamique
│   ├── exporter.js     # Compilateur SVG unique & export PNG
│   ├── audio.js        # Synthétiseur d'effets sonores Web Audio API
│   └── app.js          # Contrôleur principal et gestion des événements
└── letter/             # 40 fichiers SVG sources des lettres et symboles
```
