/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface AuthParamList extends AuthStackParamList {}
  }
}

export type AuthStackParamList = {
  Root: undefined;
  pickRegion: undefined;
  signin: undefined;
};

export type TabStackParamList = {
  Store: undefined;
  WishList: undefined;
  Profile: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, Screen>;
