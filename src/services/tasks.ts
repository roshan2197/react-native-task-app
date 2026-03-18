import { API } from './api';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueLabel: string;
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review today\'s priorities',
    completed: false,
    priority: 'High',
    dueLabel: 'Today',
  },
  {
    id: '2',
    title: 'Reply to open client questions',
    completed: true,
    priority: 'Medium',
    dueLabel: 'Done',
  },
  {
    id: '3',
    title: 'Prepare the next release checklist',
    completed: false,
    priority: 'Low',
    dueLabel: 'Tomorrow',
  },
];

const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

export const getTasks = async (): Promise<Task[]> => {
  if (!API.defaults.baseURL) {
    await delay(250);
    return mockTasks.map(task => ({ ...task }));
  }

  const res = await API.get('/tasks');
  return res.data;
};
