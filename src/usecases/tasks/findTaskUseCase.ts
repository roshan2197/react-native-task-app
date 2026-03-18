import type { Task } from '../../services/tasks';

export const findTaskUseCase = (tasks: Task[], taskId: string) =>
  tasks.find(task => task.id === taskId);
