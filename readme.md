FocusFlow – De la maquette Figma à l'application full-stack avec Cursor, React et Tailwind

FocusFlow est une application de gestion de tâches inspirée de la méthode GTD (Getting Things Done), offrant un moyen intuitif d'organiser et de faire avancer vos tâches ￼. Ce tutoriel pas-à-pas montre comment reproduire FocusFlow de A à Z en utilisant un stack moderne (React + TypeScript, Tailwind CSS, Zustand, React Router) et l'éditeur intelligent Cursor AI. Nous importerons une maquette Figma pour générer le front-end, ajouterons des tests end-to-end avec Playwright, et créerons un backend Express optionnel pour persister les tâches. Le tout sera présenté sous forme de codelab (guide reproductible à 100%) en Markdown, pensé pour une lecture fluide sur GitHub.

Table des matières
	•	Prérequis et installation
	•	1. Initialiser le projet front-end
	•	2. Configuration de Cursor et des MCP (Figma, Deepwiki, Playwright)
	•	2.1. Activer le MCP Figma (Design vers code)
	•	2.2. Activer le MCP Deepwiki (documentation de code)
	•	2.3. Activer le MCP Playwright (tests end-to-end)
	•	3. Ajout d'une règle de projet : feature-planning.md & workflow-ai.md
	•	4. Importer la maquette Figma et générer le front-end
	•	4.1. Import de la maquette Figma via Cursor
	•	4.2. Génération du code React/Tailwind à partir du design
	•	5. Génération et exécution de tests E2E avec Playwright
	•	6. Backend Express (optionnel)
	•	6.1. Création d'une API Express pour les tâches
	•	6.2. Connexion du front-end à l'API (modification de tasksService.js)
	•	Conclusion et prochaines étapes

⸻

Prérequis et installation

Avant de commencer, assurez-vous d'avoir le matériel et les outils suivants :
	•	Node.js (v16+ recommandé) et npm installés sur votre machine.
	•	Cursor AI installé sur votre ordinateur (disponible sur Windows, macOS, Linux). Cursor est un éditeur de code doté d'un agent IA intégré qui va nous assister dans la génération de code et de tests.
	•	Compte Figma pour obtenir la maquette et générer un token d'API Figma (voir section 2.1).

💡 Astuce : Si ce n'est pas déjà fait, créez un dossier de projet (par ex. focusflow/) et ouvrez-le dans Cursor. Vous pouvez ainsi suivre chaque étape dans l'éditeur, en profitant des fonctionnalités d'auto-complétion et des outils IA.

⸻

## 1. Initialiser le projet front-end

Pour ce codelab, nous allons partir d'un boilerplate React + Vite + Tailwind CSS déjà configuré, ce qui est beaucoup plus simple que de tout configurer depuis zéro. Ce boilerplate nous fait gagner du temps en évitant les étapes fastidieuses de configuration initiale.

**Cloner le dépôt de base :**

```bash
git clone https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate focusflow
cd focusflow
npm install
```

Ce boilerplate inclut déjà :
- ✅ React 18 + TypeScript
- ✅ Vite (build tool rapide)
- ✅ Tailwind CSS configuré
- ✅ Structure de dossiers optimisée
- ✅ Configuration ESLint et Prettier

**Vérifier que tout fonctionne :**

```bash
npm run dev
```

Votre application devrait être accessible sur `http://localhost:5173` et afficher la page de démarrage du boilerplate.

**Ajouter les dépendances spécifiques à FocusFlow :**

```bash
npm install zustand react-router-dom
npm install -D @types/react-router-dom
```

- `zustand` : pour la gestion d'état global persistant
- `react-router-dom` : pour la navigation (si on veut plusieurs pages)

💡 **Pourquoi partir d'un boilerplate ?** Configurer React + TypeScript + Vite + Tailwind depuis zéro et implique de nombreux fichiers de configuration. Le boilerplate nous permet de nous concentrer sur le développement de FocusFlow plutôt que sur la plomberie technique.

## 2. Configuration de Cursor et des MCP (Figma, Deepwiki, Playwright)

Cursor permet d'étendre les capacités de son agent AI via des MCP (Model Context Protocol), qui agissent comme des "plugins" pour accéder à des sources externes. Nous allons configurer trois MCP essentiels pour notre projet :
	•	Figma MCP – pour permettre à l'IA de lire les données de notre design Figma et générer du code fidèle à la maquette ￼.
	•	Deepwiki MCP – pour consulter rapidement la documentation de dépôts publics (pratique pour rappeler la doc de Zustand, React Router, etc., sans quitter l'éditeur ￼ ￼).
	•	Playwright MCP – pour automatiser le navigateur et exécuter des scénarios de test end-to-end directement depuis Cursor (notre "QA assistant" intelligent).

### Configuration complète des MCP

<details>
<summary>Cliquez pour voir la configuration complète mcpServers.json</summary>

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=VOTRE_TOKEN_FIGMA",
        "--stdio"
      ]
    },
    "mcp-deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

