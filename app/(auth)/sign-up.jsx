import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { CheckBox } from "react-native-btr";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../../components";
import { colors, icons, styles } from "../../constants";
import { signUp } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";

export default () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    celular: "+ 56 9 ",
    correo: "",
    clave: "",
    confirmar: "",
    rol: false
  });

  const submit = async () => {
    try {
      if (form.nombre === "" || form.celular === "" || form.correo === "" || form.clave === "" || form.confirmar === "")
        throw new Error("Por favor llene todos los campos.");
      if (form.clave !== form.confirmar)
        throw new Error("Las contraseñas no coinciden.");
      setSubmitting(true);
      await signUp(form).then(response => {
        if (response) {
          setUser({...response, nombre: form.nombre, celular: form.celular, correo: form.correo});
          setIsLogged(true);
          router.replace("/profile");
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
      <ScrollView style={{paddingTop: 20}}>
        <Image
          source={icons.logo}
          style={[styles.welcomeLogo]}
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
          title="Correo Electrónico"
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
        <FormField
          title="Confirmar Contraseña"
          value={form.confirmar}
          handleChangeText={(e) => setForm({ ...form, confirmar: e })}
          showPassword={showPassword}
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
          containerStyles={{paddingBottom: 40}}
          buttonStyles={styles.mainButton}
          isLoading={isSubmitting}
        />
      </ScrollView>
      <View style={{flexDirection: "row", justifyContent: "center"}}>
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
    </SafeAreaView>
  );
};
