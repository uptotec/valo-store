import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

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
import { Alert } from 'react-native';
import { reloadAsync } from 'expo-updates';

SplashScreen.preventAutoHideAsync().catch(() => {});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, backgroundTask);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const mainAd = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-8907112768449568/9076972414';

const interstitial = InterstitialAd.createForAdRequest(mainAd, {
  requestNonPersonalizedAdsOnly: true,
});

interstitial.load();

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [appIsReady, setAppIsReady] = useState(false);

  NetInfo.addEventListener((status) => {
    if (!status.isConnected || !status.isInternetReachable) {
      Alert.alert(
        'No Internet Connection',
        'your device is not connected to the internet. Reconnect and try again!',
        [{ text: 'try again', onPress: () => reloadAsync() }]
      );
      return;
    }
  });

  useEffect(() => {
    checkNotificationPermisions();
    checkBackgroundTaskStatusAsync();
    triggernewStoreNotification();
    prepareApp(setAppIsReady);
    const un = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });

    return un;
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
