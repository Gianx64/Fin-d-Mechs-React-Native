import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomButton, FormField } from "../components";
import { getFormData, modifyAppointment, updateAppointment } from "../api/apiAppointments";
import { useGlobalContext } from "../api/GlobalProvider";
import { styles } from "../constants";

const EditCar = ({ route }) => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    id: params.id,
    id_usuario: params.id_usuario,
    patente: params.patente,
    vin: params.vin,
    marca: params.marca,
    modelo: params.modelo,
  });

  const submit = async () => {
    if (form.patente === "" ||
      form.vin === "" ||
      form.marca === "" ||
      form.modelo === "") {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        const result = await modifyCar(form);
        if (result)
          router.back();
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (params.cita)
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{padding: 10}}>
          <Text style={styles.subtitleText}>Este auto no se puede modificar.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  else
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{padding: 10}}>
          <View
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text style={styles.subtitleText}>
              Editar auto
            </Text>

            <FormField
              title="Patente"
              value={form.patente}
              handleChangeText={(e) => setForm({ ...form, patente: e })}
              maxLength={10}
            />

            <FormField
              title="VIN"
              value={form.vin}
              handleChangeText={(e) => setForm({ ...form, vin: e })}
              maxLength={17}
            />

            <FormField
              title="Marca de vehículo"
              value={form.marca}
              handleChangeText={(e) => setForm({ ...form, marca: e })}
              maxLength={16}
            />

            <FormField
              title="Modelo de vehículo"
              value={form.modelo}
              handleChangeText={(e) => setForm({ ...form, modelo: e })}
              maxLength={32}
            />

            <CustomButton
              title="Actualizar"
              handlePress={submit}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

export default EditCar