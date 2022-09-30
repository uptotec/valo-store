import { Axios } from '../api/axios';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const getStore = async (puuid: string) => {
  const region = await SecureStore.getItemAsync('region');

  const store = await Axios.get(
    `https://pd.${region}.a.pvp.net/store/v2/storefront/${puuid}`
  );

  const storePrices = await Axios.get(
    `https://pd.${region}.a.pvp.net/store/v1/offers/`
  );

  const dailyStore = [];

  for (const item of store.data.SkinsPanelLayout.SingleItemOffers) {
    const res = await axios.get(
      `https://valorant-api.com/v1/weapons/skinlevels/${item}`
    );
    const price = storePrices.data.Offers.find(
      (offer: any) => offer.OfferID === item
    );

    dailyStore.push({
      displayName: res.data.data.displayName,
      displayIcon: res.data.data.displayIcon,
      uuid: res.data.data.uuid,
      levels: null,
      price: Object.values(price.Cost)[0] as number,
    });
  }

  return dailyStore;
};
