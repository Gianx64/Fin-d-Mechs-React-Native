import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "./GlobalProvider";
import { CustomButton, FormField } from "../components";
import { icons, styles } from "../constants";
import { getCities } from "../api/apiAppointments";
import { Dropdown } from "react-native-element-dropdown";
import { createWorkshop } from "../api/apiWorkshops";

export default () => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id_usuario: user?.id,
    nombre: "",
    ciudad: "",
    direccion: "",
    ubicacion: null,
    detalles: ""
  });

  const submit = async () => {
    try {
      if (form.nombre === "" ||
        form.ciudad === "" ||
        form.direccion === "")
        throw new Error("Por favor llene todos los campos.");
      setSubmitting(true);
      await createWorkshop(form).then(response => {
        if (response)
          router.back();
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  //Dropdown de ciudades
  const [dropdownCities, setDropdownCities] = useState("Seleccionar item");
  const [isCitiesFocus, setIsCitiesFocus] = useState(false);
  const [citiesList, setCitiesList] = useState([]);

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
  useEffect(() => {
    fetchFormData()
  }, []);

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
          Registrar taller
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
          title="Descripción"
          value={form.detalles}
          handleChangeText={(e) => setForm({ ...form, detalles: e })}
          maxLength={128}
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
};
