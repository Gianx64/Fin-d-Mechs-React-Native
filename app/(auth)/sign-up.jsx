import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { CheckBox } from "react-native-btr";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../../components";
import { colors, images, styles } from "../../constants";
import { signUp } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";

export default () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    celular: "",
    correo: "",
    clave: "",
    rol: false
  });

  const submit = async () => {
    if (form.nombre === "" || form.correo === "" || form.clave === "") {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        const result = await signUp(form);
        if (result) {
          setUser({id: result.id, nombre: form.nombre, celular: form.celular, correo: form.correo, rol: result.rol});
          setIsLogged(true);
          router.replace("/home");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{justifyContent: "center", height: Dimensions.get("window").height-20}}>
          <Image
            source={images.logo}
            style={[styles.tinyLogo, {alignSelf: "center"}]}
            resizeMode="contain"
          />

          <Text style={styles.titleText}>
            Registrarse en Fin-d-Mechs
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
            title="Email"
            value={form.correo}
            handleChangeText={(e) => setForm({ ...form, correo: e.toLowerCase() })}
            keyboardType="email-address"
            maxLength={64}
          />

          <FormField
            title="Contraseña"
            value={form.clave}
            handleChangeText={(e) => setForm({ ...form, clave: e })}
            maxLength={64}
          />

          <View style={{flexDirection: "row", alignSelf: "center", paddingBottom: 16}}>
            <Text style={[styles.normalText, {paddingRight: 16}]}>¿Eres un mecánico?</Text>
            <View style={{alignSelf: "center"}}>
              <CheckBox
                checked={form.rol}
                color={colors.primary.DEFAULT}
                borderRadius={10}
                borderWidth={5}
                onPress={() => setForm({ ...form, rol: !form.rol })}
              />
            </View>
          </View>

          <CustomButton
            title="Registrarse"
            handlePress={submit}
            buttonStyles={styles.mainButton}
            isLoading={isSubmitting}
          />

          <View style={{flexDirection: "row", justifyContent: "center", paddingTop: 32}}>
            <Text style={[styles.normalText, {paddingRight: 32}]}>
              ¿Ya tiene una cuenta?
            </Text>
            <Link
              href="/sign-in"
              style={styles.linkText}
            >
              Iniciar sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
