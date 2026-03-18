import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSession } from '../context/SessionContext';
import { useTasks } from '../context/TasksContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getTaskSummaryUseCase } from '../usecases/tasks/getTaskSummary';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { session, signOut } = useSession();
  const { tasks } = useTasks();
  const summary = getTaskSummaryUseCase(tasks);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Account</Text>
        <Text style={styles.title}>{session?.username || 'Guest'}</Text>
        <Text style={styles.subtitle}>
          Review your activity and session status.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.itemLabel}>Mode</Text>
        <Text style={styles.itemValue}>
          {session?.mode === 'mock' ? 'Demo mode' : 'Live API mode'}
        </Text>
        <Text style={styles.itemLabel}>Open tasks</Text>
        <Text style={styles.itemValue}>{summary.open}</Text>
        <Text style={styles.itemLabel}>Completed tasks</Text>
        <Text style={styles.itemValue}>{summary.completed}</Text>
      </View>

      <View style={styles.row}>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Back to tasks</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={signOut}>
          <Text style={styles.primaryButtonText}>Sign out</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  itemLabel: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 10,
  },
  itemValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
  primaryButton: {
    flex: 1,
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#f0fdfa',
    fontWeight: '700',
  },
});
