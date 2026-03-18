import type { Task } from '../../services/tasks';

export const duplicateTaskUseCase = (task: Task): Task => ({
  ...task,
  id: `${Date.now()}`,
  title: `${task.title} (copy)`,
  completed: false,
  dueLabel: task.dueLabel === 'Done' ? 'Soon' : task.dueLabel,
});
