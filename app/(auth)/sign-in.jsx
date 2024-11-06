import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../../components";
import { images, styles } from "../../constants";
import { signIn } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    correo: "",
    clave: "",
  });

  const submit = async () => {
    if (form.correo === "" || form.clave === "") {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        let result = await signIn(form.correo, form.clave);
        if (result) {
          delete result.data["token"];
          setUser(result.data);
          setIsLogged(true);
          router.replace("/home");
        }
      } catch (error) {
        Alert.alert("Error de cliente", error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-2"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
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
            otherStyles="mt-7"
            keyboardType="email-address"
            maxLength={64}
          />

          <FormField
            title="Contraseña"
            value={form.clave}
            handleChangeText={(e) => setForm({ ...form, clave: e })}
            otherStyles={{paddingBottom: 50}}
            maxLength={64}
          />

          <CustomButton
            title="Iniciar Sesión"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View style={{flexDirection:'row', justifyContent:'center', paddingTop: 32}}>
            <Text style={styles.normalText}>
              ¿No tiene una cuenta?{"\t\t\t\t"}
            </Text>
            <Link
              href="/sign-up"
              style={styles.linkText}
            >
              Registrarse
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;