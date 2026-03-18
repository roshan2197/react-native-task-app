import type { Task } from '../../services/tasks';

export const toggleTaskUseCase = (tasks: Task[], taskId: string): Task[] =>
  tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task,
  );
