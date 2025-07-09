# 🔧 FocusFlow - Backend Express avec Cursor AI

> **Guide 3/3** : Création d'une API REST avec Express.js assistée par l'IA pour persister les tâches sur serveur

## 📋 Table des matières

- [🎯 Objectifs](#-objectifs)
- [🏗️ 1. Architecture backend](#️-1-architecture-backend)
- [⚙️ 2. Génération du projet API avec Cursor](#️-2-génération-du-projet-api-avec-cursor)
- [🚀 3. Implémentation de l'API Express](#-3-implémentation-de-lapi-express)
- [🔄 4. Adaptation du frontend](#-4-adaptation-du-frontend)
- [🧪 5. Tests automatisés avec Playwright MCP](#-5-tests-automatisés-avec-playwright-mcp)
- [📦 6. Déploiement et production](#-6-déploiement-et-production)

## 🎯 Objectifs

Transformer FocusFlow d'une application locale vers une solution full-stack avec l'assistance de Cursor AI :

- ✅ **API REST** complète générée avec TypeScript
- ✅ **Persistance serveur** remplaçant localStorage
- ✅ **Service layer** généré automatiquement
- ✅ **Gestion d'erreurs** et états de chargement
- ✅ **Tests E2E** automatisés via Playwright MCP
- ✅ **Workflow IA** avec Chain of Thought

> 📋 **Prérequis** : Avoir terminé les guides [setup](01-setup.md) et [frontend](02-frontend.md), avec Cursor AI et les MCP configurés.

## 🏗️ 1. Architecture backend

### 1.1 Vue d'ensemble

```
focusflow/
├── src/                    # Frontend React
├── api/                    # Backend Express
│   ├── src/
│   │   ├── index.ts       # Point d'entrée
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middlewares
│   │   └── types/         # Types TypeScript
│   ├── package.json
│   └── tsconfig.json
└── package.json           # Frontend
```

### 1.2 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/tasks` | Récupérer toutes les tâches |
| `POST` | `/api/tasks` | Créer une nouvelle tâche |
| `PUT` | `/api/tasks/:id` | Modifier une tâche existante |
| `DELETE` | `/api/tasks/:id` | Supprimer une tâche |

### 1.3 Modèle de données

```typescript
interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## ⚙️ 2. Génération du projet API avec Cursor

### 2.1 Prompt de configuration initiale

Dans Cursor, ouvrez le chat Agent (🪄) et utilisez ce prompt structuré :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Crée la structure backend Express pour FocusFlow :

1. **Analyse** : Examine la structure frontend existante
2. **Architecture** : Crée un dossier `api/` avec structure TypeScript
3. **Configuration** : Génère package.json, tsconfig.json et scripts de développement
4. **Dépendances** : Installe express, cors, dotenv + types TypeScript

Structure attendue :
```
api/
├── src/
│   ├── index.ts
│   ├── routes/
│   ├── middleware/
│   └── types/
├── package.json
└── tsconfig.json
```

Utilise les meilleures pratiques TypeScript et Express 2024.
```

### 2.2 Vérification via Cursor Agent

**Réponse attendue :**
```
[Agent] Structure backend créée avec succès :

✅ Dossier api/ initialisé
✅ package.json avec scripts de développement
✅ tsconfig.json optimisé pour Express + TypeScript
✅ Dépendances installées (express, cors, dotenv, types)
✅ Structure src/ préparée pour l'API REST

Commandes disponibles :
- npm run dev : Démarrage en mode développement
- npm run build : Compilation TypeScript
- npm run start : Démarrage en production
```

### 2.3 Vérification manuelle

```bash
# Vérifier la structure générée
ls -la api/

# Tester l'installation
cd api && npm run dev
```

> ✅ **Validation** : Le serveur doit démarrer sans erreur sur le port 3001.

## 🚀 3. Implémentation de l'API Express

### 3.1 Génération des types TypeScript

Dans Cursor, utilisez ce prompt pour générer les types :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Crée les types TypeScript pour l'API FocusFlow :

1. **Analyse** : Examine les types existants dans le frontend
2. **Interface Task** : Compatible avec le store Zustand actuel
3. **Types API** : Requests/responses pour REST endpoints
4. **Validation** : Types pour la validation des données

Endpoints requis :
- GET /api/tasks (liste des tâches)
- POST /api/tasks (créer tâche)
- PUT /api/tasks/:id (modifier tâche)
- DELETE /api/tasks/:id (supprimer tâche)

Fichier : api/src/types/index.ts
```

**Code généré attendu :**

<details>
<summary>🔍 Types générés - api/src/types/index.ts</summary>

```typescript
export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  done?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

</details>

### 3.2 Génération du middleware de validation

Prompt Cursor pour le middleware :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Crée les middlewares de validation pour l'API FocusFlow :

1. **Analyse** : Utilise les types créés précédemment
2. **Validation création** : Vérifier title (requis, string, max 255 chars)
3. **Validation mise à jour** : Vérifier title optionnel et done boolean
4. **Gestion erreurs** : Retourner des messages d'erreur clairs en français
5. **TypeScript** : Typage strict avec Request/Response

Fichier : api/src/middleware/validation.ts
Respect les bonnes pratiques Express 2024.
```

**Code généré attendu :**

<details>
<summary>🔍 Middleware généré - api/src/middleware/validation.ts</summary>

```typescript
import { Request, Response, NextFunction } from 'express';

export const validateTaskCreation = (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Le titre de la tâche est requis et ne peut pas être vide'
    });
  }
  
  if (title.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Le titre ne peut pas dépasser 255 caractères'
    });
  }
  
  next();
};

export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { title, done } = req.body;
  
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      error: 'Le titre doit être une chaîne non vide'
    });
  }
  
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'Le statut "done" doit être un booléen'
    });
  }
  
  next();
};
```

</details>

### 3.3 Génération des routes API

Prompt Cursor pour les routes complètes :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Crée les routes API REST pour FocusFlow :

1. **Analyse** : Utilise les types et middlewares créés
2. **Endpoints** : GET, POST, PUT, DELETE pour /api/tasks
3. **Stockage** : Utilise un stockage en mémoire (array)
4. **Gestion erreurs** : Try/catch avec messages explicites
5. **TypeScript** : Typage strict pour Request/Response

Spécifications :
- GET /api/tasks : Liste triée par date de création
- POST /api/tasks : Création avec validation
- PUT /api/tasks/:id : Modification partielle
- DELETE /api/tasks/:id : Suppression

Fichier : api/src/routes/tasks.ts
Respect les conventions REST 2024.
```

