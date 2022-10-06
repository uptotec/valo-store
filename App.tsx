import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { View } from './components/Themed';
import backgroundTask, {
  BACKGROUND_FETCH_TASK,
  checkBackgroundTaskStatusAsync,
} from './services/backgroundTask';
import triggernewStoreNotification from './services/newStoreNotification';
import prepareApp from './services/prepareApp';
import checkNotificationPermisions from './services/notificationsPermissions';
import { Linking, NativeModules } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, backgroundTask);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    prepareApp(setAppIsReady);
    checkNotificationPermisions();
    checkBackgroundTaskStatusAsync();
    triggernewStoreNotification();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady || isLoadingComplete) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, isLoadingComplete]);

  if (!appIsReady || !isLoadingComplete) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <Navigation colorScheme="dark" />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </View>
  );
}
