import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSession } from '../context/SessionContext';
import { useTasks } from '../context/TasksContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Task, TaskPriority } from '../services/tasks';
import { getTaskSummaryUseCase } from '../usecases/tasks/getTaskSummary';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;

type Filter = 'All' | 'Open' | 'Done';
type SortBy = 'Recent' | 'Priority' | 'Status';

const priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
const filters: Filter[] = ['All', 'Open', 'Done'];
const sorts: SortBy[] = ['Recent', 'Priority', 'Status'];
const priorityRank: Record<TaskPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export default function TaskListScreen({ navigation }: Props) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>('High');
  const [filter, setFilter] = useState<Filter>('All');
  const [sortBy, setSortBy] = useState<SortBy>('Recent');
  const { session } = useSession();
  const { tasks, loading, addTask, toggleTask, removeTask, clearCompleted } = useTasks();

  const filteredTasks = [...tasks]
    .filter(task => {
      if (filter === 'Open' && task.completed) {
        return false;
      }

      if (filter === 'Done' && !task.completed) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        return task.title.toLowerCase().includes(query);
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Priority') {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }

      if (sortBy === 'Status') {
        return Number(a.completed) - Number(b.completed);
      }

      return 0;
    });

  const summary = getTaskSummaryUseCase(tasks);
  const username = session?.username || 'Guest';

  const handleAddTask = () => {
    const title = newTaskTitle.trim();

    if (!title) {
      return;
    }

    addTask({ title, priority: selectedPriority });
    setNewTaskTitle('');
    setSelectedPriority('Medium');
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <Pressable
        style={styles.taskMain}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}>
        <View style={[styles.checkbox, item.completed && styles.checkboxDone]}>
          {item.completed ? <Text style={styles.checkboxTick}>OK</Text> : null}
        </View>
        <View style={styles.taskBody}>
          <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.priority} priority</Text>
            <Text style={styles.metaDot}>|</Text>
            <Text style={styles.metaText}>{item.dueLabel}</Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.actionRow}>
        <Pressable style={styles.inlineButton} onPress={() => toggleTask(item.id)}>
          <Text style={styles.inlineButtonText}>
            {item.completed ? 'Reopen' : 'Complete'}
          </Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => removeTask(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.eyebrow}>Task Desk</Text>
                <Text style={styles.title}>Hello, {username}</Text>
                <Text style={styles.message}>
                  Keep your day focused by tracking the work that matters most.
                </Text>
              </View>
              <Pressable
                style={styles.signOutButton}
                onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.signOutText}>Profile</Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{summary.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{summary.open}</Text>
                <Text style={styles.statLabel}>Open</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{summary.completed}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>

            <View style={styles.composer}>
              <Text style={styles.sectionTitle}>Add a task</Text>
              <TextInput
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="Write the next important thing"
                placeholderTextColor="#64748b"
                style={styles.input}
              />
              <View style={styles.priorityRow}>
                {priorities.map(priority => (
                  <Pressable
                    key={priority}
                    style={[
                      styles.priorityChip,
                      selectedPriority === priority && styles.priorityChipActive,
                    ]}
                    onPress={() => setSelectedPriority(priority)}>
                    <Text
                      style={[
                        styles.priorityChipText,
                        selectedPriority === priority &&
                          styles.priorityChipTextActive,
                      ]}>
                      {priority}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.addButtonText}>Add task</Text>
              </Pressable>
            </View>

            <View style={styles.toolsCard}>
              <Text style={styles.sectionTitle}>Find and organize</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search tasks"
                placeholderTextColor="#64748b"
                style={styles.input}
              />

              <Text style={styles.label}>Filter</Text>
              <View style={styles.filterRow}>
                {filters.map(value => (
                  <Pressable
                    key={value}
                    style={[
                      styles.filterChip,
                      filter === value && styles.filterChipActive,
                    ]}
                    onPress={() => setFilter(value)}>
                    <Text
                      style={[
                        styles.filterChipText,
                        filter === value && styles.filterChipTextActive,
                      ]}>
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Sort</Text>
              <View style={styles.filterRow}>
                {sorts.map(value => (
                  <Pressable
                    key={value}
                    style={[
                      styles.filterChip,
                      sortBy === value && styles.filterChipActive,
                    ]}
                    onPress={() => setSortBy(value)}>
                    <Text
                      style={[
                        styles.filterChipText,
                        sortBy === value && styles.filterChipTextActive,
                      ]}>
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {summary.completed > 0 ? (
                <Pressable style={styles.secondaryAction} onPress={clearCompleted}>
                  <Text style={styles.secondaryActionText}>Clear completed tasks</Text>
                </Pressable>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>Your list</Text>
            {loading ? <Text style={styles.loadingText}>Loading tasks...</Text> : null}
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No tasks match this view</Text>
              <Text style={styles.emptyText}>
                Try another filter, clear the search, or add a new task above.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  content: {
    padding: 20,
    paddingBottom: 44,
  },
  hero: {
    backgroundColor: '#0f172a',
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,
  },
  heroText: {
    marginBottom: 16,
  },
  eyebrow: {
    color: '#5eead4',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#f8fafc',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#cbd5e1',
  },
  signOutButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#14b8a6',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  signOutText: {
    color: '#042f2e',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    color: '#475569',
    fontSize: 13,
  },
  composer: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  toolsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  priorityChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },
  priorityChipActive: {
    backgroundColor: '#0f766e',
  },
  priorityChipText: {
    color: '#334155',
    fontWeight: '600',
  },
  priorityChipTextActive: {
    color: '#f8fafc',
  },
  addButton: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#0f766e',
  },
  filterChipText: {
    color: '#334155',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#f0fdfa',
  },
  secondaryAction: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryActionText: {
    color: '#3730a3',
    fontWeight: '700',
  },
  loadingText: {
    color: '#475569',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  taskMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#14b8a6',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#14b8a6',
  },
  checkboxTick: {
    color: '#042f2e',
    fontSize: 10,
    fontWeight: '700',
  },
  taskBody: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#475569',
    fontSize: 13,
  },
  metaDot: {
    color: '#94a3b8',
    marginHorizontal: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  inlineButton: {
    backgroundColor: '#ccfbf1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineButtonText: {
    color: '#115e59',
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    color: '#475569',
    lineHeight: 20,
  },
});
