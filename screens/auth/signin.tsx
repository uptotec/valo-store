import { StyleSheet, Dimensions } from 'react-native';

import { Text, View } from '../../components/Themed';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { refreshAccessToken } from '../../api';
import { useState } from 'react';

export default function SignIn() {
  const [signedIn, setSignedIn] = useState(false);
  const signInUrl =
    'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in%2F&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid';

  const onNavigationStateChange = async (
    navigationState: WebViewNavigation
  ) => {
    if (
      navigationState.url.startsWith('https://playvalorant.com/') &&
      navigationState.url.includes('access_token') &&
      !signedIn
    ) {
      console.log('signedin');
      setSignedIn(true);
      await refreshAccessToken();
    }
  };
  return (
    <View style={styles.container}>
      {!signedIn && (
        <WebView
          source={{ uri: signInUrl }}
          onNavigationStateChange={onNavigationStateChange}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width,
          }}
          // sharedCookiesEnabled
        />
      )}
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
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
