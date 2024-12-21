import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "./GlobalProvider";
import { CustomButton, FormField } from "../components";
import { icons, styles } from "../constants";
import { getCities } from "../api/apiAppointments";
import { Dropdown } from "react-native-element-dropdown";
import { disableWorkshop, updateWorkshop } from "../api/apiWorkshops";

export default () => {
  const params = useLocalSearchParams();
  const { setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [ubicacion, setUbicacion] = useState(params.latitud+", "+params.longitud);
  const [form, setForm] = useState({
    id: params.id,
    nombre: params.nombre,
    ciudad: params.ciudad,
    direccion: params.direccion,
    latitud: params.latitud,
    longitud: params.longitud,
    detalles: params.detalles
  });

  const submit = async () => {
    try {
      if (form.nombre === "" ||
        form.ciudad === "" ||
        form.direccion === "")
        throw new Error("Por favor llene todos los campos.");
      setSubmitting(true);
      await updateWorkshop(form).then(response => {
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
    await disableWorkshop(params.id).then(response => {
      if (response)
        router.back();
      setSubmitting(false);
    });
  };

  //Dropdown de ciudades
  const [dropdownCities, setDropdownCities] = useState(form.ciudad || "Seleccionar item");
  const [isCitiesFocus, setIsCitiesFocus] = useState(false);
  const [citiesList, setCitiesList] = useState([]);

  async function getLocationPermission() {
    try {
      await requestForegroundPermissionsAsync().then(petition => {
        if (petition.status !== "granted") {
          setLoading(false);
          router.back();
          throw new Error("Permiso denegado.");
        }
      });
      await getCurrentPositionAsync().then(location => {
        setUbicacion(location.coords.latitude.toString() +", "+ location.coords.longitude.toString());
        setForm({...form,
          latitud: location.coords.latitude,
          longitud: location.coords.longitude
        });
        setLoading(false);
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  async function fetchFormData() {
    try {
      setLoading(true);
      setCitiesList(getCities());
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => fetchFormData(), []);

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
          Actualizar taller
        </Text>
        <FormField
          title="Nombre"
          value={form.nombre}
          handleChangeText={(e) => setForm({ ...form, nombre: e })}
          maxLength={32}
        />
        <View style={{paddingBottom: 8}}>
          <Text style={styles.subtitleText}>Comuna</Text>
          <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
            <Dropdown
              data={citiesList}
              labelField="label"
              placeholderStyle={styles.formField}
              selectedTextStyle={styles.formField}
              valueField="label"
              value={dropdownCities}
              onFocus={() => setIsCitiesFocus(true)}
              onBlur={() => setIsCitiesFocus(false)}
              placeholder={!isCitiesFocus ? "Seleccionar item" : "..."}
              onChange={(e) => {
                setDropdownCities(e.label);
                setForm({ ...form, ciudad: e.label });
                setIsCitiesFocus(false);
              }}
            />
          </View>
        </View>
        <FormField
          title="Dirección"
          value={form.direccion}
          handleChangeText={(e) => setForm({ ...form, direccion: e })}
          maxLength={64}
        />
        <FormField
          title="Ubicación"
          value={ubicacion}
          readOnly={true}
        />
        <CustomButton
          title="Actualizar ubicación"
          handlePress={getLocationPermission}
          buttonStyles={[styles.mainButton, {paddingHorizontal: 32, paddingVertical: 8}]}
        />
        <FormField
          title="Descripción"
          value={form.detalles}
          handleChangeText={(e) => setForm({ ...form, detalles: e })}
          maxLength={128}
        />
        <View style={{alignSelf: "center", flexDirection: "row", justifyContent: "space-between", paddingBottom: 40, paddingTop: 16}}>
          <CustomButton
            title="Eliminar"
            handlePress={() =>
              Alert.alert(
                "Eliminar taller",
                "¿Eliminar taller? Esta acción no se puede revertir.",
                [
                  { text: "Volver", style: "cancel" },
                  { text: "OK", onPress: () => disable() }
                ],
                { cancelable: true }
              )
            }
            containerStyles={{paddingBottom: 40, paddingTop: 20}}
            buttonStyles={styles.mainButton}
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Actualizar"
            handlePress={() =>
              Alert.alert(
                "Actualizar taller",
                "Actualizar el taller requerirá verificación de un administrador. ¿Actualizar taller?",
                [
                  { text: "Volver", style: "cancel" },
                  { text: "OK", onPress: () => submit() }
                ],
                { cancelable: true }
              )
            }
            containerStyles={{paddingBottom: 40, paddingTop: 20}}
            buttonStyles={styles.mainButton}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
