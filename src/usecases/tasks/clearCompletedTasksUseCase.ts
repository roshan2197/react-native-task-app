import type { Task } from '../../services/tasks';

export const clearCompletedTasksUseCase = (tasks: Task[]): Task[] =>
  tasks.filter(task => !task.completed);
