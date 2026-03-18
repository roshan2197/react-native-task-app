/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/screens/TaskListScreen', () => {
  const { Text: MockText } = require('react-native');

  return () => <MockText>Tasks Screen</MockText>;
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  useNavigationContainerRef: () => ({
    navigate: jest.fn(),
    isReady: () => true,
  }),
}));

jest.mock('@react-navigation/native-stack', () => {
  const MockReact = require('react');

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => children,
      Screen: ({ component: Component }: { component: React.ComponentType<any> }) => (
        <MockReact.Fragment>
          <Component
            navigation={{ navigate: jest.fn(), replace: jest.fn(), goBack: jest.fn() }}
            route={{ key: 'mock-route', name: 'Mock', params: { username: 'Demo' } }}
          />
        </MockReact.Fragment>
      ),
    }),
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
