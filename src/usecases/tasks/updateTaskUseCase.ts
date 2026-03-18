import type { Task } from '../../services/tasks';

export const updateTaskUseCase = (
  tasks: Task[],
  taskId: string,
  updates: Partial<Pick<Task, 'title' | 'priority' | 'dueLabel' | 'completed'>>,
): Task[] =>
  tasks.map(task => (task.id === taskId ? { ...task, ...updates } : task));
