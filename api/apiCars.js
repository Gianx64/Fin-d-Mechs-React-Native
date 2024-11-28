import { Alert } from "react-native";
import { getItemAsync } from "expo-secure-store";

import apiManager from "./apiManager";

// Register Car
export async function createCar(car) {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.post('/cars', car, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Auto creado exitosamente.");
      console.log("Car created, ID: "+res.data.id);
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

// Get Cars
export const getCars = async () => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/cars', {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then((res) => {
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

// Update Car
export const updateCar = async (car) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.put(`/cars`, car, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Auto actualizado exitosamente.");
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

// Disable Car
export const disableCar = async (id) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.delete(`/cars/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Auto eliminado exitosamente.");
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