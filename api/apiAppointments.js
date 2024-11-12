import { Alert } from "react-native";

import { apiManager, secureStoreGet } from "./apiManager";

// Get Appointments Form Data
export const getFormData = async () => {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.get('/auth/formdata', {
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

    if (!result) throw Error;
    
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Register Appointment
export async function createAppointment(appointment) {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.post('/appointments', appointment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Cita creada exitosamente.");
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });

    console.log("Appointment created, ID: "+result.id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Appointments
export const getAppointments = async () => {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.get('/appointments', {
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
    if (!result) throw Error;
    
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get Single Appointment
export const getAppointment = async (appointmentID) => {
  const token = await secureStoreGet("Token");
  try {
    const result = apiManager.get(`/appointments/${appointmentID}`, {
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

    if (!result) throw Error;

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Modify Appointment
export const modifyAppointment = async (appointment) => {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.patch(`/appointments/${appointment.id}/0`, appointment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", "Cita modificada exitosamente.");
      return res.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK")
        Alert.alert("Error de servidor", "El servidor no se encuentra disponible, intente ingresar más tarde.");
      else
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Update Appointment
export const updateAppointment = async (id, action) => {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.patch(`/appointments/${id}/${action}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      switch(action) {
        case 1:
          Alert.alert("Éxito", "Cita cancelada exitosamente.");
          break;
        case 2:
          Alert.alert("Éxito", "Cita confirmada exitosamente.");
          break;
        case 6:
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
        Alert.alert("Error de servidor", error.response.data.message);
      return null;
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}