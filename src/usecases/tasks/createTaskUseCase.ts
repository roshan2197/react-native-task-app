import type { Task, TaskPriority } from '../../services/tasks';

export const createTaskUseCase = (input: {
  title: string;
  priority: TaskPriority;
}): Task => ({
  id: `${Date.now()}`,
  title: input.title,
  completed: false,
  priority: input.priority,
  dueLabel: 'New',
});
