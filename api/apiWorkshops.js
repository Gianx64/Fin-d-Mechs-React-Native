import { Alert } from "react-native";
import { getItemAsync } from "expo-secure-store";

import apiManager from "./apiManager";

// Register Workshop
export async function createWorkshop(workshop) {
  const token = await getItemAsync("Token");
  if (token) {
    try {
      return await apiManager.post('/workshops', workshop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        Alert.alert("Éxito", "Auto creado exitosamente.");
        console.log("Workshop created, ID: "+res.data.id);
        return res.data;
      }).catch(error => {
        if (error.code === "ERR_NETWORK")
          Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
        else
          Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
        return null;
      });
    } catch (error) {
      console.log("createWorkshop", error);
      return null;
    }
  } else {
    Alert.alert("Error", "Inicie sesión nuevamente.");
    return 401;
  }
}

// Get Workshops
export const getWorkshops = async () => {
  const token = await getItemAsync("Token");
  if (token) {
    try {
      return await apiManager.get('/workshops', {
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
    } catch (error) {
      console.log("getWorkshops", error);
      return null;
    }
  } else {
    Alert.alert("Error", "Inicie sesión nuevamente.");
    return 401;
  }
}

// Modify Workshop
export const modifyWorkshop = async (workshop) => {
  const token = await getItemAsync("Token");
  if (token) {
    try {
      return await apiManager.patch(`/workshops/${workshop.id}`, workshop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        Alert.alert("Éxito", "Auto modificado exitosamente.");
        return res.data;
      }).catch(error => {
        if (error.code === "ERR_NETWORK")
          Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
        else
          Alert.alert("Error de servidor", error.response.data.message || "Por favor, intente más tarde.");
        return null;
      });
    } catch (error) {
      console.log("modifyWorkshop", error);
      return null;
    }
  } else {
    Alert.alert("Error", "Inicie sesión nuevamente.");
    return 401;
  }
}

// Update Workshop
export const updateWorkshop = async (workshop) => {
  const token = await getItemAsync("Token");
  if (token) {
    try {
      return await apiManager.patch(`/workshops/${workshop.id}`, workshop, {
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
    } catch (error) {
      console.log("updateWorkshop", error);
      return null;
    }
  } else {
    Alert.alert("Error", "Inicie sesión nuevamente.");
    return 401;
  }
}