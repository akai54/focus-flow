# 🚀 FocusFlow - Setup et Configuration

> **Guide 1/3** : Configuration initiale du projet FocusFlow avec Cursor AI et les outils MCP

## 📋 Table des matières

- [🎯 Introduction](#-introduction)
- [📋 Prérequis](#-prérequis)
- [🛠️ 1. Initialisation du projet](#️-1-initialisation-du-projet)
- [⚙️ 2. Configuration de Cursor AI et MCP](#️-2-configuration-de-cursor-ai-et-mcp)
- [📄 3. Création des règles de projet](#-3-création-des-règles-de-projet)
- [➡️ Suite du tutoriel](#️-suite-du-tutoriel)

## 🎯 Introduction

**FocusFlow** est une application de gestion de tâches inspirée de la méthode GTD (Getting Things Done), développée avec un stack moderne et l'assistance de l'IA. Ce premier guide vous accompagne dans la configuration complète de votre environnement de développement.

### 🏗️ Architecture du projet

- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS
- **État global** : Zustand avec persistance localStorage
- **Navigation** : React Router DOM
- **Tests** : Playwright pour les tests E2E
- **IA** : Cursor AI avec intégrations MCP (Figma, Deepwiki, Playwright)
- **Backend** : Express.js (optionnel, guide 3)

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v16+ recommandé) et npm
- **Cursor AI** ([télécharger ici](https://cursor.sh/))
- **Compte Figma** (pour l'import de designs)

## 🛠️ 1. Initialisation du projet

### 1.1 Cloner le boilerplate

Nous partons d'un boilerplate pré-configuré pour éviter les étapes fastidieuses de configuration :

```bash
git clone https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate focusflow
cd focusflow
npm install
```

### 1.2 Vérifier l'installation

```bash
npm run dev
```

✅ L'application doit être accessible sur `http://localhost:5173`

### 1.3 Ajouter les dépendances FocusFlow

```bash
npm install zustand react-router-dom
npm install -D @types/react-router-dom
```

**Dépendances ajoutées :**
- `zustand` : Gestion d'état global avec persistance
- `react-router-dom` : Navigation entre les pages

> 💡 **Pourquoi un boilerplate ?** Configurer React + TypeScript + Vite + Tailwind manuellement nécessite de nombreux fichiers de configuration. Le boilerplate nous permet de nous concentrer sur le développement de FocusFlow.

## ⚙️ 2. Configuration de Cursor AI et MCP

Les **MCP (Model Context Protocol)** étendent les capacités de Cursor AI en connectant des sources externes :

- **🎨 Figma MCP** : Import de designs et génération de code UI
- **📚 Deepwiki MCP** : Accès aux documentations GitHub
- **🧪 Playwright MCP** : Tests E2E automatisés

Vous trouverez une liste de serveurs MCP et leurs instructions d'installation respectives ici: [mcp.so](https://mcp.so).

### 2.1 Configuration complète des MCP

Créez ou éditez le fichier `~/.cursor/mcpServers.json` (accessible également depuis les paramètres de Cursor). :

<details>
<summary>📋 Cliquez pour voir la configuration complète</summary>

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=VOTRE_TOKEN_FIGMA",
        "--stdio"
      ]
    },
    "deepwiki": {
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

> ⚠️ **Important** : Après avoir ajouté les serveurs MCP, redémarrez Cursor et vérifiez que le mode **Agent** est activé dans le chat.

### 2.2 Configuration du MCP Figma

#### Étape 1 : Obtenir un token API Figma

1. Connectez-vous à [Figma](https://figma.com)
2. Allez dans **Settings** → **Account** → **Personal Access Tokens**
3. Générez un nouveau token avec les permissions API ci-dessous:
   <img width="435" alt="image" src="https://github.com/user-attachments/assets/5407a6a1-f6ed-4d35-b346-4b2c157fb012" />

5. ⚠️ **Conservez ce token précieusement** (il ne sera affiché qu'une seule fois)

#### Étape 2 : Configurer le token dans Cursor

Remplacez `VOTRE_TOKEN_FIGMA` dans la configuration MCP par votre token.

#### Étape 3 : Test de la configuration

Une fois configuré, vous pourrez utiliser la commande `::figma` dans le chat Cursor :

```
::figma https://www.figma.com/file/ID/NomDuFichier?node-id=0%3A1
```

### 2.3 Configuration du MCP Deepwiki

Le MCP Deepwiki est un service public qui ne nécessite aucune configuration supplémentaire.

**Utilisation :**
```
::deepwiki facebook/react ask_question "How to use useEffect hook?"
```

### 2.4 Configuration du MCP Playwright

Le MCP Playwright permet d'automatiser les tests E2E directement depuis Cursor.

> 📝 **Note** : La première utilisation peut prendre du temps (téléchargement des navigateurs).

**Test de la configuration :**
Vérifiez que le serveur Playwright apparaît en "vert" dans la liste des MCP de Cursor.

## 📄 3. Création des règles de projet

Les règles de projet guident l'IA dans la génération de code conforme aux spécifications.

### 3.1 Créer feature-planning.md

<details>
<summary>📋 Contenu du fichier feature-planning.md</summary>

```markdown
# FocusFlow – Feature Planning (Spécifications)

FocusFlow est une application de gestion de tâches basée sur la méthode GTD (Getting Things Done).

## Catégories de tâches (GTD)
- **Inbox** : tâches brutes à trier
- **Next Actions** : tâches à réaliser prochainement
- **Projects** : tâches faisant partie de projets à plusieurs étapes
- **Waiting For** : tâches déléguées, en attente d'une action externe
- **Someday/Maybe** : idées ou tâches possibles, un jour
- **Calendar** : tâches liées à des dates précises

*(Pour ce tutoriel, nous simplifierons avec une liste générale)*

## Fonctionnalités Clés
- Ajouter une nouvelle tâche (champ + bouton "Ajouter")
- Lister toutes les tâches
- Marquer une tâche comme terminée (checkbox)
- Modifier le titre d'une tâche
- **UI/UX** : interface minimaliste, responsive (mobile-first)
- **Persistance** : Zustand + localStorage

## Stack Technique
- **Frontend** : React + TypeScript + Tailwind CSS + Zustand
- **Tests** : Playwright MCP via Cursor
- **Backend** : Express.js (optionnel)
```

</details>

### 3.2 Créer workflow-ai.md

<details>
<summary>📋 Contenu du fichier workflow-ai.md</summary>

```markdown
---
description: Workflow Chain of Thought pour FocusFlow
globs: 
alwaysApply: true
---

# Prompt Agent : Planification et Implémentation

Tu es un agent spécialisé dans le développement au sein d'une base de code existante. Suis ce processus strict :

## 1. Analyse de la Demande
- Comprends précisément la fonctionnalité demandée
- Reformule la demande pour confirmer la compréhension
- Liste les objectifs finaux spécifiques

## 2. Analyse de la Base de Code
- Inspecte la base de code existante
- Identifie les composants impactés
- Documente les dépendances et contraintes

## 3. Vérification via MCP DeepWiki
- Consulte les documentations nécessaires
- Documente les informations pertinentes
- Évalue l'impact sur le développement

## 4. Plan d'Implémentation
- Décompose en tâches séquentielles
- Tâches concises et actionnables
- Identifie les vérifications intermédiaires

## 5. Exécution
- Complète chaque tâche séquentiellement
- Vérifie immédiatement après chaque étape
- Documente les modifications

## 6. Vérification Finale
- Révision complète des changements
- Correspondance avec la demande initiale
- Rapport de synthèse détaillé
```

</details>

### 3.3 Créer les fichiers

```bash
# Créer feature-planning.md
cat > feature-planning.md << 'EOF'
[Contenu du fichier ci-dessus]
EOF

# Créer workflow-ai.md
cat > workflow-ai.md << 'EOF'
[Contenu du fichier ci-dessus]
EOF
```

> ✅ **Vérification** : Les fichiers doivent apparaître dans la section "Rules" de Cursor.

## ➡️ Suite du tutoriel

Votre environnement est maintenant prêt ! Passez au guide suivant :

**[📱 02-frontend.md - Développement de l'interface](02-frontend.md)**

---

### 📚 Guides disponibles

1. **[🚀 01-setup.md](01-setup.md)** - Configuration et préparation ← *Vous êtes ici*
2. **[📱 02-frontend.md](02-frontend.md)** - Développement de l'interface  
3. **[🔧 03-backend.md](03-backend.md)** - Backend Express (optionnel)
4. **[🏠 README.md](README.md)** - Vue d'ensemble du projet

---

> 💡 **Besoin d'aide ?** Consultez la [documentation Cursor](https://cursor.sh/docs) ou le [guide MCP](https://docs.anthropic.com/claude/docs/mcp)
