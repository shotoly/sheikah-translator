# 🗡️ Tablette Sheikah - Traducteur de Runes & Export SVG
> **The Legend of Zelda (Breath of the Wild / Tears of the Kingdom)**  
> Application web interactive pour traduire du texte en écriture Sheikah en temps réel et l'exporter en SVG vectoriel ou PNG haute résolution.
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
