import { getTasks } from '../../services/tasks';

export const loadTasksUseCase = async () => getTasks();
