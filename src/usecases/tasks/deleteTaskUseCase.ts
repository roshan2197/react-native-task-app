import type { Task } from '../../services/tasks';

export const deleteTaskUseCase = (tasks: Task[], taskId: string): Task[] =>
  tasks.filter(task => task.id !== taskId);
