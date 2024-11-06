import { Alert } from "react-native";

import { apiManager, secureStoreSet, secureStoreGet } from "./apiManager";

// Register user
export async function createUser(username, phone, email, password, mech) {
  try {
    return await apiManager.post('/auth/signup', {
      usuario: username,
      celular: phone,
      correo: email,
      clave: password,
      rol: mech
    }).then((res) => {
      secureStoreSet("Token", res.data.data.token);
      Alert.alert("Éxito", res.data.message);
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error", error.response.data.message);
      return null;
    });
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    return await apiManager.post('/auth/signin', {
      correo: email,
      clave: password
    }).then((res) => {
      secureStoreSet("Token", res.data.data.token);
      Alert.alert("Éxito", "Sesión iniciada exitosamente");
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error", error.response.data.message);
      return null;
    });
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  const token = await secureStoreGet("Token");
  if (token) {
    try {
      return await apiManager.get('/auth', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        return res.data;
      }).catch(error => {
        if (error.code === "ERR_NETWORK")
          Alert.alert("Error", "El servidor no se encuentra disponible, intente ingresar más tarde.");
        else
          Alert.alert("Error", error.response.data.message);
        return null;
      });
    } catch (error) {
      throw new Error(error);
    }
  } else { console.log("No token stored."); }
}
