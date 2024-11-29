import { Alert } from "react-native";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

import apiManager from "./apiManager";

// Get Current User
export async function getCurrentUser() {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/auth', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else {
        Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
        deleteItemAsync("Token");
      }
      return null;
    });
  } else { console.log("No token stored."); }
}

// Register user
export async function signUp(form) {
  return await apiManager.post('/auth/signup', form).then(res => {
    setItemAsync("Token", res.data.token);
    Alert.alert("Éxito", "Usuario creado exitosamente.");
    return res.data;
  }).catch(error => {
    if (error.code === "ERR_NETWORK")
      Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
    else
      Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
    return null;
  });
}

// Sign In
export async function signIn(email, password) {
  return await apiManager.post('/auth/signin', {
    correo: email,
    clave: password
  }).then(res => {
    setItemAsync("Token", res.data.token);
    Alert.alert("Éxito", "Sesión iniciada exitosamente");
    return res.data;
  }).catch(error => {
    if (error.code === "ERR_NETWORK")
      Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
    else
      Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
    return null;
  });
}

// Sign Out
export async function signOut() {
  await deleteItemAsync("Token");
}

// Get Administration panel data
export async function getAdminData() {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/auth/admindata', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
      return null;
    });
  } else {
    Alert.alert("Error", "Inicie sesión nuevamente.");
    return 401;
  }
}

// Get Administration panel data
export async function setMech(id) {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.patch(`/auth/setmech`, {mech: id}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
      return null;
    });
  } else {
    Alert.alert("Error", "Inicie sesión nuevamente.");
    return 401;
  }
}
