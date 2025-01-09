import { router } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "./GlobalProvider";
import { CustomButton, FormField } from "../components";
import { icons, styles } from "../constants";
import { signOut, updateUser } from "../api/apiUsers";
import { Dropdown } from "react-native-element-dropdown";
import { getCities } from "../api/apiAppointments";

export default () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id: user.id,
    nombre: user.nombre,
    celular: user.celular,
    correo: user.correo,
    ciudad: user.ciudad || "",
    direccion: user.direccion || "",
    clave: "",
    confirmar: ""
  });

  //Dropdown de ciudades
  const [dropdownCities, setDropdownCities] = useState(form.ciudad === "" ? "Seleccionar item" : form.ciudad);
  const [isCitiesFocus, setIsCitiesFocus] = useState(false);
  const [citiesList, setCitiesList] = useState(getCities);
  const submit = async () => {
    try {
      if (form.nombre === "" || form.celular === "" || form.correo === "")
        throw new Error("Por favor llene todos los campos.");
      if (form.clave !== form.confirmar)
        throw new Error("Las contraseñas no coinciden.");
      if (form.clave.length < 8)
        throw new Error("La contraseña debe tener un mínimo de 8 caracteres.");
      setSubmitting(true);
      await updateUser(form, user?.correo).then(response => {
        if (response) {
          if (user.correo !== form.correo) {
            signOut();
            setUser(null);
            setIsLogged(false);
            router.replace("/index");
          }
          setUser({...user,
            nombre: form.nombre,
            celular: form.celular,
            correo: form.correo,
            ciudad: form.ciudad,
            direccion: form.direccion
          });
          router.back();
        }
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{paddingVertical: 20}}>
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
          Actualizar usuario
        </Text>
        <FormField
          title="Nombre de usuario"
          value={form.nombre}
          handleChangeText={(e) => setForm({ ...form, nombre: e })}
          maxLength={64}
        />
        <FormField
          title="Celular"
          value={form.celular}
          handleChangeText={(e) => setForm({ ...form, celular: e })}
          inputmode="tel"
          keyboardType="phone-pad"
          maxLength={16}
        />
        <FormField
          title="Correo Electrónico"
          value={form.correo}
          handleChangeText={(e) => setForm({ ...form, correo: e.toLowerCase() })}
          keyboardType="email-address"
          maxLength={64}
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
          title="Contraseña"
          value={form.clave}
          handleChangeText={(e) => setForm({ ...form, clave: e })}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          maxLength={64}
        />
        <FormField
          title="Confirmar Contraseña"
          value={form.confirmar}
          handleChangeText={(e) => setForm({ ...form, confirmar: e })}
          showPassword={showPassword}
          maxLength={64}
        />
        <CustomButton
          title="Actualizar"
          handlePress={submit}
          containerStyles={{paddingBottom: 40, paddingTop: 16}}
          buttonStyles={styles.mainButton}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
