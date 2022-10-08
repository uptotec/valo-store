import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import regions from '../constants/regions';
import { Axios } from './axios';

export default async function getProfile(puuid: string) {
  const region = await SecureStore.getItemAsync('region');

  const w = Axios.get(
    `https://pd.${region}.a.pvp.net/store/v1/wallet/${puuid}`
  );

  const xp = Axios.get(
    `https://pd.${region}.a.pvp.net/account-xp/v1/players/${puuid}`
  );

  const p = axios.get(
    `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${region}/${puuid}`
  );

  const [wallet, accountXP, player] = await Promise.all([w, xp, p]);

  const regionLable = regions.find((r) => r.value === region);

  return {
    valorantPoints:
      wallet.data.Balances['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'],
    radianitePoints:
      wallet.data.Balances['e59aa87c-4cbf-517a-5983-6e81511be9b7'],
    name: player.data.data.name,
    tag: player.data.data.tag,
    XP: accountXP.data.Progress.XP,
    level: accountXP.data.Progress.Level,
    rank: player.data.data.currenttierpatched,
    rr: player.data.data.ranking_in_tier,
    rankImage: player.data.data.images,
    region: regionLable!.label,
  };
}
