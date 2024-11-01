import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const apiManager = axios.create({
  //baseURL: "http://10.2.139.118/api",
  baseURL: "http://10.2.139.73/api",
  responseType: 'json',
  withCredentials: true
});

export async function secureStoreSet(key, value) {
  return await SecureStore.setItemAsync(key, value);
}

export async function secureStoreGet(key) {
  return await SecureStore.getItemAsync(key);
}

export async function secureStoreDelete(key) {
  return await SecureStore.deleteItemAsync(key);
}

export default { apiManager, secureStoreSet, secureStoreGet, secureStoreDelete };