**Code généré attendu :**

<details>
<summary>🔍 Routes générées - api/src/routes/tasks.ts</summary>

```typescript
import { Router, Request, Response } from 'express';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types';
import { validateTaskCreation, validateTaskUpdate } from '../middleware/validation';

const router = Router();

// Stockage en mémoire (remplacer par une BDD en production)
let tasks: Task[] = [];
let nextId = 1;

// GET /api/tasks - Récupérer toutes les tâches
router.get('/', (req: Request, res: Response<ApiResponse<Task[]>>) => {
  try {
    res.json({
      success: true,
      data: tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des tâches'
    });
  }
});

// POST /api/tasks - Créer une nouvelle tâche
router.post('/', validateTaskCreation, (req: Request<{}, ApiResponse<Task>, CreateTaskRequest>, res: Response<ApiResponse<Task>>) => {
  try {
    const { title } = req.body;
    const now = new Date();
    
    const newTask: Task = {
      id: nextId++,
      title: title.trim(),
      done: false,
      createdAt: now,
      updatedAt: now
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la tâche'
    });
  }
});

// PUT /api/tasks/:id - Modifier une tâche
router.put('/:id', validateTaskUpdate, (req: Request<{ id: string }, ApiResponse<Task>, UpdateTaskRequest>, res: Response<ApiResponse<Task>>) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de tâche invalide'
      });
    }
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Tâche non trouvée'
      });
    }
    
    const { title, done } = req.body;
    const updatedTask = {
      ...tasks[taskIndex],
      ...(title !== undefined && { title: title.trim() }),
      ...(done !== undefined && { done }),
      updatedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    
    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la modification de la tâche'
    });
  }
});

// DELETE /api/tasks/:id - Supprimer une tâche
router.delete('/:id', (req: Request<{ id: string }>, res: Response<ApiResponse<void>>) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de tâche invalide'
      });
    }
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Tâche non trouvée'
      });
    }
    
    tasks.splice(taskIndex, 1);
    
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de la tâche'
    });
  }
});

export default router;
```