</details>

💡 **Remarque :** Après avoir ajouté les serveurs MCP, veillez à redémarrer Cursor ou à utiliser le bouton de rafraîchissement des MCP dans les settings, afin que l'agent charge bien la liste des outils disponibles. Assurez-vous également d'utiliser le mode Agent dans le chat de Cursor (plutôt qu'un simple mode ChatGPT) pour que l'IA puisse exploiter ces outils.

### 2.1. Activer le MCP Figma (Design vers code)

"Framelink Figma MCP": {
    "command": "npx",
    "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=VOTRE_TOKEN_FIGMA",
        "--stdio"
    ]
},

(Cette installation globale facilitera le lancement du serveur Figma MCP.)

	2.	Obtenir un token d'API Figma : Rendez-vous sur votre compte Figma (page Settings de votre profil) et générez un Personal Access Token avec les droits API. Gardez précieusement ce token, il ne sera affiché qu'une seule fois ￼ ￼. Ce token permettra à Cursor d'accéder à vos fichiers Figma via l'API. (Voir la doc Figma pour plus de détails ￼.)
	3.	Configurer le MCP dans Cursor : Ajoutez dans votre configuration Cursor une entrée pour le serveur Figma MCP. Par exemple, sur macOS/Linux, vous pouvez éditer ~/.cursor/mcpServers.json et insérer :

