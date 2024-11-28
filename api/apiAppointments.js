import { Alert } from "react-native";
import { getItemAsync } from "expo-secure-store";

import apiManager from "./apiManager";

// Get Appointments Form Data
export const getFormData = async () => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/appointments/formdata', {
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

// Register Appointment
export async function createAppointment(appointment) {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.post('/appointments', appointment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Cita creada exitosamente.");
      console.log("Appointment created, ID: "+res.data.id);
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

// Get Appointments
export const getAppointments = async () => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.get('/appointments', {
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

// Modify Appointment
export const updateAppointment = async (appointment, action) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.put(`/appointments/${appointment.id}`, {
      action: action,
      ...appointment
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      switch(action) {
        case 0:
          Alert.alert("Éxito", "Cita modificada exitosamente.");
          break;
        case 7:
          Alert.alert("Éxito", "Comentario añadido exitosamente.");
          break;
        default:
          Alert.alert("Éxito", "Cita actualizada exitosamente.");
          break;
      }
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

// Flag Appointment
export const flagAppointment = async (id, flag) => {
  const token = await getItemAsync("Token");
  if (token) {
    return await apiManager.patch(`/appointments/${id}`, {flag: flag}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      switch(flag) {
        case 1:
          Alert.alert("Éxito", "Cita cancelada exitosamente.");
          break;
        case 2:
          Alert.alert("Éxito", "Cita tomada y confirmada exitosamente.");
          break;
        case 3:
          Alert.alert("Éxito", "Cita confirmada exitosamente.");
          break;
        case 6:
          Alert.alert("Éxito", "Cita completada exitosamente.");
          break;
        default:
          Alert.alert("Éxito", "Cita actualizada exitosamente.");
          break;
      }
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