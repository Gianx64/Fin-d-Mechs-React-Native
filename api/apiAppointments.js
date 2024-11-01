import { Alert } from "react-native";

import { apiManager, secureStoreGet } from "./apiManager";

// Register Appointment
export async function createAppointment(appointment) {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.post('/appointments', appointment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", res.data.message);
      return res.data;
    }).catch(error => {
      Alert.alert("Error", error.response.data.message);
    });

    console.log("Appointment created, ID: "+result.data.id);
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    }).then((res) => {
      return res.data;
    }).catch(error => {
      Alert.alert("Error", error.response.data.message);
    });

    if (!result) throw Error;
    
    return result.data;
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
      Alert.alert("Error", error.response.data.message);
    });

    if (!result) throw Error;

    return result.data;
  } catch (error) {
    console.log("Error loading appointment id: "+appointmentID);
    console.log(error);
    return null;
  }
}

// Modify Appointment
export const modifyAppointment = async (appointment) => {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.post(`/appointments/${appointment.id}/0`, appointment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", res.data.message);
      return res.data;
    }).catch(error => {
      Alert.alert("Error", error.response.data.message);
    });

    return result.data;
  } catch (error) {
    throw new Error(error);
  }
}

// Update Appointment
export const updateAppointment = async (id, action) => {
  const token = await secureStoreGet("Token");
  try {
    const result = await apiManager.post(`/appointments/${id}/${action}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      Alert.alert("Éxito", res.data.message);
      return res.data;
    }).catch(error => {
      Alert.alert("Error", error.response.data.message);
    });

    return result.data;
  } catch (error) {
    throw new Error(error);
  }
}