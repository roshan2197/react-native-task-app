import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Task, TaskPriority } from '../services/tasks';
import { useSession } from './SessionContext';
import { clearCompletedTasksUseCase } from '../usecases/tasks/clearCompletedTasksUseCase';
import { createTaskUseCase } from '../usecases/tasks/createTaskUseCase';
import { deleteTaskUseCase } from '../usecases/tasks/deleteTaskUseCase';
import { duplicateTaskUseCase } from '../usecases/tasks/duplicateTaskUseCase';
import { findTaskUseCase } from '../usecases/tasks/findTaskUseCase';
import { loadTasksUseCase } from '../usecases/tasks/loadTasksUseCase';
import { toggleTaskUseCase } from '../usecases/tasks/toggleTaskUseCase';
import { updateTaskUseCase } from '../usecases/tasks/updateTaskUseCase';

type TaskUpdates = Partial<
  Pick<Task, 'title' | 'priority' | 'dueLabel' | 'completed'>
>;

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  addTask: (input: { title: string; priority: TaskPriority }) => void;
  toggleTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: TaskUpdates) => void;
  clearCompleted: () => void;
  duplicateTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const syncTasks = async () => {
      if (!session) {
        setTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const nextTasks = await loadTasksUseCase();
        if (active) {
          setTasks(nextTasks);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    syncTasks();

    return () => {
      active = false;
    };
  }, [session]);

  const refreshTasks = async () => {
    if (!session) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const nextTasks = await loadTasksUseCase();
      setTasks(nextTasks);
    } finally {
      setLoading(false);
    }
  };

  const addTask = (input: { title: string; priority: TaskPriority }) => {
    setTasks(currentTasks => [createTaskUseCase(input), ...currentTasks]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(currentTasks => toggleTaskUseCase(currentTasks, taskId));
  };

  const removeTask = (taskId: string) => {
    setTasks(currentTasks => deleteTaskUseCase(currentTasks, taskId));
  };

  const updateTask = (taskId: string, updates: TaskUpdates) => {
    setTasks(currentTasks => updateTaskUseCase(currentTasks, taskId, updates));
  };

  const clearCompleted = () => {
    setTasks(currentTasks => clearCompletedTasksUseCase(currentTasks));
  };

  const duplicateTask = (taskId: string) => {
    setTasks(currentTasks => {
      const task = currentTasks.find(item => item.id === taskId);

      if (!task) {
        return currentTasks;
      }

      return [duplicateTaskUseCase(task), ...currentTasks];
    });
  };

  const getTaskById = (taskId: string) => findTaskUseCase(tasks, taskId);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        refreshTasks,
        addTask,
        toggleTask,
        removeTask,
        updateTask,
        clearCompleted,
        duplicateTask,
        getTaskById,
      }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }

  return context;
}
