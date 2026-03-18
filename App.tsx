import { enableScreens } from 'react-native-screens';

import { SessionProvider } from './src/context/SessionContext';
import { TasksProvider } from './src/context/TasksContext';
import AppNavigator from './src/navigation/AppNavigator';

enableScreens();

export default function App() {
  return (
    <SessionProvider>
      <TasksProvider>
        <AppNavigator />
      </TasksProvider>
    </SessionProvider>
  );
}
