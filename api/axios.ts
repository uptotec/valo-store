import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

export type ApiResponse<T> =
  | {
      isSuccessful: false;
      status: number;
      data: null;
    }
  | {
      isSuccessful: true;
      status: number;
      data: T;
    };

function getTokenDataFromURL(url: string) {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let params: any = {},
    match;
  while ((match = regex.exec(url.replace('#', '?')))) {
    params[match[1]] = match[2];
  }
  return {
    accessToken: params.access_token,
    expiresIn: params.expires_in,
    entitlementsToken: undefined,
    puuid: undefined,
  };
}

export const signOut = async () => {
  await axios.get('https://auth.riotgames.com/logout');

  useAuthStore.setState({
    isSignedIn: false,
    accessToken: null,
    entitlementsToken: null,
    expiresIn: null,
    puuid: null,
    date: null,
  });
};

export const refreshAccessToken = async () => {
  const res = await axios.post(
    'https://auth.riotgames.com/api/v1/authorization',
    {
      client_id: 'play-valorant-web-prod',
      nonce: '1',
      redirect_uri: 'https://playvalorant.com/opt_in',
      response_type: 'token id_token',
    }
  );

  // console.log(parse(splitCookiesString(res.headers['set-cookie']![0])));

  if (!res.data?.response?.parameters?.uri) {
    useAuthStore.setState({
      isSignedIn: false,
      accessToken: null,
      entitlementsToken: null,
      expiresIn: null,
      puuid: null,
      date: null,
    });

    return null;
  }

  const token = getTokenDataFromURL(res.data.response.parameters.uri);

  const entitlement = await axios.post(
    'https://entitlements.auth.riotgames.com/api/token/v1',
    {},
    { headers: { Authorization: `Bearer ${token.accessToken}` } }
  );

  token.entitlementsToken = entitlement.data.entitlements_token;

  const player = await axios.get('https://auth.riotgames.com/userinfo', {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });

  token.puuid = player.data.sub;

  // console.log(token);
  console.log('refreshed');

  useAuthStore.setState({
    isSignedIn: true,
    date: Date.now(),
    ...token,
  });

  return {
    isSignedIn: true,
    date: Date.now(),
    ...token,
  };
};

export const Axios = axios.create({
  timeout: 5000,
});

Axios.interceptors.request.use(async function (config) {
  const authState = useAuthStore.getState();

  console.log(Date.now(), authState.date! + authState.expiresIn! * 1000);
  if (
    authState.expiresIn &&
    authState.accessToken &&
    Date.now() < authState.date + authState.expiresIn * 1000
  ) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${authState.accessToken}`;
      config.headers['X-Riot-Entitlements-JWT'] = authState.entitlementsToken;
    } else {
      config.headers = {
        Authorization: `Bearer ${authState.accessToken}`,
        'X-Riot-Entitlements-JWT': authState.entitlementsToken,
      };
    }
    return config;
  }

  await refreshAccessToken();
  const newAccessToken = useAuthStore.getState();
  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${newAccessToken.accessToken}`;
    config.headers['X-Riot-Entitlements-JWT'] =
      newAccessToken.entitlementsToken as any;
  } else {
    config.headers = {
      Authorization: `Bearer ${newAccessToken.accessToken}`,
      'X-Riot-Entitlements-JWT': newAccessToken.entitlementsToken as any,
    };
  }
  return config;
});
