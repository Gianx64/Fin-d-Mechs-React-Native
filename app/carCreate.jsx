import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../components";
import { useGlobalContext } from "../api/GlobalProvider";
import { icons, styles } from "../constants";
import { createCar } from "../api/apiCars";

export default () => {
  const { user } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id_usuario: user?.id,
    patente: "",
    vin: "",
    marca: "",
    modelo: "",
    anualidad: null
  });

  const submit = async () => {
    try {
      if (form.patente === "" ||
        form.marca === "" ||
        form.modelo === "" ||
        !form.anualidad)
        throw new Error("Por favor llene todos los campos");
      setSubmitting(true);
      await createCar(form).then(response => {
        if (response)
          router.back();
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding: 10}}>
        <TouchableOpacity
          onPress={() => {router.back()}}
          style={{flexDirection:'row', justifyContent: "flex-start", paddingLeft: 8, paddingTop: 8, position: "absolute", zIndex: 1}}
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>

        <Text style={styles.titleText}>
          Registrar auto
        </Text>

        <FormField
          title="Patente"
          value={form.patente}
          handleChangeText={(e) => setForm({ ...form, patente: e.toUpperCase() })}
          maxLength={10}
        />

        <FormField
          title="VIN (opcional)"
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

        <FormField
          title="Año de vehículo"
          value={form.anualidad}
          handleChangeText={(e) => setForm({ ...form, anualidad: parseInt(e) })}
          inputmode="numeric"
          keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
          maxLength={4}
        />

        <CustomButton
          title="Registrar"
          handlePress={submit}
          containerStyles={{paddingBottom: 40, paddingTop: 20}}
          buttonStyles={styles.mainButton}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
