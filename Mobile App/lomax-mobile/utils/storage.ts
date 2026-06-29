import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

const webStorage = {
  getItemAsync: async (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItemAsync: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('LocalStorage is not available', e);
    }
  },
  deleteItemAsync: async (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};

const store = isWeb ? webStorage : SecureStore;

export const storage = {
  setToken: (token: string) => store.setItemAsync('accessToken', token),
  getToken: () => store.getItemAsync('accessToken'),
  deleteToken: () => store.deleteItemAsync('accessToken'),

  setRefreshToken: (token: string) => store.setItemAsync('refreshToken', token),
  getRefreshToken: () => store.getItemAsync('refreshToken'),
  deleteRefreshToken: () => store.deleteItemAsync('refreshToken'),

  setUser: (user: object) =>
    store.setItemAsync('user', JSON.stringify(user)),
  getUser: async () => {
    const val = await store.getItemAsync('user');
    return val ? JSON.parse(val) : null;
  },
  deleteUser: () => store.deleteItemAsync('user'),

  clearAll: async () => {
    await store.deleteItemAsync('accessToken');
    await store.deleteItemAsync('refreshToken');
    await store.deleteItemAsync('user');
  },
};
