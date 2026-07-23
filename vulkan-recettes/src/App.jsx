
import { useState, useMemo, useEffect } from "react";

// ── VULKAN COACHING — DA officielle (issue du design system du site) ──
const RED        = "#7E1D2B";  // bordeaux signature — accent principal
const RED_BRIGHT = "#B5293C";  // ember — hover, accents chauds, protéines
const RED_DEEP   = "#5E1622";  // structurel — barres, séparateurs
const RED_VEIN   = "#240810";  // quasi-noir bordeaux — vignettes
const GOLD       = "#C7A24A";  // reflet métallique — RARE, réservé aux temps forts
const GOLD_LIGHT = "#E4C36A";
const STEEL      = "#9A9CA1";  // glucides — accent neutre métallique
const STEEL_LIGHT= "#C6C8CD";

const DARK        = "#000000"; // noir pur — fond principal
const INK         = "#0C0A0A";
const STONE_DEEP  = "#120F0F";
const STONE       = "#1A1616";
const STONE_MID   = "#221C1C";
const STONE_LIGHT = "#2D2424";

const WHITE      = "#F4F1EC";  // blanc chaud
const GRAY       = "#B4ABAB";  // neutral-300
const GRAY_MUTED = "#756B6B";  // neutral-500
const GRAY_DIM   = "#4A4242";  // neutral-700

const F_DISPLAY   = "'Cinzel', Georgia, serif";
const F_CONDENSED = "'Barlow Condensed', sans-serif";
const F_BODY      = "'Barlow', -apple-system, BlinkMacSystemFont, sans-serif";

const SHADOW_RED_GLOW = "0 0 36px rgba(94,22,34,0.55), 0 0 10px rgba(181,41,60,0.45)";
const SHADOW_GOLD_SM  = "0 0 8px rgba(199,162,74,0.3)";
const SHADOW_MD       = "0 4px 16px rgba(0,0,0,0.5)";
const SHADOW_LG       = "0 8px 32px rgba(0,0,0,0.6)";

// Alias de compatibilité (le reste du fichier utilise encore ORANGE pour les glucides)
const ORANGE = STEEL_LIGHT;


