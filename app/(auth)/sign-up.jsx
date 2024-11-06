import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { CheckBox } from "react-native-btr";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../../components";
import { colors, images, styles } from "../../constants";
import { createUser } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    mech: false,
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        const result = await createUser(form.username, form.phone, form.email, form.password, form.mech);
        if (result) {
          setUser({ usuario: form.username, celular: form.phone, correo: form.email, ...result.data.user});
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
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            maxLength={64}
          />

          <FormField
            title="Celular"
            value={form.phone}
            handleChangeText={(e) => setForm({ ...form, phone: e })}
            inputmode="tel"
            keyboardType="phone-pad"
            maxLength={16}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e.toLowerCase() })}
            keyboardType="email-address"
            maxLength={64}
          />

          <FormField
            title="Contraseña"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            maxLength={64}
          />

          <View style={{flexDirection: "row", alignSelf: "center", paddingBottom: 16}}>
            <Text style={[styles.normalText, {paddingRight: 16}]}>¿Eres un mecánico?</Text>
            <View style={{alignSelf: "center"}}>
              <CheckBox
                checked={form.mech}
                color={colors.primary.DEFAULT}
                borderRadius={10}
                borderWidth={5}
                onPress={() => setForm({ ...form, mech: !form.mech })}
              />
            </View>
          </View>

          <CustomButton
            title="Registrarse"
            handlePress={submit}
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

export default SignUp;
