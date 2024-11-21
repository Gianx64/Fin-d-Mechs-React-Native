import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../components";
import { styles } from "../constants";
import { modifyCar } from "../api/apiCars";

const EditCar = ({ route }) => {
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

  if (params.cita === "true")
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
              handleChangeText={(e) => setForm({ ...form, patente: e.toUpperCase() })}
              maxLength={10}
            />

            <FormField
              title="VIN"
              value={form.vin}
              handleChangeText={(e) => setForm({ ...form, vin: e.toUpperCase() })}
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
              containerStyles={{paddingBottom: 40, paddingTop: 20}}
              buttonStyles={styles.mainButton}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

export default EditCar