</details>

### 3.4 Génération du serveur principal

Prompt Cursor pour le serveur Express :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Crée le serveur principal Express pour FocusFlow :

1. **Analyse** : Utilise les routes créées précédemment
2. **Configuration** : CORS, JSON parsing, logging
3. **Routes** : Intégration des routes tasks + health check
4. **Middleware global** : Gestion d'erreurs et logging
5. **Environnement** : Variables d'env avec dotenv

Fonctionnalités :
- CORS configuré pour le frontend (port 5173)
- Logging des requêtes
- Gestion d'erreurs globale
- Health check endpoint
- Démarrage sur port 3001

Fichier : api/src/index.ts
Respect les bonnes pratiques Express 2024.
```

**Code généré attendu :**

<details>
<summary>🔍 Serveur généré - api/src/index.ts</summary>

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';

// Configuration de l'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globaux
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api/tasks', taskRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de gestion d'erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur non gérée:', err);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : err.message
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API FocusFlow démarrée sur http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Tasks API: http://localhost:${PORT}/api/tasks`);
});

export default app;
```

</details>

### 3.5 Configuration des variables d'environnement

⚙️ **Astuce Cursor :**  
Par défaut, Cursor bloque la création et l’édition automatique des fichiers `.env` pour protéger vos secrets (Dotfile Protection).  Si Auto-Run est activé.
  
**Pour permettre à Cursor de générer ou modifier les fichiers `.env` (ex : `api/.env`) lors de l’auto-run ou via les prompts, vous devez désactiver la protection des fichiers cachés (Dotfile protection) dans les paramètres Cursor :**  
  
> 1. Ouvrez **Cursor → Settings → Chat**  
> 2. Cherchez l’option **Dotfile Protection**  
> 3. Désactivez-la (**Web : "disable Dotfile protection"**)  
> 4. Relancez Cursor si besoin  
  
Cela autorisera la génération automatique de fichiers `.env` par l’IA, tout en gardant à l’esprit de ne jamais commiter ces fichiers (ils sont déjà listés dans `.gitignore`).



Prompt Cursor pour l'environnement :

```
Crée le fichier de configuration d'environnement pour l'API :

**Fichier** : api/.env
**Variables** :
- PORT=3001 (port du serveur)
- NODE_ENV=development (environnement de développement)
- FRONTEND_URL=http://localhost:5173 (URL du frontend pour CORS)

Assure-toi que ce fichier soit ignoré par Git (vérifie .gitignore).
```

**Fichier généré :**

<details>
<summary>🔍 Configuration générée - api/.env</summary>

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

</details>

> ⚠️ **Sécurité** : Cursor ajoute automatiquement `api/.env` au `.gitignore` pour éviter de commiter les secrets.

## 🔄 4. Adaptation du frontend

### 4.1 Génération du service API

Prompt Cursor pour créer le service API côté frontend :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Adapte le frontend FocusFlow pour utiliser l'API backend :

1. **Analyse** : Examine le store Zustand actuel
2. **Service API** : Crée un service pour communiquer avec l'API
3. **Types** : Assure la cohérence avec les types backend
4. **Gestion erreurs** : Implemente une classe ApiError
5. **Environnement** : Utilise VITE_API_URL pour la configuration

Endpoints à implémenter :
- getTasks() : GET /api/tasks
- createTask(title) : POST /api/tasks
- updateTask(id, updates) : PUT /api/tasks/:id
- deleteTask(id) : DELETE /api/tasks/:id

Fichier : src/services/api.ts
Respect les bonnes pratiques fetch API 2024.
```

**Code généré attendu :**

<details>
<summary>🔍 Service API généré - src/services/api.ts</summary>

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiError(data.error || 'Erreur API inconnue', response.status);
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Erreur de connexion',
      0
    );
  }
}

