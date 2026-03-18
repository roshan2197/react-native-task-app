import type { Task } from '../../services/tasks';

export const getTaskSummaryUseCase = (tasks: Task[]) => {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;

  return {
    total,
    completed,
    open: total - completed,
  };
};
