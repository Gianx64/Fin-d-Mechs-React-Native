import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../components";
import { icons, styles } from "../constants";
import { disableCar, updateCar } from "../api/apiCars";

export default () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    id: params.id,
    id_usuario: params.id_usuario,
    patente: params.patente,
    marca: params.marca,
    modelo: params.modelo,
    anualidad: params.anualidad
  });

  const submit = async () => {
    try {
      if (form.patente === "" ||
        form.marca === "" ||
        form.modelo === "" ||
        !form.anualidad) //TODO: > 1800 && < Date.getYear()
        throw new Error("Por favor llene todos los campos.");
      setSubmitting(true);
      await updateCar(form).then(response => {
        if (response)
          router.back();
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const disable = async () => {
    setSubmitting(true);
    await disableCar(params.id).then(response => {
      if (response)
        router.back();
      setSubmitting(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding: 10}}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{flexDirection: "row", justifyContent: "flex-start", paddingLeft: 8, paddingTop: 8, position: "absolute", zIndex: 1}}
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>

        <Text style={styles.titleText}>
          Editar auto
        </Text>

        <FormField
          title="Patente"
          value={form.patente}
          handleChangeText={(e) => setForm({ ...form, patente: e.toUpperCase() })}
          maxLength={10}
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

        <FormField
          title="Año de vehículo"
          value={form.anualidad}
          handleChangeText={(e) => setForm({ ...form, anualidad: parseInt(e) })}
          inputmode="numeric"
          keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
          maxLength={4}
        />

        <View style={{alignSelf: "center", flexDirection: "row", justifyContent: "space-between", paddingBottom: 40, paddingTop: 16}}>
          <CustomButton
            title="Eliminar"
            handlePress={disable}
            containerStyles={{paddingBottom: 40, paddingTop: 20}}
            buttonStyles={styles.mainButton}
            isLoading={isSubmitting}
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
};
