# 📱 FocusFlow - Développement Frontend

> **Guide 2/3** : Création de l'interface utilisateur avec React, TypeScript et Tailwind CSS

## 📋 Table des matières

- [🎯 Objectifs](#-objectifs)
- [📐 1. Import de la maquette Figma](#-1-import-de-la-maquette-figma)
- [⚛️ 2. Génération des composants React](#️-2-génération-des-composants-react)
- [🏪 3. Configuration du store Zustand](#-3-configuration-du-store-zustand)
- [🧪 4. Tests E2E avec Playwright](#-4-tests-e2e-avec-playwright)
- [🎨 5. Optimisations et finitions](#-5-optimisations-et-finitions)
- [➡️ Suite du tutoriel](#️-suite-du-tutoriel)

## 🎯 Objectifs

Dans ce guide, nous allons :
- Importer une maquette Figma via Cursor AI
- Générer automatiquement l'interface React/Tailwind
- Implémenter la logique métier avec Zustand
- Créer des tests E2E automatisés
- Optimiser l'expérience utilisateur

> 📋 **Prérequis** : Avoir terminé le [guide de setup](01-setup.md) et configuré Cursor AI avec les MCP.

## 📐 1. Import de la maquette Figma

### 1.1 Préparer votre design Figma

**URL de référence** : https://www.figma.com/design/IhVR4yEdIoYXqZWPnjM11R/Untitled?node-id=0-1&t=zUQ05Loi4gicKfyB-1

> ⚠️ **Important** : Pour utiliser le MCP Figma, vous devez créer votre propre fichier Figma et y reproduire le design, car le MCP nécessite les permissions d'accès.

**Étapes :**
1. Créez un nouveau fichier Figma
2. Copiez les éléments depuis l'[URL de référence](https://www.figma.com/file/VOTRE_ID/FocusFlow-Design), pour reproduire le template chez vous
3. Récupérez l'URL de votre fichier (`https://www.figma.com/file/VOTRE_ID/...`)

### 1.2 Importer l'écran "App" via Cursor AI

Nous allons d'abord travailler sur le deuxième écran de la maquette Figma et vous pourrez réaliser la landing page s'il vous reste du temps à la fin.

Dans Cursor, ouvrez le chat Agent (🪄) et utilisez la commande :

```
::figma https://www.figma.com/file/VOTRE_ID/FocusFlow-Design?node-id=0%3A1
```

**Réponse attendue :**
```
[Figma] Fichier "FocusFlow-Design" importé avec succès.

- Frame "MainScreen" (375x812)
  - Text "FocusFlow" (Style: Heading 1, Font: Inter, 24px, Bold)
  - Input Field "New Task Input" (Placeholder: "Ajouter une tâche...")
  - Button "Add Task" (Label: "+")
  - List Component "TaskItem" (contient checkbox + titre)
```

> 💡 **Astuce** : Si votre design contient plusieurs écrans, ciblez un frame spécifique avec le paramètre `node-id` pour réduire le contexte.

## ⚛️ 2. Génération des composants React

### 2.1 Lancer l'application

```bash
npm run dev
```

L'application doit être accessible sur `http://localhost:5173`

### 2.2 Prompt pour la génération

Avant de 

Une fois la maquette importée, utilisez ce prompt dans Cursor :

```
Sur la base de la maquette Figma importée, implémente l'interface FocusFlow en React + TypeScript avec Tailwind CSS.

Suis les règles : @workflow-ai.md & @feature-planning.md

Composants à créer :
- TaskInput : champ de saisie + bouton d'ajout
- TaskItem : élément de tâche avec checkbox + titre
- TaskList : liste des tâches
- TaskPage : page principale intégrant tous les composants

Utilise le store Zustand (useTaskStore) pour la gestion d'état.
Respecte fidèlement le style du design Figma.
```

Vous pourriez avoir besoin de plusieurs interactions avec l'agent Cursor, pour créer cette page.

#### Review

Vous pouvez review un par un les fichiers générés, puis les accepter:

<img width="500" alt="image" src="https://github.com/user-attachments/assets/75ab428a-f31b-4f02-ad2c-56f5a6371344" />

...ou accepter l'ensemble des modifications apportées par l'agent cursor:

<img width="500" alt="image" src="https://github.com/user-attachments/assets/c461f2c6-fea1-4c96-82a6-f0dc29feeb03" />

### 2.3 Structure des composants générés

Cursor devrait avoir produit des fichiers similaires à ceux-ci:

**TaskInput.tsx**

<details>
<summary>🔍 Code généré - TaskInput.tsx (cliquez pour révéler)</summary>

```typescript
import { useState } from 'react';
import { useTaskStore } from '../store';

export default function TaskInput() {
  const [title, setTitle] = useState('');
  const addTask = useTaskStore(state => state.addTask);

  const handleAdd = () => {
    if (title.trim()) {
      addTask(title);
      setTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Ajouter une tâche..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleAdd}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        +
      </button>
    </div>
  );
}
```

</details>

**TaskItem.tsx**

<details>
<summary>🔍 Code généré - TaskItem.tsx (cliquez pour révéler)</summary>

```typescript
import { useTaskStore } from '../store';

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    done: boolean;
  };
}

export default function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useTaskStore(state => state.toggleTask);
  const removeTask = useTaskStore(state => state.removeTask);

  return (
    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg mb-2">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleTask(task.id)}
        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
      />
      <span className={`flex-1 ${task.done ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </span>
      <button
        onClick={() => removeTask(task.id)}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        🗑️
      </button>
    </div>
  );
}
```

</details>

**TaskList.tsx**

<details>
<summary>🔍 Code généré - TaskList.tsx (cliquez pour révéler)</summary>

```typescript
import { useTaskStore } from '../store';
import TaskItem from './TaskItem';

export default function TaskList() {
  const tasks = useTaskStore(state => state.tasks);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune tâche pour le moment. Ajoutez-en une ! 🚀
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
```

</details>

**TaskPage.tsx**

<details>
<summary>🔍 Code généré - TaskPage.tsx (cliquez pour révéler)</summary>

```typescript
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';

export default function TaskPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">FocusFlow</h1>
        <p className="text-gray-600">Organisez vos tâches avec la méthode GTD</p>
      </header>
      
      <TaskInput />
      <TaskList />
    </div>
  );
}
```

</details>

**types/index.ts**

<details>
<summary>🔍 Code généré - Types TypeScript (cliquez pour révéler)</summary>

```typescript
export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
}

export interface TaskStore {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
  clearCompleted: () => void;
}
```

</details>

**store/index.ts**

<details>
<summary>🔍 Code généré - Store Zustand (cliquez pour révéler)</summary>

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStore } from '../types';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (title: string) => {
        const newTask: Task = {
          id: Date.now(),
          title: title.trim(),
          done: false,
          createdAt: new Date()
        };
        
        set(state => ({
          tasks: [...state.tasks, newTask]
        }));
      },
      
      toggleTask: (id: number) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, done: !task.done } : task
          )
        }));
      },
      
      removeTask: (id: number) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },
      
      clearCompleted: () => {
        set(state => ({
          tasks: state.tasks.filter(task => !task.done)
        }));
      }
    }),
    {
      name: 'focusflow-tasks',
      version: 1
    }
  )
);
```

</details>

**App.tsx**

<details>
<summary>🔍 Code généré - App.tsx (cliquez pour révéler)</summary>

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskPage from './pages/TaskPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<TaskPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

</details>

## 🧪 4. Tests E2E avec Playwright

### 4.1 Créer des tests via Cursor AI

Dans le chat Cursor, utilisez ces prompts pour tester automatiquement :

#### Test 1 : Ajouter une tâche
```
Ouvre le navigateur à http://localhost:5173
Dans le champ "Ajouter une tâche...", tape "Ma première tâche"
Clique sur le bouton "+"
Vérifie que "Ma première tâche" apparaît dans la liste
```

#### Test 2 : Marquer une tâche comme terminée
```
Coche la case de la tâche "Ma première tâche"
Vérifie que le texte est barré et grisé
```

#### Test 3 : Supprimer une tâche
```
Clique sur l'icône de suppression 🗑️
Vérifie que la tâche a disparu de la liste
```

### 4.2 Résultats attendus

```
✅ Test passed: Task successfully added to the list
✅ Test passed: Task marked as completed (strikethrough applied)
✅ Test passed: Task removed from the list
```

> 💡 **Astuce** : Activez le mode Auto-Run dans Cursor Settings > Features > MCP pour exécuter les tests sans confirmation manuelle.

## 🎨 5. Optimisations et finitions

### 5.1 Filtres et statistiques

Ajoutez des filtres pour améliorer l'UX :

**TaskFilter.tsx**

<details>
<summary>🔍 Code généré - TaskFilter.tsx (cliquez pour révéler)</summary>

```typescript
import { useTaskStore } from '../store';

type Filter = 'all' | 'active' | 'completed';

interface TaskFilterProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

export default function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  const tasks = useTaskStore(state => state.tasks);
  const clearCompleted = useTaskStore(state => state.clearCompleted);
  
  const activeCount = tasks.filter(task => !task.done).length;
  const completedCount = tasks.filter(task => task.done).length;

  return (
    <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-lg border">
      <span className="text-sm text-gray-600">
        {activeCount} tâche{activeCount > 1 ? 's' : ''} active{activeCount > 1 ? 's' : ''}
      </span>
      
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as Filter[]).map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              currentFilter === filter
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter === 'all' ? 'Toutes' : filter === 'active' ? 'Actives' : 'Terminées'}
          </button>
        ))}
      </div>
      
      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Effacer terminées
        </button>
      )}
    </div>
  );
}
```

</details>

### 5.2 Responsive design

Assurez-vous que l'interface s'adapte aux mobiles :

<details>
<summary>🔍 Code généré - Responsive Design (cliquez pour révéler)</summary>

```typescript
// Dans TaskPage.tsx
<div className="max-w-2xl mx-auto p-4 sm:p-6">
  <header className="text-center mb-6 sm:mb-8">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
      FocusFlow
    </h1>
    <p className="text-sm sm:text-base text-gray-600">
      Organisez vos tâches avec la méthode GTD
    </p>
  </header>
  
  {/* Reste du contenu */}
</div>
```

</details>

### 5.3 Animations et transitions

Ajoutez des transitions fluides avec Tailwind :

<details>
<summary>🔍 Code généré - Animations et Transitions (cliquez pour révéler)</summary>

```typescript
// Dans TaskItem.tsx
<div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg mb-2 
                transition-all duration-200 hover:shadow-md hover:border-gray-300">
  {/* Contenu */}
</div>
```

</details>

## ✅ Test final

Vérifiez que votre application fonctionne correctement :

1. **Ajout de tâches** : Le champ se vide après ajout
2. **Persistance** : Les tâches restent après rechargement
3. **Interactions** : Cocher/décocher fonctionne
4. **Suppression** : Les tâches se suppriment
5. **Responsive** : Interface adaptée mobile/desktop

## ➡️ Suite du tutoriel

Votre frontend est terminé ! Pour ajouter un backend et synchroniser vos tâches :

**[🔧 03-backend.md - Backend Express (optionnel)](03-backend.md)**

---

### 📚 Guides disponibles

1. **[🚀 01-setup.md](01-setup.md)** - Configuration et préparation
2. **[📱 02-frontend.md](02-frontend.md)** - Développement de l'interface ← *Vous êtes ici*
3. **[🔧 03-backend.md](03-backend.md)** - Backend Express (optionnel)
4. **[🏠 README.md](README.md)** - Vue d'ensemble du projet

---

> 🎉 **Félicitations !** Vous avez créé une application de gestion de tâches moderne avec React, TypeScript et Tailwind CSS, assisté par l'IA Cursor !
