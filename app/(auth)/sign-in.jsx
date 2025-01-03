import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../GlobalProvider";
import { CustomButton, FormField } from "../../components";
import { icons, styles } from "../../constants";
import { signIn } from "../../api/apiUsers";

export default () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    correo: "",
    clave: "",
  });

  const submit = async () => {
    try {
      if (form.correo === "" || form.clave === "")
        throw new Error("Por favor llene todos los campos");
      if (form.correo.indexOf('@') === -1 || form.correo.indexOf('.') === -1)
        throw new Error("Correo inválido");
      setSubmitting(true);
      await signIn(form.correo, form.clave).then(response => {
        if (response) {
          delete response["token"];
          setUser(response);
          setIsLogged(true);
          router.replace("/home");
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
        <View style={{justifyContent: "center"}}>
          <Image
            source={icons.logo}
            style={styles.welcomeLogo}
            resizeMode="contain"
          />
          <Text style={styles.titleText}>
            Iniciar sesión en Fin-d-Mechs
          </Text>
          <FormField
            title="Correo"
            value={form.correo}
            handleChangeText={(e) => setForm({ ...form, correo: e.toLowerCase() })}
            keyboardType="email-address"
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
          <CustomButton
            title="Iniciar Sesión"
            handlePress={submit}
            containerStyles={{paddingTop: 20, paddingBottom: 40}}
            buttonStyles={styles.mainButton}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <View style={{flexDirection: "row", justifyContent: "center"}}>
        <Text style={[styles.normalText, {paddingRight: 32}]}>
          ¿No tiene una cuenta?
        </Text>
        <Link
          href="/sign-up"
          style={styles.linkText}
        >
          Registrarse
        </Link>
      </View>
    </SafeAreaView>
  );
};