export const taskApi = {
  // Récupérer toutes les tâches
  getTasks: (): Promise<Task[]> =>
    apiCall<Task[]>('/tasks'),

  // Créer une nouvelle tâche
  createTask: (title: string): Promise<Task> =>
    apiCall<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  // Modifier une tâche
  updateTask: (id: number, updates: { title?: string; done?: boolean }): Promise<Task> =>
    apiCall<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Supprimer une tâche
  deleteTask: (id: number): Promise<void> =>
    apiCall<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
```

</details>

### 4.2 Migration du store Zustand

Prompt Cursor pour adapter le store existant :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Migre le store Zustand existant pour utiliser l'API backend :

1. **Analyse** : Examine le store actuel (localStorage)
2. **Remplacement** : Remplace localStorage par appels API
3. **Loading states** : Ajoute loading et error states
4. **Optimistic updates** : Implemente pour une meilleure UX
5. **Gestion erreurs** : Rollback en cas d'échec API

Fonctionnalités :
- loadTasks() : Charger depuis l'API au démarrage
- addTask(title) : Créer via API
- toggleTask(id) : Modifier via API avec optimistic update
- removeTask(id) : Supprimer via API avec optimistic update
- clearError() : Gestion des erreurs

Fichier : src/store/index.ts
Conserve la compatibilité avec les composants existants.
```

**Code généré attendu :**

<details>
<summary>🔍 Store migré - src/store/index.ts</summary>

```typescript
import { create } from 'zustand';
import { taskApi, Task } from '../services/api';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadTasks: async () => {
    set({ loading: true, error: null });
    
    try {
      const tasks = await taskApi.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        loading: false
      });
    }
  },

  addTask: async (title: string) => {
    set({ loading: true, error: null });
    
    try {
      const newTask = await taskApi.createTask(title);
      set(state => ({
        tasks: [newTask, ...state.tasks],
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
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    }));

    try {
      const updatedTask = await taskApi.updateTask(id, { done: !task.done });
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t)
      }));
    } catch (error) {
      // Revert optimistic update
      set(state => ({
        tasks: state.tasks.map(t =>
          t.id === id ? { ...t, done: task.done } : t
        ),
        error: error instanceof Error ? error.message : 'Erreur lors de la modification'
      }));
    }
  },

  removeTask: async (id: number) => {
    // Optimistic update
    const originalTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));

    try {
      await taskApi.deleteTask(id);
    } catch (error) {
      // Revert optimistic update
      set({
        tasks: originalTasks,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression'
      });
    }
  },
}));
```

</details>

### 4.3 Génération du composant d'erreurs

Prompt Cursor pour créer le composant d'erreurs :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Crée un composant pour afficher les erreurs API :

1. **Analyse** : Utilise le store Zustand avec error state
2. **Affichage** : Composant conditionnel (masqué si pas d'erreur)
3. **Style** : Design avec Tailwind (rouge, accessible)
4. **Interaction** : Bouton pour fermer l'erreur
5. **UX** : Icône d'alerte + message + bouton fermer

Fonctionnalités :
- Affichage conditionnel de l'erreur
- Styling avec Tailwind (bg-red-50, border-red-200)
- Bouton de fermeture (clearError)
- Accessibilité (couleurs contrastées)

Fichier : src/components/ErrorMessage.tsx
Respect les bonnes pratiques React 2024.
```

**Code généré attendu :**

<details>
<summary>🔍 Composant généré - src/components/ErrorMessage.tsx</summary>

```typescript
import { useTaskStore } from '../store';

export default function ErrorMessage() {
  const { error, clearError } = useTaskStore();

  if (!error) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-red-800">⚠️ {error}</span>
      </div>
      <button
        onClick={clearError}
        className="text-red-600 hover:text-red-800 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
```

</details>

### 4.4 Mise à jour de TaskPage

Prompt Cursor pour adapter la page principale :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Met à jour TaskPage pour intégrer l'API backend :

1. **Analyse** : Examine la TaskPage existante
2. **Chargement initial** : Ajoute useEffect pour loadTasks()
3. **Gestion erreurs** : Intègre le composant ErrorMessage
4. **Loading state** : Ajoute un spinner pendant le chargement
5. **Préservation** : Conserve le design existant

Fonctionnalités :
- useEffect pour charger les tâches au montage
- Affichage du spinner pendant loading
- Intégration ErrorMessage avant TaskInput
- Conservation du layout responsive

Fichier : src/pages/TaskPage.tsx
Conserve la compatibilité avec les composants existants.
```

**Code généré attendu :**

<details>
<summary>🔍 Page mise à jour - src/pages/TaskPage.tsx</summary>

```typescript
import { useEffect } from 'react';
import { useTaskStore } from '../store';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import ErrorMessage from '../components/ErrorMessage';

export default function TaskPage() {
  const { loadTasks, loading } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          FocusFlow
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Organisez vos tâches avec la méthode GTD
        </p>
      </header>
      
      <ErrorMessage />
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      )}
      
      <TaskInput />
      <TaskList />
    </div>
  );
}
```

</details>

### 4.5 Configuration frontend

Prompt Cursor pour les variables d'environnement :

```
Crée les variables d'environnement pour le frontend :

**Fichier** : .env (racine du projet)
**Variable** : VITE_API_URL=http://localhost:3001/api

Assure-toi que ce fichier soit listé dans .gitignore.
```

**Configuration générée :**

<details>
<summary>🔍 Variables d'environnement - .env</summary>

```env
VITE_API_URL=http://localhost:3001/api
```

</details>

## 🧪 5. Tests automatisés avec Playwright MCP

### 5.1 Configuration des tests avec Cursor

Prompt Cursor pour les tests automatisés :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Configure les tests E2E avec Playwright MCP pour FocusFlow :

1. **Analyse** : Tests de l'intégration complète frontend/backend
2. **Scénarios** : Flux utilisateur complet avec persistance
3. **Playwright MCP** : Utilise le serveur MCP configuré
4. **Assertions** : Vérifie la persistance serveur

Tests à implémenter :
- Ajout d'une tâche avec vérification API
- Modification d'une tâche (toggle done)
- Suppression d'une tâche
- Persistance après rechargement de page
- Gestion des erreurs API

Utilise Playwright MCP pour automatiser ces tests.
```

### 5.2 Démarrage des services

Avant les tests, démarrez les deux services :

**Terminal 1 - Backend :**
```bash
cd api
npm run dev
```

**Terminal 2 - Frontend :**
```bash
npm run dev
```

### 5.3 Exécution des tests via Cursor

Dans Cursor, utilisez le MCP Playwright :

```
Execute les tests E2E suivants sur http://localhost:5173 :

**Test 1 - Cycle complet :**
1. Ouvre l'application
2. Ajoute une tâche "Test API Integration"
3. Vérifie qu'elle apparaît dans la liste
4. Coche la tâche pour la marquer terminée
5. Recharge la page
6. Vérifie que la tâche reste cochée (persistance)
7. Supprime la tâche
8. Vérifie qu'elle disparaît définitivement

**Test 2 - Gestion d'erreurs :**
1. Arrête le serveur backend
2. Essaie d'ajouter une tâche
3. Vérifie l'affichage du message d'erreur
4. Redémarre le serveur
5. Vérifie le rechargement automatique
```

### 5.4 Validation des endpoints API

Prompt Cursor pour tester les endpoints :

```
Vérifie les endpoints API avec des requêtes de test :

**Commandes de validation :**
```bash
# Health check
curl http://localhost:3001/health

# Lister les tâches
curl http://localhost:3001/api/tasks

# Créer une tâche
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test curl"}'

# Modifier une tâche
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

Utilise le terminal intégré pour exécuter ces commandes.
```

### 5.5 Rapport de tests automatisé

**Résultats attendus via Playwright MCP :**
```
[Playwright] Tests E2E FocusFlow - Intégration complète

✅ Test 1 - Cycle complet : PASSED
  - Ajout de tâche : OK
  - Affichage en liste : OK
  - Toggle done : OK
  - Persistance après reload : OK
  - Suppression : OK

✅ Test 2 - Gestion d'erreurs : PASSED
  - Erreur API affichée : OK
  - Récupération après reconnexion : OK

📊 Résumé : 2/2 tests passés avec succès
```

## 📦 6. Déploiement et production

### 6.1 Optimisation pour la production

Prompt Cursor pour optimiser le déploiement :

```
Suis les règles : @workflow-ai.md & @feature-planning.md

Optimise FocusFlow pour la production :

1. **Analyse** : Examine la configuration actuelle
2. **Build backend** : Compilation TypeScript et optimisations
3. **Build frontend** : Optimisations Vite et bundle size
4. **Environnement** : Variables de production
5. **Scripts** : Commandes de déploiement

**Commandes de build :**
```bash
# Backend
cd api && npm run build && npm start

# Frontend
npm run build && npm run preview
```

Génère les configurations optimisées pour la production.
```

### 6.2 Dockerisation avec Cursor

Prompt Cursor pour Docker :

```
Crée les configurations Docker pour FocusFlow :

**Dockerfile backend** :
- Base : node:18-alpine
- Multi-stage build pour optimisation
- Exposition port 3001
- Sécurité : non-root user

**Docker-compose** :
- Service backend
- Service frontend
- Réseaux et volumes

Fichiers : api/Dockerfile, docker-compose.yml
```

**Configuration générée :**

<details>
<summary>🔍 Dockerfile - api/Dockerfile</summary>

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

</details>

### 6.3 Déploiement assisté par Cursor

Prompt Cursor pour les plateformes de déploiement :

```
Guide le déploiement FocusFlow sur les plateformes modernes :

**Frontend (Vercel/Netlify) :**
- Configuration build : `npm run build`
- Variables d'environnement : VITE_API_URL
- Domaine custom et SSL

**Backend (Railway/Render) :**
- Configuration build : `npm run build`
- Variables d'environnement : PORT, NODE_ENV
- Health check : /health

**Base de données (optionnel) :**
- PostgreSQL (Supabase, Railway)
- Migration du stockage en mémoire

Génère les configurations de déploiement.
```

**Plateformes recommandées :**
- 📱 **Frontend** : Vercel, Netlify, GitHub Pages
- 💻 **Backend** : Railway, Render, Heroku
- 📎 **Base de données** : PostgreSQL (Supabase, Railway)

## ✅ Résultat final

Vous avez maintenant maîtrisé le développement full-stack avec Cursor AI :

- ✅ **Frontend React** moderne généré avec l'IA
- ✅ **Backend Express** avec API REST automatisée
- ✅ **Persistance serveur** remplaçant localStorage
- ✅ **Gestion d'erreurs** et états de chargement
- ✅ **Tests E2E** automatisés avec Playwright MCP
- ✅ **Architecture scalable** prête pour la production
- ✅ **Workflow IA** avec Chain of Thought et MCP

### 🪄 Compétences acquises

**Maîtrise de Cursor AI :**
- Configuration et utilisation des MCP (Model Context Protocol)
- Prompts structurés pour génération de code
- Workflow Chain of Thought pour le développement
- Tests automatisés avec Playwright MCP

**Développement full-stack :**
- API REST avec Express.js et TypeScript
- Intégration frontend/backend avec gestion d'erreurs
- Optimistic updates et persistance serveur
- Déploiement et production

---

### 📚 Guides disponibles

1. **[🚀 01-setup.md](01-setup.md)** - Configuration et préparation
2. **[📱 02-frontend.md](02-frontend.md)** - Développement de l'interface
3. **[🔧 03-backend.md](03-backend.md)** - Backend Express avec Cursor AI ← *Vous êtes ici*
4. **[🏠 README.md](README.md)** - Vue d'ensemble du projet

---

> 🎉 **Félicitations !** Vous maîtrisez maintenant le développement full-stack avec l'assistance de l'IA Cursor. FocusFlow est prêt pour la production !
> 
> 💡 **Et maintenant ?** Explorez d'autres projets, intégrez des bases de données, ou ajoutez des fonctionnalités avancées avec l'aide de Cursor AI !