import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTasks } from '../context/TasksContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getTaskInsightsUseCase } from '../usecases/tasks/getTaskInsightsUseCase';

type Props = NativeStackScreenProps<RootStackParamList, 'Insights'>;

export default function InsightsScreen({ navigation }: Props) {
  const { tasks } = useTasks();
  const insights = getTaskInsightsUseCase(tasks);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Insights</Text>
        <Text style={styles.title}>How work is moving</Text>
        <Text style={styles.subtitle}>{insights.focusMessage}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{insights.completionRate}%</Text>
          <Text style={styles.cardLabel}>Completion rate</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{insights.highPriorityOpen}</Text>
          <Text style={styles.cardLabel}>High priority open</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Priority split</Text>
        <Text style={styles.itemText}>High: {insights.high}</Text>
        <Text style={styles.itemText}>Medium: {insights.medium}</Text>
        <Text style={styles.itemText}>Low: {insights.low}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Next recommendation</Text>
        <Text style={styles.itemText}>{insights.recommendation}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Tasks')}>
        <Text style={styles.buttonText}>Back to dashboard</Text>
      </Pressable>
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
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  card: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardLabel: {
    color: '#475569',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  itemText: {
    color: '#334155',
    lineHeight: 22,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f0fdfa',
    fontWeight: '700',
  },
});
