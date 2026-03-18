import type { Task } from '../../services/tasks';
import { getTaskSummaryUseCase } from './getTaskSummary';

export const getTaskInsightsUseCase = (tasks: Task[]) => {
  const summary = getTaskSummaryUseCase(tasks);
  const high = tasks.filter(task => task.priority === 'High').length;
  const medium = tasks.filter(task => task.priority === 'Medium').length;
  const low = tasks.filter(task => task.priority === 'Low').length;
  const highPriorityOpen = tasks.filter(
    task => task.priority === 'High' && !task.completed,
  ).length;
  const completionRate =
    summary.total === 0 ? 0 : Math.round((summary.completed / summary.total) * 100);

  const focusMessage =
    highPriorityOpen > 0
      ? 'Your biggest wins are still in the high-priority lane.'
      : summary.open > 0
        ? 'Momentum is steady. Keep clearing the remaining open work.'
        : 'Everything is cleared. This is a good time to plan ahead.';

  const recommendation =
    highPriorityOpen > 0
      ? 'Finish high-priority items before adding new work.'
      : summary.open > 0
        ? 'Batch a few open tasks together and close them in one session.'
        : 'Add the next meaningful task and keep the list intentionally small.';

  return {
    ...summary,
    high,
    medium,
    low,
    highPriorityOpen,
    completionRate,
    focusMessage,
    recommendation,
  };
};
