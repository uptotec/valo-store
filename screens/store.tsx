import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import { Text, View } from '../components/Themed';

import { useAuthStore } from '../store/auth.store';
import skin from '../constants/skin';
import Colors from '../constants/Colors';
import SkinCard from '../components/card';
import { getStore } from '../api/store';

const storeAd1 = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8907112768449568/2459593177';

const storeAd2 = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8907112768449568/7328776472';

export default function StoreScreen() {
  const puuid = useAuthStore((state) => state.puuid);
  const [store, setStore] = useState<skin[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setStore(await getStore(puuid!));
      setLoading(false);
    })();
  }, []);

  const LoadingSpinner = (
    <View style={styles.container}>
      <ActivityIndicator size={55} color="#fff" />
      <Text>loading store...</Text>
    </View>
  );

  const Store = store && (
    <FlatList
      style={styles.list}
      data={store}
      renderItem={(props) => (
        <SkinCard {...props} showButtonAdd={false} showButtonRemove={false} />
      )}
      keyExtractor={(item) => item.uuid}
    />
  );

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={storeAd1}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
      {loading ? LoadingSpinner : Store}
      <BannerAd
        unitId={storeAd2}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  card: {
    width: Dimensions.get('window').width - 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.dark.main,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    width: '90%',
    height: Dimensions.get('window').height * 0.15,
    marginBottom: 15,
  },
  list: {},
});
