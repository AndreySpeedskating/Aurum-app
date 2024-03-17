import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from '@ant-design/react-native';
import {
  Login,
  Main,
  Profile,
  Application as ApplicationScreen,
  History,
  HistoryDetails,
} from './pages';
import React, { useEffect, useState } from 'react';
import { useServiceStore } from './state/service';
import { mainTheme } from './theme';
import {
  TASK_NAME,
  onFetchUpdateAsync,
  registerBackgroundTask,
  returnNetworkStatus,
} from './utils/helpers';
import { useSendDraftApplications } from './utils/hooks';
import { useUnsendingStore } from './state/unsending';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { setNetworkStatus } = useServiceStore();
  const { unSendingApplications } = useUnsendingStore((store) => store);
  const { status: networkStatus } = useServiceStore((store) => store);
  const [ready, setReady] = useState(false);
  const { prepareSendApplication, sending } = useSendDraftApplications();

  const checkConnection = async (): Promise<boolean> => {
    const status = await returnNetworkStatus();
    setNetworkStatus(!!status);
    return status;
  };

  useEffect(() => {
    checkConnection();
  }, []);

  TaskManager.defineTask(TASK_NAME, () => {
    if (networkStatus && unSendingApplications?.length && !sending) {
      prepareSendApplication();
    }
  });

  const startApp = async (): Promise<void> => {
    if (networkStatus) {
      await onFetchUpdateAsync();
    }
    if (ready) {
      await SplashScreen.hideAsync();
      await registerBackgroundTask(TASK_NAME);
    }
  };

  const statusChecker = async (): Promise<void> => {
    await checkConnection().then((r) => {
      if (!r) {
        setTimeout(
          async () => {
            await statusChecker();
          },
          5 * 60 * 1000
        );
      }
    });
  };

  useEffect(() => {
    startApp();
  }, [ready]);

  useEffect(() => {
    if (!networkStatus) {
      statusChecker();
    }
  }, [networkStatus]);

  const loadingComlete = (): void => {
    setReady(true);
  };

  return (
    <Provider theme={mainTheme}>
      <SafeAreaProvider>
        <NavigationContainer onReady={loadingComlete}>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: 'Вход', headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={Main}
              options={{ title: '', headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ title: '', headerShown: false }}
            />
            <Stack.Screen
              name="Application"
              component={ApplicationScreen}
              options={{ title: '', headerShown: false }}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={{ title: '', headerShown: false }}
            />
            <Stack.Screen
              name="HistoryDetails"
              component={HistoryDetails}
              options={{ title: '', headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