``` [oai_citation:11‡github.com](https://github.com/GLips/Figma-Context-MCP#:~:text=%7B%20,stdio%22%5D%20%7D)

Remplacez `VOTRE_TOKEN_FIGMA` par le token généré à l'étape précédente.

Une fois configuré et activé, le MCP Figma vous permettra d'utiliser la commande ::figma dans Cursor pour interagir avec vos fichiers Figma.

2.2. Activer le MCP Deepwiki (documentation de code)

Deepwiki MCP est un service MCP public (aucune clé nécessaire) qui donne accès aux documentations de dépôts GitHub. C'est extrêmement utile pour poser des questions sur une librairie ou consulter un README sans quitter Cursor ￼ ￼.

Pour l'activer, ajoutez simplement dans votre config Cursor :

{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki@latest"]
    },
  }
}
``` [oai_citation:16‡docs.devin.ai](https://docs.devin.ai/work-with-devin/deepwiki-mcp#:~:text=%7B%20,%7D%20%7D)

C'est tout ! Le serveur Deepwiki est hébergé en ligne et ne nécessite aucune installation locale. Après un rafraîchissement, Cursor listera les outils Deepwiki, tels que `read_wiki_contents` ou `ask_question` sur des dépôts GitHub [oai_citation:17‡docs.devin.ai](https://docs.devin.ai/work-with-devin/deepwiki-mcp#:~:text=Available%20Tools). 

> 💡 **Astuce :** Pour utiliser Deepwiki, vous pouvez par exemple taper dans le chat de l'agent Cursor une instruction comme :
>
> ```text
> ::deepwiki facebook/react ask_question "How to use useEffect hook?"
> ```
>
> L'agent va interroger la documentation du dépôt *facebook/react* et fournir une réponse contextuelle. C'est parfait pour obtenir des exemples ou explications sans ouvrir le navigateur.

### 2.3. Activer le MCP Playwright (tests end-to-end)

Enfin, ajoutons le MCP **Playwright**, qui va permettre à l'IA de piloter un navigateur via Playwright. L'objectif est de pouvoir écrire et **exécuter des tests E2E** en langage naturel (l'agent se chargeant de cliquer, saisir du texte, etc., puis de vérifier le comportement).

**Installation du MCP Playwright** :

- Dans la configuration Cursor, ajoutez une entrée pour le serveur Playwright. Par exemple :

  ```json
  {
    "mcpServers": {
      "playwright": {
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
  ``` [oai_citation:18‡medium.com](https://medium.com/@jagdalebr/supercharge-testing-with-playwright-mcp-server-and-cursor-ai-0e66f2430d11#:~:text=%7B%20,%5D%20%7D)

  Ici, on utilise le package npm `@playwright/mcp` via npx, qui va lancer un serveur MCP Playwright en mode stdio. 

  *Note:* La première utilisation peut prendre un peu de temps (téléchargement des navigateurs par Playwright si non déjà installés). Patientez jusqu'à voir que le serveur est bien « vert » dans la liste des MCP de Cursor.

Une fois en place, le MCP Playwright exposera des outils pour ouvrir une page, cliquer sur des éléments, taper du texte, etc., que l'agent Cursor saura invoquer lors de nos instructions de test.

---

## 3. Ajout d'une règle de projet : *feature-planning.md*

Cursor offre la possibilité de définir des **règles de projet** sous forme de fichiers Markdown. Ces règles servent de guide contextuel à l'agent AI pour qu'il respecte les conventions, les fonctionnalités attendues et le style de code du projet. 

Nous allons ajouter un fichier de règles nommé `feature-planning.md` à la racine du projet, qui décrira les spécifications fonctionnelles de FocusFlow. Ainsi, l'IA aura une compréhension claire du but de l'application avant de générer du code.

**Création du fichier de règles** :

Créez un fichier `feature-planning.md` à la racine du dossier `focusflow/` et ajoutez-y le contenu suivant :

```markdown
# FocusFlow – Feature Planning (Spécifications)

FocusFlow est une application de gestion de tâches basée sur la méthode GTD (Getting Things Done). 

## Catégories de tâches (GTD)
- **Inbox** : tâches brutes à trier.
- **Next Actions** : tâches à réaliser prochainement.
- **Projects** : tâches faisant partie de projets à plusieurs étapes.
- **Waiting For** : tâches déléguées, en attente d'une action externe.
- **Someday/Maybe** : idées ou tâches possibles, un jour.
- **Calendar** : tâches liées à des dates précises (calendrier).

*(NB: Pour ce tutoriel, on pourra simplifier en utilisant une seule liste de tâches générale.)*

## Fonctionnalités Clés
- Ajouter une nouvelle tâche avec un titre (champ de saisie + bouton "Ajouter").
- Lister toutes les tâches (ou par catégorie).
- Marquer une tâche comme terminée (case à cocher).
- Mettre à jour le titre d'une tâche ou sa catégorie (fonctionnalité d'édition).
- **UI/UX** : interface minimaliste, responsive (mobile-first), sans distraction. 
  - Utiliser Tailwind CSS pour le style.
  - Icônes claires pour les actions (ajout, coche, suppression éventuelle).
- Persistance : utiliser Zustand (avec localStorage) pour stocker les tâches localement et restaurer l'état entre sessions.

## Stack Technique
- **Front-end** : React + TypeScript, TailwindCSS, Zustand (état global persistant), React Router (navigation).
- **Tests** : Scénarios end-to-end avec Playwright MCP dans Cursor (ex. ajouter une tâche et vérifier son apparition dans la liste).
- **Back-end (optionnel)** : API REST avec Node/Express pour stocker les tâches sur serveur (extension future, non requise pour le fonctionnement local).

En enregistrant ce fichier, Cursor va le reconnaître automatiquement comme une Project Rule. Vous pouvez vérifier dans l'interface de Cursor (section "Rules") que feature-planning.md est listé et activé.

💡 Remarque : Ce fichier sert de référence à l'IA. Avant de générer du code, prenez le temps de bien décrire vos attentes dans un fichier de règles ou dans le prompt initial. Dans notre cas, nous avons détaillé les catégories GTD et les fonctionnalités pour guider l'agent. Même si on n'implémente pas toutes les catégories dans ce tutoriel, les mentionner aide l'IA à comprendre le contexte général.

---

## 3.1. Règle de Chain of Thought (CoT)

Pour améliorer la qualité des réponses de l'IA et favoriser un raisonnement étape par étape, nous allons ajouter une règle de **Chain of Thought** (chaîne de raisonnement) dans notre fichier de règles `worklow-ai.md`. Cette règle incite l'agent à expliciter sa démarche avant de générer du code ou de proposer une solution.

**Créez un fichier `workflow-ai.md` avec le contenu suivant :**

<details>
<summary>Cliquez pour voir le contenu de workflow-ai.md</summary>

```markdown
---
description: 
globs: 
alwaysApply: true
---
# Prompt Agent : Planification et Implémentation de Fonctionnalités

Tu es un agent spécialisé dans la résolution de fonctionnalités et le développement au sein d'une base de code existante. Suis ce processus optimisé de manière stricte pour assurer une intégration efficace :

## 1. Analyse de la Demande

Comprends précisément la fonctionnalité demandée.

Reformule clairement la demande pour confirmer l'alignement et la compréhension.

Liste les objectifs finaux spécifiques pour la fonctionnalité.

## 2. Analyse de la Base de Code

Inspecte minutieusement la base de code existante pour identifier les composants impactés.

Définis clairement les sections de code à modifier, supprimer ou créer.

Documente les dépendances potentielles et les contraintes techniques.

## 3. Vérification d'Informations via MCP DeepWiki

Avant de créer la liste de tâches, consulte MCP DeepWiki pour déterminer si des informations supplémentaires ou des détails techniques sont nécessaires.

Documente clairement les informations pertinentes obtenues et leur impact sur le développement de la fonctionnalité.

## 4. Plan d'Implémentation (Liste de Tâches)

Décompose clairement la fonctionnalité en tâches séquentielles et actionnables.

Les tâches doivent être concises, actionnables et explicitement liées aux composants de code ou aux objectifs spécifiques.

Mets en évidence les tâches conditionnelles ou celles nécessitant une vérification intermédiaire.

## 5. Exécution de la Liste de Tâches

Complète chaque tâche de manière séquentielle.

Vérifie immédiatement chaque tâche après son achèvement, en notant tout succès ou obstacle rencontré.

Documente clairement toutes les modifications de code.

## 6. Vérification Finale

Effectue une révision complète de tous les changements implémentés.

Vérifie que la fonctionnalité intégrée correspond entièrement à la demande initiale.

Suggère des ajustements ou corrections si nécessaire.

Conclus avec un rapport de résumé clair détaillant l'état final de la fonctionnalité et les changements de code associés.
```

</details>

⸻

4. Importer la maquette Figma et générer le front-end

URL de la maquette : https://www.figma.com/design/IhVR4yEdIoYXqZWPnjM11R/Untitled?node-id=0-1&t=zUQ05Loi4gicKfyB-1

Avant de pouvoir importer la maquette dans Cursor, il est nécessaire de créer votre propre projet Figma. Pour cela, rendez-vous sur https://www.figma.com, créez un nouveau fichier, puis copiez-collez le design fourni (ou reproduisez-le à partir des captures d'écran/éléments disponibles). Cela vous permettra d'avoir la main sur le fichier et de récupérer facilement l'URL de la partie « app » (généralement un frame ou une page dédiée à l'interface principale).

Nous arrivons à la partie passionnante : générer l'UI React directement à partir de la maquette Figma, grâce à Cursor AI et au MCP Figma configuré précédemment. L'objectif est de reproduire fidèlement le design de FocusFlow sans coder manuellement chaque composant.

4.1. Import de la maquette Figma via Cursor

Commencez par ouvrir le panneau d'Agent AI dans Cursor (habituellement, un clic sur l'icône 🪄 ou via View > AI). Assurez-vous que le mode Agent est actif (c'est lui qui peut utiliser les MCP).

Dans le chat de l'agent, fournissez le lien de la maquette Figma de FocusFlow. Par exemple, si vous avez un fichier Figma (ou utilisez un URL fictif pour l'exercice), entrez :

::figma https://www.figma.com/file/XXXX/FocusFlow-Design?node-id=0%3A1

(Remplacez par l'URL réelle de votre maquette Figma. Le format est https://www.figma.com/file/ID/NomDuFichier?node-id=<id_du_frame>.)

Lorsque vous envoyez cette commande, Cursor va contacter l'API Figma via le MCP ￼. Vous verrez dans la fenêtre de chat une réponse structurée (en JSON ou Markdown) décrivant la maquette importée. Par exemple, l'agent pourrait lister les frames et composants détectés, avec leurs propriétés CSS (couleurs, dimensions, etc.) issues de Figma.

Exemple de réponse (simplifiée) de Cursor après ::figma:

[Figma] Fichier "FocusFlow-Design" importé avec succès.

- Frame "MainScreen" (375x812)
  - Text "FocusFlow" (Style: Heading 1, Font: Inter, 24px, Bold)
  - Input Field "New Task Input" (Placeholder: "Ajouter une tâche...")
  - Button "Add Task" (Label: "+")
  - List Component "TaskItem" (Repeating item, contains checkbox and task title text)

L'agent a maintenant le contexte du design. Nous allons lui demander de s'en servir pour écrire le code React/Tailwind correspondant.

💡 Astuce : Si votre design Figma contient plusieurs écrans ou composants complexes, vous pouvez cibler un frame ou composant spécifique en incluant son ID de nœud dans l'URL (le node-id paramètre). Ainsi, Cursor ne chargera que la partie pertinente du design, ce qui réduit le bruit dans le contexte.

4.2. Génération du code React/Tailwind à partir du design

À présent, nous allons formuler une instruction claire à l'agent pour qu'il génère le code de l'interface. En nous appuyant sur les données Figma déjà chargées et sur notre fichier de règles, nous pouvons demander quelque chose comme :

Sur la base de la maquette importée, implémente l'interface utilisateur de FocusFlow en React + TypeScript avec Tailwind CSS. En suivant ce CoT : @workflow-ai.md & @feature-planning.md
- Utilise le store Zustand (useTaskStore) pour gérer la liste des tâches.
- Crée un composant pour l'ajout de tâche (champ texte + bouton).
- Crée un composant TaskList qui affiche les tâches (cases à cocher pour marquer terminé).
- Respecte le style du design (typographie, couleurs, marges) en utilisant des classes Tailwind.

Envoyez cette requête à l'agent Cursor. Celui-ci va analyser :
	•	Le design Figma (structures et styles),
	•	Le fichier de règles (spécifications de fonctionnalités),
	•	Le code existant (notre structure de projet, le store Zustand, etc.),

Puis proposer des modifications/créations de fichiers pour réaliser l'interface.

✅ À ce stade, préparez-vous à examiner et valider les suggestions de l'IA. Cursor va potentiellement créer plusieurs fichiers/composants. Il peut ouvrir des diff ou vous demander confirmation avant d'écrire. N'hésitez pas à accepter les changements qui correspondent à ce que vous attendez, ou à affiner la demande si nécessaire.

Résultat attendu : L'agent devrait générer, entre autres :
	•	Un composant TaskInput (champ + bouton) conforme au design Figma pour l'ajout de tâche.
	•	Un composant TaskItem représentant une tâche individuelle (avec une case à cocher stylisée et le titre de la tâche, éventuellement un bouton de suppression).
	•	Un composant TaskList pour parcourir la liste des tâches du store et afficher un TaskItem pour chacune.
	•	Intégration de ces composants dans TaskPage.tsx (par ex. <TaskInput /> suivi de <TaskList />).
	•	Du CSS utilitaire via Tailwind classes pour correspondre au style (par ex. couleur de fond, arrondis, espacements similaires à la maquette).

Voici un exemple (hypothétique) de code que Cursor pourrait proposer pour TaskPage.tsx :

// src/pages/TaskPage.tsx
import { useTaskStore } from '../store';
import TaskItem from '../components/TaskItem';
import TaskInput from '../components/TaskInput';

export default function TaskPage() {
  const tasks = useTaskStore(state => state.tasks);
  const toggleTask = useTaskStore(state => state.toggleTask);

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FocusFlow</h1>
      <TaskInput />
      <ul className="mt-4">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
        ))}
      </ul>
    </main>
  );
}

Et par exemple, le composant d'entrée de tâche :

// src/components/TaskInput.tsx
import { useState } from 'react';
import { useTaskStore } from '../store';

export default function TaskInput() {
  const [title, setTitle] = useState('');
  const addTask = useTaskStore(state => state.addTask);

  const handleAdd = () => {
    if (title.trim() !== '') {
      addTask(title);
      setTitle('');
    }
  };

  return (
    <div className="flex">
      <input 
        type="text" 
        placeholder="Ajouter une tâche..." 
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="flex-1 border border-gray-300 rounded-l px-2 py-1"
      />
      <button 
        onClick={handleAdd} 
        className="bg-blue-500 text-white px-4 py-1 rounded-r"
      >
        +
      </button>
    </div>
  );
}

Ces extraits ne sont qu'illustratifs – votre agent peut proposer un code un peu différent. L'essentiel est que l'application respecte le look & feel de la maquette. À la fin de cette étape, notre front-end est fonctionnel : vous pouvez lancer npm run dev et vérifier que vous pouvez ajouter des tâches, les voir apparaître dans la liste, et cocher/décocher leur statut (les rendant barrées ou estompées selon le style appliqué).

Conseils lors de la génération par l'IA :
	•	Vérifiez que les classes Tailwind proposées correspondent bien à l'apparence souhaitée. Ajustez au besoin (vous pouvez dialoguer avec l'agent en disant par ex. « la couleur du bouton est incorrecte, devrait être bleu foncé (#1E3A8A) »).
	•	Assurez-vous que le code TypeScript compile sans erreur. L'agent prend en compte votre base de code, mais il peut y avoir des ajustements mineurs (types, import manquant). Ces détails peuvent être résolus en demandant à Cursor de corriger les erreurs de compilation.
	•	Profitez de la persistance Zustand : rechargez la page web, les tâches ajoutées précédemment doivent se recharger depuis localStorage – signe que tout fonctionne comme prévu niveau état global.

N'hésitez pas à itérer quelques fois pour arriver au résultat. Attention suivant le model choisi, les résultats peuvent varier.

⸻

5. Génération et exécution de tests E2E avec Playwright

Maintenant que l'application front-end est prête, nous allons écrire des tests end-to-end (E2E) pour vérifier automatiquement les fonctionnalités principales. Grâce au MCP Playwright, nous pouvons décrire en langage naturel les interactions utilisateur, et laisser Cursor les exécuter dans un navigateur réel.

Assurez-vous d'abord que votre application tourne localement : dans un terminal, lancez npm run dev (ou npm run build && npm run preview pour une version plus proche de la production). Supposons qu'elle est accessible sur http://localhost:5173.

Dans Cursor, ouvrez le chat de l'agent AI. Formulons un scénario de test, par exemple pour l'ajout d'une tâche :

Ouvre le navigateur à l'URL http://localhost:5173.
Dans le champ d'ajout de tâche, tape "Tâche de test".
Clique sur le bouton "+" pour ajouter la tâche.
Vérifie ensuite que "Tâche de test" apparaît dans la liste des tâches.

Envoyez ce prompt à l'agent. Voici ce qu'il va se passer :
	•	L'IA va reconnaître qu'elle doit utiliser le navigateur via Playwright. Elle va probablement afficher un message de demande de permission pour exécuter l'outil (par ex. "The agent wants to use Playwright to navigate to http://localhost:5173"). Autorisez l'exécution en cliquant sur "Run tool".
	•	Le navigateur contrôlé par Playwright va s'ouvrir (peut-être en arrière-plan) sur la page de votre application.
	•	Étape par étape, l'agent va remplir le champ, cliquer le bouton, puis lire le DOM pour trouver la nouvelle tâche.
	•	À chaque étape, Cursor peut demander confirmation ("Run tool: click selector xyz?"). Vous pouvez continuer à approuver, ou activer le mode auto-run si vous êtes confiant ￼.
	•	Enfin, l'agent vous retournera le résultat du test, par exemple : "Test réussi : l'élément 'Tâche de test' est présent dans la liste.", ou bien un message d'erreur si quelque chose n'a pas fonctionné.

Vous venez d'exécuter votre premier test E2E via l'IA 🎉. L'avantage de cette approche est que l'agent a pu adapter les sélecteurs automatiquement en comprenant le contexte (par ex., il a pu trouver le champ d'entrée par son placeholder ou label, plutôt que vous ayez à écrire un sélecteur CSS précis).

Exemple de log de Cursor lors du test :

1. [Playwright] Navigating to http://localhost:5173 ✅
2. [Playwright] Filling input [placeholder="Ajouter une tâche..."] with "Tâche de test" ✅
3. [Playwright] Clicking button [text="+" icon] ✅
4. [Playwright] Extracting text content of page...
   - Found list item: "Tâche de test" ✅

✔ Test passed: "Tâche de test" is displayed in the task list.

(Le format exact peut varier, mais l'idée est que chaque action est confirmée.)

Vous pouvez enchaîner avec d'autres scénarios si désiré, par exemple tester la case à cocher :

Coche la case de la tâche "Tâche de test".
Vérifie que le texte "Tâche de test" a bien la classe ou le style indiquant son achèvement (ex: texte barré).

L'agent saura cliquer sur la checkbox correspondante et lire le style appliqué (par exemple, il pourrait détecter la classe line-through de Tailwind sur le texte et en déduire que c'est barré).

💡 Astuce (mode auto-run) : Si vous trouvez fastidieux de cliquer "Run" à chaque étape du test, vous pouvez activer le mode Auto-Run dans Cursor Settings > Features > MCP, ce qui permet à l'agent d'enchaîner les actions sans interruption ￼. Attention : à utiliser prudemment, l'auto-run exécutera toute action approuvée par la liste blanche configurée, pouvant potentiellement poser des risques de sécurité si un outil mal utilisé reçoit une commande non souhaitée. Pour notre cas local, cela facilite simplement l'exécution fluide du scénario de test.

⸻

6. Backend Express (optionnel)

Jusqu'ici, FocusFlow fonctionne entièrement côté front-end, en stockant les tâches dans le navigateur (localStorage via Zustand). Pour une application multi-appareils ou multi-utilisateurs, on voudrait un backend pour persister les données sur un serveur. Cette section optionnelle montre comment ajouter une petite API Node/Express pour gérer les tâches, et comment adapter le front-end en conséquence.

6.1. Création d'une API Express pour les tâches

Nous allons créer rapidement une API REST avec Express permettant de lister, ajouter et mettre à jour des tâches. Pour garder les choses simples, on utilisera une structure en mémoire (un tableau) comme stockage des tâches côté serveur. En contexte réel, on utiliserait une base de données, mais cela sort du périmètre de ce codelab.
	•	Initialiser le backend : À la racine du projet (dossier focusflow/), créez un dossier api/ (ou backend/). Vous pouvez y initialiser un projet Node séparé :

cd focusflow
mkdir api && cd api
npm init -y
npm install express cors
npm install -D typescript @types/express @types/node ts-node nodemon

On installe Express, le middleware CORS (pour autoriser le front http://localhost:5173 à appeler l'API), et des outils de dev (TypeScript, types, nodemon pour rechargement auto).

	•	Configurer TypeScript : générez un tsconfig simple :

npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule

(Assurez-vous que src existe, sinon créez-le.)

	•	Coder l'API : dans api/src/, créez un fichier index.ts :

<details>
<summary>Cliquez pour voir le code complet de l'API Express</summary>

```typescript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface Task {
  id: number;
  title: string;
  done: boolean;
}
let tasks: Task[] = [
  // quelques données initiales éventuelles
];

// Récupérer toutes les tâches
app.get('/tasks', (_req, res) => {
  res.json(tasks);
});

// Ajouter une nouvelle tâche
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).send({ error: 'Title is required' });
  }
  const newTask: Task = { id: Date.now(), title: title.trim(), done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Mettre à jour une tâche (par exemple pour marquer comme fait ou éditer le titre)
app.put('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).send({ error: 'Task not found' });
  }
  const { title, done } = req.body;
  if (typeof title === 'string') {
    task.title = title.trim();
  }
  if (typeof done === 'boolean') {
    task.done = done;
  }
  res.json(task);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API FocusFlow démarrée sur http://localhost:${PORT}`);
});
```

</details>

Ce serveur écoute par défaut sur le port 3001 (vous pouvez changer via process.env.PORT). Il expose :
	•	GET /tasks – retourne la liste complète tasks.
	•	POST /tasks – ajoute une tâche (attend un body JSON avec { "title": "..." }).
	•	PUT /tasks/:id – modifie une tâche existante (titre et/ou statut done).
On a ajouté cors() sans configuration pour autoriser toute origine. En dev local ça suffira (sinon on pourrait restreindre à http://localhost:5173).

	•	Lancer le backend : Ajoutez peut-être un script dans api/package.json:

"scripts": {
  "dev": "nodemon --watch src --ext ts --exec ts-node src/index.ts"
}

Puis exécutez:

npm run dev

Vous devriez voir le message de démarrage avec l'URL. Testez éventuellement avec curl ou Postman que vous pouvez récupérer la liste des tâches (curl http://localhost:3001/tasks retourne un tableau JSON).

6.2. Connexion du front-end à l'API (modification de tasksService.js)

Pour faire communiquer notre front React avec ce backend, le plus simple est de centraliser les appels dans un module de service. Imaginons un fichier src/services/tasksService.ts côté front qui encapsule les appels fetch à l'API.

Créer/éditer tasksService.ts :

// src/services/tasksService.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Erreur lors du chargement des tâches');
  return res.json(); // renvoie un tableau de tâches
}

export async function createTask(title: string) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Erreur lors de la création de la tâche');
  return res.json();
}

export async function updateTask(id: number, data: Partial<{ title: string; done: boolean }>) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour de la tâche');
  return res.json();
}

Ici, API_URL pointe vers notre backend (on utilise une variable d'environnement VITE_API_URL pour plus de flexibilité en prod). On définit trois fonctions pour correspondre aux endpoints de l'API.

Intégrer ce service dans le store Zustand : Au lieu que Zustand manipule localStorage, on va le modifier pour faire appel à l'API. Cela nécessite quelques ajustements :
	•	Charger les tâches depuis l'API au démarrage.
	•	Envoyer les nouvelles tâches au serveur lors de l'ajout.
	•	Envoyer les mises à jour (done) au serveur.

Une approche simple est d'utiliser un effet dans React au montage du composant principal pour charger les données, ou de migrer Zustand vers un store asynchrone. Pour rester bref, voici comment on peut adapter dans TaskPage.tsx :

// src/pages/TaskPage.tsx
import { useEffect } from 'react';
import { useTaskStore } from '../store';
import { fetchTasks } from '../services/tasksService';
// ...

export default function TaskPage() {
  const tasks = useTaskStore(state => state.tasks);
  const setTasks = useTaskStore(state => state.setTasks);  // supposer qu'on ajoute setTasks action
  // ...

  useEffect(() => {
    // Au montage, charger les tâches depuis l'API
    fetchTasks().then(data => setTasks(data)).catch(console.error);
  }, [setTasks]);

  // ... (UI identique)
}

Et dans le store Zustand (store.ts), on ajouterait une action setTasks pour remplacer l'état (utilisée lors du fetch initial) :

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  // ... autres actions
}

export const useTaskStore = create<TaskState>()(
  persist((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    // ... addTask, toggleTask mis à jour pour appeler l'API via tasksService
  }), { name: "focusflow-tasks" })
);

Idéalement, addTask dans le store appellerait createTask(title) du service, puis ferait set(state => ({ tasks: [...state.tasks, newTask] })) avec la réponse. De même, toggleTask appellerait updateTask(id, { done: nouveauStatut }) puis mettrait à jour localement.

Pour rester concis, l'essentiel est : modifiez les actions Zustand pour qu'elles utilisent l'API. Vous pouvez vous aider de Cursor AI pour cela. Par exemple, après avoir écrit tasksService.ts, vous pouvez demander à Cursor :

Modifie le store Zustand pour utiliser l'API :
- addTask: appeler createTask(title) et ajouter le résultat au state.
- toggleTask: appeler updateTask(id, { done: nouveauStatut }) et mettre à jour le state.
- Retire la persistance localStorage (on s'appuie désormais sur l'API).

<details>
<summary>Cliquez pour voir le code complet du store.ts modifié</summary>

```typescript
// src/store/index.ts
import { create } from 'zustand';
import { createTask, updateTask, fetchTasks } from '../services/tasksService';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  loadTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: async (title: string) => {
    try {
      set({ loading: true, error: null });
      const newTask = await createTask(title);
      set(state => ({ 
        tasks: [...state.tasks, newTask],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout',
        loading: false 
      });
    }
  },
  
  toggleTask: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const task = get().tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = await updateTask(id, { done: !task.done });
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
        loading: false 
      });
    }
  },
  
  loadTasks: async () => {
    try {
      set({ loading: true, error: null });
      const tasks = await fetchTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        loading: false 
      });
    }
  }
}));
```

</details>

L'agent proposera les changements nécessaires dans store.ts. Vérifiez et acceptez-les.

Enfin, testez l'application connectée au backend :
	•	Lancez le serveur Express (npm run dev dans api/).
	•	Lancez le front (npm run dev dans le projet front).
	•	Ouvrez l'app http://localhost:5173. Laissez l'agent de développement (devtools) ouvert sur l'onglet Network pour voir les requêtes.
	•	Ajoutez une tâche depuis l'UI : vous devriez voir une requête POST partir et revenir avec un 201, et la tâche apparaître.
	•	Cochez/décochez une tâche : une requête PUT est envoyée à chaque changement.
	•	Rechargez la page : cette fois, les tâches viennent du serveur (GET /tasks) et non plus du localStorage.

Nous avons maintenant un front-end décorrélé du stockage local, prêt à fonctionner avec un backend – local ou distant.

⸻

Conclusion et prochaines étapes

Dans ce codelab, nous avons construit pas à pas FocusFlow, un gestionnaire de tâches moderne :
	•	Démarrage d'un front-end React/TypeScript configuré avec Tailwind CSS, Zustand (persistance locale) et React Router ￼.
	•	Configuration de l'éditeur Cursor AI avec des outils MCP : intégration Figma (design-to-code), Deepwiki (documentation instantanée) et Playwright (tests automatisés).
	•	Génération de l'interface utilisateur directement à partir d'une maquette Figma importée, accélérant le développement et assurant la fidélité au design.
	•	Écriture de tests end-to-end en langage naturel grâce à l'agent Cursor et au MCP Playwright, pour garantir le bon fonctionnement des fonctionnalités clés.
	•	Extension optionnelle vers un backend Express pour illustrer comment passer d'une application 100% locale à une application full-stack prête pour la production.

FocusFlow est désormais un projet fonctionnel que vous pouvez faire évoluer. Voici quelques idées de prochaines étapes :
	•	🎨 Peaufiner l'UI/UX : ajouter un système de filtres par catégorie ou par statut, intégrer une bibliothèque d'icônes (par ex. Heroicons) pour embellir les boutons.
	•	📱 Responsive avancé : vérifier le rendu sur mobile, éventuellement ajouter un mode sombre via Tailwind.
	•	✅ Tests supplémentaires : écrire des scénarios de tests Playwright plus complets (suppression de tâche, validation de champs vide, etc.) et pourquoi pas intégrer ces tests dans un pipeline CI.
	•	📦 Déploiement : déployer le front sur Vercel/Netlify et l'API sur un service cloud (ou combiner en un seul projet avec build static + serveur). N'oubliez pas alors de configurer les variables (ex: VITE_API_URL) en conséquence.
	•	🔄 Synchronisation temps réel : pour aller plus loin, intégrer un service de temps réel (WebSockets, Pusher, Supabase realtime, etc.) afin de synchroniser les tâches entre plusieurs utilisateurs en direct.
	•	🔒 Authentification : implémenter un système d'authentification pour que chaque utilisateur ait ses propres listes de tâches (nécessiterait un backend plus élaboré).
	•	🧠 Fonctionnalités AI : pourquoi ne pas utiliser l'agent Cursor lui-même ou l'API OpenAI pour suggérer des reformulations de tâches ou prioriser votre to-do list ? Les possibilités sont infinies.

Nous espérons que ce guide vous a montré la puissance de Cursor AI alliée à un stack moderne. En combinant une solide base technique et l'assistance intelligente de l'IA, le temps de développement s'en trouve grandement accéléré, sans sacrifier la qualité du code. FocusFlow en est un excellent exemple : conçu à l'origine en une seule requête d'IA lors d'un hackathon ￼, il démontre qu'avec les bons outils, vos idées peuvent rapidement prendre forme en une application concrète.

Bon code, et bon focus ! 🚀