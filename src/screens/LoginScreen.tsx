import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useState } from 'react';

import { useSession } from '../context/SessionContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useSession();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn(username, password);
    } catch (err: any) {
      console.log(err);
      setError(err?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroKicker}>Task Desk</Text>
        <Text style={styles.heroTitle}>Plan clearly. Work calmly.</Text>
        <Text style={styles.heroText}>
          Sign in and pick up where you left off.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your account details to continue.</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#64748b"
          style={styles.input}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#64748b"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="small" color="#0f766e" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        )}

        <Text style={styles.helper}>
          Demo mode accepts any username and password.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f7fb',
  },
  hero: {
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#0f766e',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#0f172a',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#0f766e',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  error: {
    color: '#b91c1c',
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  helper: {
    marginTop: 14,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
  },
});
