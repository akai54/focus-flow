# 🔧 FocusFlow - Backend Express (Optionnel)

> **Guide 3/3** : Création d'une API REST avec Express.js pour persister les tâches sur serveur

## 📋 Table des matières

- [🎯 Objectifs](#-objectifs)
- [🏗️ 1. Architecture backend](#️-1-architecture-backend)
- [⚙️ 2. Configuration du projet API](#️-2-configuration-du-projet-api)
- [🚀 3. Implémentation de l'API Express](#-3-implémentation-de-lapi-express)
- [🔄 4. Adaptation du frontend](#-4-adaptation-du-frontend)
- [🧪 5. Tests de l'intégration](#-5-tests-de-lintégration)
- [📦 6. Déploiement et production](#-6-déploiement-et-production)

## 🎯 Objectifs

Transformer FocusFlow d'une application locale vers une solution full-stack :

- ✅ **API REST** complète avec Express.js et TypeScript
- ✅ **Persistance serveur** remplaçant localStorage
- ✅ **Service layer** pour les appels API côté frontend
- ✅ **Gestion d'erreurs** et états de chargement
- ✅ **Tests E2E** de l'intégration complète

> 📋 **Prérequis** : Avoir terminé les guides [setup](01-setup.md) et [frontend](02-frontend.md).

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

## ⚙️ 2. Configuration du projet API

### 2.1 Initialisation du backend

```bash
# Depuis la racine du projet focusflow/
mkdir api && cd api
npm init -y
```

### 2.2 Installation des dépendances

```bash
# Dépendances de production
npm install express cors dotenv

# Dépendances de développement
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon
```

### 2.3 Configuration TypeScript

```bash
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule
```

Ajustez le `tsconfig.json` généré :

<details>
<summary>📋 Configuration tsconfig.json</summary>

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

</details>

### 2.4 Scripts package.json

Ajoutez les scripts dans `api/package.json` :

```json
{
  "scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  }
}
```

## 🚀 3. Implémentation de l'API Express

### 3.1 Types TypeScript

**api/src/types/index.ts**
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

### 3.2 Middleware de validation

**api/src/middleware/validation.ts**
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

### 3.3 Routes API

**api/src/routes/tasks.ts**
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

### 3.4 Serveur principal

**api/src/index.ts**
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

### 3.5 Variables d'environnement

**api/.env**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🔄 4. Adaptation du frontend

### 4.1 Service API

**src/services/api.ts**
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

### 4.2 Store Zustand modifié

**src/store/index.ts**
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

### 4.3 Composant de gestion d'erreurs

**src/components/ErrorMessage.tsx**
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

### 4.4 Mise à jour de TaskPage

**src/pages/TaskPage.tsx**
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

### 4.5 Variables d'environnement frontend

**/.env**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 5. Tests de l'intégration

### 5.1 Démarrage des services

Terminal 1 - Backend :
```bash
cd api
npm run dev
```

Terminal 2 - Frontend :
```bash
npm run dev
```

### 5.2 Tests automatisés avec Cursor

Dans Cursor, testez l'intégration complète :

```
Ouvre http://localhost:5173
Ajoute une tâche "Test API"
Vérifie qu'elle apparaît dans la liste
Coche la tâche pour la marquer terminée
Recharge la page
Vérifie que la tâche reste cochée (persistance serveur)
Supprime la tâche
Vérifie qu'elle disparaît définitivement
```

### 5.3 Test des endpoints API

Vérifiez manuellement avec curl :

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

## 📦 6. Déploiement et production

### 6.1 Build de production

Backend :
```bash
cd api
npm run build
npm start
```

Frontend :
```bash
npm run build
npm run preview
```

### 6.2 Dockerisation (optionnel)

**Dockerfile** (backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### 6.3 Déploiement suggéré

- **Frontend** : Vercel, Netlify, GitHub Pages
- **Backend** : Railway, Render, Heroku
- **Base de données** : PostgreSQL (Supabase, Railway)

## ✅ Résultat final

Vous avez maintenant une application full-stack complète :

- ✅ **Frontend React** moderne avec TypeScript et Tailwind
- ✅ **Backend Express** avec API REST robuste
- ✅ **Persistance serveur** remplaçant localStorage
- ✅ **Gestion d'erreurs** et états de chargement
- ✅ **Tests E2E** automatisés
- ✅ **Architecture scalable** prête pour la production

---

### 📚 Guides disponibles

1. **[🚀 01-setup.md](01-setup.md)** - Configuration et préparation
2. **[📱 02-frontend.md](02-frontend.md)** - Développement de l'interface
3. **[🔧 03-backend.md](03-backend.md)** - Backend Express (optionnel) ← *Vous êtes ici*
4. **[🏠 README.md](README.md)** - Vue d'ensemble du projet

---

> 🎉 **Félicitations !** Vous maîtrisez maintenant le développement full-stack avec l'assistance de l'IA Cursor. FocusFlow est prêt pour la production !