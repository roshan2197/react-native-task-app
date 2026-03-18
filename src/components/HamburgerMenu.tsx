import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSession } from '../context/SessionContext';
import { useTasks } from '../context/TasksContext';
import { getTaskInsightsUseCase } from '../usecases/tasks/getTaskInsightsUseCase';

type MenuRoute = 'Tasks' | 'Profile' | 'Insights';

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: MenuRoute) => void;
  onSignOut: () => void;
};

export default function HamburgerMenu({
  visible,
  onClose,
  onNavigate,
  onSignOut,
}: Props) {
  const { session } = useSession();
  const { tasks, refreshTasks } = useTasks();
  const insights = getTaskInsightsUseCase(tasks);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.panel}>
          <Text style={styles.eyebrow}>Menu</Text>
          <Text style={styles.title}>{session?.username || 'Guest'}</Text>
          <Text style={styles.subtitle}>
            Open tasks: {insights.open} | Completion: {insights.completionRate}%
          </Text>

          <Pressable style={styles.link} onPress={() => onNavigate('Tasks')}>
            <Text style={styles.linkText}>Dashboard</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => onNavigate('Profile')}>
            <Text style={styles.linkText}>Profile</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => onNavigate('Insights')}>
            <Text style={styles.linkText}>Insights</Text>
          </Pressable>
          <Pressable
            style={styles.link}
            onPress={async () => {
              await refreshTasks();
              onClose();
            }}>
            <Text style={styles.linkText}>Refresh tasks</Text>
          </Pressable>

          <View style={styles.footer}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={onSignOut}>
              <Text style={styles.primaryButtonText}>Sign out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.36)',
  },
  backdrop: {
    flex: 1,
  },
  panel: {
    width: 280,
    backgroundColor: '#ffffff',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    borderLeftWidth: 1,
    borderColor: '#e2e8f0',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#0f766e',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    color: '#475569',
    lineHeight: 20,
    marginBottom: 24,
  },
  link: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
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
