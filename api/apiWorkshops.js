import { Alert } from "react-native";

import { apiManager, secureStoreGet } from "./apiManager";

// Register Workshop
export async function createWorkshop(workshop) {
  const token = await secureStoreGet("Token");
  try {
    return await apiManager.post('/workshops', workshop, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Auto creado exitosamente.");
      console.log("Workshop created, ID: "+result.id);
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });
  } catch (error) {
    console.log("createWorkshop", error);
    return null;
  }
}

// Get Workshops
export const getWorkshops = async () => {
  const token = await secureStoreGet("Token");
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
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });
  } catch (error) {
    console.log("getWorkshops", error);
    return null;
  }
}

// Modify Workshop
export const modifyWorkshop = async (workshop) => {
  const token = await secureStoreGet("Token");
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
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });
  } catch (error) {
    console.log("modifyWorkshop", error);
    return null;
  }
}

// Update Workshop
export const updateWorkshop = async (workshop) => {
  const token = await secureStoreGet("Token");
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
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });
  } catch (error) {
    console.log("updateWorkshop", error);
    return null;
  }
}