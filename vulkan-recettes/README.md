# Calculateur de Recettes — Vulkan Coaching

Outil web qui calcule automatiquement les portions d'une recette en fonction des macros cibles.

---

## Déployer sur Vercel (recommandé)

### Méthode 1 — Sans compte GitHub (le plus simple)

1. Va sur **https://vercel.com** et crée un compte gratuit (email suffit)
2. Sur le dashboard, clique **Add New** → **Project**
3. Clique sur **Deploy** en bas de la page, puis sur l'onglet **Upload**
4. Glisse-dépose le dossier `vulkan-recettes` complet
5. Vercel détecte automatiquement Vite, clique **Deploy**
6. En 60 secondes tu as ton lien : `vulkan-recettes.vercel.app`

### Méthode 2 — Avec GitHub (recommandé si tu veux modifier facilement plus tard)

1. Crée un compte **GitHub** si tu n'en as pas
2. Crée un nouveau repository nommé `vulkan-recettes`
3. Upload les fichiers du dossier dedans (bouton "uploading an existing file")
4. Va sur **vercel.com** → **Add New** → **Project**
5. Connecte ton GitHub, sélectionne le repo `vulkan-recettes`
6. Clique **Deploy**

Avantage : chaque modification sur GitHub redéploie automatiquement le site.

---

## Personnaliser le nom de domaine

Une fois déployé, dans Vercel :
- **Settings** → **Domains**
- Tu peux mettre un sous-domaine gratuit Vercel : `recettes-vulkan.vercel.app`
- Ou connecter un sous-domaine de vulkancoaching.fr : `recettes.vulkancoaching.fr`

Pour le sous-domaine perso, Vercel te donne les enregistrements DNS à ajouter chez ton hébergeur.

---

## Modifier les recettes

Toutes les recettes sont dans `src/App.jsx`, dans le tableau `RECETTES` en haut du fichier.

Structure d'une recette :

```js
{
  id: 22,                              // identifiant unique
  emoji: "🍲",
  category: "dejeuner_diner",          // ou "petit_dej_collation"
  nom: "Nom de la recette",
  description: "Description courte",
  note: "Conseil ou astuce importante",
  ingredients: [
    { nom:"Poulet", type:"prot", prot:25, gluc:0, lip:1, g_ref:120 },
    { nom:"Riz",    type:"gluc", prot:7,  gluc:77, lip:1, g_ref:100 },
    { nom:"Huile",  type:"lip",  prot:0,  gluc:0, lip:100, g_ref:10, max_g:20 },
    { nom:"Légumes",type:"libre",prot:0,  gluc:0, lip:0,  g_ref:0 },
  ],
  steps: [
    "Étape 1",
    "Étape 2",
  ]
}
```

### Types d'ingrédients

| type | Comportement |
|------|-------------|
| `prot` | Scale pour atteindre la cible protéines |
| `gluc` | Scale pour atteindre la cible glucides |
| `lip` | Scale pour atteindre la cible lipides |
| `fixe` | Quantité figée (pain, wrap...) — ajoute `fixe_label:"1 pain (fixe)"` |
| `libre` | À volonté, zéro calcul (légumes, épices) |

### Options supplémentaires

- `max_g: 100` → plafond en grammes (crème max 100g, fromage max 30g)
- `min_g: 50` → minimum en grammes
- `egg: true` → affiche en nombre d'œufs au lieu de grammes (base 50g/œuf)

**Important :** les macros sont toujours données **pour 100g cru**.

---

## Tester en local (optionnel)

Si tu veux tester avant de déployer :

```bash
npm install
npm run dev
```

Puis ouvre `http://localhost:5173`

---

## Structure du projet

```
vulkan-recettes/
├── index.html           # Page HTML de base
├── package.json         # Dépendances
├── vite.config.js       # Config du build
└── src/
    ├── main.jsx         # Point d'entrée React
    └── App.jsx          # ⭐ Le calculateur (toutes les recettes sont ici)
```
