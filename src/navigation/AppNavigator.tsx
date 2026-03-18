import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import HamburgerMenu from '../components/HamburgerMenu';
import { useSession } from '../context/SessionContext';
import InsightsScreen from '../screens/InsightsScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import TaskListScreen from '../screens/TaskListScreen';

export type RootStackParamList = {
  Login: undefined;
  Tasks: undefined;
  TaskDetails: { taskId: string };
  Profile: undefined;
  Insights: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type MenuRoute = 'Tasks' | 'Profile' | 'Insights';

function HamburgerGlyph({
  lineColor,
  backgroundColor,
}: {
  lineColor: string;
  backgroundColor: string;
}) {
  return (
    <View style={[styles.iconShell, { backgroundColor }]}>
      <View style={[styles.iconLine, { backgroundColor: lineColor }]} />
      <View style={[styles.iconLine, styles.iconLineShort, { backgroundColor: lineColor }]} />
      <View style={[styles.iconLine, { backgroundColor: lineColor }]} />
    </View>
  );
}

function MenuTrigger({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.menuButton} onPress={onPress}>
      <HamburgerGlyph lineColor="#0f766e" backgroundColor="#ecfeff" />
      <Text style={styles.menuButtonText}>Menu</Text>
    </Pressable>
  );
}

function buildMenuOptions(
  title: string,
  onOpenMenu: () => void,
): NativeStackNavigationOptions {
  return {
    title,
    headerLeft: () => <MenuTrigger onPress={onOpenMenu} />,
  };
}

export default function AppNavigator() {
  const { session, signOut } = useSession();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);

  const navigateFromMenu = (screen: MenuRoute) => {
    setMenuVisible(false);

    if (navigationRef.isReady()) {
      navigationRef.navigate(screen);
    }
  };

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#f8fafc' },
            headerTitleStyle: { color: '#0f172a', fontWeight: '700' },
            contentStyle: { backgroundColor: '#f8fafc' },
          }}>
          {session ? (
            <>
              <Stack.Screen
                name="Tasks"
                component={TaskListScreen}
                options={buildMenuOptions('Task Desk', openMenu)}
              />
              <Stack.Screen
                name="TaskDetails"
                component={TaskDetailsScreen}
                options={buildMenuOptions('Task Details', openMenu)}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={buildMenuOptions('Profile', openMenu)}
              />
              <Stack.Screen
                name="Insights"
                component={InsightsScreen}
                options={buildMenuOptions('Insights', openMenu)}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <HamburgerMenu
        visible={session ? menuVisible : false}
        onClose={() => setMenuVisible(false)}
        onNavigate={navigateFromMenu}
        onSignOut={() => {
          setMenuVisible(false);
          signOut();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  iconShell: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconLine: {
    width: 12,
    height: 2,
    borderRadius: 999,
  },
  iconLineShort: {
    width: 9,
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
});