// ── RECETTES ──
// Macros TOUJOURS pour 100g cru
// type: "prot" | "gluc" | "lip" | "fixe" | "libre"
// max_g: plafond optionnel
const RECETTES = [
  // ════ PETIT-DÉJ / COLLATION ════
  {
    id:1, emoji:"🥞", category:"petit_dej_collation",
    nom:"Pancakes protéinés",
    description:"Moelleux, rapides, topping whey pour la touche sucrée.",
    note:"Ne pas trop mélanger la pâte — quelques grumeaux c'est normal pour des pancakes aérés.",
    ingr:["avoine","oeuf"], tags:["sucre","rapide"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine",          type:"gluc", prot:13, gluc:68, lip:7,  g_ref:60  },
      { nom:"Lait d'amandes sans sucre", type:"lip",  prot:0,  gluc:0,  lip:1,  g_ref:150, max_g:250, min_g:50 },
      { nom:"Œuf entier",                type:"prot", prot:13, gluc:1,  lip:10, g_ref:50, egg:true  },
      { nom:"Whey (topping)",            type:"prot", prot:80, gluc:5,  lip:2,  g_ref:20  },
      { nom:"Levure chimique",           type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Sucralose / cannelle",      type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Mixer les flocons d'avoine en farine grossière.","Mélanger farine d'avoine + œuf + lait d'amandes jusqu'à obtenir une pâte homogène.","Laisser reposer 5 min. Cuire à feu moyen dans une poêle légèrement huilée, ~2 min par face.","Diluer la whey avec un peu d'eau ou de lait d'amandes pour faire un topping semi-liquide.","Verser le topping whey sur les pancakes au moment de servir."]
  },
  {
    id:2, emoji:"🍎", category:"petit_dej_collation",
    nom:"Overnight oats pomme cannelle",
    description:"Prépare la veille, prêt le matin. Aucune excuse.",
    note:"Plus les flocons trempent longtemps, plus c'est onctueux. 8h minimum.",
    ingr:["avoine"], tags:["sucre","rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine", type:"gluc", prot:13, gluc:68, lip:7,  g_ref:60  },
      { nom:"Skyr nature",      type:"prot", prot:10, gluc:4,  lip:0,  g_ref:150 },
      { nom:"Fromage blanc 0%", type:"prot", prot:8,  gluc:4,  lip:0,  g_ref:100 },
      { nom:"Pomme",            type:"gluc", prot:0,  gluc:14, lip:0,  g_ref:120 },
      { nom:"Cannelle",         type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Mélanger flocons + skyr + fromage blanc dans un bol ou bocal.","Râper ou couper la pomme en petits morceaux, incorporer.","Ajouter cannelle généreusement + sucralose si besoin.","Couvrir et laisser au frigo toute la nuit (min 6h).","Consommer froid, directement au réveil."]
  },
  {
    id:3, emoji:"🍌", category:"petit_dej_collation",
    nom:"Overnight oats banane",
    description:"Version plus gourmande avec la banane pour sucrer naturellement.",
    note:"La banane bien mûre donne plus de goût sucré sans rien ajouter.",
    ingr:["avoine"], tags:["sucre","rapide"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine", type:"gluc", prot:13, gluc:68, lip:7,  g_ref:60  },
      { nom:"Skyr nature",      type:"prot", prot:10, gluc:4,  lip:0,  g_ref:150 },
      { nom:"Whey protéine",    type:"prot", prot:80, gluc:5,  lip:2,  g_ref:25  },
      { nom:"Banane",           type:"gluc", prot:1,  gluc:23, lip:0,  g_ref:80  },
      { nom:"Beurre cacahuète", type:"lip",  prot:25, gluc:7,  lip:50, g_ref:15, max_g:30 },
    ],
    steps:["Écraser la banane à la fourchette.","Mélanger flocons + skyr + banane écrasée dans un bocal.","Diluer la whey dans un peu d'eau et incorporer au mélange.","Ajouter le beurre de cacahuète par-dessus.","Filmer et laisser au frigo toute la nuit. Consommer froid."]
  },
  {
    id:4, emoji:"🍫", category:"petit_dej_collation",
    nom:"Porridge avoine choco banane",
    description:"Version chaude réconfortante. La whey choco en touche finale.",
    note:"Ajoute la whey hors du feu pour éviter les grumeaux.",
    ingr:["avoine"], tags:["sucre","reconfort"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine", type:"gluc", prot:13, gluc:68, lip:7,  g_ref:60  },
      { nom:"Lait écrémé",      type:"gluc", prot:3,  gluc:5,  lip:0,  g_ref:200, max_g:350 },
      { nom:"Banane",           type:"gluc", prot:1,  gluc:23, lip:0,  g_ref:80  },
      { nom:"Whey chocolat",    type:"prot", prot:80, gluc:5,  lip:2,  g_ref:25  },
    ],
    steps:["Verser flocons + lait dans une casserole, cuire à feu moyen en remuant 4-5 min.","Retirer du feu quand la consistance est crémeuse.","Couper la banane en rondelles, déposer sur le porridge.","Diluer la whey chocolat dans 2-3 cuillères à soupe d'eau froide.","Verser le topping whey sur le porridge et servir."]
  },
  {
    id:5, emoji:"🍏", category:"petit_dej_collation",
    nom:"Porridge pomme cannelle",
    description:"Version chaude classique, rassasiante et simple.",
    note:"La pomme peut être cuite avec les flocons pour plus de fondant.",
    ingr:["avoine"], tags:["sucre","reconfort"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine", type:"gluc", prot:13, gluc:68, lip:7,  g_ref:60  },
      { nom:"Lait écrémé",      type:"gluc", prot:3,  gluc:5,  lip:0,  g_ref:200, max_g:350 },
      { nom:"Pomme",            type:"gluc", prot:0,  gluc:14, lip:0,  g_ref:120 },
      { nom:"Skyr nature",      type:"prot", prot:10, gluc:4,  lip:0,  g_ref:100 },
      { nom:"Cannelle",         type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Couper la pomme en petits dés.","Verser flocons + lait + dés de pomme dans une casserole.","Cuire 5-6 min à feu moyen en remuant régulièrement.","Retirer du feu, ajouter cannelle généreusement.","Servir avec le skyr nature en accompagnement ou mélangé."]
  },
  {
    id:6, emoji:"🍚", category:"petit_dej_collation",
    nom:"Riz au lait protéiné",
    description:"Comfort food version coaching. Sucré, crémeux, sans culpabiliser.",
    note:"Ajoute la whey uniquement après refroidissement partiel — sinon grumeaux garantis.",
    ingr:["riz"], tags:["sucre","reconfort"],
    temps:"t30",
    ingredients:[
      { nom:"Riz rond / dessert", type:"gluc", prot:7,  gluc:78, lip:0,  g_ref:60  },
      { nom:"Lait écrémé",        type:"gluc", prot:3,  gluc:5,  lip:0,  g_ref:300, max_g:400 },
      { nom:"Whey protéine",      type:"prot", prot:80, gluc:5,  lip:2,  g_ref:25  },
      { nom:"Sucralose",          type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Verser le riz + lait dans une casserole, cuire à feu doux en remuant.","Cuire 25-30 min jusqu'à absorption quasi-totale du lait. Remuer souvent.","Ajouter sucralose selon goût.","Laisser tiédir 5 min hors du feu.","Diluer la whey dans 2 cuillères à soupe d'eau froide, incorporer hors du feu en mélangeant bien."]
  },
  {
    id:7, emoji:"🍞", category:"petit_dej_collation",
    nom:"Pain perdu healthy",
    description:"La version coaching du pain perdu. Topping whey pour la gourmandise.",
    note:"Feu moyen-doux pour bien cuire l'intérieur sans brûler l'extérieur.",
    ingr:["pain","oeuf"], tags:["sucre","reconfort"],
    temps:"t15",
    ingredients:[
      { nom:"Brioche Harrys allégée (tranche)", type:"fixe", prot:8.5, gluc:46, lip:10, g_ref:27,  unit_scalable:true, max_units:2, unit_name:"tranche" },
      { nom:"Œuf entier",        type:"fixe", prot:13, gluc:1,  lip:10, g_ref:50,  fixe_label:"1 œuf (fixe)" },
      { nom:"Blanc d'œuf",       type:"prot", prot:11, gluc:1,  lip:0,  g_ref:60  },
      { nom:"Whey (topping)",    type:"prot", prot:80, gluc:5,  lip:2,  g_ref:20  },
      { nom:"Sucralose + arôme vanille", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
    ],
    steps:["Battre l'œuf entier + blanc d'œuf + sucralose + arôme vanille dans une assiette creuse.","Tremper la tranche de brioche des deux côtés dans le mélange œuf.","Cuire à la poêle à feu moyen-doux avec une légère vaporisation d'huile, 2-3 min par face.","Diluer la whey dans très peu d'eau pour obtenir un topping épais.","Napper le pain perdu avec le topping whey. Servir chaud."]
  },
  {
    id:8, emoji:"🍳", category:"petit_dej_collation",
    nom:"Omelette sucrée",
    description:"L'omelette version dessert. Surprenant, mais ça marche.",
    note:"La banane bien mûre donne une texture fondante et sucre naturellement.",
    ingr:["oeuf"], tags:["sucre","rapide"],
    temps:"t15",
    ingredients:[
      { nom:"Œufs entiers",     type:"prot", prot:13, gluc:1,  lip:10, g_ref:50, egg:true  },
      { nom:"Blanc d'œuf",      type:"prot", prot:11, gluc:1,  lip:0,  g_ref:80  },
      { nom:"Banane",           type:"gluc", prot:1,  gluc:23, lip:0,  g_ref:80  },
      { nom:"Fromage blanc 0%", type:"prot", prot:8,  gluc:4,  lip:0,  g_ref:100 },
    ],
    steps:["Écraser la banane à la fourchette jusqu'à obtenir une purée.","Battre les œufs entiers + blancs, incorporer la banane écrasée.","Cuire à la poêle à feu doux, ne pas retourner — laisser cuire à couvert.","Déposer le fromage blanc au centre avant de plier l'omelette.","Servir chaud. Ajouter sucralose et cannelle selon goût."]
  },
  {
    id:9, emoji:"🎂", category:"petit_dej_collation",
    nom:"Bowlcake protéiné",
    description:"Gâteau en bol au micro-ondes. Prêt en 90 secondes.",
    note:"Ne pas trop cuire — il doit rester légèrement humide au centre à la sortie du micro-ondes.",
    ingr:["avoine","oeuf"], tags:["sucre","rapide"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine",           type:"gluc", prot:13, gluc:68, lip:7,  g_ref:40  },
      { nom:"Œuf entier",                 type:"fixe", prot:13, gluc:1,  lip:10, g_ref:50,  fixe_label:"1 œuf (fixe)", egg:true },
      { nom:"Fromage blanc 0%",           type:"prot", prot:8,  gluc:4,  lip:0,  g_ref:100 },
      { nom:"Whey protéine",              type:"prot", prot:80, gluc:5,  lip:2,  g_ref:25  },
      { nom:"Lait d'amandes sans sucre",  type:"lip",  prot:0,  gluc:0,  lip:1,  g_ref:50,  max_g:100 },
      { nom:"Levure chimique",            type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Sucralose + arôme",          type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Mixer les flocons en farine ou utiliser tels quels pour texture rustique.","Mélanger tous les ingrédients dans un grand bol allant au micro-ondes.","Ajouter sucralose + arôme (vanille ou chocolat) et une pincée de levure.","Cuire au micro-ondes puissance max, 60 à 90 secondes. Vérifier — le centre doit être à peine pris.","Laisser reposer 1 min avant de déguster (continue de cuire)."]
  },
  {
    id:10, emoji:"🥣", category:"petit_dej_collation",
    nom:"Porridge avoine nature",
    description:"La base. Simple, efficace, modulable à l'infini.",
    note:"Consistance selon le ratio flocons/lait. Plus de lait = plus crémeux.",
    ingr:["avoine"], tags:["leger","rapide"],
    temps:"t15",
    ingredients:[
      { nom:"Flocons d'avoine", type:"gluc", prot:13, gluc:68, lip:7,  g_ref:60  },
      { nom:"Lait écrémé",      type:"gluc", prot:3,  gluc:5,  lip:0,  g_ref:200, max_g:350 },
      { nom:"Skyr nature",      type:"prot", prot:10, gluc:4,  lip:0,  g_ref:150 },
      { nom:"Fruits au choix",  type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Verser flocons + lait dans une casserole ou bol micro-ondes.","Casserole : cuire 4-5 min à feu moyen en remuant. Micro-ondes : 2 min puissance max.","Ajuster la consistance avec un peu de lait si trop épais.","Servir avec le skyr à côté ou mélangé pour plus de protéines.","Ajouter les fruits au choix et sucralose selon goût."]
  },
  {
    id:11, emoji:"🥛", category:"petit_dej_collation",
    nom:"Fromage blanc + flocons",
    description:"La collation de base. Zéro préparation, zéro excuse.",
    note:"Ajoute cannelle, extrait de vanille ou sucralose pour varier.",
    ingr:["avoine"], tags:["rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Fromage blanc 0%", type:"prot", prot:8,  gluc:4,  lip:0,  g_ref:200 },
      { nom:"Flocons d'avoine", type:"gluc", prot:13, gluc:68, lip:7,  g_ref:40  },
      { nom:"Amandes",          type:"lip",  prot:21, gluc:7,  lip:50, g_ref:15,  max_g:25 },
    ],
    steps:["Verser le fromage blanc dans un bol.","Ajouter les flocons d'avoine par-dessus.","Ajouter les amandes et les épices selon goût.","Consommer immédiatement ou laisser les flocons ramollir 5 min."]
  },
  {
    id:12, emoji:"🍓", category:"petit_dej_collation",
    nom:"Skyr + fruit",
    description:"Option rapide si tu es en déplacement.",
    note:"Préfère les fruits entiers aux jus.",
    ingr:[], tags:["rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Skyr nature",      type:"prot", prot:10, gluc:4,  lip:0,  g_ref:200 },
      { nom:"Whey protéine",    type:"prot", prot:80, gluc:5,  lip:2,  g_ref:20  },
      { nom:"Banane",           type:"gluc", prot:1,  gluc:23, lip:0,  g_ref:100 },
      { nom:"Beurre cacahuète", type:"lip",  prot:25, gluc:7,  lip:50, g_ref:10,  max_g:20 },
    ],
    steps:["Verser le skyr dans un bol.","Diluer la whey dans une cuillère à soupe d'eau, incorporer au skyr.","Couper la banane en rondelles, déposer sur le skyr.","Ajouter le beurre de cacahuète par-dessus."]
  },
  // ════ DÉJEUNER / DÎNER ════
  {
    id:13, emoji:"🍛", category:"dejeuner_diner",
    nom:"Bol Riz Poulet Curry",
    description:"Batch cooking idéal. Prépare en grande quantité.",
    note:"Curry en poudre à volonté — zéro calorie. Légumes verts à volonté.",
    ingr:["poulet","riz"], tags:["familial","reconfort"],
    temps:"t30",
    ingredients:[
      { nom:"Blanc de poulet",  type:"prot", prot:25, gluc:0,  lip:1,  g_ref:140 },
      { nom:"Riz",              type:"gluc", prot:7,  gluc:77, lip:1,  g_ref:100 },
      { nom:"Crème légère 4%", type:"lip",  prot:3,  gluc:3,  lip:4,  g_ref:80,  max_g:100 },
      { nom:"Haricots verts",   type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Curry en poudre",  type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Cuire le riz dans l'eau bouillante salée selon le temps indiqué sur le paquet.","Couper le poulet en dés, cuire à la poêle avec un peu d'huile ou à sec.","Ajouter le curry en poudre généreusement sur le poulet en cours de cuisson.","Verser la crème légère, laisser mijoter 3-4 min à feu doux.","Servir riz + poulet curry + légumes verts (vapeur ou poêlés)."]
  },
  {
    id:14, emoji:"🍝", category:"dejeuner_diner",
    nom:"Pasta Carbo (version sèche)",
    description:"La vraie carbo... allégée. Et si t'es pas italien, la crème aussi 😄",
    note:"Mélange hors du feu OBLIGATOIRE — sinon l'œuf cuit et ça fait des œufs brouillés.",
    ingr:["pates","porc_jambon","oeuf","fromage"], tags:["reconfort","familial"],
    temps:"t30",
    ingredients:[
      { nom:"Allumettes bacon 3%", type:"prot", prot:17, gluc:0,  lip:3,  g_ref:100 },
      { nom:"Pâtes",               type:"gluc", prot:12, gluc:75, lip:1,  g_ref:80  },
      { nom:"Crème légère",        type:"lip",  prot:2,  gluc:3,  lip:10, g_ref:60,  max_g:100 },
      { nom:"Comté",               type:"lip",  prot:27, gluc:0,  lip:33, g_ref:15,  max_g:30  },
      { nom:"Œuf entier",          type:"fixe", prot:7,  gluc:0,  lip:5,  g_ref:50,  fixe_label:"1 œuf (fixe)", egg:true },
      { nom:"Légumes verts",       type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Cuire les pâtes al dente, réserver une louche d'eau de cuisson.","Faire revenir les allumettes de bacon à sec dans une poêle.","Dans un bol, battre l'œuf + crème + comté râpé.","Éteindre le feu, ajouter les pâtes égouttées dans la poêle.","Verser le mélange œuf-crème hors du feu, mélanger rapidement avec un peu d'eau de cuisson pour lier."]
  },
  {
    id:15, emoji:"🍔", category:"dejeuner_diner",
    nom:"Burger Maison",
    description:"Le burger qui rentre dans le plan. Sauce zéro, cheddar, le vrai truc.",
    note:"Cuire les frites au four ou air fryer sans huile — ça change tout.",
    ingr:["boeuf","porc_jambon","pdt","fromage"], tags:["reconfort","familial"],
    temps:"t30",
    ingredients:[
      { nom:"Steak haché 5%",    type:"prot", prot:22, gluc:0,  lip:5,  g_ref:100 },
      { nom:"Bacon",             type:"prot", prot:20, gluc:0,  lip:10, g_ref:20  },
      { nom:"Pommes de terre",   type:"gluc", prot:2,  gluc:17, lip:0,  g_ref:200 },
      { nom:"Pain burger Jacquet",  type:"fixe", prot:8.1,gluc:47, lip:4.7,g_ref:62.5,unit_scalable:true, max_units:2, unit_name:"pain" },
      { nom:"Cheddar",           type:"fixe", prot:5,  gluc:0,  lip:7,  g_ref:20,  fixe_label:"1 tranche (fixe)" },
      { nom:"Sauce zéro",        type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Tomates / oignons", type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Couper les pommes de terre en frites, cuire au four 200°C 25 min ou air fryer 180°C 15 min.","Former le steak haché, cuire à la poêle ou grill 3-4 min par face.","Cuire le bacon à sec à la poêle jusqu'à légère croustillance.","Toaster le pain burger rapidement.","Monter le burger : pain + steak + cheddar + bacon + tomates + oignons + sauce zéro."]
  },
  {
    id:16, emoji:"🥚", category:"dejeuner_diner",
    nom:"Tortilla Pommes de terre Fromage",
    description:"La tortilla espagnole revisitée. Simple, goûteuse, batch-cookable.",
    note:"Cuisson douce et couvercle — la clé pour une tortilla bien cuite sans retourner.",
    ingr:["oeuf","pdt","fromage"], tags:["leger","familial"],
    temps:"t30",
    ingredients:[
      { nom:"Pommes de terre",    type:"gluc", prot:2,  gluc:17, lip:0,  g_ref:200 },
      { nom:"Œufs entiers",       type:"prot", prot:13, gluc:1,  lip:10, g_ref:50, egg:true  },
      { nom:"Blanc d'œuf",        type:"prot", prot:11, gluc:1,  lip:0,  g_ref:80  },
      { nom:"Fromage (emmental)", type:"lip",  prot:28, gluc:0,  lip:30, g_ref:30,  max_g:40 },
      { nom:"Herbes / épices",    type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Couper les pommes de terre en rondelles fines, cuire à la poêle ou micro-ondes.","Battre les œufs entiers + blancs, saler, poivrer, ajouter les herbes.","Disposer les rondelles de pomme de terre dans la poêle huilée.","Verser le mélange d'œufs, parsemer de fromage râpé.","Couvrir et cuire à feu doux 8-10 min jusqu'à prise complète. Passer 2 min sous le grill si besoin."]
  },
  {
    id:17, emoji:"🍜", category:"dejeuner_diner",
    nom:"Pad Thai poulet",
    description:"Version allégée du classique thaï. Savoureux et équilibré.",
    note:"La sauce soja sucrée remplace la sauce Pad Thai traditionnelle. Ajuste selon goût.",
    ingr:["poulet","oeuf"], tags:["rapide"],
    temps:"t30",
    ingredients:[
      { nom:"Nouilles de riz",   type:"gluc", prot:3,  gluc:80, lip:0,  g_ref:70  },
      { nom:"Blanc de poulet",   type:"prot", prot:25, gluc:0,  lip:1,  g_ref:120 },
      { nom:"Œuf entier",        type:"fixe", prot:13, gluc:1,  lip:10, g_ref:50,  fixe_label:"1 œuf (fixe)" },
      { nom:"Cacahuètes",        type:"lip",  prot:26, gluc:16, lip:49, g_ref:15,  max_g:25 },
      { nom:"Sauce soja sucrée", type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Légumes (pousses, oignon)", type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Tremper les nouilles de riz dans l'eau chaude 8-10 min, égoutter.","Cuire le poulet en lamelles à la poêle à feu vif.","Pousser le poulet sur le côté, casser l'œuf dans la poêle et brouiller.","Ajouter les nouilles égouttées + sauce soja sucrée, mélanger à feu vif 2 min.","Servir avec les cacahuètes concassées et les légumes crus par-dessus."]
  },
  {
    id:18, emoji:"🌮", category:"dejeuner_diner",
    nom:"Tacos poulet",
    description:"Frites air fryer + sauce fromagère maison. Le vrai truc.",
    note:"La sauce fromagère : crème 4% + comté râpé à feu doux — simple et efficace.",
    ingr:["poulet","pdt","fromage"], tags:["familial"],
    temps:"t30",
    ingredients:[
      { nom:"Blanc de poulet",  type:"prot", prot:25, gluc:0,  lip:1,  g_ref:120 },
      { nom:"Pommes de terre",  type:"gluc", prot:2,  gluc:17, lip:0,  g_ref:150 },
      { nom:"Wrap fin Old El Paso", type:"fixe", prot:8.6,gluc:53.2,lip:5.5,g_ref:32,  unit_scalable:true, max_units:2, unit_name:"wrap" },
      { nom:"Crème légère 4%", type:"lip",  prot:3,  gluc:3,  lip:4,  g_ref:50,  max_g:80 },
      { nom:"Comté",            type:"lip",  prot:27, gluc:0,  lip:33, g_ref:15,  max_g:25 },
      { nom:"Sauce zéro",       type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Couper les pommes de terre en frites fines, cuire air fryer 180°C 15 min ou four 200°C 25 min.","Émincer le poulet, cuire à la poêle avec épices (paprika, cumin, sel).","Préparer la sauce : faire fondre le comté râpé dans la crème légère à feu doux, remuer.","Chauffer le wrap 30 secondes à la poêle sèche.","Garnir : frites + poulet + sauce fromagère + sauce zéro. Plier et déguster."]
  },
  {
    id:19, emoji:"🥔", category:"dejeuner_diner",
    nom:"Gnocchis Carbo",
    description:"La carbo revisitée aux gnocchis. Encore plus réconfortante.",
    note:"Même règle que la pasta carbo : mélange HORS du feu obligatoire.",
    ingr:["pates","porc_jambon","oeuf","fromage"], tags:["reconfort"],
    temps:"t15",
    ingredients:[
      { nom:"Gnocchis",            type:"gluc", prot:6,  gluc:55, lip:1,  g_ref:100 },
      { nom:"Allumettes bacon 3%", type:"prot", prot:17, gluc:0,  lip:3,  g_ref:100 },
      { nom:"Œuf entier",          type:"fixe", prot:13, gluc:1,  lip:10, g_ref:50,  fixe_label:"1 œuf (fixe)", egg:true },
      { nom:"Crème légère",        type:"lip",  prot:2,  gluc:3,  lip:10, g_ref:50,  max_g:80 },
      { nom:"Comté",               type:"lip",  prot:27, gluc:0,  lip:33, g_ref:15,  max_g:25 },
      { nom:"Légumes verts",       type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Cuire les gnocchis dans l'eau bouillante salée jusqu'à ce qu'ils remontent à la surface (2-3 min).","Faire revenir le bacon à sec dans une poêle.","Dans un bol, battre l'œuf + crème + comté râpé.","Égoutter les gnocchis, les ajouter dans la poêle avec le bacon.","Éteindre le feu, verser le mélange œuf-crème, mélanger rapidement. Servir immédiatement."]
  },
  {
    id:20, emoji:"🥪", category:"dejeuner_diner",
    nom:"Sandwich jambon fromage",
    description:"Le classique indestructible. Rapide, portable, aucune excuse.",
    note:"Privilégie le pain complet ou céréales pour l'index glycémique.",
    ingr:["porc_jambon","pain","fromage"], tags:["rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Pain de mie complet La Boulangère", type:"gluc", prot:10, gluc:39, lip:1.9, g_ref:80  },
      { nom:"Jambon / blanc dinde", type:"prot", prot:18, gluc:0,  lip:2,  g_ref:100 },
      { nom:"Fromage (emmental)",   type:"lip",  prot:28, gluc:0,  lip:30, g_ref:30,  max_g:40 },
      { nom:"Tomates / salade",     type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Moutarde / sauce zéro",type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Trancher le pain si nécessaire.","Tartiner d'un peu de moutarde ou sauce zéro.","Déposer les tranches de jambon ou blanc de dinde.","Ajouter le fromage, les tomates et la salade.","Refermer, presser légèrement. Consommer immédiatement ou emballer pour emporter."]
  },
  {
    id:21, emoji:"🫓", category:"dejeuner_diner",
    nom:"Pain Pitta Poulet Curry",
    description:"Street food version coaching. La sauce fromage blanc curry est une tuerie.",
    note:"La sauce est la clé — assaisonne bien avec curry, sel, citron.",
    ingr:["poulet","pain"], tags:["rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Blanc de poulet",  type:"prot", prot:25, gluc:0,  lip:1,  g_ref:120 },
      { nom:"Pain pitta",       type:"fixe", prot:9,  gluc:55, lip:2,  g_ref:70,  unit_scalable:true, max_units:2, unit_name:"pitta" },
      { nom:"Fromage blanc 0%", type:"gluc", prot:8,  gluc:4,  lip:0,  g_ref:80,  max_g:100 },
      { nom:"Curry en poudre",  type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Salade / tomates", type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Émincer le poulet en lamelles, assaisonner avec curry, sel, paprika.","Cuire le poulet à la poêle à feu vif jusqu'à légère coloration.","Préparer la sauce : mélanger fromage blanc 0% + curry + sel + jus de citron.","Ouvrir le pitta, garnir de salade et tomates.","Ajouter le poulet chaud et napper généreusement de sauce curry."]
  },
  {
    id:22, emoji:"🥧", category:"dejeuner_diner",
    nom:"Quiche sans pâte",
    description:"Toute la gourmandise de la quiche, sans la pâte qui plombe les calories.",
    note:"Cuisson au four dans un plat huilé — pas besoin de pâte pour que ça tienne.",
    ingr:["oeuf","porc_jambon","fromage"], tags:["familial"],
    temps:"t45",
    ingredients:[
      { nom:"Œufs entiers",      type:"prot", prot:13, gluc:1,  lip:10, g_ref:50,  egg:true },
      { nom:"Blanc d'œuf",       type:"prot", prot:11, gluc:1,  lip:0,  g_ref:100 },
      { nom:"Jambon / blanc dinde", type:"prot", prot:18, gluc:0, lip:2, g_ref:100 },
      { nom:"Fromage (emmental)", type:"lip",  prot:28, gluc:0,  lip:30, g_ref:30,  max_g:40 },
      { nom:"Légumes (poireaux, épinards)", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
    ],
    steps:["Préchauffer le four à 180°C.","Battre les œufs entiers + blancs d'œuf dans un saladier.","Ajouter le jambon coupé en dés et le fromage râpé.","Verser dans un plat à gratin huilé, ajouter les légumes de saison.","Cuire au four 25-30 min jusqu'à ce que la quiche soit bien prise et dorée."]
  },
  {
    id:23, emoji:"🥣", category:"petit_dej_collation",
    nom:"Yaourt grec granola maison",
    description:"Le croustillant du granola sans le sucre caché du commerce.",
    note:"Toaster les flocons à sec fait toute la différence — ça donne le croquant du vrai granola.",
    ingr:["avoine"], tags:["rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Yaourt grec 0%",    type:"prot", prot:10, gluc:4,  lip:0,  g_ref:200 },
      { nom:"Flocons d'avoine toastés", type:"gluc", prot:13, gluc:68, lip:7, g_ref:40 },
      { nom:"Amandes",           type:"lip",  prot:21, gluc:7,  lip:50, g_ref:10,  max_g:20 },
      { nom:"Fruits rouges",     type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Faire toaster les flocons d'avoine à sec dans une poêle 3-4 min à feu moyen, en remuant.","Laisser refroidir complètement (ça devient croustillant en refroidissant).","Concasser grossièrement les amandes.","Verser le yaourt grec dans un bol, ajouter les flocons toastés froids et les amandes.","Ajouter les fruits rouges par-dessus juste avant de servir."]
  },
  {
    id:24, emoji:"🍣", category:"dejeuner_diner",
    nom:"Poke Bowl Saumon",
    description:"Frais, coloré, ça change du poulet-riz habituel.",
    note:"Saumon cru façon poke si ultra-frais, sinon snacké 1 min par face à la poêle.",
    ingr:["poisson","riz"], tags:["leger","rapide"],
    temps:"t15",
    ingredients:[
      { nom:"Saumon",            type:"prot", prot:20, gluc:0,  lip:13, g_ref:120 },
      { nom:"Riz",               type:"gluc", prot:7,  gluc:77, lip:1,  g_ref:100 },
      { nom:"Avocat",            type:"lip",  prot:2,  gluc:2,  lip:15, g_ref:50,  max_g:100 },
      { nom:"Edamame",           type:"fixe", prot:11, gluc:8,  lip:5,  g_ref:50,  fixe_label:"50g (fixe)" },
      { nom:"Sauce soja",        type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Cuire le riz selon les instructions du paquet, laisser tiédir.","Couper le saumon en cubes. Si non ultra-frais, snacker 1 min par face à la poêle.","Décongeler les edamame (eau bouillante 3 min ou vapeur).","Couper l'avocat en tranches ou en dés.","Assembler le bowl : riz, saumon, avocat, edamame. Napper de sauce soja."]
  },
  {
    id:25, emoji:"🍛", category:"dejeuner_diner",
    nom:"Curry de Poisson Coco Light",
    description:"Le curry version légère. Le lait de coco light change tout niveau calories.",
    note:"Ne pas faire bouillir le poisson trop longtemps — 8-10 min suffisent, sinon il devient sec.",
    ingr:["poisson","riz"], tags:["reconfort"],
    temps:"t30",
    ingredients:[
      { nom:"Cabillaud / colin", type:"prot", prot:18, gluc:0,  lip:1,  g_ref:150 },
      { nom:"Riz",               type:"gluc", prot:7,  gluc:77, lip:1,  g_ref:100 },
      { nom:"Lait de coco light",type:"lip",  prot:1,  gluc:3,  lip:5,  g_ref:100, max_g:150 },
      { nom:"Curry en poudre",   type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Légumes (poivrons, oignons)", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
    ],
    steps:["Cuire le riz selon les instructions du paquet.","Couper le poisson en gros morceaux.","Faire chauffer le lait de coco light avec le curry en poudre dans une poêle.","Ajouter le poisson et les légumes, laisser mijoter à couvert 8-10 min à feu doux.","Servir le curry sur le riz."]
  },
  {
    id:26, emoji:"🥦", category:"dejeuner_diner",
    nom:"Wok Bœuf Brocolis",
    description:"Rapide, savoureux, et les brocolis passent bien mieux comme ça.",
    note:"Cuisson à feu vif et rapide — le bœuf doit rester tendre, pas bouilli.",
    ingr:["boeuf","riz"], tags:["rapide","leger"],
    temps:"t30",
    ingredients:[
      { nom:"Bœuf émincé 5%",    type:"prot", prot:22, gluc:0,  lip:5,  g_ref:120 },
      { nom:"Riz ou nouilles",   type:"gluc", prot:7,  gluc:77, lip:1,  g_ref:90  },
      { nom:"Huile de sésame",   type:"lip",  prot:0,  gluc:0,  lip:100,g_ref:5,   max_g:15 },
      { nom:"Brocolis",          type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Sauce soja",        type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Cuire le riz ou les nouilles selon les instructions.","Blanchir les brocolis 3-4 min à l'eau bouillante ou à la vapeur.","Faire chauffer l'huile de sésame dans un wok ou une poêle à feu vif.","Saisir le bœuf émincé 2-3 min à feu vif en remuant constamment.","Ajouter les brocolis + sauce soja, mélanger 2 min à feu vif. Servir avec le riz ou les nouilles."]
  },
  {
    id:27, emoji:"🌯", category:"dejeuner_diner",
    nom:"Chicken Bowl Mexicain",
    description:"Épicé, coloré, ça sort du riz-poulet-curry classique.",
    note:"Les épices mexicaines font toute la différence — ne sois pas timide dessus.",
    ingr:["poulet","riz"], tags:["familial"],
    temps:"t30",
    ingredients:[
      { nom:"Blanc de poulet",   type:"prot", prot:25, gluc:0,  lip:1,  g_ref:130 },
      { nom:"Riz",               type:"gluc", prot:7,  gluc:77, lip:1,  g_ref:80  },
      { nom:"Haricots noirs",    type:"gluc", prot:9,  gluc:20, lip:1,  g_ref:60  },
      { nom:"Avocat",            type:"lip",  prot:2,  gluc:2,  lip:15, g_ref:50,  max_g:80 },
      { nom:"Maïs",              type:"fixe", prot:3,  gluc:19, lip:1,  g_ref:50,  fixe_label:"50g (fixe)" },
      { nom:"Épices mexicaines (cumin, paprika, piment)", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
    ],
    steps:["Cuire le riz selon les instructions du paquet.","Assaisonner le poulet avec cumin, paprika et piment, cuire à la poêle à feu vif.","Réchauffer les haricots noirs à la casserole ou au micro-ondes.","Couper l'avocat en dés.","Assembler le bowl : riz, poulet, haricots noirs, maïs, avocat."]
  },
  {
    id:28, emoji:"🍮", category:"petit_dej_collation",
    nom:"Pudding Protéiné au Pain",
    description:"Anti-gaspi et gourmand. Utilise le pain qui traîne, version dessert protéiné.",
    note:"Bien laisser le pain s'imbiber avant cuisson — c'est ce qui donne la texture fondante.",
    ingr:["pain","oeuf"], tags:["sucre","reconfort"],
    temps:"t30",
    ingredients:[
      { nom:"Pain de mie complet La Boulangère", type:"gluc", prot:10, gluc:39, lip:1.9, g_ref:60  },
      { nom:"Lait écrémé",       type:"gluc", prot:3,  gluc:5,  lip:0,  g_ref:150, max_g:250 },
      { nom:"Œuf entier",        type:"prot", prot:13, gluc:1,  lip:10, g_ref:50,  egg:true },
      { nom:"Whey vanille",      type:"prot", prot:80, gluc:5,  lip:2,  g_ref:25  },
      { nom:"Sucralose + cannelle", type:"libre", prot:0, gluc:0, lip:0, g_ref:0  },
    ],
    steps:["Couper le pain en morceaux, tremper dans le lait 5 min pour bien l'imbiber.","Écraser le mélange pain-lait à la fourchette.","Battre l'œuf avec la whey diluée dans un peu d'eau, incorporer au mélange.","Ajouter sucralose et cannelle selon goût.","Verser dans un moule, cuire au four 180°C 25-30 min ou micro-ondes 3-4 min. Laisser refroidir avant de démouler."]
  },
  {
    id:29, emoji:"🍯", category:"petit_dej_collation",
    nom:"Flan sans pâte",
    description:"Le flan pâtissier version coaching. Simple, léger, ça tient bien en collation.",
    note:"Cuisson au bain-marie obligatoire — sinon le flan devient granuleux.",
    ingr:["oeuf"], tags:["sucre","leger"],
    temps:"t45",
    ingredients:[
      { nom:"Œuf entier",        type:"prot", prot:13, gluc:1,  lip:10, g_ref:50,  egg:true },
      { nom:"Lait écrémé",       type:"gluc", prot:3,  gluc:5,  lip:0,  g_ref:250, max_g:350 },
      { nom:"Whey vanille",      type:"prot", prot:80, gluc:5,  lip:2,  g_ref:20  },
      { nom:"Sucralose + arôme vanille", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
    ],
    steps:["Préchauffer le four à 160°C.","Battre l'œuf avec la whey diluée dans un peu de lait.","Ajouter le reste du lait, le sucralose et l'arôme vanille, bien mélanger.","Verser dans un moule ou des ramequins.","Cuire au bain-marie 35-40 min jusqu'à prise. Laisser refroidir puis réfrigérer 2h minimum avant de démouler."]
  },
  {
    id:30, emoji:"🍝", category:"dejeuner_diner",
    nom:"Pâtes à la Bolognaise",
    description:"Le classique indémodable. Simple, efficace, tout le monde aime ça.",
    note:"Laisse mijoter la sauce au moins 15 min — plus elle mijote, plus elle est bonne.",
    ingr:["boeuf","pates"], tags:["familial","reconfort"],
    temps:"t30",
    ingredients:[
      { nom:"Bœuf haché 5%",     type:"prot", prot:22, gluc:0,  lip:5,  g_ref:120 },
      { nom:"Pâtes",             type:"gluc", prot:12, gluc:75, lip:1,  g_ref:80  },
      { nom:"Parmesan",          type:"lip",  prot:35, gluc:0,  lip:28, g_ref:15,  max_g:20 },
      { nom:"Sauce tomate",      type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
      { nom:"Oignon / carottes", type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Cuire les pâtes selon les instructions du paquet.","Faire revenir l'oignon émincé, ajouter le bœuf haché, cuire à feu vif jusqu'à coloration.","Ajouter la sauce tomate et les carottes, saler, poivrer.","Laisser mijoter à couvert 15-20 min à feu doux.","Servir la sauce sur les pâtes, parsemer de parmesan râpé."]
  },
  {
    id:31, emoji:"🍲", category:"dejeuner_diner",
    nom:"Lasagnes",
    description:"Le plat réconfortant par excellence, en version qui rentre dans le plan.",
    note:"Laisse reposer 5 min à la sortie du four avant de découper — ça tient mieux.",
    ingr:["boeuf","pates","fromage"], tags:["familial","reconfort"],
    temps:"t45",
    ingredients:[
      { nom:"Bœuf haché 5%",       type:"prot", prot:22, gluc:0,  lip:5,  g_ref:120 },
      { nom:"Feuilles de lasagne", type:"gluc", prot:12, gluc:70, lip:1,  g_ref:70  },
      { nom:"Fromage râpé",        type:"lip",  prot:28, gluc:0,  lip:30, g_ref:25,  max_g:35 },
      { nom:"Crème légère",        type:"lip",  prot:3,  gluc:3,  lip:4,  g_ref:50,  max_g:80 },
      { nom:"Sauce tomate",        type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Préchauffer le four à 180°C.","Faire revenir le bœuf haché avec oignon, ajouter la sauce tomate, mijoter 15 min.","Dans un plat, alterner : couche de sauce bolognaise, feuilles de lasagne, un peu de crème légère.","Répéter les couches, terminer par de la crème et le fromage râpé sur le dessus.","Cuire au four 30-35 min jusqu'à ce que le dessus soit doré et gratiné."]
  },
  {
    id:32, emoji:"🧀", category:"dejeuner_diner",
    nom:"Gratin de Pâtes",
    description:"Pâtes + jambon + fromage gratiné. Le comfort food qui rentre dans les calories.",
    note:"Ne cuis pas les pâtes complètement — elles finissent de cuire au four.",
    ingr:["porc_jambon","pates","fromage"], tags:["reconfort","familial"],
    temps:"t30",
    ingredients:[
      { nom:"Pâtes",              type:"gluc", prot:12, gluc:75, lip:1,  g_ref:90  },
      { nom:"Jambon / blanc dinde",type:"prot", prot:18, gluc:0,  lip:2,  g_ref:100 },
      { nom:"Crème légère",       type:"lip",  prot:3,  gluc:3,  lip:4,  g_ref:80,  max_g:120 },
      { nom:"Fromage râpé",       type:"lip",  prot:28, gluc:0,  lip:30, g_ref:20,  max_g:30 },
      { nom:"Légumes (brocolis, épinards)", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
    ],
    steps:["Préchauffer le four à 200°C.","Cuire les pâtes 2 min de moins que le temps indiqué (elles finiront de cuire au four).","Couper le jambon en dés, mélanger avec les pâtes et la crème légère dans un plat à gratin.","Ajouter les légumes si utilisés, parsemer de fromage râpé.","Cuire au four 15-20 min jusqu'à ce que le dessus soit doré et gratiné."]
  },
  {
    id:33, emoji:"🥔", category:"dejeuner_diner",
    nom:"Gratin Dauphinois au Jambon",
    description:"Le classique français, avec du jambon pour en faire un repas complet.",
    note:"Coupe les pommes de terre le plus fin possible — c'est ce qui donne la texture fondante.",
    ingr:["porc_jambon","pdt","fromage"], tags:["reconfort","familial"],
    temps:"t45",
    ingredients:[
      { nom:"Pommes de terre",     type:"gluc", prot:2,  gluc:17, lip:0,  g_ref:250 },
      { nom:"Jambon / blanc dinde",type:"prot", prot:18, gluc:0,  lip:2,  g_ref:120 },
      { nom:"Crème légère",        type:"lip",  prot:3,  gluc:3,  lip:4,  g_ref:100, max_g:150 },
      { nom:"Fromage râpé",        type:"lip",  prot:28, gluc:0,  lip:30, g_ref:20,  max_g:30 },
      { nom:"Ail / muscade",       type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Préchauffer le four à 180°C.","Couper les pommes de terre en rondelles très fines (mandoline si possible).","Disposer une couche de pommes de terre dans un plat, ajouter le jambon émincé.","Verser la crème légère mélangée à l'ail et la muscade sur le dessus.","Parsemer de fromage râpé, cuire au four 45-50 min jusqu'à ce que les pommes de terre soient tendres et dorées."]
  },
  {
    id:34, emoji:"🍜", category:"dejeuner_diner",
    nom:"Soupe Poulet Légumes",
    description:"Réconfortante, simple, et complète niveau macros malgré les apparences.",
    note:"Mixe partiellement pour garder un peu de texture, ou totalement pour un velouté.",
    ingr:["poulet","pdt"], tags:["leger","reconfort"],
    temps:"t30",
    ingredients:[
      { nom:"Blanc de poulet",     type:"prot", prot:25, gluc:0,  lip:1,  g_ref:120 },
      { nom:"Pommes de terre",     type:"gluc", prot:2,  gluc:17, lip:0,  g_ref:150 },
      { nom:"Crème légère",        type:"lip",  prot:3,  gluc:3,  lip:4,  g_ref:50,  max_g:80 },
      { nom:"Légumes (carottes, poireaux, courgettes)", type:"libre", prot:0, gluc:0, lip:0, g_ref:0 },
      { nom:"Bouillon / épices",   type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Couper les légumes et les pommes de terre, cuire dans le bouillon 20 min jusqu'à tendreté.","Cuire le poulet séparément à la poêle ou au bouillon, puis l'émietter.","Mixer la soupe totalement ou partiellement selon la texture voulue.","Ajouter le poulet émietté et la crème légère, mélanger.","Assaisonner selon goût et servir bien chaud."]
  },
  {
    id:35, emoji:"🥚", category:"petit_dej_collation",
    nom:"Œufs à la Coque + Pain",
    description:"Le classique simple et rapide. Jaune coulant, mouillettes, rien de plus.",
    note:"3 min pour un jaune bien coulant, 5-6 min pour un jaune plus pris.",
    ingr:["oeuf","pain"], tags:["rapide","leger"],
    temps:"t15",
    ingredients:[
      { nom:"Œufs entiers",  type:"prot", prot:13, gluc:1,  lip:10, g_ref:50,  egg:true },
      { nom:"Pain",          type:"gluc", prot:9,  gluc:46, lip:3,  g_ref:60  },
      { nom:"Beurre léger",  type:"lip",  prot:0,  gluc:0,  lip:60, g_ref:5,   max_g:15 },
      { nom:"Sel / poivre",  type:"libre",prot:0,  gluc:0,  lip:0,  g_ref:0   },
    ],
    steps:["Porter une casserole d'eau à ébullition.","Plonger délicatement les œufs, cuire 3 min pour un jaune coulant (5-6 min pour plus cuit).","Pendant ce temps, couper le pain en mouillettes.","Tartiner légèrement de beurre léger si désiré.","Écaler le haut de l'œuf et tremper les mouillettes dans le jaune."]
  },
];

// ── SOLVEUR ADAPTATIF ──
// Résout un système NxN (N = nombre de groupes présents dans la recette)
// Utilise Cramer pour 2x2 et 3x3, direct pour 1x1

function det2(a) {
  return a[0][0]*a[1][1] - a[0][1]*a[1][0];
}
function det3(a) {
  return (
    a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])
   -a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])
   +a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0])
  );
}

function calcPortions(recette, cible_prot, cible_gluc, cible_lip) {
  const ings = recette.ingredients;
  const ALL_TYPES = ["prot","gluc","lip"];
  const MACRO_KEYS = ["prot","gluc","lip"];

  // Calculer le nombre d'unités pour les ingrédients "fixe" quantifiables
  // (pain burger, wrap, pitta, tranche de brioche...) — jamais de fraction, 1 ou 2 unités.
  const fixeUnits = ings.map(ing => {
    if (ing.type !== "fixe" || !ing.unit_scalable) return 1;
    const maxU = ing.max_units || 2;
    const glucPerUnit = ing.gluc * ing.g_ref / 100;
    let units = glucPerUnit > 0 ? Math.round(cible_gluc / glucPerUnit) : 1;
    units = Math.max(1, Math.min(maxU, units));
    return units;
  });

  // Séparer par catégorie
  const fixe  = ings.filter(i=>i.type==="fixe");
  const libre  = ings.filter(i=>i.type==="libre");

  // Macros fixes (en tenant compte du nombre d'unités choisi)
  const fixeMacros = ings.reduce((a,ing,idx)=>{
    if (ing.type!=="fixe") return a;
    const g = ing.g_ref * fixeUnits[idx];
    return {
      prot: a.prot + ing.prot * g / 100,
      gluc: a.gluc + ing.gluc * g / 100,
      lip:  a.lip  + ing.lip  * g / 100,
    };
  },{prot:0,gluc:0,lip:0});

  // Cibles nettes (après déduction des fixes)
  const need = {
    prot: Math.max(0, cible_prot - fixeMacros.prot),
    gluc: Math.max(0, cible_gluc - fixeMacros.gluc),
    lip:  Math.max(0, cible_lip  - fixeMacros.lip),
  };

  // Groupes présents dans cette recette
  const presentTypes = ALL_TYPES.filter(t => ings.some(i=>i.type===t));

  // Pour chaque groupe présent, calculer sa contribution à chaque macro (pour ratio=1 = g_ref de chaque ing)
  // contrib[groupe][macro] = somme(macro_i * g_ref_i / 100) pour les ings du groupe
  const contrib = {};
  presentTypes.forEach(t => {
    contrib[t] = {};
    MACRO_KEYS.forEach(m => {
      contrib[t][m] = ings.filter(i=>i.type===t).reduce((s,ing)=>s+ing[m]*ing.g_ref/100, 0);
    });
  });

  // Résoudre selon le nombre de groupes présents
  // On mappe les groupes présents aux macros cibles dans le même ordre
  // (ex: si présents = [prot, gluc], on résout sur [prot, gluc] en priorité)
  let ratios = {};
  presentTypes.forEach(t => { ratios[t] = 1; }); // défaut

  if (presentTypes.length === 1) {
    // 1 groupe : résoudre sur sa macro principale
    const t = presentTypes[0];
    const mainMacro = t; // groupe prot → résoudre sur prot, etc.
    const denom = contrib[t][mainMacro];
    if (denom > 0) ratios[t] = need[mainMacro] / denom;

  } else if (presentTypes.length === 2) {
    // 2 groupes : système 2x2 sur les 2 macros principales
    const [t0, t1] = presentTypes;
    // Macros à utiliser = les macros principales des deux groupes présents
    const macros = presentTypes; // ex: ["prot","gluc"]
    const A = [
      [contrib[t0][macros[0]], contrib[t1][macros[0]]],
      [contrib[t0][macros[1]], contrib[t1][macros[1]]],
    ];
    const b = [need[macros[0]], need[macros[1]]];
    const d = det2(A);
    if (Math.abs(d) > 1e-10) {
      ratios[t0] = det2([[b[0],A[0][1]],[b[1],A[1][1]]]) / d;
      ratios[t1] = det2([[A[0][0],b[0]],[A[1][0],b[1]]]) / d;
    } else {
      // Singulier : résoudre indépendamment sur macro principale
      presentTypes.forEach(t => {
        const m = t;
        if (contrib[t][m] > 0) ratios[t] = need[m] / contrib[t][m];
      });
    }

  } else if (presentTypes.length >= 3) {
    // 3 groupes : système 3x3
    const [t0,t1,t2] = presentTypes;
    const macros = ["prot","gluc","lip"];
    const A = macros.map(m => [contrib[t0][m], contrib[t1][m], contrib[t2][m]]);
    const b = macros.map(m => need[m]);
    const d = det3(A);
    if (Math.abs(d) > 1e-10) {
      const solve = (col) => {
        const M = A.map((row,i)=>row.map((v,j)=>j===col?b[i]:v));
        return det3(M)/d;
      };
      ratios[t0] = solve(0); ratios[t1] = solve(1); ratios[t2] = solve(2);
    } else {
      presentTypes.forEach(t => {
        const m = t;
        if (contrib[t][m] > 0) ratios[t] = need[m] / contrib[t][m];
      });
    }
  }

  // S'assurer que tous les ratios sont positifs
  presentTypes.forEach(t => { ratios[t] = Math.max(0, ratios[t]); });

  // Appliquer les ratios avec min/max
  const applyMax = (ing, g) => { let v = Math.max(0, g); if (ing.min_g) v = Math.max(v, ing.min_g); if (ing.max_g) v = Math.min(v, ing.max_g); return v; };

  return ings.map((ing, idx) => {
    if (ing.type==="libre") {
      return {...ing, g_calc:0, prot_calc:0, gluc_calc:0, lip_calc:0, kcal_calc:0};
    }
    if (ing.type==="fixe") {
      const units = fixeUnits[idx];
      const g = ing.g_ref * units;
      const p=Math.round(ing.prot*g/100), gc=Math.round(ing.gluc*g/100), l=Math.round(ing.lip*g/100);
      const label = ing.unit_scalable
        ? `${units} ${ing.unit_name}${units>1?'s':''} (${Math.round(g)}g)`
        : ing.fixe_label;
      return {...ing, g_calc:Math.round(g), prot_calc:p, gluc_calc:gc, lip_calc:l, kcal_calc:Math.round((p+gc)*4+l*9), fixe_label:label, units};
    }
    const ratio = ratios[ing.type] || 1;
    const g_raw = ing.g_ref * ratio;
    const g = Math.round(applyMax(ing, g_raw));
    const p=Math.round(ing.prot*g/100), gc=Math.round(ing.gluc*g/100), l=Math.round(ing.lip*g/100);
    return {...ing, g_calc:g, prot_calc:p, gluc_calc:gc, lip_calc:l, kcal_calc:Math.round((p+gc)*4+l*9),
      hit_max: ing.max_g && g_raw > ing.max_g};
  });
}

const MEAL_TYPES = [
  { id:"petit_dej_collation", label:"☀️  Petit-déjeuner & Collation" },
  { id:"dejeuner_diner",      label:"🍽️  Déjeuner & Dîner" },
];

const INGREDIENTS_LIST = [
  { id:"poulet",      label:"Poulet",           emoji:"🍗" },
  { id:"boeuf",       label:"Bœuf",             emoji:"🥩" },
  { id:"porc_jambon", label:"Jambon / Bacon",   emoji:"🥓" },
  { id:"poisson",     label:"Poisson",          emoji:"🐟" },
  { id:"oeuf",        label:"Œufs",             emoji:"🥚" },
  { id:"riz",         label:"Riz",              emoji:"🍚" },
  { id:"pates",       label:"Pâtes",            emoji:"🍝" },
  { id:"pdt",         label:"Pommes de terre",  emoji:"🥔" },
  { id:"avoine",      label:"Flocons d'avoine", emoji:"🌾" },
  { id:"pain",        label:"Pain",             emoji:"🍞" },
  { id:"fromage",     label:"Fromage",          emoji:"🧀" },
];

const TAGS_LIST = [
  { id:"rapide",    label:"Rapide",       emoji:"⚡" },
  { id:"reconfort", label:"Réconfort",    emoji:"🍲" },
  { id:"leger",     label:"Léger",        emoji:"🥗" },
  { id:"familial",  label:"Familial",     emoji:"👨‍👩‍👧" },
  { id:"sucre",     label:"Sucré",        emoji:"🍯" },
];

const TEMPS_LIST = [
  { id:"t15", label:"15 min",  emoji:"⏱️" },
  { id:"t30", label:"30 min",  emoji:"⏱️" },
  { id:"t45", label:"45 min+", emoji:"⏱️" },
];

// ── Substitutions — registre partagé par nom d'ingrédient ──
// Chaque substitut doit rester dans le même rôle macro (prot/gluc/lip) que l'original.
const SUBSTITUTIONS = {
  "Blanc de poulet":        [{nom:"Dinde (escalope)",   prot:25, gluc:0,  lip:1 }, {nom:"Bœuf haché 5%",      prot:22, gluc:0,  lip:5 }],
  "Steak haché 5%":         [{nom:"Blanc de poulet",    prot:25, gluc:0,  lip:1 }, {nom:"Dinde hachée",       prot:24, gluc:0,  lip:3 }],
  "Bœuf haché 5%":          [{nom:"Blanc de poulet",    prot:25, gluc:0,  lip:1 }, {nom:"Bœuf haché 15%",     prot:20, gluc:0,  lip:15}],
  "Bœuf émincé 5%":         [{nom:"Blanc de poulet",    prot:25, gluc:0,  lip:1 }, {nom:"Porc émincé",        prot:21, gluc:0,  lip:7 }],
  "Cabillaud / colin":      [{nom:"Saumon",             prot:20, gluc:0,  lip:13}, {nom:"Blanc de poulet",    prot:25, gluc:0,  lip:1 }],
  "Saumon":                 [{nom:"Cabillaud / colin",  prot:18, gluc:0,  lip:1 }, {nom:"Thon (boîte, eau)",  prot:26, gluc:0,  lip:1 }],
  "Allumettes bacon 3%":    [{nom:"Jambon / blanc dinde",prot:18, gluc:0,  lip:2 }, {nom:"Blanc de poulet",    prot:25, gluc:0,  lip:1 }],
  "Jambon / blanc dinde":   [{nom:"Allumettes bacon 3%",prot:17, gluc:0,  lip:3 }, {nom:"Blanc de poulet",    prot:25, gluc:0,  lip:1 }],
  "Riz":                    [{nom:"Pâtes",              prot:12, gluc:75, lip:1 }, {nom:"Quinoa",             prot:14, gluc:64, lip:6 }, {nom:"Semoule", prot:12, gluc:77, lip:1}],
  "Pâtes":                  [{nom:"Riz",                prot:7,  gluc:77, lip:1 }, {nom:"Quinoa",             prot:14, gluc:64, lip:6 }],
  "Pommes de terre":        [{nom:"Patate douce",       prot:2,  gluc:20, lip:0 }, {nom:"Riz",                prot:7,  gluc:77, lip:1 }],
  "Fromage blanc 0%":       [{nom:"Skyr nature",         prot:10, gluc:4,  lip:0 }, {nom:"Yaourt grec 0%",     prot:9,  gluc:4,  lip:0 }],
  "Skyr nature":            [{nom:"Fromage blanc 0%",   prot:8,  gluc:4,  lip:0 }, {nom:"Yaourt grec 0%",     prot:9,  gluc:4,  lip:0 }],
  "Flocons d'avoine":       [{nom:"Son d'avoine",       prot:17, gluc:53, lip:8 }, {nom:"Muesli sans sucre",  prot:10, gluc:65, lip:6 }],
  "Whey protéine":          [{nom:"Whey isolat",         prot:88, gluc:2,  lip:1 }],
};

// ── UI ──
function MacroTag({val,col,label}) {
  return (
    <div style={{background:INK,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,padding:"8px 11px",textAlign:"center",minWidth:54}}>
      <div style={{fontSize:9,color:GRAY_MUTED,marginBottom:2,fontFamily:F_CONDENSED,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</div>
      <div style={{fontSize:15,fontWeight:700,color:col,fontFamily:F_BODY}}>{Math.round(val)}g</div>
    </div>
  );
}

const SEL = {
  width:"100%",background:STONE_MID,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,
  color:WHITE,fontSize:13,fontWeight:600,fontFamily:F_BODY,padding:"13px 16px",cursor:"pointer",
  appearance:"none",WebkitAppearance:"none",outline:"none",
};
const ARR = {position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:RED_BRIGHT,fontSize:11,pointerEvents:"none"};

function baseRefPreview(r) {
  return r.ingredients.filter(i=>i.type!=="libre").reduce((a,i)=>({
    prot: a.prot + i.prot * i.g_ref / 100, gluc: a.gluc + i.gluc * i.g_ref / 100, lip: a.lip + i.lip * i.g_ref / 100,
  }),{prot:0,gluc:0,lip:0});
}

function RecipeResultCard({ r, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onSelect} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{
      background:STONE_MID, border:`1px solid ${hover?"#8A6A1E":STONE_LIGHT}`, borderTop:`2px solid ${hover?GOLD:RED_DEEP}`, borderRadius:4,
      padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14,
      transition:"all 250ms ease", boxShadow: hover?"0 0 8px rgba(199,162,74,0.3)":"0 1px 4px rgba(0,0,0,0.4)"
    }}>
      <div style={{fontSize:26}}>{r.emoji}</div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:13,color:WHITE,fontFamily:F_CONDENSED,letterSpacing:"0.03em",textTransform:"uppercase"}}>{r.nom}</div>
        <div style={{fontSize:11,color:GRAY,marginTop:3,fontFamily:F_BODY}}>{r.description}</div>
      </div>
      <div style={{color:hover?GOLD:RED_BRIGHT,fontSize:18,transition:"color 250ms ease"}}>→</div>
    </div>
  );
}

export default function App() {
  // Mode de recherche : null (pas choisi) | "libre" | "ingredients" | "envie"
  const [searchMode, setSearchMode] = useState(null);
  const [selectedIngr, setSelectedIngr] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTemps, setSelectedTemps] = useState([]);
  const [mealType,  setMealType]  = useState("");
  const [recetteId, setRecetteId] = useState("");

  const [prot, setProt] = useState(50);
  const [gluc, setGluc] = useState(70);
  const [lip,  setLip]  = useState(15);

  // Substitutions d'ingrédients (par index dans recette.ingredients d'origine)
  const [substOverrides, setSubstOverrides] = useState({});
  const [openSubstIdx, setOpenSubstIdx] = useState(null);

  // Liste de courses — persiste entre les recettes
  const [shoppingList, setShoppingList] = useState({});
  const [showShoppingList, setShowShoppingList] = useState(false);

  const toggleIngr  = (id) => setSelectedIngr(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  const toggleTag   = (id) => setSelectedTags(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  const toggleTemps = (id) => setSelectedTemps(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);

  const filteredByIngr = useMemo(() => {
    if (selectedIngr.length === 0) return [];
    return RECETTES.filter(r => r.ingr && r.ingr.some(i => selectedIngr.includes(i)));
  }, [selectedIngr]);

  const filteredByTags = useMemo(() => {
    if (selectedTags.length === 0 && selectedTemps.length === 0) return [];
    return RECETTES.filter(r => {
      const tagOk = selectedTags.length === 0 || (r.tags && selectedTags.every(t => r.tags.includes(t)));
      const tempsOk = selectedTemps.length === 0 || selectedTemps.includes(r.temps);
      return tagOk && tempsOk;
    });
  }, [selectedTags, selectedTemps]);

  const filteredMealType = useMemo(()=>mealType?RECETTES.filter(r=>r.category===mealType):[],[mealType]);
  const recette  = useMemo(()=>recetteId?RECETTES.find(r=>r.id===Number(recetteId)):null,[recetteId]);

  // Réinitialiser les substitutions quand on change de recette
  useEffect(() => { setSubstOverrides({}); setOpenSubstIdx(null); }, [recetteId]);

  // Applique les substitutions choisies sur une copie de la recette
  const effectiveRecette = useMemo(() => {
    if (!recette) return null;
    if (Object.keys(substOverrides).length === 0) return recette;
    const ingredients = recette.ingredients.map((ing, idx) => {
      const sub = substOverrides[idx];
      if (!sub) return ing;
      return { ...ing, nom: sub.nom, prot: sub.prot, gluc: sub.gluc, lip: sub.lip };
    });
    return { ...recette, ingredients };
  }, [recette, substOverrides]);

  const result   = useMemo(()=>effectiveRecette?calcPortions(effectiveRecette,prot,gluc,lip):null,[effectiveRecette,prot,gluc,lip]);
  const totaux   = useMemo(()=>result?.reduce((a,i)=>({
    prot:a.prot+i.prot_calc,gluc:a.gluc+i.gluc_calc,lip:a.lip+i.lip_calc,kcal:a.kcal+i.kcal_calc
  }),{prot:0,gluc:0,lip:0,kcal:0}),[result]);

  const kcal_cible = prot*4+gluc*4+lip*9;
  const tc = t=>t==="prot"?RED_BRIGHT:t==="gluc"?STEEL_LIGHT:t==="lip"?GOLD:GRAY;

  const resetSearch = () => {
    setSearchMode(null); setSelectedIngr([]); setSelectedTags([]); setSelectedTemps([]);
    setMealType(""); setRecetteId("");
  };

  // ── Liste de courses ──
  const addToShoppingList = () => {
    if (!result) return;
    setShoppingList(prev => {
      const next = {...prev};
      result.forEach(ing => {
        if (ing.type === "libre") {
          const key = `libre:${ing.nom}`;
          next[key] = { nom: ing.nom, detail: "à volonté", count: (next[key]?.count||0) + 1 };
          return;
        }
        let detail;
        if (ing.egg) {
          const n = Math.max(1, Math.round(ing.g_calc/50));
          detail = `${n} œuf${n>1?'s':''}`;
        } else if (ing.units && ing.unit_name) {
          detail = `${ing.units} ${ing.unit_name}${ing.units>1?'s':''} (${ing.g_calc}g)`;
        } else {
          detail = `${ing.g_calc}g`;
        }
        const key = `${ing.nom}|${detail}`;
        next[key] = { nom: ing.nom, detail, count: (next[key]?.count||0) + 1 };
      });
      return next;
    });
    setShowShoppingList(true);
  };
  const removeFromShoppingList = (key) => setShoppingList(prev => {
    const next = {...prev}; delete next[key]; return next;
  });
  const clearShoppingList = () => setShoppingList({});
  const shoppingCount = Object.keys(shoppingList).length;

  // ── Export PDF (impression navigateur) ──
  const exportPDF = () => window.print();


  const ModeButton = ({ id, emoji, label }) => {
    const [hover, setHover] = useState(false);
    const active = searchMode===id;
    return (
      <button onClick={()=>{ setSearchMode(id); setRecetteId(""); }}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{
          flex:1, minWidth:140, padding:"20px 14px",
          border:`1px solid ${active?RED_BRIGHT:(hover?"#8A6A1E":STONE_LIGHT)}`,
          borderTop:`2px solid ${active?RED_BRIGHT:(hover?GOLD:RED_DEEP)}`,
          background:active?STONE:STONE_MID, color:WHITE, borderRadius:4,
          cursor:"pointer", textAlign:"center", transition:"all 250ms ease",
          boxShadow: active?SHADOW_RED_GLOW:(hover?SHADOW_GOLD_SM:"none"),
        }}>
        <div style={{fontSize:24, marginBottom:8}}>{emoji}</div>
        <div style={{fontSize:12, fontWeight:700, fontFamily:F_CONDENSED, letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"pre-line"}}>{label}</div>
      </button>
    );
  };

  return (
    <div style={{background:DARK,minHeight:"100vh",color:WHITE,fontFamily:F_BODY}}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
          #print-area * { background: white !important; color: black !important; border-color: #ccc !important; box-shadow: none !important; text-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(180deg, ${INK} 0%, ${DARK} 100%)`,
        borderBottom:`1px solid ${RED_DEEP}`,
        boxShadow:"0 2px 24px rgba(0,0,0,0.6)",
        padding:"28px 24px 22px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:"-60%", left:"50%", transform:"translateX(-50%)",
          width:500, height:300,
          background:"radial-gradient(ellipse at center, rgba(94,22,34,0.35) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents:"none"
        }} />
        <button className="no-print" onClick={()=>setShowShoppingList(true)} style={{
          position:"absolute", top:20, right:20, zIndex:2,
          background:STONE_MID, border:`1px solid ${STONE_LIGHT}`, borderRadius:6,
          padding:"8px 12px", color:WHITE, cursor:"pointer", fontSize:16,
          display:"flex", alignItems:"center", gap:6,
        }}>
          🛒
          {shoppingCount>0 && (
            <span style={{background:RED_BRIGHT, color:WHITE, borderRadius:10, fontSize:10, fontWeight:700,
              padding:"1px 6px", fontFamily:F_CONDENSED}}>{shoppingCount}</span>
          )}
        </button>
        <div style={{fontFamily:F_CONDENSED,fontSize:10,color:RED_BRIGHT,fontWeight:700,letterSpacing:"0.25em",marginBottom:8,position:"relative"}}>VULKAN COACHING</div>
        <div style={{
          fontFamily:F_DISPLAY, fontSize:"clamp(22px,5vw,32px)", fontWeight:700, color:WHITE,
          letterSpacing:"0.04em", textShadow:"0 1px 2px rgba(0,0,0,0.9), 0 0 16px rgba(126,29,43,0.4)",
          position:"relative"
        }}>Trouve ta recette</div>
        <div style={{fontFamily:F_BODY,fontSize:12,color:GRAY,marginTop:8,position:"relative",maxWidth:420}}>Par ingrédients, par envie, ou directement — puis calcule tes portions exactes.</div>
      </div>

      {/* ── PANNEAU LISTE DE COURSES ── */}
      {showShoppingList && (
        <div className="no-print" onClick={()=>setShowShoppingList(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:50,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:STONE_MID, border:`1px solid ${STONE_LIGHT}`, borderTop:`2px solid ${GOLD}`,
            borderRadius:6, padding:"20px 22px", maxWidth:420, width:"100%", maxHeight:"80vh", overflowY:"auto",
            boxShadow:SHADOW_LG,
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:F_CONDENSED,fontSize:15,fontWeight:700,color:WHITE,letterSpacing:"0.04em",textTransform:"uppercase"}}>🛒 Ma liste de courses</div>
              <button onClick={()=>setShowShoppingList(false)} style={{background:"none",border:"none",color:GRAY,fontSize:18,cursor:"pointer"}}>✕</button>
            </div>
            {shoppingCount===0 ? (
              <div style={{fontSize:12,color:GRAY_DIM,fontStyle:"italic"}}>Ta liste est vide. Calcule une recette puis clique "Ajouter à ma liste".</div>
            ) : (
              <>
                <div style={{display:"grid",gap:8,marginBottom:16}}>
                  {Object.entries(shoppingList).map(([key,item])=>(
                    <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                      background:INK,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,padding:"9px 12px"}}>
                      <div>
                        <div style={{fontSize:12,color:WHITE,fontWeight:600}}>{item.nom}</div>
                        <div style={{fontSize:10,color:GRAY}}>{item.detail}{item.count>1?`  ×${item.count}`:""}</div>
                      </div>
                      <button onClick={()=>removeFromShoppingList(key)} style={{background:"none",border:"none",color:RED_BRIGHT,fontSize:14,cursor:"pointer"}}>✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={clearShoppingList} style={{
                  width:"100%", padding:"10px", borderRadius:4, border:`1px solid ${RED_BRIGHT}`,
                  background:"transparent", color:RED_BRIGHT, fontSize:11, fontWeight:700, fontFamily:F_CONDENSED,
                  letterSpacing:"0.05em", textTransform:"uppercase", cursor:"pointer",
                }}>Vider la liste</button>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{padding:"26px 24px 56px",maxWidth:640,margin:"0 auto"}}>

        {/* ── 1# MODE DE RECHERCHE ── */}
        <SectionLabel num="1" text="Comment tu choisis ta recette ?" />
        <div style={{display:"flex",gap:10,marginBottom:28,flexWrap:"wrap"}}>
          <ModeButton id="ingredients" emoji="🧊" label={"Par ingrédients\n(mon frigo)"} />
          <ModeButton id="envie" emoji="✨" label="Par envie" />
          <ModeButton id="libre" emoji="🎲" label="Peu importe" />
        </div>

        {/* ── MODE INGRÉDIENTS ── */}
        {searchMode==="ingredients" && !recette && (
          <div style={{marginBottom:30}}>
            <div style={{fontSize:12,color:GRAY,marginBottom:14,fontFamily:F_BODY}}>Sélectionne ce que tu as sous la main :</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:22}}>
              {INGREDIENTS_LIST.map(ing=>(
                <ToggleChip key={ing.id} active={selectedIngr.includes(ing.id)} onClick={()=>toggleIngr(ing.id)} emoji={ing.emoji} label={ing.label} />
              ))}
            </div>
            {selectedIngr.length>0 && (
              <div>
                <div style={{fontFamily:F_CONDENSED,fontSize:11,color:RED_BRIGHT,fontWeight:700,marginBottom:12,letterSpacing:"0.08em",textTransform:"uppercase"}}>
                  {filteredByIngr.length} recette{filteredByIngr.length>1?"s":""} trouvée{filteredByIngr.length>1?"s":""}
                </div>
                <div style={{display:"grid",gap:9}}>
                  {filteredByIngr.length===0 && <EmptyNote text="Aucune recette avec ces ingrédients. Essaie une autre combinaison." />}
                  {filteredByIngr.map(r=><RecipeResultCard key={r.id} r={r} onSelect={()=>setRecetteId(String(r.id))} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MODE ENVIE ── */}
        {searchMode==="envie" && !recette && (
          <div style={{marginBottom:30}}>
            <div style={{fontSize:12,color:GRAY,marginBottom:14,fontFamily:F_BODY}}>T'as envie de quoi ?</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
              {TAGS_LIST.map(t=>(
                <ToggleChip key={t.id} active={selectedTags.includes(t.id)} onClick={()=>toggleTag(t.id)} emoji={t.emoji} label={t.label} />
              ))}
            </div>
            <div style={{fontSize:11,color:GRAY_MUTED,marginBottom:10,fontFamily:F_CONDENSED,letterSpacing:"0.06em",textTransform:"uppercase"}}>Temps de préparation</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:22}}>
              {TEMPS_LIST.map(t=>(
                <ToggleChip key={t.id} active={selectedTemps.includes(t.id)} onClick={()=>toggleTemps(t.id)} emoji={t.emoji} label={t.label} />
              ))}
            </div>
            {(selectedTags.length>0 || selectedTemps.length>0) && (
              <div>
                <div style={{fontFamily:F_CONDENSED,fontSize:11,color:RED_BRIGHT,fontWeight:700,marginBottom:12,letterSpacing:"0.08em",textTransform:"uppercase"}}>
                  {filteredByTags.length} recette{filteredByTags.length>1?"s":""} trouvée{filteredByTags.length>1?"s":""}
                </div>
                <div style={{display:"grid",gap:9}}>
                  {filteredByTags.length===0 && <EmptyNote text="Aucune recette ne correspond à cette combinaison. Retire un critère." />}
                  {filteredByTags.map(r=><RecipeResultCard key={r.id} r={r} onSelect={()=>setRecetteId(String(r.id))} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MODE LIBRE ── */}
        {searchMode==="libre" && !recette && (
          <div style={{marginBottom:30}}>
            <div style={{fontSize:12,color:GRAY,marginBottom:12,fontFamily:F_BODY}}>Type de repas</div>
            <div style={{position:"relative",marginBottom:20}}>
              <select value={mealType} onChange={e=>{setMealType(e.target.value);setRecetteId("");}} style={SEL}>
                <option value="" disabled style={{color:GRAY_MUTED}}>— Sélectionne un type —</option>
                {MEAL_TYPES.map(m=><option key={m.id} value={m.id} style={{background:STONE_MID}}>{m.label}</option>)}
              </select>
              <div style={ARR}>▼</div>
            </div>
            {mealType && (
              <div style={{position:"relative"}}>
                <select value={recetteId} onChange={e=>setRecetteId(e.target.value)} style={SEL}>
                  <option value="" disabled style={{color:GRAY_MUTED}}>— Sélectionne une recette —</option>
                  {filteredMealType.map(r=>(
                    <option key={r.id} value={r.id} style={{background:STONE_MID}}>{r.emoji}  {r.nom}</option>
                  ))}
                </select>
                <div style={ARR}>▼</div>
              </div>
            )}
          </div>
        )}

        {/* Recette sélectionnée */}
        {recette && (
          <div style={{
            background:STONE_MID, border:`1px solid ${STONE_LIGHT}`, borderTop:`2px solid ${GOLD}`, borderRadius:4,
            padding:"16px 18px",marginBottom:26, boxShadow:SHADOW_MD,
          }}>
            <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                <div style={{fontSize:30}}>{recette.emoji}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,fontFamily:F_CONDENSED,letterSpacing:"0.03em",textTransform:"uppercase",color:WHITE}}>{recette.nom}</div>
                  <div style={{fontSize:11,color:GRAY,marginTop:3}}>{recette.description}</div>
                </div>
              </div>
              <button onClick={resetSearch} style={{
                background:"transparent", border:`1px solid ${RED}`, color:RED_BRIGHT, borderRadius:4,
                padding:"7px 12px", fontSize:10, fontWeight:700, fontFamily:F_CONDENSED, letterSpacing:"0.05em",
                cursor:"pointer", whiteSpace:"nowrap", textTransform:"uppercase"
              }}>← Changer</button>
            </div>
          </div>
        )}

        {/* ── 2# MACROS ── */}
        {recette && (
          <>
            <SectionLabel num="2" text="Tes macros pour ce repas" />
            <div style={{display:"grid",gap:16,marginBottom:22}}>
              {[
                {label:"Protéines",val:prot,set:setProt,min:20,max:120,col:RED_BRIGHT},
                {label:"Glucides", val:gluc,set:setGluc,min:0, max:200,col:STEEL_LIGHT},
                {label:"Lipides",  val:lip, set:setLip, min:0, max:60, col:GOLD},
              ].map(({label,val,set,min,max,col})=>(
                <div key={label}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <label style={{fontSize:10,color:GRAY_MUTED,fontWeight:700,letterSpacing:"0.1em",fontFamily:F_CONDENSED,textTransform:"uppercase"}}>{label}</label>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <input type="number" value={val} min={min} max={max}
                        onChange={e=>set(Math.max(min,Math.min(max,Number(e.target.value))))}
                        style={{width:54,background:INK,border:`1px solid ${col}`,borderRadius:4,
                          color:WHITE,fontWeight:700,fontSize:14,padding:"4px 6px",textAlign:"center",fontFamily:F_BODY}}/>
                      <span style={{fontSize:11,color:GRAY}}>g</span>
                    </div>
                  </div>
                  <input type="range" min={min} max={max} value={val} onChange={e=>set(Number(e.target.value))}
                    style={{width:"100%",accentColor:col}}/>
                </div>
              ))}
            </div>
            <div style={{background:STONE_MID,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,padding:"12px 16px",
              marginBottom:30,display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
              <MacroTag val={prot} col={RED_BRIGHT} label="Prot."/>
              <MacroTag val={gluc} col={STEEL_LIGHT} label="Gluc."/>
              <MacroTag val={lip} col={GOLD} label="Lip."/>
              <div style={{background:INK,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,padding:"8px 11px",textAlign:"center"}}>
                <div style={{fontSize:9,color:GRAY_MUTED,marginBottom:2,fontFamily:F_CONDENSED,letterSpacing:"0.08em",textTransform:"uppercase"}}>Total</div>
                <div style={{fontSize:15,fontWeight:700,color:GRAY}}>{kcal_cible} kcal</div>
              </div>
            </div>
          </>
        )}

        {/* ── 3# RÉSULTAT ── */}
        {recette&&result&&totaux&&(
          <div id="print-area">
            <SectionLabel num="3" text={`Tes portions — ${recette.nom}`} />

            <div style={{background:STONE_MID,border:`1px solid ${STONE_LIGHT}`,borderLeft:`2px solid ${GOLD}`,borderRadius:4,
              padding:"11px 15px",marginBottom:16}}>
              <div style={{fontSize:11,color:GOLD_LIGHT,fontStyle:"italic",fontFamily:F_BODY}}>💡 {recette.note}</div>
            </div>

            <div style={{background:STONE_MID,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,overflow:"hidden",marginBottom:18,boxShadow:SHADOW_MD}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 90px 44px 44px 44px 54px",
                gap:4,padding:"9px 15px",background:RED_DEEP}}>
                {["INGRÉDIENT","PORTION","P","G","L","KCAL"].map(h=>(
                  <div key={h} style={{fontSize:9,fontWeight:700,color:WHITE,fontFamily:F_CONDENSED,letterSpacing:"0.06em",
                    textAlign:h==="INGRÉDIENT"?"left":"center"}}>{h}</div>
                ))}
              </div>
              {result.map((ing,i)=>{
                const canSubstitute = ing.type!=="libre" && ing.type!=="fixe" && SUBSTITUTIONS[recette.ingredients[i].nom];
                return (
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 90px 44px 44px 44px 54px",
                  gap:4,padding:"10px 15px",alignItems:"center",
                  borderBottom:i<result.length-1?`1px solid ${STONE}`:"none",
                  background:i%2===0?STONE_MID:STONE_DEEP}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{fontSize:11,fontWeight:600,color:ing.type==="libre"?GRAY_DIM:ing.type==="fixe"?GRAY:WHITE,fontFamily:F_BODY}}>{ing.nom}</div>
                      {canSubstitute && (
                        <button onClick={()=>setOpenSubstIdx(openSubstIdx===i?null:i)} title="Remplacer cet ingrédient"
                          style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:11,padding:0,lineHeight:1}}>🔄</button>
                      )}
                    </div>
                    {ing.hit_max&&<div style={{fontSize:8,color:GOLD,marginTop:1}}>⚠ plafond {ing.max_g}g</div>}
                    {ing.type==="fixe"&&<div style={{fontSize:8,color:GRAY_DIM,marginTop:1}}>fixe</div>}
                    {openSubstIdx===i && canSubstitute && (
                      <div style={{marginTop:7,display:"flex",gap:6,flexWrap:"wrap"}}>
                        {SUBSTITUTIONS[recette.ingredients[i].nom].map((s,si)=>(
                          <button key={si} onClick={()=>{ setSubstOverrides(prev=>({...prev,[i]:s})); setOpenSubstIdx(null); }}
                            style={{fontSize:9,padding:"4px 9px",borderRadius:12,border:`1px solid ${STONE_LIGHT}`,
                              background:INK,color:GRAY,cursor:"pointer",fontFamily:F_BODY}}>
                            {s.nom}
                          </button>
                        ))}
                        {substOverrides[i] && (
                          <button onClick={()=>{ setSubstOverrides(prev=>{const n={...prev}; delete n[i]; return n;}); setOpenSubstIdx(null); }}
                            style={{fontSize:9,padding:"4px 9px",borderRadius:12,border:`1px solid ${RED_BRIGHT}`,
                              background:"transparent",color:RED_BRIGHT,cursor:"pointer",fontFamily:F_BODY}}>
                            ↩ Original
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{textAlign:"center"}}>
                    {ing.type==="libre"
                      ?<span style={{fontSize:10,color:GRAY_DIM}}>À volonté</span>
                      :ing.fixe_label
                      ?<span style={{fontSize:10,color:GOLD,fontWeight:700}}>{ing.fixe_label}</span>
                      :ing.egg
                      ?<><span style={{fontSize:13,fontWeight:700,color:tc(ing.type)}}>{Math.max(1,Math.round(ing.g_calc/50))}</span><span style={{fontSize:11,color:GRAY}}> œuf{Math.round(ing.g_calc/50)>1?"s":""}</span></>
                      :<div><span style={{fontSize:13,fontWeight:700,color:tc(ing.type)}}>{ing.g_calc}g</span><div style={{fontSize:8,color:GRAY_DIM}}>cru</div></div>
                    }
                  </div>
                  {[ing.prot_calc,ing.gluc_calc,ing.lip_calc,ing.kcal_calc].map((v,vi)=>(
                    <div key={vi} style={{textAlign:"center",fontSize:11,
                      color:ing.type==="libre"?GRAY_DIM:v>0?GRAY:GRAY_DIM,fontWeight:v>0?600:400}}>{v>0?v:"—"}</div>
                  ))}
                </div>
                );
              })}
              <div style={{display:"grid",gridTemplateColumns:"1fr 90px 44px 44px 44px 54px",
                gap:4,padding:"11px 15px",background:INK,borderTop:`2px solid ${RED_BRIGHT}`}}>
                <div style={{fontSize:11,fontWeight:700,color:WHITE,gridColumn:"1/3",fontFamily:F_CONDENSED,letterSpacing:"0.05em",textTransform:"uppercase"}}>Total</div>
                {[totaux.prot,totaux.gluc,totaux.lip,totaux.kcal].map((v,vi)=>(
                  <div key={vi} style={{textAlign:"center",fontSize:14,fontWeight:700,color:[RED_BRIGHT,STEEL_LIGHT,GOLD,GRAY][vi]}}>{Math.round(v)}</div>
                ))}
              </div>
            </div>

            <div style={{background:STONE_MID,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,padding:"14px 17px",marginBottom:18}}>
              <div style={{fontFamily:F_CONDENSED,fontSize:10,color:GRAY_MUTED,fontWeight:700,marginBottom:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>Cible vs obtenu</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[
                  {label:"Prot.", cible:prot, obtenu:Math.round(totaux.prot), col:RED_BRIGHT, tol:3},
                  {label:"Gluc.", cible:gluc, obtenu:Math.round(totaux.gluc), col:STEEL_LIGHT, tol:5},
                  {label:"Lip.",  cible:lip,  obtenu:Math.round(totaux.lip),  col:GOLD,  tol:3},
                  {label:"Kcal",  cible:kcal_cible, obtenu:Math.round(totaux.kcal), col:GRAY, tol:30},
                ].map(({label,cible,obtenu,col,tol})=>{
                  const diff=obtenu-cible; const ok=Math.abs(diff)<=tol;
                  return(
                    <div key={label} style={{background:INK,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,padding:"9px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:GRAY_MUTED,marginBottom:3,fontFamily:F_CONDENSED,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</div>
                      <div style={{fontSize:15,fontWeight:700,color:col}}>{obtenu}</div>
                      <div style={{fontSize:9,marginTop:2,color:ok?"#7FA876":Math.abs(diff)<=tol*2?GOLD_LIGHT:RED_BRIGHT,fontWeight:ok?700:400}}>
                        {ok?"✓ atteint":(diff>0?`+${diff}`:diff)}
                      </div>
                      <div style={{fontSize:8,color:GRAY_DIM,marginTop:2}}>cible : {cible}</div>
                    </div>
                  );
                })}
              </div>
              {result.some(i=>i.max_g&&i.g_calc>=i.max_g)&&(
                <div style={{marginTop:11,fontSize:10,color:GOLD_LIGHT,fontStyle:"italic"}}>
                  ⚠ Un ingrédient a atteint son plafond — les lipides peuvent être légèrement sous la cible. Compense sur un autre repas.
                </div>
              )}
            </div>

            <div style={{background:STONE_MID,border:`1px solid ${STONE_LIGHT}`,borderRadius:4,overflow:"hidden",boxShadow:SHADOW_MD}}>
              <div style={{padding:"12px 17px",background:INK,borderBottom:`1px solid ${STONE_LIGHT}`}}>
                <div style={{fontFamily:F_CONDENSED,fontSize:11,color:RED_BRIGHT,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>📋 Consignes de préparation</div>
              </div>
              <div style={{padding:"16px 17px"}}>
                {recette.steps.map((step,i)=>(
                  <div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}>
                    <div style={{background:RED,color:WHITE,borderRadius:"50%",minWidth:22,height:22,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,marginTop:1,
                      border:`1px solid ${RED_BRIGHT}`}}>
                      {i+1}
                    </div>
                    <div style={{fontSize:12,color:GRAY,lineHeight:1.6,fontFamily:F_BODY}}>{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions — masquées à l'impression */}
            <div className="no-print" style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
              <button onClick={addToShoppingList} style={{
                flex:"1 1 auto", padding:"11px 16px", borderRadius:4, border:`1px solid ${STONE_LIGHT}`,
                background:STONE_MID, color:WHITE, fontSize:12, fontWeight:700, fontFamily:F_CONDENSED,
                letterSpacing:"0.04em", textTransform:"uppercase", cursor:"pointer",
              }}>🛒 Ajouter à ma liste</button>
              <button onClick={exportPDF} style={{
                flex:"1 1 auto", padding:"11px 16px", borderRadius:4, border:`1px solid ${RED_BRIGHT}`,
                background:"transparent", color:RED_BRIGHT, fontSize:12, fontWeight:700, fontFamily:F_CONDENSED,
                letterSpacing:"0.04em", textTransform:"uppercase", cursor:"pointer",
              }}>📄 Exporter en PDF</button>
            </div>
          </div>
        )}

      </div>

      <div style={{borderTop:`1px solid ${RED_DEEP}`,padding:"14px 24px",background:INK,display:"flex",justifyContent:"space-between"}}>
        <div style={{fontSize:10,color:GRAY_DIM,fontFamily:F_CONDENSED,letterSpacing:"0.05em"}}>VULKAN COACHING · vulkancoaching.fr</div>
        <div style={{fontSize:10,color:GRAY_DIM,fontFamily:F_CONDENSED,letterSpacing:"0.05em"}}>@vulkan_coaching</div>
      </div>
    </div>
  );
}

// ── Composants de mise en page ──
function SectionLabel({ num, text }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{
        width:22,height:22,borderRadius:"50%",background:RED,border:`1px solid ${RED_BRIGHT}`,
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        fontFamily:F_CONDENSED,fontSize:11,fontWeight:700,color:WHITE,
      }}>{num}</div>
      <div style={{fontFamily:F_CONDENSED,fontSize:13,color:WHITE,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>{text}</div>
    </div>
  );
}

function ToggleChip({ active, onClick, emoji, label }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{
      padding:"9px 15px", borderRadius:999,
      border:`1px solid ${active?RED_BRIGHT:(hover?"#8A6A1E":STONE_LIGHT)}`,
      background:active?RED:STONE_MID, color:WHITE,
      cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:F_BODY,
      transition:"all 200ms ease",
      boxShadow: active?"0 0 12px rgba(126,29,43,0.4)":"none",
    }}>{emoji} {label}</button>
  );
}

function EmptyNote({ text }) {
  return <div style={{fontSize:12,color:GRAY_DIM,fontStyle:"italic",padding:"8px 2px"}}>{text}</div>;
}
