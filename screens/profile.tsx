import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Divider, LinearProgress } from '@rneui/base';
import { useEffect, useState } from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import { Text, View } from '../components/Themed';
import { useAuthStore } from '../store/auth.store';
import Colors from '../constants/Colors';
import getProfile from '../api/profile';
import ProfileItem from '../components/profileItem';

type profile = {
  valorantPoints: number;
  radianitePoints: number;
  name: string;
  tag: string;
  XP: number;
  level: number;
  rank: string;
  rr: number;
  rankImage: any;
  region: string;
};

const profileAd1 = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8907112768449568/1896771803';

const profileAd2 = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8907112768449568/8079036779';

export default function ProfileScreen() {
  const puuid = useAuthStore((state) => state.puuid);
  const [profile, setProfile] = useState<profile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getprofileAPI = async () => {
    setRefreshing(true);
    setProfile(await getProfile(puuid!));
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => setProfile(await getProfile(puuid!)))();
  }, []);

  const LoadingSpinner = (
    <View
      style={[
        styles.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <ActivityIndicator size={55} color="#fff" />
      <Text>loading profile...</Text>
    </View>
  );

  const Profile = profile && (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getprofileAPI} />
      }
    >
      {profile.name ? (
        <View style={styles.rankView}>
          <Image
            source={{ uri: profile.rankImage.large }}
            style={styles.rankImage}
          />
          <Text style={styles.title}>{`${profile.name}#${profile.tag}`}</Text>
          <Text>{profile.rank}</Text>
          <View style={styles.rrView}>
            <LinearProgress
              style={styles.progress}
              value={profile.rr / 100}
              color="white"
            />
            <View style={styles.rrTextView}>
              <Text>Rank Rating</Text>
              <Text>{`${profile.rr}/100`}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.rankView}>
          <Image
            source={{
              uri: 'https://cdn-offer-photos.zeusx.com/7a0a61e4-2d5e-4605-b637-14c97cb538eb.png',
            }}
            style={styles.rankImage}
          />
          <Text style={[styles.title, { marginTop: 15 }]}>
            Your account is unranked
          </Text>
        </View>
      )}
      <Divider
        style={styles.divider}
        subHeader="info"
        subHeaderStyle={styles.dividerTitle}
      />
      <ProfileItem
        iconName="globe"
        title="Region"
        value={profile.region}
        image={null}
      />
      <ProfileItem
        iconName="angle-double-up"
        title="Level"
        value={profile.level}
        image={null}
      />
      <ProfileItem
        iconName="trophy"
        title="XP"
        value={profile.XP}
        image={null}
      />
      <Divider
        style={styles.divider}
        subHeader="Wallet"
        subHeaderStyle={styles.dividerTitle}
      />
      <ProfileItem
        iconName={null}
        title="Valorant Points"
        value={profile.valorantPoints}
        image={require('../assets/images/Valorant_Points.png')}
      />
      <ProfileItem
        iconName={null}
        title="Radianite Points"
        value={profile.radianitePoints}
        image={require('../assets/images/Radianite_Points.png')}
      />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={profileAd1}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
      {!profile ? LoadingSpinner : Profile}
      <BannerAd
        unitId={profileAd2}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  rankView: { alignItems: 'center' },
  rankImage: { width: 100, height: 100, margin: 10 },
  rrView: { width: '90%', paddingTop: 10 },
  progress: { marginVertical: 5 },
  rrTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: { margin: 30 },
  dividerTitle: { fontWeight: 'bold', color: '#ccc' },
});
