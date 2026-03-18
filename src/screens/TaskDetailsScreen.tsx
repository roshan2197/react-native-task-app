import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTasks } from '../context/TasksContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { TaskPriority } from '../services/tasks';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

const priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
const duePresets = ['Today', 'Tomorrow', 'This week'];

export default function TaskDetailsScreen({ navigation, route }: Props) {
  const { taskId } = route.params;
  const { getTaskById, removeTask, toggleTask, updateTask, duplicateTask } = useTasks();
  const task = getTaskById(taskId);
  const [title, setTitle] = useState(task?.title || '');
  const [dueLabel, setDueLabel] = useState(task?.dueLabel || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'Medium');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueLabel(task.dueLabel);
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Task not found</Text>
          <Text style={styles.subtitle}>
            This item may have been deleted. Go back to the dashboard to pick
            another task.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const saveChanges = () => {
    updateTask(taskId, {
      title: title.trim() || task.title,
      dueLabel: dueLabel.trim() || 'Soon',
      priority,
    });
    navigation.goBack();
  };

  const deleteAndReturn = () => {
    removeTask(taskId);
    navigation.goBack();
  };

  const duplicateAndReturn = () => {
    duplicateTask(taskId);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Task</Text>
        <Text style={styles.heroTitle}>Edit details</Text>
        <Text style={styles.heroText}>
          Update the title, timing, and priority in one place.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        <Text style={styles.label}>Due label</Text>
        <TextInput
          value={dueLabel}
          onChangeText={setDueLabel}
          placeholder="Today, Tomorrow, This week"
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        <View style={styles.presetRow}>
          {duePresets.map(value => (
            <Pressable
              key={value}
              style={[
                styles.presetChip,
                dueLabel === value && styles.presetChipActive,
              ]}
              onPress={() => setDueLabel(value)}>
              <Text
                style={[
                  styles.presetChipText,
                  dueLabel === value && styles.presetChipTextActive,
                ]}>
                {value}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {priorities.map(value => (
            <Pressable
              key={value}
              style={[
                styles.priorityChip,
                priority === value && styles.priorityChipActive,
              ]}
              onPress={() => setPriority(value)}>
              <Text
                style={[
                  styles.priorityChipText,
                  priority === value && styles.priorityChipTextActive,
                ]}>
                {value}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={styles.statusValue}>
            {task.completed ? 'Completed' : 'Open'}
          </Text>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => toggleTask(taskId)}>
            <Text style={styles.secondaryButtonText}>
              {task.completed ? 'Mark open' : 'Mark done'}
            </Text>
          </Pressable>
          <Pressable style={styles.ghostButton} onPress={duplicateAndReturn}>
            <Text style={styles.ghostButtonText}>Duplicate</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton} onPress={saveChanges}>
          <Text style={styles.primaryButtonText}>Save changes</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={deleteAndReturn}>
          <Text style={styles.deleteButtonText}>Delete task</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f7fb',
  },
  hero: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  eyebrow: {
    color: '#5eead4',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  heroText: {
    color: '#cbd5e1',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  presetChipActive: {
    backgroundColor: '#1d4ed8',
  },
  presetChipText: {
    color: '#334155',
    fontWeight: '700',
  },
  presetChipTextActive: {
    color: '#eff6ff',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  priorityChip: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  priorityChipActive: {
    backgroundColor: '#0f766e',
  },
  priorityChipText: {
    color: '#334155',
    fontWeight: '700',
  },
  priorityChipTextActive: {
    color: '#f8fafc',
  },
  statusCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  statusLabel: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#cffafe',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#155e75',
    fontWeight: '700',
  },
  ghostButton: {
    flex: 1,
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#4338ca',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
});
