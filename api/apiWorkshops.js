import { Alert } from "react-native";
import { getItemAsync } from "expo-secure-store";

import apiManager from "./apiManager";

// Register Workshop
export async function createWorkshop(workshop) {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.post('/workshops', workshop, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      Alert.alert("Éxito", "Taller creado exitosamente.");
      console.log("Workshop created, ID: "+res.data.id);
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
};

// Get Workshops
export const getWorkshops = async () => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/workshops', {
      headers: {
        Authorization: `Bearer ${token}`
      },
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
};

// Get Workshops
export const getMechWorkshops = async () => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/workshops/mech', {
      headers: {
        Authorization: `Bearer ${token}`
      },
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
};

// Get Workshop Mechs
export const getWorkshopMechs = async (id) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get(`/workshops/${id}/mechs`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
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
};

// Update Workshop
export const updateWorkshop = async (workshop) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.put('/workshops', workshop, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      Alert.alert("Éxito", "Taller actualizado exitosamente.");
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
};

// Verify workshop as admin
export const upgradeWorkshop = async (id) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.patch(`/workshops/upgrade`, {workshop: id}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      Alert.alert("Éxito", "Taller verificado exitosamente.");
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
};


// Disable Workshop
export const disableWorkshop = async (id) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.delete(`/workshops/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      Alert.alert("Éxito", "Taller eliminado exitosamente.");
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
};
